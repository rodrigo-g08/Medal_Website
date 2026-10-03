import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const schedulerData = {
  monthLabel: "November 2026",
  year: 2026,
  monthIndex: 10,
  availableDays: [3, 4, 5, 6, 10, 12, 13, 17, 18, 24, 26],
  timesByDay: {
    3: ["09:30", "10:30", "12:00", "16:00"],
    4: ["09:00", "10:30", "15:00"],
    5: ["09:30", "10:00", "11:30", "15:00", "16:30"],
    6: ["10:00", "12:30", "16:00"],
    10: ["09:30", "11:00", "16:00"],
    12: ["09:00", "10:30", "13:30", "17:00"],
    13: ["09:30", "11:30", "15:30"],
    17: ["10:00", "11:00", "16:00"],
    18: ["09:30", "12:00", "16:30"],
    24: ["09:00", "10:00", "11:30", "15:00"],
    26: ["09:30", "10:30", "14:30", "16:00"],
  },
};

function prepareSweep(target) {
  if (!target || target.dataset.sweepPrepared === "true") return;
  const html = target.innerHTML;
  target.innerHTML = `<span class="text-sweep__base">${html}</span><span class="text-sweep__flash" aria-hidden="true">${html}</span>`;
  target.dataset.sweepPrepared = "true";
}

function playSweep(target) {
  if (!target || reducedMotion()) return;
  prepareSweep(target);
  const flash = target.querySelector(".text-sweep__flash");
  if (!flash) return;
  gsap.killTweensOf(flash);
  gsap.set(flash, { clipPath: "inset(0 100% 0 0)" });
  gsap.timeline()
    .to(flash, { clipPath: "inset(0 0% 0 0)", duration: .55, ease: "power2.inOut" })
    .to(flash, { clipPath: "inset(0 0 0 100%)", duration: .55, ease: "power2.inOut" })
    .set(flash, { clipPath: "inset(0 100% 0 0)" });
}

function initScrollLinks(lenis) {
  document.querySelectorAll("[data-scroll-target]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const target = document.getElementById(link.dataset.scrollTarget);
      if (!target) return;
      const top = window.scrollY + target.getBoundingClientRect().top;
      if (lenis?.scrollTo) lenis.scrollTo(top, { duration: 1.08 });
      else window.scrollTo({ top, behavior: "smooth" });
    });
  });
}

function initHero() {
  const section = document.querySelector("[data-contact-hero]");
  if (!section) return;
  const copy = section.querySelector("[data-contact-hero-copy]");
  const sweep = section.querySelector("[data-sweep]");
  prepareSweep(sweep);

  if (!reducedMotion()) {
    gsap.fromTo(copy, { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 1.02, ease: "power3.out", delay: .12, onComplete: () => playSweep(sweep) });
    gsap.timeline({
      scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: .55 },
      defaults: { ease: "none" },
    }).to(copy, { y: -72, opacity: .34, duration: 1 }, 0);
  }

  ScrollTrigger.create({
    trigger: section,
    start: "top 70%",
    onEnterBack: () => playSweep(sweep),
  });
}

function initOutcomes() {
  const section = document.querySelector("[data-contact-outcomes]");
  if (!section) return;
  const titleSweep = section.querySelector(".contact-outcomes__heading [data-sweep]");
  const timeline = section.querySelector("[data-contact-timeline]");
  const line = section.querySelector("[data-contact-line]");
  const points = [...section.querySelectorAll("[data-contact-point]")];
  prepareSweep(titleSweep);

  ScrollTrigger.create({
    trigger: section,
    start: "top 60%",
    onEnter: () => playSweep(titleSweep),
    onEnterBack: () => playSweep(titleSweep),
  });

  if (!reducedMotion()) {
    gsap.to(line, {
      scaleY: 1,
      ease: "none",
      scrollTrigger: { trigger: timeline, start: "top 75%", end: "bottom 38%", scrub: .4 },
    });
  }

  points.forEach((point) => {
    const sweep = point.querySelector("[data-sweep]");
    prepareSweep(sweep);
    ScrollTrigger.create({
      trigger: point,
      start: "top 72%",
      end: "bottom 35%",
      onEnter: () => {
        point.classList.add("is-active");
        playSweep(sweep);
      },
      onEnterBack: () => {
        point.classList.add("is-active");
        playSweep(sweep);
      },
      onLeave: () => point.classList.remove("is-active"),
      onLeaveBack: () => point.classList.remove("is-active"),
    });
  });
}

