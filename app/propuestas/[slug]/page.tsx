import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPropuesta, getAllPropuestaSlugs } from "@/lib/propuestas";
import ProposalHeader from "@/components/propuestas/proposal-header";
import ProposalContext from "@/components/propuestas/proposal-context";
import ProposalDeliverables from "@/components/propuestas/proposal-deliverables";
import ProposalInvestment from "@/components/propuestas/proposal-investment";
import ProposalTimeline from "@/components/propuestas/proposal-timeline";
import ProposalCta from "@/components/propuestas/proposal-cta";
import ProposalFooter from "@/components/propuestas/proposal-footer";
import FloatingBar from "@/components/propuestas/floating-bar";

export function generateStaticParams() {
  return getAllPropuestaSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const propuesta = getPropuesta(slug);

  if (!propuesta) {
    return { title: "Propuesta no encontrada" };
  }

  return {
    title: `Propuesta — ${propuesta.projectName} | Andrés Zapata`,
    description: `Propuesta para ${propuesta.clientName}: ${propuesta.projectName}`,
  };
}

export default async function PropuestaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const propuesta = getPropuesta(slug);

  if (!propuesta) {
    notFound();
  }

  return (
    <>
      <main className="max-w-[840px] mx-auto px-6 md:px-12 pb-28 print:pb-0">
        <ProposalHeader
          clientName={propuesta.clientName}
          projectName={propuesta.projectName}
          date={propuesta.date}
          validUntil={propuesta.validUntil}
        />

        <ProposalContext paragraphs={propuesta.contexto.paragraphs} />

        <ProposalDeliverables
          intro={propuesta.deliverables.intro}
          items={propuesta.deliverables.items}
        />

        <ProposalInvestment
          items={propuesta.inversion.items}
          total={propuesta.inversion.total}
          paymentTerms={propuesta.inversion.paymentTerms}
          note={propuesta.inversion.note}
        />

        <ProposalTimeline
          totalDuration={propuesta.tiempos.totalDuration}
          phases={propuesta.tiempos.phases}
        />

        <ProposalCta
          text={propuesta.siguientePaso.text}
          calendarUrl={propuesta.siguientePaso.calendarUrl}
        />

        <ProposalFooter
          name={propuesta.footer.name}
          email={propuesta.footer.email}
          phone={propuesta.footer.phone}
          website={propuesta.footer.website}
        />
      </main>

      <FloatingBar calendarUrl={propuesta.siguientePaso.calendarUrl} />
    </>
  );
}
