import { Check } from "lucide-react";
import { PropuestaDeliverable } from "@/types/propuesta";
import ProposalSection from "./proposal-section";

interface ProposalDeliverablesProps {
  intro?: string;
  items: PropuestaDeliverable[];
}

export default function ProposalDeliverables({
  intro,
  items,
}: ProposalDeliverablesProps) {
  return (
    <ProposalSection title="Qué incluye">
      {intro && <p>{intro}</p>}
      <ul className="space-y-4">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3">
            <div className="mt-1 shrink-0">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{item.title}</p>
              {item.description && (
                <p className="text-paragraph mt-0.5">{item.description}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </ProposalSection>
  );
}
