# MEDAL — DOCUMENTO MAESTRO ACTUALIZADO
## Handoff oficial después de H3

**Proyecto:** Medal Website / Medal Consulting  
**Repositorio:** `Medal_Website`  
**Rama de trabajo:** `rediseno-sitio`  
**Estado:** H0, H1, H2 y H3 construidos y aprobados. El repositorio del usuario ya contiene el último commit de H3.  
**Siguiente hito:** H4.  
**Fecha de este handoff:** 2026-10-01.

> Este archivo reemplaza como fuente de verdad operativa al `MEDAL-MAESTRO.md` anterior para continuar el desarrollo desde otro chat.  
> Si existe una contradicción entre una especificación antigua, un ZIP intermedio o una referencia visual y este documento, **manda este documento y el estado actual del repositorio**.  
> No volver a aplicar ZIPs antiguos sobre el repo. No reconstruir H1, H2 o H3 salvo que aparezca una regresión concreta.

---

# 0. INSTRUCCIÓN PARA EL PRÓXIMO CHAT

Al iniciar un nuevo chat, usar este texto:

> Estoy continuando el rediseño de Medal Website. Lee primero `MEDAL-MAESTRO-ACTUALIZADO-H3.md`. Mi repositorio ya tiene el último commit de H3 actualizado en la rama `rediseno-sitio`. H1, H2 y H3 están cerrados y no deben reescribirse. Continúa desde H4 respetando todas las decisiones bloqueadas del documento, especialmente los halos H1.4, la entrada de Work H2, el flujo de casos H3, el header y el sistema visual.

Regla operativa:

- El **repositorio actual** es la fuente principal del código.
- Este MD es la fuente principal de decisiones.
- Los ZIPs previos son solo historial.
- No hacer una auditoría masiva antes de cada hito. Leer solo los archivos necesarios.
- Cada hito nuevo debe ser pequeño, probado y fácil de revertir.
- No trabajar directamente en `main`.
- No alterar una interacción ya aprobada para resolver una sección nueva.

---

# 1. OBJETIVO DEL SITIO

Medal es un estudio/agencia de **brand, fotografía y film** con una comunicación creativa pero seria, premium y sobria. La marca debe sentirse segura, profesional y de nivel alto; nunca genérica, excesivamente juvenil ni recargada.

El sitio tiene dos objetivos:

1. Mostrar trabajo real con una estética de lujo: fotografía y film grandes, mucho aire, tipografía fuerte y poca decoración.
2. Convertir interés en una **Medal Session**, sin convertir el sitio en una página de venta agresiva.

**Idioma del sitio:** inglés.  
**Idioma de documentación interna:** español.

Marcas que forman parte del universo de Medal: Kjolle, Artech, Züb Zero, Fiesta, Food Freaks, Blind Depot, Coco Palazzo, VL Real Estate, Paqu, Pizzarello, Lisung Health, entre otras.

---

# 2. ESTRUCTURA GENERAL DEL SITIO

| Ruta | Página | Estado |
|---|---|---|
| `/` | Home / landing actual | Se conserva por ahora |
| `/work/` | Work | H1 + H2 + H3 construidos |
| `/film-services/` | Film & Services | Pendiente |
| `/contact/` | Medal Session | Pendiente |
| `/contact/confirmed/` | Confirmación | Pendiente |

Menú común:

`[Medal]   Work   Film & Services   Contact   (Book a session →)`

El logotipo siempre lleva a `/`.

Las páginas antiguas de WordPress deberán redirigirse al finalizar el proyecto. Photo & Video no vuelve como pestaña: fotografía vive en Work y video en Film.

---

# 3. SISTEMA VISUAL BLOQUEADO

## 3.1 Colores

```css
--ink: #05060A;
--blue: #0842FB;
--blue-soft: #7E9CFF;
--yellow: #E0F53B;
--bone: #F2EFE8;
--text-soft: #D7DAE0;
--label: #9FA8B4;

--bronze: #B9794A;
--silver: #C9CFD8;
--gold: #D8B35A;
```

Reglas:

- El fondo oscuro base es **negro**, no azul.
- El azul aparece como halo/luz, no como bloque plano completo.
- El amarillo se usa como firma, acción y detalle.
- Evitar superponer amarillo y azul de forma que visualmente produzcan verde.
- El hueso funciona como pausa y contraste, no como color dominante de todo el sitio.

## 3.2 Tipografía

Solo dos familias:

- **Archivo Variable**: titulares, nombres de clientes, navegación, cuerpos y CTA.
- **IBM Plex Mono**: etiquetas pequeñas, metadata, números y elementos técnicos.

