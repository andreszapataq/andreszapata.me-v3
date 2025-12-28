interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export default function Section({ title, children }: SectionProps) {
  return (
    <section className="mt-16">
      <h2 className="text-[28px] font-bold mb-4">{title}</h2>
      <div className="text-lg space-y-4 text-paragraph">
        {children}
      </div>
    </section>
  );
}

