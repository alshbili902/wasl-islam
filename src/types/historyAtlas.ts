// Types for Interactive Islamic History Atlas (أطلس التاريخ الإسلامي)

export type HistoricalPeriodId =
  | 'prophetic' // العصر النبوي الشريف (610 - 632 م)
  | 'rashidun'  // عصر الخلفاء الراشدين (632 - 661 م)
  | 'umayyad'   // الدولة الأموية (661 - 750 م)
  | 'abbasid'   // الدولة العباسية (750 - 1258 م)
  | 'andalus'   // الحضارة الإسلامية في الأندلس (711 - 1492 م)
  | 'dynasties' // الدول والممالك الكبرى (الأيوبيون، المماليك، السلاجقة، العثمانيون)
  | 'modern';   // التاريخ الإسلامي الحديث والمعالم

export type EventCategory =
  | 'battle'
  | 'conquest'
  | 'foundation'
  | 'science'
  | 'monument'
  | 'treaty'
  | 'civilization';

export type GeographicRegionId =
  | 'arabia'       // شبه الجزيرة العربية
  | 'levant'       // بلاد الشام
  | 'iraq_persia'  // العراق وفارس
  | 'egypt_africa' // مصر وشمال أفريقيا
  | 'andalus'      // الأندلس والمغرب الأقصى
  | 'central_asia' // آسيا الوسطى وخراسان
  | 'anatolia';    // الأناضول والقسطنطينية

export interface HistoricalCity {
  id: string;
  nameAr: string;
  nameEn: string;
  modernCountry: string;
  region: GeographicRegionId;
  coordinates: { lat: number; lng: number };
  establishedDate: string;
  historicalPeriod: HistoricalPeriodId;
  roleSummary: string;
  monuments: string[];
  keyHistoricalEvents: string[];
  famousScholars: string[];
  academicReferences: string[];
}

export interface HistoricalEvent {
  id: string;
  title: string;
  hijriYear: number | string;
  gregorianYear: number;
  period: HistoricalPeriodId;
  category: EventCategory;
  region: GeographicRegionId;
  cityId?: string;
  cityName: string;
  coordinates: { lat: number; lng: number };
  shortSummary: string;
  detailedNarrative: string;
  keyFigures: string[];
  outcomesAndImpact: string[];
  references: string[];
  scholarlyNotes?: string;
}

export interface HistoricalPeriodInfo {
  id: HistoricalPeriodId;
  nameAr: string;
  timeSpanHijri: string;
  timeSpanGregorian: string;
  capitalCity: string;
  summary: string;
  keyAchievements: string[];
  colorHex: string;
}

export interface HistoricalRoute {
  id: string;
  nameAr: string;
  period: HistoricalPeriodId;
  description: string;
  points: { name: string; lat: number; lng: number }[];
  colorHex: string;
}
