import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  pendingChanges,
  readPropuestasAsDeals,
  readPropuestasBySlug,
} from "@/lib/crm/seed";
import { seedFromPropuestas, signOut } from "@/lib/crm/actions";
import {
  STATUS_TONE,
  daysFromToday,
  formatDateShort,
  formatMoney,
  relativeDays,
  sumByCurrency,
} from "@/lib/crm/format";
import { OPEN_STATUSES, type Deal } from "@/types/crm";
import { CRM_BASE, crmPath } from "@/lib/crm/route";
import { HiddenAlertsBadge } from "@/components/crm/hidden-alerts";

export const dynamic = "force-dynamic";

const VIEWS = ["abiertas", "todas", "ganadas", "perdidas"] as const;
type View = (typeof VIEWS)[number];

const TONE_CLASS = {
  dim: "text-crm-dim",
  text: "text-crm-text",
  accent: "text-crm-accent",
  amber: "text-crm-amber",
  red: "text-crm-red",
} as const;

function isOpen(deal: Deal) {
  return OPEN_STATUSES.includes(deal.status);
}

/** Abiertos arriba, ordenados por lo que hay que hacer antes. */
function sortDeals(a: Deal, b: Deal) {
  if (isOpen(a) !== isOpen(b)) return isOpen(a) ? -1 : 1;

  if (isOpen(a)) {
    const aDue = a.next_step_at ?? "9999-12-31";
    const bDue = b.next_step_at ?? "9999-12-31";
    if (aDue !== bDue) return aDue.localeCompare(bDue);
    return (b.sent_at ?? "").localeCompare(a.sent_at ?? "");
  }

  return (b.closed_at ?? b.updated_at).localeCompare(a.closed_at ?? a.updated_at);
}

function matchesView(deal: Deal, view: View) {
  if (view === "todas") return true;
  if (view === "abiertas") return isOpen(deal);
  return deal.status === (view === "ganadas" ? "ganada" : "perdida");
}

function DealLine({
  deal,
  index,
  outdated,
}: {
  deal: Deal;
  index: number;
  outdated: boolean;
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

      {deal.next_step && (
        <p
          className={`mt-1.5 text-sm ${
            dueIn !== null && dueIn <= 0 ? "text-crm-amber" : "text-crm-dim"
          }`}
        >
          → {deal.next_step}
          {deal.next_step_at && ` · ${formatDateShort(deal.next_step_at)}`}
        </p>
      )}
    </Link>
  );
}

export default async function CrmPage({
  searchParams,
}: {
  searchParams: Promise<{ ver?: string }>;
}) {
  const { ver } = await searchParams;
  const view: View = VIEWS.includes(ver as View) ? (ver as View) : "abiertas";

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
  const visible = deals.filter((d) => matchesView(d, view)).sort(sortDeals);

  const dueToday = open.filter((d) => {
    const diff = daysFromToday(d.next_step_at);
    return diff !== null && diff <= 0;
  }).length;

  const expired = open.filter((d) => {
    const diff = daysFromToday(d.valid_until);
    return diff !== null && diff < 0;
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

      {(dueToday > 0 || expired > 0 || outdated.size > 0) && (
        <p className="crm-mono mt-1 text-sm">
          {[
            dueToday > 0 && (
              <span key="due" className="text-crm-amber">
                {dueToday} {dueToday === 1 ? "pendiente" : "pendientes"} para hoy
              </span>
            ),
            expired > 0 && (
              <span key="expired" className="text-crm-red">
                {expired} {expired === 1 ? "vencida" : "vencidas"}
              </span>
            ),
            outdated.size > 0 && (
              <span key="outdated" className="text-crm-accent">
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

      <nav className="crm-mono mt-8 flex flex-wrap gap-x-3 gap-y-1 text-sm">
        {VIEWS.map((option, i) => (
          <span key={option} className="flex items-baseline gap-3">
            {i > 0 && <span className="text-crm-line">·</span>}
            <Link
              href={option === "abiertas" ? CRM_BASE : `${CRM_BASE}?ver=${option}`}
              className={
                option === view
                  ? "text-crm-text underline decoration-crm-accent underline-offset-4"
                  : "text-crm-faint hover:text-crm-dim"
              }
            >
              {option}
            </Link>
          </span>
        ))}
      </nav>

      {/* La lista se sale 12px a cada lado del texto: así el fondo del hover
          respira alrededor de la fila sin que el contenido se corra. */}
      <section className="-mx-3 mt-4 border-t border-crm-line">
        {visible.length === 0 ? (
          <p className="px-3 py-8 text-crm-faint">
            {deals.length === 0
              ? "El CRM está vacío."
              : `Nada en «${view}».`}
          </p>
        ) : (
          visible.map((deal, i) => (
            <DealLine
              key={deal.id}
              deal={deal}
              index={i}
              outdated={outdated.has(deal.id)}
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
