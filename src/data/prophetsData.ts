import { Prophet, ProphetCategoryId } from './prophetsTypes';
import { PROPHETS_PART_1 } from './prophetsPart1';
import { PROPHETS_PART_2 } from './prophetsPart2';
import { PROPHETS_PART_3 } from './prophetsPart3';

export * from './prophetsTypes';

export const PROPHETS_DATA: Prophet[] = [
  ...PROPHETS_PART_1,
  ...PROPHETS_PART_2,
  ...PROPHETS_PART_3,
];

// Helper functions for easy querying & navigation
export function getProphetById(id: string): Prophet | undefined {
  return PROPHETS_DATA.find((p) => p.id === id);
}

export function getAdjacentProphets(currentId: string): {
  prevProphet: Prophet | null;
  nextProphet: Prophet | null;
} {
  const currentIndex = PROPHETS_DATA.findIndex((p) => p.id === currentId);
  if (currentIndex === -1) {
    return { prevProphet: null, nextProphet: null };
  }
  const prevProphet = currentIndex > 0 ? PROPHETS_DATA[currentIndex - 1] : null;
  const nextProphet = currentIndex < PROPHETS_DATA.length - 1 ? PROPHETS_DATA[currentIndex + 1] : null;
  return { prevProphet, nextProphet };
}

export function filterProphets(
  category: ProphetCategoryId = 'all',
  searchQuery: string = ''
): Prophet[] {
  let list = PROPHETS_DATA;

  if (category !== 'all') {
    if (category === 'ulu_al_azm') {
      list = list.filter((p) => p.isUluAlAzm);
    } else {
      list = list.filter((p) => p.categories.includes(category));
    }
  }

  const query = searchQuery.trim().toLowerCase();
  if (query) {
    list = list.filter((p) => {
      const matchName = p.name.toLowerCase().includes(query);
      const matchShortName = p.shortName.toLowerCase().includes(query);
      const matchTitle = p.title.toLowerCase().includes(query);
      const matchSummary = p.summary.toLowerCase().includes(query);
      const matchThemes = p.keyThemes.some((t) => t.toLowerCase().includes(query));
      return matchName || matchShortName || matchTitle || matchSummary || matchThemes;
    });
  }

  return list;
}

export const PROPHETS_STATS = {
  totalCount: PROPHETS_DATA.length, // 25
  uluAlAzmCount: PROPHETS_DATA.filter((p) => p.isUluAlAzm).length, // 5
  totalChapters: PROPHETS_DATA.reduce((acc, p) => acc + p.chapters.length, 0),
  totalLessons: PROPHETS_DATA.reduce((acc, p) => acc + p.lessons.length, 0),
};