function buildMonthGrid(container, onSelectDay, selectedDay) {
  const firstWeekday = new Date(schedulerData.year, schedulerData.monthIndex, 1).getDay();
  const offset = firstWeekday === 0 ? 6 : firstWeekday - 1;
  const totalDays = new Date(schedulerData.year, schedulerData.monthIndex + 1, 0).getDate();
  const totalCells = Math.ceil((offset + totalDays) / 7) * 7;
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < totalCells; index += 1) {
    const day = index - offset + 1;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "schedule-day";

    if (day < 1 || day > totalDays) {
      button.classList.add("is-disabled");
      button.disabled = true;
      button.setAttribute("aria-hidden", "true");
      fragment.append(button);
      continue;
    }

    button.textContent = String(day);
    const isAvailable = schedulerData.availableDays.includes(day);
    if (!isAvailable) {
      button.classList.add("is-disabled");
      button.disabled = true;
    } else {
      button.classList.add("is-available");
      button.addEventListener("click", () => onSelectDay(day));
    }

    if (day === selectedDay) button.classList.add("is-selected");
    fragment.append(button);
  }

  container.innerHTML = "";
  container.append(fragment);
}

function formatSelectedDay(day) {
  if (!day) return "Choose a day";
  const date = new Date(schedulerData.year, schedulerData.monthIndex, day);
  return new Intl.DateTimeFormat("en", { weekday: "short", month: "short", day: "numeric" }).format(date);
}

function buildTimeSlots(container, day, selectedTime, onSelectTime) {
  container.innerHTML = "";
  const times = schedulerData.timesByDay[day] || [];
  if (!day || !times.length) {
    container.innerHTML = '<p class="schedule-times__placeholder">Select a date to see available hours.</p>';
    return;
  }

  times.forEach((time) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "schedule-time";
    button.textContent = time;
    if (time === selectedTime) button.classList.add("is-selected");
    button.addEventListener("click", () => onSelectTime(time));
    container.append(button);
  });
}

function toLimaISO(day, time) {
  const [hours, minutes] = time.split(":").map(Number);
  return `2026-11-${String(day).padStart(2, "0")}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00-05:00`;
}

function addThirtyMinutes(iso) {
  const date = new Date(iso);
  return new Date(date.getTime() + 30 * 60 * 1000).toISOString();
}

function showConfirming(url) {
  const overlay = document.querySelector("[data-contact-confirming]");
  const curtain = overlay?.querySelector(".contact-confirming__curtain");
  const content = overlay?.querySelector(".contact-confirming__content");
  const header = document.querySelector("[data-header]");

  if (!overlay || !curtain || !content) {
    sessionStorage.setItem("medal-confirm-entry", "1");
    window.location.href = url;
    return;
  }

  overlay.classList.add("is-active");
  overlay.setAttribute("aria-hidden", "false");
  gsap.set(curtain, { yPercent: 100 });
  gsap.set(content, { opacity: 0, y: 14, scale: .98 });

  gsap.timeline()
    .to(curtain, {
      yPercent: 34,
      duration: .48,
      ease: "power3.inOut",
    })
    .to(content, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: .28,
      ease: "power2.out",
    }, "-=.10")
    .to(curtain, {
      yPercent: 0,
      duration: .42,
      ease: "power3.inOut",
      onUpdate() {
        if (this.progress() > .72) header?.classList.add("header--light");
      },
      onComplete() {
        header?.classList.add("header--light");
      },
    }, "-=.08")
    .to({}, { duration: .42 })
    .add(() => {
      sessionStorage.setItem("medal-confirm-entry", "1");
      window.location.href = url;
    });
}

function initScheduler() {
  const section = document.querySelector("[data-contact-scheduler]");
  if (!section) return;
  const dayGrid = section.querySelector("[data-day-grid]");
  const timeGrid = section.querySelector("[data-time-grid]");
  const confirm = section.querySelector("[data-scheduler-confirm]");
  const label = section.querySelector("[data-selected-day-label]");
  const sweep = section.querySelector(".contact-scheduler__intro [data-sweep]");
  prepareSweep(sweep);

  ScrollTrigger.create({
    trigger: section,
    start: "top 60%",
    onEnter: () => playSweep(sweep),
    onEnterBack: () => playSweep(sweep),
  });

  let selectedDay = 5;
  let selectedTime = "10:00";

  const update = () => {
    buildMonthGrid(dayGrid, (day) => {
      selectedDay = day;
      selectedTime = null;
      update();
    }, selectedDay);

    buildTimeSlots(timeGrid, selectedDay, selectedTime, (time) => {
      selectedTime = time;
      update();
    });

    label.textContent = formatSelectedDay(selectedDay);
    confirm.disabled = !(selectedDay && selectedTime);
  };

  update();

  confirm?.addEventListener("click", () => {
    if (!(selectedDay && selectedTime)) return;
    const start = toLimaISO(selectedDay, selectedTime);
    const end = addThirtyMinutes(start);
    const url = `/contact/confirmed/?phase=booked&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`;
    showConfirming(url);
  });
}

export function initContact(lenis) {
  initScrollLinks(lenis);
  initHero();
  initOutcomes();
  initScheduler();
}
