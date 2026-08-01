import type { Currency, DealStatus, NoteKind } from "@/types/crm";

/**
 * Todo el CRM razona en hora de Bogotá. Sin esto, «hoy» significaría una cosa
 * en el servidor (UTC en producción) y otra en el teléfono, y las propuestas
 * aparecerían enviadas «ayer» cada noche.
 */
const TZ = "America/Bogota";

/** Las columnas `date` llegan como 'YYYY-MM-DD'; el mediodía UTC evita saltos de día. */
export function parseDate(value: string): Date {
  return new Date(`${value}T12:00:00Z`);
}

/** 'YYYY-MM-DD' del día que es en Bogotá, sea cual sea la zona de quien ejecuta. */
export function toLocalISO(date: Date): string {
  // en-CA formatea justamente como 'YYYY-MM-DD'.
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(date);
}

export function todayISO(): string {
  return toLocalISO(new Date());
}

/** es-CO escribe "31 de jul. de 2026"; aquí queremos "31 jul 2026". */
function terse(text: string): string {
  return text.replace(/ de /g, " ").replace(/\./g, "");
}

export function formatDate(value: string | null): string {
  if (!value) return "—";
  return terse(
    parseDate(value).toLocaleDateString("es-CO", {
      timeZone: TZ,
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  );
}

export function formatDateShort(value: string | null): string {
  if (!value) return "—";
  return terse(
    parseDate(value).toLocaleDateString("es-CO", {
      timeZone: TZ,
      day: "numeric",
      month: "short",
    })
  );
}

/**
 * Las notas se anclan a un día, no a una hora: mostrar «7:00 a m» sería
 * inventar precisión. Cerca de hoy se dice en palabras.
 */
export function formatNoteDate(value: string): string {
  const iso = toLocalISO(new Date(value));
  const diff = daysFromToday(iso);
  if (diff === 0) return "hoy";
  if (diff === -1) return "ayer";

  const sameYear = iso.slice(0, 4) === todayISO().slice(0, 4);
  return sameYear ? formatDateShort(iso) : formatDate(iso);
}

/** Días calendario entre hoy y una fecha: negativo = pasado, positivo = futuro. */
export function daysFromToday(value: string | null): number | null {
  if (!value) return null;
  const day = 86_400_000;
  const target = Math.floor(parseDate(value).getTime() / day);
  const today = Math.floor(parseDate(todayISO()).getTime() / day);
  return target - today;
}

export function relativeDays(value: string | null): string {
  const diff = daysFromToday(value);
  if (diff === null) return "";
  if (diff === 0) return "hoy";
  if (diff === -1) return "ayer";
  if (diff === 1) return "mañana";
  if (diff < 0) return `hace ${Math.abs(diff)} días`;
  return `en ${diff} días`;
}

export function formatMoney(
  amount: number | null,
  currency: Currency,
  { code = true }: { code?: boolean } = {}
): string {
  if (amount === null) return "—";
  const formatted = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  }).format(amount);
  // es-CO separa el símbolo con un espacio duro ("$ 3.700.000"); lo pegamos y
  // dejamos el código al final, que es lo que desambigua entre COP y USD.
  const symbol = formatted.replace(/\s/g, "");
  return code ? `${symbol} ${currency}` : symbol;
}

/** Suma por moneda, para el resumen del listado. */
export function sumByCurrency(
  deals: { amount: number | null; currency: Currency }[]
): string {
  const totals = new Map<Currency, number>();
  for (const deal of deals) {
    if (deal.amount === null) continue;
    totals.set(deal.currency, (totals.get(deal.currency) ?? 0) + deal.amount);
  }
  if (totals.size === 0) return "sin monto";
  return [...totals.entries()]
    .map(([currency, total]) => formatMoney(total, currency))
    .join(" + ");
}

export const STATUS_LABEL: Record<DealStatus, string> = {
  borrador: "borrador",
  enviada: "enviada",
  vista: "vista",
  seguimiento: "seguimiento",
  ganada: "ganada",
  perdida: "perdida",
};

/** Color del estado. `dim` es el neutro; el resto marca algo que exige atención. */
export const STATUS_TONE: Record<DealStatus, "dim" | "text" | "accent" | "amber" | "red"> = {
  borrador: "dim",
  enviada: "text",
  vista: "accent",
  seguimiento: "amber",
  ganada: "accent",
  perdida: "red",
};

export const NOTE_GLYPH: Record<NoteKind, string> = {
  nota: "·",
  llamada: "☏",
  correo: "@",
  whatsapp: "»",
  reunion: "◇",
  estado: "→",
};

/** Normaliza a E.164 sin espacios para tel: y wa.me. */
export function phoneHref(phone: string): string {
  return phone.replace(/[^\d+]/g, "");
}

export function whatsappHref(phone: string): string {
  return `https://wa.me/${phoneHref(phone).replace(/^\+/, "")}`;
}
