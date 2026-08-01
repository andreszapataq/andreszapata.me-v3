"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { readPropuestasAsDeals } from "@/lib/crm/seed";
import { todayISO } from "@/lib/crm/format";
import {
  CURRENCIES,
  DEAL_STATUSES,
  NOTE_KINDS,
  type Currency,
  type DealStatus,
  type NoteKind,
} from "@/types/crm";
import { CRM_BASE, crmPath } from "@/lib/crm/route";

/** Campos de crm_deals editables desde la interfaz, con su forma de parseo. */
const EDITABLE_FIELDS = {
  client_name: "text",
  project_name: "text",
  slug: "text",
  contact_name: "text",
  contact_phone: "text",
  contact_email: "text",
  source: "text",
  next_step: "text",
  status: "status",
  amount: "number",
  currency: "currency",
  sent_at: "date",
  valid_until: "date",
  next_step_at: "date",
  closed_at: "date",
} as const;

type EditableField = keyof typeof EDITABLE_FIELDS;

function isEditableField(value: string): value is EditableField {
  return Object.hasOwn(EDITABLE_FIELDS, value);
}

function parseFieldValue(
  field: EditableField,
  raw: string
): string | number | null {
  const value = raw.trim();

  switch (EDITABLE_FIELDS[field]) {
    case "text":
      return value === "" ? null : value;
    case "date":
      return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
    case "number": {
      const digits = value.replace(/[^\d]/g, "");
      return digits === "" ? null : Number(digits);
    }
    case "status":
      return DEAL_STATUSES.includes(value as DealStatus) ? value : null;
    case "currency":
      return CURRENCIES.includes(value as Currency) ? value : null;
  }
}

async function requireClient() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) redirect(crmPath("/login"));
  return supabase;
}

export async function updateDealField(formData: FormData) {
  const supabase = await requireClient();

  const id = Number(formData.get("id"));
  const field = String(formData.get("field") ?? "");
  const raw = String(formData.get("value") ?? "");

  if (!Number.isInteger(id) || !isEditableField(field)) return;

  const value = parseFieldValue(field, raw);

  // client_name es NOT NULL: no permitir vaciarlo.
  if (field === "client_name" && value === null) return;
  // Un estado o moneda inválidos significan input manipulado, no un "vaciar".
  if ((field === "status" || field === "currency") && value === null) return;

  const patch: Record<string, string | number | null> = { [field]: value };

  if (field === "status") {
    const status = value as DealStatus;
    const closing = status === "ganada" || status === "perdida";
    patch.closed_at = closing ? todayISO() : null;
  }

  const { error } = await supabase
    .from("crm_deals")
    .update(patch)
    .eq("id", id);

  if (error) throw new Error(`No se pudo actualizar ${field}: ${error.message}`);

  // El cambio de estado queda registrado en la bitácora, no solo en el campo.
  if (field === "status") {
    await supabase.from("crm_notes").insert({
      deal_id: id,
      kind: "estado",
      body: `Estado → ${value}`,
    });
  }

  revalidatePath(CRM_BASE);
  revalidatePath(crmPath(`/${id}`));
}

export async function addNote(formData: FormData) {
  const supabase = await requireClient();

  const dealId = Number(formData.get("deal_id"));
  const body = String(formData.get("body") ?? "").trim();
  const rawKind = String(formData.get("kind") ?? "nota");
  const kind: NoteKind = NOTE_KINDS.includes(rawKind as NoteKind)
    ? (rawKind as NoteKind)
    : "nota";
  const occurredOn = String(formData.get("occurred_on") ?? "").trim();

  if (!Number.isInteger(dealId) || body === "") return;

  const { error } = await supabase.from("crm_notes").insert({
    deal_id: dealId,
    kind,
    body,
    // La fecha es opcional: si se indica, se ancla al mediodía UTC para que el
    // día no se corra al mostrarla (mismo criterio que parseDate).
    ...(/^\d{4}-\d{2}-\d{2}$/.test(occurredOn)
      ? { occurred_at: `${occurredOn}T12:00:00Z` }
      : {}),
  });

  if (error) throw new Error(`No se pudo guardar la nota: ${error.message}`);

  revalidatePath(CRM_BASE);
  revalidatePath(crmPath(`/${dealId}`));
}

export async function deleteNote(formData: FormData) {
  const supabase = await requireClient();

  const id = Number(formData.get("id"));
  const dealId = Number(formData.get("deal_id"));
  if (!Number.isInteger(id)) return;

  const { error } = await supabase.from("crm_notes").delete().eq("id", id);
  if (error) throw new Error(`No se pudo borrar la nota: ${error.message}`);

  revalidatePath(crmPath(`/${dealId}`));
}

export async function createDeal(formData: FormData) {
  const supabase = await requireClient();

  const clientName = String(formData.get("client_name") ?? "").trim();
  if (clientName === "") return;

  const text = (key: string) => {
    const value = String(formData.get(key) ?? "").trim();
    return value === "" ? null : value;
  };
  const date = (key: string) => {
    const value = String(formData.get(key) ?? "").trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
  };

  const rawAmount = String(formData.get("amount") ?? "").replace(/[^\d]/g, "");
  const rawStatus = String(formData.get("status") ?? "borrador");
  const rawCurrency = String(formData.get("currency") ?? "COP");

  const { data, error } = await supabase
    .from("crm_deals")
    .insert({
      client_name: clientName,
      project_name: text("project_name"),
      slug: text("slug"),
      status: DEAL_STATUSES.includes(rawStatus as DealStatus)
        ? rawStatus
        : "borrador",
      amount: rawAmount === "" ? null : Number(rawAmount),
      currency: CURRENCIES.includes(rawCurrency as Currency)
        ? rawCurrency
        : "COP",
      contact_name: text("contact_name"),
      contact_phone: text("contact_phone"),
      contact_email: text("contact_email"),
      source: text("source"),
      sent_at: date("sent_at"),
      valid_until: date("valid_until"),
      next_step: text("next_step"),
      next_step_at: date("next_step_at"),
    })
    .select("id")
    .single();

  if (error) throw new Error(`No se pudo crear el negocio: ${error.message}`);

  revalidatePath(CRM_BASE);
  redirect(crmPath(`/${data.id}`));
}

export async function deleteDeal(formData: FormData) {
  const supabase = await requireClient();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  const { error } = await supabase.from("crm_deals").delete().eq("id", id);
  if (error) throw new Error(`No se pudo borrar el negocio: ${error.message}`);

  revalidatePath(CRM_BASE);
  redirect(CRM_BASE);
}

/**
 * Trae las propuestas de data/propuestas al CRM. Es idempotente: los slugs que
 * ya existen se ignoran, así que reimportar nunca pisa lo que ya editaste.
 */
export async function seedFromPropuestas() {
  const supabase = await requireClient();

  const propuestas = readPropuestasAsDeals();
  if (propuestas.length === 0) return;

  const { data: existing, error: readError } = await supabase
    .from("crm_deals")
    .select("slug")
    .not("slug", "is", null);

  if (readError) throw new Error(`No se pudo leer el CRM: ${readError.message}`);

  const known = new Set((existing ?? []).map((row) => row.slug));
  const missing = propuestas.filter((p) => !known.has(p.slug));
  if (missing.length === 0) return;

  const { error } = await supabase.from("crm_deals").insert(missing);
  if (error) throw new Error(`No se pudieron importar: ${error.message}`);

  revalidatePath(CRM_BASE);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(crmPath("/login"));
}
