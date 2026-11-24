function showProduct() {
  const id = new URLSearchParams(location.search).get("id") ?? (location.hash.slice(6) || "1");
  const product = products.find((item) => String(item.id) === id);
  const detail = document.querySelector("#product-detail");
  const heading = document.querySelector("#product-title");
  detail.replaceChildren();
  if (!product) {
    heading.textContent = "Товар не найден";
    return;
  }
  heading.textContent = product.title;
  document.title = product.title + " · PunanovStore";
  const info = element("div");
  const table = element("table");
  const body = element("tbody");
  table.append(element("caption", "Характеристики"), body);
  for (const [label, value] of [["Категория", product.category], ["Упаковка", product.unit], ["Цена", money(product.price)]]) {
    const row = element("tr");
    const key = element("th", label);
    key.scope = "row";
    row.append(key, element("td", value));
    body.append(row);
  }
  info.append(element("p", product.description), table, cartButton(product));
  detail.classList.add("product-layout");
  detail.append(productImage(product), info);
}
window.addEventListener("hashchange", showProduct);
showProduct();
