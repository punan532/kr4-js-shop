const dialog = document.querySelector(".order-dialog");
document.querySelectorAll("[data-product]").forEach((button) => {
  button.addEventListener("click", () => {
    const product = products.find((item) => item.title === button.dataset.product);
    if (!product) return;
    const form = dialog.querySelector("form");
    form.reset();
    clearErrors(form);
    form.elements.namedItem("item").value = String(product.id);
    document.querySelector("#quick-status").textContent = "";
    dialog.showModal();
  });
});
dialog.querySelector("[data-close]").addEventListener("click", () => dialog.close());
