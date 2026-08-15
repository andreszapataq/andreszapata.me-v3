import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { IBM_Plex_Mono } from "next/font/google";
import { createClient } from "@/lib/supabase/server";
import { ALERT_COLUMNS, toTaskAlerts, type TaskAlert } from "@/lib/crm/alerts";
import TaskToasts from "@/components/crm/task-toasts";
import "../globals.css";

// Satoshi para títulos y prosa, igual que el resto del sitio.
const satoshi = localFont({
  src: [
    { path: "../../public/fonts/Satoshi-Variable.woff2", style: "normal" },
    { path: "../../public/fonts/Satoshi-VariableItalic.woff2", style: "italic" },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

// Mono solo para los datos: cifras, fechas y estados que deben alinearse.
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CRM",
  robots: { index: false, follow: false },
  icons: {
    icon: [
      { url: "/favicon-light.png", media: "(prefers-color-scheme: light)" },
      { url: "/favicon-dark.png", media: "(prefers-color-scheme: dark)" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

/**
 * Los pasos siguientes que podrían reclamar atención.
 *
 * Falla en silencio a propósito: este layout también envuelve /login, donde
 * todavía no hay sesión y la consulta no devuelve nada. Un recordatorio que no
 * se pudo leer no puede ser motivo para tumbar la pantalla que lo contiene.
 */
async function readTaskAlerts(): Promise<TaskAlert[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("crm_deals")
      .select(ALERT_COLUMNS)
      .not("next_step_at", "is", null);

    return error ? [] : toTaskAlerts(data ?? []);
  } catch {
    return [];
  }
}

export default async function CrmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Va en el layout y no en la lista para que los avisos sobrevivan la
  // navegación hacia un negocio: montados por pantalla, volverían a aparecer
  // los que acabas de marcar hechos.
  const alerts = await readTaskAlerts();

  return (
    <html lang="es">
      <body
        className={`${satoshi.variable} ${plexMono.variable} crm-body antialiased`}
      >
        {children}
        <TaskToasts alerts={alerts} />
      </body>
    </html>
  );
}
