import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Route, Routes, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Logo, Mascot, Sparkle } from './brand.jsx';
import { useLang, LangSwitch } from './i18n.jsx';
import { fmt } from './data.js';
import { api, cartStore, linePrice, useCart, useMenu, useLive } from './api.js';

const SIZE_BG = { s: '#fff', m: '#fff', l: '#fff' };
const myOrders = { get: () => { try { return JSON.parse(localStorage.getItem('karto-my-orders') || '[]'); } catch { return []; } },
  add: (ref) => { try { localStorage.setItem('karto-my-orders', JSON.stringify([ref, ...myOrders.get()].slice(0, 30))); } catch {} } };

function Icon({ d, size = 24 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>;
}
const I = {
  home: 'M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z',
  menu: 'M4 6h16M4 12h16M4 18h10',
  bag: 'M5 8h14l-1 13H6L5 8zm4 0V6a3 3 0 0 1 6 0v2',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-8 9a8 8 0 0 1 16 0',
};

function TabBar() {
  const { t } = useLang(); const cart = useCart();
  const n = cart.reduce((a, i) => a + (i.qty || 1), 0);
  return (
    <nav className="tabbar" aria-label="App">
      <NavLink to="/app" end><Icon d={I.home} />{t('home')}</NavLink>
      <NavLink to="/app/build"><Icon d={I.menu} />{t('menu')}</NavLink>
      <NavLink to="/app/cart"><Icon d={I.bag} />{t('cart')}{n > 0 && <span className="badge">{n}</span>}</NavLink>
      <NavLink to="/app/me"><Icon d={I.user} />{t('profile')}</NavLink>
    </nav>
  );
}

function Home() {
  const { t, L, lang } = useLang(); const menu = useMenu(); const nav = useNavigate();
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <Mascot size={58} />
        <div><div className="muted" style={{ fontSize: 15 }}>{t('hi')}</div><h2 style={{ fontSize: 26, fontWeight: 900 }}>{t('whatToday')}</h2></div>
      </div>
      <div className="promo">
        <img src="/img/karto-medium.png" alt="" />
        <div className="promo__txt">
          <span className="kicker" style={{ color: 'var(--yellow)', fontSize: 12 }}><Sparkle size={14} /> Made Your Way</span>
          <h2 style={{ marginTop: 8 }}>{t('build')}<em>KARTO!</em></h2>
          <button className="btn btn--yellow btn--sm" style={{ marginTop: 16 }} onClick={() => nav('/app/build')}>{t('order')} →</button>
        </div>
      </div>
      <div className="h-title">{t('chooseSize')}</div>
      <div className="opt-grid opt-grid--3">
        {menu.sizes.map((s) => (
          <button key={s.id} className="opt opt--size" onClick={() => nav('/app/build?size=' + s.id)}>
            <img src={s.img} alt={L(s.package)} loading="lazy" />
            <div style={{ fontFamily: 'var(--display)', fontWeight: 900, fontSize: 18 }}>{L(s.name)}</div>
            <div style={{ fontSize: 13 }}>{s.grams} g</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>{fmt(s.price, lang)}</div>
          </button>
        ))}
      </div>
      <div className="h-title">{t('popular')}</div>
      <div className="combos">
        {menu.combos.map((c) => {
          const price = linePrice({ size: c.size, seasonings: c.seasonings, sauces: Object.fromEntries(c.sauces.map((s) => [s, 1])) }, menu);
          return (
            <button key={c.id} className="combo" onClick={() => nav('/app/build?combo=' + c.id)}>
              <img src={c.img.replace('.webp', '-sm.webp')} alt="" />
              <div className="combo__b"><b>{L(c.name)}</b>
                <div className="muted" style={{ fontSize: 13 }}>{c.seasonings.map((id) => L(menu.seasonings.find((s) => s.id === id)?.name)).join(' · ')}</div>
                <div style={{ fontWeight: 900, marginTop: 4 }}>{fmt(price, lang)}</div></div>
            </button>
          );
        })}
      </div>
      <div className="h-title">{t('rewards')}</div>
      <Rewards />
    </motion.div>
  );
}

