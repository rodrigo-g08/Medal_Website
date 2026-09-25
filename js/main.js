/* ==========================================================
   Medal — Página provisional
   1. Control de sonido del video de portada.
   2. Envío del formulario al correo de Medal (FormSubmit).
   ========================================================== */

/* ---------- Configuración ---------- */
const CONFIG = {
  formEndpoint: 'https://formsubmit.co/ajax/info@medalusa.com',
  fallbackEmail: 'info@medalusa.com',
  subject: 'New inquiry from medalusa.com',
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

/* ==========================================================
   MEDAL — HALOS INTERACTIVOS V2

   - Sin cursor: recorrido automático.
   - Cursor normal: no ocurre nada.
   - Cursor sobre el núcleo de un halo:
     ese halo empieza a seguirlo.
   - Si entra al núcleo del otro halo:
     cambia el halo activo.
   - Al entrar al formulario:
     se libera cualquier halo.
   - Mobile:
     solo animación automática.
   ========================================================== */

(function interactiveMesh() {

  const section =
    document.querySelector('.message');

  const form =
    document.querySelector('.contact-form');

  const topOrb =
    document.querySelector('.mesh-orb--top');

  const bottomOrb =
    document.querySelector('.mesh-orb--bottom');


  if (
    !section ||
    !topOrb ||
    !bottomOrb
  ) return;



  /* ========================================================
     MEDIA QUERIES
     ======================================================== */

  const reduceMotion =
    window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );


  const mobileQuery =
    window.matchMedia(
      '(max-width: 720px)'
    );



  /* ========================================================
     AJUSTES
     ======================================================== */

  /*
     Qué tan rápido sigue al mouse
     una vez capturado.

     Más bajo = más flotante.
  */
  const FOLLOW_SPEED = 0.055;


  /*
     Qué tan suavemente regresa
     a su recorrido natural.
  */
  const RETURN_SPEED = 0.018;


  /*
     Tamaño máximo del núcleo invisible.
     No cambia visualmente el halo.
  */
  const CORE_MAX_RADIUS = 92;


  /*
     Tamaño mínimo del núcleo.
  */
  const CORE_MIN_RADIUS = 58;



  /* ========================================================
     CURSOR
     ======================================================== */

  const pointer = {

    x: 0,
    y: 0,

    inside: false,

    overForm: false

  };



  /* ========================================================
     HALOS
     ======================================================== */

  const orbs = [

    {

      el: topOrb,

      /*
         Halo superior:
         derecha → izquierda → derecha
      */
      duration: 52000,

      startX: .72,
      startY: -.28,

      travelX: -.72,
      travelY: .12,

      phase: 0,

      x: 0,
      y: 0,

      autoX: 0,
      autoY: 0,

      initialized: false,

      insideCore: false,

      lastCoreEnter: 0

    },


    {

      el: bottomOrb,

      /*
         Halo inferior:
         izquierda inferior →
         derecha superior →
         regreso.
      */
      duration: 58000,

      startX: -.24,
      startY: .58,

      travelX: .82,
      travelY: -.78,

      phase: .22,

      x: 0,
      y: 0,

      autoX: 0,
      autoY: 0,

      initialized: false,

      insideCore: false,

      lastCoreEnter: 0

    }

  ];



  /*
     null = ningún halo sigue al cursor.

     0 = halo superior.
     1 = halo inferior.
  */

  let activeOrb = null;



  /* ========================================================
     HELPERS
     ======================================================== */

  function clamp(
    value,
    min,
    max
  ) {

    return Math.min(
      Math.max(
        value,
        min
      ),
      max
    );

  }



  function smoothStep(t) {

    return (
      t *
      t *
      (
        3 -
        2 * t
      )
    );

  }



  function pingPong(value) {

    const t =
      value % 1;


    if (
      t < .5
    ) {

      return smoothStep(
        t * 2
      );

    }


    return smoothStep(

      (
        1 - t
      ) *
      2

    );

  }



  /*
     Devuelve el radio invisible
     del núcleo de cada halo.
  */

  function getCoreRadius(orb) {

    const calculated =
      orb.el.offsetWidth * .115;


    return clamp(

      calculated,

      CORE_MIN_RADIUS,

      CORE_MAX_RADIUS

    );

  }



  /*
     Centro actual del halo.
  */

  function getOrbCenter(orb) {

    return {

      x:
        orb.x +
        orb.el.offsetWidth / 2,

      y:
        orb.y +
        orb.el.offsetHeight / 2

    };

  }



  /*
     Distancia cursor → núcleo.
  */

  function distanceToOrb(orb) {

    const center =
      getOrbCenter(orb);


    return Math.hypot(

      pointer.x -
      center.x,

      pointer.y -
      center.y

    );

  }



  /* ========================================================
     DETECCIÓN DE NÚCLEOS
     ======================================================== */

  function evaluateCores() {

    /*
       Mobile nunca interactúa.
    */

    if (
      mobileQuery.matches ||
      !pointer.inside ||
      pointer.overForm
    ) {

      return;

    }


    const now =
      performance.now();


    const candidates = [];


    orbs.forEach(

      (orb, index) => {

        const distance =
          distanceToOrb(orb);


        const radius =
          getCoreRadius(orb);


        const isInside =
          distance <= radius;



        /*
           Registramos cuándo ENTRÓ
           al núcleo.

           No actualizamos esto
           continuamente mientras
           permanece dentro.
        */

        if (
          isInside &&
          !orb.insideCore
        ) {

          orb.lastCoreEnter =
            now;

        }


        orb.insideCore =
          isInside;



        if (
          isInside
        ) {

          candidates.push({

            index,

            distance,

            lastCoreEnter:
              orb.lastCoreEnter

          });

        }

      }

    );



    /*
       Si no entró a ningún núcleo,
       no pasa absolutamente nada.
    */

    if (
      candidates.length === 0
    ) {

      return;

    }



    /*
       Si solamente hay uno,
       ese halo se activa.
    */

    if (
      candidates.length === 1
    ) {

      activeOrb =
        candidates[0].index;

      return;

    }



    /*
       Si el cursor está dentro
       de ambos núcleos simultáneamente:

       gana el núcleo al que entró
       más recientemente.
    */

    candidates.sort(

      (a, b) => {

        if (
          b.lastCoreEnter !==
          a.lastCoreEnter
        ) {

          return (
            b.lastCoreEnter -
            a.lastCoreEnter
          );

        }


        /*
           Si ocurrieron exactamente
           al mismo tiempo,
           usamos el más cercano.
        */

        return (
          a.distance -
          b.distance
        );

      }

    );


    activeOrb =
      candidates[0].index;

  }



  /* ========================================================
     POINTER
     ======================================================== */

  section.addEventListener(

    'pointerenter',

    (event) => {

      if (
        mobileQuery.matches
      ) return;


      pointer.inside =
        true;


      updatePointer(
        event
      );

    }

  );



  section.addEventListener(

    'pointermove',

    (event) => {

      if (
        mobileQuery.matches
      ) return;


      pointer.inside =
        true;


      /*
         IMPORTANTE:

         si estamos encima del formulario,
         ningún halo nos sigue.
      */

      pointer.overForm =
        Boolean(
          event.target.closest(
            '.contact-form'
          )
        );


      updatePointer(
        event
      );



      if (
        pointer.overForm
      ) {

        releaseOrb();

        return;

      }


      evaluateCores();

    }

  );



  section.addEventListener(

    'pointerleave',

    () => {

      pointer.inside =
        false;

      pointer.overForm =
        false;


      releaseOrb();

    }

  );



  /*
     Protección adicional:
     en cuanto entras al formulario,
     el halo activo vuelve a su ruta.
  */

  if (form) {

    form.addEventListener(

      'pointerenter',

      () => {

        pointer.overForm =
          true;


        releaseOrb();

      }

    );


    form.addEventListener(

      'pointerleave',

      () => {

        pointer.overForm =
          false;

      }

    );

  }



  function updatePointer(event) {

    const rect =
      section.getBoundingClientRect();


    pointer.x =

      clamp(

        event.clientX -
        rect.left,

        0,

        rect.width

      );


    pointer.y =

      clamp(

        event.clientY -
        rect.top,

        0,

        rect.height

      );

  }



  /* ========================================================
     LIBERAR HALO
     ======================================================== */

  function releaseOrb() {

    activeOrb =
      null;


    orbs.forEach(

      orb => {

        orb.insideCore =
          false;

      }

    );

  }



  /* ========================================================
     ANIMACIÓN PRINCIPAL
     ======================================================== */

  function animate(time) {

    const rect =
      section.getBoundingClientRect();


    const width =
      rect.width;


    const height =
      rect.height;


    const isMobile =
      mobileQuery.matches;


    const reduced =
      reduceMotion.matches;



    orbs.forEach(

      (
        orb,
        index
      ) => {


        /* ================================================
           1. TRAYECTORIA NATURAL
           ================================================ */

        let progress;


        if (
          reduced
        ) {

          progress =
            .2;

        } else {

          progress =

            (
              time /
              orb.duration +
              orb.phase
            ) % 1;

        }


        const path =
          pingPong(
            progress
          );



        let autoX =

          width *

          (
            orb.startX +
            orb.travelX *
            path
          );


        let autoY =

          height *

          (
            orb.startY +
            orb.travelY *
            path
          );



        /*
           Respiración orgánica.
        */

        if (
          !reduced
        ) {

          autoX +=

            Math.sin(

              time /
              9200 +

              index *
              2.3

            ) *

            22;


          autoY +=

            Math.cos(

              time /
              10800 +

              index *
              1.7

            ) *

            18;

        }



        orb.autoX =
          autoX;


        orb.autoY =
          autoY;



        /* ================================================
           2. TARGET
           ================================================ */

        let targetX =
          autoX;


        let targetY =
          autoY;



        /*
           Solo UNO puede seguir
           al cursor a la vez.
        */

        if (
          !isMobile &&
          pointer.inside &&
          !pointer.overForm &&
          activeOrb === index
        ) {


          targetX =

            pointer.x -
            orb.el.offsetWidth /
            2;


          targetY =

            pointer.y -
            orb.el.offsetHeight /
            2;



          /*
             Permitimos que parte
             del halo salga del cuadro,
             pero nunca completamente.
          */

          targetX =
            clamp(

              targetX,

              -orb.el.offsetWidth *
              .58,

              width -
              orb.el.offsetWidth *
              .42

            );


          targetY =
            clamp(

              targetY,

              -orb.el.offsetHeight *
              .58,

              height -
              orb.el.offsetHeight *
              .42

            );

        }



        /* ================================================
           3. PRIMER FRAME
           ================================================ */

        if (
          !orb.initialized
        ) {

          orb.x =
            autoX;


          orb.y =
            autoY;


          orb.initialized =
            true;

        }



        /* ================================================
           4. INTERPOLACIÓN
           ================================================ */

        const followsPointer =

          activeOrb === index &&
          pointer.inside &&
          !pointer.overForm &&
          !isMobile;



        const easing =

          followsPointer
            ? FOLLOW_SPEED
            : RETURN_SPEED;



        orb.x +=

          (
            targetX -
            orb.x
          ) *
          easing;



        orb.y +=

          (
            targetY -
            orb.y
          ) *
          easing;



        orb.el.style.transform =

          `translate3d(
            ${orb.x}px,
            ${orb.y}px,
            0
          )`;

      }

    );



    requestAnimationFrame(
      animate
    );

  }



  requestAnimationFrame(
    animate
  );

})();