# QA Y PENDIENTES — MEDAL WEBSITE
## Prioridad para la siguiente conversación

## P0 — corregir primero

### 1. Audio del video en `/contact/confirmed/`
**Síntoma:** el video Artech reproduce imagen pero el usuario reporta que no se escucha.

**Hecho confirmado:** `assets/video/artech-classic-cars.mp4` contiene audio AAC LC estéreo 44.1 kHz.

**Archivo responsable:**

`src/js/modules/confirmed.js`

**Hipótesis principal:** el evento de click hace `video.play()` pero no fuerza `video.muted = false` y `video.volume = 1` tras el gesto del usuario.

**Criterio de aceptación:**
- primer click en el video: reproduce con audio;
- segundo click: pausa;
- no intentar autoplay con sonido;
- conservar play amarillo y estado visual.

### 2. Contact → Confirmed debe sentirse como una sola cortina
**Criterio aprobado:**
- click Confirm session;
- curtain bone sube desde abajo;
- logo Medal negro aparece centrado;
- cubre 100%;
- navegación a Confirmed no debe mostrar flash negro/blanco;
- Confirmation ya es bone y toma continuidad de la cortina;
- el header pasa a modo claro sin salto.

**Archivos:**
- `src/js/modules/contact.js`
- `src/css/pages/contact.css`
- `src/js/modules/confirmed.js`
- `src/css/pages/confirmed.css`

### 3. Confirmed debe caber como una sola pantalla en desktop
Comprobar 1440×900, 1920×1080 y 2560×1440.

No debería obligar a scroll para ver:
- booking;
- checklist;
- botones;
- video/copy.

---

## P1 — Film & Services

La estructura anterior de Film fue reemplazada por `docs/MEDAL-PORTADA-Y-FILM-SERVICES-SPEC.md`. Ya no validar `How Medal works`, `Select your plan`, el rombo ni el cambio de header a hueso.

### 4. Reels · tira y visor
- tira automática a 42 px/s sin saltos;
- hover pausa, escala y llena barra durante 10 s;
- clic/Enter abre inmediatamente;
- visor fullscreen crece desde la tarjeta y cierra al mismo punto;
- Replay, ←, →, Esc y ✕ funcionan;
- no hay fotos fingiendo ser reels ni KPIs inventados.

### 5. Escena única de medallas
- Bronze, Silver y Gold existen una sola vez en el DOM;
- ninguna gira;
- asoman desde abajo y suben en orden;
- cada una pasa al frente con fundido limpio del copy;
- terminan en el slot de su tarjeta;
- fondo negro con halos en todo momento;
- Gold card puede ser hueso, pero no existe una pantalla hueso completa.

### 6. Hilo del apóstrofe y cierre
- el apóstrofe amarillo baja con el scroll;
- la línea se extiende con él;
- las dos frases laterales aparecen y desaparecen en el tramo previsto;
- al llegar a Availability se dispara el yellow sweep del titular;
- Availability conserva 4/6, 2 posiciones abiertas y CTA.

### 7. Portada → Work
- header común visible sobre el video;
- en p=0 el video llena pantalla sin negro visible;
- al bajar, el video queda dentro de `medal` y luego el logo pasa a hueso;
- la barra amarilla avanza/reversa con scroll;
- al completarse abre `/work/`;
- el tamaño final del logotipo coincide visualmente con el inicio de Work;
- `work-intro.js` y `work.css` deben seguir intactos.

## P1 — Work

### 10. H3 fade negro
Probar que no vuelva crossfade directo entre dos imágenes.

### 11. H4 AUTO / EXPLORE / FOCUS
Comprobar:
- auto lento izquierda;
- cursor controla velocidad/dirección sin click;
- focus pausa solo cuando cursor se estabiliza;
- imagen sube suficiente;
- marca aparece;
- salir del área vuelve a AUTO;
- hover/focus no rompe scroll vertical.

### 12. H5 KPI
Animaciones deben reiniciarse al volver a entrar.

### 13. H6
- `Six new brands a month.`
- 6 círculos;
- 4 rellenos;
- sweep amarillo vuelve a blanco.

---

## P2 — Responsive

Probar al menos:

```text
1920×1080
1440×900
1366×768
1024×768
820×1180
390×844
```

Comprobar:
- header no invade contenido;
- títulos no cortan;
- sticky/pinned sections no generan espacios vacíos;
- calendly mockup usable en móvil;
- medallas no desbordan;
- Confirmation sigue siendo clara.

---

## P2 — Performance / build

- ejecutar `npm run build`;
- revisar warnings de Vite;
- revisar tamaño de video e imágenes;
- considerar lazy loading donde no rompa transiciones;
- no optimizar/recomprimir los assets definitivos sin comparar calidad visual.
