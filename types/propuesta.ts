export interface PropuestaDeliverable {
  title: string;
  description?: string;
}

export interface PropuestaPhase {
  name: string;
  duration: string;
  description?: string;
}

export interface PropuestaInvestment {
  concept: string;
  amount: string;
  note?: string;
}

export interface PropuestaInvestmentRecurring {
  label: string;
  amount: string;
  description?: string;
}

export interface PropuestaContextCard {
  label: string;
  value: string;
}

export interface PropuestaValueMetric {
  value: string;
  label: string;
}

export interface PropuestaValuePilar {
  title: string;
  description: string;
}

export interface PropuestaRequisitoItem {
  title: string;
  description?: string;
}

export interface PropuestaRoadmapPhase {
  label: string;
  title: string;
  description: string;
}

export interface Propuesta {
  slug: string;
  clientName: string;
  projectName: string;
  date: string;
  validUntil?: string;

  subtitle?: string;

  contexto: {
    paragraphs: string[];
    cards?: PropuestaContextCard[];
  };

  comoFunciona?: {
    paragraphs: string[];
  };

  deliverables: {
    intro?: string;
    items: PropuestaDeliverable[];
  };

  requisitosCliente?: {
    intro?: string;
    items: PropuestaRequisitoItem[];
    note?: string;
  };

  inversion: {
    items: PropuestaInvestment[];
    total?: string;
    paymentTerms?: string;
    note?: string;
    recurring?: PropuestaInvestmentRecurring;
  };

  tiempos: {
    totalDuration: string;
    phases: PropuestaPhase[];
  };

  propuestaValor?: {
    comparison: {
      sin: string;
      con: string;
    };
    metrics: PropuestaValueMetric[];
    pilares: PropuestaValuePilar[];
  };

  roadmap?: {
    intro?: string;
    phases: PropuestaRoadmapPhase[];
    closing?: string;
  };

  siguientePaso: {
    text: string;
    calendarUrl: string;
    ctaLabel?: string;
  };

  footer: {
    name: string;
    email: string;
    phone?: string;
    website?: string;
  };
}