function Rewards() {
  const { t } = useLang();
  const pts = (() => { try { return +localStorage.getItem('karto-points') || 0; } catch { return 0; } })();
  return (
    <div className="rewards">
      <div style={{ position: 'absolute', right: -10, bottom: -14, opacity: .9 }}><Mascot size={110} /></div>
      <small style={{ fontWeight: 800, color: '#CDBFA4' }}>{t('rewards')}</small>
      <div><b>{pts}</b> <span style={{ fontWeight: 800 }}>{t('points')}</span></div>
      <div className="bar" style={{ maxWidth: '65%' }}><i style={{ width: Math.min(100, (pts % 100)) + '%' }} /></div>
      <small style={{ color: '#CDBFA4', fontWeight: 700 }}>100 {t('points')} = 1 KARTO</small>
    </div>
  );
}

function Stepper({ value, onChange, label }) {
  return (
    <div className="stepper">
      <button type="button" aria-label={'− ' + label} onClick={() => onChange(Math.max(0, value - 1))}>−</button>
      <span aria-live="polite">{value}</span>
      <button type="button" className="plus" aria-label={'+ ' + label} onClick={() => onChange(value + 1)}>+</button>
    </div>
  );
}

function Build() {
  const { t, L, lang } = useLang(); const menu = useMenu(); const nav = useNavigate(); const [q] = useSearchParams();
  const combo = menu.combos.find((c) => c.id === q.get('combo'));
  const [size, setSize] = useState(combo?.size || q.get('size') || 'm');
  const pack = { s: 'cone', m: 'bowl', l: 'tray' }[size] || 'bowl';
  const [seas, setSeas] = useState(combo?.seasonings || ['classic']);
  const [sauces, setSauces] = useState(combo ? Object.fromEntries(combo.sauces.map((s) => [s, 1])) : {});
  const [drinks, setDrinks] = useState({});
  const [added, setAdded] = useState(false);
  const max = menu.maxSeasonings || 3;
  const item = { size, packaging: pack, seasonings: seas, sauces, drinks, qty: 1 };
  const price = linePrice(item, menu);
  const img = menu.sizes.find((s) => s.id === size)?.img;
  const toggle = (id) => setSeas((cur) => (cur.includes(id) ? (cur.length > 1 ? cur.filter((x) => x !== id) : cur) : cur.length < max ? [...cur, id] : cur));
  const add = () => { cartStore.add(item); setAdded(true); setTimeout(() => nav('/app/cart'), 650); };
  const avail = (x) => x.available !== false;
  return (
    <div>
      <div className="builder-hero">
        <AnimatePresence mode="wait">
          <motion.img key={img} src={img} alt="" initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: .35 }} />
        </AnimatePresence>
        <div className="builder-hero__tag" style={{ background: SIZE_BG[size], color: size === 's' ? 'var(--ink)' : '#fff' }}>{t('yourCup')} · {L(menu.sizes.find((s) => s.id === size)?.name)}</div>
      </div>

      <div className="sec-title"><h3>1. {t('chooseSize')}</h3></div>
      <div className="opt-grid opt-grid--3">
        {menu.sizes.filter(avail).map((s) => (
          <button key={s.id} type="button" className="opt opt--size" aria-pressed={size === s.id} onClick={() => setSize(s.id)}>
            {size === s.id && <span className="opt__check">✓</span>}
            <img src={s.img} alt={L(s.package)} loading="lazy" />
            <div style={{ fontFamily: 'var(--display)', fontWeight: 900, fontSize: 17 }}>{L(s.name)}</div>
            <div style={{ fontSize: 13 }}>{s.grams} g</div><div style={{ fontSize: 13 }}>{fmt(s.price, lang)}</div>
          </button>
        ))}
      </div>

      <div className="sec-title"><h3>2. {t('chooseSeason')}</h3><span className="counter">{seas.length}/{max}</span></div>
      <p className="muted" style={{ margin: '0 0 10px', fontSize: 14 }}>{t('upTo3')} · {t('firstFree')}, +{fmt(menu.extraSeasoningPrice, lang)}</p>
      <div className="season-grid">
        {menu.seasonings.filter(avail).map((s) => {
          const on = seas.includes(s.id);
          return (
            <motion.button whileTap={{ scale: .92 }} key={s.id} type="button" className="season" aria-pressed={on} disabled={!on && seas.length >= max} onClick={() => toggle(s.id)}>
              <i className="dot" style={{ background: s.color }} />{L(s.name)}
            </motion.button>
          );
        })}
      </div>

      <div className="sec-title"><h3>3. {t('addSauce')}</h3></div>
      {menu.sauces.filter(avail).map((s) => (
        <div className="addon" key={s.id}>
          <div className="addon__l"><i className="dot" style={{ background: s.color, width: 26, height: 26 }} /><div>{L(s.name)}<small>+{fmt(s.price, lang)}</small></div></div>
          <Stepper label={L(s.name)} value={sauces[s.id] || 0} onChange={(v) => setSauces({ ...sauces, [s.id]: v })} />
        </div>
      ))}
      <div className="sec-title"><h3>4. {t('addDrink')}</h3></div>
      {menu.drinks.filter(avail).map((s) => (
        <div className="addon" key={s.id}>
          <div className="addon__l"><div>{L(s.name)}<small>+{fmt(s.price, lang)}</small></div></div>
          <Stepper label={L(s.name)} value={drinks[s.id] || 0} onChange={(v) => setDrinks({ ...drinks, [s.id]: v })} />
        </div>
      ))}

      <div className="cta-bar">
        <div><small>{t('total')}</small><b>{fmt(price, lang)}</b></div>
        <motion.button className="btn btn--yellow" onClick={add} animate={added ? { scale: [1, 1.12, 1] } : {}}>{added ? '✓' : t('addToCart')}</motion.button>
      </div>
    </div>
  );
}

