// Default menu (seed). In production this is loaded from /api/menu and edited in the Admin center.
export const DEFAULT_MENU = {
  currency: 'UZS',
  extraSeasoningPrice: 2000,
  maxSeasonings: 3,
  sizes: [
    { id: 's', grams: 100, price: 18000, color: 'yellow', img: '/img/karto-small.png', package: { uz: 'Kichik sousli quti', ru: 'Маленькая коробка с соусом', en: 'Compact pack with attached dip', ar: 'علبة صغيرة مع حامل صوص مدمج' }, name: { uz: 'Kichik', ru: 'Маленький', en: 'Small', ar: 'صغير' } },
    { id: 'm', grams: 150, price: 25000, color: 'orange', img: '/img/karto-medium.png', package: { uz: 'Oq dumaloq kosa', ru: 'Белая круглая чаша', en: 'Round white bowl', ar: 'وعاء أبيض دائري' }, name: { uz: 'O‘rta', ru: 'Средний', en: 'Medium', ar: 'وسط' } },
    { id: 'l', grams: 200, price: 32000, color: 'red', img: '/img/karto-large.png', package: { uz: 'Sirpanma qopqoqli keng quti', ru: 'Широкая коробка с выдвижной крышкой', en: 'Wide box with sliding lid', ar: 'علبة عريضة بغطاء منزلق' }, name: { uz: 'Katta', ru: 'Большой', en: 'Large', ar: 'كبير' } },
  ],
  packaging: [
    { id: 'bowl', img: '/img/karto-medium.png', thumb: '/img/karto-medium.png', name: { uz: 'Oq dumaloq kosa', ru: 'Белая круглая чаша', en: 'Medium round bowl', ar: 'وعاء دائري متوسط' }, desc: { uz: 'O‘rta hajm', ru: 'Средний размер', en: 'Medium size', ar: 'الحجم الوسط' } },
    { id: 'tray', img: '/img/karto-large.png', thumb: '/img/karto-large.png', name: { uz: 'Sirpanma qopqoqli quti', ru: 'Коробка с выдвижной крышкой', en: 'Large sliding box', ar: 'علبة كبيرة بغطاء منزلق' }, desc: { uz: 'Katta hajm, ziravor bo‘limlari bilan', ru: 'Большой размер с отделениями для специй', en: 'Large size with seasoning wells', ar: 'حجم كبير مع أماكن لعلب النكهات' } },
    { id: 'cone', img: '/img/karto-small.png', thumb: '/img/karto-small.png', name: { uz: 'Kichik sousli quti', ru: 'Маленькая коробка с соусом', en: 'Small pack with attached dip', ar: 'علبة صغيرة مع صوص مدمج' }, desc: { uz: 'Kichik hajm, sous yonida biriktirilgan', ru: 'Маленький размер, соус закреплён сбоку', en: 'Compact size with attached dip', ar: 'حجم صغير والصوص مثبت بجانبها' } },
  ],
  seasonings: [
    { id: 'classic', color: '#F3E6C8', name: { uz: 'Tuz va qalampir', ru: 'Соль и перец', en: 'Salt & Pepper', ar: 'ملح وفلفل' } },
    { id: 'bbq', color: '#8A3B1C', name: { uz: 'BBQ', ru: 'Барбекю', en: 'BBQ', ar: 'باربكيو' } },
    { id: 'sour', color: '#DDEBD3', name: { uz: 'Smetana va piyoz', ru: 'Сметана и лук', en: 'Sour Cream & Onion', ar: 'كريمة حامضة وبصل' } },
    { id: 'cheddar', color: '#FFB627', name: { uz: 'Chedder pishloq', ru: 'Чеддер', en: 'Cheddar Cheese', ar: 'جبنة شيدر' } },
    { id: 'chili', color: '#D7332A', name: { uz: 'Achchiq chili', ru: 'Острый чили', en: 'Spicy Chili', ar: 'فلفل حار' } },
    { id: 'peri', color: '#EE6A1F', name: { uz: 'Peri-Peri', ru: 'Пери-пери', en: 'Peri-Peri', ar: 'بيري بيري' } },
    { id: 'parmesan', color: '#EFE2B0', name: { uz: 'Sarimsoq va parmezan', ru: 'Чеснок и пармезан', en: 'Garlic Parmesan', ar: 'ثوم وبارميزان' } },
  ],
  sauces: [
    { id: 'ketchup', price: 4000, color: '#C8231B', name: { uz: 'Ketchup', ru: 'Кетчуп', en: 'Ketchup', ar: 'كاتشب' } },
    { id: 'mayo', price: 4000, color: '#FFF3D6', name: { uz: 'Mayonez', ru: 'Майонез', en: 'Mayonnaise', ar: 'مايونيز' } },
    { id: 'bbq', price: 5000, color: '#5A2412', name: { uz: 'BBQ sousi', ru: 'Соус барбекю', en: 'BBQ Sauce', ar: 'صوص باربكيو' } },
    { id: 'spicy', price: 5000, color: '#EE6A1F', name: { uz: 'Achchiq sous', ru: 'Острый соус', en: 'Spicy Sauce', ar: 'صوص حار' } },
  ],
  drinks: [
    { id: 'cola', price: 9000, name: { uz: 'Coca-Cola 0,5 L', ru: 'Coca-Cola 0,5 л', en: 'Coca-Cola 0.5 L', ar: 'كوكاكولا 0.5 لتر' } },
    { id: 'pepsi', price: 9000, name: { uz: 'Pepsi 0,5 L', ru: 'Pepsi 0,5 л', en: 'Pepsi 0.5 L', ar: 'بيبسي 0.5 لتر' } },
    { id: 'water', price: 5000, name: { uz: 'Suv 0,5 L', ru: 'Вода 0,5 л', en: 'Water 0.5 L', ar: 'ماء 0.5 لتر' } },
    { id: 'lemonade', price: 14000, name: { uz: 'Limonad', ru: 'Лимонад', en: 'Lemonade', ar: 'ليمونادة' } },
  ],
  combos: [
    { id: 'c1', size: 'm', packaging: 'bowl', seasonings: ['cheddar', 'chili'], sauces: ['mayo'], img: '/img/karto-medium.png', name: { uz: 'Pishloqli olov', ru: 'Сырный огонь', en: 'Cheesy Fire', ar: 'نكهة الجبن الحارة' } },
    { id: 'c2', size: 'l', packaging: 'tray', seasonings: ['bbq', 'parmesan'], sauces: ['bbq'], img: '/img/karto-large.png', name: { uz: 'BBQ katta quti', ru: 'BBQ в большой коробке', en: 'BBQ Large Box', ar: 'علبة باربكيو كبيرة' } },
    { id: 'c3', size: 's', packaging: 'cone', seasonings: ['peri'], sauces: ['ketchup'], img: '/img/karto-small.png', name: { uz: 'Peri kichik quti', ru: 'Пери в маленькой коробке', en: 'Peri Small Pack', ar: 'علبة بيري بيري صغيرة' } },
  ],
};

export const BRANCH = {
  name: 'KARTO · Toshkent',
  address: { uz: '[Manzil kiritiladi]', ru: '[Адрес будет добавлен]', en: '[Address to be added]', ar: '[سيُضاف العنوان]' },
  phone: '+998 [__ ___ __ __]',
  hours: '10:00 – 23:00',
  instagram: '@karto.uz',
  telegram: '@karto_uz',
};

export const fmt = (n, lang = 'uz') => {
  const amount = String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '\u202F');
  const currency = lang === 'ru' ? 'сум' : lang === 'ar' ? 'سوم' : lang === 'en' ? 'UZS' : 'so‘m';
  return `\u2066${amount}\u202F${currency}\u2069`;
};
