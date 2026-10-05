# MEDAL WEBSITE — MASTER BUILD 2026-10-05

Este ZIP es la **base maestra de continuidad** del rediseño de Medal Website. Está preparado para extraerse directamente en la raíz del repositorio `Medal_Website`; no contiene una carpeta contenedora y no incluye `node_modules`.

## Estado incluido

- `/work/` — Work H1–H6, última versión consolidada.
- `/film-services/` — Film & Services actualizado según `docs/MEDAL-PORTADA-Y-FILM-SERVICES-SPEC.md`: reels en tira/visor, escena única de medallas, hilo del apóstrofe y cierre de disponibilidad.
- `/contact/` — Medal Session fullscreen con mockup de calendario funcional.
- `/contact/confirmed/` — confirmación fullscreen con fecha/hora dinámica, checklist, Add to Calendar y video Artech.
- `/` — portada inmersiva: header común, video Artech y transición scroll-driven hacia `/work/` mediante el logotipo Medal.

## Fuente de verdad

Antes de modificar el proyecto en una conversación nueva, leer en este orden:

1. `MASTER-HANDOFF.md`
2. `docs/MEDAL-PORTADA-Y-FILM-SERVICES-SPEC.md`
3. `docs/QA-PENDIENTES.md`
4. `docs/ANIMACIONES-Y-REGLAS.md`
5. `docs/MAPA-ARCHIVOS.md`
6. `docs/NUEVA-CONVERSACION-PROMPT.md`
7. `docs/originales/MEDAL-MAESTRO-ACTUALIZADO-H3.md` como referencia histórica de H0–H3.

El **código de este ZIP** tiene prioridad sobre ZIPs anteriores. Los documentos de `docs/` describen el estado exacto de este build.

## Instalar sobre el repositorio

Desde PowerShell en la raíz de `Medal_Website`:

```powershell
Expand-Archive -LiteralPath "$env:USERPROFILE\Downloads\Medal_Website-MASTER-2026-10-05.zip" -DestinationPath . -Force
npm install
npm run dev
```

Si `node_modules` ya existe y está correcto, normalmente basta con:

```powershell
npm run dev
```

Rutas de revisión:

```text
http://localhost:5173/
http://localhost:5173/work/
http://localhost:5173/film-services/
http://localhost:5173/contact/
http://localhost:5173/contact/confirmed/
```

## Build

```powershell
npm run build
npm run preview
```

`dist/` no se considera fuente de verdad: regenerarlo después de cada lote de cambios.

## Stack

- Vite multipágina
- HTML semántico
- CSS modular
- JavaScript ES Modules
- GSAP + ScrollTrigger
- Lenis
- Archivo Variable
- IBM Plex Mono

## Regla de trabajo

No reconstruir páginas cerradas para resolver una corrección local. Trabajar sobre el archivo responsable del comportamiento y verificar regresiones en las tres rutas principales.
