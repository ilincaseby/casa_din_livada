interface NetworkInformation extends EventTarget { saveData?: boolean; }
type ConnectionNavigator = Navigator & { connection?: NetworkInformation };

export function initMountain() {
  const container = document.querySelector<HTMLElement>("[data-mountain]");
  const button = document.querySelector<HTMLButtonElement>("[data-scene-toggle]");
  if (!container || !button) return;
  const surface = container.closest<HTMLElement>(".home-hero")!;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const desktop = matchMedia("(min-width: 800px) and (hover: hover) and (pointer: fine)");
  const connection = (navigator as ConnectionNavigator).connection;
  let cleanup: (() => void) | undefined;
  let staticRequested = false;
  let pending = false;
  let alive = true;
  let visible = false;
  let failed = false;
  let version = 0;

  const eligible = () => alive && !failed && visible && !document.hidden && !reduced.matches && desktop.matches && !connection?.saveData && !staticRequested;
  function stop() {
    version++;
    cleanup?.();
    cleanup = undefined;
    container!.dataset.ready = "false";
    container!.dataset.mode = "static";
  }
  async function start() {
    if (!eligible() || cleanup || pending) return;
    pending = true;
    const request = version;
    try {
      const { createMountain } = await import("./mountain");
      if (request !== version || !eligible()) return;
      cleanup = createMountain(container!, surface, () => {
        failed = true;
        stop();
        button!.hidden = true;
        container!.dataset.mode = "fallback";
      });
      container!.dataset.mode = "3d";
      button!.hidden = false;
    } catch (error) {
      failed = true;
      console.warn("Relieful 3D nu poate fi încărcat. Posterul static rămâne disponibil.", error);
      stop();
      container!.dataset.mode = "fallback";
      button!.hidden = true;
    } finally {
      pending = false;
      if (request !== version && eligible() && !cleanup) void start();
    }
  }
  function preferencesChanged() {
    stop();
    button!.hidden = !desktop.matches || reduced.matches || Boolean(connection?.saveData);
    void start();
  }
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) void start();
  }, { threshold: 0.05 });
  const begin = () => {
    if (alive) observer.observe(surface);
  };
  // The scene is never part of the critical content load.
  if (document.readyState === "complete") setTimeout(begin, 0);
  else window.addEventListener("load", begin, { once: true });
  button.addEventListener("click", () => {
    staticRequested = !staticRequested;
    button.setAttribute("aria-pressed", String(staticRequested));
    button.textContent = staticRequested ? "Activează relieful 3D" : "Vezi fundalul static";
    stop();
    void start();
  });
  reduced.addEventListener("change", preferencesChanged);
  desktop.addEventListener("change", preferencesChanged);
  connection?.addEventListener("change", preferencesChanged);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) void start(); });
  window.addEventListener("pagehide", () => { alive = false; stop(); observer.disconnect(); });
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) { alive = true; begin(); }
  });
  container.dataset.mode = "static";
}