No incorporar nuevas tipografías sin una razón fuerte.

## 3.3 Forma y composición

- Una idea principal por pantalla.
- Fotos de borde a borde cuando el contenido lo permite.
- Tipografía grande.
- Mucho espacio negativo.
- Esquinas suaves solo donde tenga sentido.
- Botones tipo píldora.
- No colocar grandes tarjetas visuales dentro de grandes tarjetas.
- No convertir la web en un mosaico de módulos.
- No usar fondos azul plano.
- Los movimientos deben sentirse editoriales y cinematográficos, no “efectos web” gratuitos.

---

# 4. HEADER — ESTADO ACTUAL

El header es fijo, transparente y sin barra sólida.

## Estado oscuro / fotografía

- Logo blanco.
- Links claros.
- Página activa puede usar amarillo.
- Botón negro/translúcido con borde claro.
- Debe leerse sobre fotografía con contraste suficiente.

## Estado claro / hueso

Cambio importante hecho durante H3:

- Logo y navegación pasan a `--ink`.
- **El link activo NO queda amarillo sobre hueso**, porque perdía contraste.
- En estado `header--light`, Work activo se muestra negro.

## Tamaños aprobados después de H3

En `/work/` el header se hizo más grande que en las primeras versiones:

```css
.site-header__brand {
  width: clamp(124px, 8.8vw, 172px);
}

.site-header__nav {
  gap: clamp(34px, 2.8vw, 56px);
}

.site-header__link {
  font-size: clamp(17px, 1.08vw, 19px);
}

.button--header {
  min-height: 54px;
  padding-inline: 28px;
}

.button--header .button__label {
  font-size: 16px;
}
```

En futuros hitos, no volver a reducir el header a la versión inicial de 14–15 px.

---

# 5. H0 — ENTORNO Y BASE TÉCNICA

Estado completado.

Stack:

- Vite multipágina.
- HTML semántico.
- CSS modular con variables.
- JavaScript ES Modules.
- GSAP 3.
- ScrollTrigger.
- Lenis.
- Sin framework de UI.

Dependencias relevantes:

```bash
npm install gsap lenis
```

Scripts esperados:

```bash
npm run dev
npm run build
npm run preview
```

Rama de desarrollo:

```text
rediseno-sitio
```

H0 tuvo un commit inicial identificado como:

```text
6c564bb — Set up Vite development environment
```

No es necesario volver a ejecutar H0.

---

# 6. H1 — SISTEMA GLOBAL Y HALOS
## ESTADO: CERRADO / NO TOCAR

La versión aprobada fue H1.4.

### 6.1 Regla principal

**Toda pantalla realmente negra debe conservar los dos halos globales aprobados.**

No rehacerlos para cada sección.  
No sustituirlos por un gradiente azul genérico.  
No apagarlos arbitrariamente en pantallas negras.

Archivos sensibles:

```text
src/js/modules/halos.js
src/css/base.css
```

No modificarlos salvo que el usuario pida explícitamente cambiar halos.

### 6.2 H1.4 — comportamiento definitivo

Existen exactamente **dos halos grandes**.

Halo izquierdo:

- inicia visible en esquina superior izquierda;
- desciende por el borde izquierdo;
- recorre el borde inferior hacia el centro;
- regresa por la misma ruta.

Halo derecho:

- inicia visible en esquina inferior derecha;
- sube por el borde derecho;
- recorre la parte superior hacia el centro;
- regresa por la misma ruta.

Tamaño:

```css
width: clamp(480px, 46vw, 850px);
```

En móvil rondan aproximadamente los 650 px.

Características:

- radial gradients del sistema Medal;
- `filter: blur(12px)`;
- opacity 1 en su capa;
- movimiento lento;
- rutas alrededor del perímetro;
- no cruzan agresivamente titulares.

Duraciones aproximadas:

```text
izquierdo: 48 s
derecho: 52 s
```

### 6.3 Interacción del cursor

No existe parallax global.

Solo existe comportamiento magnético sobre el **núcleo** del halo:

- el halo sigue al cursor únicamente cuando se entra en su zona activa;
- solo uno puede estar activo a la vez;
- el halo elegible más reciente toma prioridad;
- al salir, vuelve lentamente a su trayectoria;
- velocidad de seguimiento aproximada: `.055`;
- velocidad de retorno aprobada H1.4: `.0042`.

### 6.4 Reduced motion

Con:

```css
prefers-reduced-motion: reduce
```

los halos quedan estáticos y no persiguen cursor.

