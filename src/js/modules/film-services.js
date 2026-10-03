import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import site from "../../data/site.json";

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  {
    id: "bronze",
    index: "01",
    image: "/assets/img/film/medals/bronze-medal.png",
    alt: "Bronze Medal",
    label: "Bronze Medal · The Shoot",
    title: "The shoot.",
    lead: "For brands with the idea already defined. Medal turns it into a directed production where every frame answers the same brief.",
    list: ["Creative direction", "Photography", "Film", "Shot list", "Production", "Final selects"],
    cta: "Start with Bronze",
    name: "Bronze Medal",
  },
  {
    id: "silver",
    index: "02",
    image: "/assets/img/film/medals/silver-medal.png",
    alt: "Silver Medal",
    label: "Silver Medal · The Brand",
    title: "The brand.",
    lead: "For businesses whose value has outgrown the way they show up. Medal builds one visual direction that can keep working across channels.",
    list: ["Brand direction", "Visual system", "Photography", "Film", "Content framework", "Launch-ready assets"],
    cta: "Start with Silver",
    name: "Silver Medal",
  },
  {
    id: "gold",
    index: "03",
    image: "/assets/img/film/medals/gold-medal.png",
    alt: "Gold Medal",
    label: "Gold Medal · The Launch",
    title: "The launch.",
    lead: "For an opening, relaunch or campaign that needs one clear idea carried from first frame to the final rollout.",
    list: ["Launch concept", "Campaign direction", "Hero film", "Photography", "Rollout system", "Launch execution"],
    cta: "Start with Gold",
    name: "Gold Medal",
  },
];


function setFilmHeaderMode(mode = null) {
  const body = document.body;
  if (!body) return;
  body.classList.toggle("film-header-dark", mode === "dark");
  body.classList.toggle("film-header-light", mode === "light");
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
        height: () => mobile.matches ? "72vh" : "72vh",
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
      sound.setAttribute("aria-pressed", String(!video.muted));
      if (soundLabel) soundLabel.textContent = video.muted ? "Sound off" : "Sound on";
      if (!video.muted) {
        try { await video.play(); } catch (_) {}
      }
    });
  }
}

function initReels() {
  const row = document.querySelector("[data-reels-row]");
  if (!row) return;

  const cards = [...row.querySelectorAll("[data-reel-card]")];
  if (!cards.length) return;
  const mobile = window.matchMedia("(max-width: 760px)").matches;

  let active = null;
  let progressRaf = null;

  const stopProgress = () => {
    if (progressRaf) cancelAnimationFrame(progressRaf);
    progressRaf = null;
  };

  const updateProgress = () => {
    if (!active) return;
    const video = active.querySelector("video");
    const bar = active.querySelector(".reel-card__progress i");
    if (video && bar && video.duration) {
      bar.style.transform = `scaleX(${Math.min(1, video.currentTime / video.duration)})`;
    }
    progressRaf = requestAnimationFrame(updateProgress);
  };

  const activate = async (card) => {
    if (!card || active === card) return;
    stopProgress();

    cards.forEach((item) => {
      const video = item.querySelector("video");
      item.classList.toggle("is-active", item === card);
      if (item !== card && video) video.pause();
    });

    active = card;
    const video = card.querySelector("video");
    if (video) {
      try { await video.play(); } catch (_) {}
    }
    updateProgress();
  };

  if (!mobile) {
    cards.forEach((card) => {
      card.addEventListener("pointerenter", () => activate(card));
      card.addEventListener("focusin", () => activate(card));
    });
    activate(cards[1] || cards[0]);
  } else {
    const observer = new IntersectionObserver((entries) => {
      const best = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (best?.target) activate(best.target);
    }, { root: row, threshold: [0.45, 0.6, 0.75, 0.9] });

    cards.forEach((card) => observer.observe(card));
  }
}

function prepareYellowSweep(target) {
  if (!target || target.dataset.sweepPrepared === "true") return target;

  const content = target.innerHTML;
  target.innerHTML = `
    <span class="yellow-sweep__base">${content}</span>
    <span class="yellow-sweep__flash" aria-hidden="true">${content}</span>
  `;
  target.dataset.sweepPrepared = "true";
  return target;
}

function setYellowSweepContent(target, content, { html = false } = {}) {
  if (!target) return;
  prepareYellowSweep(target);
  const base = target.querySelector(".yellow-sweep__base");
  const flash = target.querySelector(".yellow-sweep__flash");
  if (!base || !flash) return;

  if (html) {
    base.innerHTML = content;
    flash.innerHTML = content;
  } else {
    base.textContent = content;
    flash.textContent = content;
  }
}

