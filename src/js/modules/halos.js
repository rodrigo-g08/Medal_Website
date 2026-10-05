const DESKTOP_QUERY = "(hover: hover) and (pointer: fine)";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

const FOLLOW_SPEED = 0.055;
const RETURN_SPEED = 0.0042;

const CORE_MIN_RADIUS = 72;
const CORE_MAX_RADIUS = 120;
const RELEASE_MULTIPLIER = 1.5;

/*
 * MEDAL GLOBAL HALOS — H1.4
 *
 * Exactly two large halos.
 *
 * LEFT:
 * top-left -> bottom-left -> bottom-center -> return
 *
 * RIGHT:
 * bottom-right -> top-right -> top-center -> return
 *
 * Important: route coordinates are calculated from the HALO CENTER, not from
 * its top-left corner. This keeps most of the glow visible at all times.
 */

const ROUTES = [
  {
    duration: 48000,
    points: "left",
    driftX: 8,
    driftY: 10,
  },
  {
    duration: 52000,
    points: "right",
    driftX: 8,
    driftY: 10,
  },
];

function ensureAmbient() {
  let ambient = document.querySelector(".ambient");

  if (!ambient) {
    ambient = document.createElement("div");
    ambient.className = "ambient";
    ambient.setAttribute("aria-hidden", "true");
    document.body.prepend(ambient);
  }

  let halos = [...ambient.querySelectorAll(".halo")];

  while (halos.length < 2) {
    const halo = document.createElement("span");
    ambient.appendChild(halo);
    halos.push(halo);
  }

  if (halos.length > 2) {
    halos.slice(2).forEach((halo) => halo.remove());
    halos = halos.slice(0, 2);
  }

  halos[0].className = "halo halo--one";
  halos[1].className = "halo halo--two";

  return { ambient, halos };
}

