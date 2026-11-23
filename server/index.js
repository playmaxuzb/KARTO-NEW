import express from 'express';
import { randomBytes } from 'node:crypto';
import { existsSync } from 'node:fs';
import { db, now, getSetting, setSetting, nextCounter, audit, hashPin, checkPin } from './db.js';

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '200kb' }));
app.use((req, res, next) => {
  res.set({ 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'same-origin', 'X-Frame-Options': 'SAMEORIGIN' });
  next();
});
const J = (v) => (v == null ? null : JSON.parse(v));
const int = (v) => Math.round(Number(v) || 0);

// ---------- tiny rate limiter ----------
const hits = new Map();
const limit = (key, max, windowMs) => (req, res, next) => {
  const k = key + ':' + (req.headers['x-forwarded-for'] || req.socket.remoteAddress);
  const t = Date.now(); const h = (hits.get(k) || []).filter((x) => t - x < windowMs); h.push(t); hits.set(k, h);
  if (h.length > max) return res.status(429).json({ error: 'Too many requests, please wait a moment.' });
  next();
};

// ---------- live events (SSE) ----------
const clients = new Set();
app.get('/api/events', (req, res) => {
  res.set({ 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
  res.flushHeaders(); res.write('retry: 3000\n\n');
  clients.add(res); req.on('close', () => clients.delete(res));
});
const emit = (ev) => { const s = 'data: ' + JSON.stringify(ev) + '\n\n'; for (const c of clients) c.write(s); };
setInterval(() => { for (const c of clients) c.write(': ping\n\n'); }, 25000);

// ---------- auth ----------
function staffFromReq(req) {
  const tok = (req.headers.authorization || '').replace(/^Bearer /, '');
  if (!tok) return null;
  const s = db.prepare('SELECT s.* FROM sessions x JOIN staff s ON s.id=x.staff_id WHERE x.token=? AND x.expires>? AND s.active=1').get(tok, Date.now());
  return s || null;
}
const RANK = { kitchen: 1, cashier: 2, manager: 3, owner: 4 };
const need = (...roles) => (req, res, next) => {
  const s = staffFromReq(req);
  if (!s) return res.status(401).json({ error: 'Login required' });
  if (!roles.includes(s.role) && !(roles.includes('manager') && s.role === 'owner')) return res.status(403).json({ error: 'Not allowed for your role' });
  req.staff = s; next();
};
app.post('/api/auth/login', limit('login', 10, 60000), (req, res) => {
  const pin = String(req.body.pin || '');
  const list = db.prepare('SELECT * FROM staff WHERE active=1').all();
  const s = list.find((x) => x.pin_hash && checkPin(pin, x.salt, x.pin_hash));
  if (!s) return res.status(401).json({ error: 'Wrong PIN' });
  const token = randomBytes(24).toString('hex');
  db.prepare('INSERT INTO sessions(token,staff_id,expires) VALUES(?,?,?)').run(token, s.id, Date.now() + 14 * 3600e3);
  audit(s.id, 'login', 'staff', s.id);
  res.json({ token, staff: { id: s.id, name: s.name, role: s.role } });
});
app.get('/api/auth/me', need('kitchen', 'cashier', 'manager', 'owner'), (req, res) => res.json({ id: req.staff.id, name: req.staff.name, role: req.staff.role }));
app.post('/api/auth/logout', (req, res) => { db.prepare('DELETE FROM sessions WHERE token=?').run((req.headers.authorization || '').replace(/^Bearer /, '')); res.json({ ok: true }); });

// ---------- public ----------
app.get('/api/menu', (req, res) => res.json(getSetting('menu')));
app.get('/api/status', (req, res) => res.json({ maintenance: getSetting('maintenance'), branch: getSetting('branch') }));

function priceItem(it, menu) {
  const size = menu.sizes.find((s) => s.id === it.size && s.available !== false);
  if (!size) throw new Error('Size not available');
  if (!menu.packaging.find((p) => p.id === it.packaging && p.available !== false)) throw new Error('Packaging not available');
  const seas = [...new Set(it.seasonings || [])];
  const maxSeasonings = size.maxSeasonings || menu.maxSeasonings || 3;
  if (seas.length < 1 || seas.length > maxSeasonings) throw new Error('Choose 1 to ' + maxSeasonings + ' seasonings');
  for (const id of seas) if (!menu.seasonings.find((s) => s.id === id && s.available !== false)) throw new Error('Seasoning not available: ' + id);
  const qty = Math.min(50, Math.max(1, int(it.qty) || 1));
  let unit = size.price;
  const pick = (obj, list, kind) => {
    const out = {};
    for (const [id, q] of Object.entries(obj || {})) {
      const n = Math.min(20, Math.max(0, int(q))); if (!n) continue;
      const x = list.find((y) => y.id === id && y.available !== false); if (!x) throw new Error(kind + ' not available: ' + id);
      out[id] = n; unit += x.price * n;
    }
    return out;
  };
  const sauces = pick(it.sauces, menu.sauces, 'Sauce'); const drinks = pick(it.drinks, menu.drinks, 'Drink');
  return { size: size.id, grams: size.grams, packaging: it.packaging, seasonings: seas, sauces, drinks, qty, unit, total: unit * qty };
}

function createOrder({ channel, mode, payment, customer, items, discount = 0, cashReceived, staffId, status = 'received', note }) {
  const menu = getSetting('menu'); const m = getSetting('maintenance');
  if (channel === 'app' && (m.enabled || m.ordering === false)) throw new Error('Online ordering is paused right now');
  if (channel === 'app' && mode === 'delivery' && m.delivery === false) throw new Error('Delivery is paused right now');
  if (!Array.isArray(items) || !items.length || items.length > 30) throw new Error('Cart is empty');
  if (!['pickup', 'delivery', 'dine'].includes(mode)) throw new Error('Invalid service mode');
  if (!['cash', 'card', 'online'].includes(payment)) throw new Error('Invalid payment method');
  const priced = items.map((i) => priceItem(i, menu));
  const subtotal = priced.reduce((a, i) => a + i.total, 0);
  const fee = mode === 'delivery' ? int(menu.deliveryFee) : 0;
  const disc = Math.min(subtotal, Math.max(0, int(discount)));
  const total = subtotal - disc + fee;
  const c = { name: String(customer?.name || '').slice(0, 80), phone: String(customer?.phone || '').slice(0, 30), address: String(customer?.address || '').slice(0, 200), note: String(customer?.note || note || '').slice(0, 300) };
  if (channel === 'app') {
    if (!c.name.trim() || !/^[+\d][\d\s-]{7,}$/.test(c.phone.trim())) throw new Error('Name and phone are required');
    if (mode === 'delivery' && !c.address.trim()) throw new Error('Delivery address is required');
  }
  let change = null, received = null;
  if (payment === 'cash' && cashReceived != null) { received = int(cashReceived); if (received < total) throw new Error('Cash received is less than the total'); change = received - total; }
  let customerId = null;
  if (c.phone) {
    db.prepare('INSERT INTO customers(name,phone,address,created_at) VALUES(?,?,?,?) ON CONFLICT(phone) DO UPDATE SET name=excluded.name, address=COALESCE(NULLIF(excluded.address,\'\'),customers.address)').run(c.name, c.phone, c.address, now());
    customerId = db.prepare('SELECT id FROM customers WHERE phone=?').get(c.phone).id;
  }
  const seq = nextCounter('invoice'); const number = ((seq - 1) % 999) + 1;
  const invoiceNo = 'KARTO-' + String(seq).padStart(6, '0');
  const ref = 'K' + Date.now().toString(36).toUpperCase().slice(-5) + randomBytes(2).toString('hex').toUpperCase();
  const key = randomBytes(12).toString('hex');
  const active = db.prepare("SELECT COUNT(*) n FROM orders WHERE status IN ('received','confirmed','preparing')").get().n;
  const eta = 6 + active * 2 + (mode === 'delivery' ? 25 : 0);
  const paymentStatus = payment === 'cash' ? (received != null ? 'paid' : 'unpaid') : channel === 'pos' ? 'paid' : 'pending';
  const t = now();
  const r = db.prepare(`INSERT INTO orders(ref,number,invoice_no,access_key,channel,mode,status,payment,payment_status,customer_id,customer,items,subtotal,discount,delivery_fee,total,cash_received,change_due,note,eta_min,staff_id,created_at,updated_at)
    VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(ref, number, invoiceNo, key, channel, mode, status, payment, paymentStatus, customerId, JSON.stringify(c), JSON.stringify(priced),
    subtotal, disc, fee, total, received, change, c.note, eta, staffId ?? null, t, t);
  db.prepare('INSERT INTO order_events(order_id,status,staff_id,at) VALUES(?,?,?,?)').run(r.lastInsertRowid, status, staffId ?? null, t);
  audit(staffId, 'create', 'order', invoiceNo, null, { total, channel });
  emit({ type: 'order', ref, number, status, isNew: true });
  return db.prepare('SELECT * FROM orders WHERE id=?').get(r.lastInsertRowid);
}

const publicOrder = (o) => ({ ref: o.ref, number: o.number, invoiceNo: o.invoice_no, channel: o.channel, mode: o.mode, status: o.status, payment: o.payment, paymentStatus: o.payment_status,
  customer: J(o.customer), items: J(o.items), subtotal: o.subtotal, discount: o.discount, deliveryFee: o.delivery_fee, total: o.total, cashReceived: o.cash_received, change: o.change_due,
  etaMin: o.eta_min, createdAt: o.created_at, updatedAt: o.updated_at, id: o.id, voidReason: o.void_reason });

app.post('/api/orders', limit('order', 8, 60000), (req, res) => {
  try {
    const o = createOrder({ ...req.body, channel: 'app', mode: req.body.mode, cashReceived: null });
    res.status(201).json({ ...publicOrder(o), accessKey: o.access_key });
  } catch (e) { res.status(400).json({ error: e.message }); }
});
app.get('/api/orders/:ref', (req, res) => {
  const o = db.prepare('SELECT * FROM orders WHERE ref=?').get(req.params.ref);
  if (!o || (o.access_key !== req.query.k && !staffFromReq(req))) return res.status(404).json({ error: 'Order not found' });
  res.json(publicOrder(o));
});
app.post('/api/orders/:ref/ticket', limit('ticket', 5, 60000), (req, res) => {
  const o = db.prepare('SELECT * FROM orders WHERE ref=?').get(req.params.ref);
  if (!o || o.access_key !== req.query.k) return res.status(404).json({ error: 'Order not found' });
  db.prepare('INSERT INTO tickets(order_ref,category,description,status,created_at) VALUES(?,?,?,?,?)').run(o.ref, String(req.body.category || 'other').slice(0, 40), String(req.body.description || '').slice(0, 1000), 'open', now());
  res.status(201).json({ ok: true });
});
// TV board: numbers only, no personal data
app.get('/api/board', (req, res) => {
  const rows = db.prepare("SELECT number,status,mode FROM orders WHERE status IN ('received','confirmed','preparing','ready') AND created_at > ? ORDER BY id").all(new Date(Date.now() - 6 * 3600e3).toISOString());
  res.json({ preparing: rows.filter((r) => r.status !== 'ready').map((r) => r.number), ready: rows.filter((r) => r.status === 'ready').map((r) => r.number) });
});

// ---------- staff: POS & KDS ----------
const STATUSES = ['received', 'confirmed', 'preparing', 'ready', 'out', 'completed', 'cancelled', 'refunded'];
app.get('/api/staff/orders', need('kitchen', 'cashier', 'manager'), (req, res) => {
  const scope = req.query.scope || 'active';
  const rows = scope === 'active'
    ? db.prepare("SELECT * FROM orders WHERE status IN ('received','confirmed','preparing','ready','out') ORDER BY id").all()
    : db.prepare('SELECT * FROM orders WHERE created_at >= ? ORDER BY id DESC LIMIT 300').all(new Date(Date.now() - 24 * 3600e3).toISOString());
  res.json(rows.map(publicOrder));
});
app.post('/api/pos/orders', need('cashier', 'manager'), (req, res) => {
  try {
    const disc = int(req.body.discount);
    if (disc > 0 && !['manager', 'owner'].includes(req.staff.role) && disc > 5000) throw new Error('Discounts above 5 000 need a manager');
    const o = createOrder({ ...req.body, channel: 'pos', staffId: req.staff.id, status: 'confirmed' });
    res.status(201).json(publicOrder(o));
  } catch (e) { res.status(400).json({ error: e.message }); }
});

function deductStock(o, staffId) {
  const rec = getSetting('recipes'); const inv = Object.fromEntries(db.prepare('SELECT * FROM inventory').all().map((r) => [r.id, r]));
  const moves = {};
  const add = (id, q) => { if (inv[id]) moves[id] = (moves[id] || 0) + q; };
  for (const it of J(o.items)) {
    const q = it.qty || 1; const sz = rec.size[it.size] || {};
    for (const [id, v] of Object.entries(sz)) add(id, v * q);
    for (const s of it.seasonings) add('season_' + s, rec.seasoning_g * q);
    add(rec.packaging[it.packaging], q); add('napkin', q);
    for (const [id, n] of Object.entries(it.sauces || {})) add('sauce_' + id, n * q);
    for (const [id, n] of Object.entries(it.drinks || {})) add('drink_' + id, n * q);
  }
  let cogs = 0; const t = now();
  for (const [id, q] of Object.entries(moves)) {
    const cost = q * inv[id].unit_cost; cogs += cost;
    db.prepare('UPDATE inventory SET qty=qty-? WHERE id=?').run(q, id);
    db.prepare('INSERT INTO stock_moves(item_id,delta,reason,ref,cost,staff_id,at) VALUES(?,?,?,?,?,?,?)').run(id, -q, 'sale', o.invoice_no, cost, staffId, t);
  }
  db.prepare('UPDATE orders SET cogs=? WHERE id=?').run(Math.round(cogs), o.id);
}

app.patch('/api/staff/orders/:id', need('kitchen', 'cashier', 'manager'), (req, res) => {
  const o = db.prepare('SELECT * FROM orders WHERE id=?').get(req.params.id);
  if (!o) return res.status(404).json({ error: 'Not found' });
  const { status, paymentStatus, reason } = req.body;
  if (status && !STATUSES.includes(status)) return res.status(400).json({ error: 'Bad status' });
  if (['cancelled', 'refunded'].includes(status)) {
    if (!['manager', 'owner'].includes(req.staff.role)) return res.status(403).json({ error: 'Manager approval needed' });
    if (!reason) return res.status(400).json({ error: 'Reason required' });
  }
  if (o.status === 'completed' && status && !['refunded'].includes(status)) return res.status(400).json({ error: 'Completed orders can only be refunded' });
  const t = now();
  if (status) {
    db.prepare('UPDATE orders SET status=?, updated_at=?, void_reason=COALESCE(?,void_reason) WHERE id=?').run(status, t, reason || null, o.id);
    db.prepare('INSERT INTO order_events(order_id,status,staff_id,note,at) VALUES(?,?,?,?,?)').run(o.id, status, req.staff.id, reason || null, t);
    if (status === 'completed' && o.status !== 'completed') {
      deductStock(o, req.staff.id);
      if (o.customer_id) db.prepare('UPDATE customers SET points=points+? WHERE id=?').run(Math.floor(o.total / 10000), o.customer_id);
    }
    if (status === 'refunded') db.prepare("UPDATE orders SET payment_status='refunded' WHERE id=?").run(o.id);
  }
  if (paymentStatus && ['paid', 'unpaid', 'pending'].includes(paymentStatus)) db.prepare('UPDATE orders SET payment_status=?, updated_at=? WHERE id=?').run(paymentStatus, t, o.id);
  audit(req.staff.id, 'update', 'order', o.invoice_no, { status: o.status, payment: o.payment_status }, req.body);
  emit({ type: 'order', ref: o.ref, number: o.number, status: status || o.status });
  res.json(publicOrder(db.prepare('SELECT * FROM orders WHERE id=?').get(o.id)));
});

// shifts & cash reconciliation
app.get('/api/staff/shift', need('cashier', 'manager'), (req, res) => {
  const s = db.prepare('SELECT * FROM shifts WHERE closed_at IS NULL ORDER BY id DESC').get();
  if (!s) return res.json(null);
  const cash = db.prepare("SELECT COALESCE(SUM(total),0) v FROM orders WHERE payment='cash' AND payment_status='paid' AND status NOT IN ('cancelled','refunded') AND created_at>=?").get(s.opened_at).v;
  res.json({ ...s, expected_cash: s.opening_cash + cash });
});
app.post('/api/staff/shift/open', need('cashier', 'manager'), (req, res) => {
  if (db.prepare('SELECT id FROM shifts WHERE closed_at IS NULL').get()) return res.status(400).json({ error: 'A shift is already open' });
  db.prepare('INSERT INTO shifts(staff_id,opened_at,opening_cash) VALUES(?,?,?)').run(req.staff.id, now(), int(req.body.openingCash));
  audit(req.staff.id, 'open', 'shift', '', null, req.body); res.json({ ok: true });
});
app.post('/api/staff/shift/close', need('cashier', 'manager'), (req, res) => {
  const s = db.prepare('SELECT * FROM shifts WHERE closed_at IS NULL').get();
  if (!s) return res.status(400).json({ error: 'No open shift' });
  const cash = db.prepare("SELECT COALESCE(SUM(total),0) v FROM orders WHERE payment='cash' AND payment_status='paid' AND status NOT IN ('cancelled','refunded') AND created_at>=?").get(s.opened_at).v;
  const expected = s.opening_cash + cash; const counted = int(req.body.countedCash);
  db.prepare('UPDATE shifts SET closed_at=?, counted_cash=?, expected_cash=?, note=? WHERE id=?').run(now(), counted, expected, String(req.body.note || ''), s.id);
  audit(req.staff.id, 'close', 'shift', s.id, null, { expected, counted }); res.json({ expected, counted, diff: counted - expected });
});

// ---------- admin ----------
app.put('/api/admin/menu', need('manager'), (req, res) => {
  const m = req.body; const before = getSetting('menu');
  if (!m || !Array.isArray(m.sizes) || !Array.isArray(m.seasonings)) return res.status(400).json({ error: 'Invalid menu' });
  setSetting('menu', m); audit(req.staff.id, 'update', 'menu', 'menu', before, m); emit({ type: 'menu' }); res.json(m);
});
app.get('/api/admin/settings', need('manager'), (req, res) => res.json({ maintenance: getSetting('maintenance'), branch: getSetting('branch'), recipes: getSetting('recipes') }));
app.put('/api/admin/settings', need('manager'), (req, res) => {
  for (const k of ['maintenance', 'branch', 'recipes']) if (req.body[k]) { audit(req.staff.id, 'update', 'setting', k, getSetting(k), req.body[k]); setSetting(k, req.body[k]); }
  emit({ type: 'status' }); res.json({ ok: true });
});
app.get('/api/admin/orders', need('manager'), (req, res) => {
  const q = '%' + String(req.query.q || '') + '%';
  const from = req.query.from || '1970-01-01'; const to = req.query.to || '2999-01-01';
  const rows = db.prepare(`SELECT * FROM orders WHERE (invoice_no LIKE ? OR ref LIKE ? OR customer LIKE ? OR CAST(number AS TEXT) LIKE ?) AND created_at>=? AND created_at<? ORDER BY id DESC LIMIT 500`).all(q, q, q, q, from, to + 'T99');
  res.json(rows.map(publicOrder));
});
app.get('/api/admin/orders/:id/history', need('manager'), (req, res) => {
  res.json({ events: db.prepare('SELECT e.*, s.name staff FROM order_events e LEFT JOIN staff s ON s.id=e.staff_id WHERE order_id=? ORDER BY e.id').all(req.params.id) });
});
app.get('/api/admin/inventory', need('manager'), (req, res) => res.json(db.prepare('SELECT * FROM inventory ORDER BY id').all()));
app.post('/api/admin/inventory/move', need('manager'), (req, res) => {
  const { itemId, delta, reason, unitCost } = req.body; const it = db.prepare('SELECT * FROM inventory WHERE id=?').get(itemId);
  if (!it) return res.status(404).json({ error: 'Item not found' });
  const d = Number(delta); if (!d) return res.status(400).json({ error: 'Quantity required' });
  if (!['purchase', 'waste', 'count', 'adjust', 'return'].includes(reason)) return res.status(400).json({ error: 'Reason required' });
  if (reason === 'purchase' && unitCost) db.prepare('UPDATE inventory SET unit_cost=? WHERE id=?').run(Number(unitCost), itemId);
  db.prepare('UPDATE inventory SET qty=qty+? WHERE id=?').run(d, itemId);
  db.prepare('INSERT INTO stock_moves(item_id,delta,reason,ref,cost,staff_id,at) VALUES(?,?,?,?,?,?,?)').run(itemId, d, reason, String(req.body.note || ''), Math.abs(d) * (unitCost || it.unit_cost), req.staff.id, now());
  audit(req.staff.id, reason, 'inventory', itemId, { qty: it.qty }, { delta: d }); res.json({ ok: true });
});
app.put('/api/admin/inventory/:id', need('manager'), (req, res) => {
  const { name, unit, reorder, unit_cost } = req.body;
  db.prepare('INSERT INTO inventory(id,name,unit,qty,reorder,unit_cost) VALUES(?,?,?,0,?,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name, unit=excluded.unit, reorder=excluded.reorder, unit_cost=excluded.unit_cost')
    .run(req.params.id, name, unit, Number(reorder) || 0, Number(unit_cost) || 0);
  audit(req.staff.id, 'update', 'inventory', req.params.id, null, req.body); res.json({ ok: true });
});
app.get('/api/admin/expenses', need('manager'), (req, res) => res.json(db.prepare('SELECT * FROM expenses ORDER BY date DESC, id DESC LIMIT 500').all()));
app.post('/api/admin/expenses', need('manager'), (req, res) => {
  const { date, category, amount, note } = req.body;
  if (!date || !category || !(int(amount) > 0)) return res.status(400).json({ error: 'Date, category and amount are required' });
  db.prepare('INSERT INTO expenses(date,category,amount,note,staff_id,created_at) VALUES(?,?,?,?,?,?)').run(date, category, int(amount), String(note || ''), req.staff.id, now());
  audit(req.staff.id, 'create', 'expense', '', null, req.body); res.json({ ok: true });
});
app.get('/api/admin/staff', need('owner'), (req, res) => res.json(db.prepare('SELECT id,name,role,active,monthly_salary,phone,created_at FROM staff').all()));
app.post('/api/admin/staff', need('owner'), (req, res) => {
  const { id, name, role, pin, monthly_salary, active, phone } = req.body;
  if (!RANK[role]) return res.status(400).json({ error: 'Invalid role' });
  if (pin && !/^\d{4,8}$/.test(pin)) return res.status(400).json({ error: 'PIN must be 4–8 digits' });
  if (id) {
    db.prepare('UPDATE staff SET name=?, role=?, monthly_salary=?, active=?, phone=? WHERE id=?').run(name, role, int(monthly_salary), active ? 1 : 0, phone || '', id);
    if (pin) { const h = hashPin(pin); db.prepare('UPDATE staff SET salt=?, pin_hash=? WHERE id=?').run(h.salt, h.hash, id); }
  } else {
    if (!pin) return res.status(400).json({ error: 'PIN required' });
    const h = hashPin(pin); db.prepare('INSERT INTO staff(name,role,salt,pin_hash,monthly_salary,phone,created_at) VALUES(?,?,?,?,?,?,?)').run(name, role, h.salt, h.hash, int(monthly_salary), phone || '', now());
  }
  audit(req.staff.id, id ? 'update' : 'create', 'staff', id || name, null, { name, role, monthly_salary }); res.json({ ok: true });
});
app.get('/api/admin/audit', need('owner'), (req, res) => res.json(db.prepare('SELECT a.*, s.name staff FROM audit a LEFT JOIN staff s ON s.id=a.staff_id ORDER BY a.id DESC LIMIT 300').all()));

// Reports — accounting definitions documented in README
app.get('/api/admin/report', need('manager'), (req, res) => {
  const from = req.query.from || new Date().toISOString().slice(0, 10); const to = req.query.to || from;
  const days = Math.max(1, Math.round((new Date(to) - new Date(from)) / 864e5) + 1);
  const all = db.prepare('SELECT * FROM orders WHERE created_at>=? AND created_at<?').all(from, to + 'T99');
  const valid = all.filter((o) => !['cancelled', 'refunded'].includes(o.status));
  const sum = (a, f) => a.reduce((x, o) => x + f(o), 0);
  const gross = sum(valid, (o) => o.subtotal + o.delivery_fee); const discounts = sum(valid, (o) => o.discount);
  const refunds = sum(all.filter((o) => o.status === 'refunded'), (o) => o.total);
  const net = gross - discounts; const cogs = sum(valid, (o) => o.cogs);
  const expenses = db.prepare('SELECT category, SUM(amount) v FROM expenses WHERE date>=? AND date<=? GROUP BY category').all(from, to);
  const opex = expenses.reduce((a, e) => a + e.v, 0);
  // payroll accrued per day of period (monthly salary / 30 × days) — never the full month for a single day
  const payroll = Math.round(db.prepare('SELECT COALESCE(SUM(monthly_salary),0) v FROM staff WHERE active=1').get().v / 30 * days);
  const by = (f) => { const m = {}; for (const o of valid) for (const k of f(o)) m[k.k] = (m[k.k] || 0) + k.v; return m; };
  const bySize = by((o) => J(o.items).map((i) => ({ k: i.size, v: i.qty })));
  const bySeason = by((o) => J(o.items).flatMap((i) => i.seasonings.map((s) => ({ k: s, v: i.qty }))));
  const byChannel = by((o) => [{ k: o.channel, v: o.total }]);
  const byPayment = by((o) => [{ k: o.payment, v: o.total }]);
  const byHour = by((o) => [{ k: new Date(o.created_at).getHours(), v: 1 }]);
  const byDay = by((o) => [{ k: o.created_at.slice(0, 10), v: o.total }]);
  const lowStock = db.prepare('SELECT * FROM inventory WHERE qty <= reorder').all();
  res.json({ from, to, days, orders: valid.length, cancelled: all.length - valid.length, gross, discounts, refunds, net, cogs, grossProfit: net - cogs, opex, expenses, payroll,
    netProfit: net - cogs - opex - payroll, aov: valid.length ? Math.round(net / valid.length) : 0, bySize, bySeason, byChannel, byPayment, byHour, byDay, lowStock,
    openTickets: db.prepare("SELECT COUNT(*) n FROM tickets WHERE status='open'").get().n });
});

// ---------- static web app ----------
const dist = new URL('../web/dist/', import.meta.url).pathname;
if (existsSync(dist)) {
  app.use(express.static(dist, { maxAge: '7d', index: false, setHeaders: (r, p) => { if (p.endsWith('sw.js') || p.endsWith('.html')) r.setHeader('Cache-Control', 'no-cache'); } }));
  app.get(/^(?!\/api).*/, (req, res) => res.sendFile(dist + 'index.html'));
}
app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, process.env.HOST || '0.0.0.0', () => console.log('KARTO running on http://localhost:' + PORT));
