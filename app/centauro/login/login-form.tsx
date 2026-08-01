"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signIn, type LoginState } from "./actions";

function SubmitLine() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="crm-mono mt-10 text-left text-crm-accent crm-tap disabled:text-crm-faint disabled:border-b-crm-faint"
    >
      {pending ? "entrando…" : "entrar →"}
    </button>
  );
}

export default function LoginForm({ next }: { next: string }) {
  const [state, formAction] = useActionState<LoginState, FormData>(signIn, {
    error: null,
  });

  return (
    <form action={formAction} className="mt-12">
      <input type="hidden" name="next" value={next} />

      <label className="grid grid-cols-[5.5rem_1fr] items-baseline gap-x-3 py-3">
        <span className="crm-mono text-sm text-crm-faint">correo</span>
        <input
          name="email"
          type="email"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          required
          placeholder="tu@correo.com"
          className="crm-field crm-mono"
        />
      </label>

      <label className="grid grid-cols-[5.5rem_1fr] items-baseline gap-x-3 py-3">
        <span className="crm-mono text-sm text-crm-faint">clave</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          className="crm-field"
        />
      </label>

      {state.error && (
        <p className="mt-6 text-crm-red" role="alert">
          {state.error}
        </p>
      )}

      <SubmitLine />
    </form>
  );
}
