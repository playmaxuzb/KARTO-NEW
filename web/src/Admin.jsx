import { useEffect, useState } from 'react';
import { NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { Logo, Mascot } from './brand.jsx';
import { useLang, LangSwitch } from './i18n.jsx';
import { fmt } from './data.js';
import { api, useLive } from './api.js';
import './admin.css';

const today = () => new Date().toISOString().slice(0, 10);
const daysAgo = (n) => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10);
const SIZE_C = { s: '#FFC21A', m: '#EE6A1F', l: '#D7332A' };
const me = () => { try { return JSON.parse(localStorage.getItem('karto-staff') || 'null'); } catch { return null; } };
const N = (n) => String(Math.round(n || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

const TX = {
  uz: { dash: 'Boshqaruv paneli', orders: 'Buyurtmalar va cheklar', menu: 'Menyu va narxlar', stock: 'Ombor', exp: 'Xarajatlar', staff: 'Xodimlar', settings: 'Sozlamalar', audit: 'Audit jurnali',
    netSales: 'Sof savdo', grossProfit: 'Yalpi foyda', netProfit: 'Sof foyda', ordersN: 'Buyurtmalar', aov: 'O‘rtacha chek', cogs: 'Tannarx (COGS)', opex: 'Operatsion xarajatlar', payroll: 'Ish haqi (hisoblangan)',
    period: 'Davr', today: 'Bugun', week: '7 kun', month: '30 kun', bySize: 'O‘lcham bo‘yicha', bySeason: 'Ziravorlar', byPay: 'To‘lov usullari', byChannel: 'Kanallar', byDay: 'Kunlik savdo', lowStock: 'Kam qolgan mahsulotlar',
    search: 'Chek, buyurtma, mijoz yoki telefon bo‘yicha qidirish', save: 'Saqlash', saved: 'Saqlandi ✓', price: 'Narx', available: 'Mavjud', add: 'Qo‘shish', qty: 'Miqdor', reason: 'Sabab', unitCost: 'Birlik narxi',
    category: 'Toifa', amount: 'Summa', date: 'Sana', note: 'Izoh', name: 'Ism', role: 'Rol', salary: 'Oylik maosh', pin: 'Yangi PIN', active: 'Faol', maintenance: 'Texnik xizmat rejimi',
    maintMsg: 'Mijozlarga xabar', ordering: 'Onlayn buyurtma', delivery: 'Yetkazib berish', branch: 'Filial ma’lumotlari', refund: 'Qaytarish', cancelO: 'Bekor qilish', history: 'Tarix', back: 'Orqaga' },
  ru: { dash: 'Панель управления', orders: 'Заказы и чеки', menu: 'Меню и цены', stock: 'Склад', exp: 'Расходы', staff: 'Сотрудники', settings: 'Настройки', audit: 'Журнал действий',
    netSales: 'Чистые продажи', grossProfit: 'Валовая прибыль', netProfit: 'Чистая прибыль', ordersN: 'Заказы', aov: 'Средний чек', cogs: 'Себестоимость (COGS)', opex: 'Операционные расходы', payroll: 'Зарплата (начислено)',
    period: 'Период', today: 'Сегодня', week: '7 дней', month: '30 дней', bySize: 'По размерам', bySeason: 'Специи', byPay: 'Способы оплаты', byChannel: 'Каналы', byDay: 'Продажи по дням', lowStock: 'Заканчивается на складе',
    search: 'Поиск по чеку, заказу, клиенту или телефону', save: 'Сохранить', saved: 'Сохранено ✓', price: 'Цена', available: 'В наличии', add: 'Добавить', qty: 'Количество', reason: 'Причина', unitCost: 'Цена за единицу',
    category: 'Категория', amount: 'Сумма', date: 'Дата', note: 'Комментарий', name: 'Имя', role: 'Роль', salary: 'Оклад в месяц', pin: 'Новый PIN', active: 'Активен', maintenance: 'Режим обслуживания',
    maintMsg: 'Сообщение клиентам', ordering: 'Онлайн-заказы', delivery: 'Доставка', branch: 'Данные филиала', refund: 'Возврат', cancelO: 'Отменить', history: 'История', back: 'Назад' },
  en: { dash: 'Dashboard', orders: 'Orders & invoices', menu: 'Menu & prices', stock: 'Inventory', exp: 'Expenses', staff: 'Staff', settings: 'Settings', audit: 'Audit log',
    netSales: 'Net sales', grossProfit: 'Gross profit', netProfit: 'Net profit', ordersN: 'Orders', aov: 'Avg. order', cogs: 'COGS', opex: 'Operating expenses', payroll: 'Payroll (accrued)',
    period: 'Period', today: 'Today', week: '7 days', month: '30 days', bySize: 'By size', bySeason: 'Seasonings', byPay: 'Payment methods', byChannel: 'Channels', byDay: 'Daily sales', lowStock: 'Low stock',
    search: 'Search invoice, order, customer or phone', save: 'Save', saved: 'Saved ✓', price: 'Price', available: 'Available', add: 'Add', qty: 'Quantity', reason: 'Reason', unitCost: 'Unit cost',
    category: 'Category', amount: 'Amount', date: 'Date', note: 'Note', name: 'Name', role: 'Role', salary: 'Monthly salary', pin: 'New PIN', active: 'Active', maintenance: 'Maintenance mode',
    maintMsg: 'Message to customers', ordering: 'Online ordering', delivery: 'Delivery', branch: 'Branch details', refund: 'Refund', cancelO: 'Cancel', history: 'History', back: 'Back' },
};
function useT() { const { lang } = useLang(); return (k) => TX[lang][k] ?? TX.en[k] ?? k; }

function Bars({ data, colors = {}, labels = {}, money }) {
  const entries = Object.entries(data || {}); const max = Math.max(1, ...entries.map(([, v]) => v));
  if (!entries.length) return <p className="muted">—</p>;
  return (
    <div className="bars">
      {entries.sort((a, b) => b[1] - a[1]).map(([k, v]) => (
        <div className="bars__r" key={k}>
          <span className="bars__l">{labels[k] || k}</span>
          <div className="bars__t"><i style={{ width: (v / max) * 100 + '%', background: colors[k] || 'var(--green)' }} /></div>
          <b>{money ? N(v) : v}</b>
        </div>
      ))}
    </div>
  );
}

function Dashboard() {
  const t = useT(); const { L, lang } = useLang(); const [range, setRange] = useState([today(), today()]); const [r, setR] = useState(null); const [menu, setMenu] = useState(null);
  const load = () => api(`/admin/report?from=${range[0]}&to=${range[1]}`).then(setR).catch(() => {});
  useEffect(() => { load(); }, [range]);
  useEffect(() => { api('/menu').then(setMenu); }, []);
  useLive((e) => e.type === 'order' && load());
  if (!r || !menu) return <p>…</p>;
  const lbl = (list) => Object.fromEntries(list.map((x) => [x.id, L(x.name)]));
  const days = Object.entries(r.byDay).sort(); const maxD = Math.max(1, ...days.map(([, v]) => v));
  return (
    <div>
      <div className="ad-head"><h1>{t('dash')}</h1>
        <div className="seg seg--3" style={{ width: 360 }}>
          {[['today', [today(), today()]], ['week', [daysAgo(6), today()]], ['month', [daysAgo(29), today()]]].map(([k, v]) => <button key={k} aria-pressed={range[0] === v[0] && range[1] === v[1]} onClick={() => setRange(v)}>{t(k)}</button>)}
        </div>
      </div>
      <div className="kpis">
        <div className="kpi kpi--y"><small>{t('netSales')}</small><b>{N(r.net)}</b><span>UZS</span></div>
        <div className="kpi"><small>{t('ordersN')}</small><b>{r.orders}</b><span>{t('aov')}: {N(r.aov)}</span></div>
        <div className="kpi"><small>{t('grossProfit')}</small><b>{N(r.grossProfit)}</b><span>{r.net ? Math.round(r.grossProfit / r.net * 100) : 0}% · {t('cogs')} {N(r.cogs)}</span></div>
        <div className={'kpi ' + (r.netProfit >= 0 ? 'kpi--g' : 'kpi--r')}><small>{t('netProfit')}</small><b>{N(r.netProfit)}</b><span>{t('opex')} {N(r.opex)} · {t('payroll')} {N(r.payroll)}</span></div>
      </div>
      <div className="ad-grid">
        <div className="panel panel--wide"><h3>{t('byDay')}</h3>
          <div className="cols">{days.map(([d, v]) => <div key={d} className="cols__c" title={d + ': ' + N(v)}><i style={{ height: (v / maxD) * 100 + '%' }} /><small>{d.slice(5)}</small></div>)}</div>
        </div>
        <div className="panel"><h3>{t('bySize')}</h3><Bars data={r.bySize} colors={SIZE_C} labels={lbl(menu.sizes)} /></div>
        <div className="panel"><h3>{t('bySeason')}</h3><Bars data={r.bySeason} colors={Object.fromEntries(menu.seasonings.map((s) => [s.id, s.color]))} labels={lbl(menu.seasonings)} /></div>
        <div className="panel"><h3>{t('byPay')}</h3><Bars data={r.byPayment} money colors={{ cash: '#1D5A3A', card: '#EE6A1F', online: '#FFC21A' }} /></div>
        <div className="panel"><h3>{t('byChannel')}</h3><Bars data={r.byChannel} money colors={{ app: '#EE6A1F', pos: '#1D5A3A' }} labels={{ app: 'App', pos: 'POS' }} /></div>
        <div className="panel"><h3>{t('lowStock')}</h3>{r.lowStock.length ? r.lowStock.map((i) => <div className="row" key={i.id}><span>{i.name}</span><b style={{ color: 'var(--red)' }}>{+i.qty.toFixed(2)} {i.unit}</b></div>) : <p className="muted">✓</p>}</div>
      </div>
      <p className="muted" style={{ fontSize: 13, marginTop: 18 }}>Net sales = sales − discounts (cancelled/refunded excluded). Gross profit = net sales − recipe-based COGS. Net profit = gross profit − recorded expenses − payroll accrued for {r.days} day(s) (monthly salary ÷ 30 × days). Confirm tax treatment with a local accountant.</p>
    </div>
  );
}

function Orders() {
  const t = useT(); const { L, lang } = useLang(); const [q, setQ] = useState(''); const [list, setList] = useState([]); const [sel, setSel] = useState(null); const [hist, setHist] = useState([]);
  const load = () => api('/admin/orders?q=' + encodeURIComponent(q)).then(setList).catch(() => {});
  useEffect(() => { const id = setTimeout(load, 250); return () => clearTimeout(id); }, [q]);
  const open = (o) => { setSel(o); api('/admin/orders/' + o.id + '/history').then((h) => setHist(h.events)); };
  const act = async (status) => { const reason = prompt(t('reason')); if (!reason) return; try { const o = await api('/staff/orders/' + sel.id, { method: 'PATCH', body: { status, reason } }); open(o); load(); } catch (e) { alert(e.message); } };
  return (
    <div>
      <div className="ad-head"><h1>{t('orders')}</h1></div>
      <input className="ad-search" placeholder={t('search')} value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="ad-split">
        <div className="panel" style={{ padding: 0, overflow: 'auto' }}>
          <table className="tbl"><thead><tr><th>Invoice</th><th>#</th><th>Customer</th><th>Channel</th><th>Status</th><th>Payment</th><th style={{ textAlign: 'right' }}>Total</th><th>Date</th></tr></thead>
            <tbody>{list.map((o) => (
              <tr key={o.id} onClick={() => open(o)} className={sel?.id === o.id ? 'sel' : ''}>
                <td><b>{o.invoiceNo}</b></td><td>{o.number}</td><td>{o.customer?.name || '—'}<br /><small>{o.customer?.phone}</small></td><td>{o.channel}</td>
                <td><span className={'st st-' + o.status}>{o.status}</span></td><td>{o.payment} · {o.paymentStatus}</td><td style={{ textAlign: 'right' }}>{N(o.total)}</td><td><small>{new Date(o.createdAt).toLocaleString()}</small></td>
              </tr>))}</tbody></table>
        </div>
        {sel && (
          <div className="panel">
            <h3>{sel.invoiceNo} · #{sel.number}</h3>
            <p className="muted">{sel.ref} · {sel.mode} · {new Date(sel.createdAt).toLocaleString()}</p>
            <p><b>{sel.customer?.name}</b> {sel.customer?.phone} {sel.customer?.address}</p>
            {sel.items.map((i, n) => <div key={n} className="row"><span>{i.qty}× {i.size.toUpperCase()} {i.grams}g · {i.packaging} · {i.seasonings.join(', ')}</span><b>{N(i.total)}</b></div>)}
            <div className="row"><span>Discount</span><b>−{N(sel.discount)}</b></div><div className="row"><span>Delivery</span><b>{N(sel.deliveryFee)}</b></div>
            <div className="row" style={{ fontSize: 20 }}><span>Total</span><b>{N(sel.total)}</b></div>
            {sel.voidReason && <p style={{ color: 'var(--red)' }}><b>{t('reason')}:</b> {sel.voidReason}</p>}
            <h3 style={{ marginTop: 14 }}>{t('history')}</h3>
            {hist.map((h) => <div key={h.id} className="row"><span>{h.status} {h.note ? '· ' + h.note : ''}</span><small>{h.staff || 'customer'} · {new Date(h.at).toLocaleTimeString()}</small></div>)}
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              {sel.status !== 'completed' && !['cancelled', 'refunded'].includes(sel.status) && <button className="btn btn--sm btn--ghost" onClick={() => act('cancelled')}>{t('cancelO')}</button>}
              {sel.status === 'completed' && <button className="btn btn--sm btn--red" onClick={() => act('refunded')}>{t('refund')}</button>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MenuEditor() {
  const t = useT(); const [m, setM] = useState(null); const [ok, setOk] = useState('');
  useEffect(() => { api('/menu').then(setM); }, []);
  if (!m) return <p>…</p>;
  const upd = (k, i, patch) => setM({ ...m, [k]: m[k].map((x, j) => (j === i ? { ...x, ...patch } : x)) });
  const save = async () => { try { await api('/admin/menu', { method: 'PUT', body: m }); setOk(t('saved')); setTimeout(() => setOk(''), 2000); } catch (e) { alert(e.message); } };
  const Group = ({ k, title, price = true }) => (
    <div className="panel" key={k}>
      <h3>{title}</h3>
      <table className="tbl"><thead><tr><th>ID</th><th>UZ</th><th>RU</th><th>EN</th>{price && <th>{t('price')}</th>}<th>{t('available')}</th></tr></thead>
        <tbody>{m[k].map((x, i) => (
          <tr key={x.id + i}>
            <td><b>{x.id}</b>{k === 'sizes' && <><br /><input className="in-s" type="number" value={x.grams} onChange={(e) => upd(k, i, { grams: +e.target.value })} /> g</>}</td>
            {['uz', 'ru', 'en'].map((l) => <td key={l}><input className="in" value={x.name[l]} onChange={(e) => upd(k, i, { name: { ...x.name, [l]: e.target.value } })} /></td>)}
            {price && <td><input className="in-s" type="number" value={x.price} onChange={(e) => upd(k, i, { price: +e.target.value })} /></td>}
            <td><input type="checkbox" checked={x.available !== false} onChange={(e) => upd(k, i, { available: e.target.checked })} aria-label={t('available')} /></td>
          </tr>))}</tbody></table>
      {k !== 'sizes' && k !== 'packaging' && <button className="btn btn--sm btn--ghost" style={{ marginTop: 10 }} onClick={() => { const id = prompt('ID (latin, no spaces)'); if (id) setM({ ...m, [k]: [...m[k], { id, price: 0, color: '#FFC21A', name: { uz: id, ru: id, en: id } }] }); }}>+ {t('add')}</button>}
    </div>
  );
  return (
    <div>
      <div className="ad-head"><h1>{t('menu')}</h1><div style={{ display: 'flex', gap: 10, alignItems: 'center' }}><b style={{ color: 'var(--green)' }}>{ok}</b><button className="btn btn--yellow" onClick={save}>{t('save')}</button></div></div>
      <div className="panel" style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 16 }}>
        <label className="field"><span>Extra seasoning price</span><input type="number" value={m.extraSeasoningPrice} onChange={(e) => setM({ ...m, extraSeasoningPrice: +e.target.value })} /></label>
        <label className="field"><span>Max seasonings</span><input type="number" min="1" max="5" value={m.maxSeasonings} onChange={(e) => setM({ ...m, maxSeasonings: +e.target.value })} /></label>
        <label className="field"><span>Delivery fee</span><input type="number" value={m.deliveryFee ?? 0} onChange={(e) => setM({ ...m, deliveryFee: +e.target.value })} /></label>
      </div>
      <div className="ad-stack">
        {Group({ k: 'sizes', title: 'Sizes' })}{Group({ k: 'packaging', title: 'Packaging', price: false })}{Group({ k: 'seasonings', title: 'Seasonings', price: false })}
        {Group({ k: 'sauces', title: 'Sauces' })}{Group({ k: 'drinks', title: 'Drinks' })}
      </div>
    </div>
  );
}

function Stock() {
  const t = useT(); const [list, setList] = useState([]); const [f, setF] = useState({ itemId: '', delta: '', reason: 'purchase', unitCost: '', note: '' });
  const load = () => api('/admin/inventory').then(setList); useEffect(() => { load(); }, []);
  const submit = async (e) => { e.preventDefault(); const d = +f.delta * (['waste'].includes(f.reason) ? -1 : 1); try { await api('/admin/inventory/move', { method: 'POST', body: { ...f, delta: d, unitCost: +f.unitCost || undefined } }); setF({ ...f, delta: '', note: '' }); load(); } catch (er) { alert(er.message); } };
  return (
    <div>
      <div className="ad-head"><h1>{t('stock')}</h1></div>
      <form className="panel ad-form" onSubmit={submit}>
        <label className="field"><span>Item</span><select value={f.itemId} onChange={(e) => setF({ ...f, itemId: e.target.value })} required><option value="">—</option>{list.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}</select></label>
        <label className="field"><span>{t('reason')}</span><select value={f.reason} onChange={(e) => setF({ ...f, reason: e.target.value })}><option value="purchase">Purchase / delivery</option><option value="waste">Waste / spoilage</option><option value="count">Stock count adjustment (±)</option><option value="return">Return</option></select></label>
        <label className="field"><span>{t('qty')}</span><input type="number" step="any" value={f.delta} onChange={(e) => setF({ ...f, delta: e.target.value })} required /></label>
        {f.reason === 'purchase' && <label className="field"><span>{t('unitCost')}</span><input type="number" value={f.unitCost} onChange={(e) => setF({ ...f, unitCost: e.target.value })} /></label>}
        <label className="field"><span>{t('note')}</span><input value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} /></label>
        <button className="btn btn--green">{t('save')}</button>
      </form>
      <div className="panel" style={{ padding: 0 }}>
        <table className="tbl"><thead><tr><th>Item</th><th style={{ textAlign: 'right' }}>On hand</th><th>Unit</th><th style={{ textAlign: 'right' }}>Reorder at</th><th style={{ textAlign: 'right' }}>{t('unitCost')}</th><th style={{ textAlign: 'right' }}>Value</th></tr></thead>
          <tbody>{list.map((i) => <tr key={i.id} className={i.qty <= i.reorder ? 'low' : ''}><td>{i.name}</td><td style={{ textAlign: 'right' }}><b>{+i.qty.toFixed(2)}</b></td><td>{i.unit}</td><td style={{ textAlign: 'right' }}>{i.reorder}</td><td style={{ textAlign: 'right' }}>{N(i.unit_cost)}</td><td style={{ textAlign: 'right' }}>{N(i.qty * i.unit_cost)}</td></tr>)}</tbody></table>
      </div>
    </div>
  );
}

function Expenses() {
  const t = useT(); const [list, setList] = useState([]); const [f, setF] = useState({ date: today(), category: 'rent', amount: '', note: '' });
  const load = () => api('/admin/expenses').then(setList); useEffect(() => { load(); }, []);
  const submit = async (e) => { e.preventDefault(); try { await api('/admin/expenses', { method: 'POST', body: f }); setF({ ...f, amount: '', note: '' }); load(); } catch (er) { alert(er.message); } };
  return (
    <div>
      <div className="ad-head"><h1>{t('exp')}</h1></div>
      <form className="panel ad-form" onSubmit={submit}>
        <label className="field"><span>{t('date')}</span><input type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} /></label>
        <label className="field"><span>{t('category')}</span><select value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })}>{['rent', 'utilities', 'internet', 'maintenance', 'marketing', 'delivery', 'payment fees', 'software', 'supplies', 'tax', 'other'].map((c) => <option key={c}>{c}</option>)}</select></label>
        <label className="field"><span>{t('amount')}</span><input type="number" value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value })} required /></label>
        <label className="field"><span>{t('note')}</span><input value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} /></label>
        <button className="btn btn--green">{t('add')}</button>
      </form>
      <div className="panel" style={{ padding: 0 }}><table className="tbl"><thead><tr><th>{t('date')}</th><th>{t('category')}</th><th>{t('note')}</th><th style={{ textAlign: 'right' }}>{t('amount')}</th></tr></thead>
        <tbody>{list.map((x) => <tr key={x.id}><td>{x.date}</td><td>{x.category}</td><td>{x.note}</td><td style={{ textAlign: 'right' }}><b>{N(x.amount)}</b></td></tr>)}</tbody></table></div>
      <p className="muted" style={{ fontSize: 13 }}>Salaries are not entered here: they are accrued automatically from each employee’s monthly salary in Staff.</p>
    </div>
  );
}

