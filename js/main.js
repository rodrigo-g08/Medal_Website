/* ==========================================================
   Medal — Página provisional
   1. Control de sonido del video de portada.
   2. Envío del formulario al correo de Medal (FormSubmit).
   ========================================================== */

/* ---------- Configuración ---------- */
const CONFIG = {
  // Correo que recibe las consultas. Después de activar FormSubmit,
  // puede reemplazarse por el alias aleatorio que envía el servicio
  // para no exponer la dirección en el código.
  formEndpoint: 'https://formsubmit.co/ajax/rgamero406@gmail.com',
  fallbackEmail: 'rgamero406@gmail.com',
  subject: 'New Medal website inquiry',
};

/* ---------- 1. Video de portada ---------- */
(function heroVideo() {
  const video = document.getElementById('hero-video');
  const toggle = document.getElementById('sound-toggle');
  const label = document.getElementById('sound-label');
  if (!video || !toggle) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    video.removeAttribute('autoplay');
    video.pause();
  }

  // Los navegadores bloquean el autoplay con audio. El video arranca
  // silenciado y el primer clic del visitante habilita la pista original.
  video.muted = true;
  video.volume = 1;

  toggle.addEventListener('click', () => {
    video.muted = !video.muted;
    const on = !video.muted;
    toggle.setAttribute('aria-pressed', String(on));
    label.textContent = on ? 'Sound on' : 'Sound off';
    if (on) video.play().catch(() => {});
  });

  // Si el navegador pausa el video (pestaña oculta, ahorro de batería),
  // se reanuda al volver, salvo que el visitante prefiera menos movimiento.
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && video.paused && !reduceMotion) {
      video.play().catch(() => {});
    }
  });
})();

/* ---------- 2. Formulario ---------- */
(function contactForm() {
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-status');
  const button = document.getElementById('cf-submit');
  if (!form) return;

  const defaultStatus = statusEl.textContent;
  const setStatus = (text, type = '') => {
    statusEl.textContent = text;
    statusEl.className = `form-status${type ? ` is-${type}` : ''}`;
  };

  form.querySelectorAll('input, textarea').forEach((el) => {
    el.addEventListener('input', () => {
      el.closest('.field')?.classList.remove('is-invalid');
      if (statusEl.classList.contains('is-error')) setStatus(defaultStatus);
    });
  });

  function validate() {
    let firstInvalid = null;
    form.querySelectorAll('[required]').forEach((el) => {
      const ok = el.value.trim() !== '' && el.checkValidity();
      el.closest('.field')?.classList.toggle('is-invalid', !ok);
      if (!ok && !firstInvalid) firstInvalid = el;
    });
    if (firstInvalid) {
      const email = form.elements.email;
      const msg = firstInvalid === email && email.value.trim()
        ? 'Enter a valid email address.'
        : 'Complete your name, work email and a few lines about your brand.';
      setStatus(msg, 'error');
      firstInvalid.focus();
      return false;
    }
    return true;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (form.elements._honey.value) return; // bot
    if (!validate()) return;

    button.setAttribute('aria-busy', 'true');
    button.disabled = true;
    setStatus('Sending…');

    const data = {
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      brand: form.elements.brand.value.trim(),
      message: form.elements.brand.value.trim(),
      _subject: CONFIG.subject,
      _replyto: form.elements.email.value.trim(),
      _template: 'table',
      _captcha: 'false',
    };

    try {
      const res = await fetch(CONFIG.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || String(json.success) === 'false') throw new Error(json.message || res.statusText);
      form.reset();
      setStatus('Thank you. Your inquiry was sent successfully.', 'ok');
    } catch (err) {
      console.error('[Medal form]', err);
      setStatus(`We could not send your message. Write to us directly at ${CONFIG.fallbackEmail}.`, 'error');
    } finally {
      button.removeAttribute('aria-busy');
      button.disabled = false;
    }
  });
})();
