import { keepFocusInDialog } from "./dialog";

const gallery = document.querySelector<HTMLElement>("[data-gallery]");
const dialog = document.querySelector<HTMLDialogElement>("[data-lightbox]");

if (gallery && dialog) {
  keepFocusInDialog(dialog);
  const items = [...gallery.querySelectorAll<HTMLElement>("[data-gallery-item]")];
  const filters = [...gallery.querySelectorAll<HTMLButtonElement>("[data-filter]")];
  const count = gallery.querySelector<HTMLElement>("[data-gallery-count]");
  const empty = gallery.querySelector<HTMLElement>("[data-gallery-empty]");
  const image = dialog.querySelector<HTMLImageElement>("[data-lightbox-image]")!;
  const caption = dialog.querySelector<HTMLElement>("[data-lightbox-caption]")!;
  const position = dialog.querySelector<HTMLElement>("[data-lightbox-count]")!;
  const prev = dialog.querySelector<HTMLButtonElement>("[data-lightbox-prev]")!;
  const next = dialog.querySelector<HTMLButtonElement>("[data-lightbox-next]")!;
  let visible = items;
  let index = 0;
  let opener: HTMLAnchorElement | null = null;
  let touchStart: { x: number; y: number; id: number } | null = null;

  function filter(category: string) {
    if (!filters.some((button) => button.dataset.filter === category)) {
      console.warn("Categorie de galerie necunoscută:", category);
      category = "Toate";
    }
    visible = items.filter((item) => category === "Toate" || item.dataset.category === category);
    items.forEach((item) => { item.hidden = !visible.includes(item); });
    filters.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.filter === category)));
    if (count) count.textContent = `${visible.length} ${visible.length === 1 ? "fotografie" : "fotografii"}`;
    if (empty) empty.hidden = visible.length > 0;
  }

  function show(nextIndex: number) {
    if (!visible.length) {
      console.warn("Galeria nu conține fotografii de deschis.");
      return;
    }
    index = (nextIndex + visible.length) % visible.length;
    const link = visible[index].querySelector<HTMLAnchorElement>("[data-gallery-link]")!;
    image.alt = link.dataset.caption ?? "Fotografie a casei";
    image.src = link.href;
    caption.textContent = image.alt;
    position.textContent = `${index + 1} / ${visible.length}`;
    prev.disabled = next.disabled = visible.length < 2;
  }

  gallery.querySelector<HTMLElement>(".gallery-toolbar")!.hidden = false;
  filters.forEach((button) => button.addEventListener("click", () => {
    const category = button.dataset.filter!;
    filter(category);
    const url = new URL(location.href);
    if (category === "Toate") url.searchParams.delete("categorie");
    else url.searchParams.set("categorie", category);
    history.replaceState(null, "", url);
  }));
  filter(new URLSearchParams(location.search).get("categorie") ?? "Toate");
  gallery.addEventListener("click", (event) => {
    if (!(event.target instanceof Element) || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest<HTMLAnchorElement>("[data-gallery-link]");
    if (!link) return;
    const item = link.closest<HTMLElement>("[data-gallery-item]");
    if (!item || !visible.includes(item)) return;
    event.preventDefault();
    opener = link;
    show(visible.indexOf(item));
    dialog.showModal();
  });
  dialog.querySelector("[data-lightbox-close]")?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => { opener?.focus(); touchStart = null; });
  prev.addEventListener("click", () => show(index - 1));
  next.addEventListener("click", () => show(index + 1));
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      show(index + (event.key === "ArrowRight" ? 1 : -1));
    }
  });
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  const stage = dialog.querySelector<HTMLElement>(".lightbox-stage")!;
  stage.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "touch" || !event.isPrimary) return;
    touchStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
  });
  stage.addEventListener("pointerup", (event) => {
    if (!touchStart || touchStart.id !== event.pointerId) return;
    const dx = event.clientX - touchStart.x;
    const dy = event.clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) show(index + (dx < 0 ? 1 : -1));
  });
  stage.addEventListener("pointercancel", () => { touchStart = null; });
  image.addEventListener("error", () => {
    if (image.src.endsWith("/photo-unavailable.svg")) return;
    console.warn("Fotografia mărită nu a putut fi încărcată:", image.src);
    image.src = "/photo-unavailable.svg";
    caption.textContent = "Fotografie indisponibilă. Poți continua cu fotografia următoare.";
  });
}
