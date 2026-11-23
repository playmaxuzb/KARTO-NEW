import { useEffect, useState, useSyncExternalStore } from 'react';
import { DEFAULT_MENU } from './data.js';

let menuCache = null;
export function useMenu() {
  const [m, setM] = useState(menuCache || DEFAULT_MENU);
  useEffect(() => {
    let off = false;
    fetch('/api/menu').then((r) => (r.ok ? r.json() : null)).then((j) => { if (j && !off) { menuCache = j; setM(j); } }).catch(() => {});
    return () => { off = true; };
  }, []);
  return m;
}

export async function api(path, opts = {}) {
  const token = (() => { try { return localStorage.getItem('karto-staff-token'); } catch { return null; } })();
  const r = await fetch('/api' + path, {
    ...opts,
    headers: { 'content-type': 'application/json', ...(token ? { authorization: 'Bearer ' + token } : {}), ...(opts.headers || {}) },
    body: opts.body && typeof opts.body !== 'string' ? JSON.stringify(opts.body) : opts.body,
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error(j.error || 'Request failed'), { status: r.status });
  return j;
}

// price of one configured cup
export function linePrice(item, menu) {
  const size = menu.sizes.find((s) => s.id === item.size);
  let p = size ? size.price : 0;
  for (const [id, q] of Object.entries(item.sauces || {})) { const s = menu.sauces.find((x) => x.id === id); if (s) p += s.price * q; }
  for (const [id, q] of Object.entries(item.drinks || {})) { const d = menu.drinks.find((x) => x.id === id); if (d) p += d.price * q; }
  return p * (item.qty || 1);
}

// ---- cart store (localStorage) ----
const KEY = 'karto-cart';
let cart = (() => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } })();
const subs = new Set();
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch {} subs.forEach((f) => f()); };
export const cartStore = {
  get: () => cart,
  add(item) { cart = [...cart, { ...item, key: Date.now() + Math.random() }]; save(); },
  remove(key) { cart = cart.filter((i) => i.key !== key); save(); },
  setQty(key, qty) { cart = cart.map((i) => (i.key === key ? { ...i, qty: Math.max(1, qty) } : i)); save(); },
  clear() { cart = []; save(); },
  subscribe(f) { subs.add(f); return () => subs.delete(f); },
};
export const useCart = () => useSyncExternalStore(cartStore.subscribe, cartStore.get);

// live events from server (SSE)
export function useLive(onEvent) {
  useEffect(() => {
    let es;
    try { es = new EventSource('/api/events'); es.onmessage = (e) => { try { onEvent(JSON.parse(e.data)); } catch {} }; } catch {}
    return () => es && es.close();
  }, []);
}