function Staff() {
  const t = useT(); const [list, setList] = useState([]); const [f, setF] = useState(null); const [err, setErr] = useState('');
  const load = () => api('/admin/staff').then(setList).catch((e) => setErr(e.message)); useEffect(() => { load(); }, []);
  const save = async (e) => { e.preventDefault(); try { await api('/admin/staff', { method: 'POST', body: f }); setF(null); load(); } catch (er) { alert(er.message); } };
  if (err) return <p className="st-err">{err}</p>;
  return (
    <div>
      <div className="ad-head"><h1>{t('staff')}</h1><button className="btn btn--yellow" onClick={() => setF({ name: '', role: 'cashier', pin: '', monthly_salary: 0, active: true })}>+ {t('add')}</button></div>
      {f && <form className="panel ad-form" onSubmit={save}>
        <label className="field"><span>{t('name')}</span><input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required /></label>
        <label className="field"><span>{t('role')}</span><select value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })}>{['cashier', 'kitchen', 'manager', 'owner'].map((r) => <option key={r}>{r}</option>)}</select></label>
        <label className="field"><span>{t('salary')}</span><input type="number" value={f.monthly_salary} onChange={(e) => setF({ ...f, monthly_salary: e.target.value })} /></label>
        <label className="field"><span>{t('pin')}</span><input inputMode="numeric" value={f.pin || ''} onChange={(e) => setF({ ...f, pin: e.target.value.replace(/\D/g, '') })} placeholder="4–8" /></label>
        <label className="field" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><input type="checkbox" style={{ width: 22, minHeight: 22 }} checked={!!f.active} onChange={(e) => setF({ ...f, active: e.target.checked })} /><span style={{ margin: 0 }}>{t('active')}</span></label>
        <button className="btn btn--green">{t('save')}</button>
      </form>}
      <div className="panel" style={{ padding: 0 }}><table className="tbl"><thead><tr><th>{t('name')}</th><th>{t('role')}</th><th style={{ textAlign: 'right' }}>{t('salary')}</th><th>{t('active')}</th><th /></tr></thead>
        <tbody>{list.map((s) => <tr key={s.id}><td><b>{s.name}</b></td><td>{s.role}</td><td style={{ textAlign: 'right' }}>{N(s.monthly_salary)}</td><td>{s.active ? '✓' : '—'}</td><td><button className="btn btn--sm btn--ghost" onClick={() => setF({ ...s, pin: '', active: !!s.active })}>✎</button></td></tr>)}</tbody></table></div>
    </div>
  );
}

