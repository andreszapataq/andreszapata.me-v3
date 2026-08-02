"use client";

import { updateNote } from "@/lib/crm/actions";
import { formatDay, noteDay } from "@/lib/crm/format";
import type { Note } from "@/types/crm";
import { useAutoGrow } from "./use-auto-grow";
import { useSavedField } from "./use-field-state";

const FULL_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Una entrada de la bitácora: se lee como texto y se corrige en el sitio.
 *
 * Las notas `estado` las escribe el CRM al mover el negocio: se leen y se
 * borran, pero no se editan. Si se pudieran editar, la bitácora dejaría de ser
 * prueba de lo que pasó.
 */
export default function NoteEntry({ note }: { note: Note }) {
  const send = (entries: Record<string, string>) => {
    const data = new FormData();
    data.set("id", String(note.id));
    data.set("deal_id", String(note.deal_id));
    for (const [key, value] of Object.entries(entries)) data.set(key, value);
    updateNote(data);
  };

  const body = useSavedField(note.body, (next) => send({ body: next }));
  const day = useSavedField(noteDay(note.occurred_at), (next) =>
    send({ occurred_on: next })
  );

  const areaRef = useAutoGrow(body.value);

  const meta = (
    <span className={day.pending ? "text-crm-dim" : undefined}>
      {formatDay(day.value)}
    </span>
  );

  if (note.kind === "estado") {
    return (
      <div className="min-w-0 flex-1">
        <p className="whitespace-pre-wrap">{note.body}</p>
        <p className="crm-mono mt-0.5 text-sm text-crm-faint">
          {meta} · {note.kind}
        </p>
      </div>
    );
  }

  return (
    <div className="min-w-0 flex-1">
      <textarea
        ref={areaRef}
        value={body.value}
        rows={1}
        aria-label="Nota"
        className={`crm-field resize-none ${body.pending ? "text-crm-dim" : ""}`}
        onChange={(e) => body.setValue(e.target.value)}
        onBlur={() => {
          const next = body.value.trim();
          // Una nota vacía no existe: para eso está la × de al lado. Si se
          // borró todo, se deshace en vez de guardar nada.
          if (next === "") body.setValue(body.committed);
          else body.save(next);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            body.setValue(body.committed);
            e.currentTarget.blur();
          }
        }}
      />

      <div className="crm-mono mt-0.5 flex flex-wrap items-baseline gap-x-2 text-sm text-crm-faint">
        <span className="relative inline-block py-1">
          <span className="crm-tap">{meta}</span>
          <input
            type="date"
            className="crm-native"
            aria-label="Fecha de la nota"
            value={day.value}
            // El campo es invisible: sin abrir el selector del sistema no
            // habría forma de cambiar el día.
            onClick={(e) => {
              try {
                e.currentTarget.showPicker();
              } catch {
                // Navegador sin showPicker: queda la edición por teclado.
              }
            }}
            // Al escribir por teclado la fecha pasa por estados incompletos:
            // solo se guarda cuando ya es un día real.
            onChange={(e) =>
              FULL_DATE.test(e.target.value)
                ? day.save(e.target.value)
                : day.setValue(e.target.value)
            }
          />
        </span>
        <span>· {note.kind}</span>
      </div>
    </div>
  );
}
