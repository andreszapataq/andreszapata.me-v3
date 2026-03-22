import ProposalSection from "./proposal-section";

interface ProposalContextProps {
  paragraphs: string[];
}

export default function ProposalContext({ paragraphs }: ProposalContextProps) {
  return (
    <ProposalSection title="Contexto">
      {paragraphs.map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
    </ProposalSection>
  );
}
