import { initHeader } from "./modules/header.js";
import { initHalos } from "./modules/halos.js";
import { initButtons } from "./modules/buttons.js";

export function initMedalShell() {
  initHalos();
  initHeader();
  initButtons();
}
