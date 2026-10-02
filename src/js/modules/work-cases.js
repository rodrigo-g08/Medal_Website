import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import cases from "../../data/cases.json";

gsap.registerPlugin(ScrollTrigger);

const INTRO = 0.20;
const HOLD = 0.74;
const TRANSITION = 0.58;
const FADE_TO_BLACK = 0.17;
const BLACK_HOLD = 0.09;
const FADE_FROM_BLACK = 0.22;

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

      <div class="work-cases__fade" data-cases-fade aria-hidden="true"></div>
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
  const fade = section.querySelector("[data-cases-fade]");
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
  if (fade) gsap.set(fade, { opacity: 0 });

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
        header?.classList.toggle("header--light", p < 0.035);
      },

      onUpdate: (self) => {
        header?.classList.toggle("header--light", self.progress < 0.035);
      },

      onLeave: () => {
        header?.classList.remove("header--light");
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

    // Cinematic transition: image -> perceptible black -> next image.
    // The next case is swapped only while the black veil is fully opaque.
    timeline.to(
      outgoingCopy,
      {
        opacity: 0,
        y: -12,
        duration: 0.13,
        ease: "power1.in",
      },
      cursor
    );

    if (fade) {
      timeline.to(
        fade,
        {
          opacity: 1,
          duration: FADE_TO_BLACK,
          ease: "power2.in",
        },
        cursor
      );
    }

    timeline.set(layer, { opacity: 0 }, cursor + FADE_TO_BLACK);
    timeline.set(next, { opacity: 1 }, cursor + FADE_TO_BLACK);

    if (fade) {
      timeline.to(
        fade,
        {
          opacity: 0,
          duration: FADE_FROM_BLACK,
          ease: "power2.out",
        },
        cursor + FADE_TO_BLACK + BLACK_HOLD
      );
    }

    timeline.fromTo(
      incomingCopy,
      { opacity: 0, y: 14 },
      {
        opacity: 1,
        y: 0,
        duration: 0.22,
        ease: "power2.out",
      },
      cursor + FADE_TO_BLACK + BLACK_HOLD + 0.08
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
