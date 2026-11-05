import { DuaItem, DuaFilterOptions } from '../../types/duas';
import { QURANIC_DUAS } from './quranicDuas';
import { PROPHETIC_DUAS } from './propheticDuas';
import { GENERAL_DUAS } from './generalDuas';
import { SITUATIONAL_DUAS } from './situationalDuas';

export * from './duaCategories';
export * from './quranicDuas';
export * from './propheticDuas';
export * from './generalDuas';
export * from './situationalDuas';

// Consolidated Duas Database
export const ALL_DUAS: DuaItem[] = [
  ...QURANIC_DUAS,
  ...PROPHETIC_DUAS,
  ...GENERAL_DUAS,
  ...SITUATIONAL_DUAS
];

// Arabic Text Normalizer for robust search
export function normalizeArabicText(text: string | null | undefined): string {
  if (!text) return '';
  return text
    // Remove all diacritics / Harakat / Tashkeel
    .replace(/[\u064B-\u065F\u0670]/g, '')
    // Normalize Alefs (أ, إ, آ, ٱ -> ا)
    .replace(/[أإآٱ]/g, 'ا')
    // Normalize Taa Marbuta (ة -> ه)
    .replace(/ة/g, 'ه')
    // Normalize Yaa / Alif Maqsura (ى -> ي)
    .replace(/ى/g, 'ي')
    // Remove Tatweel / Kashida (ـ)
    .replace(/ـ/g, '')
    // Normalize spaces and lowercase
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

// Search and filter Duas
export function searchAndFilterDuas(
  query: string,
  options: DuaFilterOptions = {}
): DuaItem[] {
  const normQuery = normalizeArabicText(query);

  return ALL_DUAS.filter((dua) => {
    // 1. Source Type Filter
    if (options.sourceType && options.sourceType !== 'all' && dua.sourceType !== options.sourceType) {
      return false;
    }

    // 2. Situation Filter
    if (options.situationId && options.situationId !== 'all' && dua.situationId !== options.situationId) {
      return false;
    }

    // 3. Authenticity Grade Filter
    if (options.authenticityGrade && options.authenticityGrade !== 'all' && dua.authenticityGrade !== options.authenticityGrade) {
      return false;
    }

    // 4. Prescribed Count Filter
    if (options.hasPrescribedCount && (!dua.prescribedCount || dua.prescribedCount <= 1)) {
      return false;
    }

    // 5. Audio Filter
    if (options.hasAudio && !dua.audioUrl) {
      return false;
    }

    // 6. Text Query Matching
    if (!normQuery) return true;

    const normTitle = normalizeArabicText(dua.title);
    const normText = normalizeArabicText(dua.arabicText);
    const normExplanation = normalizeArabicText(dua.explanationAr);
    const normOccasion = normalizeArabicText(dua.occasionContextAr);
    const normTags = dua.tags.map(normalizeArabicText);
    const normSubSituation = normalizeArabicText(dua.subSituationAr);
    const normHadithBook = normalizeArabicText(dua.hadithSource?.bookName);
    const normNarrator = normalizeArabicText(dua.hadithSource?.narrator);
    const normSurahName = normalizeArabicText(dua.quranReference?.surahName);
    const enText = (dua.translations?.en || '').toLowerCase();
    const translit = (dua.transliteration || '').toLowerCase();

    return (
      normTitle.includes(normQuery) ||
      normText.includes(normQuery) ||
      normExplanation.includes(normQuery) ||
      normOccasion.includes(normQuery) ||
      normSubSituation.includes(normQuery) ||
      normHadithBook.includes(normQuery) ||
      normNarrator.includes(normQuery) ||
      normSurahName.includes(normQuery) ||
      normTags.some((t) => t.includes(normQuery)) ||
      enText.includes(query.toLowerCase()) ||
      translit.includes(query.toLowerCase())
    );
  });
}

// Deterministic Daily Dua Generator (changes at midnight)
export function getDailyDua(date: Date = new Date()): DuaItem {
  const dayOfYear = Math.floor(
    (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
      Date.UTC(date.getFullYear(), 0, 0)) /
      24 /
      60 /
      60 /
      1000
  );
  const index = Math.abs(dayOfYear) % ALL_DUAS.length;
  return ALL_DUAS[index] || ALL_DUAS[0];
}

// Get Dua by ID
export function getDuaById(id: string): DuaItem | undefined {
  return ALL_DUAS.find((d) => d.id === id);
}

// Stats helper
export function getDuaEncyclopediaStats() {
  const quranicCount = ALL_DUAS.filter((d) => d.sourceType === 'quranic').length;
  const propheticCount = ALL_DUAS.filter((d) => d.sourceType === 'prophetic').length;
  const generalCount = ALL_DUAS.filter((d) => d.sourceType === 'general').length;
  const audioCount = ALL_DUAS.filter((d) => Boolean(d.audioUrl)).length;
  const totalCount = ALL_DUAS.length;

  return {
    totalCount,
    quranicCount,
    propheticCount,
    generalCount,
    audioCount
  };
}
