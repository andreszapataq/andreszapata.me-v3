import { Check, Info } from "lucide-react";
import { PropuestaRequisitoItem } from "@/types/propuesta";
import ProposalSection from "./proposal-section";

interface ProposalClientRequirementsProps {
  intro?: string;
  items: PropuestaRequisitoItem[];
  note?: string;
}

export default function ProposalClientRequirements({
  intro,
  items,
  note,
}: ProposalClientRequirementsProps) {
  return (
    <ProposalSection title="Qué debe proporcionar el cliente">
      {intro && <p>{intro}</p>}

      <div className="rounded-2xl p-6 md:p-8 bg-amber-50 border border-amber-100 print:border-gray-300 print:bg-white">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-4 h-4 text-amber-700" strokeWidth={2.5} />
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
            Insumos a cargo del cliente
          </p>
        </div>

        <ul className="space-y-4">
          {items.map((item, i) => (
            <li key={i} className="flex gap-3">
              <div className="mt-1 shrink-0">
                <Check className="w-5 h-5 text-amber-600" />
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

        {note && (
          <p className="text-sm mt-6 text-amber-900/80 leading-relaxed border-t border-amber-100 pt-4 print:border-gray-300">
            {note}
          </p>
        )}
      </div>
    </ProposalSection>
  );
}
