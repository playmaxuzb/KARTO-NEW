import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { DEFAULT_MENU, BRANCH } from './seed-menu.js';

const FILE = process.env.KARTO_DB || new URL('./data/karto.db', import.meta.url).pathname;
mkdirSync(dirname(FILE), { recursive: true });
export const db = new DatabaseSync(FILE);
db.exec(`PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS counters (name TEXT PRIMARY KEY, value INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS branches (id INTEGER PRIMARY KEY, name TEXT, info TEXT);
CREATE TABLE IF NOT EXISTS staff (id INTEGER PRIMARY KEY, name TEXT NOT NULL, role TEXT NOT NULL, salt TEXT, pin_hash TEXT, active INTEGER DEFAULT 1,
  monthly_salary INTEGER DEFAULT 0, phone TEXT, branch_id INTEGER DEFAULT 1, created_at TEXT);
CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, staff_id INTEGER, expires INTEGER);
CREATE TABLE IF NOT EXISTS customers (id INTEGER PRIMARY KEY, name TEXT, phone TEXT UNIQUE, email TEXT, address TEXT, points INTEGER DEFAULT 0, marketing INTEGER DEFAULT 0, created_at TEXT);
CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY, ref TEXT UNIQUE, number INTEGER, invoice_no TEXT UNIQUE, access_key TEXT, branch_id INTEGER DEFAULT 1,
  channel TEXT, mode TEXT, status TEXT, payment TEXT, payment_status TEXT, customer_id INTEGER, customer TEXT, items TEXT,
  subtotal INTEGER, discount INTEGER DEFAULT 0, delivery_fee INTEGER DEFAULT 0, total INTEGER, cash_received INTEGER, change_due INTEGER,
  cogs INTEGER DEFAULT 0, note TEXT, eta_min INTEGER, staff_id INTEGER, void_reason TEXT, created_at TEXT, updated_at TEXT);
CREATE INDEX IF NOT EXISTS ix_orders_created ON orders(created_at);
CREATE TABLE IF NOT EXISTS order_events (id INTEGER PRIMARY KEY, order_id INTEGER, status TEXT, staff_id INTEGER, note TEXT, at TEXT);
CREATE TABLE IF NOT EXISTS inventory (id TEXT PRIMARY KEY, name TEXT, unit TEXT, qty REAL, reorder REAL, unit_cost REAL, branch_id INTEGER DEFAULT 1);
CREATE TABLE IF NOT EXISTS stock_moves (id INTEGER PRIMARY KEY, item_id TEXT, delta REAL, reason TEXT, ref TEXT, cost REAL, staff_id INTEGER, at TEXT);
CREATE TABLE IF NOT EXISTS expenses (id INTEGER PRIMARY KEY, date TEXT, category TEXT, amount INTEGER, note TEXT, staff_id INTEGER, created_at TEXT);
CREATE TABLE IF NOT EXISTS shifts (id INTEGER PRIMARY KEY, staff_id INTEGER, opened_at TEXT, opening_cash INTEGER, closed_at TEXT, counted_cash INTEGER, expected_cash INTEGER, note TEXT);
CREATE TABLE IF NOT EXISTS tickets (id INTEGER PRIMARY KEY, order_ref TEXT, category TEXT, description TEXT, status TEXT, resolution TEXT, created_at TEXT, closed_at TEXT);
CREATE TABLE IF NOT EXISTS audit (id INTEGER PRIMARY KEY, at TEXT, staff_id INTEGER, action TEXT, entity TEXT, entity_id TEXT, before TEXT, after TEXT);
`);

export const now = () => new Date().toISOString();
export const getSetting = (k, d) => { const r = db.prepare('SELECT value FROM settings WHERE key=?').get(k); return r ? JSON.parse(r.value) : d; };
export const setSetting = (k, v) => db.prepare('INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').run(k, JSON.stringify(v));
export function nextCounter(name) {
  db.prepare('INSERT INTO counters(name,value) VALUES(?,0) ON CONFLICT(name) DO NOTHING').run(name);
  db.prepare('UPDATE counters SET value=value+1 WHERE name=?').run(name);
  return db.prepare('SELECT value FROM counters WHERE name=?').get(name).value;
}
export function audit(staffId, action, entity, entityId, before, after) {
  db.prepare('INSERT INTO audit(at,staff_id,action,entity,entity_id,before,after) VALUES(?,?,?,?,?,?,?)')
    .run(now(), staffId ?? null, action, entity, String(entityId ?? ''), before == null ? null : JSON.stringify(before), after == null ? null : JSON.stringify(after));
}
export function hashPin(pin, salt = randomBytes(16).toString('hex')) { return { salt, hash: scryptSync(String(pin), salt, 32).toString('hex') }; }
export function checkPin(pin, salt, hash) { const h = scryptSync(String(pin), salt, 32); return timingSafeEqual(h, Buffer.from(hash, 'hex')); }

// ---------- seed ----------
if (!getSetting('menu')) {
  setSetting('menu', { ...DEFAULT_MENU, deliveryFee: 12000 });
  setSetting('branch', BRANCH);
  setSetting('maintenance', { enabled: false, ordering: true, delivery: true, message: { uz: '', ru: '', en: '' }, returnAt: '' });
  // recipe / bill of materials (theoretical consumption). Quantities are editable in Admin.
  setSetting('recipes', {
    size: { s: { potato_kg: 0.115, oil_l: 0.012 }, m: { potato_kg: 0.17, oil_l: 0.018 }, l: { potato_kg: 0.23, oil_l: 0.024 } },
    seasoning_g: 4, packaging: { bowl: 'pack_bowl', tray: 'pack_tray', cone: 'pack_cone' },
  });
  db.prepare('INSERT INTO branches(id,name,info) VALUES(1,?,?)').run('KARTO Toshkent #1', '{}');
  const inv = db.prepare('INSERT INTO inventory(id,name,unit,qty,reorder,unit_cost) VALUES(?,?,?,?,?,?)');
  inv.run('potato_kg', 'Frozen fries', 'kg', 100, 30, 30000);
  inv.run('oil_l', 'Frying oil', 'L', 60, 20, 22000);
  for (const s of DEFAULT_MENU.seasonings) inv.run('season_' + s.id, 'Seasoning: ' + s.name.en, 'g', 2000, 500, 60);
  for (const s of DEFAULT_MENU.sauces) inv.run('sauce_' + s.id, 'Sauce cup: ' + s.name.en, 'pcs', 300, 80, 1200);
  for (const s of DEFAULT_MENU.drinks) inv.run('drink_' + s.id, 'Drink: ' + s.name.en, 'pcs', 96, 24, s.price * 0.55);
  inv.run('pack_bowl', 'Packaging: bowl', 'pcs', 500, 150, 1500);
  inv.run('pack_tray', 'Packaging: tray', 'pcs', 500, 150, 1400);
  inv.run('pack_cone', 'Packaging: cone', 'pcs', 500, 150, 900);
  inv.run('napkin', 'Napkins & forks', 'set', 1000, 200, 250);
  const st = db.prepare('INSERT INTO staff(name,role,salt,pin_hash,monthly_salary,created_at) VALUES(?,?,?,?,?,?)');
  const seedStaff = [['Owner', 'owner', process.env.OWNER_PIN || '1111', 0], ['Manager', 'manager', '2222', 7000000], ['Cashier', 'cashier', '3333', 5500000], ['Kitchen', 'kitchen', '4444', 5500000]];
  for (const [n, r, p, sal] of seedStaff) { const { salt, hash } = hashPin(p); st.run(n, r, salt, hash, sal, now()); }
}
