import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import cases from "../../data/cases.json";

gsap.registerPlugin(ScrollTrigger);

const INTRO = 0.04;
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

      <button class="work-cases__skip" type="button" data-cases-skip aria-label="Skip to the photographs"><svg viewBox="218 0 79 78" aria-hidden="true"><polygon fill="currentColor" opacity="0.45" transform="translate(0 0)" points="257.48 37.66 218.21 15.57 226.97 0 257.48 17.16 287.98 0 296.74 15.57 257.48 37.66"/><polygon fill="currentColor" opacity="0.7" transform="translate(0 20)" points="257.48 37.66 218.21 15.57 226.97 0 257.48 17.16 287.98 0 296.74 15.57 257.48 37.66"/><polygon fill="currentColor" opacity="1" transform="translate(0 40)" points="257.48 37.66 218.21 15.57 226.97 0 257.48 17.16 287.98 0 296.74 15.57 257.48 37.66"/></svg><span>Skip to photos</span></button>

      <div class="work-cases__progress" aria-hidden="true">
        <span class="work-cases__progress-fill" data-cases-progress></span>
      </div>
    </div>
  `;

  return section;
}

let lenisRef = null;

export function initWorkCases(lenis = null) {
  lenisRef = lenis;
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

      onEnterBack: () => {
        header?.classList.remove("header--light");
      },

      onLeave: () => {
        header?.classList.remove("header--light");
      },

      onLeaveBack: () => {
        header?.classList.add("header--light");
      },
    },
  });

  /*
   * Fundido entre «Every brand, a different standard.» y la primera foto.
   * La sección de casos queda fijada justo debajo de la pantalla clara; al
   * seguir bajando, la pantalla clara se disuelve y deja ver la foto. No hay
   * un borde que separe a ambas.
   */
  gsap.set(bone, { opacity: 0 });

  const hero = document.querySelector("[data-work-intro]");
  if (hero) {
    const overlap = () => {
      section.style.marginTop = `${-hero.offsetHeight}px`;
    };
    overlap();
    ScrollTrigger.addEventListener("refreshInit", overlap);

    // Mientras el inicio de Work sigue en pantalla, los casos esperan ocultos debajo.
    const setVisible = (self) => {
      section.style.opacity = self.isActive ? "" : "0";
      section.style.pointerEvents = self.isActive ? "" : "none";
    };
    section.style.opacity = "0";
    section.style.pointerEvents = "none";
    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "max",
      onToggle: setVisible,
      onRefresh: setVisible,
    });

    gsap.fromTo(
      hero,
      { opacity: 1 },
      {
        opacity: 0,
        ease: "none",
        immediateRender: false,
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${window.innerHeight * 0.5}`,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            header?.classList.toggle("header--light", self.progress < 0.5);
            hero.style.pointerEvents = self.progress > 0.5 ? "none" : "";
          },
          onLeaveBack: () => {
            header?.classList.add("header--light");
            hero.style.pointerEvents = "";
          },
        },
      }
    );
  }

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

// Salto opcional: baja directo a «More than a portfolio».
document.addEventListener("click", (event) => {
  const skip = event.target.closest?.("[data-cases-skip]");
  if (!skip) return;
  const target = document.querySelector("[data-work-beyond]");
  if (!target) return;
  const top = target.getBoundingClientRect().top + window.scrollY;
  // Bajada lenta y suave: arranca y frena despacio.
  if (lenisRef?.scrollTo) {
    lenisRef.scrollTo(top, {
      duration: 3.2,
      easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    });
  } else {
    window.scrollTo({ top, behavior: "smooth" });
  }
});
