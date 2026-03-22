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

      <div className="relative pl-8 mt-2">
        <div className="space-y-6">
          {phases.map((phase, i) => (
            <div key={i} className="relative">
              {/* Vertical line (not on last item) */}
              {i < phases.length - 1 && (
                <div className="absolute -left-[21px] top-[22px] -bottom-6 w-px bg-gray-200 print:bg-gray-300" />
              )}
              {/* Step number */}
              <div className="absolute -left-8 top-0.5 w-[22px] h-[22px] rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600 print:bg-gray-100 print:text-gray-500">
                {i + 1}
              </div>

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
