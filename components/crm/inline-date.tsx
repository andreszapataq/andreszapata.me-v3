"use client";

import { formatDate, relativeDays } from "@/lib/crm/format";
import { useFieldState } from "./use-field-state";

const FULL_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Una fecha que se lee formateada y, al tocarla, abre el selector nativo del
 * sistema. El control real va superpuesto e invisible sobre el texto.
 */
export default function InlineDate({
  dealId,
  field,
  value,
  label,
  placeholder = "sin fecha",
  showRelative = false,
  clearable = false,
  suffix,
}: {
  dealId: number;
  field: string;
  value: string | null;
  label: string;
  placeholder?: string;
  showRelative?: boolean;
  clearable?: boolean;
  /** Texto que acompaña a la fecha cuando «hace N días» no es lo que se quiere decir. */
  suffix?: React.ReactNode;
}) {
  const {
    value: date,
    setValue: setDate,
    save,
    pending,
  } = useFieldState(dealId, field, value ?? "");

  const trailing =
    suffix ??
    (showRelative && date ? (
      <span className="crm-mono text-sm text-crm-faint">
        {relativeDays(date)}
      </span>
    ) : null);

  const clear = clearable && date && (
    <button
      type="button"
      onClick={() => save("")}
      aria-label={`Borrar ${label}`}
      className="px-1 text-crm-faint hover:text-crm-red"
    >
      ×
    </button>
  );

  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <span className="relative inline-block py-1">
        <span className={`crm-mono crm-tap ${pending ? "text-crm-dim" : ""}`}>
          {date ? formatDate(date) : placeholder}
        </span>
        <input
          type="date"
          className="crm-native"
          aria-label={label}
          value={date}
          // El campo es invisible: sin abrir el selector del sistema no habría
          // forma de elegir una fecha, sobre todo cuando está vacío.
          onClick={(e) => {
            try {
              e.currentTarget.showPicker();
            } catch {
              // Navegador sin showPicker: queda la edición por teclado.
            }
          }}
          onChange={(e) => {
            const next = e.target.value;
            // Al escribir por teclado la fecha pasa por estados incompletos:
            // solo se guarda cuando ya es un día real.
            if (FULL_DATE.test(next)) save(next);
            else setDate(next);
          }}
          onBlur={() => {
            if (date === "") save("");
          }}
        />
      </span>

      {/* La glosa y la × viajan juntas: si la línea no alcanza, bajan como una
          sola pieza en vez de dejar la × sola contra el margen. */}
      {(trailing || clear) && (
        <span className="inline-flex items-baseline gap-x-2 whitespace-nowrap">
          {trailing}
          {clear}
        </span>
      )}
    </span>
  );
}
