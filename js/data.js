const products = [
  {
    "id": 1,
    "title": "Бутерброд",
    "category": "Еда",
    "price": 121,
    "isAvailable": true,
    "image": "product1",
    "alt": "Треугольный бутерброд с ветчиной и сыром",
    "unit": "1 шт.",
    "description": "Сэндвич с ветчиной и сыром на мягком белом хлебе."
  },
  {
    "id": 2,
    "title": "Бычок-осеменитель",
    "category": "Хозяйство",
    "price": 150000,
    "isAvailable": true,
    "image": "product2",
    "alt": "Чёрный племенной бык",
    "unit": "1 гол.",
    "description": "Племенной чёрный бык крепкого телосложения для фермерского хозяйства."
  },
  {
    "id": 3,
    "title": "Водка «Пять озёр»",
    "category": "Напитки",
    "price": 548,
    "isAvailable": true,
    "image": "product3",
    "alt": "Бутылка водки «Пять озёр»",
    "unit": "1 бут.",
    "description": "Водка «Пять озёр» в классической стеклянной бутылке."
  },
  {
    "id": 4,
    "title": "Бутерброды на двоих",
    "category": "Еда",
    "price": 229,
    "isAvailable": true,
    "image": "product1",
    "alt": "Треугольный бутерброд с ветчиной и сыром",
    "unit": "2 шт.",
    "description": "Набор из 2 сэндвичей с ветчиной и сыром."
  },
  {
    "id": 5,
    "title": "Бутерброды для компании",
    "category": "Еда",
    "price": 660,
    "isAvailable": true,
    "image": "product1",
    "alt": "Треугольный бутерброд с ветчиной и сыром",
    "unit": "6 шт.",
    "description": "Набор из 6 сэндвичей с ветчиной и сыром."
  },
  {
    "id": 6,
    "title": "Водка «Пять озёр», пара",
    "category": "Напитки",
    "price": 1050,
    "isAvailable": true,
    "image": "product3",
    "alt": "Бутылка водки «Пять озёр»",
    "unit": "2 бут.",
    "description": "Набор из 2 бутылок водки «Пять озёр»."
  },
  {
    "id": 7,
    "title": "Бутерброды для пикника",
    "category": "Еда",
    "price": 449,
    "isAvailable": false,
    "image": "product1",
    "alt": "Треугольный бутерброд с ветчиной и сыром",
    "unit": "4 шт.",
    "description": "Набор из 4 сэндвичей с ветчиной и сыром."
  },
  {
    "id": 8,
    "title": "Водка «Пять озёр», коробка",
    "category": "Напитки",
    "price": 3000,
    "isAvailable": false,
    "image": "product3",
    "alt": "Бутылка водки «Пять озёр»",
    "unit": "6 бут.",
    "description": "Набор из 6 бутылок водки «Пять озёр»."
  }
];

const rubles = new Intl.NumberFormat("ru-RU", {
  style: "currency", currency: "RUB", maximumFractionDigits: 2
});
function money(value) {
  return rubles.format(value);
}
function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.classList.add(className);
  return node;
}
function productImage(product) {
  const wrap = element("div", undefined, "product-card__image-container");
  const picture = element("picture");
  const source = element("source");
  source.type = "image/webp";
  source.srcset = `images/${product.image}-320.webp 320w, images/${product.image}-600.webp 600w`;
  source.sizes = "(min-width: 60rem) 340px, (min-width: 40rem) 45vw, 90vw";
  const img = element("img", undefined, "product-card__image");
  img.src = `images/${product.image}.png`;
  img.alt = product.alt;
  img.loading = "lazy";
  picture.append(source, img);
  wrap.append(picture);
  return wrap;
}
