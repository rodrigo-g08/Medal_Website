import { initMedalShell } from "../main.js";
import { initContact } from "../modules/contact.js";

const { lenis } = initMedalShell();
initContact(lenis);
