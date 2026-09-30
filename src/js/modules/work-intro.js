import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initWorkIntro() {
  const hero = document.querySelector("[data-work-intro]");
  const word = document.querySelector("[data-work-word]");
  const oLetter = document.querySelector("[data-work-o]");
  const otherLetters = [...document.querySelectorAll("[data-work-other]")];
  const copies = [...document.querySelectorAll("[data-work-copy]")];
  const bone = document.querySelector("[data-work-bone]");
  const boneContent = document.querySelector("[data-work-bone-content]");
  const ambient = document.querySelector(".ambient");
  const header = document.querySelector("[data-header]");

  if (!hero || !word || !oLetter || !bone || !boneContent) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  /*
   * Every black scene keeps the approved H1.4 halo system.
   */
  if (ambient) {
    gsap.set(ambient, { opacity: 1 });
  }

  if (reduceMotion.matches) {
    gsap.set(bone, { opacity: 1 });
    gsap.set(boneContent, { opacity: 1 });
    return;
  }

  /*
   * We no longer infer a transform origin from a marker inside the complete
   * WORK word. We animate the real O node, guaranteeing the zoom cannot drift
   * under the R.
   *
   * x/y move the O's left stroke gently toward the viewport center while the
   * O expands, so the transition feels intentional rather than off-axis.
   */
  const getOMotion = () => {
    const rect = oLetter.getBoundingClientRect();

    const strokeX = rect.left + rect.width * 0.18;
    const strokeY = rect.top + rect.height * 0.50;

    return {
      x: window.innerWidth * 0.50 - strokeX,
      y: window.innerHeight * 0.50 - strokeY,
    };
  };

  const getOScale = () => {
    if (window.innerWidth <= 540) return 12.5;
    if (window.innerWidth <= 860) return 13.5;
    return 15;
  };

  gsap.set(oLetter, {
    transformOrigin: "18% 50%",
  });

  gsap.fromTo(
    word,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: .7,
      ease: "power2.out",
      clearProps: "y",
    }
  );

  gsap.fromTo(
    copies,
    { opacity: 0, y: 16 },
    {
      opacity: 1,
      y: 0,
      duration: .65,
      delay: .12,
      stagger: .06,
      ease: "power2.out",
      clearProps: "y",
    }
  );

  gsap.set(bone, { opacity: 0 });
  gsap.set(boneContent, { opacity: 0 });

  const timeline = gsap.timeline({
    defaults: { ease: "none" },

    scrollTrigger: {
      trigger: hero,
      start: "top top",
      end: () =>
        `+=${Math.max(window.innerHeight * 1.12, 720)}`,
      pin: true,
      pinSpacing: true,
      scrub: .68,
      anticipatePin: 1,
      invalidateOnRefresh: true,

      onUpdate: (self) => {
        header?.classList.toggle(
          "header--light",
          self.progress >= .78
        );

        if (ambient && self.progress < .77) {
          ambient.style.opacity = "1";
        }
      },

      onLeaveBack: () => {
        header?.classList.remove("header--light");

        if (ambient) {
          ambient.style.opacity = "1";
        }
      },
    },
  });

  timeline
    /*
     * Remove peripheral text first.
     */
    .to(
      copies,
      {
        opacity: 0,
        y: -12,
        duration: .12,
      },
      0
    )

    /*
     * W/R/K disappear while O remains fully visible.
     * This makes the target unambiguous.
     */
    .to(
      otherLetters,
      {
        opacity: 0,
        duration: .18,
      },
      .07
    )

    /*
     * A very small approach for the whole word preserves the smooth feeling.
     */
    .to(
      word,
      {
        scale: 1.035,
        duration: .10,
      },
      .02
    )

    /*
     * The real O now performs the transition.
     * Function-based values recalculate after resize/refresh.
     */
    .to(
      oLetter,
      {
        scale: getOScale,
        x: () => getOMotion().x,
        y: () => getOMotion().y,
        duration: .64,
        ease: "power1.in",
      },
      .10
    )

    /*
     * Same-color handoff once the enlarged O stroke dominates the viewport.
     */
    .to(
      bone,
      {
        opacity: 1,
        duration: .07,
      },
      .715
    )

    /*
     * Text is already in final position: pure inverse fade, 0 -> 1.
     */
    .to(
      boneContent,
      {
        opacity: 1,
        duration: .10,
      },
      .785
    );

  document.fonts?.ready?.then(() => {
    ScrollTrigger.refresh();
  });
}
