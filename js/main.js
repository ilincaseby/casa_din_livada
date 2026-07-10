/* =========================================================
   PENSIUNEA ALINA · BRAN — main.js
   ========================================================= */
(function () {
  "use strict";

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ---------- IMAGE FALLBACK (nu rămâne nicio poză ruptă) ---------- */
  $$("img").forEach((img, i) => {
    img.addEventListener("error", () => {
      if (img.dataset.fbk) return;
      img.dataset.fbk = "1";
      const w = img.getAttribute("width") || 1000;
      const h = img.getAttribute("height") || 700;
      img.src = `https://picsum.photos/seed/alina${i}/${w}/${h}`;
    });
  });

  /* ---------- PRELOADER ---------- */
  window.addEventListener("load", () => {
    setTimeout(() => $("#preloader")?.classList.add("is-done"), 700);
  });

  /* ---------- YEAR ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- NAVBAR: scroll state + progress ---------- */
  const nav = $("#nav");
  const progress = $("#scrollProgress");
  const toTop = $("#toTop");

  const onScroll = () => {
    const y = window.scrollY;
    nav?.classList.toggle("is-scrolled", y > 40);
    toTop?.classList.toggle("is-visible", y > 600);
    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (y / h) * 100 + "%";
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- MOBILE MENU ---------- */
  const burger = $("#navBurger");
  const menu = $("#navMenu");
  const toggleMenu = (open) => {
    const willOpen = open ?? !menu.classList.contains("is-open");
    menu.classList.toggle("is-open", willOpen);
    burger.classList.toggle("is-open", willOpen);
    document.body.style.overflow = willOpen ? "hidden" : "";
  };
  burger?.addEventListener("click", () => toggleMenu());
  $$(".nav__menu a").forEach((a) => a.addEventListener("click", () => toggleMenu(false)));

  /* ---------- SMOOTH ANCHOR (compensat pt. navbar) ---------- */
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (id.length < 2) return;
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  /* ---------- REVEAL ON SCROLL ---------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  $$(".reveal").forEach((el) => revealObserver.observe(el));

  /* ---------- PARALLAX ---------- */
  const parallaxEls = $$("[data-parallax]");
  if (parallaxEls.length && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let ticking = false;
    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          parallaxEls.forEach((el) => {
            const rect = el.parentElement.getBoundingClientRect();
            if (rect.bottom > 0 && rect.top < window.innerHeight) {
              const speed = 0.18;
              const offset = (rect.top) * -speed;
              el.style.transform = `translate3d(0, ${offset}px, 0)`;
            }
          });
          ticking = false;
        });
      },
      { passive: true }
    );
  }

  /* ---------- COUNTERS ---------- */
  const counters = $$(".stat__num");
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const decimals = parseInt(el.dataset.decimal || "0", 10);
        const suffix = el.dataset.suffix || "";
        const dur = 1600;
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          let val = target * eased;
          val = decimals ? (val / Math.pow(10, decimals)).toFixed(decimals) : Math.floor(val).toLocaleString("ro-RO");
          el.textContent = val + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        countObserver.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((c) => countObserver.observe(c));

  /* ---------- FACILITIES TOGGLE ---------- */
  const facToggle = $("#facilitiesToggle");
  const facWrap = $("#facilitiesWrap");
  facToggle?.addEventListener("click", () => {
    const open = facWrap.classList.toggle("is-open");
    facToggle.classList.toggle("is-open", open);
    facToggle.setAttribute("aria-expanded", String(open));
    const txt = $(".facilities__toggle-txt", facToggle);
    if (txt) txt.textContent = open ? "Ascunde facilitățile" : "Vezi toate facilitățile";
  });

  /* ---------- GALLERY CAROUSEL + LIGHTBOX ---------- */
  const galleryData = [
    { src: "images/bedroom3/94e9d8c5-f546-4394-9d66-04788d4a13ed.avif", cat: "camere", cap: "Dormitorul master" },
    { src: "images/bedroom3/266497e8-55cc-40c8-8401-90d8a7ce20e6.avif", cat: "camere", cap: "Dormitorul master" },
    { src: "images/bedroom1/ad6b9e97-77ef-43c8-933e-3baee71d64f1.avif", cat: "camere", cap: "Dormitor" },
    { src: "images/bedroom2/4744f520-97cb-47d0-9ee8-f15efd5d715c.avif", cat: "camere", cap: "Dormitor" },
    { src: "images/bedroom4/453bdddc-e08f-4bd4-9625-b5697619ce7c.avif", cat: "camere", cap: "Dormitor" },
    { src: "images/bedroom4/fc975be4-39e0-42ac-8c00-f145151b383c.avif", cat: "camere", cap: "Dormitor" },
    { src: "images/bathroom1/c8b1d172-f03e-473a-a54c-5bf2f84ccd68.avif", cat: "camere", cap: "Baie" },
    { src: "images/bathroom2/00fe6624-171f-4d9b-877f-c5013c4ec724.avif", cat: "camere", cap: "Baie" },
    { src: "images/bathroom3/2395d668-ddb9-45cd-8e0a-f76a636c34cb.avif", cat: "camere", cap: "Baie" },
    { src: "images/living/99f5fcb0-21df-464e-9a84-428a7113ce8c.avif", cat: "living", cap: "Living cu vedere" },
    { src: "images/living/3aa4625c-52cb-4173-b856-75221a3b98d7.avif", cat: "living", cap: "Living" },
    { src: "images/living/ba04ea87-5585-4d3f-a579-e83979d3dbb6.avif", cat: "living", cap: "Living & dining" },
    { src: "images/zona_de_luat_masa/c62e4310-ec40-499d-9880-cffee1750ff0.avif", cat: "living", cap: "Zona de luat masa" },
    { src: "images/zona_de_luat_masa/fdea5a64-5db9-48c9-b291-0b53424a00b4.avif", cat: "living", cap: "Zona de luat masa" },
    { src: "images/kitchen/bbb9819d-f8d1-40e0-924c-959cc13973c3.avif", cat: "living", cap: "Bucătărie" },
    { src: "images/kitchen/df98f9c5-5207-40c4-847d-65aa40ea0799.avif", cat: "living", cap: "Bucătărie" },
    { src: "images/backyard/ac628e73-68e5-47bf-b4ca-f1221109371a.avif", cat: "exterior", cap: "Casa" },
    { src: "images/exterior/fc8d3b57-85bf-4491-a7a4-44d80b33b99d.avif", cat: "exterior", cap: "Casa" },
    { src: "images/backyard/955c63e0-5406-4588-9794-495bfdc81fdb.avif", cat: "exterior", cap: "Foișorul" },
    { src: "images/backyard/7648e20c-ec24-4d36-88f2-2bb39b533123.avif", cat: "exterior", cap: "Casa & curtea" },
    { src: "images/backyard/b4374388-fb2d-47e5-84d8-cfa7037479e4.avif", cat: "exterior", cap: "Grătar" },
    { src: "images/backyard/e541bd34-a2be-496e-a60a-a63a08867db2.avif", cat: "exterior", cap: "Curtea cu leagăn" },
    { src: "images/more_photos/66d9fb62-17ad-42d7-8cfe-2adcbc682b0d.avif", cat: "exterior", cap: "Grătar & foc" },
    { src: "images/more_photos/af1f7695-c3a4-48fc-af3f-f8db88bc0ccf.avif", cat: "exterior", cap: "Grădina" },
    { src: "images/exterior/b57ce238-3759-4f5f-96c8-648c0c2233e4.avif", cat: "exterior", cap: "Casa seara" },
    { src: "images/backyard/f4526e26-a6bb-421c-87da-6c618d4088fb.avif", cat: "imprejurimi", cap: "Priveliște" },
    { src: "images/more_photos/b13f9f13-5cdc-479d-bbac-77af6825ebd3.avif", cat: "imprejurimi", cap: "Curcubeu peste vale" },
    { src: "images/more_photos/f54d2bea-d6aa-402f-9b56-3e5cee93ad6e.avif", cat: "imprejurimi", cap: "Dealuri împădurite" },
    { src: "images/exterior/c65d7fb6-f5fa-4453-b726-b8bb6c0a99a5.avif", cat: "imprejurimi", cap: "Vedere spre vale" },
    { src: "images/bedroom3/6076f25f-7ace-4bb9-9f66-84b0538218c3.avif", cat: "imprejurimi", cap: "Priveliște din balcon" },
    { src: "images/backyard/2142ae9f-ef24-4cbc-92cf-658b3d0d86d2.avif", cat: "imprejurimi", cap: "Iarna la casă" },
    { src: "images/more_photos/ef58afbb-f364-4f98-a24e-eed58eed929f.avif", cat: "imprejurimi", cap: "Livada înflorită" },
  ];

  const galTrack = $("#galleryTrack");
  const galView = $("#galViewport");
  const galFilters = $$(".gallery__filter");
  const lightbox = $("#lightbox");
  const lbImg = $("#lightboxImg");
  const lbCap = $("#lightboxCaption");

  if (galTrack && galView) {
    let filtered = [];
    let lbIndex = 0;
    let paused = false, dragging = false, moved = 0;

    const buildSlides = (cat) => {
      filtered = galleryData.filter((d) => cat === "all" || d.cat === cat);
      const html = filtered
        .map((d, i) => `<figure class="gallery__slide" data-i="${i}"><img src="${d.src}" alt="${d.cap}" loading="lazy" /><figcaption>${d.cap}</figcaption></figure>`)
        .join("");
      galTrack.innerHTML = html + html; // duplicate for a seamless loop
      galView.scrollLeft = 0;
    };

    galFilters.forEach((btn) => {
      btn.addEventListener("click", () => {
        galFilters.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        buildSlides(btn.dataset.filter);
      });
    });
    buildSlides("all");

    // continuous auto-scroll (seamless loop), pauses on hover / drag
    const step = () => {
      if (!paused && !dragging && galTrack.scrollWidth > galView.clientWidth) {
        galView.scrollLeft += 0.5;
        const half = galTrack.scrollWidth / 2;
        if (galView.scrollLeft >= half) galView.scrollLeft -= half;
      }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    galView.addEventListener("mouseenter", () => (paused = true));
    galView.addEventListener("mouseleave", () => (paused = false));

    // drag-to-scroll with the mouse (touch uses native swipe)
    let startX = 0, startScroll = 0;
    galView.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "touch") return;
      dragging = true; moved = 0; startX = e.clientX; startScroll = galView.scrollLeft;
      galView.classList.add("is-dragging");
      try { galView.setPointerCapture(e.pointerId); } catch (_) {}
    });
    galView.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      galView.scrollLeft = startScroll - dx;
    });
    const endDrag = () => { dragging = false; galView.classList.remove("is-dragging"); };
    galView.addEventListener("pointerup", endDrag);
    galView.addEventListener("pointercancel", endDrag);

    // lightbox
    const openLightbox = (i) => {
      lbIndex = (i + filtered.length) % filtered.length;
      lbImg.src = filtered[lbIndex].src;
      lbImg.alt = filtered[lbIndex].cap;
      lbCap.textContent = filtered[lbIndex].cap;
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };
    const closeLightbox = () => {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };
    const navLightbox = (dir) => openLightbox(lbIndex + dir);

    galTrack.addEventListener("click", (e) => {
      const fig = e.target.closest(".gallery__slide");
      if (!fig || moved > 6) return;
      openLightbox(parseInt(fig.dataset.i, 10) % filtered.length);
    });
    $(".lightbox__close")?.addEventListener("click", closeLightbox);
    $(".lightbox__next")?.addEventListener("click", () => navLightbox(1));
    $(".lightbox__prev")?.addEventListener("click", () => navLightbox(-1));
    lightbox?.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") navLightbox(1);
      if (e.key === "ArrowLeft") navLightbox(-1);
    });
  }

  /* ---------- VIDEO TOUR ---------- */
  const player = $(".tour__player");
  player?.addEventListener("click", () => {
    const url = player.dataset.video;
    if (!url) return;
    const iframe = document.createElement("iframe");
    iframe.src = url;
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    player.appendChild(iframe);
  });

  /* ---------- REVIEWS CAROUSEL ---------- */
  const track = $("#reviewsTrack");
  const dotsWrap = $("#reviewsDots");
  if (track) {
    const slides = $$(".review", track);
    let idx = 0;
    let timer;

    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.setAttribute("aria-label", "Recenzia " + (i + 1));
      if (i === 0) dot.classList.add("is-active");
      dot.addEventListener("click", () => goto(i, true));
      dotsWrap.appendChild(dot);
    });
    const dots = $$("button", dotsWrap);

    const goto = (i, manual) => {
      idx = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${idx * 100}%)`;
      dots.forEach((d, di) => d.classList.toggle("is-active", di === idx));
      if (manual) restart();
    };
    const start = () => (timer = setInterval(() => goto(idx + 1), 5500));
    const restart = () => { clearInterval(timer); start(); };
    start();
  }
})();
