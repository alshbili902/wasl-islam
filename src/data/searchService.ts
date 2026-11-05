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
import { DEFAULT_COMPANION_ACTIVITIES } from './companionData';
import { UMRAH_STEPS, HAJJ_STEPS, MIQAT_LOCATIONS } from './hajjUmrahData';
import { KIDS_STORIES_DATA, ISLAMIC_PILLARS_KIDS } from './kidsData';
import { HISTORICAL_CITIES, HISTORICAL_TIMELINE_EVENTS } from './historyAtlasData';
import { VERIFIER_DATA } from './verifierData';
import { DAILY_FIQH_DATA } from './dailyFiqhData';
import { JANAZAH_STEPS } from './janazahData';
import { AUDIO_LIBRARY_ITEMS } from './audioLibraryData';
import { ISLAMIC_CENTERS_DATA } from './islamicCentersData';
import { SCHOLARS_DATA } from './scholarsData';
import { POPULAR_MEMORIZATION_TRACKS } from './quranCoachData';
import { TAJWEED_RULES, MAKHAREJ_AREAS } from './tajweedData';
import { QURANIC_ARABIC_LEVELS, CORE_VOCABULARY_CARDS } from './quranicArabicData';
import { SIGN_LANGUAGE_LESSONS } from './signLanguageData';

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
  | 'fatwa'
  | 'companion_activity'
  | 'hajj_umrah_step'
  | 'kids_lesson'
  | 'history_atlas'
  | 'verifier'
  | 'daily_fiqh'
  | 'janazah'
  | 'audio_library'
  | 'islamic_center'
  | 'scholar'
  | 'quran_coach'
  | 'tajweed'
  | 'quranic_arabic'
  | 'sign_language';

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

  // 10. Daily Companion Activities
  if (!filterType || filterType === 'all' || filterType === 'companion_activity') {
    DEFAULT_COMPANION_ACTIVITIES.forEach((act) => {
      if (matches(act.title) || matches(act.description) || matches(act.referenceEvidence)) {
        results.push({
          id: `companion-${act.id}`,
          type: 'companion_activity',
          categoryLabel: 'رفيق المسلم اليومي',
          title: act.title,
          subtitle: act.isObligatory ? 'فرض مكتوب' : 'سنة مستحبة',
          snippet: act.description,
          url: '/companion',
          badge: act.isObligatory ? 'فرض' : 'سنة'
        });
      }
    });
  }

  // 11. Hajj & Umrah Guide Steps & Miqats
  if (!filterType || filterType === 'all' || filterType === 'hajj_umrah_step') {
    [...UMRAH_STEPS, ...HAJJ_STEPS].forEach((step) => {
      if (
        matches(step.title) ||
        matches(step.summary) ||
        matches(step.locationName) ||
        step.detailedInstructions.some(matches) ||
        step.supplications.some((s) => matches(s.title) || matches(s.arabicText))
      ) {
        results.push({
          id: `hajj-umrah-${step.id}`,
          type: 'hajj_umrah_step',
          categoryLabel: step.journey === 'umrah' ? 'مناسك العمرة' : 'مناسك الحج',
          title: step.title,
          subtitle: `${step.arabicStageTitle} — ${step.locationName}`,
          snippet: step.summary,
          url: '/hajj-umrah',
          badge: step.rulingLabel
        });
      }
    });

    MIQAT_LOCATIONS.forEach((miqat) => {
      if (matches(miqat.nameAr) || matches(miqat.modernName) || matches(miqat.servingRegions)) {
        results.push({
          id: `miqat-${miqat.id}`,
          type: 'hajj_umrah_step',
          categoryLabel: 'المواقيت المكانية',
          title: `ميقات ${miqat.nameAr} (${miqat.modernName})`,
          subtitle: `${miqat.distanceFromMakkahKm} كم عن مكة المكرمة`,
          snippet: miqat.servingRegions,
          url: '/hajj-umrah',
          badge: 'ميقات شرعي'
        });
      }
    });
  }

  // 12. Kids Learning World
  if (!filterType || filterType === 'all' || filterType === 'kids_lesson') {
    KIDS_STORIES_DATA.forEach((st) => {
      if (matches(st.title) || matches(st.heroName) || matches(st.moralLesson) || st.paragraphs.some(matches)) {
        results.push({
          id: `kids-story-${st.id}`,
          type: 'kids_lesson',
          categoryLabel: 'عالم الأطفال المسلم',
          title: st.title,
          subtitle: st.heroName,
          snippet: st.moralLesson,
          url: '/kids',
          badge: 'قصص الأطفال'
        });
      }
    });

    ISLAMIC_PILLARS_KIDS.forEach((pillar) => {
      if (matches(pillar.title) || matches(pillar.summary) || matches(pillar.childExample)) {
        results.push({
          id: `kids-pillar-${pillar.id}`,
          type: 'kids_lesson',
          categoryLabel: 'عالم الأطفال المسلم',
          title: pillar.title,
          subtitle: pillar.subtitle,
          snippet: pillar.summary,
          url: '/kids',
          badge: 'أركان الإسلام'
        });
      }
    });
  }

  // 13. Islamic History Atlas
  if (!filterType || filterType === 'all' || filterType === 'history_atlas') {
    HISTORICAL_CITIES.forEach((c) => {
      if (
        matches(c.nameAr) ||
        matches(c.nameEn) ||
        matches(c.modernCountry) ||
        matches(c.roleSummary) ||
        c.monuments.some(matches) ||
        c.famousScholars.some(matches)
      ) {
        results.push({
          id: `history-city-${c.id}`,
          type: 'history_atlas',
          categoryLabel: 'أطلس التاريخ الإسلامي',
          title: `حاضرة ${c.nameAr} (${c.modernCountry})`,
          subtitle: `تأسيس أو فتح: ${c.establishedDate}`,
          snippet: c.roleSummary,
          url: '/history-atlas',
          badge: 'حاضرة تاريخية'
        });
      }
    });

    HISTORICAL_TIMELINE_EVENTS.forEach((ev) => {
      if (
        matches(ev.title) ||
        matches(ev.cityName) ||
        matches(ev.shortSummary) ||
        matches(ev.detailedNarrative) ||
        ev.keyFigures.some(matches)
      ) {
        results.push({
          id: `history-event-${ev.id}`,
          type: 'history_atlas',
          categoryLabel: 'أطلس التاريخ الإسلامي',
          title: ev.title,
          subtitle: `${ev.hijriYear} هـ (${ev.gregorianYear} م) — ${ev.cityName}`,
          snippet: ev.shortSummary,
          url: '/history-atlas',
          badge: 'حدث تاريخي'
        });
      }
    });
  }

  // 14. Content Verifier
  if (!filterType || filterType === 'all' || filterType === 'verifier') {
    VERIFIER_DATA.forEach((v) => {
      if (
        matches(v.queryPhrase) ||
        matches(v.commonSpreadText) ||
        matches(v.verdictSummary) ||
        matches(v.primaryMuhaddith) ||
        v.tags.some(matches)
      ) {
        results.push({
          id: `verifier-${v.id}`,
          type: 'verifier',
          categoryLabel: 'تحقق من صحة الحديث',
          title: `«${v.queryPhrase}»`,
          subtitle: `${v.gradeLabelAr} — ${v.primaryMuhaddith}`,
          snippet: v.verdictSummary,
          url: '/content-verifier',
          badge: v.gradeLabelAr
        });
      }
    });
  }

  // 15. Daily Fiqh
  if (!filterType || filterType === 'all' || filterType === 'daily_fiqh') {
    DAILY_FIQH_DATA.forEach((fq) => {
      if (
        matches(fq.title) ||
        matches(fq.question) ||
        matches(fq.summaryAnswer) ||
        matches(fq.detailedAnswer) ||
        fq.tags.some(matches)
      ) {
        results.push({
          id: `fiqh-${fq.id}`,
          type: 'daily_fiqh',
          categoryLabel: 'فقه الحياة اليومية المعاصرة',
          title: fq.title,
          subtitle: `${fq.categoryLabelAr} — ${fq.rulingLabelAr}`,
          snippet: fq.summaryAnswer,
          url: '/daily-fiqh',
          badge: fq.rulingLabelAr
        });
      }
    });
  }

  // 16. Janazah Guide
  if (!filterType || filterType === 'all' || filterType === 'janazah') {
    JANAZAH_STEPS.forEach((j) => {
      if (
        matches(j.title) ||
        matches(j.subtitle) ||
        matches(j.description) ||
        j.rulings.some(matches)
      ) {
        results.push({
          id: `janazah-${j.id}`,
          type: 'janazah',
          categoryLabel: 'دليل الجنائز والتعزية',
          title: j.title,
          subtitle: j.subtitle,
          snippet: j.description,
          url: '/janazah',
          badge: `المرحلة ${j.order}`
        });
      }
    });
  }

  // 17. Audio Library
  if (!filterType || filterType === 'all' || filterType === 'audio_library') {
    AUDIO_LIBRARY_ITEMS.forEach((a) => {
      if (
        matches(a.title) ||
        matches(a.speakerOrReciter) ||
        matches(a.description) ||
        a.tags.some(matches)
      ) {
        results.push({
          id: `audio-${a.id}`,
          type: 'audio_library',
          categoryLabel: 'المكتبة الصوتية الإسلامية',
          title: a.title,
          subtitle: `${a.speakerOrReciter} (${a.durationLabel})`,
          snippet: a.description,
          url: '/audio-library',
          badge: a.categoryLabelAr
        });
      }
    });
  }

  // 18. Islamic Centers
  if (!filterType || filterType === 'all' || filterType === 'islamic_center') {
    ISLAMIC_CENTERS_DATA.forEach((c) => {
      if (
        matches(c.name) ||
        matches(c.city) ||
        matches(c.country) ||
        matches(c.description) ||
        c.servicesOffered.some(matches)
      ) {
        results.push({
          id: `center-${c.id}`,
          type: 'islamic_center',
          categoryLabel: 'دليل المراكز وحلقات التحفيظ',
          title: c.name,
          subtitle: `${c.city} — ${c.country}`,
          snippet: c.description,
          url: '/islamic-centers',
          badge: c.typeLabelAr
        });
      }
    });
  }

  // 19. Scholars Encyclopedia
  if (!filterType || filterType === 'all' || filterType === 'scholar') {
    SCHOLARS_DATA.forEach((s) => {
      if (
        matches(s.name) ||
        matches(s.fullName) ||
        matches(s.titleOrHonorific) ||
        matches(s.biographySummary) ||
        s.notableBooks.some((b) => matches(b.title) || matches(b.description))
      ) {
        results.push({
          id: `scholar-${s.id}`,
          type: 'scholar',
          categoryLabel: 'موسوعة العلماء والمصنفات',
          title: s.name,
          subtitle: `${s.titleOrHonorific} (${s.birthDeathHijri})`,
          snippet: s.biographySummary,
          url: '/scholars',
          badge: s.eraLabelAr
        });
      }
    });
  }

  // 20. Quran Coach
  if (!filterType || filterType === 'all' || filterType === 'quran_coach') {
    POPULAR_MEMORIZATION_TRACKS.forEach((t, idx) => {
      if (
        matches(t.title) ||
        matches(t.notes) ||
        matches(t.targetCompletionDate) ||
        matches(t.preferredDailyTime)
      ) {
        results.push({
          id: `coach-${idx}`,
          type: 'quran_coach',
          categoryLabel: 'مدرّب حفظ القرآن ومراجعته',
          title: t.title,
          subtitle: `الهدف: ${t.targetCompletionDate || 'متابعة يومية'} (${t.dailyAyahsCount} آيات/يوم)`,
          snippet: t.notes || 'خطة منهجية للحفظ والمراجعة التراكمية والتكرار الذكي.',
          url: '/quran-coach',
          badge: t.revisionFrequency === 'daily' ? 'مراجعة يومية' : 'مراجعة ذكية'
        });
      }
    });
  }

  // 21. Tajweed Lab
  if (!filterType || filterType === 'all' || filterType === 'tajweed') {
    TAJWEED_RULES.forEach((r) => {
      if (
        matches(r.titleAr) ||
        matches(r.categoryLabelAr) ||
        matches(r.ruleExplanation) ||
        matches(r.howToPronounce) ||
        r.quranicExamples.some((ex) => matches(ex.verseSnippet) || matches(ex.explanation))
      ) {
        results.push({
          id: `tajweed-${r.id}`,
          type: 'tajweed',
          categoryLabel: 'معمل النطق والتجويد',
          title: r.titleAr,
          subtitle: `قسم: ${r.categoryLabelAr}`,
          snippet: r.ruleExplanation,
          url: '/tajweed-lab',
          badge: r.categoryLabelAr
        });
      }
    });
    MAKHAREJ_AREAS.forEach((m) => {
      if (matches(m.nameAr) || matches(m.anatomicalDescription) || m.letters.some(matches)) {
        results.push({
          id: `makhraj-${m.id}`,
          type: 'tajweed',
          categoryLabel: 'مخارج الحروف',
          title: m.nameAr,
          subtitle: `حروف المخرج: ${m.letters.join('، ')}`,
          snippet: m.anatomicalDescription,
          url: '/tajweed-lab',
          badge: m.areaLabelAr
        });
      }
    });
  }

  // 22. Quranic Arabic Academy
  if (!filterType || filterType === 'all' || filterType === 'quranic_arabic') {
    QURANIC_ARABIC_LEVELS.forEach((lvl) => {
      if (
        matches(lvl.titleAr) ||
        matches(lvl.titleEn) ||
        matches(lvl.descriptionAr) ||
        lvl.modulesList.some((mod) => matches(mod.titleAr) || mod.topics.some(matches))
      ) {
        results.push({
          id: `arabic-lvl-${lvl.levelNumber}`,
          type: 'quranic_arabic',
          categoryLabel: 'أكاديمية لغة القرآن',
          title: lvl.titleAr,
          subtitle: `المستوى ${lvl.levelNumber}: ${lvl.titleEn}`,
          snippet: lvl.descriptionAr,
          url: '/quranic-arabic',
          badge: `المستوى ${lvl.levelNumber}`
        });
      }
    });
    CORE_VOCABULARY_CARDS.forEach((v) => {
      if (
        matches(v.wordArabic) ||
        matches(v.rootArabic) ||
        matches(v.meanings.en) ||
        matches(v.exampleAyah.text)
      ) {
        results.push({
          id: `vocab-${v.id}`,
          type: 'quranic_arabic',
          categoryLabel: 'مفردات القرآن الكريم',
          title: `مفردة: ${v.wordArabic}`,
          subtitle: `الجذر: [ ${v.rootArabic} ] — النوع: ${v.grammaticalType}`,
          snippet: `سياق الآية: ${v.exampleAyah.text} (${v.exampleAyah.surahName})`,
          url: '/quranic-arabic',
          badge: `تكررت ${v.frequencyInQuran} مرة`
        });
      }
    });
  }

  // 23. Sign Language Learning
  if (!filterType || filterType === 'all' || filterType === 'sign_language') {
    SIGN_LANGUAGE_LESSONS.forEach((lesson) => {
      if (
        matches(lesson.titleAr) ||
        matches(lesson.subtitleAr) ||
        matches(lesson.descriptionAr) ||
        lesson.keySignsExplained.some((k) => matches(k.signTitle) || matches(k.movementGuide))
      ) {
        results.push({
          id: `sign-${lesson.id}`,
          type: 'sign_language',
          categoryLabel: 'مركز التعليم الإسلامي بلغة الإشارة',
          title: lesson.titleAr,
          subtitle: `${lesson.subtitleAr} (${lesson.durationLabel})`,
          snippet: lesson.descriptionAr,
          url: '/sign-language',
          badge: lesson.signLanguageVariant
        });
      }
    });
  }

  return results;
}
