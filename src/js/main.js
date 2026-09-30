import { initHeader } from "./modules/header.js";
import { initHalos } from "./modules/halos.js";
import { initButtons } from "./modules/buttons.js";
import { initSmoothScroll } from "./modules/smooth-scroll.js";

export function initMedalShell() {
  const lenis = initSmoothScroll();

  initHalos();
  initHeader();
  initButtons();

  return { lenis };
}
