// Types for Interactive Hajj and Umrah Guide (دليل الحج والعمرة التفاعلي)

export type JourneyType = 'umrah' | 'hajj';

export type HajjType = 'tamattu' | 'qiran' | 'ifrad';

export type StepRuling = 'pillar' | 'obligation' | 'sunnah'; // ركن | واجب | سنة

export interface StepSupplication {
  id: string;
  title: string;
  arabicText: string;
  transliteration?: string;
  translation?: string;
  hadithSource: string;
  recommendedRepeat?: number;
}

export interface JourneyStep {
  id: string;
  stageNumber: number;
  title: string;
  arabicStageTitle: string;
  journey: JourneyType;
  applicableHajjTypes?: HajjType[];
  dateOrTiming: string;
  locationName: string;
  locationCoordinates?: { lat: number; lng: number };
  ruling: StepRuling;
  rulingLabel: string;
  summary: string;
  detailedInstructions: string[];
  requiredActions: string[];
  supplications: StepSupplication[];
  quranHadithEvidence: {
    text: string;
    source: string;
  };
  commonMistakes: string[];
  officialSaudiNotes: string;
}

export interface MiqatLocation {
  id: string;
  nameAr: string;
  nameEn: string;
  modernName: string;
  distanceFromMakkahKm: number;
  servingRegions: string;
  coordinates: { lat: number; lng: number };
  historicalNote: string;
  hadithSource: string;
}

export interface PreparationChecklistItem {
  id: string;
  title: string;
  category: 'official_docs' | 'ihram_clothing' | 'health_medicine' | 'gear' | 'spiritual';
  description: string;
  isEssential: boolean;
}

export interface HajjUmrahFaq {
  id: string;
  question: string;
  answer: string;
  authoritySource: string; // e.g. "هيئة كبار العلماء" أو "اللجنة الدائمة للبحوث العلمية والإفتاء"
  category: 'ihram' | 'tawaf' | 'sai' | 'hajj_days' | 'women_rules' | 'general';
}

export interface HajjUmrahState {
  completedStepIds: string[];
  selectedHajjType: HajjType;
  checklistCheckedIds: string[];
  activeStepId: string | null;
  lastUpdated: string;
}
