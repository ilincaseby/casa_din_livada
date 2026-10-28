import { keepFocusInDialog } from "./dialog";

const menuButton = document.querySelector<HTMLButtonElement>(".menu-toggle");
const menu = document.querySelector<HTMLDialogElement>("#mobile-menu");
if (menuButton && menu) {
  keepFocusInDialog(menu);
  menuButton.hidden = false;
  document.querySelector<HTMLElement>(".no-js-nav")?.setAttribute("hidden", "");
  const closeMenu = () => menu.close();
  menuButton.addEventListener("click", () => {
    menu.showModal();
    menuButton.setAttribute("aria-expanded", "true");
  });
  menu.querySelector("[data-menu-close]")?.addEventListener("click", closeMenu);
  menu.addEventListener("close", () => {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.focus();
  });
  menu.addEventListener("click", (event) => {
    if (event.target === menu) {
      const bounds = menu.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right) closeMenu();
    }
  });
  const desktop = matchMedia("(min-width: 800px)");
  desktop.addEventListener("change", () => { if (desktop.matches && menu.open) closeMenu(); });
}

function showImageError(image: HTMLImageElement) {
  if (image.dataset.failed) return;
  image.dataset.failed = "true";
  console.warn("Fotografie indisponibilă:", image.currentSrc || image.src);
  image.removeAttribute("srcset");
  image.removeAttribute("sizes");
  image.src = "/photo-unavailable.svg";
  image.alt = `Fotografie indisponibilă: ${image.alt}`;
}

document.addEventListener("error", (event) => {
  if (event.target instanceof HTMLImageElement && event.target.hasAttribute("data-photo")) {
    showImageError(event.target);
  }
}, true);
document.querySelectorAll<HTMLImageElement>("img[data-photo]").forEach((image) => {
  if (image.complete && !image.naturalWidth) showImageError(image);
});

const legacyRoutes: Record<string, string> = {
  "#acasa": "/",
  "#despre": "/casa/#despre",
  "#camere": "/casa/#camere",
  "#facilitati": "/casa/#facilitati",
  "#galerie": "/galerie/",
  "#tur": "/galerie/#tur",
  "#imprejurimi": "/imprejurimi/",
  "#locatie": "/contact/#locatie",
  "#contact": "/contact/#rezervare",
};
function routeLegacyAnchor() {
  if (location.pathname !== "/") return;
  const route = legacyRoutes[location.hash];
  if (route) location.replace(route);
}
routeLegacyAnchor();
window.addEventListener("hashchange", routeLegacyAnchor);
