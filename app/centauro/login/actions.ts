"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { CRM_BASE } from "@/lib/crm/route";

export interface LoginState {
  error: string | null;
}

export async function signIn(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "");

  if (!email || !password) {
    return { error: "Faltan datos." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Mensaje genérico a propósito: no revelamos si el correo existe.
    return { error: "No entró. Revisa el correo y la clave." };
  }

  revalidatePath(CRM_BASE, "layout");
  // Solo rutas internas del CRM, para no convertir esto en un redirect abierto.
  redirect(next.startsWith(CRM_BASE) ? next : CRM_BASE);
}
