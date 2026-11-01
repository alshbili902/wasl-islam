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
  | 'morning'
  | 'evening'
  | 'sleep'
  | 'wakeup'
  | 'prayer'
  | 'general';

export interface DhikrItem {
  id: string;
  category: AdhkarCategoryId;
  title: string;
  text: string;
  count: number;
  source: string;
  grade: string;
  virtue: string;
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