function resetYellowSweep(target) {
  if (!target) return;
  prepareYellowSweep(target);
  const flash = target.querySelector(".yellow-sweep__flash");
  if (!flash) return;
  gsap.killTweensOf(flash);
  gsap.set(flash, { clipPath: "inset(0 100% 0 0)" });
}

function playYellowSweep(target) {
  if (!target) return;
  prepareYellowSweep(target);
  const flash = target.querySelector(".yellow-sweep__flash");
  if (!flash) return;

  gsap.killTweensOf(flash);
  gsap.set(flash, { clipPath: "inset(0 100% 0 0)" });

  gsap.timeline()
    .to(flash, {
      clipPath: "inset(0 0% 0 0)",
      duration: 0.58,
      ease: "power2.inOut",
    })
    .to(flash, {
      clipPath: "inset(0 0 0 100%)",
      duration: 0.58,
      ease: "power2.inOut",
    })
    .set(flash, { clipPath: "inset(0 100% 0 0)" });
}

function initYellowSweeps() {
  const targets = [...document.querySelectorAll("[data-yellow-sweep]")];
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

function initMedalIntro(lenis) {
  const section = document.querySelector("[data-services-intro]");
  if (!section) return;

  const choices = [...section.querySelectorAll("[data-medal-target]")];
  const objects = choices.map((choice) => choice.querySelector("[data-medal-object]"));
  const journey = document.querySelector("[data-medal-journey]");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const enterMedals = () => {
    if (reduced) return;
    gsap.killTweensOf(objects);
    gsap.fromTo(objects,
      { y: 280, opacity: 0, scale: 0.84, rotateX: 16 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        rotateX: 0,
        duration: 1.15,
        stagger: 0.12,
        ease: "power3.out",
        clearProps: "rotateX",
      }
    );
  };

  if (!reduced) {
    ScrollTrigger.create({
      trigger: section,
      start: "top 62%",
      end: "bottom 20%",
      onEnter: enterMedals,
      onEnterBack: enterMedals,
    });
  }

  choices.forEach((choice) => {
    choice.addEventListener("click", () => {
      const id = choice.dataset.medalTarget;
      const index = SERVICES.findIndex((service) => service.id === id);
      if (index < 0 || !journey) return;

      choices.forEach((item) => item.classList.toggle("is-selected", item === choice));
      const object = choice.querySelector("[data-medal-object]");
      if (!reduced && object) {
        gsap.fromTo(object, { rotateY: 0 }, { rotateY: 360, duration: 1.25, ease: "power2.inOut" });
      }

      const rect = journey.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const travel = Math.max(0, journey.offsetHeight - window.innerHeight);
      const positions = [0.08, 0.49, 0.84];
      const destination = sectionTop + travel * positions[index];

      window.setTimeout(() => {
        if (lenis?.scrollTo) {
          lenis.scrollTo(destination, { duration: 1.15 });
        } else {
          window.scrollTo({ top: destination, behavior: "smooth" });
        }
      }, reduced ? 0 : 260);
    });
  });
}

function initMedalJourney() {
  const section = document.querySelector("[data-medal-journey]");
  if (!section) return;

  const pin = section.querySelector("[data-medal-pin]");
  const medalImage = section.querySelector("[data-service-medal-image]");
  const index = section.querySelector("[data-service-index]");
  const label = section.querySelector("[data-service-label]");
  const title = section.querySelector("[data-service-title]");
  const lead = section.querySelector("[data-service-lead]");
  const list = section.querySelector("[data-service-list]");
  const progress = section.querySelector("[data-service-progress]");
  const flare = section.querySelector("[data-journey-flare]");
  const bone = section.querySelector("[data-journey-bone]");
  const direction = section.querySelector("[data-journey-direction]");
  const directionTitle = section.querySelector("[data-direction-title]");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let activeIndex = 0;
  let directionSweepPlayed = false;

  const serviceEls = [medalImage, index, label, title, lead, list, progress].filter(Boolean);

  const applyService = (nextIndex, immediate = false) => {
    if (nextIndex === activeIndex && !immediate) return;
    const service = SERVICES[nextIndex];
    activeIndex = nextIndex;

    const update = () => {
      medalImage.src = service.image;
      medalImage.alt = service.alt;
      index.textContent = service.index;
      label.textContent = service.label;
      setYellowSweepContent(title, service.title);
      lead.textContent = service.lead;
      list.innerHTML = service.list.map((item) => `<li>${item}</li>`).join("");
      requestAnimationFrame(() => playYellowSweep(title));
    };

    if (immediate || reduced) {
      update();
      return;
    }

    gsap.timeline()
      .to([medalImage, label, title, lead, list], {
        opacity: 0,
        y: (i) => i === 0 ? 20 : 14,
        duration: 0.22,
        ease: "power1.in",
      })
      .add(update)
      .set(medalImage, { rotateY: -18, scale: 0.92 })
      .to([medalImage, label, title, lead, list], {
        opacity: 1,
        y: 0,
        duration: 0.42,
        ease: "power2.out",
      })
      .to(medalImage, { rotateY: 0, scale: 1, duration: 0.78, ease: "power3.out" }, "<");
  };

  applyService(0, true);
  prepareYellowSweep(directionTitle);

  if (reduced) {
    if (direction) {
      direction.style.visibility = "visible";
      direction.style.opacity = "1";
    }
    return;
  }

  gsap.set(flare, { scale: 0.25, opacity: 0 });
  gsap.set(bone, { clipPath: "circle(0% at 31% 50%)" });
  gsap.set(direction, { autoAlpha: 0, y: 26 });

  const exposure = gsap.timeline({ paused: true, defaults: { ease: "none" } });
  exposure
    .to([index, label, title, lead, list, progress], {
      opacity: 0,
      y: -16,
      duration: 0.16,
    }, 0)
    .to(medalImage, {
      scale: 1.20,
      duration: 0.18,
      ease: "power2.inOut",
    }, 0.02)
    .to(medalImage, {
      scale: 5.2,
      x: () => window.innerWidth * 0.19,
      filter: "brightness(2.45) saturate(.68) drop-shadow(0 0 0 rgba(0,0,0,0))",
      duration: 0.58,
      ease: "power2.in",
    }, 0.18)
    .to(flare, {
      opacity: 1,
      scale: 4.8,
      duration: 0.34,
    }, 0.40)
    .to(bone, {
      clipPath: "circle(155% at 31% 50%)",
      duration: 0.36,
    }, 0.50)
    .to(medalImage, { opacity: 0, duration: 0.12 }, 0.72)
    .to(flare, { opacity: 0, duration: 0.18 }, 0.77)
    .set(direction, { visibility: "visible" }, 0.85)
    .to(direction, {
      autoAlpha: 1,
      y: 0,
      duration: 0.13,
      ease: "power2.out",
    }, 0.86);

  ScrollTrigger.create({
    trigger: section,
    start: "top top",
    end: "bottom bottom",
    scrub: 0.52,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      const p = self.progress;
      gsap.set(progress, { scaleY: Math.min(1, p / 0.66) });

      if (p < 0.22) applyService(0);
      else if (p < 0.44) applyService(1);
      else applyService(2);

      const exposureProgress = gsap.utils.clamp(0, 1, (p - 0.64) / 0.22);
      exposure.progress(exposureProgress);

      const isBone = exposureProgress >= 0.72;
      setFilmHeaderMode(isBone ? "light" : "dark");

      if (exposureProgress >= 0.89 && !directionSweepPlayed) {
        directionSweepPlayed = true;
        playYellowSweep(directionTitle);
      }
      if (exposureProgress < 0.60) {
        directionSweepPlayed = false;
        resetYellowSweep(directionTitle);
      }
    },
    onLeave: () => setFilmHeaderMode("light"),
    onLeaveBack: () => setFilmHeaderMode("dark"),
  });
}

