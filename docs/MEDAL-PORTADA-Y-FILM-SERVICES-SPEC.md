# Medal · Especificación de portada y Film & Services

**Para:** la IA o el desarrollador que implementará los cambios en el repositorio `Medal_Website` (base: `Medal_Website-MASTER-2026-10-03`).
**Origen:** dos prototipos aprobados por el usuario, «Medal Landing» (portada) y «Medal Services» (Film & Services).
**Alcance:** solo experiencia inmersiva, interacción y estructura de la portada (`/`) y de `/film-services/`.

---

## 0. Reglas que mandan sobre todo lo demás

1. **No se cambia el contenido.** Textos, imágenes, videos, logotipos y datos son los que ya existen en el repositorio. Este documento define cómo se mueven y en qué orden aparecen, no qué dicen.
2. **Los prototipos usaron textos e imágenes de relleno.** Donde un prototipo difiera del repositorio, gana el repositorio. La sección 6 indica de dónde sale cada texto.
3. **No se toca nada fuera de alcance:** `work/`, `contact/`, `contact/confirmed/`, `src/data/cases.json`, `src/data/strip.json`, los módulos `work-*.js`, `contact.js`, `confirmed.js` y sus hojas de estilo.
4. **Sin precios** y **sin promesas de devolución de dinero** en ninguna pantalla.
5. **Fondo siempre negro** (`--ink #05060A`) con los halos azules globales (`.ambient`, `halos.js`). Ninguna pantalla en hueso dentro de Film & Services. El azul y el amarillo no se superponen como rellenos.
6. **Nada ocurre fuera de la vista.** Toda animación avanza con el scroll y retrocede al subir (`scrub`), o se dispara con un elemento que el visitante está mirando. No se crean tramos que exijan «otro scroll» cuando la animación ya terminó.
7. **Las medallas no giran.** Se eliminan `rotateY` y cualquier reverso.
8. **Se trabaja en una rama**, nunca en `main`. La entrega es un ZIP completo de raíz plana, sin carpeta envolvente ni `node_modules`.
9. **Tecnología existente:** Vite, GSAP + ScrollTrigger y Lenis, ya inicializados por `initMedalShell()`. No se agregan librerías.
10. **`prefers-reduced-motion`:** se muestran los estados finales sin movimiento (detalle en cada sección).

### Elementos comunes que se reutilizan tal cual

- **Encabezado:** el componente `.site-header` existente (`src/css/header.css`, `src/js/modules/header.js`), con su menú móvil.
- **Botones:** `.button.button--primary`, negro en reposo con relleno amarillo (`buttons.css`, `buttons.js`).
- **Barrido amarillo:** el patrón aprobado BASE → AMARILLO → BASE con las dos capas `.yellow-sweep__base` y `.yellow-sweep__flash`. Se reproduce en cada reentrada.
- **Curvas:** `--ease-medal: cubic-bezier(.2,.8,.2,1)` y `--ease-fill: cubic-bezier(.6,0,.2,1)`.

---

## 1. Portada (`/index.html`)

### 1.1 Qué cambia

| Hoy | Nuevo |
|---|---|
| Sin encabezado, solo el logotipo | Encabezado común `.site-header` fijo sobre el video |
| Video, y debajo el mensaje con el formulario | Una sola escena fijada: el video se aleja hasta verse dentro del logotipo, que se vuelve el primer cuadro de Work |
| No hay camino hacia Work | Tres caminos: seguir bajando, el botón de la portada y «Work» del encabezado |

Se conserva: el video `assets/video/artech-classic-cars.mp4` con su póster, la etiqueta, el titular «A new Medal is in the making.» con «the making.» en amarillo y el control de sonido «Artech · Classic car collection · Sound off / Sound on».

**Formulario de la portada:** el prototipo aprobado no lo incluye. Por defecto se retira la sección `#contact` de la portada y el botón «Send inquiry →» pasa a apuntar a `/contact/`, donde ya existe el formulario. No se borra `css/styles.css` ni `js/main.js`; solo se dejan de usar los bloques del formulario. Si el usuario pide conservarlo, ver 1.7.

### 1.2 Estructura

