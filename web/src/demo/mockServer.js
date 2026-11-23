// In-browser copy of the KARTO server, used only by the demo build (no internet server needed).
// Same rules as server/index.js: server-side pricing, roles, invoices, stock deduction, reports.
import { DEFAULT_MENU, BRANCH } from '../data.js';

const KEY = 'karto-demo-db-v1';
const nowISO = () => new Date().toISOString();
const int = (v) => Math.round(Number(v) || 0);
const rid = (n = 8) => Array.from(crypto.getRandomValues(new Uint8Array(n)), (b) => b.toString(16).padStart(2, '0')).join('');
let mem = null;

function seed() {
  const inv = [['potato_kg', 'Frozen fries', 'kg', 100, 30, 30000], ['oil_l', 'Frying oil', 'L', 60, 20, 22000]];
  for (const s of DEFAULT_MENU.seasonings) inv.push(['season_' + s.id, 'Seasoning: ' + s.name.en, 'g', 2000, 500, 60]);
  for (const s of DEFAULT_MENU.sauces) inv.push(['sauce_' + s.id, 'Sauce cup: ' + s.name.en, 'pcs', 300, 80, 1200]);
  for (const s of DEFAULT_MENU.drinks) inv.push(['drink_' + s.id, 'Drink: ' + s.name.en, 'pcs', 96, 24, s.price * 0.55]);
  inv.push(['pack_bowl', 'Packaging: bowl', 'pcs', 500, 150, 1500], ['pack_tray', 'Packaging: tray', 'pcs', 500, 150, 1400], ['pack_cone', 'Packaging: cone', 'pcs', 500, 150, 900], ['napkin', 'Napkins & forks', 'set', 1000, 200, 250]);
  return {
    menu: { ...DEFAULT_MENU, deliveryFee: 12000 }, branch: BRANCH,
    maintenance: { enabled: false, ordering: true, delivery: true, message: { uz: '', ru: '', en: '' }, returnAt: '' },
    recipes: { size: { s: { potato_kg: 0.115, oil_l: 0.012 }, m: { potato_kg: 0.17, oil_l: 0.018 }, l: { potato_kg: 0.23, oil_l: 0.024 } }, seasoning_g: 4, packaging: { bowl: 'pack_bowl', tray: 'pack_tray', cone: 'pack_cone' } },
    staff: [[1, 'Owner', 'owner', '1111', 0], [2, 'Manager', 'manager', '2222', 7000000], [3, 'Cashier', 'cashier', '3333', 5500000], [4, 'Kitchen', 'kitchen', '4444', 5500000]]
      .map(([id, name, role, pin, monthly_salary]) => ({ id, name, role, pin, monthly_salary, active: 1, phone: '', created_at: nowISO() })),
    sessions: {}, customers: [], orders: [], events: [], inventory: inv.map(([id, name, unit, qty, reorder, unit_cost]) => ({ id, name, unit, qty, reorder, unit_cost })),
    moves: [], expenses: [], shifts: [], audit: [], counters: { invoice: 0, id: 0 },
  };
}
function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const db = JSON.parse(raw);
      const defaults = DEFAULT_MENU;
      db.menu = { ...defaults, ...(db.menu || {}) };
      db.menu.sizes = (db.menu.sizes || defaults.sizes).map((item) => {
        const fresh = defaults.sizes.find((x) => x.id === item.id);
        return fresh ? { ...fresh, ...item, name: { ...fresh.name, ...item.name, ar: fresh.name.ar }, price: fresh.price, maxSeasonings: fresh.maxSeasonings, img: fresh.img, package: fresh.package } : item;
      });
      db.menu.packaging = (db.menu.packaging || defaults.packaging).map((item) => {
        const fresh = defaults.packaging.find((x) => x.id === item.id);
        return fresh ? { ...fresh, ...item, img: fresh.img, thumb: fresh.thumb, name: fresh.name, desc: fresh.desc } : item;
      });
      db.menu.combos = [];
      db.menu.extraSeasoningPrice = 0;
      for (const key of ['seasonings', 'sauces', 'drinks']) {
        db.menu[key] = (db.menu[key] || defaults[key]).map((item) => {
          const fresh = defaults[key].find((x) => x.id === item.id);
          return fresh ? { ...fresh, ...item, name: fresh.name } : item;
        });
      }
      db.maintenance = { enabled: false, ordering: true, delivery: true, returnAt: '', ...(db.maintenance || {}), message: { uz: '', ru: '', en: '', ar: '', ...(db.maintenance?.message || {}) } };
      return db;
    }
  } catch {}
  return mem || (mem = seed());
}
function save(db) { mem = db; try { localStorage.setItem(KEY, JSON.stringify(db)); } catch {} }
export function resetDemo() { mem = seed(); save(mem); try { localStorage.removeItem('karto-cart'); localStorage.removeItem('karto-my-orders'); localStorage.removeItem('karto-staff-token'); localStorage.removeItem('karto-staff'); } catch {} }

