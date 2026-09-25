#!/usr/bin/env bash
# Descarga las fotografías de Medal desde el sitio actual a assets/img
# Uso: bash scripts/descargar-fotos.sh
set -euo pipefail
BASE="https://medalusa.com/wp-content/uploads"
DEST="$(dirname "$0")/../assets/img"
mkdir -p "$DEST"
while read -r local remote; do
  echo "Descargando $local ..."
  curl -fsSL "$BASE/$remote" -o "$DEST/$local"
done <<LIST
medal-01-tasting-menu.jpg medalusa-gallery-16.jpg
medal-02-sashimi.jpg medalusa-gallery-21.jpg
medal-03-bar.jpg medalusa-gallery-1.jpg
medal-04-kitchen.jpg medalusa-gallery-6.jpg
medal-05-pour.jpg medalusa-gallery-3.jpg
medal-06-grill.jpg medalusa-gallery-9.jpg
medal-07-shared-table.jpg medalusa-gallery-14.jpg
medal-08-omakase.jpg medalusa-gallery-20.jpg
LIST
echo "Listo. Fotografías guardadas en assets/img"
