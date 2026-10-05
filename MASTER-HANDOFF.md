# ACTUALIZACIÓN OPERATIVA — 5 DE OCTUBRE DE 2026

Esta actualización **reemplaza el estado descrito más abajo para `/` y `/film-services/`**. Work y Contact permanecen intactos. La especificación vigente es `docs/MEDAL-PORTADA-Y-FILM-SERVICES-SPEC.md`.

- `/`: deja de ser la landing histórica. Ahora es una escena inmersiva fijada con header común; el video Artech se aleja hasta quedar dentro del logotipo Medal y el recorrido entra a `/work/`. El formulario ya no vive en portada; `Send inquiry` apunta a `/contact/`.
- `/film-services/`: mantiene el film hero; Reels pasa a tira continua + visor fullscreen; las tres medallas aparecen una sola vez en una escena scroll-driven y terminan en sus tarjetas; el antiguo `How Medal works`, `Select your plan` y rombo dejan de existir; el apóstrofe crea el hilo hacia Availability.
- Regla crítica: no modificar `work/`, `contact/`, `contact/confirmed/` ni sus módulos/estilos para implementar esta actualización.

---

# MEDAL — HANDOFF MAESTRO GENERAL
## Estado consolidado al 3 de octubre de 2026

**Proyecto:** Medal Website / Medal Consulting  
**Repositorio esperado:** `Medal_Website`  
**Rama usada durante el rediseño:** `rediseno-sitio`  
**Objetivo de este archivo:** permitir iniciar una conversación nueva sin perder decisiones, arquitectura, animaciones aprobadas ni pendientes.

---

# 0. REGLA PRINCIPAL

Este ZIP es la nueva base operativa. Si un ZIP anterior, una instrucción vieja o una captura contradicen el código actual, partir primero de **este código** y usar este documento para entender la intención.

No volver a aplicar ZIPs H1/H2/H3/H4/H5/H6 antiguos sobre esta base.

No hacer una auditoría masiva antes de corregir algo. Identificar la sección, leer su HTML/CSS/JS y tocar solo lo necesario.

---

# 1. DIRECCIÓN DE MARCA

Medal debe sentirse como un estudio/agencia de **brand, fotografía y film** premium, sobrio y contemporáneo.

Principios bloqueados:

- comunicación creativa pero seria;
- lujo contemporáneo, no ostentoso;
- tipografía grande, fotografía protagonista, mucho aire;
- negro como fondo oscuro real;
- halos azules como luz y profundidad, nunca azul plano como fondo principal;
- amarillo `#E0F53B` como firma, énfasis y acción;
- hueso `#F2EFE8` como pausa editorial;
- animaciones cinematográficas y ligadas al scroll, no efectos web gratuitos;
- evitar tarjetas dentro de tarjetas y bloques rectangulares que hagan sentir la página modular;
- una idea principal por pantalla.

La frase conceptual de Medal que ha guiado el proyecto es: **“More than a portfolio.”** y la lógica de servicios se organiza con **Bronze / Silver / Gold**.

---

# 2. SISTEMA VISUAL

## Colores

```css
--ink: #05060A;
--blue: #0842FB;
--blue-soft: #7E9CFF;
--yellow: #E0F53B;
--bone: #F2EFE8;
--text-soft: #D7DAE0;
--label: #9FA8B4;
```

## Tipografía

- **Archivo Variable:** titulares, navegación, cuerpos, CTA.
- **IBM Plex Mono:** eyebrows, metadata, numeración y elementos técnicos.

No incorporar una tercera familia tipográfica sin aprobación.

## Header

Header fijo/transparente en todas las páginas.

**Sobre fondo oscuro/fotografía:**
- logo blanco;
- links claros;
- activo amarillo;
- botón oscuro con borde claro.

**Sobre hueso/blanco:**
- logo negro;
- links negros;
- activo puede conservar amarillo si tiene contraste;
- botón negro.

El header debe acompañar las transiciones y cambiar de tema según el fondo que realmente se encuentra detrás. Nunca debe quedar logo negro sobre negro ni blanco sobre bone.

---

# 3. ARQUITECTURA DE RUTAS

