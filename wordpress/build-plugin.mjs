// Genera el plugin de WordPress «Medal Site» a partir del sitio de Vite.
//
// Uso, desde la raíz del repositorio:
//   node wordpress/build-plugin.mjs
//
// Resultado:
//   wordpress/medal-site/dist/   sitio compilado
//   wordpress/medal-site.zip     plugin listo para subir en WordPress
//
// No modifica ningún archivo del sitio.

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const pluginDir = path.join(here, "medal-site");
const dist = path.join(pluginDir, "dist");

// Debe coincidir con MEDAL_SITE_BUILD_BASE en medal-site.php.
const BASE = "/wp-content/plugins/medal-site/dist/";

const run = (cmd) => execSync(cmd, { cwd: root, stdio: "inherit" });

console.log("1/4 · Compilando con Vite…");
fs.rmSync(dist, { recursive: true, force: true });
run(`npx vite build --base=${BASE} --outDir "${dist}" --emptyOutDir`);

// Rutas que el navegador pide en tiempo de ejecución (datos JSON, videos,
// logotipos). Vite no las reescribe porque viven dentro de cadenas de texto.
console.log("2/4 · Ajustando rutas de /assets/…");
const textFiles = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(html|js|css)$/.test(entry.name)) textFiles.push(full);
  }
};
walk(dist);

const runtimeRef = /(?<![\w./-])\/assets\/([\w@%+~./-]+\.[a-zA-Z0-9]{2,5})/g;
const needed = new Set();
let rewritten = 0;

for (const file of textFiles) {
  const before = fs.readFileSync(file, "utf8");
  const after = before.replace(runtimeRef, (match, rel) => {
    if (!fs.existsSync(path.join(root, "assets", rel))) return match;
    needed.add(rel);
    rewritten += 1;
    return `${BASE}assets/${rel}`;
  });
  if (after !== before) fs.writeFileSync(file, after);
}

console.log(`      ${rewritten} referencias ajustadas, ${needed.size} archivos.`);

console.log("3/4 · Copiando los archivos que se piden en tiempo de ejecución…");
for (const rel of needed) {
  const target = path.join(dist, "assets", rel);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(path.join(root, "assets", rel), target);
}

// Comprobación: no debe quedar ninguna ruta absoluta sin el prefijo del plugin.
const leftovers = [];
for (const file of textFiles) {
  const text = fs.readFileSync(file, "utf8");
  const found = text.match(/(?<![\w./-])\/(assets|src|css|js)\/[\w@%+~./-]+\.[a-zA-Z0-9]{2,5}/g);
  if (found) leftovers.push(`${path.relative(dist, file)}: ${[...new Set(found)].join(", ")}`);
}
if (leftovers.length) {
  console.warn("      Aviso: quedaron rutas sin ajustar:\n      " + leftovers.join("\n      "));
}

console.log("4/4 · Empaquetando medal-site.zip…");
const zipPath = path.join(here, "medal-site.zip");
fs.rmSync(zipPath, { force: true });
try {
  if (process.platform === "win32") {
    execSync(
      `powershell -NoProfile -Command "Compress-Archive -Path '${pluginDir}' -DestinationPath '${zipPath}' -Force"`,
      { stdio: "inherit" }
    );
  } else {
    execSync(`zip -rq "${zipPath}" medal-site`, { cwd: here, stdio: "inherit" });
  }
  const mb = (fs.statSync(zipPath).size / 1048576).toFixed(1);
  console.log(`\nListo: wordpress/medal-site.zip (${mb} MB)`);
} catch (error) {
  console.warn("\nNo se pudo crear el ZIP automáticamente. Comprime la carpeta wordpress/medal-site a mano.");
}
