import { X, Check } from "lucide-react";
import {
  PropuestaValueMetric,
  PropuestaValuePilar,
} from "@/types/propuesta";
import ProposalSection from "./proposal-section";

interface ProposalValueProps {
  comparison: {
    sin: string;
    con: string;
  };
  metrics: PropuestaValueMetric[];
  pilares: PropuestaValuePilar[];
}

export default function ProposalValue({
  comparison,
  metrics,
  pilares,
}: ProposalValueProps) {
  return (
    <ProposalSection title="Propuesta de valor">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl p-5 bg-red-50 border border-red-100 print:border-gray-300">
          <div className="flex items-center gap-2 mb-2">
            <X className="w-4 h-4 text-red-700" strokeWidth={2.5} />
            <p className="text-xs font-semibold uppercase tracking-wider text-red-700">
              Sin el sistema
            </p>
          </div>
          <p className="text-base text-red-900/85 leading-relaxed">
            {comparison.sin}
          </p>
        </div>
        <div className="rounded-xl p-5 bg-teal-50 border border-teal-100 print:border-gray-300">
          <div className="flex items-center gap-2 mb-2">
            <Check className="w-4 h-4 text-teal-700" strokeWidth={2.5} />
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">
              Con el sistema
            </p>
          </div>
          <p className="text-base text-teal-900/85 leading-relaxed">
            {comparison.con}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {metrics.map((metric, i) => (
          <div
            key={i}
            className="rounded-xl p-5 bg-teal-50 border border-teal-100 text-center print:border-gray-300"
          >
            <p className="text-[32px] md:text-[36px] font-bold leading-none text-teal-700 mb-2">
              {metric.value}
            </p>
            <p className="text-sm text-teal-900/80 leading-snug">
              {metric.label}
            </p>
          </div>
        ))}
      </div>

      <ul className="space-y-4 pt-2">
        {pilares.map((pilar, i) => (
          <li key={i} className="flex gap-3">
            <div className="mt-1 shrink-0">
              <Check className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{pilar.title}</p>
              <p className="text-paragraph mt-0.5">{pilar.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </ProposalSection>
  );
}