function initMedalCut() {
  const section = document.querySelector("[data-plan-select]");
  if (!section || !section.classList.contains("plan-select--cut")) return;

  const left = section.querySelector("[data-cut-left]");
  const right = section.querySelector("[data-cut-right]");
  const mark = section.querySelector("[data-cut-mark]");
  const notes = [section.querySelector("[data-cut-note-left]"), section.querySelector("[data-cut-note-right]")].filter(Boolean);
  const heading = section.querySelector(".plan-select__heading");
  const title = section.querySelector("[data-plan-yellow-title]");
  const cards = [...section.querySelectorAll("[data-plan-card]")];
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const desktop = window.matchMedia("(min-width: 981px)").matches;

  if (reduced || !desktop) {
    setFilmHeaderMode("dark");
    if (title) playYellowSweep(title);
    return;
  }

  gsap.set([left, right], { xPercent: 0 });
  gsap.set(mark, { scale: 0.9, opacity: 1 });
  gsap.set(notes, { opacity: 1, y: 0 });
  gsap.set(heading, { opacity: 0, y: 64 });
  gsap.set(cards, { opacity: 0, y: 220, rotateX: 8, scale: 0.94 });

  let sweepPlayedForward = false;
  let sweepPlayedBack = false;

  const timeline = gsap.timeline({ paused: true, defaults: { ease: "none" } });
  timeline
    .to(mark, { scale: 1.65, duration: 0.16 }, 0.03)
    .to(notes, { opacity: 0, y: -14, duration: 0.16, ease: "power1.in" }, 0.06)
    .to(left, { xPercent: -116, duration: 0.42 }, 0.10)
    .to(right, { xPercent: 116, duration: 0.42 }, 0.10)
    .to(mark, { opacity: 0, scale: 2.4, duration: 0.20 }, 0.20)
    .to(heading, { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" }, 0.28)
    .to(cards, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      duration: 0.34,
      stagger: 0.035,
      ease: "power3.out",
    }, 0.48);

  ScrollTrigger.create({
    trigger: section,
    start: "top top",
    end: "bottom bottom",
    scrub: 0.55,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      const p = self.progress;
      timeline.progress(p);
      setFilmHeaderMode(p < 0.31 ? "light" : "dark");

      if (p >= 0.34 && !sweepPlayedForward) {
        sweepPlayedForward = true;
        sweepPlayedBack = false;
        playYellowSweep(title);
      }
      if (p < 0.23) {
        sweepPlayedForward = false;
      }
      if (self.direction < 0 && p <= 0.70 && p >= 0.28 && !sweepPlayedBack) {
        sweepPlayedBack = true;
        playYellowSweep(title);
      }
      if (self.direction > 0 && p > 0.72) {
        sweepPlayedBack = false;
      }
    },
    onEnter: () => setFilmHeaderMode("light"),
    onLeave: () => setFilmHeaderMode("dark"),
    onEnterBack: () => setFilmHeaderMode("dark"),
    onLeaveBack: () => setFilmHeaderMode("light"),
  });
}

