// Types for Advanced Quran Learning & Accessibility Modules:
// 1. Quran Memorization & Revision Coach (/quran-coach)
// 2. Quran Pronunciation & Tajweed Training Lab (/tajweed-lab)
// 3. Quranic Arabic Learning Academy (/quranic-arabic)
// 4. Islamic Sign Language Learning Center (/sign-language)

// ==========================================
// 1. Quran Memorization Coach Types
// ==========================================
export type MemorizationGoalType = 'selected_ayahs' | 'selected_surah' | 'juz' | 'full_quran';
export type RevisionFrequency = 'daily' | 'twice_weekly' | 'spaced_smart';
export type AyahMemorizeStatus = 'new' | 'learning' | 'memorized' | 'needs_revision';

export interface MemorizationPlan {
  id: string;
  title: string;
  goalType: MemorizationGoalType;
  startSurah: number;
  startAyah: number;
  endSurah: number;
  endAyah: number;
  dailyAyahsCount: number;
  daysPerWeek: number;
  preferredDailyTime: string;
  targetCompletionDate?: string;
  revisionFrequency: RevisionFrequency;
  notes?: string;
  createdAt: string;
}

export interface AyahProgressRecord {
  surahNumber: number;
  ayahNumber: number;
  status: AyahMemorizeStatus;
  memorizedDate?: string;
  lastRevisedDate?: string;
  revisionCount: number;
  difficultyRating: 1 | 2 | 3 | 4 | 5; // 1 = very easy, 5 = needs high attention
  notes?: string;
}

export interface MemorizationCoachStorage {
  activePlanId: string | null;
  savedPlans: MemorizationPlan[];
  ayahRecords: Record<string, AyahProgressRecord>; // key: "surah:ayah"
  dailyStreak: number;
  lastActiveDate: string;
}

export interface MemorizationTestQuestion {
  id: string;
  surahNumber: number;
  ayahNumber: number;
  surahName: string;
  type: 'hidden_words' | 'continue_verse' | 'audio_identify' | 'self_reflection';
  prompt: string;
  fullAyahText: string;
  options?: string[];
  correctIndex?: number;
  hiddenWordsSnippet?: string;
  audioUrl?: string;
}

// ==========================================
// 2. Tajweed Training Lab Types
// ==========================================
export type GeneralMakhrajArea = 'jawf' | 'halq' | 'lisan' | 'shafatan' | 'khayshum';

export interface MakhrajItem {
  id: string;
  area: GeneralMakhrajArea;
  areaLabelAr: string;
  nameAr: string;
  letters: string[];
  anatomicalDescription: string;
  audioExampleUrl?: string;
  diagramTitle?: string;
}

export interface LetterProfile {
  letter: string;
  nameAr: string;
  makhrajArea: GeneralMakhrajArea;
  makhrajLabel: string;
  detailedMakhraj: string;
  sifaat: string[]; // صفات الحرف (الجهر، الشدة، الاستعلاء...)
  articulationGuide: string;
  vowelAudioExamples: {
    fatha: string;
    damma: string;
    kasra: string;
    sukun: string;
  };
  commonMistakes: string[];
  quranicExamples: {
    text: string;
    surahName: string;
    ayahNumber: number;
  }[];
}

export interface TajweedRuleItem {
  id: string;
  category: 'noon_tanween' | 'meem_sakinah' | 'madd' | 'qalqalah' | 'lam_ra' | 'stopping_signs';
  categoryLabelAr: string;
  titleAr: string;
  ruleExplanation: string;
  letters: string[];
  howToPronounce: string;
  quranicExamples: {
    verseSnippet: string;
    highlightedPart: string;
    surahName: string;
    ayahNumber: number;
    explanation: string;
    audioUrl?: string;
  }[];
}

export interface TajweedQuizItem {
  id: string;
  category: 'makhraj' | 'rule' | 'sifah' | 'mistake_correction';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  audioUrl?: string;
}

// ==========================================
// 3. Quranic Arabic Academy Types
// ==========================================
export type SupportedLanguageCode = 'ar' | 'en' | 'ur' | 'fr' | 'id' | 'tr' | 'bn';

export interface SupportedLanguage {
  code: SupportedLanguageCode;
  nameEn: string;
  nameNative: string;
  direction: 'ltr' | 'rtl';
  flag: string;
}

export interface QuranicWordAnalysis {
  wordId: string;
  wordArabic: string;
  transliteration: string;
  meanings: Record<SupportedLanguageCode, string>;
  rootArabic?: string;
  grammarCategoryAr: string;
  grammarCategoryEn: string;
  linguisticBenefitAr?: string;
  linguisticBenefitEn?: string;
  frequencyInQuran?: number;
}

export interface WordByWordAyahData {
  surahNumber: number;
  ayahNumber: number;
  surahName: string;
  fullAyahText: string;
  words: QuranicWordAnalysis[];
  tafsirSummary: string;
}

export interface QuranicVocabCard {
  id: string;
  wordArabic: string;
  rootArabic: string;
  frequencyInQuran: number;
  grammaticalType: 'اسم' | 'فعل ماض' | 'فعل مضارع' | 'فعل أمر' | 'حرف' | 'اسم إشارة أو موصول';
  meanings: Record<SupportedLanguageCode, string>;
  themeCategory: 'theology' | 'worship' | 'afterlife' | 'creation' | 'morals' | 'stories';
  themeCategoryLabelAr: string;
  exampleAyah: {
    text: string;
    surahName: string;
    ayahNumber: number;
  };
}

export interface QuranicArabicLevel {
  levelNumber: 1 | 2 | 3 | 4 | 5;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  modulesList: {
    id: string;
    titleAr: string;
    titleEn: string;
    summaryAr: string;
    topics: string[];
  }[];
}

// ==========================================
// 4. Islamic Sign Language Center Types
// ==========================================
export type SignLanguageCategoryId =
  | 'foundations'
  | 'prayer'
  | 'quran'
  | 'adhkar'
  | 'hajj_umrah'
  | 'manners';

export interface SignLanguageCategory {
  id: SignLanguageCategoryId;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  iconName: string;
  badge: string;
}

export interface SignLanguageLesson {
  id: string;
  categoryId: SignLanguageCategoryId;
  titleAr: string;
  subtitleAr: string;
  signLanguageVariant: string; // مثل: لغة الإشارة السعودية المعتمدة
  interpreterName: string;
  interpreterCredential: string;
  reviewStatus: 'verified_official' | 'reviewed_specialist' | 'academic_standard';
  reviewStatusLabelAr: string;
  videoUrl: string; // Verified educational video or accessible demonstration
  videoPosterUrl?: string;
  durationLabel: string;
  descriptionAr: string;
  keySignsExplained: {
    signTitle: string;
    handPosition: string;
    movementGuide: string;
  }[];
  relatedScripture?: {
    type: 'ayah' | 'hadith';
    text: string;
    source: string;
  };
  captionsArabic: {
    timeSec: number;
    text: string;
  }[];
}

