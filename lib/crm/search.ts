import type { Deal, NoteKind } from "@/types/crm";

/**
 * Campos de texto libre por los que se busca. Teléfono y correo quedan fuera a
 * propósito: esos no se buscan, se tocan.
 */
const DEAL_FIELDS = [
  "client_name",
  "project_name",
  "source",
  "next_step",
  "slug",
] as const;

/** Cuántos caracteres de contexto se muestran a cada lado de la coincidencia. */
const CONTEXT = 42;

/**
 * Pliega el texto para comparar: sin tildes y en minúscula.
 *
 * En español hace falta. Quien escribe «bogota» quiere encontrar «Bogotá», y
 * quien escribe «munoz» quiere encontrar «Muñoz» —la ñ se pliega a n con el
 * mismo criterio, que es lo que uno espera al teclear rápido en el teléfono.
 *
 * Devuelve además un mapa de posiciones: cada índice del texto plegado apunta
 * al del original. Sin él no se podría recortar el extracto, porque quitar una
 * tilde cambia el largo y las posiciones dejarían de calzar.
 */
function fold(text: string): { folded: string; map: number[] } {
  let folded = "";
  const map: number[] = [];

  for (let i = 0; i < text.length; ) {
    const char = String.fromCodePoint(text.codePointAt(i)!);
    const plain = char
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase();

    folded += plain;
    for (let k = 0; k < plain.length; k++) map.push(i);
    i += char.length;
  }

  // Centinela: deja que una coincidencia que termina al final del texto pueda
  // preguntar por su posición de cierre sin salirse del mapa.
  map.push(text.length);
  return { folded, map };
}

export function normalize(text: string): string {
  return fold(text).folded;
}

/** El pedazo de una nota donde está lo buscado, partido para poder resaltarlo. */
export interface Excerpt {
  before: string;
  match: string;
  after: string;
}

/**
 * Recorta la nota alrededor de la coincidencia.
 *
 * Mostrar el principio de la nota no serviría: si lo buscado está en el
 * renglón diez, uno leería un texto que no explica por qué apareció en los
 * resultados.
 */
export function excerpt(body: string, query: string): Excerpt | null {
  const needle = normalize(query);
  if (needle === "") return null;

  const { folded, map } = fold(body);
  const at = folded.indexOf(needle);
  if (at === -1) return null;

  const start = map[at];
  const end = map[at + needle.length];

  const from = Math.max(0, start - CONTEXT);
  const to = Math.min(body.length, end + CONTEXT);

  let before = body.slice(from, start);
  let after = body.slice(end, to);

  // Cortar a mitad de palabra se lee como un error de dedo. Si hubo recorte, la
  // palabra partida se va entera y en su lugar quedan los puntos suspensivos.
  if (from > 0) before = `…${before.replace(/^\S*\s+/, "")}`;
  if (to < body.length) after = `${after.replace(/\s+\S*$/, "")}…`;

  return { before, match: body.slice(start, end), after };
}

export function dealMatches(deal: Deal, query: string): boolean {
  const needle = normalize(query);
  return DEAL_FIELDS.some((field) => {
    const value = deal[field];
    return value !== null && normalize(value).includes(needle);
  });
}

/** Lo que hace falta de una nota para buscar en ella. */
export interface SearchableNote {
  deal_id: number;
  kind: NoteKind;
  body: string;
  occurred_at: string;
}

export interface NoteHit extends Excerpt {
  kind: NoteKind;
  occurred_at: string;
}

/** Un negocio que salió en la búsqueda, con la nota que lo trajo (si fue una). */
export interface SearchResult {
  deal: Deal;
  /** La coincidencia más reciente en la bitácora; null si coincidió el negocio. */
  hit: NoteHit | null;
  /** Cuántas otras notas del mismo negocio coincidieron. */
  extra: number;
}

/**
 * Los negocios que coinciden, por sus campos o por su bitácora.
 *
 * Las notas deben venir ordenadas de la más reciente a la más vieja: de varias
 * coincidencias dentro de un mismo negocio se muestra la primera, y lo último
 * que se dijo del asunto es casi siempre lo que uno anda buscando.
 */
export function searchDeals(
  deals: Deal[],
  notes: SearchableNote[],
  query: string
): SearchResult[] {
  const hits = new Map<number, NoteHit[]>();

  for (const note of notes) {
    const found = excerpt(note.body, query);
    if (!found) continue;

    const list = hits.get(note.deal_id) ?? [];
    list.push({ ...found, kind: note.kind, occurred_at: note.occurred_at });
    hits.set(note.deal_id, list);
  }

  return deals
    .map((deal): SearchResult | null => {
      const matched = hits.get(deal.id) ?? [];
      if (matched.length === 0 && !dealMatches(deal, query)) return null;
      return {
        deal,
        hit: matched[0] ?? null,
        extra: Math.max(0, matched.length - 1),
      };
    })
    .filter((result): result is SearchResult => result !== null);
}
