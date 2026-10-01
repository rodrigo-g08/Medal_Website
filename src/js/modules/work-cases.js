import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import cases from "../../data/cases.json";

gsap.registerPlugin(ScrollTrigger);

const INTRO = 0.20;
const HOLD = 0.70;
const TRANSITION = 0.30;
const OUT = 0.18;
const IN = 0.18;

function caseMarkup(item, index, total) {
  const number = String(index + 1).padStart(2, "0");
  const totalLabel = String(total).padStart(2, "0");

  return `
    <article class="work-case" data-case="${index}" aria-label="${item.name}">
      <div class="work-case__media">
        <img
          class="work-case__image"
          src="${item.image}"
          alt=""
          loading="${index === 0 ? "eager" : "lazy"}"
          decoding="async"
          style="object-position:${item.position || "center"}"
        />
      </div>

      <div class="work-case__scrim" aria-hidden="true"></div>

      <div class="work-case__copy">
        <p class="work-case__meta">${item.meta}</p>
        <div class="work-case__bottom">
          <h2 class="work-case__name">${item.name}</h2>
          <p class="work-case__count">${number} / ${totalLabel}</p>
        </div>
      </div>
    </article>
  `;
}

function buildCasesSection() {
  const section =
    document.querySelector(".work-h3-handoff") ||
    document.querySelector("[data-work-cases]");

  if (!section) return null;

  section.className = "work-cases";
  section.dataset.workCases = "";
  section.dataset.theme = "dark";
  section.removeAttribute("aria-hidden");

  section.innerHTML = `
    <div class="work-cases__pin" data-cases-pin>
      <div class="work-cases__layers">
        ${cases.map((item, index) => caseMarkup(item, index, cases.length)).join("")}
      </div>

      <div class="work-cases__bone" data-cases-bone aria-hidden="true"></div>

      <div class="work-cases__progress" aria-hidden="true">
        <span class="work-cases__progress-fill" data-cases-progress></span>
      </div>
    </div>
  `;

  return section;
}

export function initWorkCases() {
  const section = buildCasesSection();
  if (!section) return;

  const pin = section.querySelector("[data-cases-pin]");
  const bone = section.querySelector("[data-cases-bone]");
  const layers = [...section.querySelectorAll(".work-case")];
  const progress = section.querySelector("[data-cases-progress]");
  const header = document.querySelector("[data-header]");

  if (!pin || !bone || layers.length === 0) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) {
    section.classList.add("is-reduced");
    gsap.set(bone, { opacity: 0 });
    layers.forEach((layer) => {
      gsap.set(layer, { opacity: 1 });
      gsap.set(layer.querySelector(".work-case__copy"), { opacity: 1, y: 0 });
    });
    return;
  }

  gsap.set(bone, { opacity: 1 });

  layers.forEach((layer, index) => {
    const copy = layer.querySelector(".work-case__copy");
    gsap.set(layer, {
      opacity: index === 0 ? 1 : 0,
      visibility: "visible",
    });
    gsap.set(copy, {
      opacity: index === 0 ? 1 : 0,
      y: index === 0 ? 0 : 12,
    });
  });

  gsap.set(progress, {
    scaleY: 0,
    transformOrigin: "top center",
  });

  const totalDuration =
    INTRO + layers.length * HOLD + (layers.length - 1) * TRANSITION;

  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: () => `+=${Math.max(window.innerHeight * totalDuration, 2700)}`,
      pin,
      pinSpacing: true,
      scrub: 0.38,
      anticipatePin: 1,
      invalidateOnRefresh: true,

      onEnter: () => {
        header?.classList.add("header--light");
      },

      onEnterBack: () => {
        const p = timeline.scrollTrigger?.progress ?? 0;
        header?.classList.toggle("header--light", p < 0.04);
      },

      onUpdate: (self) => {
        header?.classList.toggle("header--light", self.progress < 0.04);
      },

      onLeaveBack: () => {
        header?.classList.add("header--light");
      },
    },
  });

  timeline.to(
    bone,
    {
      opacity: 0,
      duration: INTRO,
      ease: "power2.inOut",
    },
    0
  );

  let cursor = INTRO;

  layers.forEach((layer, index) => {
    cursor += HOLD;
    if (index === layers.length - 1) return;

    const next = layers[index + 1];
    const outgoingCopy = layer.querySelector(".work-case__copy");
    const incomingCopy = next.querySelector(".work-case__copy");

    // True crossfade: no black gap.
    timeline.to(
      [layer, outgoingCopy],
      {
        opacity: 0,
        y: (_i, target) => target === outgoingCopy ? -12 : 0,
        duration: OUT,
        ease: "power1.inOut",
      },
      cursor
    );

    timeline.to(
      next,
      {
        opacity: 1,
        duration: IN,
        ease: "power1.inOut",
      },
      cursor
    );

    timeline.fromTo(
      incomingCopy,
      { opacity: 0, y: 12 },
      {
        opacity: 1,
        y: 0,
        duration: IN,
        ease: "power2.out",
      },
      cursor + 0.01
    );

    cursor += TRANSITION;
  });

  timeline.to(
    progress,
    {
      scaleY: 1,
      duration: totalDuration,
      ease: "none",
    },
    0
  );

  Promise.all(
    [...section.querySelectorAll("img")].map(
      (img) =>
        img.complete
          ? Promise.resolve()
          : new Promise((resolve) => {
              img.addEventListener("load", resolve, { once: true });
              img.addEventListener("error", resolve, { once: true });
            })
    )
  ).then(() => ScrollTrigger.refresh());
}
