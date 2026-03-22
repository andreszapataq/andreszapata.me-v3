import { ArrowRight } from "lucide-react";
import ProposalSection from "./proposal-section";

interface ProposalCtaProps {
  text: string;
  calendarUrl: string;
}

export default function ProposalCta({ text, calendarUrl }: ProposalCtaProps) {
  return (
    <ProposalSection title="Siguiente paso">
      <p>{text}</p>
      <div className="pt-2 print:hidden">
        <a
          href={calendarUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-foreground text-white rounded-xl px-8 py-4 text-lg font-semibold hover:opacity-90 transition-opacity"
        >
          Agendar llamada
          <ArrowRight className="w-5 h-5" />
        </a>
      </div>
    </ProposalSection>
  );
}
