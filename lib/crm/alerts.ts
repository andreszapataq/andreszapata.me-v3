import { OPEN_STATUSES, type Deal } from "@/types/crm";

/**
 * Hora a la que vence un paso siguiente. `next_step_at` es una columna `date`
 * sin hora: la mañana no es un dato que se guarde, es la convención de que una
 * tarea del día 3 se reclama a las 9:00 del 3 y no a la medianoche.
 */
const DUE_HOUR = "09:00:00";

/**
 * Colombia no tiene horario de verano desde 1993, así que el desfase es fijo
 * y se puede escribir en el literal. El resto del CRM llega a Bogotá vía
 * Intl (ver `format.ts`), pero aquí hace falta el instante absoluto —el que
 * se compara con Date.now()— y para eso el offset explícito es exacto.
 */
const BOGOTA_OFFSET = "-05:00";

/**
 * Lo único que hace falta de un negocio para saber si tiene algo que avisar.
 * El aviso se consulta en cada pantalla del CRM, así que la consulta pide
 * estas columnas y no la fila entera.
 */
type AlertSource = Pick<
  Deal,
  "id" | "client_name" | "project_name" | "status" | "next_step" | "next_step_at"
>;

export const ALERT_COLUMNS =
  "id, client_name, project_name, status, next_step, next_step_at";

/** Un paso siguiente con el momento en que reclama atención. */
export interface TaskAlert {
  id: number;
  client: string;
  project: string | null;
  next_step: string;
  next_step_at: string;
  /** Epoch ms de las 9:00 de Bogotá del día programado. */
  due_at: number;
}

/** Las 9:00 de Bogotá del día 'YYYY-MM-DD', en epoch ms. */
export function dueAt(nextStepAt: string): number {
  return new Date(`${nextStepAt}T${DUE_HOUR}${BOGOTA_OFFSET}`).getTime();
}

/**
 * Los pasos siguientes que pueden avisar: negocio vivo, con tarea escrita y
 * con día puesto. No filtra por vencimiento a propósito —eso depende del reloj
 * de quien mira, que en el servidor no se conoce— sino que manda la lista
 * completa para que el cliente decida cuáles ya llegaron.
 */
export function toTaskAlerts(deals: AlertSource[]): TaskAlert[] {
  return deals
    .filter(
      (deal) =>
        OPEN_STATUSES.includes(deal.status) &&
        deal.next_step !== null &&
        deal.next_step_at !== null
    )
    .map((deal) => ({
      id: deal.id,
      client: deal.client_name,
      project: deal.project_name,
      next_step: deal.next_step!,
      next_step_at: deal.next_step_at!,
      due_at: dueAt(deal.next_step_at!),
    }))
    .sort((a, b) => a.due_at - b.due_at);
}
