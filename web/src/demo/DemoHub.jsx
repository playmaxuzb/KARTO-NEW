import { Link } from 'react-router-dom';
import { Logo, Mascot, Checker } from '../brand.jsx';
import { LangSwitch } from '../i18n.jsx';
import { resetDemo } from './mockServer.js';
import { useState } from 'react';

const P = [
  { to: '/site', c: '#FFFFFF', fg: 'var(--ink)', t: 'موقع الشركة', who: 'للزبائن', d: 'تعريف بالبراند، المنيو والأسعار، القصة، التواصل، وزر التطبيق. بثلاث لغات.' },
  { to: '/app', c: '#FFFFFF', fg: 'var(--ink)', t: 'تطبيق الزبون', who: 'للزبائن · موبايل', d: 'ركّب طلبك: الحجم ← التقديم ← حتى 3 نكهات ← صوص ← مشروب. سلة، دفع، تتبع، فاتورة.' },
  { to: '/staff/pos', c: '#FFFFFF', fg: 'var(--ink)', t: 'الكاشير (POS)', who: 'PIN: 3333', d: 'طلبات المحل، حساب الباقي، قبول طلبات التطبيق، تسجيل الدفع، فتح وإغلاق الوردية.' },
  { to: '/staff/kds', c: '#FFFFFF', fg: 'var(--ink)', t: 'شاشة المطبخ', who: 'PIN: 4444', d: 'الطلبات بتوصل لحالها: جديد ← قيد التحضير ← جاهز ← تم التسليم.' },
  { to: '/staff/tv', c: '#FFFFFF', fg: 'var(--ink)', t: 'شاشة التلفزيون', who: 'للمحل', d: 'منيو بالصور وأرقام الطلبات قيد التحضير والجاهزة.' },
  { to: '/admin', c: '#FFFFFF', fg: 'var(--ink)', t: 'لوحة المالك', who: 'PIN: 1111 (مالك) · 2222 (مدير)', d: 'الأرباح، الفواتير، المنيو والأسعار، المخزون، المصاريف، الموظفين، الصيانة.' },
];

export default function DemoHub() {
  const [done, setDone] = useState(false);
  return (
    <div dir="rtl" style={{ minHeight: '100dvh', background: 'var(--cream)' }}>
      <header style={{ background: '#FFFFFF', color: 'var(--ink)', borderBottom: '3px solid var(--yellow)' }}>
        <div className="wrap" style={{ padding: '28px 0 34px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 22 }}>
          <Mascot size={96} />
          <div style={{ flex: '1 1 320px', minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}><Logo size={40} mascot={false} /><LangSwitch /></div>
            <h1 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, marginTop: 10 }}>النسخة التجريبية — النظام كامل</h1>
            <p style={{ margin: '8px 0 0', fontWeight: 700, color: 'var(--ink-2)' }}>كل البرامج متصلة ببعض: أي طلب بتعمله بالتطبيق بيوصل للكاشير والمطبخ والتلفزيون ولوحة المالك. هذه نسخة استعراض ببيانات تجريبية محفوظة في هذا المتصفح.</p>
          </div>
        </div>
        <Checker color="var(--yellow)" />
      </header>
      <main className="wrap" style={{ padding: '36px 0 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 18 }}>
          {P.map((p) => (
            <Link key={p.t} to={p.to} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ background: '#FFFFFF', border: '2px solid var(--yellow)', borderRadius: 26, overflow: 'hidden', boxShadow: '0 10px 26px rgba(36, 26, 20, .08)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ background: p.c, color: p.fg, padding: '18px 20px', borderBottom: '1px solid #F2E1B4' }}>
                  <div style={{ fontFamily: 'var(--display)', fontWeight: 900, fontSize: 24 }}>{p.t}</div>
                  <div style={{ fontWeight: 800, fontSize: 14, opacity: .9 }}>{p.who}</div>
                </div>
                <p style={{ margin: 0, padding: '16px 20px', fontWeight: 700, color: 'var(--ink-2)', flex: 1 }}>{p.d}</p>
                <div style={{ padding: '0 20px 18px' }}><span className="btn btn--yellow btn--sm">افتح ←</span></div>
              </div>
            </Link>
          ))}
        </div>
        <section style={{ marginTop: 40, background: 'var(--paper)', border: '3px solid var(--ink)', borderRadius: 26, padding: 24 }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 12 }}>جرّب دورة الطلب كاملة (5 دقائق)</h2>
          <ol style={{ margin: 0, paddingInlineStart: 22, fontWeight: 700, lineHeight: 2 }}>
            <li>افتح <b>تطبيق الزبون</b> ← اختر حجم البطاطا وتغليفها ← السلة ← اكتب اسم ورقم ← "Buyurtma berish".</li>
            <li>ارجع هون وافتح <b>الكاشير</b> بالـ PIN ‏3333 ← افتح الوردية ← بتشوف طلب التطبيق تحت "Onlayn" ← اقبله. وجرّب تعمل طلب بالمحل وتحسب الباقي.</li>
            <li>افتح <b>شاشة المطبخ</b> (من الشريط فوق) ← "Boshlash" ← "Tayyor" ← "Berildi".</li>
            <li>افتح <b>شاشة التلفزيون</b> ← بتشوف رقم الطلب الجاهز.</li>
            <li>اطلع وادخل بالـ PIN ‏1111 ← <b>لوحة المالك</b>: المبيعات، الربح، المخزون نقص لحاله، وابحث عن الفاتورة.</li>
          </ol>
          <p className="muted" style={{ marginTop: 10 }}>اللغة متوفرة من أزرار UZ / RU / EN / AR أعلى الشاشة.</p>
          <button className="btn btn--ghost btn--sm" style={{ marginTop: 10 }} onClick={() => { resetDemo(); setDone(true); }}>{done ? 'تم ✓ — البيانات رجعت للبداية' : 'امسح البيانات التجريبية وابدأ من جديد'}</button>
        </section>
      </main>
    </div>
  );
}