---

# 7. H2 — ENTRADA DE WORK
## ESTADO: CERRADO / NO REESCRIBIR

H2 tuvo muchas iteraciones. La versión conceptual definitiva proviene de H2.11.1 + H2.11.2 y luego recibió **un único cambio de tamaño inicial de MEDAL en H3 v7**.

Las versiones H2.12 que intentaron introducir una franja amarilla se rompieron y **NO son fuente de verdad**.

## 7.1 Cambio conceptual frente al master antiguo

La entrada ya **NO usa la palabra WORK**.

La ruta y el menú siguen diciendo `Work`, pero la escena hero utiliza el **wordmark MEDAL**.

Secuencia:

```text
negro + halos
→ MEDAL
→ scroll
→ M / D / A / L se van
→ permanecen E + apóstrofe
→ zoom hacia el apóstrofe
→ se entra físicamente dentro del apóstrofe blanco
→ el blanco llena el 100 % de la pantalla
→ pasa a fondo bone
→ aparece la información
```

## 7.2 MEDAL inicial

Wordmark:

- vector SVG inline;
- color hueso/blanco;
- apóstrofe también blanco durante esta escena;
- no usar el amarillo en el apóstrofe aquí.

El apóstrofe se acercó visualmente a la E mediante:

```svg
transform="translate(0 30)"
```

### Tamaño actual

El usuario pidió MEDAL claramente más grande sin romper el zoom.

En la última versión H3 v7 se ajustó **solo el encuadre inicial**:

```js
let logoFraction = 0.72;
```

y se amplió físicamente el stage:

```css
width: clamp(620px, 72vw, 1120px);
```

Responsive aproximado:

```css
tablet: min(92vw, 780px)
mobile: 94vw
```

**No revertir a 0.58 ni a `clamp(460px, 58vw, 880px)`.**

## 7.3 Protección del zoom

Valores que forman parte del comportamiento aprobado y no deben cambiar accidentalmente:

```js
APOSTROPHE_CENTER = {
  x: 257.475,
  y: 48.8
}
```

El zoom es vectorial mediante `viewBox`.

No usar:

```css
transform: scale(60)
```

sobre el SVG, porque provocó pixelación y problemas de cámara en versiones anteriores.

El `viewBox` se va cerrando alrededor del apóstrofe.

Final aprobado para evitar la pausa muerta:

```js
const finalHeight = 3.0;
```

H2.11.2 cambió este valor desde una cámara excesivamente profunda para que, una vez visible el contenido de hueso, el usuario pueda seguir bajando casi inmediatamente.

## 7.4 Trayectoria de cámara aprobada

Problema histórico resuelto:

- no mover toda la palabra al comenzar el scroll;
- no mover header y entorno como si la cámara “saltara”;
- no entrar por el hueco entre E y apóstrofe.

Comportamiento actual:

1. El apóstrofe conserva su posición relativa durante la primera parte.
2. El zoom se siente sobre la composición, no como un paneo general.
3. Solo hacia el final el apóstrofe se recentra suavemente.
4. Se entra en su interior.

Recenter aprobado:

```js
(p - 0.62) / 0.23
```

Fade de las letras que no son E:

```js
(p - 0.12) / 0.18
```

Fade de los textos periféricos antiguos:

```js
(p - 0.76) / 0.12
```

## 7.5 Trigger del blanco

Este fue un punto importante.

La aparición de la pantalla hueso **NO debe depender de un porcentaje arbitrario de scroll**.

H2.11 implementó detección geométrica real:

- conoce el polígono del apóstrofe;
- conoce el `viewBox` actual;
- verifica que todo el viewport esté dentro de la forma blanca;
- cuando la cobertura es completa, dispara la transición automáticamente.

Así el visitante puede dejar de mover la rueda cuando la pantalla ya quedó blanca y el contenido aparece solo.

No sustituir esto por:

```js
if (scrollProgress > 0.9) ...
```

## 7.6 Pantalla hueso

Texto:

```text
Five brands · Four sectors

Every brand,
a different
standard.
```

El intento de agregar un wipe amarillo detrás de `different` quedó descartado porque rompió la base.

Versión definitiva:

- sin highlight amarillo;
- aparición suave;
- eyebrow primero;
- palabras después con stagger.

Aproximación:

```text
Eyebrow:
opacity 0 → 1
y 8 → 0
duration ~0.38

Palabras:
opacity 0 → 1
y 16 → 0
duration ~0.52
stagger ~0.065
```

Al subir, se reproduce una reversa corta.

