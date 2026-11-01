import { CityLocation, CalculationMethodId } from '../types';

export const CITIES_LIST: CityLocation[] = [
  { id: 'makkah', nameAr: 'مكة المكرمة', countryAr: 'المملكة العربية السعودية', latitude: 21.4225, longitude: 39.8262, method: 'UmmAlQura' },
  { id: 'madinah', nameAr: 'المدينة المنورة', countryAr: 'المملكة العربية السعودية', latitude: 24.4672, longitude: 39.6112, method: 'UmmAlQura' },
  { id: 'riyadh', nameAr: 'الرياض', countryAr: 'المملكة العربية السعودية', latitude: 24.7136, longitude: 46.6753, method: 'UmmAlQura' },
  { id: 'jeddah', nameAr: 'جدة', countryAr: 'المملكة العربية السعودية', latitude: 21.5433, longitude: 39.1728, method: 'UmmAlQura' },
  { id: 'dammam', nameAr: 'الدمام', countryAr: 'المملكة العربية السعودية', latitude: 26.4207, longitude: 50.0888, method: 'UmmAlQura' },
  { id: 'cairo', nameAr: 'القاهرة', countryAr: 'مصر', latitude: 30.0444, longitude: 31.2357, method: 'Egyptian' },
  { id: 'kuwait', nameAr: 'مدينة الكويت', countryAr: 'الكويت', latitude: 29.3759, longitude: 47.9774, method: 'Kuwait' },
  { id: 'dubai', nameAr: 'دبي', countryAr: 'الإمارات العربية المتحدة', latitude: 25.2048, longitude: 55.2708, method: 'Dubai' },
  { id: 'doha', nameAr: 'الدوحة', countryAr: 'قطر', latitude: 25.2854, longitude: 51.5310, method: 'Qatar' },
  { id: 'amman', nameAr: 'عمّان', countryAr: 'الأردن', latitude: 31.9454, longitude: 35.9284, method: 'MuslimWorldLeague' },
  { id: 'quds', nameAr: 'القدس الشريف', countryAr: 'فلسطين', latitude: 31.7683, longitude: 35.2137, method: 'MuslimWorldLeague' },
  { id: 'rabat', nameAr: 'الرباط', countryAr: 'المغرب', latitude: 34.0209, longitude: -6.8416, method: 'MuslimWorldLeague' },
  { id: 'istanbul', nameAr: 'إسطنبول', countryAr: 'تركيا', latitude: 41.0082, longitude: 28.9784, method: 'Turkey' },
  { id: 'london', nameAr: 'لندن', countryAr: 'المملكة المتحدة', latitude: 51.5074, longitude: -0.1278, method: 'MuslimWorldLeague' },
  { id: 'new_york', nameAr: 'نيويورك', countryAr: 'الولايات المتحدة', latitude: 40.7128, longitude: -74.0060, method: 'NorthAmerica' },
  { id: 'sydney', nameAr: 'سيدني', countryAr: 'أستراليا', latitude: -33.8688, longitude: 151.2093, method: 'MuslimWorldLeague' },
];

export const CALCULATION_METHODS_INFO: { id: CalculationMethodId; nameAr: string; region: string }[] = [
  { id: 'UmmAlQura', nameAr: 'تقويم أم القرى — مكة المكرمة', region: 'المملكة العربية السعودية والخليج' },
  { id: 'MuslimWorldLeague', nameAr: 'رابطة العالم الإسلامي', region: 'أوروبا والشرق الأقصى وأجزاء من العالم' },
  { id: 'Egyptian', nameAr: 'الهيئة المصرية العامة للمساحة', region: 'مصر وأفريقيا والشام' },
  { id: 'Dubai', nameAr: 'دائرة الشؤون الإسلامية بدبي', region: 'الإمارات العربية المتحدة' },
  { id: 'Qatar', nameAr: 'وزارة الأوقاف القطرية', region: 'دولة قطر' },
  { id: 'Kuwait', nameAr: 'وزارة الأوقاف الكويتية', region: 'دولة الكويت' },
  { id: 'Turkey', nameAr: 'رئاسة الشؤون الدينية التركية', region: 'تركيا والبلقان' },
  { id: 'Karachi', nameAr: 'جامعة العلوم الإسلامية بكراتشي', region: 'باكستان والهند وجنوب آسيا' },
  { id: 'NorthAmerica', nameAr: 'الجمعية الإسلامية لأمريكا الشمالية (ISNA)', region: 'الولايات المتحدة وكندا' },
];

