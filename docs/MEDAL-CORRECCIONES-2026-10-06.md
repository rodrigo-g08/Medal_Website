# Medal · Correcciones del 6 de octubre de 2026

Documento de trabajo para quien continúe el rediseño de medalusa.com (persona o IA).
Reúne las observaciones recibidas el 6 de octubre, lo que ya está resuelto en la copia
de trabajo, lo que falta y las decisiones que siguen abiertas.

> **Estado al cierre del 6 de octubre (plugin 1.3.1).** Lo que sigue en este documento es el
> registro de la ronda; el estado final es este:
> - **Work:** cinco marcas con las fotografías del cliente, en este orden: Cabo Merlín, Züb Zero,
>   Artech, Fiesta y Picantería. Kjolle sale de los casos. Rótulo «Five brands · Four sectors».
>   Esto reemplaza lo que dice la sección 5.
> - **Medallas (3.6):** aplicado y luego bajado un poco: flotación de 12 %, giro de ±2,6°,
>   inclinación de hasta 9°, ciclos de 5,2 a 6,8 s. `measure()` impide que toquen el título
>   (bajan o se achican) y el texto de cada plan aparece cuando su medalla ya llegó
>   (medallas `0,46 → 0,78`, tarjetas desde `0,75`). Sin inclinación hacia el cursor.
> - **Celular y iPad (4.2):** resuelto salvo la prueba en equipos reales.
> - **Pendiente:** sección 6 (optimizar el video de portada).

---

## 0. Contexto mínimo

| Dato | Valor |
|---|---|
| Repositorio | `rodrigo-g08/Medal_Website`, rama `rediseno-sitio` |
| Base de la que se parte | ZIP `Medal_Website-MASTER-2026-10-05-PORTADA-WORK-UNIFICADO-v3.zip` + plugin `medal-site` 1.2.0 (ya publicado en medalusa.com) |
| Tecnología | Vite 8 multipágina, GSAP + ScrollTrigger, Lenis, sin framework |
| Páginas | `/` (portada + Work en una sola página), `/film-services/`, `/contact/`, `/contact/confirmed/`. `/work/` redirige a `/#work` |
| Publicación | Plugin de WordPress `medal-site` (se compila con `wordpress/build-plugin.mjs`). Elementor ya no sirve la portada |
| Entrega | ZIP de raíz plana que se descomprime sobre el repositorio. No se hace push |

### Reglas que no se negocian

1. **No cambiar contenido**: ni textos, ni imágenes, ni orden de secciones, salvo lo que este documento pide de forma expresa.
2. **No tocar lo que no se pidió.** La versión de escritorio está aprobada; todo ajuste de celular o tablet va dentro de `@media` para que el escritorio no cambie.
3. Trabajar en rama, nunca en `main`.
4. Respetar `prefers-reduced-motion`: toda animación nueva debe apagarse ahí.
5. Las animaciones solo usan `transform` y `opacity` (nada de animar `top`, `width`, `filter` ni `box-shadow`).

---

## 1. Tipografía de Film & Services: letra demasiado condensada

**Observación.** «Las fuentes están muy condensadas en la parte de Film».

**Causa.** Los títulos de Work usan la fuente variable Archivo con `font-stretch: 112%`.
Los de Film & Services no declaran ancho (quedan en 100 %) y además llevan
`letter-spacing` de `-.055em` a `-.065em`, por lo que las letras casi se tocan.

**Corrección.** Igualar el ancho de letra al de Work y soltar el espaciado. Archivo:
`src/css/pages/film-services.css` (bloque al final del archivo).

```css
.film-hero__opening h1,
.film-hero__cinema-copy h2,
.reels__heading h2,
.reel-viewer__meta h2,
.medals__title h2,
.medal-card h3,
.blueprints__heading h2,
.blueprint__name,
.services-availability h2 {
  font-stretch: 112%;
  letter-spacing: -.038em;
}
.film-hero__opening h1 { letter-spacing: -.045em; line-height: .86; }

.reels__intro,
.blueprints__intro,
.blueprint__copy,
.medal-card__copy,
.apostrophe-thread__note p { letter-spacing: -.008em; }
```

**Efecto secundario a vigilar.** La letra más ancha ocupa cerca de 10 % más. «Every
frame, directed.» pasaba a tres líneas; se resolvió ensanchando su columna
(`.film-hero__cinema-copy { width: min(38vw, 620px); }`). Revisar que ningún título
se parta de forma rara en 390, 820, 1180 y 1440 px de ancho.