// ---- live events ----
const listeners = new Set();
let bc = null; try { bc = new BroadcastChannel('karto-demo'); bc.onmessage = (e) => fire(e.data, false); } catch {}
function fire(ev, broadcast = true) { for (const l of listeners) setTimeout(() => l.onmessage && l.onmessage({ data: JSON.stringify(ev) }), 0); if (broadcast && bc) try { bc.postMessage(ev); } catch {} }
class DemoEventSource { constructor() { listeners.add(this); } close() { listeners.delete(this); } }

class HttpError extends Error { constructor(status, msg) { super(msg); this.status = status; } }
const err = (s, m) => { throw new HttpError(s, m); };

function audit(db, staffId, action, entity, entityId, before, after) { db.audit.unshift({ id: db.audit.length + 1, at: nowISO(), staff_id: staffId ?? null, action, entity, entity_id: String(entityId ?? ''), before: before == null ? null : JSON.stringify(before), after: after == null ? null : JSON.stringify(after) }); db.audit.length = Math.min(db.audit.length, 500); }
function staffOf(db, headers) { const t = (headers.authorization || '').replace(/^Bearer /, ''); const s = db.sessions[t]; if (!s || s.expires < Date.now()) return null; return db.staff.find((x) => x.id === s.staff_id && x.active) || null; }
function need(db, headers, ...roles) { const s = staffOf(db, headers); if (!s) err(401, 'Login required'); if (!roles.includes(s.role) && !(roles.includes('manager') && s.role === 'owner')) err(403, 'Not allowed for your role'); return s; }