```html
<header class="site-header" data-header>…componente común, sin enlace activo…</header>

<main>
  <section class="cover" data-cover>            <!-- alto: 460vh -->
    <div class="cover__stage">                  <!-- sticky; top:0; height:100svh; overflow:hidden -->
      <div class="cover__film"><video …actual…></video></div>
      <div class="cover__solid"></div>          <!-- hueso, opacidad 0 → 1 -->
      <svg class="cover__gate" aria-hidden="true">
        <defs>
          <mask id="cover-hole">
            <rect x="-10%" y="-10%" width="120%" height="120%" fill="#fff"/>
            <g data-cover-hole><!-- trazos de assets/logo-medal.svg, todos con fill="#000" --></g>
          </mask>
        </defs>
        <rect x="-5%" y="-5%" width="110%" height="110%" fill="#05060A" mask="url(#cover-hole)"/>
      </svg>
      <div class="cover__halos" aria-hidden="true"></div>

      <div class="cover__hero">                 <!-- etiqueta, h1, botón y sonido actuales -->
      <p class="eyebrow cover__work-eyebrow">Selected work · 2024–2026</p>
      <p class="cover__line">…frase de la sección 6…</p>
      <div class="cover__enter"><p class="eyebrow">…</p><span class="cover__bar"><i></i></span></div>
    </div>
  </section>
</main>
```

Orden de capas, de abajo hacia arriba: video, capa hueso, compuerta negra con el hueco del logotipo, halos, textos, encabezado.

### 1.3 El hueco con forma de logotipo

El negro es un rectángulo SVG con una máscara. El hueco de la máscara son los trazos del logotipo (`viewBox 0 0 640 200`), incluido el apóstrofe. Se anima el `transform` del grupo `data-cover-hole`.

Constantes en unidades del logotipo:

- Foco inicial (punto más ancho del trazo, en la «m»): `F = (112.67, 106)`, radio inscrito `r = 17.9`.
- Centro del logotipo: `C = (319, 96)`.

Por cuadro, con `W` y `H` el tamaño de la escena y `p` el avance de 0 a 1:

```js
const S1 = Math.min(W * (W < 700 ? 0.84 : 0.66), H * 1.5) / 640;       // escala final
const d  = Math.hypot(C.x - F.x, C.y - F.y);
const S0 = (Math.hypot(W, H) / 2 + d * S1) * 1.12 / F.r;                // escala inicial: el hueco cubre la pantalla
const t  = easeInOutCubic(ramp(p, 0.16, 0.60));
const s  = S0 * Math.pow(S1 / S0, t);                                   // interpolación exponencial
const tx = W / 2 - F.x * s - (C.x - F.x) * S1;
const ty = H / 2 - F.y * s - (C.y - F.y) * S1;
hole.setAttribute('transform', `translate(${tx} ${ty}) scale(${s})`);
```

`ramp(p,a,b) = clamp((p-a)/(b-a), 0, 1)`. Con `p = 0` no se ve negro: el hueco cubre toda la pantalla.

### 1.4 Línea de tiempo (un solo `ScrollTrigger`, `scrub`, sobre `.cover`)

| Avance `p` | Qué ocurre |
|---|---|
| 0 – 0,05 | Reposo. Video completo, textos y sombreado del video visibles. |
| 0,05 – 0,15 | Etiqueta, titular, botón y sonido salen: opacidad 1 → 0 y suben 30 px. |
| 0,16 – 0,60 | El hueco pasa de `S0` a `S1`. Primero se ve negro por los bordes, luego se lee «medal» con el video dentro. |
| 0,20 – 0,50 | El sombreado del video baja a 0. |
| 0,40 – 0,62 | Entran los halos (opacidad 0 → 1, `mix-blend-mode: screen`). |
| 0,50 – 0,60 | El logotipo pequeño del encabezado baja a opacidad 0, para no mostrar dos logotipos. |
| 0,58 – 0,64 | Entra la frase bajo el logotipo. |
| 0,70 – 0,75 | La frase sale por completo. |
| 0,72 – 0,82 | La capa hueso sube a opacidad 1: las letras quedan sólidas en `--bone`. |
| 0,80 – 0,86 | Entran «Selected work · 2024–2026» sobre el logotipo y el bloque de entrada abajo. |
| 0,86 – 0,995 | La línea amarilla de `.cover__bar` se llena (`scaleX` 0 → 1, origen izquierdo). |
| ≥ 0,995 | Navegar a `/work/`. |

