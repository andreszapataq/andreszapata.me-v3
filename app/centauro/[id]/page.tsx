import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { deleteDeal, deleteNote } from "@/lib/crm/actions";
import FieldRow from "@/components/crm/field-row";
import InlineText from "@/components/crm/inline-text";
import InlineDate from "@/components/crm/inline-date";
import InlineSelect from "@/components/crm/inline-select";
import InlineAmount from "@/components/crm/inline-amount";
import NoteComposer from "@/components/crm/note-composer";
import ConfirmButton from "@/components/crm/confirm-button";
import {
  NOTE_GLYPH,
  STATUS_TONE,
  daysFromToday,
  formatNoteDate,
  phoneHref,
  whatsappHref,
} from "@/lib/crm/format";
import {
  CURRENCIES,
  DEAL_STATUSES,
  type Deal,
  type Note,
} from "@/types/crm";
import { CRM_BASE } from "@/lib/crm/route";

export const dynamic = "force-dynamic";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="crm-mono mt-9 border-t border-crm-line pt-4 pb-1 text-sm text-crm-faint">
      {children}
    </h2>
  );
}

export default async function DealPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dealId = Number(id);
  if (!Number.isInteger(dealId)) notFound();

  const supabase = await createClient();

  const [dealResult, notesResult] = await Promise.all([
    supabase.from("crm_deals").select("*").eq("id", dealId).maybeSingle(),
    supabase
      .from("crm_notes")
      .select("*")
      .eq("deal_id", dealId)
      .order("occurred_at", { ascending: false }),
  ]);

  if (dealResult.error) throw new Error(dealResult.error.message);
  if (!dealResult.data) notFound();

  const deal = dealResult.data as Deal;
  const notes = (notesResult.data ?? []) as Note[];

  const validIn = daysFromToday(deal.valid_until);
  const dueIn = daysFromToday(deal.next_step_at);

  return (
    <main className="mx-auto w-full max-w-[34rem] px-6 pt-12 pb-24 crm-page">
      <Link href={CRM_BASE} className="crm-mono text-sm text-crm-faint crm-tap">
        ← crm
      </Link>

      <header className="mt-8">
        <InlineText
          dealId={deal.id}
          field="client_name"
          value={deal.client_name}
          label="Cliente"
          placeholder="Cliente"
          className="text-2xl font-medium tracking-tight"
        />
        <InlineText
          dealId={deal.id}
          field="project_name"
          value={deal.project_name}
          label="Proyecto"
          placeholder="sin proyecto"
          className="mt-1 text-crm-dim"
        />
      </header>

      <section className="mt-7">
        <FieldRow label="estado">
          <InlineSelect
            dealId={deal.id}
            field="status"
            value={deal.status}
            options={DEAL_STATUSES}
            label="Estado del negocio"
            tone={STATUS_TONE[deal.status]}
          />
        </FieldRow>

        <FieldRow label="monto">
          <div className="flex items-baseline gap-3">
            <InlineAmount
              dealId={deal.id}
              value={deal.amount}
              currency={deal.currency}
            />
            <InlineSelect
              dealId={deal.id}
              field="currency"
              value={deal.currency}
              options={CURRENCIES}
              label="Moneda"
              tone="dim"
            />
          </div>
        </FieldRow>

        <FieldRow label="enviada">
          <InlineDate
            dealId={deal.id}
            field="sent_at"
            value={deal.sent_at}
            label="Fecha de envío"
            showRelative
            clearable
          />
        </FieldRow>

        <FieldRow label="vence">
          <InlineDate
            dealId={deal.id}
            field="valid_until"
            value={deal.valid_until}
            label="Vigencia de la propuesta"
            clearable
            suffix={
              validIn !== null && (
                <span className={`crm-mono text-sm ${validIn < 0 ? "text-crm-red" : "text-crm-faint"}`}>
                  {validIn < 0 ? "vencida" : `en ${validIn} días`}
                </span>
              )
            }
          />
        </FieldRow>

        <FieldRow label="propuesta">
          <div className="flex items-baseline gap-3">
            <InlineText
              dealId={deal.id}
              field="slug"
              value={deal.slug}
              label="Slug de la propuesta"
              placeholder="sin propuesta"
            />
            {deal.slug && (
              <a
                href={`/propuestas/${deal.slug}`}
                target="_blank"
                rel="noreferrer"
                className="crm-mono shrink-0 text-sm text-crm-accent crm-tap"
              >
                abrir ↗
              </a>
            )}
          </div>
        </FieldRow>

        <FieldRow label="origen">
          <InlineText
            dealId={deal.id}
            field="source"
            value={deal.source}
            label="Origen del negocio"
            placeholder="de dónde salió"
          />
        </FieldRow>

        {deal.closed_at && (
          <FieldRow label="cerrada">
            <InlineDate
              dealId={deal.id}
              field="closed_at"
              value={deal.closed_at}
              label="Fecha de cierre"
              showRelative
            />
          </FieldRow>
        )}
      </section>

      <SectionTitle>contacto</SectionTitle>
      <section>
        <FieldRow label="nombre">
          <InlineText
            dealId={deal.id}
            field="contact_name"
            value={deal.contact_name}
            label="Nombre del contacto"
            placeholder="sin contacto"
          />
        </FieldRow>

        <FieldRow label="teléfono">
          <div className="flex flex-wrap items-baseline gap-x-3">
            <InlineText
              dealId={deal.id}
              field="contact_phone"
              value={deal.contact_phone}
              label="Teléfono del contacto"
              placeholder="sin teléfono"
              type="tel"
              className="crm-mono basis-full"
            />
            {deal.contact_phone && (
              <>
                <a
                  href={`tel:${phoneHref(deal.contact_phone)}`}
                  className="crm-mono text-sm text-crm-accent crm-tap"
                >
                  llamar
                </a>
                <a
                  href={whatsappHref(deal.contact_phone)}
                  target="_blank"
                  rel="noreferrer"
                  className="crm-mono text-sm text-crm-accent crm-tap"
                >
                  whatsapp
                </a>
                <a
                  href={`sms:${phoneHref(deal.contact_phone)}`}
                  className="crm-mono text-sm text-crm-accent crm-tap"
                >
                  sms
                </a>
              </>
            )}
          </div>
        </FieldRow>

        <FieldRow label="correo">
          <div className="flex flex-wrap items-baseline gap-x-3">
            <InlineText
              dealId={deal.id}
              field="contact_email"
              value={deal.contact_email}
              label="Correo del contacto"
              placeholder="sin correo"
              type="email"
              wrap
              className="crm-mono basis-full"
            />
            {deal.contact_email && (
              <a
                href={`mailto:${deal.contact_email}`}
                className="crm-mono text-sm text-crm-accent crm-tap"
              >
                escribir
              </a>
            )}
          </div>
        </FieldRow>
      </section>

      <SectionTitle>siguiente paso</SectionTitle>
      <section>
        <FieldRow label="qué" align="start">
          <InlineText
            dealId={deal.id}
            field="next_step"
            value={deal.next_step}
            label="Siguiente paso"
            placeholder="qué sigue…"
            multiline
          />
        </FieldRow>

        <FieldRow label="cuándo">
          <InlineDate
            dealId={deal.id}
            field="next_step_at"
            value={deal.next_step_at}
            label="Fecha del siguiente paso"
            placeholder="sin fecha"
            clearable
            suffix={
              dueIn !== null && (
                <span className={`crm-mono text-sm ${dueIn <= 0 ? "text-crm-amber" : "text-crm-faint"}`}>
                  {dueIn === 0
                    ? "hoy"
                    : dueIn < 0
                      ? `atrasado ${Math.abs(dueIn)} días`
                      : `en ${dueIn} días`}
                </span>
              )
            }
          />
        </FieldRow>
      </section>

      <SectionTitle>
        bitácora{notes.length > 0 && ` (${notes.length})`}
      </SectionTitle>
      <section>
        {notes.length === 0 && (
          <p className="py-2 text-crm-faint">Nada registrado todavía.</p>
        )}

        <ul>
          {notes.map((note) => (
            <li key={note.id} className="group flex gap-3 py-2.5">
              <span
                aria-hidden
                className="crm-mono w-3 shrink-0 pt-0.5 text-center text-crm-faint"
              >
                {NOTE_GLYPH[note.kind]}
              </span>
              <div className="min-w-0 flex-1">
                <p className="whitespace-pre-wrap">{note.body}</p>
                <p className="crm-mono mt-0.5 text-sm text-crm-faint">
                  {formatNoteDate(note.occurred_at)} · {note.kind}
                </p>
              </div>
              <form action={deleteNote} className="shrink-0">
                <input type="hidden" name="id" value={note.id} />
                <input type="hidden" name="deal_id" value={deal.id} />
                <ConfirmButton
                  message="¿Borrar esta nota?"
                  pendingLabel="…"
                  ariaLabel="Borrar nota"
                  className="px-1 text-crm-faint transition-colors hover:text-crm-red"
                >
                  ×
                </ConfirmButton>
              </form>
            </li>
          ))}
        </ul>

        <NoteComposer dealId={deal.id} />
      </section>

      <footer className="mt-14 border-t border-crm-line pt-4">
        <form action={deleteDeal}>
          <input type="hidden" name="id" value={deal.id} />
          <ConfirmButton
            message={`¿Borrar «${deal.client_name}» y toda su bitácora? No se puede deshacer.`}
            pendingLabel="borrando…"
            className="text-sm text-crm-faint transition-colors hover:text-crm-red"
          >
            borrar este negocio
          </ConfirmButton>
        </form>
      </footer>
    </main>
  );
}