function priceItem(it, menu) {
  const size = menu.sizes.find((s) => s.id === it.size && s.available !== false); if (!size) err(400, 'Size not available');
  if (!menu.packaging.find((p) => p.id === it.packaging && p.available !== false)) err(400, 'Packaging not available');
  const seas = [...new Set(it.seasonings || [])]; const max = size.maxSeasonings || menu.maxSeasonings || 3;
  if (seas.length < 1 || seas.length > max) err(400, 'Choose 1 to ' + max + ' seasonings');
  for (const id of seas) if (!menu.seasonings.find((s) => s.id === id && s.available !== false)) err(400, 'Seasoning not available: ' + id);
  const qty = Math.min(50, Math.max(1, int(it.qty) || 1));
  let unit = size.price;
  const pick = (obj, list, kind) => { const out = {}; for (const [id, q] of Object.entries(obj || {})) { const n = Math.min(20, Math.max(0, int(q))); if (!n) continue; const x = list.find((y) => y.id === id && y.available !== false); if (!x) err(400, kind + ' not available: ' + id); out[id] = n; unit += x.price * n; } return out; };
  const sauces = pick(it.sauces, menu.sauces, 'Sauce'); const drinks = pick(it.drinks, menu.drinks, 'Drink');
  return { size: size.id, grams: size.grams, packaging: it.packaging, seasonings: seas, sauces, drinks, qty, unit, total: unit * qty };
}
function createOrder(db, { channel, mode, payment, customer, items, discount = 0, cashReceived, staffId, status = 'received' }) {
  const menu = db.menu; const m = db.maintenance;
  if (channel === 'app' && (m.enabled || m.ordering === false)) err(400, 'Online ordering is paused right now');
  if (channel === 'app' && mode === 'delivery' && m.delivery === false) err(400, 'Delivery is paused right now');
  if (!Array.isArray(items) || !items.length) err(400, 'Cart is empty');
  if (!['pickup', 'delivery', 'dine'].includes(mode)) err(400, 'Invalid service mode');
  if (!['cash', 'card', 'online'].includes(payment)) err(400, 'Invalid payment method');
  const priced = items.map((i) => priceItem(i, menu)); const subtotal = priced.reduce((a, i) => a + i.total, 0);
  const fee = mode === 'delivery' ? int(menu.deliveryFee) : 0; const disc = Math.min(subtotal, Math.max(0, int(discount))); const total = subtotal - disc + fee;
  const c = { name: String(customer?.name || ''), phone: String(customer?.phone || ''), address: String(customer?.address || ''), note: String(customer?.note || '') };
  if (channel === 'app') { if (!c.name.trim() || !/^[+\d][\d\s-]{7,}$/.test(c.phone.trim())) err(400, 'Name and phone are required'); if (mode === 'delivery' && !c.address.trim()) err(400, 'Delivery address is required'); }
  let change = null, received = null;
  if (payment === 'cash' && cashReceived != null) { received = int(cashReceived); if (received < total) err(400, 'Cash received is less than the total'); change = received - total; }
  let customerId = null;
  if (c.phone) { let cu = db.customers.find((x) => x.phone === c.phone); if (!cu) { cu = { id: db.customers.length + 1, name: c.name, phone: c.phone, address: c.address, points: 0 }; db.customers.push(cu); } customerId = cu.id; }
  const seq = ++db.counters.invoice; const id = ++db.counters.id; const t = nowISO();
  const active = db.orders.filter((o) => ['received', 'confirmed', 'preparing'].includes(o.status)).length;
  const o = { id, ref: 'K' + Date.now().toString(36).toUpperCase().slice(-5) + rid(2).toUpperCase(), number: ((seq - 1) % 999) + 1, invoice_no: 'KARTO-' + String(seq).padStart(6, '0'), access_key: rid(12),
    channel, mode, status, payment, payment_status: payment === 'cash' ? (received != null ? 'paid' : 'unpaid') : channel === 'pos' ? 'paid' : 'pending', customer_id: customerId, customer: c, items: priced,
    subtotal, discount: disc, delivery_fee: fee, total, cash_received: received, change_due: change, cogs: 0, eta_min: 6 + active * 2 + (mode === 'delivery' ? 25 : 0), staff_id: staffId ?? null, created_at: t, updated_at: t };
  db.orders.push(o); db.events.push({ id: db.events.length + 1, order_id: id, status, staff_id: staffId ?? null, at: t });
  audit(db, staffId, 'create', 'order', o.invoice_no, null, { total, channel });
  return o;
}
const pub = (o) => ({ ref: o.ref, number: o.number, invoiceNo: o.invoice_no, channel: o.channel, mode: o.mode, status: o.status, payment: o.payment, paymentStatus: o.payment_status, customer: o.customer, items: o.items,
  subtotal: o.subtotal, discount: o.discount, deliveryFee: o.delivery_fee, total: o.total, cashReceived: o.cash_received, change: o.change_due, etaMin: o.eta_min, createdAt: o.created_at, updatedAt: o.updated_at, id: o.id, voidReason: o.void_reason });
function deduct(db, o, staffId) {
  const rec = db.recipes; const inv = Object.fromEntries(db.inventory.map((r) => [r.id, r])); const moves = {};
  const add = (id, q) => { if (inv[id]) moves[id] = (moves[id] || 0) + q; };
  for (const it of o.items) { const q = it.qty || 1; for (const [id, v] of Object.entries(rec.size[it.size] || {})) add(id, v * q); for (const s of it.seasonings) add('season_' + s, rec.seasoning_g * q); add(rec.packaging[it.packaging], q); add('napkin', q);
    for (const [id, n] of Object.entries(it.sauces || {})) add('sauce_' + id, n * q); for (const [id, n] of Object.entries(it.drinks || {})) add('drink_' + id, n * q); }
  let cogs = 0; for (const [id, q] of Object.entries(moves)) { const cost = q * inv[id].unit_cost; cogs += cost; inv[id].qty -= q; db.moves.push({ item_id: id, delta: -q, reason: 'sale', ref: o.invoice_no, cost, staff_id: staffId, at: nowISO() }); }
  o.cogs = Math.round(cogs);
}
const cashSince = (db, since) => db.orders.filter((o) => o.payment === 'cash' && o.payment_status === 'paid' && !['cancelled', 'refunded'].includes(o.status) && o.created_at >= since).reduce((a, o) => a + o.total, 0);

