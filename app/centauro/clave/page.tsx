import Link from "next/link";
import PasswordForm from "./password-form";
import { CRM_BASE } from "@/lib/crm/route";

export const dynamic = "force-dynamic";

export default function ClavePage() {
  return (
    <main className="mx-auto w-full max-w-crm px-6 pt-12 pb-24 crm-page">
      <Link href={CRM_BASE} className="crm-mono text-sm text-crm-faint crm-tap">
        ← crm
      </Link>

      <h1 className="mt-8 text-2xl font-medium tracking-tight">cambiar clave</h1>
      <p className="mt-2 text-crm-dim">
        Página no enlazada: se llega escribiendo la ruta. Estando dentro no hace
        falta correo de recuperación.
      </p>

      <PasswordForm />
    </main>
  );
}
