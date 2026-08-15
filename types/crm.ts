export const DEAL_STATUSES = [
  "borrador",
  "enviada",
  "vista",
  "seguimiento",
  "ganada",
  "perdida",
] as const;

export type DealStatus = (typeof DEAL_STATUSES)[number];

/** Estados en los que el negocio sigue vivo. */
export const OPEN_STATUSES: DealStatus[] = [
  "borrador",
  "enviada",
  "vista",
  "seguimiento",
];

export const NOTE_KINDS = [
  "nota",
  "llamada",
  "correo",
  "whatsapp",
  "reunion",
  "estado",
] as const;

export type NoteKind = (typeof NOTE_KINDS)[number];

export const CURRENCIES = ["COP", "USD", "EUR"] as const;

export type Currency = (typeof CURRENCIES)[number];

export interface Deal {
  id: number;
  client_name: string;
  project_name: string | null;
  slug: string | null;
  status: DealStatus;
  amount: number | null;
  currency: Currency;
  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  source: string | null;
  sent_at: string | null;
  valid_until: string | null;
  /**
   * Lo único que sigue este CRM: qué toca hacer y cuándo. Uno solo por negocio,
   * no una lista —cumplirlo lo vacía, y el vacío es lo que pide el siguiente.
   */
  next_step: string | null;
  next_step_at: string | null;
  closed_at: string | null;
  /**
   * Firma de la propuesta con la que este negocio quedó sincronizado. Si no
   * coincide con la firma del JSON actual, es que la propuesta cambió después.
   */
  propuesta_hash: string | null;
  created_at: string;
  updated_at: string;
}

/** Campos que el CRM hereda de la propuesta, con su etiqueta en la interfaz. */
export const SYNCED_FIELDS = {
  client_name: "cliente",
  project_name: "proyecto",
  amount: "monto",
  currency: "moneda",
  sent_at: "enviada",
  valid_until: "vence",
} as const;

export type SyncedField = keyof typeof SYNCED_FIELDS;

/**
 * Un campo que la propuesta trae distinto de lo que hay en el CRM.
 * `from` y `to` vienen ya formateados: solo son para mostrar, porque quien
 * aplica el cambio lo recalcula del lado del servidor.
 */
export interface PropuestaChange {
  field: SyncedField;
  label: string;
  from: string;
  to: string;
}

export interface Note {
  id: number;
  deal_id: number;
  kind: NoteKind;
  body: string;
  occurred_at: string;
}
