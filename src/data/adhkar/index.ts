import { DhikrItem } from '../../types';
import { EXPANDED_ADHKAR_CATEGORIES, AdhkarCategoryMeta } from './adhkarCategories';
import { ADHKAR_MORNING_EVENING } from './adhkarMorningEvening';
import { ADHKAR_PRAYERS_MOSQUE } from './adhkarPrayersMosque';
import { ADHKAR_SLEEP_WAKEUP } from './adhkarSleepWakeup';
import { ADHKAR_QURANIC_DAILY } from './adhkarQuranicDaily';
import { ADHKAR_SITUATIONS } from './adhkarSituations';

export * from './adhkarCategories';
export * from './adhkarMorningEvening';
export * from './adhkarPrayersMosque';
export * from './adhkarSleepWakeup';
export * from './adhkarQuranicDaily';
export * from './adhkarSituations';

/**
 * الموسوعة الشاملة للأذكار النبوية والقرآنية الموثقة
 * تدمج جميع الأقسام مع الحفاظ الكامل على الأذكار الأصلية
 */
export const ADHKAR_DATA: DhikrItem[] = [
  ...ADHKAR_MORNING_EVENING,
  ...ADHKAR_PRAYERS_MOSQUE,
  ...ADHKAR_SLEEP_WAKEUP,
  ...ADHKAR_QURANIC_DAILY,
  ...ADHKAR_SITUATIONS
];

// Alias for compatibility with existing imports expecting ADHKAR_CATEGORIES
export const ADHKAR_CATEGORIES: AdhkarCategoryMeta[] = EXPANDED_ADHKAR_CATEGORIES;

/**
 * دالة تطبيع النص العربي للبحث الدقيق
 * تزيل التشكيل وتوحد أشكال الألف والياء والتاء المربوطة والهمزات
 */
export function normalizeArabicForSearch(text: string): string {
  if (!text) return '';
  return text
    // Remove Arabic diacritics / tashkeel
    .replace(/[\u064B-\u065F\u0670]/g, '')
    // Normalize Alefs
    .replace(/[إأآٱ]/g, 'ا')
    // Normalize Ya and Alef Maqsura
    .replace(/ى/g, 'ي')
    // Normalize Ta Marbuta
    .replace(/ة/g, 'ه')
    // Remove Quranic punctuation and symbols
    .replace(/[۝۞ۣۚۖۗۘۙۛۜ۟۠ۡۢۤۥۦ]/g, '')
    // Remove brackets and quotes
    .replace(/[«»"'{}\[\]()⟨⟩]/g, '')
    .trim()
    .toLowerCase();
}

/**
 * البحث في موسوعة الأذكار بالاسم، النص، الفضل، التخريج، أو الوسوم
 */
export function searchAdhkar(
  query: string,
  categoryId?: string,
  items: DhikrItem[] = ADHKAR_DATA
): DhikrItem[] {
  let filtered = items;
  if (categoryId && categoryId !== 'all') {
    filtered = filtered.filter((item) => item.category === categoryId);
  }

  const normalizedQuery = normalizeArabicForSearch(query);
  if (!normalizedQuery) return filtered;

  return filtered.filter((item) => {
    const normTitle = normalizeArabicForSearch(item.title);
    const normText = normalizeArabicForSearch(item.text);
    const normVirtue = normalizeArabicForSearch(item.virtue || '');
    const normSource = normalizeArabicForSearch(item.source || '');
    const normSub = normalizeArabicForSearch(item.subCategory || '');
    const normTags = (item.tags || []).map((t) => normalizeArabicForSearch(t)).join(' ');

    return (
      normTitle.includes(normalizedQuery) ||
      normText.includes(normalizedQuery) ||
      normVirtue.includes(normalizedQuery) ||
      normSource.includes(normalizedQuery) ||
      normSub.includes(normalizedQuery) ||
      normTags.includes(normalizedQuery)
    );
  });
}

/**
 * إحصائيات مكتبة الأذكار
 */
export function getAdhkarStats() {
  const totalDhikrs = ADHKAR_DATA.length;
  const categoriesCount = ADHKAR_CATEGORIES.length;
  const prescribedCounts = ADHKAR_DATA.filter((d) => d.isPrescribedCount).length;
  const quranicCount = ADHKAR_DATA.filter((d) => d.referenceQuran || d.category === 'quranic_remembrance').length;

  return {
    totalDhikrs,
    categoriesCount,
    prescribedCounts,
    quranicCount
  };
}

