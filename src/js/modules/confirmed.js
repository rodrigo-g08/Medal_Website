import site from "../../data/site.json";
import { gsap } from "gsap";

function formatBooking(startValue) {
  const fallback = { date: "Thursday, Nov 5", time: "10:00" };
  if (!startValue) return fallback;
  const date = new Date(startValue);
  if (Number.isNaN(date.getTime())) return fallback;

  return {
    date: new Intl.DateTimeFormat("en", {
      weekday: "long",
      month: "short",
      day: "numeric",
      timeZone: "America/Lima",
    }).format(date),
    time: new Intl.DateTimeFormat("en", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "America/Lima",
    }).format(date),
  };
}

function makeCalendarFile(startValue, endValue) {
  const start = new Date(startValue);
  const end = new Date(endValue || start.getTime() + 30 * 60 * 1000);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;

  const stamp = (date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const content = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Medal//Medal Session//EN",
    "BEGIN:VEVENT",
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    "SUMMARY:Medal Session",
    "DESCRIPTION:30-minute Medal Session",
    "LOCATION:Video call",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return new Blob([content], { type: "text/calendar;charset=utf-8" });
}

function initEntryTransition(content) {
  const entry = document.querySelector("[data-confirmed-entry]");
  const fromCurtain = sessionStorage.getItem("medal-confirm-entry") === "1";
  sessionStorage.removeItem("medal-confirm-entry");

  const left = content?.querySelector(".booking-confirmed__left");
  const right = content?.querySelector(".booking-confirmed__right");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced) {
    gsap.set([left, right], { opacity: 1, y: 0 });
    return;
  }

  if (entry && fromCurtain) {
    entry.classList.add("is-active");
    entry.setAttribute("aria-hidden", "false");
    gsap.set([left, right], { opacity: 0, y: 26 });

    gsap.timeline()
      .to(entry.querySelector("img"), {
        opacity: 0,
        y: -18,
        scale: .94,
        duration: .32,
        ease: "power2.in",
        delay: .18,
      })
      .to(entry, {
        opacity: 0,
        duration: .26,
        ease: "power1.out",
        onComplete: () => {
          entry.classList.remove("is-active");
          entry.setAttribute("aria-hidden", "true");
        },
      }, "-=.06")
      .to(left, { opacity: 1, y: 0, duration: .62, ease: "power3.out" }, "-=.12")
      .to(right, { opacity: 1, y: 0, duration: .62, ease: "power3.out" }, "-=.48");
  } else {
    gsap.timeline()
      .to(left, { opacity: 1, y: 0, duration: .62, ease: "power3.out", delay: .12 })
      .to(right, { opacity: 1, y: 0, duration: .62, ease: "power3.out" }, "-=.44");
  }
}

function initFilm() {
  const button = document.querySelector("[data-confirmed-film]");
  const video = document.querySelector("[data-confirmed-video]");
  if (!button || !video) return;

  button.addEventListener("click", async () => {
    if (video.paused) {
      try {
        await video.play();
        button.classList.add("is-playing");
      } catch (_) {}
    } else {
      video.pause();
      button.classList.remove("is-playing");
    }
  });

  video.addEventListener("ended", () => button.classList.remove("is-playing"));
}

export function initConfirmed() {
  const params = new URLSearchParams(window.location.search);
  const start = params.get("start");
  const end = params.get("end");
  const source = params.get("source");
  const fromCalendly = source === "calendly" || sessionStorage.getItem("medal-calendly-booked") === "1";
  sessionStorage.removeItem("medal-calendly-booked");
  const booking = formatBooking(start);

  const dateEl = document.querySelector("[data-confirmed-date]");
  const timeEl = document.querySelector("[data-confirmed-time]");
  if (fromCalendly && !start) {
    if (dateEl) dateEl.textContent = "Session booked";
    if (timeEl) timeEl.textContent = "Calendly confirmation sent";
  } else {
    if (dateEl) dateEl.textContent = booking.date;
    if (timeEl) timeEl.textContent = booking.time;
  }

  const calendar = document.querySelector("[data-add-calendar]");
  if (calendar) {
    if (fromCalendly && !start) {
      calendar.textContent = "Calendar invite sent by Calendly";
      calendar.disabled = true;
      calendar.setAttribute("aria-disabled", "true");
    } else {
      calendar.addEventListener("click", () => {
        const actualStart = start || "2026-11-05T10:00:00-05:00";
        const blob = makeCalendarFile(actualStart, end);
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "medal-session.ics";
        anchor.click();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      });
    }
  }

  const whatsapp = document.querySelector("[data-whatsapp-action]");
  const whatsappUrl = site.contact?.whatsappUrl || "";
  if (whatsapp) {
    if (whatsappUrl) {
      whatsapp.href = whatsappUrl;
      whatsapp.target = "_blank";
      whatsapp.rel = "noopener noreferrer";
    } else {
      whatsapp.setAttribute("aria-disabled", "true");
      whatsapp.addEventListener("click", (event) => event.preventDefault());
    }
  }

  initFilm();
  initEntryTransition(document.querySelector("[data-confirmed-content]"));
}
