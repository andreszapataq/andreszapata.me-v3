import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  pendingChanges,
  readPropuestasAsDeals,
  readPropuestasBySlug,
} from "@/lib/crm/seed";
import { seedFromPropuestas, signOut } from "@/lib/crm/actions";
import {
  NOTE_GLYPH,
  STATUS_TONE,
  daysFromToday,
  formatDateShort,
  formatDay,
  formatMoney,
  noteDay,
  relativeDays,
  sumByCurrency,
  todayISO,
} from "@/lib/crm/format";
import type { Deal } from "@/types/crm";
import { crmPath } from "@/lib/crm/route";
import { VIEWS, isOpen, matchesView, type View } from "@/lib/crm/views";
import {
  searchDeals,
  type NoteHit,
  type SearchableNote,
  type SearchResult,
} from "@/lib/crm/search";
import { HiddenAlertsBadge } from "@/components/crm/hidden-alerts";
import SearchRow from "@/components/crm/search-row";

export const dynamic = "force-dynamic";

const TONE_CLASS = {
  dim: "text-crm-dim",
  text: "text-crm-text",
  accent: "text-crm-accent",
  amber: "text-crm-amber",
  red: "text-crm-red",
} as const;

/** Abiertos arriba, ordenados por lo que hay que hacer antes. */
function sortDeals(a: Deal, b: Deal) {
  if (isOpen(a) !== isOpen(b)) return isOpen(a) ? -1 : 1;

  if (isOpen(a)) {
    // Sin paso vale hoy, no el fin de los tiempos: un negocio abierto al que no
    // le queda nada por hacer es justo el que hay que decidir. Con el fondo de
    // la lista como destino, cada tarea cumplida hundiría su negocio.
    const today = todayISO();
    const aDue = a.next_step_at ?? today;
    const bDue = b.next_step_at ?? today;
    if (aDue !== bDue) return aDue.localeCompare(bDue);
    return (b.sent_at ?? "").localeCompare(a.sent_at ?? "");
  }

  return (b.closed_at ?? b.updated_at).localeCompare(a.closed_at ?? a.updated_at);
}

/**
 * La nota que trajo a este negocio a los resultados, con lo buscado resaltado.
 *
 * Va debajo de la fila y no en lugar de ella: así un negocio con tres notas
 * que coinciden sigue siendo una línea en la lista y no tres.
 */
function NoteMatch({ hit, extra }: { hit: NoteHit; extra: number }) {
  return (
    <p className="mt-1.5 text-sm text-crm-faint">
      <span aria-hidden className="crm-mono">
        {NOTE_GLYPH[hit.kind]}{" "}
      </span>
      {hit.before}
      {/* Sin fondo amarillo: aquí resaltar es pesar más que lo de al lado. */}
      <mark className="bg-transparent font-medium text-crm-text">
        {hit.match}
      </mark>
      {hit.after}
      <span className="crm-mono">
        {" · "}
        {formatDay(noteDay(hit.occurred_at))}
        {extra > 0 && ` · +${extra}`}
      </span>
    </p>
  );
}

