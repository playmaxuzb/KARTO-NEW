import { useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Logo, Mascot } from './brand.jsx';
import { useLang, LangSwitch } from './i18n.jsx';
import { fmt } from './data.js';
import { api, linePrice, useMenu, useLive } from './api.js';
import './staff.css';

const SIZE_BG = { s: 'var(--yellow)', m: 'var(--orange)', l: 'var(--red)' };
const T = {
  uz: { login: 'Xodim kirishi', pin: 'PIN kodni kiriting', pos: 'Kassa', kds: 'Oshxona', tv: 'TV ekran', online: 'Onlayn', admin: 'Boshqaruv', logout: 'Chiqish',
    ticket: 'Chek', add: 'Qo‘shish', discount: 'Chegirma', received: 'Olingan naqd', change: 'Qaytim', charge: 'To‘lovni qabul qilish', clear: 'Tozalash', empty: 'Mahsulot tanlang',
    newO: 'Yangi', prep: 'Tayyorlanmoqda', ready: 'Tayyor', start: 'Boshlash', done: 'Berildi', send: 'Kuryerga', accept: 'Qabul qilish', markPaid: 'To‘landi', unpaid: 'To‘lanmagan',
    shift: 'Smena', openShift: 'Smenani ochish', closeShift: 'Smenani yopish', openingCash: 'Boshlang‘ich naqd', counted: 'Sanalgan naqd', expected: 'Kutilgan', diff: 'Farq', noShift: 'Smena ochilmagan',
    cancel: 'Bekor qilish', reason: 'Sabab', printed: 'Chek tayyor', mins: 'daq', table: 'Joyida', pickup: 'Olib ketish', delivery: 'Yetkazish', nowPreparing: 'Tayyorlanmoqda', nowReady: 'Tayyor — olib keting!', minus: 'kamaytirish', plus: 'oshirish', remove: 'o‘chirish', ok: 'OK' },
  ru: { login: 'Вход для сотрудников', pin: 'Введите PIN', pos: 'Касса', kds: 'Кухня', tv: 'ТВ-экран', online: 'Онлайн', admin: 'Управление', logout: 'Выйти',
    ticket: 'Чек', add: 'Добавить', discount: 'Скидка', received: 'Получено наличными', change: 'Сдача', charge: 'Принять оплату', clear: 'Очистить', empty: 'Выберите товар',
    newO: 'Новые', prep: 'Готовятся', ready: 'Готовы', start: 'Начать', done: 'Выдан', send: 'Курьеру', accept: 'Принять', markPaid: 'Оплачен', unpaid: 'Не оплачен',
    shift: 'Смена', openShift: 'Открыть смену', closeShift: 'Закрыть смену', openingCash: 'Наличные на начало', counted: 'Посчитано', expected: 'Ожидается', diff: 'Разница', noShift: 'Смена не открыта',
    cancel: 'Отменить', reason: 'Причина', printed: 'Чек готов', mins: 'мин', table: 'В зале', pickup: 'Самовывоз', delivery: 'Доставка', nowPreparing: 'Готовятся', nowReady: 'Готово — заберите!', minus: 'уменьшить', plus: 'увеличить', remove: 'удалить', ok: 'ОК' },
  en: { login: 'Staff login', pin: 'Enter your PIN', pos: 'POS', kds: 'Kitchen', tv: 'TV board', online: 'Online', admin: 'Admin', logout: 'Log out',
    ticket: 'Ticket', add: 'Add', discount: 'Discount', received: 'Cash received', change: 'Change', charge: 'Take payment', clear: 'Clear', empty: 'Pick a product',
    newO: 'New', prep: 'Preparing', ready: 'Ready', start: 'Start', done: 'Handed over', send: 'To courier', accept: 'Accept', markPaid: 'Mark paid', unpaid: 'Unpaid',
    shift: 'Shift', openShift: 'Open shift', closeShift: 'Close shift', openingCash: 'Opening cash', counted: 'Counted cash', expected: 'Expected', diff: 'Difference', noShift: 'No shift open',
    cancel: 'Cancel', reason: 'Reason', printed: 'Receipt ready', mins: 'min', table: 'Dine-in', pickup: 'Pickup', delivery: 'Delivery', nowPreparing: 'Preparing', nowReady: 'Ready — please collect!', minus: 'decrease', plus: 'increase', remove: 'remove', ok: 'OK' },
  ar: { login: 'دخول الموظفين', pin: 'أدخل الرقم السري', pos: 'الكاشير', kds: 'المطبخ', tv: 'شاشة العرض', online: 'طلبات الإنترنت', admin: 'الإدارة', logout: 'تسجيل الخروج',
    ticket: 'الفاتورة', add: 'إضافة', discount: 'خصم', received: 'المبلغ المستلم', change: 'الباقي', charge: 'تسجيل الدفع', clear: 'مسح', empty: 'اختر منتجاً',
    newO: 'جديد', prep: 'قيد التحضير', ready: 'جاهز', start: 'بدء التحضير', done: 'تم التسليم', send: 'للتوصيل', accept: 'قبول', markPaid: 'مدفوع', unpaid: 'غير مدفوع',
    shift: 'الوردية', openShift: 'فتح الوردية', closeShift: 'إغلاق الوردية', openingCash: 'نقدية البداية', counted: 'النقدية المعدودة', expected: 'المتوقع', diff: 'الفرق', noShift: 'الوردية غير مفتوحة',
    cancel: 'إلغاء', reason: 'السبب', printed: 'الفاتورة جاهزة', mins: 'دقيقة', table: 'داخل المطعم', pickup: 'استلام', delivery: 'توصيل', nowPreparing: 'قيد التحضير', nowReady: 'جاهز — تفضل بالاستلام!', minus: 'تقليل', plus: 'زيادة', remove: 'حذف', ok: 'حسناً' },
};
function useT() { const { lang } = useLang(); return (k) => T[lang]?.[k] ?? T.en[k] ?? k; }

