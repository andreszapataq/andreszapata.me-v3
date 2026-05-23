import ProposalSection from "./proposal-section";

interface ProposalHowItWorksProps {
  paragraphs: string[];
}

export default function ProposalHowItWorks({ paragraphs }: ProposalHowItWorksProps) {
  return (
    <ProposalSection title="Cómo funciona">
      {paragraphs.map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
    </ProposalSection>
  );
}
