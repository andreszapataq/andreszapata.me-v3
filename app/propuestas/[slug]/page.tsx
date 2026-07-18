import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPropuesta, getAllPropuestaSlugs } from "@/lib/propuestas";
import ProposalHeader from "@/components/propuestas/proposal-header";
import ProposalContext from "@/components/propuestas/proposal-context";
import ProposalHowItWorks from "@/components/propuestas/proposal-how-it-works";
import ProposalDeliverables from "@/components/propuestas/proposal-deliverables";
import ProposalClientRequirements from "@/components/propuestas/proposal-client-requirements";
import ProposalInvestment from "@/components/propuestas/proposal-investment";
import ProposalTimeline from "@/components/propuestas/proposal-timeline";
import ProposalValue from "@/components/propuestas/proposal-value";
import ProposalRoadmap from "@/components/propuestas/proposal-roadmap";
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

  const plainProjectName = propuesta.projectName.replace(/\*/g, "");

  return {
    title: `Propuesta — ${plainProjectName} | Andres Zapata`,
    description: `Propuesta para ${propuesta.clientName}: ${plainProjectName}`,
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
          subtitle={propuesta.subtitle}
        />

        <ProposalContext
          paragraphs={propuesta.contexto.paragraphs}
          cards={propuesta.contexto.cards}
        />

        {propuesta.comoFunciona && (
          <ProposalHowItWorks paragraphs={propuesta.comoFunciona.paragraphs} />
        )}

        <ProposalDeliverables
          intro={propuesta.deliverables.intro}
          items={propuesta.deliverables.items}
        />

        {propuesta.requisitosCliente && (
          <ProposalClientRequirements
            intro={propuesta.requisitosCliente.intro}
            items={propuesta.requisitosCliente.items}
            note={propuesta.requisitosCliente.note}
          />
        )}

        <ProposalInvestment
          items={propuesta.inversion.items}
          total={propuesta.inversion.total}
          paymentTerms={propuesta.inversion.paymentTerms}
          note={propuesta.inversion.note}
          recurring={propuesta.inversion.recurring}
        />

        <ProposalTimeline
          totalDuration={propuesta.tiempos.totalDuration}
          phases={propuesta.tiempos.phases}
        />

        {propuesta.propuestaValor && (
          <ProposalValue
            comparison={propuesta.propuestaValor.comparison}
            metrics={propuesta.propuestaValor.metrics}
            pilares={propuesta.propuestaValor.pilares}
          />
        )}

        {propuesta.roadmap && (
          <ProposalRoadmap
            intro={propuesta.roadmap.intro}
            phases={propuesta.roadmap.phases}
            closing={propuesta.roadmap.closing}
          />
        )}

        <ProposalCta
          text={propuesta.siguientePaso.text}
          calendarUrl={propuesta.siguientePaso.calendarUrl}
          label={propuesta.siguientePaso.ctaLabel}
        />

        <ProposalFooter
          name={propuesta.footer.name}
          email={propuesta.footer.email}
          phone={propuesta.footer.phone}
          website={propuesta.footer.website}
        />
      </main>

      <FloatingBar
        calendarUrl={propuesta.siguientePaso.calendarUrl}
        label={propuesta.siguientePaso.ctaLabel}
      />
    </>
  );
}
