"use client";

import { useAutoGrow } from "./use-auto-grow";
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
  clearable = false,
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
  /** Una × para vaciarlo de un toque: en un texto largo, borrar a mano es un castigo. */
  clearable?: boolean;
  className?: string;
}) {
  const {
    value: text,
    setValue: setText,
    committed,
    save,
    pending,
  } = useFieldState(dealId, field, value ?? "");

  const areaRef = useAutoGrow(text);

  const fieldClass = `crm-field ${pending ? "text-crm-dim" : ""} ${className}`;

  /**
   * La × aparece y desaparece con el contenido, pero el envoltorio no: si el
   * árbol cambiara de forma al vaciar el campo, React desmontaría el textarea
   * con el foco adentro y lo que se escribiera después nunca llegaría a
   * guardarse, porque el blur no llega a dispararse.
   */
  const withClear = (control: React.ReactNode, align: string) =>
    clearable ? (
      <span className={`flex gap-1 ${align}`}>
        {control}
        {text !== "" && (
          <button
            type="button"
            onClick={() => save("")}
            aria-label={`Borrar ${label}`}
            className="shrink-0 px-1 text-crm-faint hover:text-crm-red"
          >
            ×
          </button>
        )}
      </span>
    ) : (
      control
    );

  // Un <input> esconde lo que no cabe: un correo largo se lee a medias y no hay
  // forma de ver el final. El textarea que ya usamos para el texto libre sirve
  // igual para un valor de una línea, dejándolo bajar de renglón.
  if (multiline || wrap) {
    const area = (
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
          if (e.key === "Escape") {
            setText(committed);
            e.currentTarget.blur();
          }
        }}
        className={`${fieldClass} resize-none ${wrap ? "wrap-anywhere" : ""}`}
      />
    );

    return withClear(area, "items-start");
  }

  const input = (
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

  return withClear(input, "items-baseline");
}
