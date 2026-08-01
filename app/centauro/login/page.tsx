import LoginForm from "./login-form";
import { CRM_BASE } from "@/lib/crm/route";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <main className="mx-auto min-h-dvh w-full max-w-[34rem] px-6 pt-24 pb-16 text-base leading-relaxed">
      <p className="text-crm-faint">andreszapata.me</p>
      <h1 className="mt-1 text-2xl font-medium tracking-tight">crm</h1>
      <p className="mt-6 max-w-[26rem] text-crm-dim">
        Seguimiento de propuestas. Todo en texto, nada más.
      </p>

      <LoginForm next={next?.startsWith(CRM_BASE) ? next : ""} />
    </main>
  );
}