function Settings() {
  const t = useT(); const [s, setS] = useState(null); const [ok, setOk] = useState('');
  useEffect(() => { api('/admin/settings').then(setS); }, []);
  if (!s) return <p>…</p>;
  const m = s.maintenance; const b = s.branch;
  const setM = (p) => setS({ ...s, maintenance: { ...m, ...p } }); const setB = (p) => setS({ ...s, branch: { ...b, ...p } });
  const save = async () => { await api('/admin/settings', { method: 'PUT', body: s }); setOk(t('saved')); setTimeout(() => setOk(''), 2000); };
  return (
    <div>
      <div className="ad-head"><h1>{t('settings')}</h1><div style={{ display: 'flex', gap: 10, alignItems: 'center' }}><b style={{ color: 'var(--green)' }}>{ok}</b><button className="btn btn--yellow" onClick={save}>{t('save')}</button></div></div>
      <div className="ad-grid">
        <div className="panel">
          <h3>{t('maintenance')}</h3>
          <label className="toggle"><input type="checkbox" checked={m.enabled} onChange={(e) => setM({ enabled: e.target.checked })} /> {t('maintenance')}</label>
          <label className="toggle"><input type="checkbox" checked={m.ordering !== false} onChange={(e) => setM({ ordering: e.target.checked })} /> {t('ordering')}</label>
          <label className="toggle"><input type="checkbox" checked={m.delivery !== false} onChange={(e) => setM({ delivery: e.target.checked })} /> {t('delivery')}</label>
          {['uz', 'ru', 'en'].map((l) => <label className="field" key={l}><span>{t('maintMsg')} ({l.toUpperCase()})</span><textarea rows="2" value={m.message?.[l] || ''} onChange={(e) => setM({ message: { ...m.message, [l]: e.target.value } })} /></label>)}
          <label className="field"><span>Return time (only if confirmed)</span><input value={m.returnAt || ''} onChange={(e) => setM({ returnAt: e.target.value })} placeholder="18:00" /></label>
        </div>
        <div className="panel">
          <h3>{t('branch')}</h3>
          {['uz', 'ru', 'en'].map((l) => <label className="field" key={l}><span>Address ({l.toUpperCase()})</span><input value={b.address?.[l] || ''} onChange={(e) => setB({ address: { ...b.address, [l]: e.target.value } })} /></label>)}
          {['phone', 'hours', 'instagram', 'telegram'].map((k) => <label className="field" key={k}><span>{k}</span><input value={b[k] || ''} onChange={(e) => setB({ [k]: e.target.value })} /></label>)}
        </div>
      </div>
    </div>
  );
}