export function initHalos() {
  const { ambient, halos } = ensureAmbient();

  requestAnimationFrame(() => {
    document.documentElement.classList.add("halos-ready");
  });

  if (!ambient || halos.length !== 2) return;

  const desktopQuery = window.matchMedia(DESKTOP_QUERY);
  const reduceMotion = window.matchMedia(REDUCED_QUERY);

  const pointer = {
    x: 0,
    y: 0,
    inside: false,
  };

  const orbs = halos.map((el, index) => ({
    el,
    ...ROUTES[index],
    x: 0,
    y: 0,
    autoX: 0,
    autoY: 0,
    initialized: false,
    insideCore: false,
    lastCoreEnter: 0,
  }));

  let activeOrb = null;
  let rafId = null;

  const clamp = (value, min, max) =>
    Math.min(Math.max(value, min), max);

  const smoothStep = (t) => t * t * (3 - 2 * t);

  // Smooth 0 -> 1 -> 0 route traversal.
  const pingPong = (value) => {
    const t = ((value % 1) + 1) % 1;
    return t < 0.5
      ? smoothStep(t * 2)
      : smoothStep((1 - t) * 2);
  };

  const interpolatePolyline = (points, progress) => {
    const count = points.length - 1;
    const scaled = clamp(progress, 0, 1) * count;
    const segment = Math.min(Math.floor(scaled), count - 1);
    const local = scaled - segment;

    const a = points[segment];
    const b = points[segment + 1];

    return {
      x: a.x + (b.x - a.x) * local,
      y: a.y + (b.y - a.y) * local,
    };
  };

  /*
   * Use center-based positions.
   *
   * edgeInset = 0.72 * radius:
   * only ~14% of the halo diameter sits outside the viewport.
   * This gives the "corner glow" without losing half the halo.
   */
  const getRoutePoints = (orb, width, height) => {
    const radius = orb.el.offsetWidth / 2;
    const edgeInset = Math.max(radius * 0.72, 96);

    if (orb.points === "left") {
      return [
        { x: edgeInset, y: edgeInset },
        { x: edgeInset, y: height - edgeInset },
        { x: width * 0.50, y: height - edgeInset },
      ];
    }

    return [
      { x: width - edgeInset, y: height - edgeInset },
      { x: width - edgeInset, y: edgeInset },
      { x: width * 0.50, y: edgeInset },
    ];
  };

  const getCoreRadius = (orb) =>
    clamp(
      orb.el.offsetWidth * 0.12,
      CORE_MIN_RADIUS,
      CORE_MAX_RADIUS
    );

  const getOrbCenter = (orb) => ({
    x: orb.x + orb.el.offsetWidth / 2,
    y: orb.y + orb.el.offsetHeight / 2,
  });

  const distanceToOrb = (orb) => {
    const center = getOrbCenter(orb);
    return Math.hypot(pointer.x - center.x, pointer.y - center.y);
  };

  const releaseActive = () => {
    activeOrb = null;
  };

  const evaluateCores = () => {
    const interactive =
      desktopQuery.matches &&
      !reduceMotion.matches &&
      pointer.inside;

    if (!interactive) {
      releaseActive();
      orbs.forEach((orb) => {
        orb.insideCore = false;
      });
      return;
    }

    const now = performance.now();
    const candidates = [];

    orbs.forEach((orb, index) => {
      const distance = distanceToOrb(orb);
      const radius = getCoreRadius(orb);
      const inside = distance <= radius;

      if (inside && !orb.insideCore) {
        orb.lastCoreEnter = now;
      }

      orb.insideCore = inside;

      if (inside) {
        candidates.push({
          index,
          distance,
          lastCoreEnter: orb.lastCoreEnter,
        });
      }
    });

    if (activeOrb !== null) {
      const orb = orbs[activeOrb];
      const releaseRadius =
        getCoreRadius(orb) * RELEASE_MULTIPLIER;

      if (distanceToOrb(orb) > releaseRadius) {
        activeOrb = null;
      }
    }

    if (!candidates.length) return;

    candidates.sort((a, b) => {
      if (b.lastCoreEnter !== a.lastCoreEnter) {
        return b.lastCoreEnter - a.lastCoreEnter;
      }
      return a.distance - b.distance;
    });

    activeOrb = candidates[0].index;
  };

  const onPointerMove = (event) => {
    if (!desktopQuery.matches) return;

    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.inside = true;

    evaluateCores();
  };

  const onPointerLeave = () => {
    pointer.inside = false;
    activeOrb = null;

    orbs.forEach((orb) => {
      orb.insideCore = false;
    });
  };

  window.addEventListener("pointermove", onPointerMove, {
    passive: true,
  });

  document.documentElement.addEventListener(
    "mouseleave",
    onPointerLeave
  );

  window.addEventListener("blur", onPointerLeave);

  const animate = (time) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const reduced = reduceMotion.matches;

    const canFollow =
      desktopQuery.matches &&
      pointer.inside &&
      !reduced;

    orbs.forEach((orb, index) => {
      // No phase offset: the left halo really starts top-left and the right
      // halo really starts bottom-right when the page loads.
      const cycle = reduced
        ? 0
        : (time / orb.duration) % 1;

      const progress = pingPong(cycle);
      const route = getRoutePoints(orb, width, height);
      const center = interpolatePolyline(route, progress);

      const radius = orb.el.offsetWidth / 2;

      let autoCenterX = center.x;
      let autoCenterY = center.y;

      if (!reduced) {
        autoCenterX +=
          Math.sin(time / 11200 + index * 2.4) * orb.driftX;

        autoCenterY +=
          Math.cos(time / 12400 + index * 1.9) * orb.driftY;
      }

      // Convert center coordinate to element top-left coordinate.
      const autoX = autoCenterX - radius;
      const autoY = autoCenterY - radius;

      orb.autoX = autoX;
      orb.autoY = autoY;

      let targetX = autoX;
      let targetY = autoY;

      if (canFollow && activeOrb === index) {
        targetX = pointer.x - radius;
        targetY = pointer.y - radius;

        // Keep at least ~72% of the radius inside the viewport when following.
        const minX = -radius * 0.28;
        const maxX = width - orb.el.offsetWidth + radius * 0.28;
        const minY = -radius * 0.28;
        const maxY = height - orb.el.offsetHeight + radius * 0.28;

        targetX = clamp(targetX, minX, maxX);
        targetY = clamp(targetY, minY, maxY);
      }

      if (!orb.initialized) {
        orb.x = autoX;
        orb.y = autoY;
        orb.initialized = true;
      }

      const followsPointer =
        canFollow && activeOrb === index;

      const easing = followsPointer
        ? FOLLOW_SPEED
        : RETURN_SPEED;

      orb.x += (targetX - orb.x) * easing;
      orb.y += (targetY - orb.y) * easing;

      orb.el.style.transform =
        `translate3d(${orb.x.toFixed(2)}px, ${orb.y.toFixed(2)}px, 0)`;
    });

    evaluateCores();

    rafId = requestAnimationFrame(animate);
  };

  const syncMode = () => {
    if (!desktopQuery.matches || reduceMotion.matches) {
      onPointerLeave();
    }

    if (!rafId) {
      rafId = requestAnimationFrame(animate);
    }
  };

  desktopQuery.addEventListener?.("change", syncMode);
  reduceMotion.addEventListener?.("change", syncMode);

  syncMode();
}
