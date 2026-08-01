"use server";

import { createClient } from "@/lib/supabase/server";

export interface PasswordState {
  error: string | null;
  ok: boolean;
}

export async function changePassword(
  _prev: PasswordState,
  formData: FormData
): Promise<PasswordState> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password.length < 12) {
    return { error: "Usa al menos 12 caracteres.", ok: false };
  }
  if (password !== confirm) {
    return { error: "Las dos claves no coinciden.", ok: false };
  }

  const supabase = await createClient();

  // updateUser exige sesión activa, así que esto solo funciona ya estando
  // dentro del CRM: no hace falta correo ni página de recuperación.
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message, ok: false };
  }

  return { error: null, ok: true };
}