function Audit() {
  const t = useT(); const [list, setList] = useState([]); useEffect(() => { api('/admin/audit').then(setList).catch(() => {}); }, []);
  return (<div><div className="ad-head"><h1>{t('audit')}</h1></div>
    <div className="panel" style={{ padding: 0 }}><table className="tbl"><thead><tr><th>Time</th><th>Staff</th><th>Action</th><th>Entity</th><th>Details</th></tr></thead>
      <tbody>{list.map((a) => <tr key={a.id}><td><small>{new Date(a.at).toLocaleString()}</small></td><td>{a.staff || '—'}</td><td>{a.action}</td><td>{a.entity} {a.entity_id}</td><td><small style={{ wordBreak: 'break-all' }}>{(a.after || '').slice(0, 120)}</small></td></tr>)}</tbody></table></div></div>);
}

export default function Admin() { return <Routes><Route path="*" element={<AdminShell />} /></Routes>; }
function AdminShell() {
  const t = useT(); const nav = useNavigate(); const u = me();
  if (!u || !['manager', 'owner'].includes(u.role)) return <Navigate to="/staff" />;
  const out = () => { localStorage.removeItem('karto-staff-token'); localStorage.removeItem('karto-staff'); nav('/staff'); };
  const links = [['', 'dash'], ['orders', 'orders'], ['menu', 'menu'], ['stock', 'stock'], ['expenses', 'exp'], ...(u.role === 'owner' ? [['staff', 'staff'], ['audit', 'audit']] : []), ['settings', 'settings']];
  return (
    <div className="ad">
      <aside className="ad-side">
        <div style={{ padding: '6px 8px 18px' }}><Logo size={30} /></div>
        <nav>{links.map(([p, k]) => <NavLink key={k} to={'/admin' + (p ? '/' + p : '')} end>{t(k)}</NavLink>)}</nav>
        <div className="ad-side__b">
          <a className="ad-ext" href="/staff/pos">POS →</a><a className="ad-ext" href="/staff/kds">Kitchen →</a><a className="ad-ext" href="/staff/tv" target="_blank" rel="noopener">TV →</a><a className="ad-ext" href="/" target="_blank" rel="noopener">Website →</a>
          <LangSwitch /><div style={{ fontWeight: 800, fontSize: 14 }}>{u.name} · {u.role}</div><button className="btn btn--sm btn--ghost" onClick={out}>Log out</button>
          <Mascot size={70} />
        </div>
      </aside>
      <main className="ad-main">
        <Routes>
          <Route index element={<Dashboard />} /><Route path="orders" element={<Orders />} /><Route path="menu" element={<MenuEditor />} /><Route path="stock" element={<Stock />} />
          <Route path="expenses" element={<Expenses />} /><Route path="staff" element={<Staff />} /><Route path="audit" element={<Audit />} /><Route path="settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}
