# Implementación · Portada + Film & Services · 2026-10-05

Base aplicada: `Medal_Website-MASTER-2026-10-03`.
Especificación: `docs/MEDAL-PORTADA-Y-FILM-SERVICES-SPEC.md`.

## Cambios integrados

- Portada `/`: header común, escena `.cover` de 460svh, máscara SVG del logotipo, transición video → Medal → Work, sonido conservado, CTA de consulta hacia `/contact/` y fallback para `prefers-reduced-motion`.
- Film & Services: film hero conservado; Reels dinámicos desde `src/data/reels.json`, tira a 42 px/s, dwell de 10 s, visor fullscreen con FLIP, navegación/replay/Esc y bloqueo de Lenis.
- Medallas: una única instancia DOM por Bronze/Silver/Gold, sin `rotateY`, escena scroll-driven y aterrizaje en tarjetas.
- Hilo del apóstrofe: transición scroll-driven hacia Availability.
- Availability: contenido y datos siguen viniendo de `src/data/site.json`.

## Protección de alcance

Se verificaron hashes antes y después: `work/`, `contact/`, `contact/confirmed/`, `cases.json`, `strip.json`, módulos `work-*`, `contact.js`, `confirmed.js` y sus CSS no cambiaron.

## Validaciones realizadas

- `node --check` en `js/main.js` y `src/js/modules/film-services.js`: OK.
- `src/data/reels.json`: JSON válido.
- CSS nuevo parseado sin errores de sintaxis.
- Cada PNG de medalla aparece una sola vez en `film-services/index.html`.
- No quedan referencias a `rotateY`, `services-intro`, `medal-journey`, `plan-select` ni `medal-cut` en la nueva implementación de Film & Services.
- El ZIP final se genera sin `node_modules` ni carpeta envolvente.

## Verificación local recomendada

```powershell
npm install
npm run dev
```

Revisar `/`, `/work/`, `/film-services/`, `/contact/` y `/contact/confirmed/`, además de 1440×900 y 390×844.
