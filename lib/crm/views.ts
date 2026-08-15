import { OPEN_STATUSES, type Deal } from "@/types/crm";

/**
 * Los cortes del listado. Viven aparte porque los usan tanto la página que
 * filtra (en el servidor) como la fila que los ofrece (en el cliente).
 */
export const VIEWS = ["abiertas", "todas", "ganadas", "perdidas"] as const;

export type View = (typeof VIEWS)[number];

export function isOpen(deal: Deal) {
  return OPEN_STATUSES.includes(deal.status);
}

export function matchesView(deal: Deal, view: View) {
  if (view === "todas") return true;
  if (view === "abiertas") return isOpen(deal);
  return deal.status === (view === "ganadas" ? "ganada" : "perdida");
}
