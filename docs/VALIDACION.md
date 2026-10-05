# VALIDACIÓN DEL MASTER BUILD

Fecha: 2026-10-05

## Verificaciones realizadas

### Alcance protegido
Se calcularon hashes antes y después de implementar la nueva portada y Film & Services. Permanecen byte a byte iguales:

- `work/` y CSS/JS de Work;
- `contact/` y `contact/confirmed/`;
- `src/data/cases.json` y `src/data/strip.json`;
- `work-*.js`, `contact.js`, `confirmed.js` y sus hojas de estilo.

### Rutas Vite
`vite.config.js` mantiene las entradas multipágina para `/`, `/work/`, `/film-services/`, `/contact/` y `/contact/confirmed/`.

### JavaScript
`node --check` correcto en:

- `js/main.js`;
- `src/js/modules/film-services.js`.

Los módulos protegidos conservan los hashes del master 2026-10-03.

### JSON
Parse correcto de `src/data/reels.json`; los tres reels usan exclusivamente los videos y pósteres ya presentes en el repositorio.

### CSS
`css/styles.css` y `src/css/pages/film-services.css` fueron parseados sin errores de sintaxis.

### Reglas de Film & Services
- una sola referencia DOM a cada PNG Bronze/Silver/Gold;
- cero referencias a `rotateY`;
- eliminadas las estructuras `services-intro`, `medal-journey`, `plan-select` y `medal-cut`;
- `REEL_DWELL_MS = 10000`;
- movimiento de tira `42 px/s`;
- fallback `prefers-reduced-motion` presente.

### Audio Artech
El master previo ya confirmó AAC LC estéreo 44.1 kHz en `assets/video/artech-classic-cars.mp4`; el asset no fue modificado.

## Build Vite
No se generó `dist/` dentro del ZIP. Este entorno no tuvo acceso al registro npm para completar una instalación limpia de dependencias; por ello la validación final de Vite debe ejecutarse localmente:

```powershell
npm install
npm run build
npm run dev
```

No usar un `dist/` antiguo como fuente de verdad.
