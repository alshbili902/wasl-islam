import { PROPHETS_DATA } from './prophetsData';
import { SEERAH_MILESTONES } from './seerahData';
import { COMPANIONS_DATA } from './companionsData';
import { TAFSIR_SURAH_OVERVIEWS } from './tafsirData';
import { SURAHS_META } from './surahsMeta';
import { HADITH_DATA } from './hadithData';
import { ACADEMY_TRACKS } from './academyData';
import { WORSHIP_GUIDES } from './worshipData';
import { ASMA_ALLAH_LIST, AQEEDAH_ARTICLES, AQEEDAH_QA_LIST } from './aqeedahData';
import { VERIFIED_FATWAS } from './fatwasData';

export type SearchResultType =
  | 'prophet'
  | 'seerah'
  | 'companion'
  | 'surah'
  | 'hadith'
  | 'academy_track'
  | 'worship_guide'
  | 'asma_allah'
  | 'aqeedah_article'
  | 'fatwa';

export interface GlobalSearchResult {
  id: string;
  type: SearchResultType;
  categoryLabel: string;
  title: string;
  subtitle: string;
  snippet: string;
  url: string;
  badge?: string;
}

export function searchAllEncyclopedia(query: string, filterType?: SearchResultType | 'all'): GlobalSearchResult[] {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return [];

  const results: GlobalSearchResult[] = [];

  // Helper matching function
  const matches = (text: string | undefined | null) => {
    if (!text) return false;
    return text.toLowerCase().includes(cleanQuery);
  };

  // 1. Prophets
  if (!filterType || filterType === 'all' || filterType === 'prophet') {
    PROPHETS_DATA.forEach((p) => {
      if (
        matches(p.name) ||
        matches(p.title) ||
        matches(p.summary) ||
        matches(p.lineageAndBackground) ||
        p.keyThemes.some(matches) ||
        p.lessons.some((l) => matches(l.title) || matches(l.description))
      ) {
        results.push({
          id: `prophet-${p.id}`,
          type: 'prophet',
          categoryLabel: 'قصص الأنبياء',
          title: `نبي الله ${p.name} عليه السلام`,
          subtitle: p.title,
          snippet: p.summary,
          url: `/prophets/${p.id}`,
          badge: `${p.quranMentionsCount} ذكر بالقرآن`
        });
      }
    });
  }

  // 2. Seerah
  if (!filterType || filterType === 'all' || filterType === 'seerah') {
    SEERAH_MILESTONES.forEach((s) => {
      if (
        matches(s.title) ||
        matches(s.summary) ||
        matches(s.period) ||
        s.narrative.some(matches) ||
        s.lessons.some(matches)
      ) {
        results.push({
          id: `seerah-${s.id}`,
          type: 'seerah',
          categoryLabel: 'السيرة النبوية الشريفة',
          title: s.title,
          subtitle: `${s.period} — ${s.yearApprox}`,
          snippet: s.summary,
          url: `/seerah?milestone=${s.id}`,
          badge: s.phase === 'medinan' ? 'عهد مدني' : s.phase === 'meccan' ? 'عهد مكي' : 'قبل البعثة'
        });
      }
    });
  }

  // 3. Companions
  if (!filterType || filterType === 'all' || filterType === 'companion') {
    COMPANIONS_DATA.forEach((c) => {
      if (
        matches(c.name) ||
        matches(c.title) ||
        matches(c.lineage) ||
        matches(c.bioSummary) ||
        c.virtues.some(matches)
      ) {
        results.push({
          id: `companion-${c.id}`,
          type: 'companion',
          categoryLabel: 'سير الصحابة والصحابيات',
          title: `${c.name} (${c.honorific})`,
          subtitle: c.title,
          snippet: c.bioSummary,
          url: `/companions?companionId=${c.id}`,
          badge: c.categoryNameAr
        });
      }
    });
  }

  // 4. Surahs & Tafsir
  if (!filterType || filterType === 'all' || filterType === 'surah') {
    SURAHS_META.forEach((s) => {
      const overview = TAFSIR_SURAH_OVERVIEWS[s.number];
      const nameMatch = matches(s.name) || matches(s.englishName);
      const overviewMatch =
        overview &&
        (matches(overview.periodAndNames) ||
          overview.majorThemes.some(matches) ||
          overview.virtues.some(matches));

      if (nameMatch || overviewMatch) {
        results.push({
          id: `surah-${s.number}`,
          type: 'surah',
          categoryLabel: 'تفسير القرآن الكريم',
          title: `سورة ${s.name}`,
          subtitle: `${s.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} — ${s.numberOfAyahs} آية — الجزء ${s.juz}`,
          snippet: overview ? overview.majorThemes.slice(0, 2).join(' • ') : `سورة كريمة من سور القرآن الكريم، عدد آياتها ${s.numberOfAyahs}.`,
          url: `/tafsir?surah=${s.number}`,
          badge: `صفحة ${s.page}`
        });
      }
    });
  }

  // 5. Hadith
  if (!filterType || filterType === 'all' || filterType === 'hadith') {
    HADITH_DATA.forEach((h) => {
      if (
        matches(h.hadithText) ||
        matches(h.narrator) ||
        matches(h.explanation) ||
        matches(h.sourceBook) ||
        h.benefits.some(matches)
      ) {
        results.push({
          id: `hadith-${h.id}`,
          type: 'hadith',
          categoryLabel: 'الحديث النبوي الشريف',
          title: `${h.collectionNameAr} - حديث #${h.numberInCollection}`,
          subtitle: `${h.narrator} — ${h.sourceBook}`,
          snippet: h.hadithText.length > 150 ? h.hadithText.substring(0, 150) + '...' : h.hadithText,
          url: `/hadith?hadithId=${h.id}`,
          badge: h.grading
        });
      }
    });
  }

  // 6. Academy
  if (!filterType || filterType === 'all' || filterType === 'academy_track') {
    ACADEMY_TRACKS.forEach((t) => {
      const trackMatch =
        matches(t.title) ||
        matches(t.subtitle) ||
        matches(t.description) ||
        t.learningOutcomes.some(matches);
      const lessonMatch = t.lessons.some(
        (l) => matches(l.title) || matches(l.summary) || l.contentParagraphs.some(matches)
      );

      if (trackMatch || lessonMatch) {
        results.push({
          id: `track-${t.id}`,
          type: 'academy_track',
          categoryLabel: 'أكاديمية مدار اليقين',
          title: t.title,
          subtitle: `${t.subtitle} (${t.totalLessons} دروس تفاعلية)`,
          snippet: t.description,
          url: `/academy/${t.id}`,
          badge: t.level
        });
      }
    });
  }

  // 7. Worship Guides
  if (!filterType || filterType === 'all' || filterType === 'worship_guide') {
    WORSHIP_GUIDES.forEach((w) => {
      if (
        matches(w.title) ||
        matches(w.subtitle) ||
        matches(w.summary) ||
        w.pillarsOrObligations.some(matches) ||
        w.steps.some((s) => matches(s.title) || matches(s.actionDescription))
      ) {
        results.push({
          id: `worship-${w.id}`,
          type: 'worship_guide',
          categoryLabel: 'موسوعة تعليم العبادات',
          title: w.title,
          subtitle: w.subtitle,
          snippet: w.summary,
          url: `/worship?guideId=${w.id}`,
          badge: w.pillarNameAr
        });
      }
    });
  }

  // 8. Aqeedah & Asma Allah
  if (!filterType || filterType === 'all' || filterType === 'asma_allah' || filterType === 'aqeedah_article') {
    ASMA_ALLAH_LIST.forEach((a) => {
      if (matches(a.name) || matches(a.meaning) || matches(a.impactOnBeliever)) {
        results.push({
          id: `asma-${a.id}`,
          type: 'asma_allah',
          categoryLabel: 'أسماء الله الحسنى',
          title: `اسم الله: ${a.name}`,
          subtitle: a.meaning,
          snippet: a.impactOnBeliever,
          url: `/aqeedah?tab=names&name=${encodeURIComponent(a.name)}`,
          badge: 'اسم جليل'
        });
      }
    });

    AQEEDAH_ARTICLES.forEach((art) => {
      if (matches(art.title) || matches(art.summary) || art.content.some(matches)) {
        results.push({
          id: `aqeedah-art-${art.id}`,
          type: 'aqeedah_article',
          categoryLabel: 'موسوعة العقيدة الإسلامية',
          title: art.title,
          subtitle: art.sectionTitleAr,
          snippet: art.summary,
          url: `/aqeedah?tab=${art.section}`,
          badge: art.sectionTitleAr
        });
      }
    });

    AQEEDAH_QA_LIST.forEach((qa) => {
      if (matches(qa.question) || matches(qa.answer) || matches(qa.topicTag)) {
        results.push({
          id: `aqeedah-qa-${qa.id}`,
          type: 'aqeedah_article',
          categoryLabel: 'فتاوى وأسئلة العقيدة',
          title: qa.question,
          subtitle: qa.topicTag,
          snippet: qa.answer,
          url: `/aqeedah?tab=qa`,
          badge: qa.levelAr
        });
      }
    });
  }

  // 9. Fatwas
  if (!filterType || filterType === 'all' || filterType === 'fatwa') {
    VERIFIED_FATWAS.forEach((f) => {
      if (
        matches(f.title) ||
        matches(f.question) ||
        matches(f.answer) ||
        matches(f.scholarOrCommittee) ||
        f.tags.some(matches)
      ) {
        results.push({
          id: `fatwa-${f.id}`,
          type: 'fatwa',
          categoryLabel: 'الفتاوى الموثقة',
          title: f.title,
          subtitle: `${f.scholarOrCommittee} — ${f.categoryNameAr}`,
          snippet: f.question,
          url: `/fatwas?fatwaId=${f.id}`,
          badge: f.categoryNameAr
        });
      }
    });
  }

  return results;
}
