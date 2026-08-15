import { OPEN_STATUSES, type Deal } from "@/types/crm";

/**
 * Los cortes del listado. Viven aparte porque los usan tanto la página que
 * filtra (en el servidor) como la fila que los ofrece (en el cliente).
 *
 * Son dos y no cuatro a propósito. «ganadas» y «perdidas» eran la misma
 * pregunta hecha dos veces —se miran por el mismo motivo, y el color del
 * estado ya las distingue dentro de la lista—, y «todas» era la escotilla
 * para cuando algo no aparecía, que ahora es buscar: el buscador ignora el
 * corte activo justamente para eso.
 *
 * Que quepan en un solo renglón del teléfono es la consecuencia, no el motivo.
 */
export const VIEWS = ["abiertas", "cerradas"] as const;

export type View = (typeof VIEWS)[number];

export function isOpen(deal: Deal) {
  return OPEN_STATUSES.includes(deal.status);
}

export function matchesView(deal: Deal, view: View) {
  return view === "abiertas" ? isOpen(deal) : !isOpen(deal);
}
