import stripItems from "../../data/strip.json";

/*
 * WORK · MORE THAN A PORTFOLIO
 *
 * Las fotografías son franjas verticales con el lenguaje de los reels de
 * Film & Services (esquinas redondeadas, sombreado, rótulo). La fila avanza
 * sola, despacio y en bucle; la franja que pasa por el centro se abre.
 * Con el cursor encima la fila se detiene y se abre la franja señalada.
 */

const SPEED = 26; // px por segundo
const TOUCH_HOLD_MS = 4200;

function sliceMarkup(item, index, hidden) {
  const [name, detail] = String(item.client || "Medal").split(" · ");
  return `
    <button class="folio-slice${index % 2 ? " folio-slice--low" : ""}" type="button" data-folio-slice${hidden ? ' aria-hidden="true" tabindex="-1"' : ""}>
      <img src="${item.src}" alt="${hidden ? "" : item.alt || ""}" loading="lazy" decoding="async" draggable="false" style="object-position:${item.position || "center"}" />
      <span class="folio-slice__shade" aria-hidden="true"></span>
      <span class="folio-slice__bar" aria-hidden="true"></span>
      <span class="folio-slice__meta"><span>${name}</span><span>${detail || "Photography"}</span></span>
    </button>`;
}

export function initFolio(section) {
  const shell = section.querySelector("[data-folio]");
  const track = section.querySelector("[data-folio-track]");
  if (!shell || !track || !stripItems.length) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Dos juegos de fotos para que la fila siempre llene la pantalla.
  track.innerHTML =
    stripItems.map((item, i) => sliceMarkup(item, i, false)).join("") +
    stripItems.map((item, i) => sliceMarkup(item, i, true)).join("");

  let open = null;
  let hovering = false;
  let holdUntil = 0;
  let visible = false;
  let offset = 0;
  let last = 0;

  const setOpen = (slice) => {
    if (slice === open) return;
    open?.classList.remove("is-open");
    open = slice;
    open?.classList.add("is-open");
  };

  const gap = () => parseFloat(getComputedStyle(track).columnGap) || 10;

  // Línea de referencia: la franja que la cruza es la que se abre.
  const referenceX = () => {
    const rect = shell.getBoundingClientRect();
    const closed = track.querySelector(".folio-slice:not(.is-open)");
    const w0 = closed ? closed.getBoundingClientRect().width : 110;
    const probe = getComputedStyle(shell).getPropertyValue("--folio-open-px");
    const w1 = parseFloat(probe) || Math.min(rect.width * 0.34, 600);
    return rect.left + rect.width / 2 + w1 / 2 - w0 / 2;
  };

  const sliceAt = (x) => {
    const g = gap();
    return [...track.children].find((slice) => {
      const rect = slice.getBoundingClientRect();
      return x >= rect.left && x < rect.right + g;
    });
  };

  const measureOpenWidth = () => {
    const probe = document.createElement("div");
    probe.style.cssText = "position:absolute;visibility:hidden;width:var(--folio-open);height:0;";
    shell.appendChild(probe);
    shell.style.setProperty("--folio-open-px", `${probe.offsetWidth}`);
    probe.remove();
  };

  const loop = (time) => {
    const dt = Math.min(64, time - (last || time));
    last = time;

    const moving = visible && !hovering && time > holdUntil && !document.hidden;
    if (moving) {
      offset -= (SPEED * dt) / 1000;

      // La franja que salió por la izquierda vuelve al final de la fila.
      const first = track.firstElementChild;
      if (first && first !== open) {
        const rect = first.getBoundingClientRect();
        if (rect.right < shell.getBoundingClientRect().left - 4) {
          offset += rect.width + gap();
          track.appendChild(first);
        }
      }

      track.style.transform = `translate3d(${offset.toFixed(2)}px,0,0)`;

      const candidate = sliceAt(referenceX());
      if (candidate) setOpen(candidate);
    }

    requestAnimationFrame(loop);
  };

  track.addEventListener("pointerover", (event) => {
    if (event.pointerType !== "mouse") return;
    const slice = event.target.closest("[data-folio-slice]");
    if (!slice) return;
    hovering = true;
    setOpen(slice);
  });

  shell.addEventListener("pointerleave", () => {
    hovering = false;
  });

  track.addEventListener("click", (event) => {
    const slice = event.target.closest("[data-folio-slice]");
    if (!slice) return;
    setOpen(slice);
    holdUntil = performance.now() + TOUCH_HOLD_MS;
  });

  track.addEventListener("focusin", (event) => {
    const slice = event.target.closest("[data-folio-slice]");
    if (!slice) return;
    setOpen(slice);
    holdUntil = performance.now() + TOUCH_HOLD_MS;
  });

  new IntersectionObserver(
    (entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
    },
    { rootMargin: "15% 0px" }
  ).observe(shell);

  measureOpenWidth();
  window.addEventListener("resize", measureOpenWidth, { passive: true });

  if (reduced) {
    setOpen(track.children[2] || track.firstElementChild);
    shell.classList.add("is-static");
    return;
  }

  requestAnimationFrame(() => {
    setOpen(sliceAt(referenceX()) || track.children[2]);
    requestAnimationFrame(loop);
  });
}
