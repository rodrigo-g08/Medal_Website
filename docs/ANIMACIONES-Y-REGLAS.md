# ANIMACIONES Y REGLAS DE INTERACCIÓN

Este archivo describe la intención, no solo la implementación actual.

## 1. Halos globales
- Movimiento lento y autónomo.
- Fondo base siempre negro.
- Azul funciona como luz.
- Evitar detenerlos por hover.
- Evitar halos diferentes/estáticos por sección si pueden verse los globales.

## 2. Scroll premium
- Lenis + GSAP/ScrollTrigger.
- Scroll amortiguado, nunca snap rígido.
- Flick fuerte no debe saltar narrativas enteras.
- No crear secciones que exijan “otro scroll” después de que visualmente ya terminó la animación.

## 3. Yellow sweep
Patrón aprobado:

```text
BASE → AMARILLO ENTRA → AMARILLO RECORRE → AMARILLO SALE → BASE
```

Implementación conceptual preferida: dos capas del mismo texto, overlay amarillo recortado por `clip-path`.

Reproducir con entrada y entrada inversa. Resetear el overlay al final.

## 4. Work H3
```text
foto A
→ oscurece
→ negro breve
→ foto B entra desde negro
→ copy B aparece levemente después
```

## 5. Work H4
### AUTO
Velocidad lenta a la izquierda.

### EXPLORE
Cursor en zona de imágenes controla velocidad y dirección. Sin click.

### FOCUS
Cursor estable sobre imagen:
- pausa horizontal;
- imagen sube ~30–40 px;
- ligera escala;
- marca visible.

Al mover cursor: vuelve a EXPLORE.
Al salir: AUTO.

## 6. KPI / counters
Cada reentrada debe volver a cero/inicio y reproducir contador + línea.

## 7. Medallas Film
Entrada desde abajo con stagger y profundidad.
Selección:
- botón amarillo;
- rotateY lento;
- otras medallas bajan presencia;
- CTA actualiza.

No girar en loop permanente.

## 8. Gold exposure
Debe ser una transformación del mismo objeto Gold ya visible.
No duplicar la medalla en otra sección.

## 9. Medal Cut / rombo
La forma geométrica de Medal puede actuar como transición conceptual. Debe sentirse ligada al scroll y revelar la siguiente escena, no como un slide separado.

## 10. Contact Outcomes
- línea vertical crece según scroll;
- 01, 02, 03 se activan progresivamente;
- número recibe amarillo temporal;
- punto/marker se enciende;
- sin imagen lateral en la versión actual.

## 11. Calendario Contact
Interacción frontend real aunque Calendly no esté conectado:
- seleccionar fecha;
- horas cambian por fecha;
- seleccionar hora;
- Confirm habilitado solo con ambos;
- pasa start/end dinámicos a Confirmed.

## 12. Cortina Contact
Opción A aprobada:

```text
scheduler oscuro
→ click Confirm
→ bone sube desde abajo
→ logo Medal negro centro
→ bone 100%
→ cambiar ruta
→ Confirmed bone ya visible
→ logo central desaparece
→ contenido entra
```

No texto “Booking your session”. Solo logo durante transición.
