import { PropuestaContextCard } from "@/types/propuesta";
import ProposalSection from "./proposal-section";

interface ProposalContextProps {
  paragraphs: string[];
  cards?: PropuestaContextCard[];
}

export default function ProposalContext({ paragraphs, cards }: ProposalContextProps) {
  return (
    <ProposalSection title="Contexto">
      {paragraphs.map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}

      {cards && cards.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {cards.map((card, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-xl p-5 print:border-gray-300"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-teal-700 mb-1.5">
                {card.label}
              </p>
              <p className="text-base text-foreground leading-snug">
                {card.value}
              </p>
            </div>
          ))}
        </div>
      )}
    </ProposalSection>
  );
}