| Ruta | Función | Estado actual |
|---|---|---|
| `/` | landing provisional histórica | se conserva |
| `/work/` | portfolio / casos / resultados / disponibilidad | consolidado H1–H6 |
| `/film-services/` | film + servicios + planes Medal | consolidado, en fase de pulido |
| `/contact/` | Medal Session + resultados de la sesión + calendario mockup | funcional, en fase de pulido |
| `/contact/confirmed/` | booking final | funcional, pendiente audio/video y refinamientos |

---

# 4. WORK — H1 A H6

## Estado general

Work es la página que más tiempo lleva aprobada. Evitar reescribirla para resolver cambios de Film o Contact.

Archivos principales:

```text
work/index.html
src/css/pages/work.css
src/css/pages/work-cases.css
src/css/pages/work-h4-h6.css
src/js/modules/work-intro.js
src/js/modules/work-cases.js
src/js/modules/work-h4-h6.js
src/data/cases.json
src/data/strip.json
```

## H1/H2 — entrada y transición

- halos azules globales sobre negro;
- transición editorial hacia el momento hueso/blanco;
- scroll con peso / amortiguado para evitar saltar varias escenas con un flick fuerte;
- no usar scroll-snap rígido;
- la experiencia debe conservar inercia sin obligar a un segundo scroll para desbloquear.

## H3 — casos / brands

Cinco casos principales. La lógica aprobada es pantalla completa horizontal, `cover`, sin inventar fondos duplicados ni `contain`.

Las transiciones entre brands deben ser:

```text
foto actual → fade a negro perceptible → breve negro → foto siguiente → copy
```

No crossfade de dos fotos visibles a la vez.

No alterar las fotos aprobadas de los casos salvo una corrección explícita. Fiesta ya fue reemplazada por el asset correcto durante la evolución del proyecto.

## H4 — More than a portfolio

Título: `More than a portfolio.`

Carrusel horizontal pensado con tres estados:

1. **AUTO** — movimiento lento permanente hacia la izquierda.
2. **EXPLORE** — el cursor dentro del área controla dirección y velocidad sin click-and-drag.
3. **FOCUS** — cuando el cursor se estabiliza sobre una imagen, pausa el movimiento, la imagen sube y aparece la marca.

La lógica vigente está en `work-h4-h6.js`; si se pule, preservar la intención anterior.

Reglas:
- no pausar simplemente al entrar al área;
- no requerir click para explorar;
- no interrumpir el scroll vertical;
- el carrusel debe ser continuo/infinito;
- usar fotografías distintas a las cinco portadas principales cuando sea posible.

## H5 — Results + Selected Brands

Results actualmente usa:

- `#1` — Google Ads position in Florida / Blind Depot.
- `21.5K` — Real followers in two years / Selected social growth.
- `105` — collector cars shaped into one launch story / Artech · Museo Nicolini.

La animación de número + regla amarilla debe reiniciarse al entrar bajando y al volver subiendo.

Selected Brands debe mantenerse integrado al mismo campo negro/halos, sin línea divisoria. Marcas trabajadas:

- Food Freaks
- Artech
- Central
- Kjolle
- Fiesta
- ZÜB Zero
- Lisung Health

Kjolle se amplió porque se perdía visualmente. Los logos se adaptaron a blanco cuando el original desentonaba.

## H6 — Availability

Copy aprobado:

`Six new brands a month.`

Animación:
- texto blanco;
- barrido amarillo temporal;
- vuelve a blanco;
- se repite al reentrar;
- 6 círculos;
- 4 se rellenan en amarillo secuencialmente.

No volver a `Four new brands a month`.

---

# 5. FILM & SERVICES

Archivos principales:

```text
film-services/index.html
src/css/pages/film-services.css
src/js/modules/film-services.js
src/js/pages/film-services.js
assets/img/film/medals/
assets/video/reels/
```

## Estructura actual

1. Hero Film / Artech.
2. Reels — `Made for the feed.`
3. `Three medals. One standard.`
4. Entrada de Bronze / Silver / Gold.
5. Journey de servicio: The Shoot / The Brand / The Launch.
6. Transición Gold → exposición → pantalla bone.
7. How Medal Works — `Production starts with a decision, not a camera.`
8. Interstitial con rombo/chevron Medal + textos laterales.
9. transición hacia negro/halos.
10. `Select your plan.`
11. selección Bronze / Silver / Gold.
12. Availability — actualmente 4 de 6 slots in motion.

