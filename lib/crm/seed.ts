import "server-only";
import { getAllPropuestaSlugs, getPropuesta } from "@/lib/propuestas";
import type { Currency } from "@/types/crm";

export interface SeedDeal {
  slug: string;
  client_name: string;
  project_name: string;
  amount: number | null;
  currency: Currency;
  sent_at: string | null;
  valid_until: string | null;
  source: string;
  status: "enviada";
}

/**
 * "$3.700.000 COP" → { amount: 3700000, currency: "COP" }
 * Los montos de las propuestas son enteros, así que basta con quedarse con los
 * dígitos; los puntos y comas son siempre separadores de miles.
 */
export function parseAmount(raw: string): {
  amount: number | null;
  currency: Currency;
} {
  const currency: Currency = raw.includes("USD")
    ? "USD"
    : raw.includes("EUR")
      ? "EUR"
      : "COP";
  const digits = raw.replace(/[^\d]/g, "");
  return { amount: digits ? Number(digits) : null, currency };
}

/** Los títulos usan *asteriscos* para resaltar; en el CRM va el texto plano. */
function plain(text: string): string {
  return text.replace(/\*/g, "").trim();
}

/** Lee data/propuestas/*.json y lo traduce a filas sembrables de crm_deals. */
export function readPropuestasAsDeals(): SeedDeal[] {
  return getAllPropuestaSlugs()
    .map((slug) => getPropuesta(slug))
    .filter((p) => p !== null)
    .map((p) => {
      const first = p.inversion?.items?.[0];
      const { amount, currency } = first
        ? parseAmount(first.amount)
        : { amount: null, currency: "COP" as Currency };

      return {
        slug: p.slug,
        client_name: p.clientName,
        project_name: plain(p.projectName),
        amount,
        currency,
        sent_at: p.date ?? null,
        valid_until: p.validUntil ?? null,
        source: "propuesta",
        status: "enviada" as const,
      };
    })
    .sort((a, b) => (b.sent_at ?? "").localeCompare(a.sent_at ?? ""));
}