## 7.7 Handoff H2 → H3

La pausa posterior al contenido fue eliminada.

Una vez termina la escena hueso y el usuario continúa scrolleando, debe entrar H3 sin un tramo vacío largo.

---

# 8. H3 — CASOS FULL SCREEN
## ESTADO: CERRADO EN EL REPOSITORIO

Orden definitivo:

```text
01 Kjolle
02 Artech
03 Züb Zero
04 Fiesta
05 Food Freaks
```

Configurable desde:

```text
src/data/cases.json
```

Archivos principales:

```text
src/data/cases.json
src/js/modules/work-cases.js
src/css/pages/work-cases.css
src/js/pages/work.js
```

## 8.1 H2 y H3 son un solo flujo

H3 no empieza como una página independiente.

La sección de handoff que existe al final de H2 se transforma en la sección de casos.

Recorrido:

```text
H2 bone
→ primer caso
→ segundo caso
→ tercero
→ cuarto
→ quinto
```

No insertar una “pantalla Work” separada entre H2 y H3.

## 8.2 Transición ACTUAL entre casos

Esto **sobrescribe la regla antigua del master** que exigía un hold negro entre imágenes.

Durante pruebas el usuario pidió eliminar la pausa negra con halos porque cortaba demasiado el ritmo.

La versión aprobada es un **crossfade rápido y directo**:

- la foto actual comienza a salir;
- la siguiente comienza a entrar prácticamente al mismo tiempo;
- no existe un hold negro visible entre ambas;
- el movimiento responde rápido al scroll;
- el sitio no se queda detenido en negro.

La versión base aprobada usa aproximadamente:

```js
INTRO = 0.20
HOLD = 0.70
TRANSITION = 0.30
OUT = 0.18
IN = 0.18
scrub = 0.38
```

No volver a introducir:

```text
black hold
45–55 % de negro
espera con halos entre cada caso
```

Los halos siguen existiendo globalmente, pero **no se fuerza un plano negro intermedio** entre los casos.

## 8.3 Fotos: sin zoom artificial

El usuario rechazó el movimiento:

```text
scale 1.03 → 1
```

Las imágenes de casos deben quedarse en:

```css
width: 100%;
height: 100%;
object-fit: cover;
transform: none;
```

El encuadre debe resolverse con la selección correcta de la fotografía o con un asset de hero preparado, no acercando artificialmente la foto durante el scroll.

## 8.4 Texto del caso

Cada caso tiene:

- sector / ciudad;
- nombre grande;
- contador;
- línea vertical de progreso amarilla a la derecha.

Tamaños actuales más grandes que en el master original:

```css
.work-case__meta {
  font-size: clamp(15px, 1vw, 17px);
}

.work-case__name {
  font-size: clamp(5.5rem, 8.9vw, 11.4rem);
}

.work-case__count {
  font-size: clamp(15px, .95vw, 17px);
}
```

No volver a hacer metadata microscópica.

## 8.5 Selección de assets actual

### Kjolle

Actualmente usa un asset gastronómico horizontal del proyecto:

```text
/assets/img/medal-01-tasting-menu.jpg
```

Objetivo: fotografía culinaria de nivel editorial, full screen.

### Artech

Asset real de autos clásicos:

```text
/assets/img/work/artech-classics.webp
```

Debe verse como colección/museo, no como un poster marrón.

### Züb Zero

Se descartaron varias imágenes verticales/cuadradas porque no encuadraban de forma natural.

El hero actual se construyó desde el mejor asset real de producto disponible:

```text
zub-zero-3-sabores-transparente.png
```

y quedó exportado como:

```text
/assets/img/work/zub-zero-hero-cover.webp
```

Concepto:

- 16:9;
- fondo oscuro premium;
- profundidad con luces de marca;
- potes completos;
- no usar un plato gastronómico para representar Züb.

### Fiesta

El asset definitivo proviene del recorte aportado por el usuario del **cabrito al fuego / llama**, visualmente más consistente con Kjolle y Artech.

Archivo final:

```text
/assets/img/work/fiesta-cabrito-fuego-final.webp
```

Procesamiento realizado:

- se tomó el crop horizontal proporcionado;
- se limpiaron guías/líneas magenta;
- se preservó el framing 16:9;
- se escaló a 2560×1440;
- mejora ligera de contraste, color y nitidez.

No volver a apuntar Fiesta a ninguna imagen de Züb.

### Food Freaks

Actualmente:

```text
/assets/img/medal-07-shared-table.jpg
```

Si aparece un asset original superior más adelante, se puede sustituir sin modificar la animación.