const me = { get: () => { try { return JSON.parse(localStorage.getItem('karto-staff') || 'null'); } catch { return null; } } };

function Login() {
  const tt = useT(); const nav = useNavigate(); const [pin, setPin] = useState(''); const [err, setErr] = useState('');
  const go = async (p) => {
    try { const r = await api('/auth/login', { method: 'POST', body: { pin: p } });
      localStorage.setItem('karto-staff-token', r.token); localStorage.setItem('karto-staff', JSON.stringify(r.staff));
      nav(r.staff.role === 'kitchen' ? '/staff/kds' : r.staff.role === 'owner' ? '/admin' : '/staff/pos');
    } catch (e) { setErr(e.message); setPin(''); }
  };
  const press = (d) => { const p = (pin + d).slice(0, 8); setPin(p); setErr(''); };
  return (
    <div className="st-login">
      <div className="st-login__card">
        <Mascot size={90} /><Logo size={34} />
        <h1>{tt('login')}</h1>
        <div className="pin-dots" aria-label={tt('pin')}>{[0, 1, 2, 3].map((i) => <i key={i} className={pin.length > i ? 'on' : ''} />)}</div>
        {err && <p role="alert" className="st-err">{err}</p>}
        <div className="pinpad">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '→'].map((k) => (
            <button key={k} type="button" onClick={() => (k === 'C' ? setPin('') : k === '→' ? go(pin) : press(k))} className={k === '→' ? 'go' : ''}>{k}</button>
          ))}
        </div>
        <LangSwitch dark />
      </div>
    </div>
  );
}

function StaffBar() {
  const tt = useT(); const s = me.get(); const nav = useNavigate();
  const out = async () => { try { await api('/auth/logout', { method: 'POST' }); } catch {} localStorage.removeItem('karto-staff-token'); localStorage.removeItem('karto-staff'); nav('/staff'); };
  return (
    <header className="st-bar">
      <Logo size={26} />
      <nav>
        {s?.role !== 'kitchen' && <NavLink to="/staff/pos">{tt('pos')}</NavLink>}
        <NavLink to="/staff/kds">{tt('kds')}</NavLink>
        <a href="/staff/tv" target="_blank" rel="noopener">{tt('tv')}</a>
        {['manager', 'owner'].includes(s?.role) && <a href="/admin">{tt('admin')}</a>}
      </nav>
      <div className="st-bar__r"><LangSwitch /><span className="st-who">{s?.name} · {s?.role}</span><button className="btn btn--sm btn--ghost" onClick={out}>{tt('logout')}</button></div>
    </header>
  );
}

