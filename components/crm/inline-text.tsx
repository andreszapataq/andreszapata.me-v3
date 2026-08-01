"use client";

import { useEffect, useRef } from "react";
import { useFieldState } from "./use-field-state";

/**
 * Un valor que se lee como texto y se edita en el mismo lugar. Guarda al salir
 * del campo (o con Enter) y solo si algo cambió.
 */
export default function InlineText({
  dealId,
  field,
  value,
  placeholder,
  label,
  type = "text",
  multiline = false,
  className = "",
}: {
  dealId: number;
  field: string;
  value: string | null;
  placeholder: string;
  label: string;
  type?: "text" | "tel" | "email";
  multiline?: boolean;
  className?: string;
}) {
  const {
    value: text,
    setValue: setText,
    committed,
    save,
    pending,
  } = useFieldState(dealId, field, value ?? "");

  const areaRef = useRef<HTMLTextAreaElement>(null);

  // El textarea crece con el texto: nada de notas recortadas a una línea.
  useEffect(() => {
    const area = areaRef.current;
    if (!area) return;
    area.style.height = "auto";
    area.style.height = `${area.scrollHeight}px`;
  }, [text]);

  const fieldClass = `crm-field ${pending ? "text-crm-dim" : ""} ${className}`;

  if (multiline) {
    return (
      <textarea
        ref={areaRef}
        value={text}
        placeholder={placeholder}
        aria-label={label}
        rows={1}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => save(text.trim())}
        className={`${fieldClass} resize-none`}
      />
    );
  }

  return (
    <input
      type={type}
      value={text}
      placeholder={placeholder}
      aria-label={label}
      autoCapitalize={type === "email" ? "none" : "sentences"}
      spellCheck={type === "text"}
      onChange={(e) => setText(e.target.value)}
      onBlur={() => save(text.trim())}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          e.currentTarget.blur();
        }
        if (e.key === "Escape") {
          setText(committed);
          e.currentTarget.blur();
        }
      }}
      className={fieldClass}
    />
  );
}