**Estado:** hecho en la copia de trabajo. Falta revisión en tablet.

---

## 2. Apertura de Film: todo queda muy abajo, «como si fuese a salir»

**Observación.** El título «Film», su rótulo y el botón de sonido quedan pegados o
cortados contra el borde inferior de la pantalla.

**Causa.** El marco del video (`.film-hero__frame`) mide
`100svh + 2 × var(--header-height)` y está centrado, de modo que sobresale 92 px por
debajo de la pantalla. Los textos se posicionan con `bottom` respecto de ese marco y
no descuentan ese sobrante. La altura de línea de `.78` del título recorta aún más.

**Corrección.** Mismo archivo, mismo bloque final.

```css
.film-hero__opening { bottom: calc(var(--header-height) + clamp(96px, 15vh, 170px)); }
.film-hero__cinema-copy { bottom: clamp(96px, 14vh, 150px); width: min(38vw, 620px); }

@media (min-width: 821px) {
  .film-sound { bottom: calc(var(--header-height) + clamp(96px, 15vh, 170px)); }
}
@media (max-width: 820px) {
  .film-hero__opening { bottom: calc(var(--header-height) + 150px); }
  .film-hero__cinema-copy { bottom: 84px; }
  /* En celular el botón de sonido va arriba a la derecha del video,
     para que no tape «Every frame, directed.» */
  .film-sound { top: calc(var(--header-height) + 76px); right: 14px; bottom: auto; }
}
```

**Criterio de aceptación.** En 1440×820, 1180×820, 820×1180 y 390×844 el título «Film»
se ve completo, con aire por debajo, y el botón de sonido no pisa ningún texto en
ningún punto del scroll de la apertura.

**Estado:** hecho en escritorio y celular. Falta comprobar tablet.

---

## 3. Medallas nuevas

**Observación.** «La parte de las medallas cámbialas a esta. Fluidez y movimiento. No
que estén estáticas».

### 3.1 Imágenes

Se reemplazan las tres monedas por las tres piezas recibidas: el apóstrofe de Medal
en metal (bronce, plata, oro), vistas en tres cuartos.

- Los originales llegaron como JPEG de 1254×1254 con fondo azul. Se recortaron con un
  contorno geométrico (la pieza es un polígono de 8 vértices, idéntico en las tres) y
  se guardaron con transparencia.
- Archivos nuevos en `assets/img/film/medals/`:
  `bronze-chevron.webp`, `silver-chevron.webp`, `gold-chevron.webp`
  (1101×641 px, entre 30 y 40 KB cada uno).
- Los PNG anteriores (`*-medal.png`, 2,4 MB cada uno) dejan de usarse. El cambio quita
  unos 7 MB de la carga de la página.

Vértices del contorno sobre el original de 1254 px, por si hay que rehacer el recorte:
`(237,330) (631,591) (1021,366) (1144,516) (1144,601) (630,911) (103,546) (103,449)`.

### 3.2 Marcado

`film-services/index.html`, dentro de `<section class="medals">`. Cada botón pasa de
contener solo la imagen a:

```html
<button class="medals__medal" data-medal="gold" type="button" aria-label="Gold Medal: see the plans">
  <span class="medals__float">
    <img src="/assets/img/film/medals/gold-chevron.webp" alt="" width="1101" height="641" />
    <span class="medals__sheen" aria-hidden="true"></span>
  </span>
</button>
```

Tres capas, cada una con un trabajo distinto, para que los movimientos no se pisen:

| Capa | Quién la mueve | Para qué |
|---|---|---|
| `.medals__medal` (botón) | GSAP, según el scroll | Posición, tamaño y opacidad de la coreografía |
| `.medals__float` | Animación CSS continua | Flotación |
| `img` y `.medals__sheen` | CSS | Realce al pasar el cursor y brillo |

### 3.3 Coreografía con el scroll

`src/js/modules/film-services.js`, función `measure()` y `stateAt(p)`. La secuencia no
cambia: asoman → suben una tras otra → viajan directo a su tarjeta. Solo cambian las
poses, porque la pieza ya no es redonda. `s` es el **ancho** de la medalla; el alto es
`0,582 × s`.

