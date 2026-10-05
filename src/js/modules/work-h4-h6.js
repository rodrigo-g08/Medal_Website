import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import stripItems from "../../data/strip.json";
import site from "../../data/site.json";
import { initFolio } from "./work-folio.js";

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
    <figure class="work-beyond__figure" data-strip-card>
      <img
        class="work-beyond__image"
        src="${item.src}"
        alt="${item.alt || ""}"
        loading="lazy"
        decoding="async"
        draggable="false"
        style="object-position:${item.position || "center"}"
      />
      <figcaption class="work-beyond__caption">${item.client || "Medal"}</figcaption>
    </figure>
  `;
}

function buildStrip() {
  const track = document.querySelector("[data-work-strip]");
  if (!track) return null;

  const groupMarkup = stripItems.map(stripMarkup).join("");
  track.innerHTML = `
    <div class="work-beyond__strip-group" data-strip-group>${groupMarkup}</div>
    <div class="work-beyond__strip-group" data-strip-group aria-hidden="true">${groupMarkup}</div>
  `;
  return track;
}

function initInteractiveStrip(track) {
  const shell = track.closest(".work-beyond__strip-shell");
  const groups = [...track.querySelectorAll("[data-strip-group]")];
  if (!shell || groups.length < 2) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const state = {
    x: 0,
    loopWidth: 1,
    mode: "auto", // auto | explore | focus
    targetVelocity: -20,
    velocity: -20,
    pointerX: 0,
    lastPointerX: 0,
    lastPointerY: 0,
    focusTimer: null,
    focusedCard: null,
    raf: 0,
    previousFrame: performance.now(),
  };

  const AUTO_SPEED = -20; // px/s
  const MAX_EXPLORE_SPEED = 520; // px/s at the outer edges
  const DEAD_ZONE = 0.12;
  const FOCUS_DELAY = 165;
  const VELOCITY_RESPONSE = 8.5;

  const measure = () => {
    const trackStyle = getComputedStyle(track);
    const gap = parseFloat(trackStyle.columnGap || trackStyle.gap || "0") || 0;
    state.loopWidth = groups[0].getBoundingClientRect().width + gap;
  };

  const wrap = () => {
    const w = state.loopWidth;
    if (!w || !Number.isFinite(w)) return;
    while (state.x <= -w) state.x += w;
    while (state.x > 0) state.x -= w;
  };

  const render = () => {
    track.style.transform = `translate3d(${state.x}px, 0, 0)`;
  };

  const setExploreVelocity = (clientX) => {
    const rect = shell.getBoundingClientRect();
    if (!rect.width) return;

    const local = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    const normalized = local * 2 - 1; // -1 left / +1 right
    const magnitude = Math.abs(normalized);

    if (magnitude <= DEAD_ZONE) {
      // Near the center there is still a tiny Medal drift to the left.
      state.targetVelocity = AUTO_SPEED * 0.35;
      return;
    }

    const strength = Math.pow(
      (magnitude - DEAD_ZONE) / (1 - DEAD_ZONE),
      1.28
    );

    // Left cursor moves the reel right; right cursor moves it left.
    state.targetVelocity = -Math.sign(normalized) * MAX_EXPLORE_SPEED * strength;
  };

  const clearFocusTimer = () => {
    if (state.focusTimer) {
      window.clearTimeout(state.focusTimer);
      state.focusTimer = null;
    }
  };

  const releaseFocus = () => {
    clearFocusTimer();
    if (state.focusedCard) {
      state.focusedCard.classList.remove("is-focused");
      state.focusedCard = null;
    }
    shell.classList.remove("is-focus");
  };

  const enterFocus = (card) => {
    if (!card || state.mode === "auto") return;

    releaseFocus();
    state.mode = "focus";
    state.focusedCard = card;
    state.targetVelocity = 0;
    state.velocity = 0;
    card.classList.add("is-focused");
    shell.classList.add("is-focus");
  };

  const scheduleFocus = (card) => {
    clearFocusTimer();
    if (!card || state.mode === "auto") return;

    state.focusTimer = window.setTimeout(() => {
      const hovered = document.elementFromPoint(
        state.lastPointerX,
        state.lastPointerY
      )?.closest?.("[data-strip-card]");

      if (hovered === card && shell.contains(hovered)) {
        enterFocus(card);
      }
    }, FOCUS_DELAY);
  };

  const tick = (now) => {
    const dt = Math.min((now - state.previousFrame) / 1000, 0.05);
    state.previousFrame = now;

    if (!reduced) {
      if (state.mode !== "focus") {
        const blend = 1 - Math.exp(-VELOCITY_RESPONSE * dt);
        state.velocity += (state.targetVelocity - state.velocity) * blend;
        state.x += state.velocity * dt;
        wrap();
        render();
      }
    }

    state.raf = requestAnimationFrame(tick);
  };

  if (finePointer && !reduced) {
    shell.addEventListener("pointerenter", (event) => {
      state.mode = "explore";
      state.lastPointerX = event.clientX;
      state.lastPointerY = event.clientY;
      setExploreVelocity(event.clientX);

      const card = document.elementFromPoint(event.clientX, event.clientY)
        ?.closest?.("[data-strip-card]");
      if (card && shell.contains(card)) scheduleFocus(card);
    });

    shell.addEventListener("pointermove", (event) => {
      const dx = event.clientX - state.lastPointerX;
      const dy = event.clientY - state.lastPointerY;
      const movement = Math.hypot(dx, dy);

      state.lastPointerX = event.clientX;
      state.lastPointerY = event.clientY;

      if (state.mode === "focus" && movement > 2.5) {
        releaseFocus();
        state.mode = "explore";
      } else if (state.mode !== "focus") {
        state.mode = "explore";
      }

      if (state.mode !== "focus") {
        setExploreVelocity(event.clientX);
      }

      const card = event.target.closest?.("[data-strip-card]");
      if (state.mode !== "focus") {
        scheduleFocus(card && shell.contains(card) ? card : null);
      }
    });

    shell.addEventListener("pointerleave", () => {
      releaseFocus();
      state.mode = "auto";
      state.targetVelocity = AUTO_SPEED;
    });
  }

  const images = [...track.querySelectorAll("img")];
  Promise.all(images.map((img) => img.complete
    ? Promise.resolve()
    : new Promise((resolve) => {
        img.addEventListener("load", resolve, { once: true });
        img.addEventListener("error", resolve, { once: true });
      })
  )).then(() => {
    measure();
    wrap();
    render();
  });

  window.addEventListener("resize", measure, { passive: true });
  measure();
  render();
  state.raf = requestAnimationFrame(tick);
}

function initH4() {
  const section = document.querySelector("[data-work-beyond]");
  if (!section) return;

  keepHeaderWhite(section);

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

  initFolio(section);
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
  if (rule) void rule.offsetWidth;
  item.classList.add("is-animated");

  item._resultTween?.kill();

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

  if (reduced) {
    items.forEach((item) => {
      const valueEl = item.querySelector("[data-result-value]");
      if (!valueEl) return;
      const endValue = Number(valueEl.dataset.value);
      item.classList.add("is-animated");
      valueEl.textContent = Number.isNaN(endValue)
        ? valueEl.dataset.static || valueEl.textContent
        : formatResult(
            endValue,
            valueEl.dataset.prefix || "",
            valueEl.dataset.suffix || "",
            Number(valueEl.dataset.decimals || 0)
          );
    });
    return;
  }

  const replay = () => items.forEach(animateResult);

  ScrollTrigger.create({
    trigger: section,
    start: "top 72%",
    end: "bottom 28%",
    onEnter: replay,
    onEnterBack: replay,
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

function setAvailabilityMarkup(title, config) {
  const headline = config.headline || "Six new brands a month.";
  const lines = Array.isArray(config.headlineLines) && config.headlineLines.length
    ? config.headlineLines
    : [headline];

  title.setAttribute("aria-label", headline);
  title.innerHTML = lines
    .map((line) => `<span class="work-availability__title-line" data-availability-title-line>${line}</span>`)
    .join("");
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

  keepHeaderWhite(section);

  if (label) label.textContent = config.label || "Availability";
  if (title) setAvailabilityMarkup(title, config);

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

  const total = Math.max(1, Number(config.total || 6));
  const occupied = Math.max(0, Math.min(Number(config.occupied || 0), total));

  if (slots) {
    slots.innerHTML = Array.from({ length: total }, () => `
      <span class="work-availability__slot" data-availability-slot aria-hidden="true"></span>
    `).join("");
    slots.setAttribute("aria-label", `${occupied} of ${total} monthly capacity positions highlighted`);
  }

  const titleLines = [...section.querySelectorAll("[data-availability-title-line]")];
  const allSlots = [...section.querySelectorAll("[data-availability-slot]")];
  const activeSlots = allSlots.slice(0, occupied);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const reset = () => {
    section._availabilityTimeline?.kill();
    gsap.set(titleLines, { color: "#F2EFE8" });
    gsap.set(allSlots, {
      backgroundColor: "transparent",
      borderColor: "rgba(242, 239, 232, 0.42)",
      scale: 0.92,
      opacity: 1,
    });
  };

  if (reduced) {
    reset();
    gsap.set(activeSlots, {
      backgroundColor: "#E0F53B",
      borderColor: "#E0F53B",
      scale: 1,
    });
    return;
  }

  const play = () => {
    reset();

    const tl = gsap.timeline();
    section._availabilityTimeline = tl;

    tl.to(titleLines, {
      color: "#E0F53B",
      duration: 0.42,
      stagger: 0.12,
      ease: "power2.out",
    })
      .to(titleLines, {
        color: "#F2EFE8",
        duration: 0.68,
        stagger: 0.08,
        ease: "power2.inOut",
      }, "+=0.16")
      .to(activeSlots, {
        backgroundColor: "#E0F53B",
        borderColor: "#E0F53B",
        scale: 1,
        duration: 0.38,
        stagger: 0.12,
        ease: "back.out(1.65)",
      }, "-=0.34");
  };

  ScrollTrigger.create({
    trigger: section,
    start: "top 68%",
    end: "bottom 32%",
    onEnter: play,
    onEnterBack: play,
  });
}

export function initWorkH4H6() {
  initH4();
  initH5();
  initLogos();
  initAvailability();
}