function useOrders(scope = 'active') {
  const [list, setList] = useState([]); const nav = useNavigate();
  const load = () => api('/staff/orders?scope=' + scope).then(setList).catch((e) => { if (e.status === 401) nav('/staff'); });
  useEffect(() => { load(); const id = setInterval(load, 20000); return () => clearInterval(id); }, []);
  useLive((ev) => { if (ev.type === 'order') { load(); if (ev.isNew) beep(); } });
  return [list, load];
}
function beep() { try { const a = new AudioContext(); const o = a.createOscillator(); const g = a.createGain(); o.connect(g); g.connect(a.destination); o.frequency.value = 880; g.gain.value = 0.15; o.start(); setTimeout(() => { o.frequency.value = 1320; }, 140); setTimeout(() => { o.stop(); a.close(); }, 320); } catch {} }

function describe(i, menu, L) {
  const s = [i.seasonings.map((id) => L(menu.seasonings.find((x) => x.id === id)?.name)).join(' + ')];
  for (const [id, q] of Object.entries(i.sauces || {})) s.push(q + '× ' + L(menu.sauces.find((x) => x.id === id)?.name));
  for (const [id, q] of Object.entries(i.drinks || {})) s.push(q + '× ' + L(menu.drinks.find((x) => x.id === id)?.name));
  return s;
}

