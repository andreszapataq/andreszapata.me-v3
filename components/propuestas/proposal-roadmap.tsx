import { PropuestaRoadmapPhase } from "@/types/propuesta";
import ProposalSection from "./proposal-section";

interface ProposalRoadmapProps {
  intro?: string;
  phases: PropuestaRoadmapPhase[];
  closing?: string;
}

export default function ProposalRoadmap({
  intro,
  phases,
  closing,
}: ProposalRoadmapProps) {
  return (
    <ProposalSection title="El futuro de tu tienda">
      {intro && <p>{intro}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {phases.map((phase, i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-xl p-6 print:border-gray-300"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-700 mb-1.5">
              {phase.label}
            </p>
            <p className="text-lg font-semibold text-foreground leading-snug mb-2">
              {phase.title}
            </p>
            <p className="text-base text-paragraph leading-relaxed">
              {phase.description}
            </p>
          </div>
        ))}
      </div>

      {closing && <p className="pt-2">{closing}</p>}
    </ProposalSection>
  );
}
