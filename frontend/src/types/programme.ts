export interface Profile {
  id: string;
  label: string;
  icon: string;
  desc: string;
}

export interface Section {
  id: string;
  globalIndex: number;
  partieNumber: number;
  partieTitle: string;
  chapitreNumber: number;
  chapitreTitle: string;
  title: string;
  intro: string;
  mesureCle: string;
  mesures: string[];
  totalMesuresCount: number;
  profiles: string[];
}

export interface Chapter {
  id: string;
  number: number;
  partieNumber: number;
  title: string;
  sections: Section[];
}

export interface Partie {
  id: string;
  number: number;
  title: string;
  presentation: string[];
  chapters: Chapter[];
}

export interface IntroSection {
  title: string;
  paragraphs: string[];
}

export interface Introduction {
  title: string;
  author: string;
  preamble: string[];
  sections: IntroSection[];
}

export interface BudgetDepense {
  category: string;
  amount: string;
  color: string;
  items: string[];
}

export interface BudgetRecette {
  source: string;
  amount: string;
  details: string;
}

export interface Budget {
  title: string;
  subtitle: string;
  balanceTotal: {
    depensesAnnuelles: string;
    recettesAnnuelles: string;
    baissesImpotsEtCouts: string;
    soldeNet: string;
    polePublicInvestissement: string;
  };
  depensesCategories: BudgetDepense[];
  recettesCategories: BudgetRecette[];
  poleInvestissement: {
    total: string;
    description: string;
  };
}

export interface PlanSubsection {
  title: string;
  paragraphs: string[];
}

export interface Plan {
  id: string;
  title: string;
  subsections: PlanSubsection[];
}

export interface Metadata {
  title: string;
  subtitle: string;
  candidat: string;
  coordination: string;
  edition: string;
  totalParties: number;
  totalChapitres: number;
  totalSections: number;
  totalMesures: number;
  totalMesuresDetails: {
    cles: number;
    detaillees: number;
  };
  generatedAt: string;
}

export interface ProgrammeData {
  metadata: Metadata;
  profiles: Profile[];
  introduction: Introduction;
  parties: Partie[];
  sections: Section[];
  budget: Budget;
  plans: Plan[];
}

export interface AlertConfig {
  enabled: boolean;
  hour: number;
  minute: number;
  profile: string;
  lastFicheId?: string;
  lastTriggerTimestamp?: number;
}
