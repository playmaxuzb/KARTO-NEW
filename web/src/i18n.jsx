import { createContext, useContext, useEffect, useState } from 'react';

const D = {
  uz: {
    navMenu: 'Menyu', navHow: 'Qanday ishlaydi', navStory: 'Biz haqimizda', navContact: 'Aloqa', order: 'Buyurtma berish',
    heroKicker: 'Toshkentda yangi', heroTitle1: 'Oddiy kartoshkadan', heroTitle2: 'ham zo‘rroq.', heroSlogan: 'Beyond Ordinary Potatoes.',
    heroLead: 'O‘lchamni tanlang, 3 tagacha ziravor qo‘shing, sousingizni tanlang. KARTO — siz xohlagandek.',
    seeMenu: 'Menyuni ko‘rish', statSizes: 'o‘lcham', statSeason: 'ziravor', statServe: 'xil qadoq',
    howKicker: 'Made Your Way', howTitle: 'KARTO’ingizni 4 qadamda yig‘ing',
    step1: 'O‘lcham', step1t: 'Kichik, o‘rta yoki katta — har birining o‘z qadoqlashi bor.',
    step2: 'Qadoq', step2t: 'Sousli kichik ixcham quti, dumaloq kosa yoki sous bo‘limli keng to‘rtburchak quti.',
    step3: 'Ziravorlar', step3t: 'Kichikka 1 ta, o‘rtaga 2 ta, kattaga 3 ta ziravor tanlang.',
    step4: 'Sous va ichimlik', step4t: 'Sevimli sousingiz va salqin ichimlik.',
    sizesTitle: 'Uch hajm. Uch xil qadoq.', sizesLead: 'Kichik — sousli ixcham quti, o‘rta — dumaloq kosa, katta — sous bo‘limli keng to‘rtburchak quti.',
    serveTitle: 'KARTO qadoqlash kolleksiyasi', packagingLead: 'Oq va oltin rangdagi kartoshka qutilari, balandroq stakanlar, suv idishlari va sharbatlar uchun uch xil qadoq.', seasonTitle: 'Yetti ziravor', seasonLead: 'Kichik hajmga 1 ta, o‘rtaga 2 ta, kattaga 3 ta ziravor tanlanadi — narxga kiritilgan.',
    saucesTitle: 'Souslar', drinksTitle: 'Ichimliklar',
    storyKicker: 'Bizning hikoya', storyTitle: 'Oddiy kartoshka — ajoyib bo‘lishi mumkin.',
    storyText: 'KARTO’da biz oddiy kartoshka ham ajoyib bo‘lishi mumkinligiga ishonamiz. Xalqaro ta’mlardan ilhomlanib, retseptlarni puxta sinab, siz o‘zingizning sevimli kombinatsiyangizni yaratishingiz uchun menyu tuzdik. Sifatli masalliqlar, bir xil tayyorlash, tozalik va samimiy xizmat — har bir buyurtmada.',
    promise1: 'Sifatli masalliqlar', promise2: 'Bir xil porsiya', promise3: 'Tozalik', promise4: 'Samimiy xizmat',
    appTitle: 'KARTO ilovasi', appLead: 'Buyurtma bering, kuzating, ball yig‘ing. Yetkazib berish yoki olib ketish.',
    install: 'Ilovani o‘rnatish', openApp: 'Ilovani ochish', alsoOn: 'Yandex Eats va Uzum Tezkor’da ham',
    contactTitle: 'Bizni toping', address: 'Manzil', phone: 'Telefon', hours: 'Ish vaqti', social: 'Ijtimoiy tarmoqlar',
    footer: 'Barcha huquqlar himoyalangan.', allergen: 'Allergenlar haqida ma’lumot uchun xodimlardan so‘rang.',
    // app
    hi: 'Salom!', whatToday: 'Bugun qaysi KARTO?', build: 'O‘zingiz yig‘ing', popular: 'Mashhur kombinatsiyalar',
    chooseSize: 'O‘lchamni tanlang', choosePack: 'Qadoqni tanlang', chooseSeason: 'Ziravorlar', upTo3: '{n} tagacha tanlang',
    firstFree: 'Narxga kiritilgan', addSauce: 'Sous qo‘shing', addDrink: 'Ichimlik', addToCart: 'Savatga qo‘shish',
    cart: 'Savat', emptyCart: 'Savat bo‘sh', subtotal: 'Oraliq jami', delivery: 'Yetkazib berish', pickup: 'Olib ketish',
    deliveryFee: 'Yetkazish', total: 'Jami', checkout: 'Rasmiylashtirish', name: 'Ismingiz', phoneNum: 'Telefon raqam',
    addr: 'Manzil', note: 'Izoh (ixtiyoriy)', payment: 'To‘lov usuli', cash: 'Naqd', card: 'Karta (Uzcard / Humo)', online: 'Click / Payme',
    placeOrder: 'Buyurtma berish', thanks: 'KARTO’ni tanlaganingiz uchun rahmat!', preparing: 'Buyurtmangiz mehr bilan tayyorlanmoqda.',
    track: 'Buyurtma holati', st_received: 'Qabul qilindi', st_confirmed: 'Tasdiqlandi', st_preparing: 'Tayyorlanmoqda', st_ready: 'Tayyor', st_out: 'Yo‘lda', st_completed: 'Yakunlandi', st_cancelled: 'Bekor qilindi',
    receipt: 'Elektron chek', home: 'Bosh sahifa', menu: 'Menyu', orders: 'Buyurtmalar', profile: 'Profil', rewards: 'KARTO Rewards', points: 'ball',
    edit: 'O‘zgartirish', remove: 'O‘chirish', back: 'Orqaga', next: 'Keyingi', yourCup: 'Sizning KARTO', extra: 'qo‘shimcha ziravor',
    readyIn: 'Taxminiy tayyor bo‘lish vaqti', min: 'daq', orderNo: 'Buyurtma', invoiceNo: 'Chek raqami', newOrder: 'Yangi buyurtma',
    language: 'Til', print: 'Chop etish',
    quantity: 'miqdor',
  },
  ru: {
    navMenu: 'Меню', navHow: 'Как это работает', navStory: 'О нас', navContact: 'Контакты', order: 'Заказать',
    heroKicker: 'Новое в Ташкенте', heroTitle1: 'Больше, чем', heroTitle2: 'просто картошка.', heroSlogan: 'Beyond Ordinary Potatoes.',
    heroLead: 'Выберите размер, добавьте до 3 специй и любимый соус. KARTO — так, как любите вы.',
    seeMenu: 'Смотреть меню', statSizes: 'размера', statSeason: 'специй', statServe: 'вида подачи',
    howKicker: 'Made Your Way', howTitle: 'Соберите свой KARTO за 4 шага',
    step1: 'Размер', step1t: 'Маленький, средний или большой — у каждого своя упаковка.',
    step2: 'Упаковка', step2t: 'Компактная коробка с соусом, круглая чаша или широкая прямоугольная коробка.',
    step3: 'Специи', step3t: 'Выберите 1 специю для маленького, 2 для среднего и 3 для большого размера.',
    step4: 'Соус и напиток', step4t: 'Любимый соус и холодный напиток.',
    sizesTitle: 'Три размера. Три вида упаковки.', sizesLead: 'Маленький — компактная коробка с соусом, средний — круглая чаша, большой — широкая прямоугольная коробка.',
    serveTitle: 'Коллекция упаковки KARTO', packagingLead: 'Белая упаковка с золотыми деталями: коробки для картофеля, стаканы, бутылки для воды и три формата упаковки для сока.', seasonTitle: 'Семь специй', seasonLead: 'Для маленького размера — 1 специя, среднего — 2, большого — 3. Включено в цену.',
    saucesTitle: 'Соусы', drinksTitle: 'Напитки',
    storyKicker: 'Наша история', storyTitle: 'Простая картошка может быть особенной.',
    storyText: 'В KARTO мы верим, что простая картошка может стать чем-то особенным. Вдохновившись международными вкусами и тщательно тестируя рецепты, мы создали меню, где вы собираете свою любимую комбинацию. Качественные продукты, стабильное приготовление, чистота и дружелюбный сервис — в каждом заказе.',
    promise1: 'Качественные продукты', promise2: 'Точная порция', promise3: 'Чистота', promise4: 'Дружелюбный сервис',
    appTitle: 'Приложение KARTO', appLead: 'Заказывайте, отслеживайте, копите баллы. Доставка или самовывоз.',
    install: 'Установить приложение', openApp: 'Открыть приложение', alsoOn: 'Также в Yandex Eats и Uzum Tezkor',
    contactTitle: 'Где нас найти', address: 'Адрес', phone: 'Телефон', hours: 'Часы работы', social: 'Соцсети',
    footer: 'Все права защищены.', allergen: 'Информацию об аллергенах уточняйте у сотрудников.',
    hi: 'Привет!', whatToday: 'Какой KARTO сегодня?', build: 'Собрать свой', popular: 'Популярные комбо',
    chooseSize: 'Выберите размер', choosePack: 'Выберите подачу', chooseSeason: 'Специи', upTo3: 'Выберите до {n}',
    firstFree: 'Включено в цену', addSauce: 'Добавьте соус', addDrink: 'Напиток', addToCart: 'В корзину',
    cart: 'Корзина', emptyCart: 'Корзина пуста', subtotal: 'Подытог', delivery: 'Доставка', pickup: 'Самовывоз',
    deliveryFee: 'Доставка', total: 'Итого', checkout: 'Оформить', name: 'Ваше имя', phoneNum: 'Телефон',
    addr: 'Адрес', note: 'Комментарий (необязательно)', payment: 'Способ оплаты', cash: 'Наличные', card: 'Карта (Uzcard / Humo)', online: 'Click / Payme',
    placeOrder: 'Оформить заказ', thanks: 'Спасибо, что выбрали KARTO!', preparing: 'Ваш заказ готовится с заботой.',
    track: 'Статус заказа', st_received: 'Получен', st_confirmed: 'Подтверждён', st_preparing: 'Готовится', st_ready: 'Готов', st_out: 'В пути', st_completed: 'Завершён', st_cancelled: 'Отменён',
    receipt: 'Электронный чек', home: 'Главная', menu: 'Меню', orders: 'Заказы', profile: 'Профиль', rewards: 'KARTO Rewards', points: 'баллов',
    edit: 'Изменить', remove: 'Удалить', back: 'Назад', next: 'Далее', yourCup: 'Ваш KARTO', extra: 'доп. специя',
    readyIn: 'Примерное время готовности', min: 'мин', orderNo: 'Заказ', invoiceNo: 'Номер чека', newOrder: 'Новый заказ',
    language: 'Язык', print: 'Печать',
    quantity: 'количество',
  },
  en: {
    navMenu: 'Menu', navHow: 'How it works', navStory: 'Our story', navContact: 'Contact', order: 'Order now',
    heroKicker: 'New in Tashkent', heroTitle1: 'Beyond', heroTitle2: 'ordinary potatoes.', heroSlogan: 'Made Your Way.',
    heroLead: 'Pick your size, add up to 3 seasonings and choose your sauce. KARTO, your way.',
    seeMenu: 'See the menu', statSizes: 'sizes', statSeason: 'seasonings', statServe: 'ways to serve',
    howKicker: 'Made Your Way', howTitle: 'Build your KARTO in 4 steps',
    step1: 'Size', step1t: 'Small, medium or large — each has its own package.',
    step2: 'Packaging', step2t: 'Compact pack with dip, round bowl, or a wide rectangular fries tray.',
    step3: 'Seasonings', step3t: 'Choose 1 for small, 2 for medium, and 3 for large.',
    step4: 'Sauce & drink', step4t: 'Your favorite dip and a cold drink.',
    sizesTitle: 'Three sizes. Three packages.', sizesLead: 'Small comes with an attached dip, medium in a round bowl, and large in a wide rectangular fries tray.',
    serveTitle: 'The KARTO packaging collection', packagingLead: 'White packaging with gold details: fries boxes, taller cups, branded water bottles and three juice formats.', seasonTitle: 'Seven seasonings', seasonLead: 'Choose 1 seasoning with small, 2 with medium, and 3 with large. Included in the size price.',
    saucesTitle: 'Sauces', drinksTitle: 'Drinks',
    storyKicker: 'Our story', storyTitle: 'A simple potato can become extraordinary.',
    storyText: 'At KARTO, we believe a simple potato can become something extraordinary. Inspired by international flavors and developed through careful recipe testing, our menu lets you create your own favorite combination. From the first crisp bite to the final detail of your order, we focus on quality ingredients, consistent preparation, cleanliness and friendly service.',
    promise1: 'Quality ingredients', promise2: 'Consistent portions', promise3: 'Cleanliness', promise4: 'Friendly service',
    appTitle: 'The KARTO app', appLead: 'Order, track and earn points. Delivery or pickup.',
    install: 'Install the app', openApp: 'Open the app', alsoOn: 'Also on Yandex Eats & Uzum Tezkor',
    contactTitle: 'Find us', address: 'Address', phone: 'Phone', hours: 'Opening hours', social: 'Social',
    footer: 'All rights reserved.', allergen: 'Ask our team for allergen information.',
    hi: 'Hi there!', whatToday: 'Which KARTO today?', build: 'Build your own', popular: 'Popular combos',
    chooseSize: 'Choose your size', choosePack: 'How to serve', chooseSeason: 'Seasonings', upTo3: 'Choose up to {n}',
    firstFree: 'Included in price', addSauce: 'Add a sauce', addDrink: 'Drink', addToCart: 'Add to cart',
    cart: 'Cart', emptyCart: 'Your cart is empty', subtotal: 'Subtotal', delivery: 'Delivery', pickup: 'Pickup',
    deliveryFee: 'Delivery fee', total: 'Total', checkout: 'Checkout', name: 'Your name', phoneNum: 'Phone number',
    addr: 'Address', note: 'Note (optional)', payment: 'Payment', cash: 'Cash', card: 'Card (Uzcard / Humo)', online: 'Click / Payme',
    placeOrder: 'Place order', thanks: 'Thanks for choosing KARTO!', preparing: 'Your order is being prepared with care.',
    track: 'Order status', st_received: 'Received', st_confirmed: 'Confirmed', st_preparing: 'Preparing', st_ready: 'Ready', st_out: 'Out for delivery', st_completed: 'Completed', st_cancelled: 'Cancelled',
    receipt: 'E-receipt', home: 'Home', menu: 'Menu', orders: 'Orders', profile: 'Profile', rewards: 'KARTO Rewards', points: 'points',
    edit: 'Edit', remove: 'Remove', back: 'Back', next: 'Next', yourCup: 'Your KARTO', extra: 'extra seasoning',
    readyIn: 'Estimated ready time', min: 'min', orderNo: 'Order', invoiceNo: 'Invoice no.', newOrder: 'New order',
    language: 'Language', print: 'Print',
    quantity: 'quantity',
  },
  ar: {
    navMenu: 'القائمة', navHow: 'كيف يعمل', navStory: 'قصتنا', navContact: 'تواصل معنا', order: 'اطلب الآن',
    heroKicker: 'جديد في طشقند', heroTitle1: 'أكثر من', heroTitle2: 'مجرد بطاطا.', heroSlogan: 'بطاطا خارج المألوف.',
    heroLead: 'اختر الحجم، وأضف حتى 3 نكهات، ثم اختر الصوص. كارتو على ذوقك.', seeMenu: 'شاهد القائمة', statSizes: 'أحجام', statSeason: 'نكهات', statServe: 'أنواع تغليف',
    howKicker: 'على ذوقك', howTitle: 'حضّر KARTO بطريقتك في 4 خطوات', step1: 'الحجم', step1t: 'صغير أو وسط أو كبير، ولكل حجم عبوته الخاصة.',
    step2: 'التغليف', step2t: 'علبة صغيرة مدمجة مع صوص، ووعاء دائري، أو علبة بطاطا مستطيلة عريضة.', step3: 'النكهات', step3t: 'نكهة واحدة للصغير، واثنتان للوسط، وثلاث للكبير.', step4: 'الصوص والمشروب', step4t: 'اختر صوصك ومشروبك المفضل.',
    sizesTitle: 'ثلاثة أحجام وثلاثة تصاميم', sizesLead: 'الصغير علبة مدمجة مع الصوص، والوسط وعاء دائري، والكبير علبة بطاطا مستطيلة عريضة.',
    serveTitle: 'مجموعة تغليف KARTO', packagingLead: 'تغليف أبيض بلمسات ذهبية وملمس بارز مميز، مع شعار البطاطا بالنظارة السوداء.', seasonTitle: 'النكهات', seasonLead: 'نكهة واحدة للصغير، واثنتان للوسط، وثلاث للكبير — كلها مشمولة في سعر الحجم.',
    saucesTitle: 'الصوصات', drinksTitle: 'المشروبات', storyKicker: 'قصتنا', storyTitle: 'بطاطا بسيطة بتجربة غير عادية.',
    storyText: 'في KARTO نؤمن أن البطاطا البسيطة تستحق تجربة مميزة. نختار المكونات بعناية، ونحضّر كل طلب بجودة ثابتة ونكهة تحبها.',
    promise1: 'مكونات مختارة', promise2: 'حصة مضبوطة', promise3: 'نظافة وعناية', promise4: 'خدمة ودودة',
    appTitle: 'تطبيق KARTO', appLead: 'اطلب، تابع طلبك، واجمع النقاط. توصيل أو استلام.', install: 'ثبّت التطبيق', openApp: 'افتح التطبيق', alsoOn: 'متوفر أيضاً على Yandex Eats وUzum Tezkor',
    contactTitle: 'تجدنا هنا', address: 'العنوان', phone: 'الهاتف', hours: 'ساعات العمل', social: 'حساباتنا', footer: 'جميع الحقوق محفوظة.', allergen: 'اسأل فريقنا عن معلومات مسببات الحساسية.',
    hi: 'أهلاً!', whatToday: 'أي KARTO تختار اليوم؟', build: 'ركّب طلبك', popular: 'الطلبات المفضلة', chooseSize: 'اختر الحجم', choosePack: 'التغليف', chooseSeason: 'النكهات', upTo3: 'اختر حتى {n}',
    firstFree: 'مشمولة في السعر', addSauce: 'أضف صوصاً', addDrink: 'مشروب', addToCart: 'أضف إلى السلة', cart: 'السلة', emptyCart: 'سلتك فارغة', subtotal: 'المجموع الفرعي', delivery: 'توصيل', pickup: 'استلام', deliveryFee: 'رسوم التوصيل', total: 'الإجمالي', checkout: 'إتمام الطلب',
    name: 'الاسم', phoneNum: 'رقم الهاتف', addr: 'العنوان', note: 'ملاحظة (اختياري)', payment: 'طريقة الدفع', cash: 'نقداً', card: 'بطاقة (Uzcard / Humo)', online: 'Click / Payme', placeOrder: 'تأكيد الطلب', thanks: 'شكراً لاختيارك KARTO!', preparing: 'يجري تجهيز طلبك بعناية.',
    track: 'حالة الطلب', st_received: 'تم الاستلام', st_confirmed: 'تم التأكيد', st_preparing: 'قيد التحضير', st_ready: 'جاهز', st_out: 'في الطريق', st_completed: 'مكتمل', st_cancelled: 'ملغي', receipt: 'إيصال إلكتروني', home: 'الرئيسية', menu: 'القائمة', orders: 'الطلبات', profile: 'حسابي', rewards: 'مكافآت KARTO', points: 'نقطة',
    edit: 'تعديل', remove: 'حذف', back: 'رجوع', next: 'التالي', yourCup: 'طلبك من KARTO', extra: 'نكهة إضافية', readyIn: 'الوقت المتوقع للتجهيز', min: 'دقيقة', orderNo: 'الطلب', invoiceNo: 'رقم الفاتورة', newOrder: 'طلب جديد',
    language: 'اللغة', print: 'طباعة',
    quantity: 'الكمية',
  },
};

const Ctx = createContext(null);
export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => { try { const saved = localStorage.getItem('karto-lang'); return ['uz', 'ru', 'en', 'ar'].includes(saved) ? saved : 'uz'; } catch { return 'uz'; } });
  useEffect(() => { try { localStorage.setItem('karto-lang', lang); } catch {} document.documentElement.lang = lang; document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'; }, [lang]);
  const t = (k) => D[lang]?.[k] ?? D.en[k] ?? k;
  const L = (obj) => (obj ? obj[lang] ?? obj.en : '');
  return <Ctx.Provider value={{ lang, setLang, t, L }}>{children}</Ctx.Provider>;
}
export const useLang = () => useContext(Ctx);

export function LangSwitch({ dark = false }) {
  const { lang, setLang } = useLang();
  return (
    <div className={'langs' + (dark ? ' langs--dark' : '')} role="group" aria-label="Language">
      {['uz', 'ru', 'en', 'ar'].map((c) => (
        <button key={c} type="button" aria-pressed={lang === c} onClick={() => setLang(c)}>{c.toUpperCase()}</button>
      ))}
    </div>
  );
}