```js
const sizes = mobile
  ? [0.46, 0.54, 0.64].map((k) => W * k)
  : [0.25, 0.30, 0.37].map((k) => Math.min(W * k, H * k * 1.9));
const upX = mobile ? [0.5, 0.5, 0.5] : [0.235, 0.485, 0.765];
const upY = mobile ? [0.50, 0.645, 0.81] : [0.765, 0.735, 0.69];
const up = SERVICES.map((_, i) => ({ x: W * upX[i], y: H * upY[i], s: sizes[i], o: 1 }));
const peek = up.map((pose) => ({ ...pose, y: H + 0.17 * pose.s }));
```

- **Escritorio:** en fila, de menor a mayor (bronce, plata, oro), el oro más alto.
- **Celular (ancho < 820 px):** apiladas en vertical como galones, bronce arriba y oro
  abajo.
- Tramos de progreso sin cambios: suben `0,06 → 0,34`, se sostienen hasta `0,46`,
  viajan a las tarjetas `0,46 → 0,84`.

### 3.4 Espacio en las tarjetas

El hueco donde aterriza cada medalla (`.medal-card__slot`) deja de ser cuadrado:

```css
.medal-card__slot { width: clamp(88px, 7.4vw, 118px); aspect-ratio: 1101 / 641; margin-bottom: 26px; }
@media (max-width: 820px) { .medal-card__slot { width: 54px; margin: 0; } }
```

### 3.5 Movimiento actual

```css
.medals__float { animation: medalFloat 7.5s ease-in-out infinite; will-change: transform; }
.medals__medal[data-medal="silver"] .medals__float { animation-duration: 8.6s; animation-delay: -2.4s; }
.medals__medal[data-medal="gold"]   .medals__float { animation-duration: 9.4s; animation-delay: -5.1s; }

@keyframes medalFloat {
  0%   { transform: translate3d(0, 0, 0) rotate(0deg); }
  25%  { transform: translate3d(1.2%, -4.5%, 0) rotate(-1.6deg); }
  50%  { transform: translate3d(0, -7%, 0) rotate(0deg); }
  75%  { transform: translate3d(-1.2%, -3.5%, 0) rotate(1.4deg); }
  100% { transform: translate3d(0, 0, 0) rotate(0deg); }
}

/* Brillo: un degradado que cruza la pieza, recortado con la propia imagen */
.medals__sheen {
  position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(112deg, transparent 38%, rgba(255,255,255,0) 42%,
              rgba(255,255,255,.62) 50%, rgba(255,255,255,0) 58%, transparent 62%) no-repeat;
  background-size: 260% 100%; background-position: 130% 0;
  mix-blend-mode: soft-light;
  -webkit-mask: var(--medal-mask) center / contain no-repeat;
          mask: var(--medal-mask) center / contain no-repeat;
  animation: medalSheen 5.6s cubic-bezier(.45,.05,.35,1) infinite;
}
.medals__medal[data-medal="gold"] { --medal-mask: url("../../../assets/img/film/medals/gold-chevron.webp"); }
/* …igual para bronze y silver */
```

**Estado:** hecho, pero el movimiento resultó demasiado discreto. Ver 3.6.

### 3.6 PENDIENTE · Más movimiento cuando las medallas ya subieron

**Observación nueva.** «Que tengan un poquito más de movimiento una vez ubicadas hacia
arriba, o sea que floten y se muevan un poquito más, porque apenas noto el movimiento
o la fluidez».

**Diagnóstico.** La flotación actual recorre 7 % del alto de la pieza en 7,5 a 9,4 s y
gira ±1,6°. En una medalla de 360 px de ancho eso son unos 15 px en casi 4 s: se lee
como quieta. El brillo usa `soft-light`, que sobre metal claro casi no se nota.

**Qué hacer.** El aumento aplica sobre todo al estado «arriba» (progreso `0,34 → 0,46`
y mientras el visitante se detenga ahí). Dentro de las tarjetas el movimiento debe
seguir siendo suave para no distraer de la lectura.

1. **Más recorrido y más ritmo en la flotación.** Valores de partida, a afinar a ojo:

   | Parámetro | Ahora | Propuesto (arriba) | En tarjeta |
   |---|---|---|---|
   | Subida y bajada | 7 % | 14 – 18 % | 6 % |
   | Vaivén lateral | ±1,2 % | ±3 % | ±1 % |
   | Giro (`rotate`) | ±1,6° | ±4 – 5° | ±1,5° |
   | Duración del ciclo | 7,5 – 9,4 s | 4,2 – 5,6 s | 7 – 9 s |

   Mantener duraciones y desfases distintos en cada medalla para que nunca se muevan
   a la vez.

