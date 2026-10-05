import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const CALENDLY_URL = "https://calendly.com/rgamero406/medal-session";


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

function loadCalendlyScript() {
  if (window.Calendly?.initInlineWidget) return Promise.resolve(window.Calendly);

  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-medal-calendly]');
    if (existing) {
      existing.addEventListener('load', () => resolve(window.Calendly), { once: true });
      existing.addEventListener('error', reject, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.dataset.medalCalendly = 'true';
    script.addEventListener('load', () => resolve(window.Calendly), { once: true });
    script.addEventListener('error', reject, { once: true });
    document.head.append(script);
  });
}

function initScheduler() {
  const section = document.querySelector('[data-contact-scheduler]');
  if (!section) return;

  const sweep = section.querySelector('.contact-scheduler__intro [data-sweep]');
  const mount = section.querySelector('[data-calendly-inline]');
  const shell = section.querySelector('.contact-calendly');
  prepareSweep(sweep);

  ScrollTrigger.create({
    trigger: section,
    start: 'top 60%',
    onEnter: () => playSweep(sweep),
    onEnterBack: () => playSweep(sweep),
  });

  if (!mount) return;

  loadCalendlyScript()
    .then((Calendly) => {
      if (!Calendly?.initInlineWidget) throw new Error('Calendly failed to initialize');
      Calendly.initInlineWidget({
        url: `${CALENDLY_URL}?hide_event_type_details=1&hide_gdpr_banner=1`,
        parentElement: mount,
        prefill: {},
        utm: { utmSource: 'medalusa', utmMedium: 'website', utmCampaign: 'medal-session' },
      });
      shell?.classList.add('is-loaded');
    })
    .catch(() => shell?.classList.add('has-error'));

  const onCalendlyMessage = (event) => {
    if (event.origin !== 'https://calendly.com') return;
    const name = event.data?.event;
    if (!name || !name.startsWith('calendly.')) return;

    if (name === 'calendly.event_scheduled') {
      sessionStorage.setItem('medal-calendly-booked', '1');
      showConfirming('/contact/confirmed/?phase=booked&source=calendly');
    }
  };

  window.addEventListener('message', onCalendlyMessage);
}


export function initContact(lenis) {
  initScrollLinks(lenis);
  initHero();
  initOutcomes();
  initScheduler();
}
