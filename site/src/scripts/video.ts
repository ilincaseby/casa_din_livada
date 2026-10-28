const frame = document.querySelector<HTMLElement>("[data-video]");
const button = frame?.querySelector<HTMLButtonElement>("[data-video-play]");
if (frame && button && frame.dataset.embed) {
  button.hidden = false;
  button.addEventListener("click", () => {
    const iframe = document.createElement("iframe");
    iframe.title = frame.dataset.title ?? "Tur video — YouTube";
    iframe.src = `${frame.dataset.embed}?autoplay=1&rel=0`;
    iframe.allow = "autoplay; encrypted-media; picture-in-picture";
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    frame.replaceChildren(iframe);
    iframe.focus();
  }, { once: true });
}
