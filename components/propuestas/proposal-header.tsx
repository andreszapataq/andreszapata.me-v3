interface ProposalHeaderProps {
  clientName: string;
  projectName: string;
  date: string;
  validUntil?: string;
}

export default function ProposalHeader({
  clientName,
  projectName,
  date,
  validUntil,
}: ProposalHeaderProps) {
  const formattedDate = new Date(date + "T12:00:00").toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedValidUntil = validUntil
    ? new Date(validUntil + "T12:00:00").toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <header className="pt-12 md:pt-16 print:pt-0">
      <div className="flex items-center justify-between mb-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 69.43 48"
          className="h-7 w-auto text-foreground"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M0,41.26L22.83,9.81H.6V1.34h34.78v6.81l-22.7,31.38h24.03v8.48H0v-6.74Z" />
          <path d="M48.4,0h8.01l13.02,22.43h-9.68l-7.34-13.09-7.34,13.09h-9.68L48.4,0Z" />
        </svg>
        <span className="text-sm text-now-title">{formattedDate}</span>
      </div>

      <p className="text-lg text-now-title mb-2">Propuesta para {clientName}</p>
      <h1 className="text-[32px] md:text-[40px] font-bold leading-tight mb-4">
        {projectName}
      </h1>

      {formattedValidUntil && (
        <p className="text-sm text-now-title">
          Válida hasta {formattedValidUntil}
        </p>
      )}
    </header>
  );
}
