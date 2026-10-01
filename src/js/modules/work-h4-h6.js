import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import stripItems from "../../data/strip.json";
import site from "../../data/site.json";

gsap.registerPlugin(ScrollTrigger);

function keepHeaderWhite(section) {
  const header = document.querySelector("[data-header]");
  if (!section || !header) return;

  const setDarkIdentity = () => header.classList.remove("header--light");

  ScrollTrigger.create({
    trigger: section,
    start: "top 92%",
    end: "bottom 8%",
    onEnter: setDarkIdentity,
    onEnterBack: setDarkIdentity,
    onUpdate: setDarkIdentity,
  });
}

function stripMarkup(item) {
  return `
    <figure class="work-beyond__figure">
      <img
        class="work-beyond__image"
        src="${item.src}"
        alt="${item.alt || ""}"
        loading="lazy"
        decoding="async"
        style="object-position:${item.position || "center"}"
      />
      <figcaption class="work-beyond__caption">${item.client || "Medal"}</figcaption>
    </figure>
  `;
}

function buildStrip() {
  const track = document.querySelector("[data-work-strip]");
  if (!track) return null;

  const sequence = [...stripItems, ...stripItems];
  track.innerHTML = sequence.map(stripMarkup).join("");
  return track;
}

function initH4() {
  const section = document.querySelector("[data-work-beyond]");
  const track = buildStrip();
  if (!section || !track) return;

  keepHeaderWhite(section);

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  gsap.fromTo(
    section.querySelectorAll("[data-h4-reveal]"),
    { opacity: 0, y: 18 },
    {
      opacity: 1,
      y: 0,
      duration: 0.72,
      stagger: 0.08,
      ease: "power2.out",
      scrollTrigger: {
        trigger: section,
        start: "top 78%",
        once: true,
      },
    }
  );

  if (!reduced) {
    track.classList.add("is-marquee");
  }
}

function formatResult(value, prefix = "", suffix = "", decimals = 0) {
  if (typeof value !== "number") return `${prefix}${value ?? ""}${suffix}`;
  return `${prefix}${value.toFixed(decimals)}${suffix}`;
}

function animateResult(item) {
  const valueEl = item.querySelector("[data-result-value]");
  if (!valueEl) return;

  const endValue = Number(valueEl.dataset.value);
  const prefix = valueEl.dataset.prefix || "";
  const suffix = valueEl.dataset.suffix || "";
  const decimals = Number(valueEl.dataset.decimals || 0);
  const rule = item.querySelector(".work-result__rule");

  if (Number.isNaN(endValue)) {
    valueEl.textContent = valueEl.dataset.static || valueEl.textContent;
    return;
  }

  item.classList.remove("is-animated");
  if (rule) {
    void rule.offsetWidth;
  }
  item.classList.add("is-animated");

  if (item._resultTween) {
    item._resultTween.kill();
  }

  const counter = { value: 0 };
  valueEl.textContent = formatResult(0, prefix, suffix, decimals);

  item._resultTween = gsap.timeline()
    .to(counter, {
      value: endValue,
      duration: 1.5,
      ease: "power2.out",
      onUpdate: () => {
        valueEl.textContent = formatResult(counter.value, prefix, suffix, decimals);
      },
    }, 0)
    .fromTo(valueEl, { scale: 1 }, {
      scale: 1.04,
      duration: 0.14,
      ease: "power1.out",
    }, 1.28)
    .to(valueEl, {
      scale: 1,
      duration: 0.18,
      ease: "power2.out",
    });
}

