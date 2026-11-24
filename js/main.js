const navigation = document.querySelector(".site-nav");
const menu = document.querySelector(".menu-toggle");
const desktop = window.matchMedia("(min-width: 40rem)");

function setMenu(open) {
  menu.setAttribute("aria-expanded", String(open));
  navigation.hidden = !desktop.matches && !open;
}
function syncMenu() {
  menu.hidden = desktop.matches;
  setMenu(false);
}
menu.addEventListener("click", () => setMenu(navigation.hidden));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !menu.hidden && !navigation.hidden) {
    setMenu(false);
    menu.focus();
  }
});
desktop.addEventListener("change", syncMenu);
syncMenu();
