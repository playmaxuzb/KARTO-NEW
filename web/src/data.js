// Default menu (seed). In production this is loaded from /api/menu and edited in the Admin center.
export const DEFAULT_MENU = {
  currency: 'UZS',
  extraSeasoningPrice: 2000,
  maxSeasonings: 3,
  sizes: [
    { id: 's', grams: 100, price: 18000, color: 'yellow', img: '/img/karto-small.png', package: { uz: 'Kichik sousli quti', ru: 'Маленькая коробка с соусом', en: 'Compact pack with attached dip' }, name: { uz: 'Kichik', ru: 'Маленький', en: 'Small' } },
    { id: 'm', grams: 150, price: 25000, color: 'orange', img: '/img/karto-medium.png', package: { uz: 'Oq dumaloq kosa', ru: 'Белая круглая чаша', en: 'Round white bowl' }, name: { uz: 'O‘rta', ru: 'Средний', en: 'Medium' } },
    { id: 'l', grams: 200, price: 32000, color: 'red', img: '/img/karto-large.png', package: { uz: 'Sirpanma qopqoqli keng quti', ru: 'Широкая коробка с выдвижной крышкой', en: 'Wide box with sliding lid' }, name: { uz: 'Katta', ru: 'Большой', en: 'Large' } },
  ],
  packaging: [
    { id: 'bowl', img: '/img/karto-medium.png', thumb: '/img/karto-medium.png', name: { uz: 'Oq dumaloq kosa', ru: 'Белая круглая чаша', en: 'Medium round bowl' }, desc: { uz: 'O‘rta hajm', ru: 'Средний размер', en: 'Medium size' } },
    { id: 'tray', img: '/img/karto-large.png', thumb: '/img/karto-large.png', name: { uz: 'Sirpanma qopqoqli quti', ru: 'Коробка с выдвижной крышкой', en: 'Large sliding box' }, desc: { uz: 'Katta hajm, ziravor bo‘limlari bilan', ru: 'Большой размер с отделениями для специй', en: 'Large size with seasoning wells' } },
    { id: 'cone', img: '/img/karto-small.png', thumb: '/img/karto-small.png', name: { uz: 'Kichik sousli quti', ru: 'Маленькая коробка с соусом', en: 'Small pack with attached dip' }, desc: { uz: 'Kichik hajm, sous yonida biriktirilgan', ru: 'Маленький размер, соус закреплён сбоку', en: 'Compact size with attached dip' } },
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
    { id: 'c1', size: 'm', packaging: 'bowl', seasonings: ['cheddar', 'chili'], sauces: ['mayo'], img: '/img/karto-medium.png', name: { uz: 'Pishloqli olov', ru: 'Сырный огонь', en: 'Cheesy Fire' } },
    { id: 'c2', size: 'l', packaging: 'tray', seasonings: ['bbq', 'parmesan'], sauces: ['bbq'], img: '/img/karto-large.png', name: { uz: 'BBQ katta quti', ru: 'BBQ в большой коробке', en: 'BBQ Large Box' } },
    { id: 'c3', size: 's', packaging: 'cone', seasonings: ['peri'], sauces: ['ketchup'], img: '/img/karto-small.png', name: { uz: 'Peri kichik quti', ru: 'Пери в маленькой коробке', en: 'Peri Small Pack' } },
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
