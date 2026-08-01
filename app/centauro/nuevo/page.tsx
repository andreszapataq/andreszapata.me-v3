import Link from "next/link";
import { createDeal } from "@/lib/crm/actions";
import FieldRow from "@/components/crm/field-row";
import { todayISO } from "@/lib/crm/format";
import { CURRENCIES, DEAL_STATUSES } from "@/types/crm";
import { CRM_BASE } from "@/lib/crm/route";

// Sin esto la página se prerenderiza y «hoy» quedaría congelado en el build.
export const dynamic = "force-dynamic";

export default function NuevoPage() {
  return (
    <main className="mx-auto w-full max-w-[34rem] px-6 pt-12 pb-24 crm-page">
      <Link href={CRM_BASE} className="crm-mono text-sm text-crm-faint crm-tap">
        ← crm
      </Link>

      <h1 className="mt-8 text-2xl font-medium tracking-tight">
        nuevo prospecto
      </h1>
      <p className="mt-2 text-crm-dim">
        Solo el cliente es obligatorio. Todo lo demás se completa después.
      </p>

      <form action={createDeal} className="mt-7">
        <FieldRow label="cliente">
          <input
            name="client_name"
            required
            autoFocus
            placeholder="a quién le vendes"
            aria-label="Cliente"
            className="crm-field"
          />
        </FieldRow>

        <FieldRow label="proyecto">
          <input
            name="project_name"
            placeholder="qué le vendes"
            aria-label="Proyecto"
            className="crm-field"
          />
        </FieldRow>

        <FieldRow label="estado">
          <select
            name="status"
            defaultValue="borrador"
            aria-label="Estado"
            className="crm-field crm-mono"
          >
            {DEAL_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </FieldRow>

        <FieldRow label="monto">
          <div className="flex items-baseline gap-3">
            <input
              name="amount"
              inputMode="numeric"
              placeholder="sin monto"
              aria-label="Monto"
              className="crm-field crm-mono"
            />
            <select
              name="currency"
              defaultValue="COP"
              aria-label="Moneda"
              className="crm-field crm-mono w-20 text-crm-dim"
            >
              {CURRENCIES.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>
        </FieldRow>

        <FieldRow label="enviada">
          <input
            name="sent_at"
            type="date"
            defaultValue={todayISO()}
            aria-label="Fecha de envío"
            className="crm-field crm-mono"
          />
        </FieldRow>

        <FieldRow label="vence">
          <input
            name="valid_until"
            type="date"
            aria-label="Vigencia"
            className="crm-field crm-mono"
          />
        </FieldRow>

        <FieldRow label="propuesta">
          <input
            name="slug"
            placeholder="slug en data/propuestas"
            aria-label="Slug de la propuesta"
            autoCapitalize="none"
            spellCheck={false}
            className="crm-field crm-mono"
          />
        </FieldRow>

        <FieldRow label="origen">
          <input
            name="source"
            placeholder="referido, instagram, …"
            aria-label="Origen"
            className="crm-field"
          />
        </FieldRow>

        <h2 className="crm-mono mt-9 border-t border-crm-line pt-4 pb-1 text-sm text-crm-faint">
          contacto
        </h2>

        <FieldRow label="nombre">
          <input
            name="contact_name"
            placeholder="con quién hablas"
            aria-label="Nombre del contacto"
            className="crm-field"
          />
        </FieldRow>

        <FieldRow label="teléfono">
          <input
            name="contact_phone"
            type="tel"
            placeholder="+57 300 0000000"
            aria-label="Teléfono"
            className="crm-field crm-mono"
          />
        </FieldRow>

        <FieldRow label="correo">
          <input
            name="contact_email"
            type="email"
            placeholder="correo@cliente.com"
            autoCapitalize="none"
            aria-label="Correo"
            className="crm-field crm-mono"
          />
        </FieldRow>

        <h2 className="crm-mono mt-9 border-t border-crm-line pt-4 pb-1 text-sm text-crm-faint">
          siguiente paso
        </h2>

        <FieldRow label="qué">
          <input
            name="next_step"
            placeholder="qué sigue…"
            aria-label="Siguiente paso"
            className="crm-field"
          />
        </FieldRow>

        <FieldRow label="cuándo">
          <input
            name="next_step_at"
            type="date"
            aria-label="Fecha del siguiente paso"
            className="crm-field crm-mono"
          />
        </FieldRow>

        <button type="submit" className="crm-mono mt-9 text-crm-accent crm-tap">
          crear →
        </button>
      </form>
    </main>
  );
}