## Medallas

Assets definitivos:

```text
assets/img/film/medals/bronze-medal.png
assets/img/film/medals/silver-medal.png
assets/img/film/medals/gold-medal.png
```

Son medallas frontales, sin cinta ni gancho, con la palabra completa `medal` y el chevron amarillo/verde.

Usarlas como objetos protagonistas, no como iconos pequeños.

## Three medals. One standard.

Las tres medallas entran desde abajo con stagger. La entrada debe sentirse Blender/objeto 3D, con escala/profundidad suaves.

## Selección de plan

Al seleccionar una medalla:

- botón se pinta amarillo;
- medalla seleccionada gira lentamente en 3D;
- las otras pierden presencia;
- CTA cambia al plan elegido.

No hacer que las medallas giren constantemente.

## Yellow sweep

Regla global de Film:

- el amarillo recorre el interior del título;
- nunca debe quedar congelado a mitad de palabra;
- terminado el barrido, el texto vuelve completamente a su color base;
- fondo oscuro → termina blanco;
- fondo bone → termina negro;
- reejecutar al entrar bajando y al entrar subiendo.

Aplica especialmente a:

- Film
- Every frame, directed.
- Made for the feed.
- Three medals. One standard.
- The Shoot.
- The Brand.
- The Launch.
- Production starts with a decision, not a camera.
- Select your plan.
- Availability.

## The Shoot / The Brand / The Launch

En fondo oscuro el título debe ser **blanco real** después del barrido. Hubo una regresión donde quedaba gris/oscuro; no volver a introducirla.

## Gold → How Medal Works

La intención aprobada es una sola timeline continua:

```text
Gold visible con contenido
→ al siguiente scroll la MISMA medalla empieza zoom
→ copy desaparece
→ Gold ocupa la pantalla
→ metal / champagne / exposición
→ bone
→ contenido How Medal Works aparece inmediatamente
```

No puede existir una segunda medalla Gold más abajo ni una pantalla bone vacía que obligue a seguir scrolleando para encontrar el contenido.

## How Medal Works

Título actual:

`Production starts with a decision, not a camera.`

Se redujo respecto a versiones demasiado gigantes para que quepa con aire y no corte los tres principios inferiores.

Principios:

1. Direction first.
2. Scope without surprises.
3. One team, end to end.

## Interstitial rombo

Pantalla bone con rombo/diamante oscuro y chevron amarillo Medal.

Textos laterales aprobados:

**CLARITY BEFORE PRODUCTION**  
`We define the route before the cameras roll.`

**ONE STANDARD**  
`Different depth. Same direction.`

Los textos laterales se agrandaron porque inicialmente parecían notas pequeñas.

## Select your plan

Fondo negro + halos. Las medallas entran desde abajo. Copy secundario debe tener escala legible, no microtexto.

## Availability Film

Actualmente:

`4 of 6 slots in motion.`

El usuario pidió explícitamente **4 of 6**, no 2 of 6.

## Footer

El footer gigante con `medal` fue eliminado. No restaurarlo. Availability funciona como cierre principal.

---

# 6. CONTACT — MEDAL SESSION

Archivos principales:

```text
contact/index.html
src/css/pages/contact.css
src/js/modules/contact.js
src/js/pages/contact.js
```

## Concepto

La Medal Session no se vende como “free call”. Se presenta como una oferta que ya entrega valor: dirección visual y claridad antes de contratar.

La versión actual usa fondo negro + halos y pantallas fullscreen conectadas por scroll.

## Contact hero

Copy actual:

`Leave with a visual direction for your next launch.`

Incluye:
- The Medal Session · 30 minutes · No cost;
- indicador de slots;
- CTA hacia outcomes.

## What you leave with

No lleva imagen a la derecha en la versión actual. Se amplió y centró.

Tres resultados:

01 — A visual direction  
02 — The right medal  
03 — A realistic timeline

La línea vertical amarilla progresa con scroll y cada número recibe el sweep amarillo. Deben encenderse progresivamente y conservar alta legibilidad.