Posiciones: la frase va en `top: calc(50% + min(19vw, 24vh))`; la etiqueta de Work en `top: calc(50% - min(17vw, 25vh))`; el bloque de entrada a `clamp(34px, 7vh, 70px)` del borde inferior, con la barra de `min(300px, 60vw)` × 2 px.

### 1.5 Entrada a Work

- **Por scroll:** al llegar a `p ≥ 0,995` se ejecuta `window.location.assign('/work/')` una sola vez. Si el visitante sube antes, la línea se vacía y no pasa nada.
- **Por botón de la portada:** desplaza con `lenis.scrollTo` hasta `p = 0,84` (logotipo sólido con la invitación visible). No navega solo.
- **Por «Work» del encabezado:** enlace normal a `/work/`.
- **Continuidad:** Work ya empieza con el logotipo grande y su zoom hacia el apóstrofe. El tamaño final del logotipo de la portada (`S1`) debe coincidir con el tamaño inicial de `.work-hero__brand`. Se ajusta `S1` en la portada; **no** se modifica `work-intro.js` ni `work.css`.
- **Regreso con el botón Atrás:** la portada debe abrir en `p = 0`. Usar `history.scrollRestoration = 'manual'` en esta página.

### 1.6 Teléfono y movimiento reducido

- **Teléfono:** misma escena. `S1` usa el 84 % del ancho. El encabezado usa su versión móvil. Se oculta el indicador «Scroll».
- **Movimiento reducido:** sin escena fijada. Se muestra el video con sus textos y, debajo, un bloque estático con el logotipo en hueso y un enlace a `/work/`.

### 1.7 Variante si se conserva el formulario

La sección `#contact` actual se coloca sin cambios después de `.cover`. En ese caso se elimina la navegación automática: la línea amarilla termina en un botón «Work» que enlaza a `/work/`.

---

## 2. Film & Services (`/film-services/index.html`)

### 2.1 Orden final de la página

| # | Sección | Estado |
|---|---|---|
| 1 | `film-hero`: video a pantalla completa que se vuelve pantalla de cine | **Sin cambios** |
| 2 | `reels`: «Made for the feed.» | **Rehecha:** tira en movimiento y visor a pantalla completa (sección 3) |
| 3 | Escena única de medallas | **Nueva:** reemplaza a `services-intro`, `medal-journey` y `plan-select` (sección 4) |
| 4 | Hilo del apóstrofe | **Nuevo:** reemplaza a `medal-cut` (sección 5) |
| 5 | `services-availability` | **Sin cambios** de contenido ni de diseño (sección 5.3) |

### 2.2 Qué se elimina

- `.medal-selector` dentro de `services-intro` (primera aparición de las medallas).
- `.journey-exposure` (destello y paso a hueso) y `.journey-direction` («How Medal works», los tres puntos de «sin riesgo»).
- `.plan-select` completo como sección aparte, incluida la segunda fila de medallas, «Select your plan.» y `.plan-select__decision`.
- `.medal-cut` (pantalla con el rombo) como pantalla propia. Sus dos frases se conservan en el hilo del apóstrofe.
- En `film-services.js` y `film-services.css`, el código que solo servía a lo anterior. El cambio de encabezado a negro sobre hueso deja de ser necesario en esta página.

Las tres imágenes `assets/img/film/medals/{bronze,silver,gold}-medal.png` aparecen **una sola vez** en el DOM.

---

## 3. Reels: tira en movimiento y visor

### 3.1 Datos

Crear `src/data/reels.json`. Cada entrada: `client`, `category`, `video`, `poster` y, opcional, `kpis` (lista de hasta tres pares `{ value, suffix, label }`).

- Se cargan los tres reels actuales (Artech · Classic cars, Fiesta · Hospitality, Kjolle · Food direction) con sus videos y pósteres actuales.
- Agregar un reel es agregar una entrada. **No se usan fotos como reels** ni se inventan cifras: las fotos «Footage pending» y los números del prototipo eran relleno.
- Si un reel no tiene `kpis`, el visor muestra solo cliente y categoría.

### 3.2 Tira

