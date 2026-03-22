import { PropuestaPhase } from "@/types/propuesta";
import ProposalSection from "./proposal-section";

interface ProposalTimelineProps {
  totalDuration: string;
  phases: PropuestaPhase[];
}

export default function ProposalTimeline({
  totalDuration,
  phases,
}: ProposalTimelineProps) {
  return (
    <ProposalSection title="Tiempos">
      <p>
        Duración estimada total:{" "}
        <span className="font-semibold text-foreground">{totalDuration}</span>
      </p>

      <div className="relative pl-6 mt-2">
        {/* Vertical line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gray-200 print:bg-gray-300" />

        <div className="space-y-6">
          {phases.map((phase, i) => (
            <div key={i} className="relative">
              {/* Dot */}
              <div className="absolute -left-6 top-1.5 w-[15px] h-[15px] rounded-full border-2 border-gray-300 bg-white print:border-gray-400" />

              <div>
                <div className="flex flex-wrap items-baseline gap-2">
                  <p className="font-semibold text-foreground">{phase.name}</p>
                  <span className="text-sm text-now-title bg-gray-100 px-2 py-0.5 rounded-full print:bg-gray-50">
                    {phase.duration}
                  </span>
                </div>
                {phase.description && (
                  <p className="text-paragraph mt-1">{phase.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProposalSection>
  );
}
