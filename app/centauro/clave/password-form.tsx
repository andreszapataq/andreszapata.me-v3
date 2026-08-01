"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { changePassword, type PasswordState } from "./actions";

function SubmitLine() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="crm-mono mt-8 text-left text-crm-accent crm-tap disabled:border-b-crm-faint disabled:text-crm-faint"
    >
      {pending ? "guardando…" : "cambiar →"}
    </button>
  );
}

export default function PasswordForm() {
  const [state, formAction] = useActionState<PasswordState, FormData>(
    changePassword,
    { error: null, ok: false }
  );

  return (
    <form action={formAction} className="mt-8">
      <label className="grid grid-cols-[6.5rem_1fr] items-baseline gap-x-3 py-3">
        <span className="crm-mono text-sm text-crm-faint">nueva</span>
        <input
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={12}
          placeholder="mínimo 12 caracteres"
          className="crm-field"
        />
      </label>

      <label className="grid grid-cols-[6.5rem_1fr] items-baseline gap-x-3 py-3">
        <span className="crm-mono text-sm text-crm-faint">confirmar</span>
        <input
          name="confirm"
          type="password"
          autoComplete="new-password"
          required
          placeholder="otra vez"
          className="crm-field"
        />
      </label>

      {state.error && (
        <p className="mt-6 text-crm-red" role="alert">
          {state.error}
        </p>
      )}

      {state.ok && (
        <p className="mt-6 text-crm-accent" role="status">
          Listo. La próxima vez entras con la clave nueva.
        </p>
      )}

      <SubmitLine />
    </form>
  );
}
