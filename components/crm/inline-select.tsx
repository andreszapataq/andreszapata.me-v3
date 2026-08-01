"use client";

import { useFieldState } from "./use-field-state";

const TONE_CLASS = {
  dim: "text-crm-dim",
  text: "text-crm-text",
  accent: "text-crm-accent",
  amber: "text-crm-amber",
  red: "text-crm-red",
} as const;

export type Tone = keyof typeof TONE_CLASS;

/**
 * Una opción que se lee como palabra y, al tocarla, abre el selector nativo
 * (en móvil, la hoja del sistema). Sin menús propios ni dropdowns dibujados.
 */
export default function InlineSelect({
  dealId,
  field,
  value,
  options,
  label,
  tone = "text",
}: {
  dealId: number;
  field: string;
  value: string;
  options: readonly string[];
  label: string;
  tone?: Tone;
}) {
  const {
    value: choice,
    save,
    pending,
  } = useFieldState(dealId, field, value);

  return (
    <span className="relative inline-block py-1">
      <span
        className={`crm-mono crm-tap ${pending ? "text-crm-dim" : TONE_CLASS[tone]}`}
      >
        {choice}
      </span>
      <select
        className="crm-native"
        aria-label={label}
        value={choice}
        onChange={(e) => save(e.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </span>
  );
}