function DealLine({
  deal,
  index,
  outdated,
  hit = null,
  extra = 0,
}: {
  deal: Deal;
  index: number;
  outdated: boolean;
  hit?: NoteHit | null;
  extra?: number;
}) {
  const dueIn = daysFromToday(deal.next_step_at);
  const validIn = isOpen(deal) ? daysFromToday(deal.valid_until) : null;

  const meta = [
    deal.amount !== null ? formatMoney(deal.amount, deal.currency) : null,
    deal.sent_at ? `enviada ${relativeDays(deal.sent_at)}` : null,
    validIn !== null
      ? validIn < 0
        ? "propuesta vencida"
        : `vence ${relativeDays(deal.valid_until)}`
      : null,
  ].filter(Boolean);

  return (
    <Link
      href={crmPath(`/${deal.id}`)}
      className="crm-row block border-b border-crm-line px-3 py-4 transition-colors hover:bg-black/2"
      style={{ animationDelay: `${Math.min(index, 12) * 35}ms` }}
    >
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-medium">{deal.client_name}</span>
        <span className={`crm-mono shrink-0 text-sm ${TONE_CLASS[STATUS_TONE[deal.status]]}`}>
          {deal.status}
        </span>
      </div>

      {deal.project_name && (
        <p className="mt-0.5 text-crm-dim">{deal.project_name}</p>
      )}

      {meta.length > 0 && (
        <p
          className={`crm-mono mt-1 text-sm ${
            validIn !== null && validIn < 0 ? "text-crm-red" : "text-crm-faint"
          }`}
        >
          {meta.join(" · ")}
        </p>
      )}

      {outdated && (
        <p className="crm-mono mt-1 text-sm text-crm-accent">
          ⟳ la propuesta cambió
        </p>
      )}

      {deal.next_step ? (
        <p
          className={`mt-1.5 text-sm ${
            dueIn !== null && dueIn <= 0 ? "text-crm-amber" : "text-crm-dim"
          }`}
        >
          → {deal.next_step}
          {deal.next_step_at && ` · ${formatDateShort(deal.next_step_at)}`}
        </p>
      ) : (
        // El silencio era peor: un negocio abierto sin paso siguiente está a la
        // deriva y no se distinguía de uno atendido. En faint porque es una
        // ausencia, no una urgencia. Los cerrados no lo piden.
        isOpen(deal) && (
          <p className="mt-1.5 text-sm text-crm-faint">→ sin próximo paso</p>
        )
      )}

      {hit && <NoteMatch hit={hit} extra={extra} />}
    </Link>
  );
}

/**
 * Las notas en las que se puede buscar: las que escribiste tú.
 *
 * Se traen todas y se filtran aquí, en vez de pedirle el `ilike` a Postgres,
 * porque el plegado de tildes tiene que ser el mismo que el de los nombres:
 * `ilike` no encontraría «Bogotá» buscando «bogota» y la búsqueda se
 * comportaría distinto según dónde estuviera la palabra. A esta escala —unos
 * cientos de notas cortas— traerlas sale más barato que la inconsistencia; el
 * día que sean miles, la salida es la extensión `unaccent` y un índice.
 */
