#!/usr/bin/env node
/**
 * Guarda una copia de una propuesta antes de que la modifiquen.
 *
 * Las copias viven en data/propuestas-versiones/<slug>/, fuera de
 * data/propuestas, para que getAllPropuestaSlugs() no las vea y no se genere
 * una ruta pública por cada versión: son backup, no contenido.
 *
 * Se invoca de dos formas:
 *   - Como hook PreToolUse, leyendo el JSON de la herramienta por stdin.
 *   - A mano, pasando la ruta: node scripts/archivar-propuesta.mjs <archivo>
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const origenDir = path.join(root, "data", "propuestas");
const versionesDir = path.join(root, "data", "propuestas-versiones");

/** El JSON del hook llega por stdin; a mano llega como argumento. */
async function rutaObjetivo() {
  const arg = process.argv[2];
  if (arg) return path.resolve(arg);

  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf-8").trim();
  if (!raw) return null;

  const filePath = JSON.parse(raw)?.tool_input?.file_path;
  return filePath ? path.resolve(filePath) : null;
}

/** "2026-08-09_143052" — ordena cronológicamente al listar el directorio. */
function marcaDeTiempo(fecha) {
  const p = (n) => String(n).padStart(2, "0");
  const dia = `${fecha.getFullYear()}-${p(fecha.getMonth() + 1)}-${p(fecha.getDate())}`;
  const hora = `${p(fecha.getHours())}${p(fecha.getMinutes())}${p(fecha.getSeconds())}`;
  return `${dia}_${hora}`;
}

/** La última versión archivada, para no guardar dos copias idénticas. */
function ultimaVersion(dir) {
  try {
    const archivos = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".json"))
      .sort();
    const ultimo = archivos.at(-1);
    return ultimo ? fs.readFileSync(path.join(dir, ultimo), "utf-8") : null;
  } catch {
    return null;
  }
}

const objetivo = await rutaObjetivo();

// Solo interesan las propuestas. Cualquier otro archivo pasa de largo.
if (
  !objetivo ||
  !objetivo.endsWith(".json") ||
  path.dirname(objetivo) !== origenDir
) {
  process.exit(0);
}

// Una propuesta nueva todavía no tiene versión anterior que guardar.
if (!fs.existsSync(objetivo)) process.exit(0);

const slug = path.basename(objetivo, ".json");
const destinoDir = path.join(versionesDir, slug);
const contenido = fs.readFileSync(objetivo, "utf-8");

if (ultimaVersion(destinoDir) === contenido) process.exit(0);

fs.mkdirSync(destinoDir, { recursive: true });

// Dos ediciones dentro del mismo segundo comparten marca de tiempo: se
// desempatan con un sufijo en vez de pisarse entre ellas.
const base = marcaDeTiempo(new Date());
let destino = path.join(destinoDir, `${base}.json`);
for (let n = 2; fs.existsSync(destino); n++) {
  destino = path.join(destinoDir, `${base}-${n}.json`);
}

fs.writeFileSync(destino, contenido);
console.log(
  JSON.stringify({
    systemMessage: `Versión guardada: data/propuestas-versiones/${slug}/${path.basename(destino)}`,
  })
);
