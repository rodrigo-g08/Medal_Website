# Medal Website

Página provisional de **medalusa.com** mientras se prepara el nuevo sitio. Es un sitio estático (HTML, CSS y JavaScript), sin dependencias ni proceso de compilación.

## Estructura

La página tiene dos secciones: una portada a pantalla completa con el video de Artech en bucle, y una sección de mensaje y formulario sobre un fondo de malla azul difuminada. La galería de fotografías y la fila de marcas quedaron fuera de esta etapa; se retoman más adelante.

```
index.html                 Página provisional «A new Medal is in the making»
css/styles.css             Estilos (paleta y tipografía en variables al inicio)
js/main.js                 Control de sonido del video y envío del formulario
assets/logo-medal.svg      Logotipo oficial de Medal
assets/favicon.svg         Ícono de pestaña (marca amarilla)
assets/fonts/              Tipografías autoalojadas (licencia OFL)
assets/video/              Video original de portada (Artech) con su pista de audio
assets/img/hero-poster.jpg Fotograma de respaldo del video (móviles y carga inicial)
assets/img/                Banco de fotografías para la futura galería (aún no enlazadas)
scripts/descargar-fotos.*  Descarga las fotografías originales desde el sitio actual
boceto-01/                 Concepto de landing anterior, conservado como referencia
```

## Puesta en marcha

1. Probar en local con un servidor (el formulario no envía desde `file://`):

   ```powershell
   npx serve .
   ```

   o con la extensión Live Server de VS Code. Luego abrir la dirección que indique (por ejemplo `http://localhost:3000`).

2. El video de portada ya está incluido en `assets/video/artech-classic-cars.mp4` exactamente con los bytes del archivo suministrado, sin recomprimir y conservando su pista AAC. Por políticas de los navegadores, el autoplay inicia en silencio; el control circular inferior habilita el audio con un clic.

## Reemplazar la versión actual del repositorio

El ZIP está preparado para descomprimirse directamente en la raíz de `Medal_Website` (no crea una carpeta contenedora extra). Con el archivo descargado como `medal-pagina-provisional.zip`:

```powershell
git mv styles.css script.js README.txt boceto-01/ 2>$null; Remove-Item styles.css, script.js, README.txt, assets\poster.svg -ErrorAction SilentlyContinue
Expand-Archive "$env:USERPROFILE\Downloads\medal-pagina-provisional.zip" -DestinationPath . -Force
powershell -ExecutionPolicy Bypass -File .\scripts\descargar-fotos.ps1
npx serve .
```

Cuando lo hayas revisado en local:

```powershell
git status
git add .
git commit -m "fix: restore Medal provisional hero audio and contact mesh"
git push
```

## Formulario de contacto

El formulario envía las consultas a **info@medalusa.com** mediante [FormSubmit](https://formsubmit.co), un servicio gratuito que no requiere servidor propio.

1. La primera vez que alguien envíe el formulario desde el sitio publicado, FormSubmit enviará a info@medalusa.com un correo de activación. Alguien con acceso a esa bandeja debe hacer clic en **Activate Form**. Desde ese momento, cada consulta llega como correo con nombre y email, y el botón «Responder» contesta directamente al cliente.
2. En el correo de activación, FormSubmit entrega un alias aleatorio. Se recomienda reemplazar el correo en `js/main.js` (`CONFIG.formEndpoint`) por ese alias, para que la dirección no quede visible en el código.
3. El formulario incluye un campo trampa contra bots y validación de nombre y correo. Visualmente se mantiene intencionalmente mínimo para respetar el boceto de referencia.

Si en el futuro se prefiere otro servicio (Web3Forms, Formspree o un endpoint propio), basta con cambiar `CONFIG.formEndpoint` y el objeto `data` en `js/main.js`.

## Personalización rápida

- **Tipografía:** Archivo (variable, con eje de anchura) e IBM Plex Mono, autoalojadas en `assets/fonts`. Se cambian en las reglas `@font-face` y en las variables `--font-display` y `--font-mono` de `css/styles.css`.
- **Color azul de marca:** variable `--blue` (`#0842FB`) en `css/styles.css`. Se usa en el botón, en los enlaces al pasar el cursor y en la malla difuminada de la sección de mensaje.
- **Video de portada:** `assets/video/artech-classic-cars.mp4` y su fotograma de respaldo `assets/img/hero-poster.jpg`, referenciados en la sección `.hero` de `index.html`.
- **Malla de fondo:** se construye con varias capas de `radial-gradient` en `.mesh`, concentrando el azul en la esquina inferior izquierda como en el boceto de referencia.
- **Redes sociales:** reemplazar los enlaces de Instagram y Facebook en `index.html` por las cuentas oficiales de Medal.

## Publicación

Al ser estático, puede publicarse en GitHub Pages, Netlify, Vercel o subirse al hosting actual de medalusa.com. Si se reemplaza temporalmente el WordPress, conviene conservar una copia de seguridad completa del sitio y de su base de datos antes de hacerlo.

## Formulario de prueba

El formulario está conectado temporalmente a `rgamero406@gmail.com` mediante FormSubmit. En el primer envío, FormSubmit puede pedir activar ese correo desde el mensaje de confirmación que enviará al inbox. Para pasar luego al correo definitivo de Medal, cambia `formEndpoint` y `fallbackEmail` en `js/main.js`.

