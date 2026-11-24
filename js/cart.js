const cartKey = "punanovstore.kr4.cart.v1";
const maxQuantity = 99;
let cart = loadCart();

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(cartKey));
    if (!Array.isArray(saved)) return [];
    return products.filter((product) => product.isAvailable).flatMap((product) => {
      const line = saved.find((item) => item && item.id === product.id);
      return line && Number.isInteger(line.quantity) && line.quantity > 0
        ? [{ id: product.id, quantity: Math.min(maxQuantity, line.quantity) }] : [];
    });
  } catch {
    return [];
  }
}
function totals() {
  const count = cart.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = cart.reduce((sum, line) => {
    const product = products.find((item) => item.id === line.id);
    return sum + product.price * line.quantity;
  }, 0);
  const discount = count >= 3 ? Math.round(subtotal * 5) / 100 : 0;
  return { count, subtotal, discount, total: subtotal - discount };
}
function notice(text) {
  const status = document.querySelector("#cart-notice");
  if (status) status.textContent = text;
}
function saveCart(message) {
  try {
    localStorage.setItem(cartKey, JSON.stringify(cart));
  } catch {
    message += " Хранилище браузера недоступно, изменения действуют на этой странице.";
  }
  renderCart();
  notice(message);
  document.dispatchEvent(new Event("cartchange"));
}
function quantityButton(product, label, action, disabled = false) {
  const button = element("button", label, "secondary");
  button.type = "button";
  button.disabled = disabled;
  button.setAttribute("aria-label", label + " · " + product.title);
  button.dataset.action = action;
  button.dataset.id = product.id;
  return button;
}
function cartButton(product) {
  const button = quantityButton(product, product.isAvailable ? "В корзину" : "Нет в наличии", "add", !product.isAvailable);
  button.classList.replace("secondary", "button");
  return button;
}
function cartLine(line) {
  const product = products.find((item) => item.id === line.id);
  const row = element("li", undefined, "cart-line");
  const link = element("a", product.title);
  link.href = `product.html?id=${product.id}`;
  row.append(link, quantityButton(product, "Уменьшить", "less", line.quantity === 1),
    element("span", String(line.quantity)), quantityButton(product, "Увеличить", "add", line.quantity === maxQuantity),
    element("strong", money(product.price * line.quantity)), quantityButton(product, "Удалить", "remove"));
  return row;
}
function renderCart() {
  const amount = totals();
  document.querySelectorAll("[data-cart-count]").forEach((badge) => { badge.textContent = amount.count; });
  const list = document.querySelector("#cart-lines");
  if (!list) return;
  list.replaceChildren(...cart.map(cartLine));
  document.querySelector("#cart-empty").hidden = Boolean(amount.count);
  document.querySelector("#cart-content").hidden = !amount.count;
  document.querySelector("#subtotal").textContent = "Стоимость товаров: " + money(amount.subtotal);
  document.querySelector("#discount").textContent = amount.discount
    ? "Скидка 5%: " + money(amount.discount) : "От трёх единиц товара действует скидка 5%.";
  document.querySelector("#total").textContent = "Итого: " + money(amount.total);
}
document.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const product = products.find((item) => item.id === Number(button.dataset.id));
  if (!product?.isAvailable) return;
  const line = cart.find((item) => item.id === product.id);
  const action = button.dataset.action;
  let message;
  if (action === "add") {
    if (line?.quantity === maxQuantity) {
      notice("Для одного товара можно выбрать до 99 единиц.");
      return;
    }
    if (line) line.quantity++;
    else cart.push({ id: product.id, quantity: 1 });
    message = product.title + " — добавлено в корзину.";
  } else if (action === "less" && line?.quantity > 1) {
    line.quantity--;
    message = product.title + " — количество уменьшено.";
  } else if (action === "remove" && line) {
    cart = cart.filter((item) => item.id !== product.id);
    message = product.title + " — удалено из корзины.";
  } else {
    return;
  }
  saveCart(message);
  if (!button.isConnected) {
    const next = document.querySelector(`button[data-id="${product.id}"][data-action="${action}"]:enabled`)
      || document.querySelector("#cart-lines button:enabled, #cart-empty:not([hidden]) a");
    next?.focus();
  }
});
window.addEventListener("storage", (event) => {
  if (event.key !== cartKey && event.key !== null) return;
  cart = loadCart();
  renderCart();
  document.dispatchEvent(new Event("cartchange"));
});
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    cart = loadCart();
    renderCart();
    document.dispatchEvent(new Event("cartchange"));
  }
});
renderCart();