## Scheduler / Calendly mockup

Todavía NO está conectado a Calendly real. Es una simulación frontend para probar UX.

Mes simulado: November 2026.

Días disponibles y horas viven en:

```text
src/js/modules/contact.js
schedulerData
```

Flujo:

```text
seleccionar día
→ seleccionar hora
→ habilitar Confirm session
→ click
→ cortina bone sube desde abajo
→ wordmark Medal negro centrado
→ cortina cubre todo
→ navegación a /contact/confirmed/?phase=booked&start=...&end=...
```

La cortina es la opción A aprobada. No sustituir por fade simple ni por dos paneles salvo nueva instrucción.

---

# 7. CONTACT CONFIRMED

Archivos principales:

```text
contact/confirmed/index.html
src/css/pages/confirmed.css
src/js/modules/confirmed.js
src/js/pages/confirmed.js
```

## Pantalla final aprobada conceptualmente

Debe ser una **única pantalla bone**, idealmente sin necesidad de scroll en desktop.

Contenido:

- header estándar en modo claro;
- `YOUR BOOKING`;
- fecha dinámica;
- hora dinámica + Lima;
- checklist de 3 puntos;
- `ADD TO CALENDAR`;
- `WHATSAPP US`;
- pieza/video Artech pequeña a la derecha;
- texto de preparación.

No debe aparecer:

- “Booking your session” como pantalla intermedia;
- hero gigante “You're booked”;
- See our work;
- Send another request;
- footer adicional.

La navegación debe sentirse como si la cortina bone del scheduler se convirtiera en la propia Confirmation.

## Fecha/hora dinámica

Se reciben por query params `start` y `end` y se formatean en zona `America/Lima`.

`Add to calendar` genera un archivo `.ics` localmente.

`WhatsApp us` queda deshabilitado hasta configurar URL oficial.

## VIDEO ARTECH — PENDIENTE IMPORTANTE

Asset:

`assets/video/artech-classic-cars.mp4`

El archivo **sí tiene audio**:

- codec AAC LC;
- 44.1 kHz;
- stereo;
- duración aproximada 47.42 s.

El problema reportado actualmente es que al pulsar el video en Confirmation no se escucha. El JS actual hace `video.play()` pero no fuerza explícitamente:

```js
video.muted = false;
video.volume = 1;
```

Este es un bug/pendiente prioritario para la siguiente conversación. Debe activarse el audio únicamente después del gesto del usuario para respetar políticas del navegador.

---

# 8. HALOS

Archivo global:

`src/js/modules/halos.js`

Los halos deben:

- vivir sobre el fondo negro;
- moverse lentamente;
- sentirse como luz, no blobs planos;
- mantener continuidad entre secciones oscuras;
- no generar líneas de corte entre bloques;
- no detenerse arbitrariamente.

No crear halos CSS estáticos por sección si los globales pueden atravesar el recorrido.

---

# 9. SCROLL

Archivo base:

`src/js/modules/smooth-scroll.js`

Principio aprobado: **scroll con peso, no scroll atrapado**.

Objetivos:

- un flick fuerte no debe atravesar tres escenas instantáneamente;
- evitar scroll-snap duro;
- no exigir scroll extra para “desbloquear” una sección;
- mantener sensación premium/editorial;
- mobile/touch más cerca del comportamiento nativo.

Cualquier corrección futura de scroll debe probarse en Work, Film y Contact porque es infraestructura compartida.

---

# 10. LANDING `/`

La raíz conserva una landing provisional histórica con video Artech y formulario. No confundirla con Contact actual.

Archivos legacy principales:

```text
index.html
css/styles.css
js/main.js
```

No usar estos archivos como referencia para reconstruir `/work/`, `/film-services/` o `/contact/`.

---

# 11. WORDPRESS — PLAN FUTURO

Medal actualmente vive/puede vivir dentro de WordPress. La arquitectura acordada conceptualmente es:

**WordPress = CMS / Media Library**  
**Código Medal = experiencia visual / animaciones / GSAP / Lenis**

La opción preferida es convertir al final el proyecto en un **theme WordPress personalizado**, no rehacer el sitio con widgets.