function initPlanSelector() {
  const section = document.querySelector("[data-plan-select]");
  if (!section) return;

  const cards = [...section.querySelectorAll("[data-plan-card]")];
  const selectedPlan = section.querySelector("[data-selected-plan]");
  const cta = section.querySelector("[data-plan-cta]");
  const ctaLabel = cta?.querySelector(".button__label");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const decision = section.querySelector("[data-plan-decision]");

  const selectPlan = (id, animate = true) => {
    const service = SERVICES.find((item) => item.id === id);
    if (!service) return;
    cards.forEach((card) => {
      const isActive = card.dataset.planCard === id;
      card.classList.toggle("is-selected", isActive);
      card.classList.toggle("is-muted", !isActive);
      const button = card.querySelector("[data-plan-select-button]");
      const label = button?.querySelector("span");
      if (label) label.textContent = isActive ? `${service.name.replace(" Medal", "")} selected` : `Select ${card.dataset.planCard[0].toUpperCase()}${card.dataset.planCard.slice(1)}`;
    });

    if (selectedPlan) selectedPlan.textContent = service.name;
    decision?.classList.add("is-visible");
    if (ctaLabel) {
      ctaLabel.textContent = service.cta;
      ctaLabel.dataset.label = service.cta;
    }

    const activeCard = cards.find((card) => card.dataset.planCard === id);
    const medal = activeCard?.querySelector(".plan-card__medal img");
    if (animate && !reduced && medal) {
      gsap.killTweensOf(medal);
      gsap.fromTo(medal,
        { rotateY: 0, rotateX: 0, scale: 1 },
        {
          rotateY: 360,
          rotateX: -5,
          scale: 1.035,
          duration: 1.45,
          ease: "power2.inOut",
          onComplete: () => gsap.to(medal, { rotateX: 0, scale: 1, duration: 0.28, ease: "power2.out" }),
        }
      );
    }
  };

  cards.forEach((card) => {
    const id = card.dataset.planCard;
    card.querySelectorAll("[data-plan-medal], [data-plan-select-button]").forEach((control) => {
      control.addEventListener("click", () => selectPlan(id, true));
    });
  });

  // No pre-selected state visually: the user makes the choice.
  cards.forEach((card) => card.classList.remove("is-selected", "is-muted"));
  decision?.classList.remove("is-visible");
}

function initAvailability() {
  const section = document.querySelector("[data-services-availability]");
  if (!section) return;

  const monthEl = section.querySelector("[data-service-month]");
  const occupiedEl = section.querySelector("[data-occupied-slots]");
  const openEl = section.querySelector("[data-open-slots]");
  const totalEl = section.querySelector("[data-total-slots]");

  const total = Math.max(1, Number(site.availability?.total || 6));
  const occupied = Math.max(0, Math.min(total, Number(site.availability?.occupied ?? 4)));
  const open = Math.max(0, total - occupied);
  const month = new Intl.DateTimeFormat("en", { month: "long" }).format(new Date());

  if (monthEl) monthEl.textContent = `${month} availability`;
  if (occupiedEl) occupiedEl.textContent = String(occupied);
  if (openEl) openEl.textContent = String(open);
  if (totalEl) totalEl.textContent = String(total);
}

export function initFilmServices(lenis) {
  initFilmHero();
  initReels();
  initYellowSweeps();
  initMedalIntro(lenis);
  initMedalJourney();
  initMedalCut();
  initPlanSelector();
  initAvailability();
}