## 8.6 Barra lateral

Se conserva una barra vertical derecha con progreso amarillo.

Es un detalle editorial, no debe robar atención.

## 8.7 Cursor “View”

El master original contemplaba un cursor amarillo de 74 px.

**Todavía no es prioritario.**

No añadir páginas de caso ni navegación desde los casos hasta que el usuario lo pida. Puede quedar desactivado.

---

# 9. QUÉ NO HACER CON H1–H3

No:

- volver a WORK como palabra de entrada;
- rehacer halos;
- usar CSS scale gigante para el zoom del apóstrofe;
- mover toda la composición al empezar el zoom;
- apuntar al hueco E/apóstrofe;
- disparar la pantalla hueso por un porcentaje arbitrario;
- reintroducir la franja amarilla de H2.12;
- reintroducir una pausa larga negra después del reveal;
- añadir `scale 1.03 → 1` a las fotos de H3;
- meter un hold negro entre cada marca;
- hacer metadata pequeña;
- reducir el header;
- usar para Fiesta una imagen de Züb;
- cambiar H1/H2 para resolver H4.

---

# 10. H4 — SIGUIENTE HITO
## MORE THAN A PORTFOLIO + TIRA 4:5

Este es el próximo desarrollo.

Se empieza **después de Food Freaks**.

Contenido:

```text
BETWEEN LIMA AND MIAMI

More than a portfolio.
```

Diseño:

- mantener continuidad premium;
- la sección puede pasar por negro + halos si corresponde al concepto;
- no crear una cuadrícula de cards;
- fotos todas del mismo tamaño;
- formato vertical 4:5;
- esquinas alrededor de 12 px;
- sin borde;
- sin marcos decorativos.

Desktop:

```text
ancho aproximado por foto: 22vw
cantidad: 8–10
```

Movimiento:

- tira horizontal;
- derecha → izquierda;
- sincronizada con scroll mediante `scrub`;
- desplazamiento aproximado total: 40vw;
- todas las imágenes mantienen exactamente la misma jerarquía/tamaño.

Datos:

```text
src/data/strip.json
```

Ideal:

```json
[
  {
    "src": "/assets/img/strip/...",
    "alt": "...",
    "client": "..."
  }
]
```

No comenzar H5 hasta que H4 esté visualmente aprobado.

---

# 11. H5 — RESULTADOS / PRUEBA

Después de la tira.

Tres métricas:

```text
#1
Google Ads position in Florida
Blind Depot

21.5K
Real followers in two years

50 Best
Photography for Kjolle
```

Antes de publicar, validar que cada dato siga siendo correcto y que la frase exacta tenga respaldo real.

Animación:

- una sola vez al entrar;
- duración aprox. 1.5 s;
- cifras con `font-variant-numeric: tabular-nums`;
- línea amarilla inferior se llena;
- pequeño rebote final máximo 1.04.

No exagerar la gamificación.

---

# 12. H6 — MARCAS + CIERRE DE WORK

## 12.1 Logos

Una sola fila horizontal.

Tamaños:

```text
desktop: 28–36 px de alto
mobile: 22–26 px
```

Movimiento:

- continuo;
- derecha → izquierda;
- aprox. 40 s por ciclo;
- hover = pausa;
- sin imagen emergente;
- reduced motion = quieto.

Usar **logos oficiales**, no nombres escritos con una fuente aproximada.

Ruta prevista:

```text
assets/logos/clients/{slug}.svg
```

## 12.2 Cierre Work

Etiqueta:

```text
Availability
```

Titular:

```text
Four new brands a month.
```

Cupos:

- 4 círculos;
- los ocupados se llenan al entrar;
- el número de cupos debe ser real.

CTA:

```text
Book your Medal Session →
```

Secundario:

```text
See the medals
```

Datos:

```text
src/data/site.json
```

---

# 13. H7 — FOOTER COMÚN

Fondo negro + halos H1.4.

Contenido:

- logotipo Medal grande;
- email;
- teléfono;
- Miami · Lima;
- navegación;
- Instagram;
- Book a session.

El master original proponía un pequeño gesto del apóstrofe al entrar. Puede implementarse siempre que no compita con el sistema H2.

No duplicar animaciones complejas del hero de Work en el footer.

---

# 14. H8 — FILM

Ruta:

```text
/film-services/
```

Primera mitad de la página.

## Film hero

Video Artech:

- full screen;
- loop;
- muted inicialmente;
- `playsinline`;
- poster;
- botón `Sound on / Sound off`.

Texto:

