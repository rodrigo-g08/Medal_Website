# Descarga las fotografías de Medal desde el sitio actual a assets/img
# Uso (desde la raíz del repositorio, en PowerShell):
#   powershell -ExecutionPolicy Bypass -File .\scripts\descargar-fotos.ps1

$ErrorActionPreference = 'Stop'
$base = 'https://medalusa.com/wp-content/uploads'
$dest = Join-Path $PSScriptRoot '..\assets\img'
New-Item -ItemType Directory -Force -Path $dest | Out-Null

$fotos = [ordered]@{
  'medal-01-tasting-menu.jpg'  = 'medalusa-gallery-16.jpg'
  'medal-02-sashimi.jpg'       = 'medalusa-gallery-21.jpg'
  'medal-03-bar.jpg'           = 'medalusa-gallery-1.jpg'
  'medal-04-kitchen.jpg'       = 'medalusa-gallery-6.jpg'
  'medal-05-pour.jpg'          = 'medalusa-gallery-3.jpg'
  'medal-06-grill.jpg'         = 'medalusa-gallery-9.jpg'
  'medal-07-shared-table.jpg'  = 'medalusa-gallery-14.jpg'
  'medal-08-omakase.jpg'       = 'medalusa-gallery-20.jpg'
}

foreach ($nombre in $fotos.Keys) {
  $url = "$base/$($fotos[$nombre])"
  $archivo = Join-Path $dest $nombre
  Write-Host "Descargando $nombre ..."
  Invoke-WebRequest -Uri $url -OutFile $archivo -UseBasicParsing
}
Write-Host "Listo. Fotografias guardadas en assets\img" -ForegroundColor Green
