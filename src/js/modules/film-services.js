import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import site from "../../data/site.json";

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  {
    id: "bronze",
    index: "01",
    className: "service-medal--bronze",
    letter: "B",
    label: "Bronze Medal · The shoot",
    title: "The shoot.",
    lead: "For brands that already know what they need to say and need the visual execution to match.",
    list: ["Creative direction", "Shot list", "Production day", "Photo + video selects"],
  },
  {
    id: "silver",
    index: "02",
    className: "service-medal--silver",
    letter: "S",
    label: "Silver Medal · The brand",
    title: "The brand.",
    lead: "For businesses whose value has outgrown how they look and need one visual system across every channel.",
    list: ["Brand direction", "Visual system", "Photo + film", "Content framework"],
  },
  {
    id: "gold",
    index: "03",
    className: "service-medal--gold",
    letter: "G",
    label: "Gold Medal · The launch",
    title: "The launch.",
    lead: "For an opening, relaunch or campaign that needs one clear idea from first frame to final rollout.",
    list: ["Launch concept", "Campaign direction", "Hero film", "Rollout system"],
  },
];

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

function initStandardFill() {
  const target = document.querySelector("[data-standard-fill]");
  if (!target) return;

  gsap.to(target, {
    backgroundPosition: "0% 0%",
    ease: "none",
    scrollTrigger: {
      trigger: target,
      start: "top 78%",
      end: "bottom 46%",
      scrub: 0.5,
    },
  });
}

function initMedalJourney(lenis) {
  const section = document.querySelector("[data-medal-journey]");
  if (!section) return;

  const pin = section.querySelector("[data-medal-pin]");
  const medal = section.querySelector("[data-service-medal]");
  const letter = section.querySelector(".service-medal__letter");
  const index = section.querySelector("[data-service-index]");
  const label = section.querySelector("[data-service-label]");
  const title = section.querySelector("[data-service-title]");
  const lead = section.querySelector("[data-service-lead]");
  const list = section.querySelector("[data-service-list]");
  const progress = section.querySelector("[data-service-progress]");
  const header = document.querySelector("[data-header]");
  const choices = [...document.querySelectorAll("[data-medal-target]")];

  let activeIndex = 0;

  const applyService = (nextIndex, immediate = false) => {
    if (nextIndex === activeIndex && !immediate) return;
    const service = SERVICES[nextIndex];
    const oldClass = SERVICES[activeIndex]?.className;
    activeIndex = nextIndex;

    const update = () => {
      if (oldClass) medal.classList.remove(oldClass);
      medal.classList.remove("service-medal--bronze", "service-medal--silver", "service-medal--gold");
      medal.classList.add(service.className);
      letter.textContent = service.letter;
      index.textContent = service.index;
      label.textContent = service.label;
      title.textContent = service.title;
      lead.textContent = service.lead;
      list.innerHTML = service.list.map((item) => `<li>${item}</li>`).join("");
    };

    if (immediate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      update();
      return;
    }

    gsap.timeline()
      .to([medal, label, title, lead, list], {
        opacity: 0,
        y: (i) => i === 0 ? 0 : 12,
        duration: 0.22,
        ease: "power1.in",
      })
      .add(update)
      .set(medal, { rotateY: -16, scale: 0.93 })
      .to([medal, label, title, lead, list], {
        opacity: 1,
        y: 0,
        duration: 0.42,
        ease: "power2.out",
      })
      .to(medal, { rotateY: 0, scale: 1, duration: 0.55, ease: "power3.out" }, "<");
  };

  applyService(0, true);

  const trigger = ScrollTrigger.create({
    trigger: section,
    start: "top top",
    end: "bottom bottom",
    onUpdate: (self) => {
      const p = self.progress;
      gsap.set(progress, { scaleY: p });

      const next = p < 0.335 ? 0 : p < 0.67 ? 1 : 2;
      applyService(next);

      const light = p > 0.82;
      pin.classList.toggle("is-gold-light", light);
      header?.classList.toggle("header--light", light);
    },
    onLeave: () => header?.classList.add("header--light"),
    onEnterBack: (self) => {
      header?.classList.toggle("header--light", self.progress > 0.82);
    },
    onLeaveBack: () => header?.classList.remove("header--light"),
  });

  choices.forEach((choice) => {
    choice.addEventListener("click", () => {
      const id = choice.dataset.medalTarget;
      const serviceIndex = SERVICES.findIndex((service) => service.id === id);
      if (serviceIndex < 0) return;

      const rect = section.getBoundingClientRect();
      const currentY = window.scrollY;
      const sectionTop = currentY + rect.top;
      const travel = Math.max(0, section.offsetHeight - window.innerHeight);
      const targets = [0.08, 0.48, 0.82];
      const destination = sectionTop + travel * targets[serviceIndex];

      if (lenis?.scrollTo) {
        lenis.scrollTo(destination, { duration: 1.2 });
      } else {
        window.scrollTo({ top: destination, behavior: "smooth" });
      }
    });
  });

  window.addEventListener("resize", () => trigger.refresh?.());
}

function initAvailability() {
  const section = document.querySelector("[data-services-availability]");
  if (!section) return;

  const monthEl = section.querySelector("[data-service-month]");
  const openEl = section.querySelector("[data-open-slots]");
  const totalEl = section.querySelector("[data-total-slots]");

  const total = Math.max(1, Number(site.availability?.total || 6));
  const occupied = Math.max(0, Math.min(total, Number(site.availability?.occupied || 0)));
  const open = Math.max(0, total - occupied);
  const month = new Intl.DateTimeFormat("en", { month: "long" }).format(new Date());

  if (monthEl) monthEl.textContent = `${month} availability`;
  if (openEl) openEl.textContent = String(open);
  if (totalEl) totalEl.textContent = String(total);
}

export function initFilmServices(lenis) {
  initFilmHero();
  initReels();
  initStandardFill();
  initMedalJourney(lenis);
  initAvailability();
}