async function readSearchableNotes(
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<SearchableNote[]> {
  const { data } = await supabase
    .from("crm_notes")
    .select("deal_id, kind, body, occurred_at")
    // Las de `estado` las escribió el CRM al mover el negocio, no tú: buscar
    // «ganada» sacaría media bitácora sin decir nada que la lista no diga ya.
    .neq("kind", "estado")
    .order("occurred_at", { ascending: false })
    .order("created_at", { ascending: false });

  return (data ?? []) as SearchableNote[];
}

export default async function CrmPage({
  searchParams,
}: {
  searchParams: Promise<{ ver?: string; q?: string }>;
}) {
  const { ver, q } = await searchParams;
  const view: View = VIEWS.includes(ver as View) ? (ver as View) : "abiertas";

  // Buscar ignora el corte: cuando uno no encuentra algo, lo último que quiere
  // es que la respuesta esté escondida detrás de la pestaña equivocada.
  const query = (q ?? "").trim();
  const searching = query !== "";

  const supabase = await createClient();
  const { data, error } = await supabase.from("crm_deals").select("*");

  if (error) {
    return (
      <main className="mx-auto w-full max-w-crm px-6 py-16 crm-page">
        <p className="text-crm-red">No se pudo leer el CRM: {error.message}</p>
      </main>
    );
  }

  const deals = (data ?? []) as Deal[];
  const open = deals.filter(isOpen);

  const visible: SearchResult[] = searching
    ? searchDeals(deals, await readSearchableNotes(supabase), query).sort(
        (a, b) => sortDeals(a.deal, b.deal)
      )
    : deals
        .filter((d) => matchesView(d, view))
        .sort(sortDeals)
        .map((deal) => ({ deal, hit: null, extra: 0 }));

  const dueToday = open.filter((d) => {
    const diff = daysFromToday(d.next_step_at);
    return diff !== null && diff <= 0;
  }).length;

  const knownSlugs = new Set(deals.map((d) => d.slug).filter(Boolean));
  const pendingImport = readPropuestasAsDeals().filter(
    (p) => !knownSlugs.has(p.slug)
  ).length;

  // Las propuestas viven en el repo, así que basta con releerlas en cada carga:
  // no hay nada que avisar desde afuera cuando cambia un JSON.
  const propuestas = readPropuestasBySlug();
  const outdated = new Set(
    deals
      .filter(
        (d) => d.slug && pendingChanges(d, propuestas.get(d.slug)).length > 0
      )
      .map((d) => d.id)
  );

  return (
    <main className="mx-auto w-full max-w-crm px-6 pt-12 pb-20 crm-page">
      <header className="flex items-baseline justify-between">
        <h1 className="text-2xl font-medium tracking-tight">
          crm
          <HiddenAlertsBadge />
        </h1>
        <form action={signOut}>
          <button type="submit" className="crm-mono text-sm text-crm-faint crm-tap">
            salir
          </button>
        </form>
      </header>

      <p className="crm-mono mt-4 text-crm-dim">
        {open.length === 0
          ? "Nada abierto ahora mismo."
          : `${open.length} ${open.length === 1 ? "abierta" : "abiertas"} · ${sumByCurrency(open)} en juego`}
      </p>

      {/* Las propuestas vencidas no se cuentan aquí: la fila ya las grita en
          rojo, y un contador de lo que se ve al hojear es ruido —era el que
          empujaba esta línea a un segundo renglón.

          `whitespace-nowrap` en cada contador para que, cuando dos coincidan y
          no quepan (~46 caracteres contra los ~38 de un teléfono angosto), la
          línea parta en el separador y no a mitad de frase. */}
      {(dueToday > 0 || outdated.size > 0) && (
        <p className="crm-mono mt-1 text-sm">
          {[
            dueToday > 0 && (
              <span key="due" className="whitespace-nowrap text-crm-amber">
                {dueToday} {dueToday === 1 ? "pendiente" : "pendientes"} para hoy
              </span>
            ),
            outdated.size > 0 && (
              <span key="outdated" className="whitespace-nowrap text-crm-accent">
                {outdated.size}{" "}
                {outdated.size === 1
                  ? "propuesta cambió"
                  : "propuestas cambiaron"}
              </span>
            ),
          ]
            .filter(Boolean)
            .map((item, i) => (
              <span key={i}>
                {i > 0 && <span className="text-crm-faint"> · </span>}
                {item}
              </span>
            ))}
        </p>
      )}

      <SearchRow view={view} query={query} />

      {/* La lista se sale 12px a cada lado del texto: así el fondo del hover
          respira alrededor de la fila sin que el contenido se corra. */}
      <section className="-mx-3 mt-4 border-t border-crm-line">
        {visible.length === 0 ? (
          <p className="px-3 py-8 text-crm-faint">
            {searching
              ? `Nada con «${query}».`
              : deals.length === 0
                ? "El CRM está vacío."
                : `Nada en «${view}».`}
          </p>
        ) : (
          visible.map(({ deal, hit, extra }, i) => (
            <DealLine
              key={deal.id}
              deal={deal}
              index={i}
              outdated={outdated.has(deal.id)}
              hit={hit}
              extra={extra}
            />
          ))
        )}
      </section>

      <div className="crm-mono mt-8 flex flex-col items-start gap-3 text-sm">
        <Link href={crmPath("/nuevo")} className="text-crm-accent crm-tap">
          + nuevo prospecto
        </Link>

        {pendingImport > 0 && (
          <form action={seedFromPropuestas}>
            <button type="submit" className="text-crm-dim crm-tap">
              ↓ importar {pendingImport}{" "}
              {pendingImport === 1
                ? "propuesta de data/propuestas"
                : "propuestas de data/propuestas"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
