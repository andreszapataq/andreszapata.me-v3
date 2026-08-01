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
  next_step: string | null;
  next_step_at: string | null;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: number;
  deal_id: number;
  kind: NoteKind;
  body: string;
  occurred_at: string;
}
