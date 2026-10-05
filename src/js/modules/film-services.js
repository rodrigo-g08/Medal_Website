import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import site from "../../data/site.json";
import reelsData from "../../data/reels.json";

gsap.registerPlugin(ScrollTrigger);

const REEL_DWELL_MS = 10000;
const REEL_SPEED_PX = 42;

const SERVICES = [
  {
    id: "bronze",
    index: "01",
    label: "Bronze Medal · The Shoot",
    title: "The Shoot",
    lead: "For brands with the idea already defined. Medal turns it into a directed production where every frame answers the same brief.",
  },
  {
    id: "silver",
    index: "02",
    label: "Silver Medal · The Brand",
    title: "The Brand",
    lead: "For businesses whose value has outgrown the way they show up. Medal builds one visual direction that can keep working across channels.",
  },
  {
    id: "gold",
    index: "03",
    label: "Gold Medal · The Launch",
    title: "The Launch",
    lead: "For an opening, relaunch or campaign that needs one clear idea carried from first frame to the final rollout.",
  },
];

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);
const ramp = (p, a, b) => clamp((p - a) / Math.max(b - a, 0.0001));
const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const lerp = (a, b, t) => a + (b - a) * t;

function prepareYellowSweep(target) {
  if (!target || target.dataset.sweepPrepared === "true") return target;
  const content = target.innerHTML;
  target.innerHTML = `<span class="yellow-sweep__base">${content}</span><span class="yellow-sweep__flash" aria-hidden="true">${content}</span>`;
  target.dataset.sweepPrepared = "true";
  return target;
}

function resetYellowSweep(target) {
  if (!target) return;
  prepareYellowSweep(target);
  const flash = target.querySelector(".yellow-sweep__flash");
  if (!flash) return;
  gsap.killTweensOf(flash);
  gsap.set(flash, { clipPath: "inset(0 100% 0 0)" });
}

function playYellowSweep(target, totalDuration = 1.16) {
  if (!target) return;
  prepareYellowSweep(target);
  const flash = target.querySelector(".yellow-sweep__flash");
  if (!flash) return;
  const half = totalDuration / 2;
  gsap.killTweensOf(flash);
  gsap.set(flash, { clipPath: "inset(0 100% 0 0)" });
  gsap.timeline()
    .to(flash, { clipPath: "inset(0 0% 0 0)", duration: half, ease: "power2.inOut" })
    .to(flash, { clipPath: "inset(0 0 0 100%)", duration: half, ease: "power2.inOut" })
    .set(flash, { clipPath: "inset(0 100% 0 0)" });
}

function initYellowSweeps() {
  const targets = [...document.querySelectorAll("[data-yellow-sweep]:not([data-spot-title]):not([data-availability-title])")];
  targets.forEach((target) => {
    prepareYellowSweep(target);
    const section = target.closest("section") || target;
    ScrollTrigger.create({
      trigger: section,
      start: "top 68%",
      end: "bottom 24%",
      onEnter: () => playYellowSweep(target),
      onEnterBack: () => playYellowSweep(target),
      onLeave: () => resetYellowSweep(target),
      onLeaveBack: () => resetYellowSweep(target),
    });
  });
}

function initFilmHero() {
  const section = document.querySelector("[data-film-hero]");
  if (!section) return;

  const frame = section.querySelector("[data-film-frame]");
  const opening = section.querySelector("[data-film-opening]");
  const cinemaCopy = section.querySelector("[data-film-cinema-copy]");
  const video = section.querySelector("[data-film-video]");
  const sound = section.querySelector("[data-film-sound]");
  const soundLabel = section.querySelector("[data-film-sound-label]");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile = window.matchMedia("(max-width: 760px)");

  if (!reduced && frame) {
    const timeline = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.55,
        invalidateOnRefresh: true,
      },
    });

    timeline
      .to(opening, { opacity: 0, y: -20, duration: 0.28 }, 0.08)
      .to(frame, {
        width: () => mobile.matches ? "90vw" : "66vw",
        height: "72vh",
        borderRadius: 16,
        duration: 0.62,
      }, 0.22)
      .to(cinemaCopy, { opacity: 1, y: 0, duration: 0.30, ease: "power2.out" }, 0.64);
  } else if (cinemaCopy) {
    cinemaCopy.style.opacity = "1";
    cinemaCopy.style.transform = "none";
  }

  if (video && sound) {
    sound.addEventListener("click", async () => {
      video.muted = !video.muted;
      video.volume = 1;
      sound.setAttribute("aria-pressed", String(!video.muted));
      if (soundLabel) soundLabel.textContent = video.muted ? "Sound off" : "Sound on";
      if (!video.muted) {
        try { await video.play(); } catch (_) {}
      }
    });
  }
}

