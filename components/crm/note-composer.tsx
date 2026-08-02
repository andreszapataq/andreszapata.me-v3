"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { addNote } from "@/lib/crm/actions";
import { NOTE_GLYPH, todayISO, formatDateShort } from "@/lib/crm/format";
import { NOTE_KINDS, type NoteKind } from "@/types/crm";
import { useAutoGrow } from "./use-auto-grow";

function SaveLine({ empty }: { empty: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || empty}
      className="ml-auto text-crm-accent crm-tap disabled:border-b-transparent disabled:text-crm-faint"
    >
      {pending ? "guardando…" : "guardar →"}
    </button>
  );
}

export default function NoteComposer({ dealId }: { dealId: number }) {
  const [kind, setKind] = useState<NoteKind>("nota");
  const [when, setWhen] = useState(todayISO());
  const [body, setBody] = useState("");
  // Crece con lo escrito y vuelve a su tamaño mínimo al guardar.
  const areaRef = useAutoGrow(body);

  return (
    <form
      action={async (data) => {
        await addNote(data);
        setBody("");
        setWhen(todayISO());
      }}
      className="mt-5 border-t border-crm-line pt-4"
    >
      <input type="hidden" name="deal_id" value={dealId} />
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="occurred_on" value={when} />

      <textarea
        ref={areaRef}
        name="body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={2}
        placeholder="qué pasó…"
        aria-label="Nueva nota"
        className="crm-field resize-none border-b-transparent hover:border-b-transparent"
      />

      <div className="crm-mono mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-2 text-sm text-crm-faint">
        <span className="relative inline-block py-1">
          <span className="crm-tap text-crm-dim">
            {NOTE_GLYPH[kind]} {kind}
          </span>
          <select
            className="crm-native"
            aria-label="Tipo de nota"
            value={kind}
            onChange={(e) => setKind(e.target.value as NoteKind)}
          >
            {NOTE_KINDS.filter((k) => k !== "estado").map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </span>

        <span className="relative inline-block py-1">
          <span className="crm-tap text-crm-dim">
            {when === todayISO() ? "hoy" : formatDateShort(when)}
          </span>
          <input
            type="date"
            className="crm-native"
            aria-label="Fecha de la nota"
            value={when}
            onClick={(e) => {
              try {
                e.currentTarget.showPicker();
              } catch {
                // Navegador sin showPicker: queda la edición por teclado.
              }
            }}
            onChange={(e) => setWhen(e.target.value || todayISO())}
          />
        </span>

        <SaveLine empty={body.trim() === ""} />
      </div>
    </form>
  );
}
