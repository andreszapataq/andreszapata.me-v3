import Link from "next/link";

export default function PropuestaNotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 69.43 48"
        className="h-8 w-auto mb-8 text-foreground"
        fill="currentColor"
      >
        <path d="M0,41.26L22.83,9.81H.6V1.34h34.78v6.81l-22.7,31.38h24.03v8.48H0v-6.74Z" />
        <path d="M48.4,0h8.01l13.02,22.43h-9.68l-7.34-13.09-7.34,13.09h-9.68L48.4,0Z" />
      </svg>
      <h1 className="text-[28px] font-bold mb-3">Propuesta no encontrada</h1>
      <p className="text-lg text-paragraph mb-8 text-center max-w-md">
        Esta propuesta no existe o ya no está disponible. Si crees que es un
        error, contáctame directamente.
      </p>
      <Link
        href="https://andreszapata.me"
        className="text-lg font-semibold underline underline-offset-3 decoration-1 hover:opacity-70 transition-opacity"
      >
        Ir al inicio
      </Link>
    </main>
  );
}