function initReels(lenis) {
  const section = document.querySelector("[data-reels]");
  const viewport = document.querySelector("[data-reels-viewport]");
  const track = document.querySelector("[data-reels-track]");
  const viewer = document.querySelector("[data-reel-viewer]");
  if (!section || !viewport || !track || !viewer || !reelsData.length) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const backdrop = viewer.querySelector("[data-viewer-backdrop]");
  const shell = viewer.querySelector("[data-viewer-shell]");
  const viewerVideo = viewer.querySelector("[data-viewer-video]");
  const viewerProgress = viewer.querySelector("[data-viewer-progress]");
  const viewerMeta = viewer.querySelector("[data-viewer-meta]");
  const viewerControls = viewer.querySelector("[data-viewer-controls]");
  const viewerCategory = viewer.querySelector("[data-viewer-category]");
  const viewerClient = viewer.querySelector("[data-viewer-client]");
  const viewerKpis = viewer.querySelector("[data-viewer-kpis]");
  const closeButton = viewer.querySelector("[data-viewer-close]");
  const replayButton = viewer.querySelector("[data-viewer-replay]");
  const prevButton = viewer.querySelector("[data-viewer-prev]");
  const nextButton = viewer.querySelector("[data-viewer-next]");

  let segmentWidth = 1;
  let offset = 0;
  let lastTime = performance.now();
  let hoverCard = null;
  let hoverStart = 0;
  let dwellRaf = null;
  let activeIndex = 0;
  let activeSource = null;
  let viewerOpen = false;
  let viewerProgressRaf = null;
  let renderTimer = null;
  let lazyObserver = null;

  const cardMarkup = (item, index, hidden) => `
    <button class="reel-card" type="button" data-reel-card data-reel-index="${index}" ${hidden ? 'tabindex="-1" aria-hidden="true"' : ''}>
      <video muted loop playsinline preload="none" poster="${item.poster}" data-src="${item.video}"></video>
      <span class="reel-card__shade" aria-hidden="true"></span>
      <span class="reel-card__meta"><span>${item.client}</span><span>${item.category}</span></span>
      <span class="reel-card__progress" aria-hidden="true"><i></i></span>
    </button>`;

  const pauseCardVideo = (card) => {
    const video = card?.querySelector("video");
    if (video) video.pause();
  };

  const ensureVideoLoaded = (video) => {
    if (!video || video.src) return;
    const src = video.dataset.src;
    if (!src) return;
    video.src = src;
    video.load();
  };

  const setupLazyLoading = () => {
    lazyObserver?.disconnect();
    lazyObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        ensureVideoLoaded(entry.target);
        lazyObserver.unobserve(entry.target);
      });
    }, { root: null, rootMargin: "500px 250px", threshold: 0.01 });
    track.querySelectorAll("video[data-src]").forEach((video) => lazyObserver.observe(video));
  };

  const stopDwell = () => {
    if (dwellRaf) cancelAnimationFrame(dwellRaf);
    dwellRaf = null;
    if (hoverCard) {
      const fill = hoverCard.querySelector(".reel-card__progress i");
      if (fill) fill.style.transform = "scaleX(0)";
      hoverCard.classList.remove("is-hovered");
      pauseCardVideo(hoverCard);
    }
    hoverCard = null;
    section.classList.remove("has-hover");
  };

  const getVisibleCard = (index) => {
    const cards = [...track.querySelectorAll(`[data-reel-card][data-reel-index="${index}"]`)];
    return cards.find((card) => {
      const rect = card.getBoundingClientRect();
      return rect.right > 0 && rect.left < window.innerWidth;
    }) || cards.find((card) => card.getAttribute("aria-hidden") !== "true") || cards[0] || null;
  };

  const render = () => {
    stopDwell();
    const cardWidth = window.innerWidth <= 820
      ? Math.min(210, Math.max(150, window.innerWidth * 0.43))
      : Math.min(236, Math.max(150, window.innerWidth * 0.17));
    const repeats = Math.max(1, Math.ceil((window.innerWidth * 1.3) / ((cardWidth + 18) * reelsData.length)));
    const baseItems = Array.from({ length: repeats }, () => reelsData).flat();
    const segment = (hidden) => `<div class="reels__segment" data-reels-segment ${hidden ? 'aria-hidden="true"' : ''}>${baseItems.map((item, i) => cardMarkup(item, i % reelsData.length, hidden)).join("")}</div>`;
    track.innerHTML = reduced ? segment(false) : segment(false) + segment(true);
    offset = 0;
    track.style.transform = "translate3d(0,0,0)";
    requestAnimationFrame(() => {
      segmentWidth = track.querySelector("[data-reels-segment]")?.getBoundingClientRect().width || 1;
      bindCards();
      setupLazyLoading();
    });
  };

  const isPaused = () => viewerOpen || !!hoverCard || document.hidden;

  const animateTrack = (time) => {
    const dt = Math.min(0.05, Math.max(0, (time - lastTime) / 1000));
    lastTime = time;
    if (!reduced && !isPaused() && segmentWidth > 1) {
      offset = (offset + REEL_SPEED_PX * dt) % segmentWidth;
      track.style.transform = `translate3d(${-offset}px,0,0)`;
    }
    requestAnimationFrame(animateTrack);
  };

  const updateViewerProgress = () => {
    if (!viewerOpen) return;
    if (viewerVideo?.duration && viewerProgress) {
      viewerProgress.style.transform = `scaleX(${clamp(viewerVideo.currentTime / viewerVideo.duration)})`;
    }
    viewerProgressRaf = requestAnimationFrame(updateViewerProgress);
  };

  const renderKpis = (item, animate = true) => {
    if (!viewerKpis) return;
    const kpis = Array.isArray(item.kpis) ? item.kpis.slice(0, 3) : [];
    viewerKpis.innerHTML = kpis.map((kpi, i) => `<div class="reel-viewer__kpi"><strong data-kpi-value="${Number(kpi.value) || 0}" data-kpi-suffix="${kpi.suffix || ""}" data-kpi-index="${i}">0${kpi.suffix || ""}</strong><span>${kpi.label || ""}</span></div>`).join("");
    if (!kpis.length) return;

    viewerKpis.querySelectorAll("[data-kpi-value]").forEach((el, i) => {
      const target = Number(el.dataset.kpiValue) || 0;
      const suffix = el.dataset.kpiSuffix || "";
      gsap.killTweensOf(el);
      el.classList.remove("is-counting");
      if (reduced || !animate) {
        el.textContent = `${target}${suffix}`;
        return;
      }
      el.textContent = `0${suffix}`;
      el.classList.add("is-counting");
      const state = { value: 0 };
      gsap.to(state, {
        value: target,
        duration: 1.5,
        delay: i * 0.26,
        ease: "power3.out",
        onUpdate: () => { el.textContent = `${Math.round(state.value)}${suffix}`; },
        onComplete: () => {
          el.textContent = `${target}${suffix}`;
          window.setTimeout(() => el.classList.remove("is-counting"), 350);
        },
      });
    });
  };

  const loadViewerItem = async (index, { replay = false } = {}) => {
    activeIndex = (index + reelsData.length) % reelsData.length;
    const item = reelsData[activeIndex];
    viewerCategory.textContent = `Reel · ${item.category}`;
    viewerClient.textContent = item.client;
    renderKpis(item, true);
    viewerVideo.pause();
    viewerVideo.poster = item.poster;
    viewerVideo.src = item.video;
    viewerVideo.muted = true;
    viewerVideo.currentTime = 0;
    viewerProgress.style.transform = "scaleX(0)";
    try { await viewerVideo.play(); } catch (_) {}
  };

  const focusables = () => [...viewer.querySelectorAll("button:not([disabled]), a[href]")].filter((el) => el.offsetParent !== null);

  const openViewer = async (card, index) => {
    if (viewerOpen) return;
    stopDwell();
    viewerOpen = true;
    activeIndex = index;
    activeSource = card;
    const origin = card.getBoundingClientRect();
    viewer.classList.add("is-open");
    viewer.setAttribute("aria-hidden", "false");
    lenis?.stop?.();
    document.body.style.overflow = "hidden";

    await loadViewerItem(index);
    requestAnimationFrame(() => {
      const finalRect = shell.getBoundingClientRect();
      const dx = origin.left - finalRect.left;
      const dy = origin.top - finalRect.top;
      const sx = origin.width / Math.max(finalRect.width, 1);
      const sy = origin.height / Math.max(finalRect.height, 1);

      if (reduced) {
        gsap.set(backdrop, { opacity: 1 });
        gsap.set(shell, { transform: "none" });
        gsap.set([viewerMeta, viewerControls], { opacity: 1, y: 0 });
      } else {
        gsap.set(backdrop, { opacity: 0 });
        gsap.set(shell, { transformOrigin: "top left", x: dx, y: dy, scaleX: sx, scaleY: sy });
        gsap.set([viewerMeta, viewerControls], { opacity: 0, y: 14 });
        gsap.timeline()
          .to(backdrop, { opacity: 1, duration: .45, ease: "power2.out" }, 0)
          .to(shell, { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: .62, ease: "power3.inOut" }, 0)
          .to([viewerMeta, viewerControls], { opacity: 1, y: 0, duration: .5, ease: "power2.out" }, .35);
      }
      closeButton.focus({ preventScroll: true });
      if (viewerProgressRaf) cancelAnimationFrame(viewerProgressRaf);
      updateViewerProgress();
    });
  };

  const closeViewer = () => {
    if (!viewerOpen) return;
    const target = getVisibleCard(activeIndex) || activeSource;
    const targetRect = target?.getBoundingClientRect();
    const finalRect = shell.getBoundingClientRect();

    const finish = () => {
      viewerOpen = false;
      viewer.classList.remove("is-open");
      viewer.setAttribute("aria-hidden", "true");
      viewerVideo.pause();
      viewerVideo.removeAttribute("src");
      viewerVideo.load();
      if (viewerProgressRaf) cancelAnimationFrame(viewerProgressRaf);
      viewerProgressRaf = null;
      document.body.style.overflow = "";
      lenis?.start?.();
      target?.focus?.({ preventScroll: true });
    };

    if (reduced || !targetRect) {
      finish();
      return;
    }

    const dx = targetRect.left - finalRect.left;
    const dy = targetRect.top - finalRect.top;
    const sx = targetRect.width / Math.max(finalRect.width, 1);
    const sy = targetRect.height / Math.max(finalRect.height, 1);
    gsap.timeline({ onComplete: finish })
      .to([viewerMeta, viewerControls], { opacity: 0, y: 10, duration: .18 }, 0)
      .to(shell, { x: dx, y: dy, scaleX: sx, scaleY: sy, duration: .5, ease: "power3.inOut" }, 0)
      .to(backdrop, { opacity: 0, duration: .4, ease: "power2.in" }, .05);
  };

  const startDwell = (card) => {
    if (!finePointer.matches || reduced || viewerOpen) return;
    stopDwell();
    hoverCard = card;
    hoverStart = performance.now();
    section.classList.add("has-hover");
    card.classList.add("is-hovered");
    const video = card.querySelector("video");
    ensureVideoLoaded(video);
    video?.play?.().catch(() => {});
    const fill = card.querySelector(".reel-card__progress i");

    const tick = (now) => {
      if (hoverCard !== card || viewerOpen) return;
      const p = clamp((now - hoverStart) / REEL_DWELL_MS);
      if (fill) fill.style.transform = `scaleX(${p})`;
      if (p >= 1) {
        const index = Number(card.dataset.reelIndex) || 0;
        hoverCard = null;
        section.classList.remove("has-hover");
        card.classList.remove("is-hovered");
        openViewer(card, index);
        return;
      }
      dwellRaf = requestAnimationFrame(tick);
    };
    dwellRaf = requestAnimationFrame(tick);
  };

  function bindCards() {
    track.querySelectorAll("[data-reel-card]").forEach((card) => {
      const index = Number(card.dataset.reelIndex) || 0;
      card.addEventListener("pointerenter", () => startDwell(card));
      card.addEventListener("pointerleave", () => {
        if (hoverCard === card) stopDwell();
      });
      card.addEventListener("click", () => openViewer(card, index));
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openViewer(card, index);
        }
      });
    });
  }

  closeButton.addEventListener("click", closeViewer);
  replayButton.addEventListener("click", () => loadViewerItem(activeIndex, { replay: true }));
  prevButton.addEventListener("click", () => {
    activeSource = getVisibleCard(activeIndex - 1);
    loadViewerItem(activeIndex - 1);
  });
  nextButton.addEventListener("click", () => {
    activeSource = getVisibleCard(activeIndex + 1);
    loadViewerItem(activeIndex + 1);
  });

  document.addEventListener("keydown", (event) => {
    if (!viewerOpen) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeViewer();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      activeSource = getVisibleCard(activeIndex - 1);
      loadViewerItem(activeIndex - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      activeSource = getVisibleCard(activeIndex + 1);
      loadViewerItem(activeIndex + 1);
    } else if (event.key === "Tab") {
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  document.addEventListener("visibilitychange", () => {
    lastTime = performance.now();
  });

  window.addEventListener("resize", () => {
    clearTimeout(renderTimer);
    renderTimer = window.setTimeout(() => {
      if (!viewerOpen) render();
    }, 180);
  }, { passive: true });

  render();
  requestAnimationFrame(animateTrack);
}

function initMedals(lenis) {
  const section = document.querySelector("[data-medals]");
  const stage = document.querySelector("[data-medals-stage]");
  if (!section || !stage) return;

  const title = stage.querySelector("[data-medals-title]");
  const standard = stage.querySelector("[data-medals-standard]");
  const medals = SERVICES.map((service) => stage.querySelector(`[data-medal="${service.id}"]`));
  const spots = SERVICES.map((service) => stage.querySelector(`[data-spot="${service.id}"]`));
  const spotTitles = spots.map((spot) => spot?.querySelector("[data-spot-title]"));
  const cardsWrap = stage.querySelector("[data-medals-cards]");
  const cards = SERVICES.map((service) => stage.querySelector(`[data-card="${service.id}"]`));
  const slots = SERVICES.map((service) => stage.querySelector(`[data-card-slot="${service.id}"]`));
  const setSelectedCard = (targetId) => {
    cards.forEach((card, index) => {
      if (!card) return;
      const active = card.dataset.card === targetId;
      card.classList.toggle("is-selected", active);
      card.setAttribute("aria-pressed", String(active));
      card.tabIndex = 0;
      if (!card.hasAttribute("role")) card.setAttribute("role", "button");
      if (!card.hasAttribute("aria-label")) {
        const heading = card.querySelector("h3")?.textContent?.trim() || `Medal ${index + 1}`;
        card.setAttribute("aria-label", heading);
      }
    });
  };

  const indexWrap = stage.querySelector("[data-medals-index]");
  const indexValue = stage.querySelector("[data-medals-index-value]");
  const indexBar = stage.querySelector("[data-medals-index-bar]");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sweepState = [false, false, false];
  let geometry = null;
  let trigger = null;

  spotTitles.forEach(prepareYellowSweep);

  const poseLerp = (from, to, t) => ({
    x: lerp(from.x, to.x, t),
    y: lerp(from.y, to.y, t),
    s: lerp(from.s, to.s, t),
    o: lerp(from.o ?? 1, to.o ?? 1, t),
  });

  const measure = () => {
    const rect = stage.getBoundingClientRect();
    const W = Math.max(1, rect.width);
    const H = Math.max(1, rect.height);
    const mobile = W < 820;

    const peek = SERVICES.map((_, i) => {
      const s = mobile ? W * [0.34, 0.40, 0.48][i] : H * [0.34, 0.41, 0.50][i];
      const x = mobile ? W * [0.20, 0.50, 0.82][i] : W * [0.40, 0.545, 0.71][i];
      return { x, y: H + 0.04 * s, s, o: 1 };
    });
    const up = peek.map((pose) => ({ ...pose, y: H - 0.20 * pose.s }));
    const front = SERVICES.map(() => {
      const s = mobile ? Math.min(0.66 * W, 0.36 * H) : Math.min(0.66 * H, 0.40 * W);
      return { x: mobile ? 0.50 * W : 0.31 * W, y: mobile ? 0.32 * H : 0.53 * H, s, o: 1 };
    });
    const wait = SERVICES.map((_, i) => {
      const s = mobile ? 0.13 * W : 0.115 * H;
      const x = mobile
        ? W - 18 - (2 - i) * 1.22 * s
        : W - 60 - (2 - i) * 1.32 * s;
      const y = mobile ? 90 + s / 2 : H - 34 - s / 2;
      return { x, y, s, o: 0.56 };
    });
    const slotPoses = slots.map((slot) => {
      const sr = slot.getBoundingClientRect();
      const rr = stage.getBoundingClientRect();
      return {
        x: sr.left - rr.left + sr.width / 2,
        y: sr.top - rr.top + sr.height / 2,
        s: Math.max(1, sr.width),
        o: 1,
      };
    });
    geometry = { W, H, mobile, peek, up, front, wait, slotPoses };
  };

  const stateAt = (p) => {
    const g = geometry;
    if (p < 0.14) {
      const t = ramp(p, 0.04, 0.14);
      return SERVICES.map((_, i) => poseLerp(g.peek[i], g.up[i], easeInOutCubic(clamp((t - i * 0.22) / 0.56))));
    }
    if (p < 0.20) return g.up;
    if (p < 0.28) {
      const t = easeInOutCubic(ramp(p, 0.20, 0.28));
      return SERVICES.map((_, i) => poseLerp(g.up[i], i === 0 ? g.front[i] : g.wait[i], t));
    }
    if (p < 0.38) return [g.front[0], g.wait[1], g.wait[2]];
    if (p < 0.46) {
      const t = easeInOutCubic(ramp(p, 0.38, 0.46));
      return [poseLerp(g.front[0], g.wait[0], t), poseLerp(g.wait[1], g.front[1], t), g.wait[2]];
    }
    if (p < 0.56) return [g.wait[0], g.front[1], g.wait[2]];
    if (p < 0.64) {
      const t = easeInOutCubic(ramp(p, 0.56, 0.64));
      return [g.wait[0], poseLerp(g.front[1], g.wait[1], t), poseLerp(g.wait[2], g.front[2], t)];
    }
    if (p < 0.74) return [g.wait[0], g.wait[1], g.front[2]];
    if (p < 0.86) {
      const t = easeInOutCubic(ramp(p, 0.74, 0.86));
      return SERVICES.map((_, i) => poseLerp(i === 2 ? g.front[i] : g.wait[i], g.slotPoses[i], t));
    }
    return g.slotPoses;
  };

  const applyPose = (medal, pose, i) => {
    if (!medal || !pose) return;
    medal.style.zIndex = String(8 + i);
    gsap.set(medal, {
      x: pose.x - 50,
      y: pose.y - 50,
      scale: pose.s / 100,
      opacity: pose.o,
      force3D: true,
    });
  };

  const spotOpacity = (p, a, b) => ramp(p, a - 0.035, a) * (1 - ramp(p, b, b + 0.035));

  const update = (p) => {
    if (!geometry) measure();
    stateAt(p).forEach((pose, i) => applyPose(medals[i], pose, i));

    gsap.set(title, { opacity: 1 - ramp(p, 0.19, 0.24), y: -18 * ramp(p, 0.19, 0.24) });
    standard?.style.setProperty("--standard-fill", String(ramp(p, 0.02, 0.14)));

    const pauses = [[0.28, 0.38], [0.46, 0.56], [0.64, 0.74]];
    spots.forEach((spot, i) => {
      const opacity = spotOpacity(p, pauses[i][0], pauses[i][1]);
      gsap.set(spot, { opacity, y: 14 * (1 - opacity) });
      if (opacity > 0.5 && !sweepState[i]) {
        sweepState[i] = true;
        playYellowSweep(spotTitles[i]);
      }
      if (opacity < 0.1 && sweepState[i]) {
        sweepState[i] = false;
        resetYellowSweep(spotTitles[i]);
      }
    });

    const indexOpacity = ramp(p, 0.22, 0.24) * (1 - ramp(p, 0.78, 0.80));
    gsap.set(indexWrap, { opacity: indexOpacity });
    if (indexValue) {
      indexValue.textContent = p < 0.38 ? "01" : p < 0.56 ? "02" : "03";
    }
    gsap.set(indexBar, { scaleX: ramp(p, 0.26, 0.74) });

    const cardsBase = ramp(p, 0.77, 0.80);
    gsap.set(cardsWrap, { opacity: cardsBase });
    cards.forEach((card, i) => {
      const opacity = ramp(p, 0.79 + 0.02 * i, 0.86 + 0.02 * i);
      gsap.set(card, { opacity, y: 24 * (1 - opacity) });
    });
    cardsWrap.style.pointerEvents = p >= 0.86 ? "auto" : "none";

    medals.forEach((medal) => {
      const decorative = p > 0.78;
      medal.style.pointerEvents = decorative ? "none" : "auto";
      medal.tabIndex = decorative ? -1 : 0;
    });
  };

  const jumpTo = (targetP) => {
    const rect = section.getBoundingClientRect();
    const top = window.scrollY + rect.top;
    const travel = Math.max(0, section.offsetHeight - window.innerHeight);
    const destination = top + travel * targetP;
    if (lenis?.scrollTo) lenis.scrollTo(destination, { duration: 1.05 });
    else window.scrollTo({ top: destination, behavior: "smooth" });
  };

  medals.forEach((medal, i) => medal?.addEventListener("click", () => jumpTo([0.32, 0.50, 0.68][i])));

  cards.forEach((card) => {
    if (!card) return;
    card.addEventListener("click", () => setSelectedCard(card.dataset.card || "gold"));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setSelectedCard(card.dataset.card || "gold");
      }
    });
  });
  setSelectedCard("gold");

  const placeReduced = () => {
    measure();
    standard?.style.setProperty("--standard-fill", "1");
    gsap.set(title, { opacity: 1, y: 0 });
    gsap.set(cardsWrap, { opacity: 1 });
    cards.forEach((card) => gsap.set(card, { opacity: 1, y: 0 }));
    geometry.slotPoses.forEach((pose, i) => applyPose(medals[i], pose, i));
    medals.forEach((medal) => {
      medal.style.pointerEvents = "none";
      medal.tabIndex = -1;
    });
  };

  if (reduced) {
    requestAnimationFrame(placeReduced);
    window.addEventListener("resize", () => requestAnimationFrame(placeReduced), { passive: true });
    return;
  }

  measure();
  update(0);
  trigger = ScrollTrigger.create({
    trigger: section,
    start: "top top",
    end: "bottom bottom",
    scrub: 0.42,
    invalidateOnRefresh: true,
    onRefresh: (self) => {
      measure();
      update(self.progress);
    },
    onUpdate: (self) => update(self.progress),
  });

  window.addEventListener("resize", () => {
    measure();
    update(trigger?.progress || 0);
  }, { passive: true });
}

