import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initMedalShell } from "/src/js/main.js";

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
  const solid = document.querySelector("[data-cover-solid]");
  const halos = document.querySelector("[data-cover-halos]");
  const headerBrand = document.querySelector("[data-cover-header-brand]");
  const line = document.querySelector("[data-cover-line]");
  const workEyebrow = document.querySelector("[data-cover-work-eyebrow]");
  const enter = document.querySelector("[data-cover-enter]");
  const bar = document.querySelector("[data-cover-bar]");

  if (!cover || !stage || !hole || !gate) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  const F = { x: 112.67, y: 106, r: 17.9 };
  const C = { x: 319, y: 96 };
  let W = 0;
  let H = 0;
  let S0 = 1;
  let S1 = 1;
  let navigated = false;

  const measure = () => {
    const rect = stage.getBoundingClientRect();
    W = Math.max(1, rect.width);
    H = Math.max(1, rect.height);

    // Match Work's actual opening logo fraction without changing Work itself.
    let workFraction = 0.84;
    if (W <= 540) workFraction = 0.90;
    else if (W <= 860) workFraction = 0.82;

    S1 = Math.min(W * workFraction, H * 1.5) / 640;
    const d = Math.hypot(C.x - F.x, C.y - F.y);
    S0 = (Math.hypot(W, H) / 2 + d * S1) * 1.12 / F.r;
    gate.setAttribute("viewBox", `0 0 ${W} ${H}`);
  };

  const placeHole = (p) => {
    const t = easeInOutCubic(ramp(p, 0.16, 0.60));
    const s = S0 * Math.pow(S1 / S0, t);
    const tx = W / 2 - F.x * s - (C.x - F.x) * S1;
    const ty = H / 2 - F.y * s - (C.y - F.y) * S1;
    hole.setAttribute("transform", `translate(${tx} ${ty}) scale(${s})`);
  };

  const updateScene = (p) => {
    placeHole(p);

    const heroOut = ramp(p, 0.05, 0.15);
    gsap.set(hero, { opacity: 1 - heroOut, y: -30 * heroOut });
    gsap.set(scrim, { opacity: 1 - ramp(p, 0.20, 0.50) });
    gsap.set(gate, { opacity: ramp(p, 0.12, 0.18) });
    gsap.set(halos, { opacity: ramp(p, 0.40, 0.62) });
    gsap.set(headerBrand, { opacity: 1 - ramp(p, 0.50, 0.60) });

    const lineOpacity = ramp(p, 0.58, 0.64) * (1 - ramp(p, 0.70, 0.75));
    gsap.set(line, { opacity: lineOpacity, y: 12 * (1 - lineOpacity) });

    const solidOpacity = ramp(p, 0.72, 0.82);
    gsap.set(solid, { opacity: solidOpacity });

    const workIn = ramp(p, 0.80, 0.86);
    gsap.set(workEyebrow, { opacity: workIn, y: 10 * (1 - workIn) });
    gsap.set(enter, { opacity: workIn, y: 12 * (1 - workIn) });
    enter?.classList.toggle("is-visible", workIn > 0.92);

    gsap.set(bar, { scaleX: ramp(p, 0.86, 0.995) });
  };

  measure();
  updateScene(0);

  const trigger = ScrollTrigger.create({
    trigger: cover,
    start: "top top",
    end: "bottom bottom",
    scrub: 0.4,
    invalidateOnRefresh: true,
    onRefresh: (self) => {
      measure();
      updateScene(self.progress);
    },
    onUpdate: (self) => {
      updateScene(self.progress);
      if (self.progress >= 0.995 && self.direction > 0 && !navigated) {
        navigated = true;
        window.location.assign("/work/");
      }
      if (self.progress < 0.97) navigated = false;
    },
  });

  enter?.addEventListener("click", () => {
    const travel = Math.max(0, cover.offsetHeight - window.innerHeight);
    const destination = cover.offsetTop + travel * 0.84;
    if (lenis?.scrollTo) lenis.scrollTo(destination, { duration: 1.05 });
    else window.scrollTo({ top: destination, behavior: "smooth" });
  });

  window.addEventListener("resize", () => {
    measure();
    updateScene(trigger.progress);
  }, { passive: true });
}

function resetHomePosition() {
  const reset = () => {
    if (lenis?.scrollTo) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  if (document.readyState === "complete") reset();
  else window.addEventListener("load", reset, { once: true });
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) reset();
  });
}

initCoverSound();
initCover();
resetHomePosition();