2. **Sensación de volumen.** Añadir una inclinación leve en 3D en la misma animación:
   `perspective` en `.medals__medal` (unos `900px`) y, en los fotogramas clave,
   `rotateX(±6deg) rotateY(±8deg)`. Es lo que más ayuda a que el metal «respire».

3. **Brillo más visible.** Cambiar `mix-blend-mode` de `soft-light` a `screen` o
   `plus-lighter`, con opacidad máxima cercana a `.45`, y acortar el ciclo a unos
   3,8 s. Probar en la tarjeta de oro, que tiene fondo claro, para que no queme.

4. **Respuesta al visitante (opcional, recomendado).** En equipos con cursor
   (`@media (hover: hover) and (pointer: fine)`), inclinar las tres medallas hacia la
   posición del cursor: hasta ±8° con suavizado (`gsap.quickTo`, duración 0,6 s). En
   celular no usar giroscopio.

5. **Cómo graduar la intensidad según el estado.** Exponer una variable CSS desde el
   `update(p)` de `film-services.js` y usarla como multiplicador, en vez de tener dos
   animaciones:

   ```js
   // 1 cuando están arriba, baja a 0,35 al llegar a las tarjetas
   const lively = 1 - 0.65 * ramp(p, 0.46, 0.84);
   stage.style.setProperty("--medal-lively", lively.toFixed(3));
   ```
   ```css
   @keyframes medalFloat {
     50% { transform: translate3d(0, calc(-16% * var(--medal-lively, 1)), 0)
                      rotate(calc(4deg * var(--medal-lively, 1))); }
   }
   ```

**Límites.**
- Las medallas no deben tocar el título «Three medals. One standard.» ni salir de la
  pantalla en el punto más alto del vaivén. Si hace falta, bajar `upY` unas centésimas.
- Sin movimiento con `prefers-reduced-motion: reduce` (ya está contemplado; mantenerlo).
- Solo `transform` y `opacity`. Verificar 60 cuadros por segundo en un celular de gama
  media.

**Criterio de aceptación.** Con la página quieta en el estado «arriba», el movimiento
se percibe a simple vista en menos de dos segundos, en escritorio y en celular, sin
verse nervioso ni mecánico.

---

## 4. Adaptación a celular y iPad

**Pedido.** Que todo el sitio se vea y se anime bien en celular y iPad, sin
ralentizar. El escritorio está aprobado y no se toca.

### 4.1 Ya corregido en la copia de trabajo

| Problema | Causa | Corrección |
|---|---|---|
| En Film & Services el botón de menú y «Book a session» quedaban fuera de pantalla | Los halos azules (`::before` / `::after` de `.reels`, `.medals`, `.apostrophe-thread`, `.services-availability`) miden mínimo 420 px y sobresalen `-12vw`; la página se ensanchaba 13 – 15 % | `overflow-x: clip` en esas cuatro secciones. No usar `hidden`: rompería el `position: sticky` de las medallas |
| «Skip to photos» se montaba sobre el nombre de la marca (Kjolle, Artech…) | Estaba centrado abajo, donde cae el título en pantallas angostas | Hasta 1100 px pasa a la derecha (`right`, `bottom: 78px`); hasta 720 px, `right: 8px; bottom: 22px`. Archivo `src/css/pages/work-cases.css` |
| Botón de sonido de Film sobre el título | Ver sección 2 | Ver sección 2 |
| Con un reel abierto a pantalla completa, el header seguía encima | El header tiene más `z-index` que el visor | Hasta 820 px, o celular en horizontal: `body:has(.reel-viewer.is-open) .site-header { opacity: 0; pointer-events: none; }` |
| Celular en horizontal: visor de reels cortado y menú con líneas montadas | No había reglas para poca altura | Reglas `@media (max-height: 520px) and (orientation: landscape)` en `film-services.css` y `src/css/header.css` |
| Saltos de la página al aparecer o esconderse la barra del navegador | ScrollTrigger recalculaba las escenas en cada cambio de alto | `ScrollTrigger.config({ ignoreMobileResize: true })` en `src/js/modules/smooth-scroll.js` |

### 4.2 Pendiente

- **Volver a recorrer todo** después de estos cambios: `/`, `/film-services/`,
  `/contact/` y `/contact/confirmed/` en 360×640, 390×844, 820×1180, 1180×820 y
  844×390. La última pasada de verificación quedó interrumpida.
- **Tarjetas de planes en iPad vertical**: quedan muy anchas, con texto pequeño y
  botón de lado a lado. Evaluar dos columnas o un ancho máximo.