- Encabezado de la sección como hoy: etiqueta «Reels», titular «Made for the feed.» con barrido y el párrafo actual.
- Tarjetas 9:16, ancho `clamp(150px, 17vw, 236px)`, radio 14 px, separación 18 px. Dentro: video o póster, sombreado, cliente y categoría abajo, barra de 2 px arriba.
- **Movimiento automático:** de derecha a izquierda a **42 px por segundo**, en bucle continuo. El contenido se duplica (copias con `aria-hidden` y `tabindex="-1"`) y se repite el conjunto las veces necesarias para superar dos anchos de pantalla.
- Bordes de la tira desvanecidos con máscara: transparente → opaco al 6 % y al 94 %.
- **Se pausa** con el cursor sobre una tarjeta, con el visor abierto y con la pestaña oculta.
- `preload="none"`; el video se carga al acercarse a la pantalla.

### 3.3 Cursor sobre un reel

1. La tira se detiene.
2. La tarjeta crece a `scale(1.08)` en 0,45 s con `--ease-medal` y reproduce su video sin sonido. Las demás bajan a opacidad 0,42.
3. Su barra superior se muestra y **se llena de amarillo de forma lineal durante el tiempo de espera**.
4. Al completarse, el reel se abre solo. Si el cursor sale antes, la barra vuelve a cero y la tira sigue.

- Tiempo de espera: constante `REEL_DWELL_MS = 10000` (pedido del usuario; debe ser una sola constante fácil de cambiar).
- **Clic o Enter:** abre de inmediato.
- **Teléfono:** no hay espera; un toque abre.

### 3.4 Visor a pantalla completa

Es un diálogo (`role="dialog"`, `aria-modal="true"`) sobre toda la página.

**Apertura (0,62 s, `--ease-medal`):** el reel crece **desde el rectángulo que ocupaba en la tira** hasta su posición final (técnica FLIP con `transform`). A la vez, el fondo pasa a `#000` opaco en 0,45 s. Las columnas laterales entran 0,35 s después, con 0,5 s de opacidad y 14 px de subida.

**Escritorio, tres columnas centradas en vertical:**

| Izquierda | Centro | Derecha |
|---|---|---|
| Etiqueta «Reel · categoría», nombre del cliente y las cifras, una por fila con línea superior | Reel 9:16, alto `min(92dvh, 880px)`, radio 18 px, barra de avance arriba | Botón «Replay», flechas anterior y siguiente |

Arriba a la derecha, botón circular **✕** de 46 px.

**Cifras:**

- Cada cifra cuenta de 0 a su valor en 1,5 s con salida cúbica, con 260 ms de desfase entre una y otra.
- Mientras cuenta está en **amarillo**; 350 ms después de terminar **vuelve a blanco** con una transición de 0,9 s.
- Números tabulares. Se reinician en cada apertura, en cada «Replay» y al cambiar de reel.

**Controles:**

- **Replay:** reinicia el video y las cifras. Se puede repetir sin límite. El video queda en bucle.
- **Flechas** y teclas ← →: reel anterior o siguiente dentro del visor.
- **✕ y Esc:** cierre. El reel se encoge en 0,5 s con `--ease-fill` hasta su lugar en la tira, el fondo se aclara, se libera el scroll y el foco vuelve a la tarjeta. La página queda en el mismo punto.
- Al abrir: bloquear el scroll (`lenis.stop()`), llevar el foco a ✕ y mantenerlo dentro del visor. Al cerrar: `lenis.start()`.

**Teléfono:** el reel ocupa toda la pantalla. Cliente y cifras van abajo, en una fila de tres, sobre un degradado negro. «Replay» y las flechas en la última fila. ✕ arriba a la derecha.

**Movimiento reducido:** la tira no avanza sola y se desplaza con scroll horizontal. El visor abre y cierra sin transición y las cifras se muestran en su valor final.

---

## 4. Escena única de medallas

Una sección fijada donde **las mismas tres medallas** asoman, suben, pasan al frente una por una y terminan ordenadas en tres tarjetas. No se duplica ninguna medalla ni ningún dato.

### 4.1 Estructura

```html
<section class="medals" data-medals>              <!-- alto: 560vh -->
  <div class="medals__stage">                     <!-- sticky; top:0; height:100svh; overflow:hidden -->
    <div class="medals__title">…eyebrow «Services» + «Three medals. / One standard.»…</div>

    <div class="medals__spot" data-spot="bronze">…label, título, lead…</div>
    <div class="medals__spot" data-spot="silver">…</div>
    <div class="medals__spot" data-spot="gold">…</div>

    <div class="medals__cards">
      <p class="eyebrow">Choose your Medal</p>
      <div class="medals__grid">
        <article class="medal-card" data-card="bronze"><span class="medal-card__slot"></span>…</article>
        <article class="medal-card" data-card="silver">…</article>
        <article class="medal-card medal-card--gold" data-card="gold">…</article>
      </div>
    </div>

    <button class="medals__medal" data-medal="bronze"><img src="…/bronze-medal.png" alt=""></button>
    <button class="medals__medal" data-medal="silver">…</button>
    <button class="medals__medal" data-medal="gold">…</button>

    <div class="medals__index"><span><b>01</b> / 03</span><i></i></div>
  </div>
</section>
```

