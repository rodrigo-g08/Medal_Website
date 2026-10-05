# MAPA DE ARCHIVOS

## Infraestructura compartida

```text
src/js/main.js                     Inicializa shell Medal
src/js/modules/header.js           Cambio de tema del header + menú móvil
src/js/modules/halos.js            Halos globales
src/js/modules/buttons.js          Interacción botones
src/js/modules/smooth-scroll.js    Lenis / scroll global
src/css/tokens.css                 Variables de marca
src/css/base.css                   Base global
src/css/header.css                 Header
src/css/buttons.css                Botones
src/data/site.json                 Datos de sitio/capacidad/contacto
```

## Work

```text
work/index.html
src/js/pages/work.js
src/js/modules/work-intro.js
src/js/modules/work-cases.js
src/js/modules/work-h4-h6.js
src/css/pages/work.css
src/css/pages/work-cases.css
src/css/pages/work-h4-h6.css
src/data/cases.json
src/data/strip.json
assets/img/work/
assets/img/strip/
assets/logos/clients/
```

## Film & Services

```text
film-services/index.html
src/js/pages/film-services.js
src/js/modules/film-services.js
src/css/pages/film-services.css
src/data/reels.json
assets/img/film/
assets/img/film/medals/
assets/video/reels/
assets/video/artech-classic-cars.mp4
```

## Contact

```text
contact/index.html
src/js/pages/contact.js
src/js/modules/contact.js
src/css/pages/contact.css
```

## Confirmed

```text
contact/confirmed/index.html
src/js/pages/confirmed.js
src/js/modules/confirmed.js
src/css/pages/confirmed.css
```

## Portada inmersiva `/`

```text
index.html
css/styles.css
js/main.js
```

La portada reutiliza el header, botones, halos, Lenis y ScrollTrigger del shell compartido. Su transición desemboca en Work sin modificar los archivos de Work.

## Build

```text
vite.config.js
package.json
package-lock.json
```
