import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "/src/css/pages/work-cases.css";
import "/src/css/pages/work-h4-h6.css";
import "/src/css/pages/work-folio.css";

import { initMedalShell } from "/src/js/main.js";
import { initWorkIntro } from "/src/js/modules/work-intro.js";
import { initWorkCases } from "/src/js/modules/work-cases.js";
import { initWorkH4H6 } from "/src/js/modules/work-h4-h6.js";

gsap.registerPlugin(ScrollTrigger);

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);
const ramp = (p, a, b) => clamp((p - a) / Math.max(b - a, 0.0001));
const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

history.scrollRestoration = "manual";

const { lenis } = initMedalShell();

function initCoverSound() {
  const video = document.querySelector("[data-cover-video]");
  const button = document.querySelector("[data-cover-sound]");
  const label = document.querySelector("[data-cover-sound-label]");
  if (!video || !button) return;

  button.addEventListener("click", async () => {
    video.muted = !video.muted;
    button.setAttribute("aria-pressed", String(!video.muted));
    if (label) label.textContent = video.muted ? "Sound off" : "Sound on";
    if (!video.muted) {
      video.volume = 1;
      try { await video.play(); } catch (_) {}
    }
  });
}

function initCover() {
  const cover = document.querySelector("[data-cover]");
  const stage = document.querySelector("[data-cover-stage]");
  const hole = document.querySelector("[data-cover-hole]");
  const gate = document.querySelector("[data-cover-gate]");
  const hero = document.querySelector("[data-cover-hero]");
  const scrim = document.querySelector("[data-cover-scrim]");
  const ghost = document.querySelector("[data-cover-work]");
  const workHero = document.querySelector("[data-work-intro]");
  const workInner = workHero?.querySelector(".work-hero__inner");
  const ambient = document.querySelector(".ambient");
  const workLinks = [...document.querySelectorAll('.site-header__link[href="/work/"], .mobile-menu__nav a[href="/work/"]')];

  if (!cover || !stage || !hole || !gate || !ghost || !workHero || !workInner) return null;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return null;

  // Punto más ancho del trazo de la «m», en unidades del logotipo (viewBox 0 0 640 200).
  const F = { x: 112.67, y: 106, r: 17.9 };
  let W = 0;
  let H = 0;
  let S0 = 1;
  let logo = { a: 1, e: 0, f: 0 };
  let inWork = false;
  let progress = 0;

  /*
   * Copia del inicio de Work dentro de la portada. Usa las mismas clases y el
   * mismo viewBox que el original, así que queda en el mismo lugar exacto.
   */
  const buildGhost = () => {
    const copy = workInner.cloneNode(true);
    [copy, ...copy.querySelectorAll("*")].forEach((node) => {
      [...node.attributes].forEach((attr) => {
        if (attr.name.startsWith("data-") || attr.name === "id" || attr.name === "style" || attr.name === "role" || attr.name === "aria-label") {
          node.removeAttribute(attr.name);
        }
      });
    });
    ghost.replaceChildren(copy);

    // El hueco de la compuerta es el mismo logotipo.
    const svg = copy.querySelector("svg");
    if (!svg) return;
    hole.replaceChildren(
      ...[...svg.children].map((child) => {
        const shape = child.cloneNode(true);
        [shape, ...shape.querySelectorAll("*")].forEach((node) => {
          if (node.hasAttribute("fill")) node.setAttribute("fill", "#000");
        });
        return shape;
      })
    );
  };

  const measure = () => {
    const rect = stage.getBoundingClientRect();
    W = Math.max(1, rect.width);
    H = Math.max(1, rect.height);
    gate.setAttribute("viewBox", `0 0 ${W} ${H}`);

    const svg = ghost.querySelector("svg");
    const matrix = svg?.getScreenCTM();
    if (matrix && matrix.a > 0) {
      logo = { a: matrix.a, e: matrix.e - rect.left, f: matrix.f - rect.top };
    }

    // El hueco inicial debe cubrir toda la pantalla desde el punto de enfoque.
    const fx = logo.e + F.x * logo.a;
    const fy = logo.f + F.y * logo.a;
    const reach = Math.max(
      Math.hypot(fx, fy),
      Math.hypot(W - fx, fy),
      Math.hypot(fx, H - fy),
      Math.hypot(W - fx, H - fy)
    );
    S0 = (reach * 1.12) / F.r;
  };

  const placeHole = (p) => {
    const t = easeInOutCubic(ramp(p, 0.14, 0.80));
    const s = S0 * Math.pow(logo.a / S0, t);
    // El punto de enfoque permanece fijo en su posición final.
    const tx = logo.e + F.x * logo.a - F.x * s;
    const ty = logo.f + F.y * logo.a - F.y * s;
    hole.setAttribute("transform", `translate(${tx} ${ty}) scale(${s})`);
  };

  const updateScene = (p) => {
    progress = p;
    placeHole(p);

    const heroOut = ramp(p, 0.04, 0.14);
    gsap.set(hero, { opacity: 1 - heroOut, y: -30 * heroOut });
    gsap.set(scrim, { opacity: 1 - ramp(p, 0.18, 0.50) });
    gsap.set(gate, { opacity: ramp(p, 0.10, 0.16) });
    // Las letras se vuelven sólidas en el mismo movimiento: aparece el inicio de Work.
    gsap.set(ghost, { opacity: ramp(p, 0.78, 0.94) });

    if (!inWork && ambient) ambient.style.opacity = String(ramp(p, 0.45, 0.75));
  };

  // Relevo: al terminar la portada, el Work real ocupa el lugar de la copia.
  const showWork = () => {
    if (inWork) return;
    inWork = true;
    stage.style.visibility = "hidden";
    workHero.style.visibility = "";
    document.body.classList.remove("is-cover");
    if (ambient) ambient.style.opacity = "1";
    workLinks.forEach((link) => link.classList.add("is-active"));
  };

  const showCover = () => {
    inWork = false;
    stage.style.visibility = "";
    workHero.style.visibility = "hidden";
    document.body.classList.add("is-cover");
    workLinks.forEach((link) => link.classList.remove("is-active"));
    updateScene(progress);
  };

  buildGhost();
  measure();
  showCover();
  updateScene(0);

  const trigger = ScrollTrigger.create({
    trigger: cover,
    start: "top top",
    end: "bottom bottom",
    invalidateOnRefresh: true,
    onRefresh: (self) => {
      buildGhost();
      measure();
      updateScene(self.progress);
      if (self.progress >= 1) showWork();
      else if (inWork) showCover();
    },
    onUpdate: (self) => {
      updateScene(self.progress);
      if (self.progress >= 1) showWork();
      else if (inWork) showCover();
    },
  });

  // «Work» en el encabezado: baja hasta el inicio de Work sin cambiar de página.
  const goToWork = (immediate = false) => {
    const top = trigger.end;
    if (lenis?.scrollTo) lenis.scrollTo(top, immediate ? { immediate: true, force: true } : { duration: 1.6 });
    else window.scrollTo({ top, behavior: immediate ? "auto" : "smooth" });
  };

  workLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      goToWork(false);
    });
  });

  window.addEventListener("resize", () => {
    measure();
    updateScene(trigger.progress);
  }, { passive: true });

  return { goToWork };
}

