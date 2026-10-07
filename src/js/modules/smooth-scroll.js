import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// En celular y tablet la barra del navegador aparece y desaparece al hacer
// scroll; sin esto, cada cambio recalcula las escenas y la página da saltos.
ScrollTrigger.config({ ignoreMobileResize: true });

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export function initSmoothScroll() {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reduceMotion) {
    return null;
  }

  /*
   * MEDAL WEIGHTED SCROLL · V6
   *
   * The goal is not scroll-snap and not a hard lock. Large wheel / trackpad
   * impulses are compressed before Lenis receives them, while smaller input
   * remains proportional. This keeps fast gestures from burning through
   * several cinematic scenes at once without making normal scrolling feel
   * sticky.
   */
  const lenis = new Lenis({
    lerp: 0.075,
    smoothWheel: true,
    wheelMultiplier: 0.78,
    touchMultiplier: 1,
    syncTouch: false,
    overscroll: false,
    virtualScroll: (data) => {
      const event = data.event;

      // Keep horizontal/modified gestures predictable.
      if (event?.shiftKey || event?.ctrlKey || event?.metaKey) {
        return true;
      }

      const delta = Number(data.deltaY || 0);
      const abs = Math.abs(delta);
      if (!abs) return true;

      // Trackpads emit many small deltas; wheels can emit large bursts.
      // Preserve precision under 44px, progressively compress stronger flicks.
      const precision = 44;
      const maxBurst = event?.deltaMode === 1 ? 72 : 118;

      let weighted = abs;
      if (abs > precision) {
        const excess = abs - precision;
        weighted = precision + Math.sqrt(excess) * 5.25;
      }

      data.deltaY = Math.sign(delta) * clamp(weighted, -maxBurst, maxBurst);
      return true;
    },
  });

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  return lenis;
}