function describe(item, menu, L) {
  const parts = [item.seasonings.map((id) => L(menu.seasonings.find((s) => s.id === id)?.name)).join(', ')];
  for (const [id, q] of Object.entries(item.sauces || {})) if (q) parts.push(q + '× ' + L(menu.sauces.find((s) => s.id === id)?.name));
  for (const [id, q] of Object.entries(item.drinks || {})) if (q) parts.push(q + '× ' + L(menu.drinks.find((s) => s.id === id)?.name));
  return parts.join(' · ');
}

function Cart() {
  const { t, L, lang } = useLang(); const menu = useMenu(); const cart = useCart(); const nav = useNavigate();
  const sub = cart.reduce((a, i) => a + linePrice(i, menu), 0);
  if (!cart.length) return (
    <div className="center" style={{ paddingTop: 60 }}>
      <Mascot size={140} /><h2 style={{ margin: '18px 0 8px' }}>{t('emptyCart')}</h2>
      <Link className="btn btn--yellow" to="/app/build">{t('build')}</Link>
    </div>
  );
  return (
    <div>
      <h2 style={{ fontSize: 30, fontWeight: 900, marginBottom: 14 }}>{t('cart')}</h2>
      {cart.map((i) => {
        const s = menu.sizes.find((x) => x.id === i.size); const p = menu.packaging.find((x) => x.id === i.packaging);
        return (
          <motion.div layout key={i.key} className="card" style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            <img src={p?.img.replace('.webp', '-sm.webp')} alt="" style={{ width: 84, height: 84, objectFit: 'cover', borderRadius: 14, border: '2px solid var(--ink)', background: SIZE_BG[i.size] }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <b style={{ fontFamily: 'var(--display)' }}><span className="dot" style={{ display: 'inline-block', background: SIZE_BG[i.size], verticalAlign: -2, marginRight: 6 }} />{L(s?.name)} · {L(p?.name)}</b>
              </div>
              <div className="muted" style={{ fontSize: 13 }}>{describe(i, menu, L)}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <Stepper label="qty" value={i.qty || 1} onChange={(v) => (v < 1 ? cartStore.remove(i.key) : cartStore.setQty(i.key, v))} />
                <b>{fmt(linePrice(i, menu), lang)}</b>
              </div>
            </div>
          </motion.div>
        );
      })}
      <div className="card"><div className="line"><span>{t('subtotal')}</span><b>{fmt(sub, lang)}</b></div></div>
      <div className="cta-bar"><div><small>{t('subtotal')}</small><b>{fmt(sub, lang)}</b></div><button className="btn btn--yellow" onClick={() => nav('/app/checkout')}>{t('checkout')} →</button></div>
    </div>
  );
}

function Checkout() {
  const { t, L, lang } = useLang(); const menu = useMenu(); const cart = useCart(); const nav = useNavigate();
  const saved = (() => { try { return JSON.parse(localStorage.getItem('karto-me') || '{}'); } catch { return {}; } })();
  const [mode, setMode] = useState('pickup'); const [pay, setPay] = useState('cash');
  const [f, setF] = useState({ name: saved.name || '', phone: saved.phone || '', address: saved.address || '', note: '' });
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  const sub = cart.reduce((a, i) => a + linePrice(i, menu), 0);
  const fee = mode === 'delivery' ? (menu.deliveryFee ?? 12000) : 0;
  const submit = async (e) => {
    e.preventDefault(); setErr('');
    if (!f.name.trim() || !/^[+\d][\d\s-]{7,}$/.test(f.phone.trim()) || (mode === 'delivery' && !f.address.trim())) { setErr('!'); return; }
    setBusy(true);
    try {
      const o = await api('/orders', { method: 'POST', body: { channel: 'app', mode, payment: pay, customer: f, items: cart.map(({ key, ...i }) => i) } });
      try { localStorage.setItem('karto-me', JSON.stringify({ name: f.name, phone: f.phone, address: f.address })); } catch {}
      myOrders.add(o.ref); cartStore.clear(); nav('/app/order/' + o.ref + '?k=' + o.accessKey);
      try { localStorage.setItem('karto-key-' + o.ref, o.accessKey); } catch {}
    } catch (e2) { setErr(e2.message); } finally { setBusy(false); }
  };
  return (
    <form onSubmit={submit}>
      <h2 style={{ fontSize: 30, fontWeight: 900, marginBottom: 14 }}>{t('checkout')}</h2>
      <div className="seg" style={{ marginBottom: 16 }}>
        <button type="button" aria-pressed={mode === 'pickup'} onClick={() => setMode('pickup')}>{t('pickup')}</button>
        <button type="button" aria-pressed={mode === 'delivery'} onClick={() => setMode('delivery')}>{t('delivery')}</button>
      </div>
      <label className="field"><span>{t('name')}</span><input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} autoComplete="name" required /></label>
      <label className="field"><span>{t('phoneNum')}</span><input value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} inputMode="tel" placeholder="+998 90 123 45 67" autoComplete="tel" required /></label>
      {mode === 'delivery' && <label className="field"><span>{t('addr')}</span><input value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} autoComplete="street-address" required /></label>}
      <label className="field"><span>{t('note')}</span><textarea rows="2" value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} /></label>
      <div className="sec-title"><h3>{t('payment')}</h3></div>
      <div className="opt-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
        {[['cash', t('cash')], ['card', 'Uzcard / Humo'], ['online', 'Click / Payme']].map(([id, n]) => (
          <button key={id} type="button" className="opt" aria-pressed={pay === id} onClick={() => setPay(id)} style={{ background: pay === id ? 'var(--yellow)' : 'var(--paper)', fontSize: 14 }}>{n}</button>
        ))}
      </div>
      <div className="card" style={{ marginTop: 16 }}>
        <div className="line"><span>{t('subtotal')}</span><b>{fmt(sub, lang)}</b></div>
        {fee > 0 && <div className="line"><span>{t('deliveryFee')}</span><b>{fmt(fee, lang)}</b></div>}
        <div className="line line--total"><span>{t('total')}</span><span>{fmt(sub + fee, lang)}</span></div>
      </div>
      {err && <p role="alert" style={{ color: 'var(--red-d)', fontWeight: 800 }}>{err === '!' ? '⚠ ' + t('name') + ' / ' + t('phoneNum') + (mode === 'delivery' ? ' / ' + t('addr') : '') : err}</p>}
      <div className="cta-bar"><div><small>{t('total')}</small><b>{fmt(sub + fee, lang)}</b></div><button className="btn btn--yellow" disabled={busy || !cart.length}>{busy ? '…' : t('placeOrder')}</button></div>
    </form>
  );
}

