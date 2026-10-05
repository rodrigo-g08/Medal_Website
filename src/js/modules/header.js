export function initHeader() {
  const header = document.querySelector("[data-header]");
  if (!header) return;

  const sections = [...document.querySelectorAll("[data-theme]")];
  const isWorkPage = document.body?.dataset.page === "work";
  const toggle = document.querySelector("[data-menu-toggle]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");

  const applyTheme = (theme) => {
    header.classList.toggle("header--light", theme === "light");
  };

  // Work manages its one light-on-bone moment explicitly in work-intro/work-cases.
  // Everywhere else on Work the identity remains white over the dark photography/halo field.
  if (sections.length && !isWorkPage) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) applyTheme(visible.target.dataset.theme || "dark");
    }, {
      rootMargin: "-12% 0px -75% 0px",
      threshold: [0, 0.01, 0.1, 0.5],
    });

    sections.forEach((section) => observer.observe(section));
  }

  if (!toggle || !mobileMenu) return;

  const closeMenu = () => {
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    mobileMenu.setAttribute("aria-hidden", "true");
    mobileMenu.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  };

  const openMenu = () => {
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
    mobileMenu.setAttribute("aria-hidden", "false");
    mobileMenu.classList.add("is-open");
    document.body.classList.add("menu-open");
  };

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    isOpen ? closeMenu() : openMenu();
  });

  mobileMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}