Contenido que idealmente será editable desde WordPress:

- proyectos de Work;
- imágenes y videos;
- strip More than a portfolio;
- logos Selected Brands;
- Bronze/Silver/Gold copy;
- disponibilidad 4/6 o 6 total;
- Contact / scheduling;
- videos.

Mantener Vite como pipeline de desarrollo y compilar assets para el theme.

Se conserva una referencia de código Elementor/WordPress en `docs/originales/WORDPRESS-ELEMENTOR-REFERENCE.txt`.

---

# 12. REGLAS DE NO REGRESIÓN

1. No envolver futuros ZIPs en carpetas como `medal_contact_v2/`. Los ZIPs para el usuario deben abrir en raíz.
2. No incluir `node_modules`.
3. No reemplazar fotos aprobadas de Work para corregir otra sección.
4. No restaurar footer gigante Medal.
5. No usar fondos azul plano.
6. No dejar sweep amarillo congelado.
7. No dejar títulos blancos heredando negro/gris en secciones oscuras.
8. No insertar líneas divisorias visibles entre Selected Brands / Availability u otras escenas que deben sentirse continuas.
9. No crear una segunda Gold Medal para iniciar la transición; usar la misma medalla visible.
10. No inventar Calendly/WhatsApp reales hasta tener URLs oficiales.
11. El header debe responder al fondo real.
12. No convertir la experiencia en tarjetas o secciones claramente “apiladas”.

---

# 13. QUÉ REVISAR PRIMERO EN LA SIGUIENTE CONVERSACIÓN

Orden recomendado:

1. reproducir `/contact/confirmed/` y arreglar audio Artech;
2. revisar que la cortina Contact → Confirmed se vea como una sola continuidad;
3. QA de yellow sweep en Film (entra, recorre, sale, vuelve a color base);
4. QA de Gold → bone sin vacío ni medalla duplicada;
5. QA de header claro/oscuro durante todas las transiciones;
6. QA responsive desktop 1440/1920 y móvil;
7. QA scroll rápido con rueda/trackpad;
8. build final Vite;
9. recién después migración a WordPress/theme.

---

# 14. COMANDOS ÚTILES

```powershell
npm install
npm run dev
npm run build
npm run preview
```

Eliminar una carpeta equivocada:

```powershell
Remove-Item -Recurse -Force .\nombre_carpeta
```

Extraer un ZIP maestro directamente en raíz:

```powershell
Expand-Archive -LiteralPath "$env:USERPROFILE\Downloads\Medal_Website-MASTER-2026-10-03.zip" -DestinationPath . -Force
```

---

# 15. ESTADO DE VALIDACIÓN DE ESTE ZIP

- Estructura consolidada en raíz.
- `node_modules` excluido.
- Work proviene de la línea H1–H6 v6.
- Film & Services incluye los cambios de v5.
- Contact/Confirmed incluye el flujo v3 de cortina.
- El video Artech conserva la pista de audio AAC original.
- No se considera `dist/` fuente de verdad.

Para detalles de bugs y pruebas, continuar con `docs/QA-PENDIENTES.md`.

---

## Final UX patch — 2026-10-05

This patch supersedes earlier notes where they conflict.

- Landing → Work transition: the large Medal apostrophe now uses a controlled small gap above the “e”; `Selected work · 2024–2026` and `Keep scrolling to enter Work` are larger and use the same visual scale as the Work opener.
- Work opener: the initial Medal wordmark is enlarged to match the landing handoff; its apostrophe uses the same small-gap geometry (not detached, not touching the “e”).
- Film & Services: the opening film extends behind the fixed header from the first frame; the page no longer inserts a standalone apostrophe divider between the medal cards and availability. Reels, medals and availability share one continuous dark/halo field.
- Contact: the local mock calendar was replaced by the live Calendly inline embed for `https://calendly.com/rgamero406/medal-session`. The embed uses Calendly’s official widget loader and listens for `calendly.event_scheduled` to retain Medal’s confirmation curtain/confirmed flow. A direct Calendly link remains as fallback if the external widget cannot load.
- Work case modules, Work H4–H6 logic, Film reels/KPI logic, medal selection behavior, and Contact hero/outcomes were otherwise left intact.
