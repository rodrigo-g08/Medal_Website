import { initMedalShell } from "../main.js";
import { initFilmServices } from "../modules/film-services.js";

const { lenis } = initMedalShell();
initFilmServices(lenis);
