"use client";

import { useState } from "react";
import { formatMoney } from "@/lib/crm/format";
import type { Currency } from "@/types/crm";
import { useFieldState } from "./use-field-state";

/**
 * En reposo muestra el monto formateado ($3.700.000); al enfocarlo se convierte
 * en los dígitos pelados para escribir cómodo desde el teclado. El código de
 * moneda vive en su propio selector, al lado.
 */
export default function InlineAmount({
  dealId,
  value,
  currency,
}: {
  dealId: number;
  value: number | null;
  currency: Currency;
}) {
  const {
    value: digits,
    setValue: setDigits,
    save,
    pending,
  } = useFieldState(dealId, "amount", value === null ? "" : String(value));

  const [editing, setEditing] = useState(false);

  const display = editing
    ? digits
    : digits === ""
      ? ""
      : formatMoney(Number(digits), currency, { code: false });

  return (
    <input
      inputMode="numeric"
      aria-label="Monto"
      value={display}
      placeholder="sin monto"
      // El campo se ajusta al texto para que el selector de moneda quede pegado.
      size={Math.max(display.length, 10)}
      onFocus={() => setEditing(true)}
      onChange={(e) => setDigits(e.target.value.replace(/[^\d]/g, ""))}
      onBlur={() => {
        setEditing(false);
        save(digits.replace(/[^\d]/g, ""));
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
      className={`crm-field crm-field-hug crm-mono ${pending ? "text-crm-dim" : ""}`}
    />
  );
}