Las medallas son hijas directas de la escena, con posición absoluta. Se mueven con `translate3d` y `scale` sobre una base de 100 × 100 px. `medal-card__slot` es un hueco vacío que marca dónde aterriza cada medalla.

### 4.2 Poses

`W` y `H` son el tamaño de la escena; `i` es 0 Bronze, 1 Silver, 2 Gold. Cada pose define el centro `(x, y)`, el diámetro `s` y la opacidad `o`.

| Pose | Escritorio | Teléfono (`W < 820`) |
|---|---|---|
| **Asomada** | `s = H·[0,34 · 0,41 · 0,50]`; `x = W·[0,40 · 0,545 · 0,71]`; `y = H + 0,04·s` | `s = W·[0,34 · 0,40 · 0,48]`; `x = W·[0,20 · 0,50 · 0,82]`; `y = H + 0,04·s` |
| **Arriba** | igual, con `y = H − 0,20·s` | igual, con `y = H − 0,20·s` |
| **Al frente** (la activa) | `s = min(0,58·H, 0,36·W)`; `x = 0,29·W`; `y = 0,54·H` | `s = min(0,60·W, 0,34·H)`; `x = 0,50·W`; `y = 0,33·H` |
| **En espera** (las otras dos) | `s = 0,105·H`; abajo a la derecha, a 60 px del borde derecho y 34 px del inferior, separadas `1,3·s`; `o = 0,5` | `s = 0,12·W`; arriba a la derecha, a 18 px del borde y a 86 px del superior, separadas `1,2·s`; `o = 0,5` |
| **En tarjeta** | centro y ancho del `medal-card__slot` de su tarjeta, leídos con `getBoundingClientRect()` | igual |

Las medallas se superponen en el orden Bronze, Silver, Gold (Gold delante), como en la imagen de referencia. Llevan `drop-shadow(0 22px 34px rgba(0,0,0,.55))`.

### 4.3 Línea de tiempo (`ScrollTrigger` con `scrub` sobre `.medals`)

| Avance `p` | Paso | Qué ocurre |
|---|---|---|
| 0 – 0,04 | Asoman | Titular arriba (`top: 15%`, centrado). Las tres medallas cortadas por el borde inferior. |
| 0,04 – 0,14 | Suben una tras otra | De «asomada» a «arriba» con desfase: cada medalla usa `clamp((t − i·0,22) / 0,56, 0, 1)`. «One standard.» **se rellena de amarillo de izquierda a derecha** según `ramp(p, 0,02, 0,14)`. |
| 0,14 – 0,20 | Pausa | Las tres arriba, con el logotipo visible. |
| 0,19 – 0,24 | | El titular sale: opacidad 1 → 0. |
| 0,20 – 0,28 | Bronze al frente | Bronze va a «al frente»; Silver y Gold a «en espera». |
| 0,28 – 0,38 | Pausa Bronze | Texto de Bronze visible. Índice «01 / 03». |
| 0,38 – 0,46 | Silver al frente | Bronze vuelve a «en espera» y Silver toma el frente. |
| 0,46 – 0,56 | Pausa Silver | Índice «02 / 03». |
| 0,56 – 0,64 | Gold al frente | |
| 0,64 – 0,74 | Pausa Gold | Índice «03 / 03». El fondo sigue negro con halos. |
| 0,74 – 0,86 | Viajan a su tarjeta | Las tres se encogen y van a su hueco. Las tarjetas entran de izquierda a derecha: opacidad `ramp(p, 0,79 + 0,02·i, 0,86 + 0,02·i)` y 24 px de subida. |
| 0,86 – 1 | Tarjetas | Estado final en reposo. |

Todos los tramos de movimiento usan `easeInOutCubic`.