const FLOW = { pickup: ['received', 'confirmed', 'preparing', 'ready', 'completed'], delivery: ['received', 'confirmed', 'preparing', 'out', 'completed'], dine: ['received', 'confirmed', 'preparing', 'ready', 'completed'] };

function OrderView() {
  const { ref } = useParams(); const [q] = useSearchParams(); const { t, L, lang } = useLang(); const menu = useMenu();
  const key = q.get('k') || (() => { try { return localStorage.getItem('karto-key-' + ref); } catch { return ''; } })();
  const [o, setO] = useState(null); const [err, setErr] = useState('');
  const load = () => api('/orders/' + ref + '?k=' + encodeURIComponent(key || '')).then(setO).catch((e) => setErr(e.message));
  useEffect(() => { load(); }, [ref]);
  useLive((ev) => { if (ev.type === 'order' && ev.ref === ref) load(); });
  if (err) return <p>{err}</p>;
  if (!o) return <p className="center muted" style={{ paddingTop: 80 }}>…</p>;
  const flow = FLOW[o.mode] || FLOW.pickup; const idx = flow.indexOf(o.status);
  return (
    <div>
      <div className="center" style={{ marginBottom: 10 }}>
        <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring' }}><Mascot size={120} /></motion.div>
        <h2 style={{ fontSize: 26, fontWeight: 900, marginTop: 10 }}>{t('thanks')}</h2>
        <p className="muted" style={{ margin: '6px 0 0' }}>{t('preparing')}</p>
      </div>
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--yellow)' }}>
        <div><small style={{ fontWeight: 800 }}>{t('orderNo')}</small><div style={{ fontFamily: 'var(--display)', fontWeight: 900, fontSize: 38, lineHeight: 1 }}>#{o.number}</div></div>
        <div style={{ textAlign: 'right' }}><small style={{ fontWeight: 800 }}>{t('readyIn')}</small><div style={{ fontWeight: 900, fontSize: 20 }}>~{o.etaMin} {t('min')}</div></div>
      </div>
      <div className="sec-title"><h3>{t('track')}</h3></div>
      <div className="card track">
        {o.status === 'cancelled' ? <div className="track__s now">{t('st_cancelled')}</div> :
          flow.map((s, i) => <div key={s} className={'track__s' + (i < idx ? ' done' : i === idx ? ' now done' : '')}>{t('st_' + s)}</div>)}
      </div>
      <div className="sec-title"><h3>{t('receipt')}</h3></div>
      <div className="receipt">
        <div className="center" style={{ marginBottom: 8 }}><Logo size={26} /><div>Beyond Ordinary Potatoes.</div></div>
        <div>{t('invoiceNo')}: <b>{o.invoiceNo}</b></div>
        <div>{t('orderNo')}: {o.ref}</div>
        <div>{new Date(o.createdAt).toLocaleString(lang === 'en' ? 'en-GB' : lang)}</div>
        <div>{o.customer?.name} · {o.customer?.phone}</div>
        <hr />
        {o.items.map((i, n) => (
          <div key={n} style={{ marginBottom: 6 }}>
            <div className="line" style={{ padding: 0 }}><span>{i.qty}× {L(menu.sizes.find((s) => s.id === i.size)?.name)} {menu.sizes.find((s) => s.id === i.size)?.grams}g</span><span>{fmt(i.total, lang)}</span></div>
            <div style={{ fontSize: 12 }}>{describe(i, menu, L)}</div>
          </div>
        ))}
        <hr />
        {o.deliveryFee > 0 && <div className="line" style={{ padding: 0 }}><span>{t('deliveryFee')}</span><span>{fmt(o.deliveryFee, lang)}</span></div>}
        <div className="line" style={{ padding: 0, fontWeight: 900 }}><span>{t('total')}</span><span>{fmt(o.total, lang)}</span></div>
        <div>{t('payment')}: {o.payment} · {o.paymentStatus}</div>
        <div className="center" style={{ marginTop: 10 }}>{t('thanks')}</div>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
        <button className="btn btn--ghost btn--sm" data-print="1" onClick={() => window.print()}>PDF / Print</button>
        <Link className="btn btn--yellow btn--sm" to="/app/build">{t('newOrder')}</Link>
      </div>
    </div>
  );
}

