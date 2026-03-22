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

export interface Propuesta {
  slug: string;
  clientName: string;
  projectName: string;
  date: string;
  validUntil?: string;

  contexto: {
    paragraphs: string[];
  };

  deliverables: {
    intro?: string;
    items: PropuestaDeliverable[];
  };

  inversion: {
    items: PropuestaInvestment[];
    total?: string;
    paymentTerms?: string;
    note?: string;
  };

  tiempos: {
    totalDuration: string;
    phases: PropuestaPhase[];
  };

  siguientePaso: {
    text: string;
    calendarUrl: string;
  };

  footer: {
    name: string;
    email: string;
    phone?: string;
    website?: string;
  };
}
