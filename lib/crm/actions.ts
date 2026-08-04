"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  pendingChanges,
  readPropuestasAsDeals,
  readPropuestasBySlug,
} from "@/lib/crm/seed";
import { todayISO } from "@/lib/crm/format";
import {
  CURRENCIES,
  DEAL_STATUSES,
  NOTE_KINDS,
  type Currency,
  type Deal,
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

/**
 * Corrige una nota ya escrita: el cuerpo, el día, o los dos.
 *
 * Las notas `estado` quedan por fuera a propósito. Esas no las escribiste tú
 * sino el CRM al mover el negocio, y si se pudieran editar la bitácora dejaría
 * de ser prueba de lo que pasó.
 */
export async function updateNote(formData: FormData) {
  const supabase = await requireClient();

  const id = Number(formData.get("id"));
  const dealId = Number(formData.get("deal_id"));
  if (!Number.isInteger(id)) return;

  const patch: Record<string, string> = {};

  if (formData.has("body")) {
    const body = String(formData.get("body") ?? "").trim();
    // El cuerpo es obligatorio en la tabla: una nota vacía se borra, no se guarda.
    if (body === "") return;
    patch.body = body;
  }

  if (formData.has("occurred_on")) {
    const occurredOn = String(formData.get("occurred_on") ?? "").trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(occurredOn)) return;
    // Mismo anclaje que al crearla: mediodía UTC para que el día no se corra.
    patch.occurred_at = `${occurredOn}T12:00:00Z`;
  }

  if (Object.keys(patch).length === 0) return;

  const { error } = await supabase
    .from("crm_notes")
    .update(patch)
    .eq("id", id)
    .neq("kind", "estado");

  if (error) throw new Error(`No se pudo actualizar la nota: ${error.message}`);

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

/** Trae el negocio junto a la propuesta de la que salió. */
async function loadPropuesta(
  supabase: Awaited<ReturnType<typeof requireClient>>,
  id: number
) {
  const { data, error } = await supabase
    .from("crm_deals")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`No se pudo leer el negocio: ${error.message}`);

  const deal = data as Deal | null;
  if (!deal?.slug) return null;

  const seed = readPropuestasBySlug().get(deal.slug);
  return seed ? { deal, seed } : null;
}

/**
 * Baja al negocio los campos que cambiaron en su propuesta.
 *
 * Los cambios se recalculan aquí y no se leen del formulario: lo que llega del
 * cliente es solo el id, así nadie puede pedir que se escriba otra cosa.
 */
export async function syncDealFromPropuesta(formData: FormData) {
  const supabase = await requireClient();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  const state = await loadPropuesta(supabase, id);
  if (!state) return;

  const changes = pendingChanges(state.deal, state.seed);
  if (changes.length === 0) return;

  const patch: Record<string, string | number | null> = {
    propuesta_hash: state.seed.propuesta_hash,
  };
  for (const { field } of changes) patch[field] = state.seed[field];

  const { error } = await supabase.from("crm_deals").update(patch).eq("id", id);
  if (error) throw new Error(`No se pudo sincronizar: ${error.message}`);

  // Queda en la bitácora qué se movió: si el monto baja, uno quiere poder
  // volver meses después y ver de dónde salió el número.
  await supabase.from("crm_notes").insert({
    deal_id: id,
    kind: "nota",
    body: [
      "Sincronizado con la propuesta",
      ...changes.map((c) => `${c.label}: ${c.from} → ${c.to}`),
    ].join("\n"),
  });

  revalidatePath(CRM_BASE);
  revalidatePath(crmPath(`/${id}`));
}

/**
 * Marca la versión actual de la propuesta como vista sin copiar nada. El aviso
 * vuelve si la propuesta cambia otra vez, pero deja de insistir con lo que ya
 * decidiste no traer.
 */
export async function ignorePropuestaChanges(formData: FormData) {
  const supabase = await requireClient();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  const state = await loadPropuesta(supabase, id);
  if (!state) return;

  const { error } = await supabase
    .from("crm_deals")
    .update({ propuesta_hash: state.seed.propuesta_hash })
    .eq("id", id);

  if (error) throw new Error(`No se pudo ignorar el cambio: ${error.message}`);

  revalidatePath(CRM_BASE);
  revalidatePath(crmPath(`/${id}`));
}

/**
 * Cierra el aviso de un paso siguiente: marca como vista la fecha que tiene
 * puesta ahora mismo.
 *
 * La fecha se lee aquí y no llega del cliente a propósito. Si entre el clic y
 * la escritura el paso se reprogramó, esto marca visto el día viejo —que ya no
 * es el vigente— en vez de silenciar de una la fecha nueva.
 *
 * Al vivir en la tabla y no en el navegador, cerrar el aviso en el teléfono
 * también lo cierra en el escritorio.
 */
export async function dismissTaskAlert(id: number) {
  const supabase = await requireClient();
  if (!Number.isInteger(id)) return;

  const { data, error: readError } = await supabase
    .from("crm_deals")
    .select("next_step_at")
    .eq("id", id)
    .maybeSingle();

  if (readError) throw new Error(`No se pudo leer el paso: ${readError.message}`);
  if (!data?.next_step_at) return;

  const { error } = await supabase
    .from("crm_deals")
    .update({ next_step_seen_at: data.next_step_at })
    .eq("id", id);

  if (error) throw new Error(`No se pudo cerrar el aviso: ${error.message}`);

  // "layout" y no la ruta a secas: los avisos se leen en el layout del CRM,
  // así que revalidar solo la página los dejaría intactos.
  revalidatePath(CRM_BASE, "layout");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(crmPath("/login"));
}
