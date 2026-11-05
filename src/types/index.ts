export type CalculationMethodId =
  | 'UmmAlQura'
  | 'MuslimWorldLeague'
  | 'Egyptian'
  | 'Karachi'
  | 'Dubai'
  | 'Qatar'
  | 'Kuwait'
  | 'NorthAmerica'
  | 'Turkey';

export type MadhabId = 'Shafi' | 'Hanafi';

export interface CityLocation {
  id: string;
  nameAr: string;
  countryAr: string;
  latitude: number;
  longitude: number;
  method: CalculationMethodId;
}

export interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  revelationType: 'Meccan' | 'Medinan';
  numberOfAyahs: number;
  juz: number;
  page: number;
}

export interface AyahItem {
  number: number;
  numberInSurah: number;
  text: string;
  juz: number;
  page: number;
  hizbQuarter?: number;
  tafsir?: string;
}

export type ContinentId =
  | 'asia'
  | 'africa'
  | 'europe'
  | 'north_america'
  | 'south_america'
  | 'australia';

export interface Reciter {
  id: string;
  nameAr: string;
  nameEn: string;
  countryAr: string;
  countryCode: string;
  continent: ContinentId;
  riwayah: string;
  style: string;
  bio: string;
  serverBaseUrl: string;
  ayahEdition?: string;
  availableSurahs: number[];
  featuredSurahs: number[];
}

export interface AudioTrack {
  id: string;
  title: string;
  subtitle: string;
  reciterName: string;
  reciterId?: string;
  surahNumber?: number;
  url: string;
  backupUrl?: string;
  streamType?: 'mp3' | 'hls' | 'aac';
  isLive?: boolean;
}

export interface KhatmahPlan {
  id: string;
  title: string;
  targetDays: number;
  startDate: string;
  startJuz: number;
  completedDays: number[];
  completedPages: number;
  isPaused: boolean;
  notes?: string;
}

export type AdhkarCategoryId =
  | 'morning'             // أذكار الصباح
  | 'evening'             // أذكار المساء
  | 'prayer'              // أذكار بعد الصلاة المفروضة
  | 'sleep'               // أذكار النوم
  | 'wakeup'              // أذكار الاستيقاظ
  | 'wudu_purification'   // أذكار الوضوء والطهارة
  | 'mosque'              // أذكار المسجد والأذان
  | 'prayer_actions'      // أذكار داخل الصلاة (الاستفتاح، الركوع، السجود، التشهد)
  | 'quranic_remembrance' // الأذكار من القرآن الكريم
  | 'daily_remembrance'   // أذكار التسبيح والتهليل والتحميد والاستغفار
  | 'home'                // أذكار المنزل
  | 'food_drink'          // أذكار الطعام والشراب والضيافة
  | 'travel'              // أذكار السفر والتنقل
  | 'weather_nature'      // أذكار الأحوال الجوية والمطر والرياح والرعد
  | 'distress_relief'     // أذكار الكرب والهم والشدائد
  | 'illness_ruqyah'      // أذكار المرض والرقية الشرعية وعيادة المريض
  | 'hajj_umrah'          // أذكار الحج والعمرة والمشاعر
  | 'friday'              // أذكار يوم الجمعة وساعة الإجابة
  | 'ramadan_fasting'     // أذكار الصيام وشهر رمضان
  | 'protection_wellbeing'// أذكار الحفظ والتحصين ودفع الشرور
  | 'specialized_events'  // أذكار المناسبات والأحداث الخاصة
  | 'general';            // أذكار متنوعة جامعة

export interface DhikrItem {
  id: string;
  category: AdhkarCategoryId;
  title: string;
  text: string;
  count: number;
  source: string;
  grade: string;
  virtue: string;
  // Enriched structured metadata
  subCategory?: string;
  timing?: string;
  occasion?: string;
  repetitionEvidence?: string;
  isPrescribedCount?: boolean;
  transliteration?: string;
  translationEn?: string;
  explanation?: string;
  hadithBook?: string;
  hadithNumber?: string;
  narrator?: string;
  scholarGrading?: string;
  sourceUrl?: string;
  audioUrl?: string;
  tags?: string[];
  referenceQuran?: { surahName: string; surahNumber: number; ayahNumber: number };
}

export interface TasbihPreset {
  id: string;
  text: string;
  virtue: string;
  source: string;
  recommendedTarget: number;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  calculationMethod: CalculationMethodId;
  madhab: MadhabId;
  quranFontSize: number;
  defaultReciterId: string;
  defaultTafsirId: string;
  hapticFeedback: boolean;
  reduceMotion: boolean;
  selectedCity: CityLocation;
}