function initApostropheThread() {
  const section = document.querySelector("[data-apostrophe-thread]");
  if (!section) return;
  const mark = section.querySelector("[data-apostrophe-mark]");
  const line = section.querySelector("[data-apostrophe-line]");
  const notes = [...section.querySelectorAll("[data-thread-note]")];
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  const update = () => {
    const rect = section.getBoundingClientRect();
    const t = clamp((0.72 * window.innerHeight - rect.top) / Math.max(section.offsetHeight, 1));
    const y = t * (section.offsetHeight - 40);
    mark.style.transform = `translate(-50%, ${y}px)`;
    line.style.transform = `translateX(-50%) scaleY(${t})`;
    const opacity = ramp(t, 0.25, 0.45) * (1 - ramp(t, 0.80, 0.95));
    notes.forEach((note) => { note.style.opacity = String(opacity); });
  };

  ScrollTrigger.create({
    trigger: section,
    start: "top bottom",
    end: "bottom top",
    onUpdate: update,
    onEnter: update,
    onEnterBack: update,
  });
  update();
}

function initAvailability() {
  const section = document.querySelector("[data-services-availability]");
  if (!section) return;
  const monthEl = section.querySelector("[data-service-month]");
  const occupiedEl = section.querySelector("[data-occupied-slots]");
  const openEl = section.querySelector("[data-open-slots]");
  const totalEl = section.querySelector("[data-total-slots]");
  const title = section.querySelector("[data-availability-title]");

  const total = Math.max(1, Number(site.availability?.total || 6));
  const occupied = Math.max(0, Math.min(total, Number(site.availability?.occupied ?? 4)));
  const open = Math.max(0, total - occupied);
  const month = new Intl.DateTimeFormat("en", { month: "long" }).format(new Date());

  if (monthEl) monthEl.textContent = `${month} availability`;
  if (occupiedEl) occupiedEl.textContent = String(occupied);
  if (openEl) openEl.textContent = String(open);
  if (totalEl) totalEl.textContent = String(total);

  prepareYellowSweep(title);
  ScrollTrigger.create({
    trigger: title,
    start: "top 78%",
    end: "bottom 10%",
    onEnter: () => playYellowSweep(title, 1.5),
    onEnterBack: () => playYellowSweep(title, 1.5),
    onLeaveBack: () => resetYellowSweep(title),
    onLeave: () => resetYellowSweep(title),
  });
}

export function initFilmServices(lenis) {
  initFilmHero();
  initYellowSweeps();
  initReels(lenis);
  initMedals(lenis);
  initAvailability();
  requestAnimationFrame(() => ScrollTrigger.refresh());
}
