"use client";

import { useState, useTransition } from "react";
import { updateDealField } from "@/lib/crm/actions";

/**
 * Estado compartido de los campos que se editan en su lugar.
 *
 * La clave está en `lastProp`: solo se resincroniza cuando el valor cambia en
 * el servidor. Comparar contra lo que acabamos de escribir revertiría la
 * edición antes de que la server action alcance a responder.
 */
export function useSavedField(
  incoming: string,
  commit: (next: string) => void
) {
  const [lastProp, setLastProp] = useState(incoming);
  const [value, setValue] = useState(incoming);
  const [committed, setCommitted] = useState(incoming);
  const [pending, startTransition] = useTransition();

  if (lastProp !== incoming) {
    setLastProp(incoming);
    setValue(incoming);
    setCommitted(incoming);
  }

  /** Guarda `next` si de verdad cambió algo. */
  function save(next: string) {
    setValue(next);
    if (next === committed) return;
    setCommitted(next);
    startTransition(() => commit(next));
  }

  return { value, setValue, committed, save, pending };
}

/** Un campo de crm_deals, que es lo que edita casi toda la ficha. */
export function useFieldState(dealId: number, field: string, incoming: string) {
  return useSavedField(incoming, (next) => {
    const data = new FormData();
    data.set("id", String(dealId));
    data.set("field", field);
    data.set("value", next);
    updateDealField(data);
  });
}