```text
Film

Artech · Classic car collection
```

## Transformación a cinema

Con scroll:

- el video pasa de 100 % de ancho a aproximadamente 66 %;
- esquinas pasan 0 → 16 px;
- aparece alrededor negro + halos;
- no usar un fondo azul plano.

Texto:

```text
Every frame, directed.
Artech · Brand film · 0:47
```

## Tira de fotogramas

**ELIMINADA.**

No volver a construirla.

## Reels

Título:

```text
REELS
Made for the feed.
```

3–5 videos 9:16.

Clientes previstos:

- Kjolle;
- Fiesta;
- Artech.

Interacción desktop:

- reel activo crece como máximo ~1.12;
- reproduce muted;
- barra amarilla de progreso;
- otros bajan opacidad.

Mobile:

- reproduce el reel centrado mediante IntersectionObserver.

`preload="none"`.

---

# 15. H9 — SERVICES: THREE MEDALS

Misma ruta `/film-services/`, segunda mitad.

Entrada:

```text
Three medals.
One standard.
```

Fondo negro + halos.

`One standard.` puede rellenarse de amarillo de izquierda a derecha.

Fila inicial:

- Bronze;
- Silver;
- Gold;
- mismo tamaño;
- aproximadamente 180 px desktop.

Subtítulos:

```text
Bronze Medal · The shoot
Silver Medal · The brand
Gold Medal · The launch
```

Hover:

- `rotateY(180deg)` ~0.9 s;
- reverso resume contenido.

Click:

- `lenis.scrollTo()` al tramo de la medalla;
- aprox. 1.2 s.

Recorrido:

1. Bronze se vuelve grande.
2. Silver reemplaza.
3. Gold reemplaza.
4. Gold lleva el fondo hacia hueso.

Sección pinned aproximada:

```text
300vh
```

Puede usarse GSAP Flip.

No mostrar precios.

---

# 16. H10 — SERVICES: RIESGO + CIERRE

Fondo hueso.

Etiqueta:

```text
How we protect your launch
```

Titular:

```text
You approve the visual direction before we shoot a single frame.
```

Puntos:

```text
Direction first
Moodboard and shot list before production.

Dates in writing
Timeline agreed before we start.

One team
One point of contact from brief to delivery.
```

Prohibido:

- garantías de devolución;
- “si no te gusta, no pagas”.

Cierre:

```text
November availability
2 of 4 slots still open.
```

CTA:

```text
Book your Medal Session →
```

Datos desde `site.json`.

El mes y cupos deben actualizarse a la fecha real cuando se implemente.

---

# 17. H11 — CONTACT / MEDAL SESSION

Ruta:

```text
/contact/
```

Objetivo único: conseguir la sesión.

Hero:

```text
The Medal Session · 30 minutes · No cost

Leave with a visual direction
for your next launch.
```

CTA Fase 1:

```text
Request a session ↓
```

CTA Fase 2:

```text
Pick a time ↓
```

## What you leave with

Sin imagen lateral.

Números grandes.

```text
01
A visual direction
Three references and a first idea for your launch.

02
The right medal
Bronze, Silver or Gold, and why.

03
A realistic timeline
Dates you can plan around.
```

Animación:

- línea vertical se dibuja con scroll;
- cada punto se activa cuando la línea lo alcanza.

## Formulario Fase 1

Destino temporal:

```text
rgamero406@gmail.com
```

Campos:

- name;
- work email;
- brand/company;
- optional short message.

FormSubmit AJAX.

No agregar preguntas de calificación.

## Calendly Fase 2

Medal Session:

- 30 min;
- videollamada;
- nombre + email;
- sin cuestionario adicional.

Formulario queda debajo:

```text
Prefer to write?
```

---

# 18. H12 — CONFIRMACIÓN

Ruta:

```text
/contact/confirmed/
```

Transición previa:

- cortina hueso sube;
- Medal negro al centro;
- `Confirming your session`;
- aprox. 1.8 s;
- redirección.

Página:

Fondo hueso.

Fase 1:

```text
Request received
We'll reply within one business day.
```

Fase 2:

```text
You're booked
Thursday, Nov 5 · 10:00 · Lima
```

Contenido:

```text
To make the most of 30 minutes

Reply to our email with 3 photos or links of your brand today
Tell us your next launch or opening date
Invite whoever decides with you
```

Columna derecha:

- video 2 min sobre Artech;
- texto sobre las referencias que verá el cliente.

Botones:

- Add to calendar;
- WhatsApp us.

---

# 19. H13 — MOBILE + QA + PERFORMANCE + LAUNCH

