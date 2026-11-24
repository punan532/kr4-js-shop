const filters = document.querySelector("#filters");
const search = document.querySelector("#search");
const category = document.querySelector("#category");
const sort = document.querySelector("#sort");
const results = document.querySelector("#results");
const emptyResults = document.querySelector("#empty-results");

for (const value of new Set(products.map((product) => product.category))) {
  category.add(new Option(value, value));
}

function productCard(product) {
  const card = element("article", undefined, "product-card");
  const title = element("h3");
  const link = element("a", product.title);
  link.href = `product.html?id=${product.id}`;
  title.append(link);
  card.append(productImage(product), element("span", product.category, "category"), title,
    element("p", product.description), element("strong", money(product.price), "price"),
    cartButton(product));
  return card;
}
function renderCatalog() {
  const query = search.value.trim().toLocaleLowerCase("ru");
  const matches = products.filter((product) =>
    product.title.toLocaleLowerCase("ru").includes(query) &&
    (!category.value || product.category === category.value)
  );
  if (sort.value === "asc") matches.sort((a, b) => a.price - b.price);
  if (sort.value === "desc") matches.sort((a, b) => b.price - a.price);
  if (sort.value === "title") matches.sort((a, b) => a.title.localeCompare(b.title, "ru"));
  results.replaceChildren(...matches.map(productCard));
  document.querySelector("#found").textContent = `Найдено товаров: ${matches.length}`;
  emptyResults.hidden = matches.length !== 0;
}
filters.addEventListener("submit", (event) => event.preventDefault());
search.addEventListener("input", renderCatalog);
category.addEventListener("change", renderCatalog);
sort.addEventListener("change", renderCatalog);
filters.addEventListener("reset", () => requestAnimationFrame(renderCatalog));
document.querySelector("#show-all").addEventListener("click", () => {
  filters.reset();
  search.focus();
});
renderCatalog();