// ---------------- POS ----------------
function POS() {
  const tt = useT(); const { L, lang } = useLang(); const menu = useMenu();
  const blank = { size: 'm', packaging: 'bowl', seasonings: [], sauces: {}, drinks: {}, qty: 1 };
  const [cur, setCur] = useState(blank); const [lines, setLines] = useState([]);
  const [mode, setMode] = useState('dine'); const [pay, setPay] = useState('cash'); const [disc, setDisc] = useState(0); const [cash, setCash] = useState('');
  const [msg, setMsg] = useState(null); const [last, setLast] = useState(null); const [orders, reload] = useOrders('active');
  const [shift, setShift] = useState(undefined);
  const loadShift = () => api('/staff/shift').then(setShift).catch(() => setShift(null));
  useEffect(() => { loadShift(); }, []);
  const sub = lines.reduce((a, l) => a + linePrice(l, menu), 0); const total = Math.max(0, sub - (+disc || 0));
  const change = cash ? (+cash - total) : null;
  const toggleS = (id) => setCur((c) => ({ ...c, seasonings: c.seasonings.includes(id) ? c.seasonings.filter((x) => x !== id) : c.seasonings.length < 3 ? [...c.seasonings, id] : c.seasonings }));
  const bump = (k, id, d) => setCur((c) => ({ ...c, [k]: { ...c[k], [id]: Math.max(0, (c[k][id] || 0) + d) } }));
  const addLine = () => { if (!cur.seasonings.length) { setMsg({ e: '⚠ ' + L({ uz: 'Kamida 1 ziravor', ru: 'Минимум 1 специя', en: 'At least 1 seasoning' }) }); return; } setLines([...lines, { ...cur, key: Date.now() }]); setCur(blank); setMsg(null); };
  const charge = async () => {
    try {
      const o = await api('/pos/orders', { method: 'POST', body: { mode, payment: pay, discount: +disc || 0, cashReceived: pay === 'cash' ? (+cash || total) : null, items: lines.map(({ key, ...l }) => l) } });
      setLast(o); setLines([]); setDisc(0); setCash(''); reload(); loadShift();
    } catch (e) { setMsg({ e: e.message }); }
  };
  const online = orders.filter((o) => o.channel === 'app' && ['received'].includes(o.status));
  const unpaid = orders.filter((o) => o.paymentStatus !== 'paid');
  const act = async (o, body) => { try { await api('/staff/orders/' + o.id, { method: 'PATCH', body }); reload(); } catch (e) { setMsg({ e: e.message }); } };

  if (shift === null) return <ShiftOpen onDone={loadShift} />;
  return (
    <div className="pos">
      <section className="pos__build">
        <div className="pos__row">
          {menu.sizes.map((s) => (
            <button key={s.id} className="pos-size" aria-pressed={cur.size === s.id} style={{ '--c': SIZE_BG[s.id] }} onClick={() => setCur({ ...cur, size: s.id })}>
              <b>{L(s.name)}</b><span>{s.grams} g · {fmt(s.price, lang)}</span>
            </button>
          ))}
        </div>
        <div className="pos__row">
          {menu.packaging.map((p) => (
            <button key={p.id} className="pos-pack" aria-pressed={cur.packaging === p.id} onClick={() => setCur({ ...cur, packaging: p.id })}>
              <img src={p.img.replace('.webp', '-sm.webp')} alt="" /><span>{L(p.name)}</span>
            </button>
          ))}
        </div>
        <h3 className="pos__h">{L({ uz: 'Ziravorlar', ru: 'Специи', en: 'Seasonings' })} <span className="counter">{cur.seasonings.length}/3</span></h3>
        <div className="pos__chips">
          {menu.seasonings.filter((s) => s.available !== false).map((s) => (
            <button key={s.id} className="season" aria-pressed={cur.seasonings.includes(s.id)} disabled={!cur.seasonings.includes(s.id) && cur.seasonings.length >= 3} onClick={() => toggleS(s.id)}>
              <i className="dot" style={{ background: s.color }} />{L(s.name)}
            </button>
          ))}
        </div>
        <div className="pos__addons">
          {[['sauces', menu.sauces], ['drinks', menu.drinks]].map(([k, list]) => (
            <div key={k}>
              <h3 className="pos__h">{k === 'sauces' ? L({ uz: 'Souslar', ru: 'Соусы', en: 'Sauces' }) : L({ uz: 'Ichimliklar', ru: 'Напитки', en: 'Drinks' })}</h3>
              {list.filter((x) => x.available !== false).map((x) => (
                <div key={x.id} className="pos-addon">
                  <span>{L(x.name)} <small>{fmt(x.price, lang)}</small></span>
                  <div className="stepper"><button onClick={() => bump(k, x.id, -1)} aria-label={tt('minus')}>−</button><span>{cur[k][x.id] || 0}</span><button className="plus" onClick={() => bump(k, x.id, 1)} aria-label={tt('plus')}>+</button></div>
                </div>
              ))}
            </div>
          ))}
        </div>
        <button className="btn btn--green btn--block" style={{ marginTop: 14, minHeight: 60, fontSize: 20 }} onClick={addLine}>+ {tt('add')} · {fmt(linePrice(cur, menu), lang)}</button>
        {msg?.e && <p className="st-err" role="alert">{msg.e}</p>}
      </section>

      <aside className="pos__ticket">
        <div className="pos__tk-head"><h2>{tt('ticket')}</h2>{lines.length > 0 && <button className="btn btn--sm btn--ghost" onClick={() => setLines([])}>{tt('clear')}</button>}</div>
        <div className="seg seg--3">
          {[['dine', tt('table')], ['pickup', tt('pickup')], ['delivery', tt('delivery')]].map(([id, n]) => <button key={id} aria-pressed={mode === id} onClick={() => setMode(id)}>{n}</button>)}
        </div>
        <div className="pos__lines">
          {!lines.length && <p className="muted center" style={{ padding: 30 }}>{tt('empty')}</p>}
          {lines.map((l) => (
            <div key={l.key} className="pos-line" style={{ borderLeftColor: SIZE_BG[l.size] }}>
              <div><b>{L(menu.sizes.find((s) => s.id === l.size)?.name)} · {L(menu.packaging.find((p) => p.id === l.packaging)?.name)}</b>
                <small>{describe(l, menu, L).join(' · ')}</small></div>
              <div className="pos-line__r"><b>{fmt(linePrice(l, menu), lang)}</b><button aria-label={tt('remove')} onClick={() => setLines(lines.filter((x) => x.key !== l.key))}>✕</button></div>
            </div>
          ))}
        </div>
        <div className="pos__sum">
          <div className="line"><span>{tt('discount')}</span><input className="pos-in" inputMode="numeric" value={disc || ''} onChange={(e) => setDisc(e.target.value.replace(/\D/g, ''))} placeholder="0" /></div>
          <div className="line line--total"><span>Σ</span><span>{fmt(total, lang)}</span></div>
          <div className="seg seg--3" style={{ margin: '8px 0' }}>
            {[['cash', 'Naqd / Cash'], ['card', 'Uzcard/Humo'], ['online', 'Click/Payme']].map(([id, n]) => <button key={id} aria-pressed={pay === id} onClick={() => setPay(id)}>{n}</button>)}
          </div>
          {pay === 'cash' && (<>
            <div className="line"><span>{tt('received')}</span><input className="pos-in" inputMode="numeric" value={cash} onChange={(e) => setCash(e.target.value.replace(/\D/g, ''))} placeholder={String(total)} /></div>
            <div className="pos__quick">{[50000, 100000, 200000].map((v) => <button key={v} onClick={() => setCash(String(v))}>{v / 1000}k</button>)}<button onClick={() => setCash(String(total))}>=</button></div>
            <div className="line" style={{ fontSize: 20 }}><span>{tt('change')}</span><b style={{ color: change < 0 ? 'var(--red)' : 'var(--green)' }}>{change == null ? '—' : fmt(change, lang)}</b></div>
          </>)}
          <button className="btn btn--yellow btn--block" style={{ minHeight: 64, fontSize: 21 }} disabled={!lines.length || (pay === 'cash' && change != null && change < 0)} onClick={charge}>{tt('charge')}</button>
        </div>
        {online.length > 0 && (
          <div className="pos__online">
            <h3 className="pos__h">{tt('online')} <span className="counter">{online.length}</span></h3>
            {online.map((o) => <div key={o.id} className="pos-line"><div><b>#{o.number} · {o.customer?.name}</b><small>{o.mode} · {fmt(o.total, lang)} · {o.payment}</small></div><button className="btn btn--sm btn--green" onClick={() => act(o, { status: 'confirmed' })}>{tt('accept')}</button></div>)}
          </div>
        )}
        {unpaid.length > 0 && (
          <div className="pos__online">
            <h3 className="pos__h">{tt('unpaid')}</h3>
            {unpaid.map((o) => <div key={o.id} className="pos-line"><div><b>#{o.number} · {fmt(o.total, lang)}</b><small>{o.payment} · {o.customer?.name}</small></div><button className="btn btn--sm btn--yellow" onClick={() => act(o, { paymentStatus: 'paid' })}>{tt('markPaid')}</button></div>)}
          </div>
        )}
        <ShiftClose shift={shift} onDone={loadShift} />
      </aside>
      <AnimatePresence>{last && <ReceiptModal o={last} onClose={() => setLast(null)} />}</AnimatePresence>
    </div>
  );
}

function ShiftOpen({ onDone }) {
  const tt = useT(); const [v, setV] = useState('');
  return (
    <div className="st-login"><div className="st-login__card"><Mascot size={80} /><h1>{tt('noShift')}</h1>
      <label className="field" style={{ width: '100%' }}><span>{tt('openingCash')}</span><input inputMode="numeric" value={v} onChange={(e) => setV(e.target.value.replace(/\D/g, ''))} /></label>
      <button className="btn btn--yellow btn--block" onClick={() => api('/staff/shift/open', { method: 'POST', body: { openingCash: +v || 0 } }).then(onDone)}>{tt('openShift')}</button></div></div>
  );
}
function ShiftClose({ shift, onDone }) {
  const tt = useT(); const { lang } = useLang(); const [open, setOpen] = useState(false); const [v, setV] = useState(''); const [res, setRes] = useState(null);
  if (!shift) return null;
  return (
    <div className="pos__shift">
      {!open ? <button className="btn btn--sm btn--ghost" onClick={() => setOpen(true)}>{tt('closeShift')} · {tt('expected')}: {fmt(shift.expected_cash, lang)}</button> : (
        <div className="card">
          <label className="field"><span>{tt('counted')}</span><input inputMode="numeric" value={v} onChange={(e) => setV(e.target.value.replace(/\D/g, ''))} /></label>
          {res ? <p><b>{tt('expected')}:</b> {fmt(res.expected, lang)} · <b>{tt('diff')}:</b> <span style={{ color: res.diff ? 'var(--red)' : 'var(--green)' }}>{fmt(res.diff, lang)}</span></p> : null}
          {!res ? <button className="btn btn--sm btn--red" onClick={() => api('/staff/shift/close', { method: 'POST', body: { countedCash: +v || 0 } }).then(setRes)}>{tt('closeShift')}</button>
            : <button className="btn btn--sm btn--yellow" onClick={onDone}>{tt('ok')}</button>}
        </div>)}
    </div>
  );
}

function ReceiptModal({ o, onClose }) {
  const tt = useT(); const { L, lang, t } = useLang(); const menu = useMenu();
  return (
    <motion.div className="modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="receipt print-area" initial={{ y: 40 }} animate={{ y: 0 }} onClick={(e) => e.stopPropagation()} style={{ width: 340 }}>
        <div className="center"><Logo size={26} /><div>{t('heroSlogan')}</div></div>
        <div className="center" style={{ fontSize: 44, fontWeight: 900, fontFamily: 'var(--display)' }}>#{o.number}</div>
        <div>{o.invoiceNo} · {new Date(o.createdAt).toLocaleString()}</div><hr />
        {o.items.map((i, n) => <div key={n}><div className="line" style={{ padding: 0 }}><span>{i.qty}× {L(menu.sizes.find((s) => s.id === i.size)?.name)} {i.grams}g</span><span>{fmt(i.total, lang)}</span></div><small>{describe(i, menu, L).join(' · ')}</small></div>)}
        <hr />{o.discount > 0 && <div className="line" style={{ padding: 0 }}><span>{tt('discount')}</span><span>−{fmt(o.discount, lang)}</span></div>}
        <div className="line" style={{ padding: 0, fontWeight: 900 }}><span>Σ</span><span>{fmt(o.total, lang)}</span></div>
        {o.cashReceived != null && <><div className="line" style={{ padding: 0 }}><span>{tt('received')}</span><span>{fmt(o.cashReceived, lang)}</span></div><div className="line" style={{ padding: 0 }}><span>{tt('change')}</span><span>{fmt(o.change, lang)}</span></div></>}
        <div className="center" style={{ marginTop: 8 }}>{t('thanks')}</div>
        <div className="no-print" style={{ display: 'flex', gap: 8, marginTop: 12 }}><button className="btn btn--sm btn--yellow" data-print="1" onClick={() => window.print()}>{t('print')}</button><button className="btn btn--sm btn--ghost" onClick={onClose}>{tt('ok')}</button></div>
      </motion.div>
    </motion.div>
  );
}

// ---------------- KDS ----------------
function useTick(ms = 15000) { const [, s] = useState(0); useEffect(() => { const i = setInterval(() => s((x) => x + 1), ms); return () => clearInterval(i); }, []); }
function KDS() {
  const tt = useT(); const { L } = useLang(); const menu = useMenu(); const [orders, reload] = useOrders('active'); useTick();
  const cols = [['new', tt('newO'), ['received', 'confirmed']], ['prep', tt('prep'), ['preparing']], ['ready', tt('ready'), ['ready', 'out']]];
  const move = async (o, status) => { try { await api('/staff/orders/' + o.id, { method: 'PATCH', body: { status } }); reload(); } catch (e) { alert(e.message); } };
  return (
    <div className="kds">
      {cols.map(([id, name, sts]) => {
        const list = orders.filter((o) => sts.includes(o.status));
        return (
          <section key={id} className={'kds__col kds__col--' + id}>
            <h2>{name} <span>{list.length}</span></h2>
            <AnimatePresence>
              {list.map((o) => {
                const mins = Math.floor((Date.now() - new Date(o.createdAt)) / 60000);
                return (
                  <motion.article layout key={o.id} className={'kds-card' + (mins >= 8 && id !== 'ready' ? ' late' : '')} initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: 60 }}>
                    <header><b>#{o.number}</b><span className="kds-tag">{o.channel === 'app' ? 'APP' : 'POS'} · {tt(o.mode === 'dine' ? 'table' : o.mode)}</span><span className="kds-time">{mins} {tt('mins')}</span></header>
                    {o.items.map((i, n) => (
                      <div key={n} className="kds-item" style={{ borderLeftColor: SIZE_BG[i.size] }}>
                        <div className="kds-item__h"><span>{i.qty}×</span> {L(menu.sizes.find((s) => s.id === i.size)?.name)} <small>{i.grams} g · {L(menu.packaging.find((p) => p.id === i.packaging)?.name)}</small></div>
                        <ul>{describe(i, menu, L).map((d, k) => <li key={k}>{d}</li>)}</ul>
                      </div>
                    ))}
                    {o.customer?.note && <p className="kds-note">“{o.customer.note}”</p>}
                    <footer>
                      {id === 'new' && <button className="btn btn--yellow btn--block" onClick={() => move(o, 'preparing')}>{tt('start')} →</button>}
                      {id === 'prep' && <button className="btn btn--green btn--block" onClick={() => move(o, 'ready')}>{tt('ready')} ✓</button>}
                      {id === 'ready' && (o.mode === 'delivery' && o.status !== 'out'
                        ? <button className="btn btn--yellow btn--block" onClick={() => move(o, 'out')}>{tt('send')}</button>
                        : <button className="btn btn--ghost btn--block" onClick={() => move(o, 'completed')}>{tt('done')}</button>)}
                    </footer>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </section>
        );
      })}
    </div>
  );
}

// ---------------- TV board (public) ----------------
export function TV() {
  const tt = useT(); const { L, lang, t } = useLang(); const menu = useMenu(); const [b, setB] = useState({ preparing: [], ready: [] }); const [slide, setSlide] = useState(0);
  const load = () => fetch('/api/board').then((r) => r.json()).then(setB).catch(() => {});
  useEffect(() => { load(); const i = setInterval(load, 15000); const j = setInterval(() => setSlide((s) => s + 1), 7000); return () => { clearInterval(i); clearInterval(j); }; }, []);
  useLive((ev) => ev.type === 'order' && load());
  const imgs = ['/img/karto-packaging-family.png'];
  return (
    <div className="tv">
      <section className="tv__menu">
      <div className="tv__head"><Logo size={56} /><span>{t('heroSlogan')}</span></div>
        <div className="tv__sizes">
          {menu.sizes.map((s) => <div key={s.id} className="tv-size" style={{ background: '#FFFFFF', color: 'var(--ink)' }}><b>{L(s.name)}</b><span>{s.grams} g</span><strong>{fmt(s.price, lang)}</strong></div>)}
        </div>
        <div className="tv__photo">
          <AnimatePresence mode="wait"><motion.img key={slide % imgs.length} src={imgs[slide % imgs.length]} alt="" initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} /></AnimatePresence>
          <div className="tv__flav">{menu.seasonings.map((s) => <span key={s.id} className="chip"><i className="dot" style={{ background: s.color }} />{L(s.name)}</span>)}</div>
        </div>
      </section>
      <section className="tv__orders">
        <div className="tv__col"><h2>{tt('nowPreparing')}</h2><div className="tv__nums">{b.preparing.map((n) => <motion.span layout key={n}>{n}</motion.span>)}</div></div>
        <div className="tv__col tv__col--ready"><h2>{tt('nowReady')}</h2><div className="tv__nums">{b.ready.map((n) => <motion.span layout initial={{ scale: 2 }} animate={{ scale: 1 }} key={n}>{n}</motion.span>)}</div><Mascot size={140} /></div>
      </section>
    </div>
  );
}

function Guard({ children }) {
  const authed = !!(() => { try { return localStorage.getItem('karto-staff-token'); } catch { return null; } })();
  return authed ? children : <Navigate to="/staff" />;
}
export default function Staff() {
  return (
    <Routes>
      <Route index element={<Login />} />
      <Route path="tv" element={<TV />} />
      <Route path="pos" element={<Guard><div className="st"><StaffBar /><POS /></div></Guard>} />
      <Route path="kds" element={<Guard><div className="st st--dark"><StaffBar /><KDS /></div></Guard>} />
    </Routes>
  );
}