No dejar mobile para “arreglar al final” si un hito nuevo rompe desktop.

## Mobile

- una columna;
- mismo orden;
- animaciones simplificadas;
- header: logo + Book a session + menú;
- menú full screen;
- botones mínimo 48 px;
- Work cases: mismo flujo;
- tira H4 desplazable;
- reels centrados;
- medals verticales;
- Contact full width.

Barra fija inferior:

```text
Book a session
```

desde el primer caso de Work.

Se oculta en Contact.

## Accesibilidad

- navegación por teclado;
- foco visible;
- alt text;
- reduced motion;
- formularios con status/aria-live;
- contraste suficiente.

## Metas de rendimiento

```text
LCP < 2.5 s
CLS < 0.1
JS propio < 120 KB comprimido
video hero ideal < 4 MB
imágenes individuales ideal <= 400 KB
```

Fotos:

- WebP/AVIF;
- 2x;
- lazy load fuera de la primera pantalla.

Video:

- H.264 MP4;
- poster;
- `playsinline`;
- reels lazy/preload none.

Pruebas:

- Playwright;
- Lighthouse;
- capturas desktop/mobile.

---

# 20. ESTRUCTURA DE ARCHIVOS ACTUAL / OBJETIVO

A medida que avance el proyecto:

```text
Medal_Website/
├─ index.html
├─ work/
│  └─ index.html
├─ film-services/
│  └─ index.html
├─ contact/
│  ├─ index.html
│  └─ confirmed/
│     └─ index.html
├─ package.json
├─ vite.config.js
│
├─ assets/
│  ├─ logo-medal.svg
│  ├─ fonts/
│  ├─ img/
│  │  ├─ work/
│  │  ├─ strip/
│  │  └─ confirmed/
│  ├─ logos/
│  │  └─ clients/
│  └─ video/
│
└─ src/
   ├─ css/
   │  ├─ tokens.css
   │  ├─ base.css
   │  ├─ header.css
   │  ├─ buttons.css
   │  └─ pages/
   │     ├─ work.css
   │     ├─ work-cases.css
   │     ├─ film-services.css
   │     ├─ contact.css
   │     └─ confirmed.css
   │
   ├─ js/
   │  ├─ main.js
   │  ├─ config.js
   │  ├─ pages/
   │  │  └─ work.js
   │  └─ modules/
   │     ├─ halos.js
   │     ├─ smooth-scroll.js
   │     ├─ header.js
   │     ├─ buttons.js
   │     ├─ work-intro.js
   │     └─ work-cases.js
   │
   └─ data/
      ├─ cases.json
      ├─ strip.json
      ├─ brands.json
      ├─ site.json
      └─ medals.json
```

No asumir que todos los futuros archivos ya existen. Revisar el repo antes de crear duplicados.

---

# 21. DATOS Y ASSETS PENDIENTES

Pendientes generales que siguen siendo válidos:

1. Logos oficiales de clientes en SVG o PNG transparente.
2. Video Artech original de mejor resolución si existe.
3. Reels originales Kjolle / Fiesta / Artech.
4. Más fotografía original de alta resolución para strip y futuros casos.
5. Cupos reales por mes.
6. Contenido final Bronze / Silver / Gold.
7. WhatsApp oficial de Medal.
8. Instagram definitivo que se mostrará en footer.
9. Plan de Calendly y persona que atiende la Medal Session.
10. Video de 2 minutos de Artech para confirmación.
11. Correo definitivo de Contact.

Importante: H3 ya tiene assets funcionales. Estos pendientes no justifican reconstruir H3 antes de H4.

---

# 22. DECISIONES DESCARTADAS / HISTORIAL DE ERRORES

Esta sección existe para evitar repetir iteraciones ya rechazadas.

## Halos

Rechazado:

- parallax global;
- halos pequeños genéricos por sección;
- movimiento que sigue al cursor todo el tiempo;
- azul como fondo.

Aprobado: H1.4.

## Work hero

Rechazado:

- WORK como hero final;
- CSS scale gigante;
- zoom que pixelaba;
- cámara al espacio entre E y apóstrofe;
- trasladar toda la palabra antes de acercarse;
- revelar el bone por porcentaje de scroll;
- esperar scroll adicional después de que la pantalla ya estaba blanca;
- yellow highlight detrás de `different`.

Aprobado: H2.11.x + MEDAL size H3 v7.

## H3 casos

Rechazado:

