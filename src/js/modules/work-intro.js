import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LOGO_BOX = {
  x: 0,
  y: 0,
  width: 640,
  height: 200,
};

const APOSTROPHE_CENTER = {
  x: 257.475,
  y: 53.8,
};

const APOSTROPHE_POLYGON = [
  [257.48, 72.66],
  [218.21, 50.57],
  [226.97, 35.00],
  [257.48, 52.16],
  [287.98, 35.00],
  [296.74, 50.57],
];

export function initWorkIntro() {
  const hero = document.querySelector("[data-work-intro]");
  const svg = document.querySelector("[data-medal-logo]");
  const rest = document.querySelector("[data-medal-rest]");
  const copies = [...document.querySelectorAll("[data-work-copy]")];
  const bone = document.querySelector("[data-work-bone]");
  const boneContent = document.querySelector("[data-work-bone-content]");
  const boneEyebrow = document.querySelector("[data-bone-eyebrow]");
  const boneWords = [...document.querySelectorAll("[data-bone-word]")];
  const ambient = document.querySelector(".ambient");
  const header = document.querySelector("[data-header]");

  if (!hero || !svg || !rest || !bone || !boneContent) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  if (ambient) {
    gsap.set(ambient, { opacity: 1 });
  }

  if (reduceMotion.matches) {
    gsap.set(bone, { opacity: 1 });
    gsap.set(boneContent, { opacity: 1 });
    gsap.set(boneWords, { opacity: 1, y: 0 });
    return;
  }

  const state = { zoom: 0 };

  let geometry = null;
  let boneVisible = false;
  let transition = null;

  const clamp = (value, min, max) =>
    Math.min(Math.max(value, min), max);

  const clamp01 = (value) =>
    clamp(value, 0, 1);

  const smoothStep = (value) => {
    const t = clamp01(value);
    return t * t * (3 - 2 * t);
  };

  const expLerp = (from, to, progress) =>
    from * Math.pow(to / from, progress);

  const pointInPolygon = (x, y, polygon) => {
    let inside = false;

    for (
      let i = 0, j = polygon.length - 1;
      i < polygon.length;
      j = i++
    ) {
      const [xi, yi] = polygon[i];
      const [xj, yj] = polygon[j];

      const intersects =
        yi > y !== yj > y &&
        x <
          ((xj - xi) * (y - yi)) /
            (yj - yi) +
            xi;

      if (intersects) inside = !inside;
    }

    return inside;
  };

  const viewBoxIsFullyWhite = ({
    x,
    y,
    width,
    height,
  }) => {
    const STEPS = 8;

    for (let row = 0; row <= STEPS; row += 1) {
      const py =
        y + height * (row / STEPS);

      for (let col = 0; col <= STEPS; col += 1) {
        const px =
          x + width * (col / STEPS);

        if (
          !pointInPolygon(
            px,
            py,
            APOSTROPHE_POLYGON
          )
        ) {
          return false;
        }
      }
    }

    return true;
  };

  const getInitialBox = () => {
    const viewportAspect =
      window.innerWidth /
      Math.max(window.innerHeight, 1);

    /*
     * H3 v7: larger initial MEDAL only.
     * A tighter INITIAL SVG camera makes the full wordmark materially larger.
     * The apostrophe focus, final camera and zoom logic below are unchanged.
     */
    let logoFraction = 0.98;

    if (window.innerWidth <= 540) {
      logoFraction = 0.96;
    } else if (window.innerWidth <= 860) {
      logoFraction = 0.94;
    }

    const width =
      LOGO_BOX.width / logoFraction;

    const height =
      width / viewportAspect;

    const centerX =
      LOGO_BOX.x +
      LOGO_BOX.width / 2;

    const centerY =
      LOGO_BOX.y +
      LOGO_BOX.height / 2;

    return {
      x: centerX - width / 2,
      y: centerY - height / 2,
      width,
      height,
      centerX,
      centerY,
    };
  };

  const measure = () => {
    const initial = getInitialBox();

    const viewportAspect =
      window.innerWidth /
      Math.max(window.innerHeight, 1);

    const anchorU =
      (
        APOSTROPHE_CENTER.x -
        initial.x
      ) /
      initial.width;

    const anchorV =
      (
        APOSTROPHE_CENTER.y -
        initial.y
      ) /
      initial.height;

    const finalHeight = 3.0;
    const finalWidth =
      finalHeight * viewportAspect;

    geometry = {
      initial,
      anchorU,
      anchorV,
      final: {
        width: finalWidth,
        height: finalHeight,
      },
    };
  };

  const resetBoneCopy = () => {
    gsap.set(boneContent, {
      opacity: 0,
    });

    if (boneEyebrow) {
      gsap.set(boneEyebrow, {
        opacity: 0,
        y: 8,
      });
    }

    gsap.set(boneWords, {
      opacity: 0,
      y: 16,
    });
  };

  const showBoneScreen = () => {
    if (boneVisible) return;

    boneVisible = true;
    transition?.kill();

    header?.classList.add("header--light");

    gsap.killTweensOf([
      bone,
      boneContent,
      boneEyebrow,
      ...boneWords,
      ...copies,
    ]);

    transition = gsap.timeline();

    /*
     * H2.11 behavior remains:
     * trigger happens the moment the apostrophe truly covers the viewport.
     *
     * Only the COPY REVEAL is changed:
     * slower, smoother, and with a subtle word stagger.
     */
    transition
      .to(
        copies,
        {
          opacity: 0,
          duration: 0.08,
          ease: "power1.out",
        },
        0
      )
      .to(
        bone,
        {
          opacity: 1,
          duration: 0.26,
          ease: "power2.out",
        },
        0
      )
      .set(
        boneContent,
        {
          opacity: 1,
        },
        0.12
      );

    if (boneEyebrow) {
      transition.to(
        boneEyebrow,
        {
          opacity: 1,
          y: 0,
          duration: 0.38,
          ease: "power2.out",
        },
        0.09
      );
    }

    transition.to(
      boneWords,
      {
        opacity: 1,
        y: 0,
        duration: 0.52,
        stagger: 0.065,
        ease: "power3.out",
      },
      0.13
    );
  };

  const hideBoneScreen = () => {
    if (!boneVisible) return;

    boneVisible = false;
    transition?.kill();

    gsap.killTweensOf([
      bone,
      boneContent,
      boneEyebrow,
      ...boneWords,
    ]);

    transition = gsap.timeline();

    transition
      .to(
        boneWords.slice().reverse(),
        {
          opacity: 0,
          y: 10,
          duration: 0.20,
          stagger: 0.025,
          ease: "power1.in",
        },
        0
      );

    if (boneEyebrow) {
      transition.to(
        boneEyebrow,
        {
          opacity: 0,
          y: 6,
          duration: 0.16,
          ease: "power1.in",
        },
        0.02
      );
    }

    transition
      .to(
        boneContent,
        {
          opacity: 0,
          duration: 0.08,
        },
        0.16
      )
      .to(
        bone,
        {
          opacity: 0,
          duration: 0.10,
          ease: "power1.out",
        },
        0.17
      );

    header?.classList.remove("header--light");
  };

  const render = () => {
    if (!geometry) return;

    const p = clamp01(state.zoom);

    const width = expLerp(
      geometry.initial.width,
      geometry.final.width,
      p
    );

    const height = expLerp(
      geometry.initial.height,
      geometry.final.height,
      p
    );

    const anchoredX =
      APOSTROPHE_CENTER.x -
      geometry.anchorU * width;

    const anchoredY =
      APOSTROPHE_CENTER.y -
      geometry.anchorV * height;

    const recenter =
      smoothStep(
        clamp01(
          (p - 0.62) / 0.23
        )
      );

    const centeredX =
      APOSTROPHE_CENTER.x -
      width / 2;

    const centeredY =
      APOSTROPHE_CENTER.y -
      height / 2;

    const x =
      anchoredX +
      (centeredX - anchoredX) *
        recenter;

    const y =
      anchoredY +
      (centeredY - anchoredY) *
        recenter;

    svg.setAttribute(
      "viewBox",
      `${x.toFixed(5)} ${y.toFixed(5)} ${width.toFixed(5)} ${height.toFixed(5)}`
    );

    const restOpacity =
      1 -
      smoothStep(
        (p - 0.12) / 0.18
      );

    rest.style.opacity =
      String(restOpacity);

    if (!boneVisible) {
      const copyFade =
        1 -
        smoothStep(
          (p - 0.76) / 0.12
        );

      copies.forEach((el) => {
        el.style.opacity =
          String(copyFade);
      });
    }

    const fullyWhite =
      viewBoxIsFullyWhite({
        x,
        y,
        width,
        height,
      });

    // La pantalla clara entra mucho antes: no espera a que el apóstrofe cubra todo.
    const earlyTakeover = p >= 0.46;

    if (fullyWhite || earlyTakeover) {
      showBoneScreen();
    } else if (
      boneVisible &&
      p < 0.40
    ) {
      hideBoneScreen();
    }
  };

  gsap.fromTo(
    svg,
    { opacity: 0 },
    {
      opacity: 1,
      duration: .7,
      ease: "power2.out",
    }
  );

  gsap.fromTo(
    copies,
    {
      opacity: 0,
      y: 14,
    },
    {
      opacity: 1,
      y: 0,
      duration: .62,
      delay: .10,
      stagger: .05,
      ease: "power2.out",
      clearProps: "y",
    }
  );

  gsap.set(rest, {
    opacity: 1,
  });

  gsap.set(bone, {
    opacity: 0,
  });

  resetBoneCopy();

  measure();
  render();

  const timeline = gsap.timeline({
    defaults: {
      ease: "none",
    },

    scrollTrigger: {
      trigger: hero,
      start: "top top",
      end: () =>
        `+=${Math.max(
          window.innerHeight * 0.62,
          420
        )}`,
      pin: true,
      pinSpacing: true,
      scrub: 1.05,
      anticipatePin: 1,
      invalidateOnRefresh: true,

      onRefreshInit: () => {
        measure();
        render();
      },

      onUpdate: () => {
        if (
          ambient &&
          !boneVisible
        ) {
          ambient.style.opacity = "1";
        }
      },

      onLeaveBack: () => {
        hideBoneScreen();

        if (ambient) {
          ambient.style.opacity = "1";
        }
      },
    },
  });

  timeline.to(
    state,
    {
      zoom: 1,
      duration: .875,
      onUpdate: render,
    },
    .02
  );

  const refreshGeometry = () => {
    measure();
    render();
    ScrollTrigger.refresh();
  };

  window.addEventListener(
    "resize",
    refreshGeometry,
    {
      passive: true,
    }
  );

  document.fonts?.ready?.then(() => {
    measure();
    render();
    ScrollTrigger.refresh();
  });
}