function Me() {
  const { t } = useLang(); const refs = myOrders.get();
  const me = (() => { try { return JSON.parse(localStorage.getItem('karto-me') || '{}'); } catch { return {}; } })();
  return (
    <div>
      <h2 style={{ fontSize: 30, fontWeight: 900, marginBottom: 6 }}>{me.name || t('profile')}</h2>
      <p className="muted" style={{ marginTop: 0 }}>{me.phone}</p>
      <Rewards />
      <div className="sec-title"><h3>{t('orders')}</h3></div>
      {refs.length === 0 && <p className="muted">—</p>}
      {refs.map((r) => <Link key={r} to={'/app/order/' + r} className="card" style={{ display: 'flex', justifyContent: 'space-between', textDecoration: 'none', marginBottom: 8 }}><b>{r}</b><span>→</span></Link>)}
      <div className="sec-title"><h3>Til / Язык / Language</h3></div>
      <LangSwitch dark />
    </div>
  );
}

function Maintenance({ m }) {
  const { L } = useLang();
  const msg = L(m.message) || L({ uz: 'Biz tez orada qaytamiz! Xizmatni yaxshilash ustida ishlayapmiz.', ru: 'Мы скоро вернёмся! Мы улучшаем сервис для вас.', en: 'We’ll be right back! We’re improving things for you.' });
  return (
    <div className="center" style={{ paddingTop: 50 }}>
      <motion.div animate={{ rotate: [0, -6, 6, 0] }} transition={{ duration: 2.4, repeat: Infinity }}><Mascot size={150} /></motion.div>
      <h2 style={{ fontSize: 30, fontWeight: 900, margin: '18px 0 10px' }}>KARTO</h2>
      <p style={{ fontWeight: 700, fontSize: 18 }}>{msg}</p>
      {m.returnAt && <p className="chip" style={{ marginTop: 10 }}>⏱ {m.returnAt}</p>}
    </div>
  );
}

export default function CustomerApp() {
  const [status, setStatus] = useState(null);
  useEffect(() => { fetch('/api/status').then((r) => r.json()).then(setStatus).catch(() => {}); }, []);
  if (status?.maintenance?.enabled) return (<div className="app-shell"><div className="app"><header className="app__top"><Logo size={26} /><LangSwitch /></header><main className="app__body"><Maintenance m={status.maintenance} /></main></div></div>);
  return (
    <div className="app-shell">
      <div className="app">
        <header className="app__top"><Link to="/" style={{ textDecoration: 'none' }}><Logo size={26} /></Link><LangSwitch /></header>
        <main className="app__body">
          <Routes>
            <Route index element={<Home />} />
            <Route path="build" element={<Build />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="order/:ref" element={<OrderView />} />
            <Route path="me" element={<Me />} />
          </Routes>
        </main>
        <TabBar />
      </div>
    </div>
  );
}