- pausa negra perceptible entre cada marca;
- esperar mirando halos entre casos;
- zoom `1.03 → 1`;
- imágenes que no corresponden a la marca;
- Züb representado por comida;
- Fiesta representado por Züb;
- metadata demasiado pequeña.

Aprobado:

- crossfade inmediato;
- imágenes full-screen sin animated scale;
- header grande;
- assets actuales de cada marca.

---

# 23. PRIORIDAD DE FUENTES

En caso de conflicto:

1. **Repositorio actual del usuario, último commit H3.**
2. **Este `MEDAL-MAESTRO-ACTUALIZADO-H3.md`.**
3. Feedback explícito nuevo del usuario.
4. `MEDAL-MAESTRO.md` original.
5. Referencias visuales antiguas.
6. ZIPs históricos.

No reinstalar H1/H2/H3 desde ZIP si el repo ya está actualizado.

---

# 24. CHECKPOINT ANTES DE H4

Antes de comenzar H4, comprobar solo esto:

```text
[ ] Estamos en rama rediseno-sitio.
[ ] El repo contiene el último H3 aprobado.
[ ] /work/ carga.
[ ] MEDAL inicial se ve grande.
[ ] El zoom sigue entrando al centro del apóstrofe.
[ ] El blanco dispara el contenido automáticamente.
[ ] No existe pausa muerta después del contenido.
[ ] H3 sigue inmediatamente.
[ ] Casos: Kjolle / Artech / Züb / Fiesta / Food Freaks.
[ ] Fiesta usa fiesta-cabrito-fuego-final.webp.
[ ] No aparece Züb dentro de Fiesta.
[ ] No hay black hold perceptible entre casos.
[ ] Las fotos no hacen zoom artificial.
[ ] Header se ve grande y legible.
```

Si todo está bien, no tocar esas secciones y avanzar.

---

# 25. PLAN DE HITOS RESTANTES

```text
H0  Entorno Vite / Git                         ✅ CERRADO
H1  Sistema global + halos                     ✅ CERRADO
H2  Entrada Work / MEDAL / apóstrofe           ✅ CERRADO
H3  Casos full screen                          ✅ CERRADO

H4  More than a portfolio + strip 4:5          ⏭ SIGUIENTE
H5  Resultados / métricas                      ⏳
H6  Logos + Availability                       ⏳
H7  Footer común                               ⏳
H8  Film                                       ⏳
H9  Services / medallas                        ⏳
H10 Risk reversal + Services close             ⏳
H11 Contact / Medal Session                    ⏳
H12 Confirmation                              ⏳
H13 Mobile + accessibility + performance + QA  ⏳
H14 Deploy / redirects / launch                ⏳
```

Los números H4–H14 son una organización operativa nueva para continuar el desarrollo. Lo importante es el orden, no el número si el repo adopta otro naming.

---

# 26. MEMORIA CORTA PARA OTRO CHAT

Si se necesita un resumen todavía más corto:

- Medal Website está en Vite, rama `rediseno-sitio`.
- H1–H3 están aprobados y el repo ya tiene el último commit H3.
- H1: dos halos globales grandes H1.4; nunca reescribir.
- H2: `/work/` inicia con wordmark MEDAL blanco, no WORK. MEDAL está más grande (`logoFraction 0.72`, stage `clamp(620px,72vw,1120px)`). E + apóstrofe quedan; zoom SVG `viewBox` entra al centro `257.475 / 48.8`; `finalHeight=3.0`; blanco real del apóstrofe dispara bone automáticamente; copy aparece word-by-word; no yellow highlight.
- H3: Kjolle → Artech → Züb Zero → Fiesta → Food Freaks. Full-screen. Crossfade continuo, sin hold negro perceptible, sin animated image zoom.
- Assets clave:
  - Kjolle `medal-01-tasting-menu.jpg`
  - Artech `assets/img/work/artech-classics.webp`
  - Züb `assets/img/work/zub-zero-hero-cover.webp`
  - Fiesta `assets/img/work/fiesta-cabrito-fuego-final.webp`
  - Food Freaks `medal-07-shared-table.jpg`
- Header `/work/` se hizo más grande; en bone Work activo es negro, no amarillo.
- Siguiente: H4 “More than a portfolio.” + tira 4:5 de 8–10 fotos.
- No tocar H1/H2/H3 para construir H4.

---

# 27. REGLA FINAL

El objetivo ya no es “seguir probando H1/H2/H3”.

Es:

> **conservar lo aprobado, avanzar verticalmente por el sitio y terminarlo por hitos.**

Cada nuevo hito debe integrarse debajo del anterior sin reabrir decisiones cerradas.
