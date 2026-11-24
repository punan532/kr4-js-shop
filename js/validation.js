const itemSelect = document.querySelector("select[name='item']");
const requested = new URLSearchParams(location.search);
const summary = document.querySelector("#order-summary");

function updateSelection() {
  if (!itemSelect) return;
  const previous = itemSelect.value;
  const options = products.filter((product) => product.isAvailable)
    .map((product) => new Option(product.title, String(product.id)));
  if (summary && cart.length) options.unshift(new Option("Товары из корзины", "cart"));
  itemSelect.replaceChildren(...options);
  if (options.some((option) => option.value === previous)) itemSelect.value = previous;
  showSummary();
}
function showSummary() {
  if (!summary) return;
  if (itemSelect.value === "cart") {
    const amount = totals();
    summary.textContent = `В корзине: ${amount.count}. К оплате: ${money(amount.total)}.`;
  } else {
    const product = products.find((item) => String(item.id) === itemSelect.value);
    summary.textContent = product ? `${product.unit} · ${money(product.price)}` : "";
  }
}
updateSelection();
if (summary) {
  const value = requested.get("from") === "cart" && cart.length ? "cart" : requested.get("item");
  if (Array.from(itemSelect.options).some((option) => option.value === value)) itemSelect.value = value;
  showSummary();
  itemSelect.addEventListener("change", showSummary);
  document.addEventListener("cartchange", updateSelection);
}

function errorFor(field) {
  if (field.type === "checkbox") return field.checked ? "" : "Подтвердите согласие.";
  const value = field.value.trim();
  if (field.required && !value) return "Заполните это поле.";
  if (field.name === "name" && value.length < 2) return "Введите имя длиной от двух символов.";
  if (field.name === "email" && (!field.validity.valid || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))) {
    return "Введите адрес, например name@example.ru.";
  }
  if (field.name === "phone" && !/^(\+7|8)\d{10}$/.test(value.replace(/[\s()\-]/g, ""))) {
    return "Введите российский номер, например +7 (999) 123-45-67.";
  }
  return field.validity.valid ? "" : "Проверьте значение.";
}
function setError(field, message) {
  const error = document.getElementById(field.id + "-error");
  error.textContent = message;
  error.hidden = !message;
  if (message) field.setAttribute("aria-invalid", "true");
  else field.removeAttribute("aria-invalid");
}
function clearErrors(form) {
  for (const field of form.querySelectorAll("[aria-invalid]")) setError(field, "");
}
for (const form of document.querySelectorAll("[data-demo-form]")) {
  const fields = Array.from(form.elements).filter((field) => field.matches("input, textarea, select"));
  const modal = form.closest("dialog");
  const status = document.querySelector(modal ? "#quick-status" : "[data-form-status]");
  form.noValidate = true;
  for (const field of fields) {
    if (!field.id) field.id = (modal ? "quick-" : "order-") + field.name;
    const error = element("small", "", "field-error");
    error.id = field.id + "-error";
    error.hidden = true;
    field.setAttribute("aria-describedby", error.id);
    const parent = field.closest(".form-field") || field.closest("label");
    parent.append(error);
    field.addEventListener("input", () => {
      if (field.hasAttribute("aria-invalid")) setError(field, errorFor(field));
      status.textContent = "";
    });
  }
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let firstInvalid;
    for (const field of fields) {
      const message = errorFor(field);
      setError(field, message);
      if (message && !firstInvalid) firstInvalid = field;
    }
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }
    const name = form.elements.name?.value.trim();
    const item = form.elements.item;
    const selection = item?.selectedOptions[0]?.textContent;
    const amount = item?.value === "cart" ? totals().total : products.find((p) => String(p.id) === item?.value)?.price;
    form.reset();
    if (summary) showSummary();
    if (modal) modal.close();
    status.textContent = name
      ? `${name}, заявка подготовлена. ${selection} · ${money(amount)}. Это учебное оформление.`
      : "Сообщение подготовлено. Это учебная форма обратной связи.";
  });
}