- **Header sobre el contenido**: en celular el texto pasa por debajo del logo sin
  ningún fondo. Evaluar un degradado sutil solo en pantallas angostas.
- **Comprobar en equipos reales** (iPhone con Safari, Android con Chrome, iPad): las
  capturas automáticas no detectan tirones ni el comportamiento de la barra del
  navegador.
- Confirmar que el escritorio (1440 y 1920 px) quedó idéntico, salvo lo pedido en las
  secciones 1 a 3.

---

## 5. Work: una fotografía por marca

**Observación.** «Luego se agregarán 3 por marca en Work como galería, pero por ahora
1 para el Work. Menos la de Züb Zero… así que solo mantengamos la de Kjolle».

**Estado: NO se tocó. Falta una decisión.** Hoy Work ya muestra una sola fotografía
por marca, en este orden: Kjolle, Artech, Züb Zero, Fiesta, Food Freaks. La frase
admite dos lecturas y hay que confirmar cuál es:

- **A.** Quitar solo Züb Zero y dejar cuatro marcas.
- **B.** Dejar únicamente Kjolle.

Al aplicar cualquiera de las dos:

- Los casos se arman en `src/js/modules/work-cases.js` a partir de `src/data/cases.json`; el contador se calcula solo con la cantidad de casos.
- Actualizar el rótulo «Five brands · Four sectors» (`index.html`), que
  dejaría de ser cierto. Ese cambio de texto debe aprobarlo el cliente.
- La duración del tramo fijado depende del número de casos (`totalDuration`);
  comprobar que no quede scroll vacío.
- Revisar si Züb Zero debe salir también de la franja de logos («Selected brands») y
  de «More than a portfolio».
- **Más adelante:** galería de 3 fotografías por marca. No diseñar todavía; solo no
  cerrar la puerta en la estructura de datos (que cada caso acepte una lista de
  imágenes).

---

## 6. Video de portada

- El video nuevo está en la biblioteca de WordPress:
  `https://medalusa.com/wp-content/uploads/Website-Corto.mp4`. Pesa **145 MB**; el
  anterior optimizado pesaba 9,9 MB.
- **Dónde se cambia el enlace:** WordPress → Ajustes → Medal Site → «Dirección del
  video». Editar la página en Elementor ya no tiene efecto, porque la portada la sirve
  el plugin. Si el video ya no es el de RIMAC, cambiar también «Rótulo del botón de
  sonido».
- **Pendiente:** recodificarlo para web. Hace falta el archivo original. Referencia de
  lo usado la vez anterior: H.264, 1080p, 30 cuadros por segundo, sin pérdida visible,
  con «fast start» (`-movflags +faststart`) y objetivo de 8 a 12 MB. Subir el
  resultado a la biblioteca y pegar su enlace en el mismo campo.

---

## 7. Decisiones abiertas

1. Work: opción A o B (sección 5).
2. Intensidad final del movimiento de las medallas: validar con el cliente sobre un
   video, no sobre capturas (sección 3.6).
3. Archivo fuente de `Website-Corto.mp4` para optimizarlo (sección 6).
4. Siguen provisionales de rondas anteriores: «Also directed by Medal.», las tres
   descripciones de servicios, «Drawn to brief», «Skip to photos», y la frase
   «2 monthly positions remain open.» de Film & Services.

---

## 8. Archivos tocados en esta ronda

```
film-services/index.html                 marcado de las tres medallas
src/css/pages/film-services.css          tipografía, altura de apertura, medallas, ajustes móviles
src/css/pages/work-cases.css             posición de «Skip to photos» en celular y tablet
src/css/header.css                       menú en celular horizontal
src/js/modules/film-services.js          poses de las medallas en measure()
src/js/modules/smooth-scroll.js          ignoreMobileResize
assets/img/film/medals/*-chevron.webp    tres imágenes nuevas
```

## 9. Para cerrar la entrega

1. Aplicar 3.6 y resolver 4.2.
2. Aplicar la sección 5 según la decisión del cliente.
3. `npm run build` sin errores; revisar la consola del navegador en las cuatro páginas.
4. Subir la versión del plugin (`wordpress/medal-site/medal-site.php`, hoy 1.2.0) y
   compilarlo con `wordpress/build-plugin.mjs`.
5. Actualizar `MASTER-VERSION.txt` y generar el ZIP de raíz plana.
6. Tras instalar el plugin, comprobar el encabezado `X-Medal-Site` con la versión
   nueva y revisar en incógnito.