**Texto de cada medalla (fundido completo, sin mezcla):** con pausa `[a, b]`, la opacidad es `ramp(p, a − 0,035, a) × (1 − ramp(p, b, b + 0,035))`. El texto anterior llega a 0 antes de que empiece a entrar el siguiente. Al superar opacidad 0,5 se dispara el barrido amarillo de su título, que termina en blanco, y se rearma cuando la opacidad vuelve a 0.

- Escritorio: bloque a la derecha, desde `left: 54%`, centrado en vertical. Título en `clamp(52px, 8.6vw, 132px)`.
- Teléfono: bloque abajo, a un 16 % del borde inferior.

**Índice y barra:** visibles entre `p = 0,24` y `0,78`, abajo a la izquierda. La barra de 120 px se llena con `ramp(p, 0,26, 0,74)`.

### 4.4 Interacción

- **Clic en una medalla** mientras `p < 0,78`: `lenis.scrollTo` hasta `p = inicio de su pausa + 0,04` (Bronze 0,32, Silver 0,50, Gold 0,68).
- Con `p > 0,78` las medallas son decorativas: `pointer-events: none` y `tabindex="-1"`.
- Sin efecto de giro. Opcional al pasar el cursor: subir 6 px.

### 4.5 Tarjetas (estado final)

Tres tarjetas iguales en fila, radio 22 px, borde de 1 px `rgba(242,239,232,.3)`, fondo `rgba(5,6,10,.45)`. La de Gold en `--bone` con texto `--ink` y la etiqueta «Most complete».

De arriba abajo en cada tarjeta: hueco de la medalla (`clamp(56px, 6vw, 84px)`), nombre, texto descriptivo, lista con marcas ✓ amarillas (sin marcas en Gold) y botón. El contenido sale del repositorio (sección 6).

Teléfono: tarjetas apiladas en versión compacta, con la medalla a la izquierda (54 px), nombre y texto a la derecha, sin lista, y el botón a todo el ancho. Las tres deben caber en `100svh`.

### 4.6 Movimiento reducido

Sin escena fijada: se muestra el titular y, debajo, las tres tarjetas con su medalla ya en el hueco.

---

## 5. Hilo del apóstrofe y cierre

### 5.1 Hilo

Sección de `86vh`, sin fijar, negra con halos. Reemplaza a la pantalla del rombo.

- **Apóstrofe:** el polígono amarillo del logotipo (`points="257.48 37.66 218.21 15.57 226.97 0 257.48 17.16 287.98 0 296.74 15.57 257.48 37.66"`), de 54 px de ancho y centrado. Baja con el scroll: `translateY(t × (86vh − 40px))`.
- **Línea:** 2 px de ancho, amarilla, centrada, desde el borde superior hasta el apóstrofe: `scaleY(t)` con origen arriba.
- **Avance:** `t = clamp((0,72·vh − top de la sección) / alto de la sección, 0, 1)`.
- **Frases laterales:** las dos de `medal-cut`, una a cada lado, a media altura y separadas `clamp(40px, 7vw, 110px)` de la línea. Opacidad `ramp(t, 0,25, 0,45) × (1 − ramp(t, 0,8, 0,95))`.
- La sección lleva `aria-hidden="true"`: es un adorno de transición.

### 5.2 Llegada

El apóstrofe termina justo sobre la etiqueta del cierre. Cuando el titular del cierre entra en el 78 % superior de la pantalla, recibe el barrido amarillo estándar (1,5 s) y termina en su color base. Se rearma al salir de la pantalla.

### 5.3 Cierre

`services-availability services-availability--dark` queda **idéntico**: etiqueta de disponibilidad, «4 of 6 slots in motion.», «2 monthly positions remain open.» y el botón «Book your Medal Session →», con los datos de `site.json`. Solo cambia lo que lo precede.

---

## 6. De dónde sale cada texto

| Elemento | Fuente en el repositorio |
|---|---|
| Portada: etiqueta, titular, botón, sonido | `index.html` actual |
| Portada: «Selected work · 2024–2026» | `work/index.html`, `data-work-copy` |
| Reels: etiqueta, titular, párrafo | `film-services/index.html`, `.reels__heading` |
| Reels: cliente y categoría | `.reel-card__meta` actuales → `reels.json` |
| Medallas: «Services» y «Three medals. / One standard.» | `.services-intro` |
| Medallas al frente: etiqueta, título y lead | objeto de servicios de `film-services.js` (`label`, `title`, `lead`) |
| Tarjetas: «Choose your Medal» | `.plan-select__heading` |
| Tarjetas: nombre, subtítulo y texto | `.plan-card__eyebrow`, `h3` y `.plan-card__copy` |
| Tarjetas: lista | `list` de cada servicio en `film-services.js` |
| Tarjetas: botón | «Start with Bronze / Silver / Gold», enlace a `/contact/` |
| Hilo: dos frases | `.medal-cut__note--left` y `--right` |
| Cierre | `.services-availability` y `site.json` |

