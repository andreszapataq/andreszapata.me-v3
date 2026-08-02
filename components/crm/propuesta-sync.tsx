"use client";

import { useFormStatus } from "react-dom";
import {
  ignorePropuestaChanges,
  syncDealFromPropuesta,
} from "@/lib/crm/actions";
import type { PropuestaChange } from "@/types/crm";

function Submit({
  label,
  pendingLabel,
  className,
}: {
  label: string;
  pendingLabel: string;
  className: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`${className} crm-tap disabled:border-b-transparent disabled:text-crm-faint`}
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

/**
 * Aviso de que el JSON de la propuesta ya no dice lo mismo que el negocio.
 *
 * Muestra el diff y deja decidir, en vez de sincronizar solo: estos campos
 * también se editan a mano desde el CRM y una sobrescritura silenciosa se
 * llevaría por delante justamente el ajuste que uno acaba de hacer.
 */
export default function PropuestaSync({
  dealId,
  changes,
}: {
  dealId: number;
  changes: PropuestaChange[];
}) {
  return (
    <section className="mt-7 border-y border-crm-line py-4">
      <p className="crm-mono text-sm text-crm-accent">⟳ la propuesta cambió</p>

      <dl className="mt-3">
        {changes.map((change) => (
          <div
            key={change.field}
            className="grid grid-cols-[5rem_1fr] gap-x-3 py-1 sm:grid-cols-[5.5rem_1fr]"
          >
            <dt className="crm-mono text-sm text-crm-faint">{change.label}</dt>
            <dd className="min-w-0">
              <span className="text-crm-faint line-through decoration-crm-line">
                {change.from}
              </span>
              <span className="mt-0.5 block">{change.to}</span>
            </dd>
          </div>
        ))}
      </dl>

      {/* Dos formularios y no uno con dos submits: así cada botón tiene su
          propio useFormStatus y solo se apaga el que se presionó. */}
      <div className="crm-mono mt-4 flex items-baseline gap-6 text-sm">
        <form action={syncDealFromPropuesta}>
          <input type="hidden" name="id" value={dealId} />
          <Submit
            label="actualizar →"
            pendingLabel="actualizando…"
            className="text-crm-accent"
          />
        </form>

        <form action={ignorePropuestaChanges}>
          <input type="hidden" name="id" value={dealId} />
          <Submit
            label="ignorar"
            pendingLabel="ignorando…"
            className="text-crm-faint"
          />
        </form>
      </div>
    </section>
  );
}
