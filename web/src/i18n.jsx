import { createContext, useContext, useEffect, useState } from 'react';

const D = {
  uz: {
    navMenu: 'Menyu', navHow: 'Qanday ishlaydi', navStory: 'Biz haqimizda', navContact: 'Aloqa', order: 'Buyurtma berish',
    heroKicker: 'Toshkentda yangi', heroTitle1: 'Oddiy kartoshkadan', heroTitle2: 'ham zo‘rroq.', heroSlogan: 'Beyond Ordinary Potatoes.',
    heroLead: 'O‘lchamni tanlang, 3 tagacha ziravor qo‘shing, sousingizni tanlang. KARTO — siz xohlagandek.',
    seeMenu: 'Menyuni ko‘rish', statSizes: 'o‘lcham', statSeason: 'ziravor', statServe: 'xil qadoq',
    howKicker: 'Made Your Way', howTitle: 'KARTO’ingizni 4 qadamda yig‘ing',
    step1: 'O‘lcham', step1t: 'Kichik, o‘rta yoki katta — har biri o‘z rangida.',
    step2: 'Qadoq', step2t: 'Kosa, patnis yoki konus.',
    step3: 'Ziravorlar', step3t: '3 tagacha ta’mni aralashtiring.',
    step4: 'Sous va ichimlik', step4t: 'Sevimli sousingiz va salqin ichimlik.',
    sizesTitle: 'Uchta o‘lcham. Uchta rang.', sizesLead: 'Sariq — kichik, apelsin — o‘rta, qizil — katta. Kassada ham, ilovada ham bir xil.',
    serveTitle: 'KARTO qadoqlash kolleksiyasi', packagingLead: 'Oq va oltin rangdagi kartoshka qutilari, balandroq stakanlar, suv idishlari va sharbatlar uchun uch xil qadoq.', seasonTitle: 'Yetti ziravor', seasonLead: 'Birinchisi bepul, keyingilari +2 000.',
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
    chooseSize: 'O‘lchamni tanlang', choosePack: 'Qadoqni tanlang', chooseSeason: 'Ziravorlar', upTo3: '3 tagacha',
    firstFree: 'Birinchisi bepul', addSauce: 'Sous qo‘shing', addDrink: 'Ichimlik', addToCart: 'Savatga qo‘shish',
    cart: 'Savat', emptyCart: 'Savat bo‘sh', subtotal: 'Oraliq jami', delivery: 'Yetkazib berish', pickup: 'Olib ketish',
    deliveryFee: 'Yetkazish', total: 'Jami', checkout: 'Rasmiylashtirish', name: 'Ismingiz', phoneNum: 'Telefon raqam',
    addr: 'Manzil', note: 'Izoh (ixtiyoriy)', payment: 'To‘lov usuli', cash: 'Naqd', card: 'Karta (Uzcard / Humo)', online: 'Click / Payme',
    placeOrder: 'Buyurtma berish', thanks: 'KARTO’ni tanlaganingiz uchun rahmat!', preparing: 'Buyurtmangiz mehr bilan tayyorlanmoqda.',
    track: 'Buyurtma holati', st_received: 'Qabul qilindi', st_confirmed: 'Tasdiqlandi', st_preparing: 'Tayyorlanmoqda', st_ready: 'Tayyor', st_out: 'Yo‘lda', st_completed: 'Yakunlandi', st_cancelled: 'Bekor qilindi',
    receipt: 'Elektron chek', home: 'Bosh sahifa', menu: 'Menyu', orders: 'Buyurtmalar', profile: 'Profil', rewards: 'KARTO Rewards', points: 'ball',
    edit: 'O‘zgartirish', remove: 'O‘chirish', back: 'Orqaga', next: 'Keyingi', yourCup: 'Sizning KARTO', extra: 'qo‘shimcha ziravor',
    readyIn: 'Taxminiy tayyor bo‘lish vaqti', min: 'daq', orderNo: 'Buyurtma', invoiceNo: 'Chek raqami', newOrder: 'Yangi buyurtma',
  },
  ru: {
    navMenu: 'Меню', navHow: 'Как это работает', navStory: 'О нас', navContact: 'Контакты', order: 'Заказать',
    heroKicker: 'Новое в Ташкенте', heroTitle1: 'Больше, чем', heroTitle2: 'просто картошка.', heroSlogan: 'Beyond Ordinary Potatoes.',
    heroLead: 'Выберите размер, добавьте до 3 специй и любимый соус. KARTO — так, как любите вы.',
    seeMenu: 'Смотреть меню', statSizes: 'размера', statSeason: 'специй', statServe: 'вида подачи',
    howKicker: 'Made Your Way', howTitle: 'Соберите свой KARTO за 4 шага',
    step1: 'Размер', step1t: 'Маленький, средний или большой — у каждого свой цвет.',
    step2: 'Подача', step2t: 'Чаша, лоток или рожок.',
    step3: 'Специи', step3t: 'Смешайте до 3 вкусов.',
    step4: 'Соус и напиток', step4t: 'Любимый соус и холодный напиток.',
    sizesTitle: 'Три размера. Три цвета.', sizesLead: 'Жёлтый — маленький, оранжевый — средний, красный — большой. Одинаково на кассе и в приложении.',
    serveTitle: 'Коллекция упаковки KARTO', packagingLead: 'Белая упаковка с золотыми деталями: коробки для картофеля, стаканы, бутылки для воды и три формата упаковки для сока.', seasonTitle: 'Семь специй', seasonLead: 'Первая бесплатно, следующие +2 000.',
    saucesTitle: 'Соусы', drinksTitle: 'Напитки',
    storyKicker: 'Наша история', storyTitle: 'Простая картошка может быть особенной.',
    storyText: 'В KARTO мы верим, что простая картошка может стать чем-то особенным. Вдохновившись международными вкусами и тщательно тестируя рецепты, мы создали меню, где вы собираете свою любимую комбинацию. Качественные продукты, стабильное приготовление, чистота и дружелюбный сервис — в каждом заказе.',
    promise1: 'Качественные продукты', promise2: 'Точная порция', promise3: 'Чистота', promise4: 'Дружелюбный сервис',
    appTitle: 'Приложение KARTO', appLead: 'Заказывайте, отслеживайте, копите баллы. Доставка или самовывоз.',
    install: 'Установить приложение', openApp: 'Открыть приложение', alsoOn: 'Также в Yandex Eats и Uzum Tezkor',
    contactTitle: 'Где нас найти', address: 'Адрес', phone: 'Телефон', hours: 'Часы работы', social: 'Соцсети',
    footer: 'Все права защищены.', allergen: 'Информацию об аллергенах уточняйте у сотрудников.',
    hi: 'Привет!', whatToday: 'Какой KARTO сегодня?', build: 'Собрать свой', popular: 'Популярные комбо',
    chooseSize: 'Выберите размер', choosePack: 'Выберите подачу', chooseSeason: 'Специи', upTo3: 'до 3',
    firstFree: 'Первая бесплатно', addSauce: 'Добавьте соус', addDrink: 'Напиток', addToCart: 'В корзину',
    cart: 'Корзина', emptyCart: 'Корзина пуста', subtotal: 'Подытог', delivery: 'Доставка', pickup: 'Самовывоз',
    deliveryFee: 'Доставка', total: 'Итого', checkout: 'Оформить', name: 'Ваше имя', phoneNum: 'Телефон',
    addr: 'Адрес', note: 'Комментарий (необязательно)', payment: 'Способ оплаты', cash: 'Наличные', card: 'Карта (Uzcard / Humo)', online: 'Click / Payme',
    placeOrder: 'Оформить заказ', thanks: 'Спасибо, что выбрали KARTO!', preparing: 'Ваш заказ готовится с заботой.',
    track: 'Статус заказа', st_received: 'Получен', st_confirmed: 'Подтверждён', st_preparing: 'Готовится', st_ready: 'Готов', st_out: 'В пути', st_completed: 'Завершён', st_cancelled: 'Отменён',
    receipt: 'Электронный чек', home: 'Главная', menu: 'Меню', orders: 'Заказы', profile: 'Профиль', rewards: 'KARTO Rewards', points: 'баллов',
    edit: 'Изменить', remove: 'Удалить', back: 'Назад', next: 'Далее', yourCup: 'Ваш KARTO', extra: 'доп. специя',
    readyIn: 'Примерное время готовности', min: 'мин', orderNo: 'Заказ', invoiceNo: 'Номер чека', newOrder: 'Новый заказ',
  },
  en: {
    navMenu: 'Menu', navHow: 'How it works', navStory: 'Our story', navContact: 'Contact', order: 'Order now',
    heroKicker: 'New in Tashkent', heroTitle1: 'Beyond', heroTitle2: 'ordinary potatoes.', heroSlogan: 'Made Your Way.',
    heroLead: 'Pick your size, add up to 3 seasonings and choose your sauce. KARTO, your way.',
    seeMenu: 'See the menu', statSizes: 'sizes', statSeason: 'seasonings', statServe: 'ways to serve',
    howKicker: 'Made Your Way', howTitle: 'Build your KARTO in 4 steps',
    step1: 'Size', step1t: 'Small, medium or large — each with its own color.',
    step2: 'Serve', step2t: 'Bowl, tray or cone.',
    step3: 'Seasonings', step3t: 'Mix up to 3 flavors.',
    step4: 'Sauce & drink', step4t: 'Your favorite dip and a cold drink.',
    sizesTitle: 'Three sizes. Three colors.', sizesLead: 'Yellow is small, orange is medium, red is large. Same at the counter and in the app.',
    serveTitle: 'The KARTO packaging collection', packagingLead: 'White packaging with gold details: fries boxes, taller cups, branded water bottles and three juice formats.', seasonTitle: 'Seven seasonings', seasonLead: 'First one free, extras +2,000.',
    saucesTitle: 'Sauces', drinksTitle: 'Drinks',
    storyKicker: 'Our story', storyTitle: 'A simple potato can become extraordinary.',
    storyText: 'At KARTO, we believe a simple potato can become something extraordinary. Inspired by international flavors and developed through careful recipe testing, our menu lets you create your own favorite combination. From the first crisp bite to the final detail of your order, we focus on quality ingredients, consistent preparation, cleanliness and friendly service.',
    promise1: 'Quality ingredients', promise2: 'Consistent portions', promise3: 'Cleanliness', promise4: 'Friendly service',
    appTitle: 'The KARTO app', appLead: 'Order, track and earn points. Delivery or pickup.',
    install: 'Install the app', openApp: 'Open the app', alsoOn: 'Also on Yandex Eats & Uzum Tezkor',
    contactTitle: 'Find us', address: 'Address', phone: 'Phone', hours: 'Opening hours', social: 'Social',
    footer: 'All rights reserved.', allergen: 'Ask our team for allergen information.',
    hi: 'Hi there!', whatToday: 'Which KARTO today?', build: 'Build your own', popular: 'Popular combos',
    chooseSize: 'Choose your size', choosePack: 'How to serve', chooseSeason: 'Seasonings', upTo3: 'up to 3',
    firstFree: 'First one free', addSauce: 'Add a sauce', addDrink: 'Drink', addToCart: 'Add to cart',
    cart: 'Cart', emptyCart: 'Your cart is empty', subtotal: 'Subtotal', delivery: 'Delivery', pickup: 'Pickup',
    deliveryFee: 'Delivery fee', total: 'Total', checkout: 'Checkout', name: 'Your name', phoneNum: 'Phone number',
    addr: 'Address', note: 'Note (optional)', payment: 'Payment', cash: 'Cash', card: 'Card (Uzcard / Humo)', online: 'Click / Payme',
    placeOrder: 'Place order', thanks: 'Thanks for choosing KARTO!', preparing: 'Your order is being prepared with care.',
    track: 'Order status', st_received: 'Received', st_confirmed: 'Confirmed', st_preparing: 'Preparing', st_ready: 'Ready', st_out: 'Out for delivery', st_completed: 'Completed', st_cancelled: 'Cancelled',
    receipt: 'E-receipt', home: 'Home', menu: 'Menu', orders: 'Orders', profile: 'Profile', rewards: 'KARTO Rewards', points: 'points',
    edit: 'Edit', remove: 'Remove', back: 'Back', next: 'Next', yourCup: 'Your KARTO', extra: 'extra seasoning',
    readyIn: 'Estimated ready time', min: 'min', orderNo: 'Order', invoiceNo: 'Invoice no.', newOrder: 'New order',
  },
};

const Ctx = createContext(null);
export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => { try { return localStorage.getItem('karto-lang') || 'uz'; } catch { return 'uz'; } });
  useEffect(() => { try { localStorage.setItem('karto-lang', lang); } catch {} document.documentElement.lang = lang; }, [lang]);
  const t = (k) => D[lang][k] ?? D.en[k] ?? k;
  const L = (obj) => (obj ? obj[lang] ?? obj.en : '');
  return <Ctx.Provider value={{ lang, setLang, t, L }}>{children}</Ctx.Provider>;
}
export const useLang = () => useContext(Ctx);

export function LangSwitch({ dark = false }) {
  const { lang, setLang } = useLang();
  return (
    <div className={'langs' + (dark ? ' langs--dark' : '')} role="group" aria-label="Language">
      {['uz', 'ru', 'en'].map((c) => (
        <button key={c} type="button" aria-pressed={lang === c} onClick={() => setLang(c)}>{c.toUpperCase()}</button>
      ))}
    </div>
  );
}
