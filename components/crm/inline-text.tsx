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
  wrap = false,
  className = "",
}: {
  dealId: number;
  field: string;
  value: string | null;
  placeholder: string;
  label: string;
  type?: "text" | "tel" | "email";
  multiline?: boolean;
  /** Un solo valor, pero que puede bajar de línea si no cabe a lo ancho. */
  wrap?: boolean;
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

  // Un <input> esconde lo que no cabe: un correo largo se lee a medias y no hay
  // forma de ver el final. El textarea que ya usamos para el texto libre sirve
  // igual para un valor de una línea, dejándolo bajar de renglón.
  if (multiline || wrap) {
    return (
      <textarea
        ref={areaRef}
        value={text}
        placeholder={placeholder}
        aria-label={label}
        rows={1}
        inputMode={type === "email" ? "email" : undefined}
        autoCapitalize={type === "email" ? "none" : "sentences"}
        spellCheck={type === "text" && !wrap}
        // Pegar texto de varias líneas en un campo de una sola no debería
        // partirlo: se aplana al entrar.
        onChange={(e) =>
          setText(wrap ? e.target.value.replace(/\s*\n\s*/g, " ") : e.target.value)
        }
        onBlur={() => save(text.trim())}
        onKeyDown={(e) => {
          if (wrap && e.key === "Enter") {
            e.preventDefault();
            e.currentTarget.blur();
          }
        }}
        className={`${fieldClass} resize-none ${wrap ? "wrap-anywhere" : ""}`}
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