**Textos nuevos que los prototipos aprobados introducen** (no existen en el repositorio; confirmar redacción con el usuario antes de publicar):

| Dónde | Texto |
|---|---|
| Portada, bajo el logotipo | «Every frame you just saw was directed by Medal.» |
| Portada, invitación | «Keep scrolling to enter Work» |
| Reels, ayuda | «Rest on a reel and it opens full screen, or select it to open now.» |
| Visor | «Replay», etiquetas de las cifras |
| Tarjeta Gold | «Most complete» |

**Relleno de los prototipos que no se usa:** el titular «Made to be looked at twice.», los plazos de 3, 6 y 10 semanas, las listas de entregables con cantidades, las cifras de ejemplo y las cinco fotos usadas como reels.

---

## 7. Archivos que se tocan

| Archivo | Cambio |
|---|---|
| `index.html` | Encabezado común y escena `.cover`; se retira la sección del formulario |
| `css/styles.css`, `js/main.js` | Estilos y lógica de `.cover`; sonido sin cambios. Alternativa válida: mover la portada a `src/` como las demás páginas, sin alterar su aspecto |
| `film-services/index.html` | Nueva estructura de las secciones 3, 4 y 5 |
| `src/css/pages/film-services.css` | Estilos nuevos; retirar los de lo eliminado |
| `src/js/modules/film-services.js` | Tira, visor, escena de medallas, hilo; retirar lo eliminado. `film-hero` intacto |
| `src/data/reels.json` | Nuevo |
| `vite.config.js` | Solo si la portada se mueve a `src/` |

---

## 8. Lista de aceptación

**Portada**

- [ ] El encabezado común se ve sobre el video, con «Book a session».
- [ ] Con `p = 0` no se ve negro; el video ocupa toda la pantalla y el sonido funciona como hoy.
- [ ] Al bajar, el video queda visible solo dentro de «medal»; luego las letras quedan en hueso.
- [ ] La línea amarilla se llena al bajar y se vacía al subir. Solo al completarse abre `/work/`.
- [ ] El salto a Work no muestra cambio de tamaño ni de posición del logotipo.
- [ ] `work-intro.js` y `work.css` no tienen cambios.

**Reels**

- [ ] La tira avanza sola a 42 px/s, sin saltos en el bucle, y se pausa con el cursor encima.
- [ ] La barra amarilla se llena durante la espera y el reel se abre al completarse; con clic abre de inmediato.
- [ ] El reel crece desde su lugar; el fondo queda negro total.
- [ ] Las cifras cuentan en amarillo y vuelven a blanco.
- [ ] «Replay» funciona sin límite; ✕ y Esc devuelven al mismo punto de la página.
- [ ] No hay fotos como reels ni cifras inventadas.

**Medallas**

- [ ] Cada medalla existe una sola vez en el DOM y ninguna gira.
- [ ] Empiezan cortadas por el borde inferior y suben Bronze, Silver, Gold.
- [ ] Cada una pasa al frente con su título; el texto anterior desaparece antes de que entre el siguiente.
- [ ] Terminan en el hueco de su tarjeta; las tarjetas están en una fila.
- [ ] El fondo es negro con halos en toda la escena.
- [ ] No existen «How Medal works», «Select your plan.», la pantalla del rombo ni ninguna pantalla en hueso.

**Cierre y general**

- [ ] El apóstrofe baja con el scroll y dispara el barrido del titular del cierre.
- [ ] El cierre conserva «4 of 6 slots in motion.», «2 monthly positions remain open.» y su botón.
- [ ] Todos los textos e imágenes coinciden con los del repositorio, salvo los de la tabla de textos nuevos.
- [ ] Todo retrocede al subir y nada se anima fuera de la pantalla.
- [ ] Funciona a 390 px de ancho sin scroll horizontal.
- [ ] Con movimiento reducido se ven los estados finales.
- [ ] Work y Contact se comportan igual que antes.
