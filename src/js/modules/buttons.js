export function initButtons() {
  document.querySelectorAll(".button--primary").forEach((button) => {
    button.addEventListener("pointerdown", (event) => {
      button.classList.add("is-pressed");

      const rect = button.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.className = "button__ripple";
      ripple.style.left = `${event.clientX - rect.left}px`;
      ripple.style.top = `${event.clientY - rect.top}px`;
      button.appendChild(ripple);

      window.setTimeout(() => ripple.remove(), 620);
    });

    const release = () => {
      window.setTimeout(() => button.classList.remove("is-pressed"), 150);
    };

    button.addEventListener("pointerup", release);
    button.addEventListener("pointercancel", release);
    button.addEventListener("pointerleave", release);
  });
}
