// Default menu (seed). In production this is loaded from /api/menu and edited in the Admin center.
export const DEFAULT_MENU = {
  currency: 'UZS',
  extraSeasoningPrice: 2000,
  maxSeasonings: 3,
  sizes: [
    { id: 's', grams: 100, price: 18000, color: 'yellow', name: { uz: 'Kichik', ru: 'Маленький', en: 'Small' } },
    { id: 'm', grams: 150, price: 25000, color: 'orange', name: { uz: 'O‘rta', ru: 'Средний', en: 'Medium' } },
    { id: 'l', grams: 200, price: 32000, color: 'red', name: { uz: 'Katta', ru: 'Большой', en: 'Large' } },
  ],
  packaging: [
    { id: 'bowl', img: '/img/bowl.webp', name: { uz: 'Aralashtirish kosasi', ru: 'Круглая чаша', en: 'Shake bowl' }, desc: { uz: 'Ziravor bilan silkitish uchun', ru: 'Чтобы встряхнуть со специями', en: 'Made for shaking with seasoning' } },
    { id: 'tray', img: '/img/tray.webp', name: { uz: 'Sousli patnis', ru: 'Лоток для соусов', en: 'Sauce tray' }, desc: { uz: 'Sous quyish uchun keng', ru: 'Широкий — для соусов сверху', en: 'Wide, for sauce on top' } },
    { id: 'cone', img: '/img/cone.webp', name: { uz: 'Qog‘oz konus', ru: 'Бумажный рожок', en: 'Paper cone' }, desc: { uz: 'Yo‘lda yeyish uchun', ru: 'Удобно есть на ходу', en: 'Easy to eat on the go' } },
  ],
  seasonings: [
    { id: 'classic', color: '#F3E6C8', name: { uz: 'Tuz va qalampir', ru: 'Соль и перец', en: 'Salt & Pepper' } },
    { id: 'bbq', color: '#8A3B1C', name: { uz: 'BBQ', ru: 'Барбекю', en: 'BBQ' } },
    { id: 'sour', color: '#DDEBD3', name: { uz: 'Smetana va piyoz', ru: 'Сметана и лук', en: 'Sour Cream & Onion' } },
    { id: 'cheddar', color: '#FFB627', name: { uz: 'Chedder pishloq', ru: 'Чеддер', en: 'Cheddar Cheese' } },
    { id: 'chili', color: '#D7332A', name: { uz: 'Achchiq chili', ru: 'Острый чили', en: 'Spicy Chili' } },
    { id: 'peri', color: '#EE6A1F', name: { uz: 'Peri-Peri', ru: 'Пери-пери', en: 'Peri-Peri' } },
    { id: 'parmesan', color: '#EFE2B0', name: { uz: 'Sarimsoq va parmezan', ru: 'Чеснок и пармезан', en: 'Garlic Parmesan' } },
  ],
  sauces: [
    { id: 'ketchup', price: 4000, color: '#C8231B', name: { uz: 'Ketchup', ru: 'Кетчуп', en: 'Ketchup' } },
    { id: 'mayo', price: 4000, color: '#FFF3D6', name: { uz: 'Mayonez', ru: 'Майонез', en: 'Mayonnaise' } },
    { id: 'bbq', price: 5000, color: '#5A2412', name: { uz: 'BBQ sousi', ru: 'Соус барбекю', en: 'BBQ Sauce' } },
    { id: 'spicy', price: 5000, color: '#EE6A1F', name: { uz: 'Achchiq sous', ru: 'Острый соус', en: 'Spicy Sauce' } },
  ],
  drinks: [
    { id: 'cola', price: 9000, name: { uz: 'Coca-Cola 0,5 L', ru: 'Coca-Cola 0,5 л', en: 'Coca-Cola 0.5 L' } },
    { id: 'pepsi', price: 9000, name: { uz: 'Pepsi 0,5 L', ru: 'Pepsi 0,5 л', en: 'Pepsi 0.5 L' } },
    { id: 'water', price: 5000, name: { uz: 'Suv 0,5 L', ru: 'Вода 0,5 л', en: 'Water 0.5 L' } },
    { id: 'lemonade', price: 14000, name: { uz: 'Limonad', ru: 'Лимонад', en: 'Lemonade' } },
  ],
  combos: [
    { id: 'c1', size: 'm', packaging: 'bowl', seasonings: ['cheddar', 'chili'], sauces: ['mayo'], img: '/img/bowl.webp', name: { uz: 'Pishloqli olov', ru: 'Сырный огонь', en: 'Cheesy Fire' } },
    { id: 'c2', size: 'l', packaging: 'tray', seasonings: ['bbq', 'parmesan'], sauces: ['bbq'], img: '/img/tray.webp', name: { uz: 'BBQ patnis', ru: 'BBQ-лоток', en: 'BBQ Loaded Tray' } },
    { id: 'c3', size: 's', packaging: 'cone', seasonings: ['peri'], sauces: ['ketchup'], img: '/img/cone.webp', name: { uz: 'Peri konus', ru: 'Пери-рожок', en: 'Peri Cone' } },
  ],
};

export const BRANCH = {
  name: 'KARTO · Toshkent',
  address: { uz: '[Manzil kiritiladi]', ru: '[Адрес будет добавлен]', en: '[Address to be added]' },
  phone: '+998 [__ ___ __ __]',
  hours: '10:00 – 23:00',
  instagram: '@karto.uz',
  telegram: '@karto_uz',
};

export const fmt = (n, lang = 'uz') => {
  const amount = String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '\u202F');
  const currency = lang === 'ru' ? 'сум' : lang === 'en' ? 'UZS' : 'so‘m';
  return `\u2066${amount}\u202F${currency}\u2069`;
};
