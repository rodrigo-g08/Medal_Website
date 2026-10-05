# INTEGRACIÓN FUTURA CON WORDPRESS

## Dirección recomendada

Convertir la experiencia final en un **theme personalizado de WordPress**.

WordPress gestiona contenido; el código actual conserva diseño y animación.

```text
WordPress / Media Library / campos
                ↓
Templates PHP / REST según necesidad
                ↓
CSS + JS Medal compilado con Vite
                ↓
GSAP / Lenis / animaciones actuales
```

## Qué debería editarse desde WP

- Work projects: título, industria, lugar, hero, galería, video, orden.
- More than a portfolio: imágenes + brand label.
- Selected Brands: logo + orden.
- Results: valor, copy y fuente/cliente.
- Availability: total y ocupados.
- Film: reels y hero film.
- Medal plans: copy Bronze/Silver/Gold.
- Contact: disponibilidad/calendario o Calendly URL.
- WhatsApp oficial.

## Qué NO debería depender del editor visual de WordPress

- GSAP timelines.
- ScrollTrigger.
- halos.
- cursor steering.
- transiciones Gold/bone.
- Medal Cut.
- curtain Contact.

Esas interacciones deben seguir en el código del theme.

## Camino de migración

1. terminar Work + Film + Contact en Vite;
2. congelar visual/UX;
3. mapear campos editables;
4. crear theme `medal`;
5. convertir HTML a templates PHP;
6. encolar CSS/JS compilado;
7. sustituir JSON hardcoded por campos WP;
8. QA de animaciones;
9. redirecciones de páginas WordPress antiguas.
