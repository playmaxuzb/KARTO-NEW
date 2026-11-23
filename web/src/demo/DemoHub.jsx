import { Link } from 'react-router-dom';
import { Logo, Mascot, Checker } from '../brand.jsx';
import { LangSwitch, useLang } from '../i18n.jsx';
import { resetDemo } from './mockServer.js';
import { useState } from 'react';

const COPY = {
  ar: {
    title: 'النسخة التجريبية — النظام كامل', intro: 'كل البرامج متصلة ببعض: أي طلب بتعمله بالتطبيق بيوصل للكاشير والمطبخ والتلفزيون ولوحة المالك. هذه نسخة استعراض ببيانات تجريبية محفوظة في هذا المتصفح.', open: 'افتح ←', demo: 'نسخة تجريبية', customer: 'للزبائن', mobile: 'للزبائن · موبايل', shop: 'للمحل',
    cards: [
      ['موقع الشركة', 'تعريف بالعلامة، المنيو والأسعار، القصة، التواصل، وزر التطبيق.'],
      ['تطبيق الزبون', 'ركّب طلبك: الحجم ← النكهات ← الصوص ← المشروب. سلة، دفع، تتبع، وإيصال.'],
      ['الكاشير (POS)', 'طلبات المحل والتطبيق، تسجيل الدفع، حساب الباقي، وفتح وإغلاق الوردية.'],
      ['شاشة المطبخ', 'الطلبات: جديد ← قيد التحضير ← جاهز ← تم التسليم.'],
      ['شاشة التلفزيون', 'منيو بالصور وأرقام الطلبات قيد التحضير والجاهزة.'],
      ['لوحة المالك', 'المبيعات، الفواتير، المنيو والأسعار، المخزون، المصاريف، والموظفون.'],
    ],
    flow: 'جرّب دورة الطلب كاملة (5 دقائق)', steps: [
      'افتح تطبيق الزبون، اختر الحجم والنكهات، ثم أكمل الطلب ببيانات تجريبية.',
      'افتح الكاشير برقم 3333، افتح الوردية، وتحقق من وصول الطلب.',
      'افتح المطبخ برقم 4444 وحرّك الطلب إلى «جاهز» ثم «تم التسليم».',
      'افتح شاشة التلفزيون وتحقق من ظهور رقم الطلب.',
      'افتح لوحة المالك برقم 1111 لمراجعة المبيعات والمخزون والفاتورة.',
    ], langLine: 'يمكنك تبديل اللغة من الأزرار UZ / RU / EN / AR أعلى الصفحة.', reset: 'إعادة بيانات العرض إلى البداية', resetDone: 'تمت إعادة البيانات ✓',
  },
  uz: {
    title: 'Sinov versiyasi — to‘liq tizim', intro: 'Barcha bo‘limlar o‘zaro bog‘langan: ilovadagi buyurtma kassaga, oshxonaga, TV ekrani va egasi paneliga yetib boradi. Sinov ma’lumotlari ushbu brauzerda saqlanadi.', open: 'Ochish ←', demo: 'Sinov versiyasi', customer: 'Mijozlar uchun', mobile: 'Mijozlar uchun · mobil', shop: 'Xodimlar uchun',
    cards: [
      ['Kompaniya sayti', 'Brend, menyu va narxlar, hikoya, aloqa va ilovaga havola.'],
      ['Mijoz ilovasi', 'Hajm, ziravor, sous va ichimlikni tanlang. Savat, to‘lov, kuzatuv va chek.'],
      ['Kassir (POS)', 'Do‘kon va ilova buyurtmalari, to‘lov, qaytim va smenalar.'],
      ['Oshxona ekrani', 'Buyurtmalar: yangi ← tayyorlanmoqda ← tayyor ← topshirildi.'],
      ['TV ekrani', 'Rasmlar bilan menyu, tayyorlanayotgan va tayyor buyurtmalar.'],
      ['Egasi paneli', 'Savdo, cheklar, menyu va narxlar, ombor, xarajatlar va xodimlar.'],
    ],
    flow: 'Buyurtmani boshidan oxirigacha sinab ko‘ring (5 daqiqa)', steps: [
      'Mijoz ilovasini oching, hajm va ziravorlarni tanlab, sinov buyurtmasini bering.',
      '3333 PIN bilan kassani oching, smenani boshlang va buyurtmani toping.',
      '4444 PIN bilan oshxonani ochib, buyurtmani «Tayyor» va «Topshirildi» qiling.',
      'TV ekranida buyurtma raqami ko‘rsatilganini tekshiring.',
      '1111 PIN bilan egasi panelini ochib, savdo, ombor va chekni ko‘ring.',
    ], langLine: 'Tilni yuqoridagi UZ / RU / EN / AR tugmalari orqali almashtiring.', reset: 'Sinov ma’lumotlarini qayta boshlash', resetDone: 'Ma’lumotlar tiklandi ✓',
  },
  ru: {
    title: 'Демо-версия — полная система', intro: 'Все разделы связаны: заказ из приложения поступает кассиру, на кухню, на ТВ-экран и в панель владельца. Демоданные хранятся в этом браузере.', open: 'Открыть ←', demo: 'Демо-версия', customer: 'Для клиентов', mobile: 'Для клиентов · мобильное', shop: 'Для сотрудников',
    cards: [
      ['Сайт компании', 'Бренд, меню и цены, история, контакты и ссылка на приложение.'],
      ['Приложение клиента', 'Выберите размер, специи, соус и напиток. Корзина, оплата, отслеживание и чек.'],
      ['Касса (POS)', 'Заказы в заведении и из приложения, оплата, сдача и смены.'],
      ['Экран кухни', 'Заказы: новый ← готовится ← готов ← выдан.'],
      ['ТВ-экран', 'Меню с фото и номера готовящихся и готовых заказов.'],
      ['Панель владельца', 'Продажи, чеки, меню и цены, склад, расходы и сотрудники.'],
    ],
    flow: 'Проверьте полный цикл заказа (5 минут)', steps: [
      'Откройте приложение клиента, выберите размер и специи и оформите тестовый заказ.',
      'Откройте кассу с PIN 3333, начните смену и найдите заказ.',
      'Откройте кухню с PIN 4444 и переведите заказ в «Готов» и «Выдан».',
      'Проверьте номер заказа на ТВ-экране.',
      'Откройте панель владельца с PIN 1111 и проверьте продажи, склад и чек.',
    ], langLine: 'Смените язык кнопками UZ / RU / EN / AR вверху страницы.', reset: 'Сбросить демоданные', resetDone: 'Данные сброшены ✓',
  },
  en: {
    title: 'Demo version — complete system', intro: 'All parts are connected: an app order reaches the cashier, kitchen, TV display, and owner dashboard. Demo data is stored in this browser.', open: 'Open →', demo: 'Demo', customer: 'Customer', mobile: 'Customer · mobile', shop: 'Staff',
    cards: [
      ['Company website', 'Brand, menu and prices, story, contact details, and app link.'],
      ['Customer app', 'Choose size, seasonings, sauce, and drink. Cart, checkout, tracking, and receipt.'],
      ['Cashier (POS)', 'In-store and app orders, payments, change, and shift controls.'],
      ['Kitchen display', 'Orders move from new to preparing, ready, and handed over.'],
      ['TV display', 'Photo menu and numbers of preparing and ready orders.'],
      ['Owner dashboard', 'Sales, receipts, menu and prices, inventory, expenses, and staff.'],
    ],
    flow: 'Try a complete order cycle (5 minutes)', steps: [
      'Open the customer app, choose a size and seasonings, and place a demo order.',
      'Open the cashier with PIN 3333, start a shift, and find the order.',
      'Open the kitchen with PIN 4444 and move the order to Ready, then Handed over.',
      'Check that the order number appears on the TV display.',
      'Open the owner dashboard with PIN 1111 to review sales, stock, and the receipt.',
    ], langLine: 'Switch languages with UZ / RU / EN / AR at the top of this page.', reset: 'Reset demo data', resetDone: 'Demo data reset ✓',
  },
};
const PATHS = ['/site', '/app', '/staff/pos', '/staff/kds', '/staff/tv', '/admin'];
const PINS = ['', '', 'PIN: 3333', 'PIN: 4444', '', 'PIN: 1111 (owner) · 2222 (manager)'];
export default function DemoHub() {
  const [done, setDone] = useState(false); const { lang } = useLang(); const c = COPY[lang] || COPY.uz;
  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} style={{ minHeight: '100dvh', background: 'var(--cream)' }}>
      <header style={{ background: '#FFFFFF', color: 'var(--ink)', borderBottom: '3px solid var(--yellow)' }}>
        <div className="wrap" style={{ padding: '28px 0 34px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 22 }}>
          <Mascot size={96} />
          <div style={{ flex: '1 1 320px', minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}><Logo size={40} mascot={false} /><LangSwitch /></div>
            <h1 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, marginTop: 10 }}>{c.title}</h1>
            <p style={{ margin: '8px 0 0', fontWeight: 700, color: 'var(--ink-2)' }}>{c.intro}</p>
          </div>
        </div>
        <Checker color="var(--yellow)" />
      </header>
      <main className="wrap" style={{ padding: '36px 0 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 18 }}>
          {c.cards.map(([title, desc], i) => (
            <Link key={PATHS[i]} to={PATHS[i]} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ background: '#FFFFFF', border: '2px solid var(--yellow)', borderRadius: 26, overflow: 'hidden', boxShadow: '0 10px 26px rgba(36, 26, 20, .08)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ background: '#FFFFFF', color: 'var(--ink)', padding: '18px 20px', borderBottom: '1px solid #F2E1B4' }}>
                  <div style={{ fontFamily: 'var(--display)', fontWeight: 900, fontSize: 24 }}>{title}</div>
                  <div style={{ fontWeight: 800, fontSize: 14, opacity: .9 }}>{i === 0 || i === 1 ? (i === 1 ? c.mobile : c.customer) : (PINS[i] || c.shop)}</div>
                </div>
                <p style={{ margin: 0, padding: '16px 20px', fontWeight: 700, color: 'var(--ink-2)', flex: 1 }}>{desc}</p>
                <div style={{ padding: '0 20px 18px' }}><span className="btn btn--yellow btn--sm">{c.open}</span></div>
              </div>
            </Link>
          ))}
        </div>
        <section style={{ marginTop: 40, background: 'var(--paper)', border: '3px solid var(--ink)', borderRadius: 26, padding: 24 }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 12 }}>{c.flow}</h2>
          <ol style={{ margin: 0, paddingInlineStart: 22, fontWeight: 700, lineHeight: 2 }}>{c.steps.map((step) => <li key={step}>{step}</li>)}</ol>
          <p className="muted" style={{ marginTop: 10 }}>{c.langLine}</p>
          <button className="btn btn--ghost btn--sm" style={{ marginTop: 10 }} onClick={() => { resetDemo(); setDone(true); }}>{done ? c.resetDone : c.reset}</button>
        </section>
      </main>
    </div>
  );
}