/*
 * Posición al cargar:
 *   /#work            → inicio de Work
 *   atrás / adelante  → donde estaba el visitante
 *   cualquier otra    → arriba, en el video
 */
function initHomePosition(coverApi) {
  const KEY = "medal-home-scroll";
  const navigation = performance.getEntriesByType?.("navigation")?.[0];
  const cameBack = navigation?.type === "back_forward";

  const jump = (top) => {
    if (lenis?.scrollTo) lenis.scrollTo(top, { immediate: true, force: true });
    else window.scrollTo(0, top);
  };

  const place = () => {
    ScrollTrigger.refresh();
    const saved = Number(sessionStorage.getItem(KEY));
    if (window.location.hash === "#work" && coverApi) coverApi.goToWork(true);
    else if (cameBack && saved > 0) jump(saved);
    else jump(0);
    requestAnimationFrame(() => ScrollTrigger.update());
  };

  if (document.readyState === "complete") place();
  else window.addEventListener("load", place, { once: true });

  window.addEventListener("pagehide", () => {
    sessionStorage.setItem(KEY, String(Math.round(window.scrollY)));
  });
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) ScrollTrigger.refresh();
  });
  window.addEventListener("hashchange", () => {
    if (window.location.hash === "#work" && coverApi) coverApi.goToWork(false);
  });
}

initCoverSound();

// Work vive en la misma página que la portada.
initWorkIntro();
initWorkCases(lenis);
initWorkH4H6();

const coverApi = initCover();
initHomePosition(coverApi);
