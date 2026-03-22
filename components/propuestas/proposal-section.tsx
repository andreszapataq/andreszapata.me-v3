interface ProposalSectionProps {
  title: string;
  children: React.ReactNode;
  id?: string;
  className?: string;
}

export default function ProposalSection({
  title,
  children,
  id,
  className,
}: ProposalSectionProps) {
  return (
    <section id={id} className={`mt-16 print:mt-10 print:break-inside-avoid ${className ?? ""}`}>
      <h2 className="text-[28px] font-bold mb-4">{title}</h2>
      <div className="text-lg space-y-4 text-paragraph">{children}</div>
    </section>
  );
}