function handle(method, path, query, body, headers) {
  const db = load(); let out; const emits = [];
  const p = path.replace(/^\/api/, '');
  let mm;
  if (method === 'GET' && p === '/menu') out = db.menu;
  else if (method === 'GET' && p === '/status') out = { maintenance: db.maintenance, branch: db.branch };
  else if (method === 'POST' && p === '/auth/login') {
    const s = db.staff.find((x) => x.active && x.pin === String(body.pin || '')); if (!s) err(401, 'Wrong PIN');
    const token = rid(24); db.sessions[token] = { staff_id: s.id, expires: Date.now() + 14 * 3600e3 }; audit(db, s.id, 'login', 'staff', s.id);
    out = { token, staff: { id: s.id, name: s.name, role: s.role } };
  } else if (method === 'POST' && p === '/auth/logout') { delete db.sessions[(headers.authorization || '').replace(/^Bearer /, '')]; out = { ok: true }; }
  else if (method === 'POST' && p === '/orders') { const o = createOrder(db, { ...body, channel: 'app', cashReceived: null }); emits.push({ type: 'order', ref: o.ref, number: o.number, status: o.status, isNew: true }); out = { ...pub(o), accessKey: o.access_key }; }
  else if (method === 'GET' && (mm = p.match(/^\/orders\/([^/]+)$/))) { const o = db.orders.find((x) => x.ref === mm[1]); if (!o || (o.access_key !== query.get('k') && !staffOf(db, headers))) err(404, 'Order not found'); out = pub(o); }
  else if (method === 'GET' && p === '/board') { const rows = db.orders.filter((o) => ['received', 'confirmed', 'preparing', 'ready'].includes(o.status)); out = { preparing: rows.filter((r) => r.status !== 'ready').map((r) => r.number), ready: rows.filter((r) => r.status === 'ready').map((r) => r.number) }; }
  else if (method === 'GET' && p === '/staff/orders') { need(db, headers, 'kitchen', 'cashier', 'manager'); out = (query.get('scope') || 'active') === 'active' ? db.orders.filter((o) => ['received', 'confirmed', 'preparing', 'ready', 'out'].includes(o.status)).map(pub) : db.orders.slice(-300).reverse().map(pub); }
  else if (method === 'POST' && p === '/pos/orders') { const s = need(db, headers, 'cashier', 'manager'); const d = int(body.discount); if (d > 5000 && !['manager', 'owner'].includes(s.role)) err(400, 'Discounts above 5 000 need a manager');
    const o = createOrder(db, { ...body, channel: 'pos', staffId: s.id, status: 'confirmed' }); emits.push({ type: 'order', ref: o.ref, number: o.number, status: o.status, isNew: true }); out = pub(o); }
  else if (method === 'PATCH' && (mm = p.match(/^\/staff\/orders\/(\d+)$/))) {
    const s = need(db, headers, 'kitchen', 'cashier', 'manager'); const o = db.orders.find((x) => x.id === +mm[1]); if (!o) err(404, 'Not found');
    const { status, paymentStatus, reason } = body;
    if (['cancelled', 'refunded'].includes(status)) { if (!['manager', 'owner'].includes(s.role)) err(403, 'Manager approval needed'); if (!reason) err(400, 'Reason required'); }
    if (o.status === 'completed' && status && status !== 'refunded') err(400, 'Completed orders can only be refunded');
    const before = { status: o.status, payment: o.payment_status };
    if (status) { const was = o.status; o.status = status; o.updated_at = nowISO(); if (reason) o.void_reason = reason; db.events.push({ id: db.events.length + 1, order_id: o.id, status, staff_id: s.id, note: reason || null, at: nowISO() });
      if (status === 'completed' && was !== 'completed') { deduct(db, o, s.id); const cu = db.customers.find((c) => c.id === o.customer_id); if (cu) cu.points += Math.floor(o.total / 10000); }
      if (status === 'refunded') o.payment_status = 'refunded'; }
    if (paymentStatus && ['paid', 'unpaid', 'pending'].includes(paymentStatus)) o.payment_status = paymentStatus;
    audit(db, s.id, 'update', 'order', o.invoice_no, before, body); emits.push({ type: 'order', ref: o.ref, number: o.number, status: o.status }); out = pub(o);
  } else if (method === 'GET' && p === '/staff/shift') { need(db, headers, 'cashier', 'manager'); const sh = db.shifts.find((x) => !x.closed_at); out = sh ? { ...sh, expected_cash: sh.opening_cash + cashSince(db, sh.opened_at) } : null; }
  else if (method === 'POST' && p === '/staff/shift/open') { const s = need(db, headers, 'cashier', 'manager'); if (db.shifts.find((x) => !x.closed_at)) err(400, 'A shift is already open'); db.shifts.push({ id: db.shifts.length + 1, staff_id: s.id, opened_at: nowISO(), opening_cash: int(body.openingCash) }); out = { ok: true }; }
  else if (method === 'POST' && p === '/staff/shift/close') { const s = need(db, headers, 'cashier', 'manager'); const sh = db.shifts.find((x) => !x.closed_at); if (!sh) err(400, 'No open shift');
    const expected = sh.opening_cash + cashSince(db, sh.opened_at); const counted = int(body.countedCash); Object.assign(sh, { closed_at: nowISO(), counted_cash: counted, expected_cash: expected }); audit(db, s.id, 'close', 'shift', sh.id, null, { expected, counted }); out = { expected, counted, diff: counted - expected }; }
  else if (method === 'PUT' && p === '/admin/menu') { const s = need(db, headers, 'manager'); audit(db, s.id, 'update', 'menu', 'menu', null, { changed: true }); db.menu = body; emits.push({ type: 'menu' }); out = body; }
  else if (method === 'GET' && p === '/admin/settings') { need(db, headers, 'manager'); out = { maintenance: db.maintenance, branch: db.branch, recipes: db.recipes }; }
  else if (method === 'PUT' && p === '/admin/settings') { const s = need(db, headers, 'manager'); for (const k of ['maintenance', 'branch', 'recipes']) if (body[k]) { audit(db, s.id, 'update', 'setting', k, null, body[k]); db[k] = body[k]; } out = { ok: true }; }
  else if (method === 'GET' && p === '/admin/orders') { need(db, headers, 'manager'); const q = (query.get('q') || '').toLowerCase(); out = db.orders.filter((o) => !q || [o.invoice_no, o.ref, String(o.number), o.customer.name, o.customer.phone].join(' ').toLowerCase().includes(q)).slice().reverse().map(pub); }
  else if (method === 'GET' && (mm = p.match(/^\/admin\/orders\/(\d+)\/history$/))) { need(db, headers, 'manager'); out = { events: db.events.filter((e) => e.order_id === +mm[1]).map((e) => ({ ...e, staff: db.staff.find((s) => s.id === e.staff_id)?.name })) }; }
  else if (method === 'GET' && p === '/admin/inventory') { need(db, headers, 'manager'); out = db.inventory; }
  else if (method === 'POST' && p === '/admin/inventory/move') { const s = need(db, headers, 'manager'); const it = db.inventory.find((x) => x.id === body.itemId); if (!it) err(404, 'Item not found'); const d = Number(body.delta); if (!d) err(400, 'Quantity required');
    if (body.reason === 'purchase' && body.unitCost) it.unit_cost = Number(body.unitCost); it.qty += d; db.moves.push({ item_id: it.id, delta: d, reason: body.reason, ref: body.note || '', at: nowISO(), staff_id: s.id }); audit(db, s.id, body.reason, 'inventory', it.id, null, { delta: d }); out = { ok: true }; }
  else if (method === 'GET' && p === '/admin/expenses') { need(db, headers, 'manager'); out = db.expenses.slice().reverse(); }
  else if (method === 'POST' && p === '/admin/expenses') { const s = need(db, headers, 'manager'); if (!body.date || !body.category || !(int(body.amount) > 0)) err(400, 'Date, category and amount are required');
    db.expenses.push({ id: db.expenses.length + 1, date: body.date, category: body.category, amount: int(body.amount), note: body.note || '', staff_id: s.id }); audit(db, s.id, 'create', 'expense', '', null, body); out = { ok: true }; }
  else if (method === 'GET' && p === '/admin/staff') { need(db, headers, 'owner'); out = db.staff.map(({ pin, ...x }) => x); }
  else if (method === 'POST' && p === '/admin/staff') { const s = need(db, headers, 'owner'); const { id, name, role, pin, monthly_salary, active, phone } = body;
    if (!['kitchen', 'cashier', 'manager', 'owner'].includes(role)) err(400, 'Invalid role'); if (pin && !/^\d{4,8}$/.test(pin)) err(400, 'PIN must be 4–8 digits');
    if (id) { const x = db.staff.find((y) => y.id === id); Object.assign(x, { name, role, monthly_salary: int(monthly_salary), active: active ? 1 : 0, phone: phone || '' }); if (pin) x.pin = pin; }
    else { if (!pin) err(400, 'PIN required'); db.staff.push({ id: Math.max(...db.staff.map((y) => y.id)) + 1, name, role, pin, monthly_salary: int(monthly_salary), active: 1, phone: phone || '', created_at: nowISO() }); }
    audit(db, s.id, id ? 'update' : 'create', 'staff', id || name, null, { name, role }); out = { ok: true }; }
  else if (method === 'GET' && p === '/admin/audit') { need(db, headers, 'owner'); out = db.audit.map((a) => ({ ...a, staff: db.staff.find((s) => s.id === a.staff_id)?.name })); }
  else if (method === 'GET' && p === '/admin/report') {
    need(db, headers, 'manager'); const from = query.get('from'); const to = query.get('to'); const days = Math.max(1, Math.round((new Date(to) - new Date(from)) / 864e5) + 1);
    const all = db.orders.filter((o) => o.created_at >= from && o.created_at < to + 'T99'); const valid = all.filter((o) => !['cancelled', 'refunded'].includes(o.status)); const sum = (a, f) => a.reduce((x, o) => x + f(o), 0);
    const gross = sum(valid, (o) => o.subtotal + o.delivery_fee); const discounts = sum(valid, (o) => o.discount); const net = gross - discounts; const cogs = sum(valid, (o) => o.cogs);
    const exp = db.expenses.filter((e) => e.date >= from && e.date <= to); const opex = exp.reduce((a, e) => a + e.amount, 0);
    const payroll = Math.round(db.staff.filter((s) => s.active).reduce((a, s) => a + s.monthly_salary, 0) / 30 * days);
    const by = (f) => { const m = {}; for (const o of valid) for (const k of f(o)) m[k.k] = (m[k.k] || 0) + k.v; return m; };
    out = { from, to, days, orders: valid.length, gross, discounts, net, cogs, grossProfit: net - cogs, opex, payroll, netProfit: net - cogs - opex - payroll, aov: valid.length ? Math.round(net / valid.length) : 0,
      bySize: by((o) => o.items.map((i) => ({ k: i.size, v: i.qty }))), bySeason: by((o) => o.items.flatMap((i) => i.seasonings.map((s) => ({ k: s, v: i.qty })))), byChannel: by((o) => [{ k: o.channel, v: o.total }]),
      byPayment: by((o) => [{ k: o.payment, v: o.total }]), byDay: by((o) => [{ k: o.created_at.slice(0, 10), v: o.total }]), lowStock: db.inventory.filter((i) => i.qty <= i.reorder), openTickets: 0 };
  } else err(404, 'Not found');
  save(db); for (const e of emits) fire(e);
  return out;
}

export function installDemoServer() {
  const realFetch = window.fetch.bind(window);
  window.fetch = async (input, init = {}) => {
    const url = typeof input === 'string' ? input : input.url;
    if (!url.startsWith('/api')) return realFetch(input, init);
    const u = new URL(url, 'http://demo'); const headers = Object.fromEntries(Object.entries(init.headers || {}).map(([k, v]) => [k.toLowerCase(), v]));
    let body = {}; try { body = init.body ? JSON.parse(init.body) : {}; } catch {}
    try { const out = handle((init.method || 'GET').toUpperCase(), u.pathname, u.searchParams, body, headers); return new Response(JSON.stringify(out ?? null), { status: 200, headers: { 'content-type': 'application/json' } }); }
    catch (e) { return new Response(JSON.stringify({ error: e.message }), { status: e.status || 500, headers: { 'content-type': 'application/json' } }); }
  };
  window.EventSource = DemoEventSource;
}
