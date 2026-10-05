# PROMPT RECOMENDADO PARA INICIAR UN NUEVO CHAT

Copia este texto y adjunta `Medal_Website-MASTER-2026-10-03.zip`:

> Estoy continuando el rediseño de Medal Website. Este ZIP maestro contiene el estado consolidado más reciente de Work, Film & Services, Contact y Contact Confirmed. Lee primero `MASTER-HANDOFF.md`, luego `docs/QA-PENDIENTES.md`, `docs/ANIMACIONES-Y-REGLAS.md` y `docs/MAPA-ARCHIVOS.md`. No apliques ZIPs antiguos ni reconstruyas secciones aprobadas. Trabaja sobre esta base y devuelve siempre ZIPs completos aplanados desde la raíz, sin carpeta contenedora y sin `node_modules`. La prioridad inmediata es corregir errores/animaciones sin introducir regresiones. Antes de tocar una sección, identifica su HTML/CSS/JS responsable. Si hago una corrección puntual, no alteres otras páginas salvo infraestructura compartida estrictamente necesaria.

Para el primer turno de correcciones se recomienda añadir:

> Empieza por `/contact/confirmed/`: el video Artech tiene audio AAC estéreo pero actualmente no se escucha al darle play. Después revisaremos la continuidad de la cortina Contact → Confirmed y luego las animaciones Yellow Sweep de Film.
