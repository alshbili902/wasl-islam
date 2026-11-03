// Types for Madar Al-Yaqeen Seven New Modules

// 1. Content Authenticity Checker Types
export type AuthenticityGrade =
  | 'sahih' // صحيح متفق عليه أو أخرجه الشيخان
  | 'hasan' // حسن مقبول
  | 'daif' // ضعيف لا يصح الاحتجاج به
  | 'mawdu' // مكذوب موضوع
  | 'no_basis' // لا أصل له في كتب السنة
  | 'distorted_meaning'; // حديث محرف أو مقطوع السياق

export type VerifierCategory =
  | 'all'
  | 'aqeedah'
  | 'ibadat'
  | 'popular_messages' // رسائل الواتساب المنتشرة
  | 'muamalat'
  | 'stories_israiliyyat'
  | 'virtues_times'; // فضائل رجب وشعبان ورمضان والمناسبات

export interface VerifierItem {
  id: string;
  queryPhrase: string; // النص أو الحديث المتداول
  commonSpreadText: string; // صياغة الرسالة المنتشرة
  grade: AuthenticityGrade;
  gradeLabelAr: string;
  category: VerifierCategory;
  categoryLabelAr: string;
  sourceAttribution: string; // لمن ينسب كذباً أو خطأ
  verdictSummary: string; // خلاصة حكم العلماء
  verifiedRulingDetail: string; // التفصيل العلمي وسبب الضعف أو الوضع
  primaryMuhaddith: string; // المحقق والمحدث (ابن باز، الألباني، ابن حجر، العثيمين)
  referenceBook: string; // المصدر في كتب التخريج (سلسلة الأحاديث الضعيفة، مجموع الفتاوى، الدرر السنية)
  authenticAlternative?: {
    text: string;
    source: string;
    meaning: string;
  };
  tags: string[];
}

// 2. Everyday Islamic Fiqh Types
export type FiqhRulingType =
  | 'wajib' // واجب
  | 'mustahabb' // مستحب ومسنون
  | 'mubah' // مباح
  | 'makruh' // مكروه
  | 'haram' // محرم
  | 'permissible_with_conditions'; // جائز بضوابط شرعية

export type FiqhCategory =
  | 'financial' // المعاملات المالية والتجارة المعاصرة
  | 'family' // الأسرة والزواج والتربية
  | 'travel' // فقه السفر والتنقل
  | 'medical' // الفقه الطبي وأحكام المرضى
  | 'modern_tech' // التقنية والذكاء الاصطناعي ووسائل التواصل
  | 'worship_daily'; // نوازل العبادات والطهارة

export interface FiqhRulingItem {
  id: string;
  title: string;
  question: string;
  category: FiqhCategory;
  categoryLabelAr: string;
  ruling: FiqhRulingType;
  rulingLabelAr: string;
  summaryAnswer: string;
  detailedAnswer: string;
  evidenceQuranSunnah: string[];
  fatwaReference: string; // هيئة كبار العلماء، اللجنة الدائمة، مجمع الفقه
  conditionsOrGuidelines?: string[];
  tags: string[];
}

// 3. Islamic Funeral & Burial Guide Types
export type JanazahStepId =
  | 'agony_death' // المحتضر وسكرات الموت والتلقين
  | 'washing' // تغسيل الميت وصفته
  | 'shrouding' // تكفين الميت (رجل وامرأة)
  | 'prayer_steps' // صلاة الجنازة وتكبيراتها الأربع
  | 'carrying_procession' // حمل الجنازة وتشييعها
  | 'burial_grave' // الدفن واللحد والدعاء
  | 'condolences_sunnah' // التعزية والمآتم والبدع المحذورة
  | 'estate_wasiyyah'; // سداد الديون والوصية الشرعية

export interface JanazahStepDetail {
  id: JanazahStepId;
  order: number;
  title: string;
  subtitle: string;
  description: string;
  rulings: string[];
  hadithEvidences: {
    hadith: string;
    source: string;
  }[];
  practicalInstructions: string[];
  duasForStep?: {
    title: string;
    arabicText: string;
    audioUrl?: string;
    repeat?: string;
  }[];
  commonMistakesOrBidah: string[];
}

export interface JanazahFaq {
  question: string;
  answer: string;
  source: string;
}

// 4. Islamic Audio Library Types
export type AudioCategoryType =
  | 'quran_rare' // تلاوات خاشعة ونادرة
  | 'seerah_audio' // السيرة النبوية صوتياً
  | 'scholars_lessons' // دروس الفقه والعقيدة لكبار الأئمة
  | 'tafsir_audio' // روائع التفسير الميسر
  | 'adhkar_ruqyah'; // الأذكار والرقية الشرعية

export interface LibraryAudioItem {
  id: string;
  title: string;
  speakerOrReciter: string;
  category: AudioCategoryType;
  categoryLabelAr: string;
  durationLabel: string;
  audioUrl: string;
  description: string;
  coverImage?: string;
  tags: string[];
}

// 5. Islamic Cards Studio Types
export type CardOrientation = 'square_1_1' | 'story_9_16';
export type CardThemeId = 'emerald_gold' | 'dark_luxury' | 'royal_gold' | 'soft_parchment';

export interface CardQuotePreset {
  id: string;
  category: 'ayah' | 'hadith' | 'dhikr' | 'wisdom' | 'friday';
  categoryLabelAr: string;
  text: string;
  source: string;
  authorOrSpeaker?: string;
}

// 6. Islamic Centers Directory Types
export type CenterType =
  | 'quran_memorization' // جمعية أو مجمع تحفيظ قرآن
  | 'daawah_center' // مركز توعية وجاليات ودعوة
  | 'historic_grand_mosque' // جامع أو مركز إسلامي تاريخي كبير
  | 'online_maqraa' // مقرأة إلكترونية عالمية
  | 'islamic_cultural_center'; // مركز إسلامي دولي

export interface IslamicCenterItem {
  id: string;
  name: string;
  type: CenterType;
  typeLabelAr: string;
  country: string;
  city: string;
  region?: string;
  address: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
  googleMapsUrl?: string;
  description: string;
  servicesOffered: string[];
  isVerified: boolean;
  workingHours?: string;
}

// 7. Scholars and Books Encyclopedia Types
export type ScholarEra =
  | 'companions_tabieen' // الصحابة والتابعون
  | 'four_imams' // الأئمة الأربعة
  | 'hadith_tafsir_masters' // أئمة الحديث والتفسير الكبار
  | 'classical_muhaqqiqin' // كبار المحققين (ابن تيمية، ابن القيم، النووي، ابن حجر)
  | 'contemporary_scholars'; // كبار علماء العصر الحديث (ابن باز، ابن عثيمين، الألباني، الفوزان)

export interface ScholarBookItem {
  id: string;
  title: string;
  field: 'aqeedah' | 'hadith' | 'tafsir' | 'fiqh' | 'seerah_history' | 'language_adab';
  fieldLabelAr: string;
  description: string;
  significance: string;
  volumesCount?: number;
  shamelaUrl?: string;
}

export interface ScholarProfile {
  id: string;
  name: string;
  fullName: string;
  titleOrHonorific: string; // شيخ الإسلام، إمام دار الهجرة، أمير المؤمنين في الحديث
  era: ScholarEra;
  eraLabelAr: string;
  birthDeathHijri: string;
  birthDeathGregorian?: string;
  countryOrCityOrigin: string;
  biographySummary: string;
  scientificMethodology: string; // منهجه العلمي
  prominentTeachers: string[];
  prominentStudents: string[];
  famousQuotes: string[];
  notableBooks: ScholarBookItem[];
}