function initH5() {
  const section = document.querySelector("[data-work-results]");
  if (!section) return;

  keepHeaderWhite(section);

  const items = [...section.querySelectorAll("[data-result]")];
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  items.forEach((item) => {
    const valueEl = item.querySelector("[data-result-value]");
    if (!valueEl) return;

    const endValue = Number(valueEl.dataset.value);
    const prefix = valueEl.dataset.prefix || "";
    const suffix = valueEl.dataset.suffix || "";
    const decimals = Number(valueEl.dataset.decimals || 0);

    if (reduced || Number.isNaN(endValue)) {
      item.classList.add("is-animated");
      valueEl.textContent = Number.isNaN(endValue)
        ? valueEl.dataset.static || valueEl.textContent
        : formatResult(endValue, prefix, suffix, decimals);
      return;
    }

    ScrollTrigger.create({
      trigger: section,
      start: "top 72%",
      end: "bottom 28%",
      onEnter: () => animateResult(item),
      onEnterBack: () => animateResult(item),
    });
  });
}

function logoItem(logo) {
  const style = [
    logo.width ? `--logo-w:${logo.width}` : "",
    logo.height ? `--logo-h:${logo.height}` : "",
  ].filter(Boolean).join(";");

  const fallback = logo.fallback ? `data-fallback="${logo.fallback}"` : "";

  return `
    <div class="work-client-logo work-client-logo--${logo.treatment || "invert"} ${logo.className || ""}" title="${logo.name}" ${style ? `style="${style}"` : ""}>
      <img src="${logo.src}" alt="${logo.name}" loading="lazy" decoding="async" ${fallback} />
    </div>
  `;
}

function initLogos() {
  const track = document.querySelector("[data-client-logos]");
  if (!track) return;

  keepHeaderWhite(document.querySelector(".work-close"));

  const logos = site.clientLogos || [];
  const sequence = [...logos, ...logos];
  track.innerHTML = sequence.map(logoItem).join("");

  track.querySelectorAll("img[data-fallback]").forEach((img) => {
    img.addEventListener("error", () => {
      const fallback = img.dataset.fallback;
      if (!fallback || img.src.endsWith(fallback)) return;
      img.src = fallback;
    }, { once: true });
  });
}

function initAvailability() {
  const section = document.querySelector("[data-availability]");
  if (!section) return;

  const config = site.availability || {};
  const label = section.querySelector("[data-availability-label]");
  const title = section.querySelector("[data-availability-title]");
  const slots = section.querySelector("[data-availability-slots]");
  const primary = section.querySelector("[data-availability-primary]");
  const secondary = section.querySelector("[data-availability-secondary]");

  if (label) label.textContent = config.label || "Availability";
  if (title) title.textContent = config.headline || "Four new brands a month.";

  if (primary && config.primaryCta) {
    primary.href = config.primaryCta.href || "/contact/";
    const text = primary.querySelector(".button__label");
    if (text) {
      text.textContent = config.primaryCta.label || "Book your Medal Session";
      text.dataset.label = text.textContent;
    }
  }

  if (secondary && config.secondaryCta) {
    secondary.href = config.secondaryCta.href || "/film-services/";
    secondary.textContent = config.secondaryCta.label || "See our plans";
  }

  const total = Math.max(1, Number(config.total || 4));
  const occupiedIsReal = Number.isInteger(config.occupied) && config.occupied >= 0;
  const occupied = occupiedIsReal ? Math.min(config.occupied, total) : 0;

  if (slots) {
    slots.innerHTML = Array.from({ length: total }, (_, index) => `
      <span
        class="work-availability__slot${index < occupied ? " is-occupied" : ""}"
        data-availability-slot
        aria-hidden="true"
      ></span>
    `).join("");
    slots.setAttribute(
      "aria-label",
      occupiedIsReal
        ? `${occupied} of ${total} monthly positions occupied`
        : "Current monthly availability to be confirmed"
    );
  }

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced || !occupiedIsReal) return;

  const occupiedSlots = [...section.querySelectorAll(".work-availability__slot.is-occupied")];
  gsap.fromTo(
    occupiedSlots,
    { scale: 0, opacity: 0.25 },
    {
      scale: 1,
      opacity: 1,
      duration: 0.46,
      stagger: 0.1,
      ease: "back.out(1.6)",
      scrollTrigger: {
        trigger: section,
        start: "top 65%",
        once: true,
      },
    }
  );
}

export function initWorkH4H6() {
  initH4();
  initH5();
  initLogos();
  initAvailability();
}
