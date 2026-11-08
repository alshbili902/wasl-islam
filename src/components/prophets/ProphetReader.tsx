import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Crown,
  BookOpen,
  Sparkles,
  Share2,
  Printer,
  Copy,
  Check,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  ShieldCheck,
  Info,
  Maximize2,
  Minimize2,
  Type,
  Compass,
  ScrollText,
} from 'lucide-react';
import { Prophet } from '../../data/prophetsTypes';
import { getAdjacentProphets, OFFICIAL_SCHOLARLY_RESOURCES } from '../../data/prophetsData';
import { useShare } from '../../context/ShareContext';
import { copyTextToClipboard } from '../../services/shareService';
import { SITE_CONFIG } from '../../config/siteConfig';

interface ProphetReaderProps {
  prophet: Prophet;
  isRead: boolean;
  isBookmarked: boolean;
  onBack: () => void;
  onSelectProphet: (prophetId: string) => void;
  onToggleRead: (prophetId: string) => void;
  onToggleBookmark: (prophetId: string) => void;
}

export const ProphetReader: React.FC<ProphetReaderProps> = ({
  prophet,
  isRead,
  isBookmarked,
  onBack,
  onSelectProphet,
  onToggleRead,
  onToggleBookmark,
}) => {
  const { openShare } = useShare();
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [focusMode, setFocusMode] = useState<boolean>(false);
  const [copiedAyah, setCopiedAyah] = useState<string | null>(null);
  const [copiedStory, setCopiedStory] = useState<boolean>(false);
  const [sharedStory, setSharedStory] = useState<boolean>(false);

  const { prevProphet, nextProphet } = getAdjacentProphets(prophet.id);

  // Auto-scroll to top when prophet changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [prophet.id]);

  const handleShare = async () => {
    const res = await openShare({
      type: 'article',
      title: `قصة ${prophet.name} عليه السلام`,
      text: `${prophet.title}\n\n${prophet.summary}`,
      source: 'موسوعة قصص الأنبياء — مدار اليقين',
      categoryLabel: 'موسوعة قصص الأنبياء',
      canonicalUrl: `${SITE_CONFIG.productionUrl}/prophets/${prophet.id}`,
    });
    if (res.status === 'shared') {
      setSharedStory(true);
      setTimeout(() => setSharedStory(false), 2200);
    }
  };

  const handleCopyStory = async () => {
    const textToCopy = `${prophet.name} - ${prophet.title}\n\n${prophet.summary}\n\n${prophet.chapters
      .map((ch) => `${ch.title}\n${ch.content}`)
      .join('\n\n')}\n\n- من موسوعة قصص الأنبياء على مدار اليقين (${SITE_CONFIG.productionUrl}/prophets/${prophet.id})`;

    const ok = await copyTextToClipboard(textToCopy);
    if (ok) {
      setCopiedStory(true);
      setTimeout(() => setCopiedStory(false), 2500);
    }
  };

  const handleCopyAyah = async (text: string, ref: string) => {
    const ayahToCopy = `﴿${text}﴾ [${ref}]`;
    const ok = await copyTextToClipboard(ayahToCopy);
    if (ok) {
      setCopiedAyah(ref);
      setTimeout(() => setCopiedAyah(null), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getTextSizeClass = () => {
    switch (fontSize) {
      case 'large':
        return 'text-base sm:text-lg leading-loose';
      case 'xlarge':
        return 'text-lg sm:text-xl leading-loose';
      default:
        return 'text-sm sm:text-base leading-relaxed';
    }
  };

  return (
    <article className="space-y-8 animate-fadeIn">
      {/* Top Floating / Sticky Reader Toolbar */}
      <div className="sticky top-20 z-30 -mx-3 sm:-mx-6 lg:-mx-8 px-3 sm:px-6 lg:px-8 py-3 bg-[#F8FAF9]/95 dark:bg-[#0B131E]/95 backdrop-blur-xl border-b border-gold/20 flex flex-wrap items-center justify-between gap-2 shadow-sm">
        {/* Right side: Back button & Name */}
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl bg-royal/5 dark:bg-white/5 text-royal dark:text-gold hover:bg-gold/15 transition-colors shrink-0 flex items-center gap-1.5 text-xs font-bold"
            aria-label="العودة إلى قائمة الأنبياء"
          >
            <ArrowRight className="w-4 h-4" />
            <span className="hidden sm:inline">جميع الأنبياء</span>
          </button>
          <div className="h-5 w-px bg-gold/25 mx-1" />
          <h2 className="text-sm sm:text-base font-black text-royal dark:text-gold truncate font-quran">
            {prophet.name}
          </h2>
        </div>

        {/* Left side: Controls (Font sizing, Focus mode, Read status, Bookmark, Share, Print) */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Font Size Selector */}
          <div className="flex items-center rounded-xl bg-royal/5 dark:bg-white/5 border border-gold/20 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setFontSize('normal')}
              className={`px-2 py-1 rounded-lg font-bold transition-colors ${
                fontSize === 'normal' ? 'bg-gold text-royal' : 'text-slate-600 dark:text-slate-300'
              }`}
              title="خط عادي"
            >
              A
            </button>
            <button
              type="button"
              onClick={() => setFontSize('large')}
              className={`px-2 py-1 rounded-lg font-bold transition-colors text-sm ${
                fontSize === 'large' ? 'bg-gold text-royal' : 'text-slate-600 dark:text-slate-300'
              }`}
              title="خط كبير"
            >
              A+
            </button>
            <button
              type="button"
              onClick={() => setFontSize('xlarge')}
              className={`px-2 py-1 rounded-lg font-bold transition-colors text-base ${
                fontSize === 'xlarge' ? 'bg-gold text-royal' : 'text-slate-600 dark:text-slate-300'
              }`}
              title="خط كبير جداً"
            >
              A++
            </button>
          </div>

          {/* Toggle Read */}
          <button
            type="button"
            onClick={() => onToggleRead(prophet.id)}
            className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 ${
              isRead
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                : 'bg-royal/5 dark:bg-white/5 border-gold/20 text-slate-600 dark:text-slate-300 hover:text-emerald-500'
            }`}
            title={isRead ? 'تمت القراءة' : 'تحديد كمقروء'}
          >
            <CheckCircle2 className={`w-4 h-4 ${isRead ? 'fill-emerald-500 text-white' : ''}`} />
            <span className="hidden md:inline">{isRead ? 'مقروء' : 'تحديد كمقروء'}</span>
          </button>

          {/* Toggle Bookmark */}
          <button
            type="button"
            onClick={() => onToggleBookmark(prophet.id)}
            className={`p-2 rounded-xl border text-xs transition-colors ${
              isBookmarked
                ? 'bg-gold/20 border-gold text-gold'
                : 'bg-royal/5 dark:bg-white/5 border-gold/20 text-slate-600 dark:text-slate-300 hover:text-gold'
            }`}
            title={isBookmarked ? 'محفوظ في المفضلة' : 'حفظ في المفضلة'}
            aria-label="حفظ"
          >
            {isBookmarked ? <BookmarkCheck className="w-4 h-4 fill-gold text-gold" /> : <Bookmark className="w-4 h-4" />}
          </button>

          {/* Copy Story */}
          <button
            type="button"
            onClick={handleCopyStory}
            className="p-2 rounded-xl bg-royal/5 dark:bg-white/5 border border-gold/20 text-slate-600 dark:text-slate-300 hover:text-gold transition-colors"
            title="نسخ نص القصة"
            aria-label="نسخ القصة"
          >
            {copiedStory ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>

          {/* Share */}
          <button
            type="button"
            onClick={handleShare}
            className="p-2 rounded-xl bg-royal/5 dark:bg-white/5 border border-gold/20 text-slate-600 dark:text-slate-300 hover:text-gold transition-colors"
            title="مشاركة القصة"
            aria-label="مشاركة القصة"
          >
            {sharedStory ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
          </button>

          {/* Print */}
          <button
            type="button"
            onClick={handlePrint}
            className="hidden sm:inline-flex p-2 rounded-xl bg-royal/5 dark:bg-white/5 border border-gold/20 text-slate-600 dark:text-slate-300 hover:text-gold transition-colors"
            title="طباعة القصة بتنسيق مناسب"
            aria-label="طباعة"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Prophet Header Hero Card */}
      <header className="relative rounded-3xl royal-gradient text-white p-6 sm:p-10 overflow-hidden border border-gold/30 shadow-2xl">
        <div className="islamic-pattern absolute inset-0 opacity-25 pointer-events-none" />
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-gold/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-4xl">
          {/* Badges: Order, Ulu Al-Azm, Mentions */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-white/10 text-gold font-bold text-xs border border-gold/30">
              النبي رقم {prophet.order} من أصل 25
            </span>
            {prophet.isUluAlAzm && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500 text-royal font-black text-xs shadow-md">
                <Crown className="w-4 h-4 shrink-0" />
                <span>أولو العزم من الرسل</span>
              </span>
            )}
            <span className="px-3 py-1 rounded-xl bg-white/10 text-slate-200 text-xs border border-white/15">
              ذُكر اسمه {prophet.quranMentionsCount} مرات في القرآن الكريم
            </span>
          </div>

          {/* Prophet Title */}
          <div>
            <h1 className="text-3xl sm:text-5xl font-black font-quran gold-text-gradient leading-tight">
              {prophet.name}
            </h1>
            <p className="text-sm sm:text-base font-bold text-gold/90 mt-1">
              {prophet.title}
            </p>
          </div>

          {/* Summary */}
          <p className="text-sm sm:text-base text-slate-200/95 leading-relaxed pt-2">
            {prophet.summary}
          </p>

          {/* Quick Lineage & Mission Metadata Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gold/20">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-gold/20 space-y-1">
              <span className="text-xs font-bold text-gold flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>النسب والمنشأ الثابت</span>
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {prophet.lineageAndBackground}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-gold/20 space-y-1">
              <span className="text-xs font-bold text-gold flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>الغاية والدعوة المركزية</span>
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {prophet.missionAndCall}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Special Scholarly Warning / Note if applicable (e.g. Idris, Dhu al-Kifl, Al-Yasa) */}
      {prophet.specialScholarlyNote && (
        <aside className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/30 text-amber-800 dark:text-amber-200 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs sm:text-sm leading-relaxed">
            <strong className="font-bold block">تنبيه شرعي موثق وتحذير من الإسرائيليات:</strong>
            <p>{prophet.specialScholarlyNote}</p>
          </div>
        </aside>
      )}

      {/* Interactive Table of Contents (فهرس المحطات والفصول) */}
      <nav aria-label="فهرس محطات القصة" className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#111D2C] border border-gold/25 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-royal dark:text-gold flex items-center gap-2">
          <ScrollText className="w-4 h-4 text-gold" />
          <span>فهرس محطات القصة ({prophet.chapters.length} محطات):</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {prophet.chapters.map((ch, idx) => (
            <a
              key={ch.id}
              href={`#${ch.id}`}
              className="px-3 py-1.5 rounded-xl bg-royal/5 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-gold/15 hover:text-royal dark:hover:text-gold border border-gold/15 text-xs font-semibold transition-all inline-flex items-center gap-1.5"
            >
              <span className="w-4 h-4 rounded-full bg-gold/20 text-gold text-[10px] flex items-center justify-center font-bold">
                {idx + 1}
              </span>
              <span>{ch.title}</span>
            </a>
          ))}
          <a
            href="#lessons"
            className="px-3 py-1.5 rounded-xl bg-gold/10 text-gold hover:bg-gold/20 border border-gold/30 text-xs font-bold transition-all"
          >
            الدروس والعبر المستفادة
          </a>
          <a
            href="#references"
            className="px-3 py-1.5 rounded-xl bg-royal/5 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-gold border border-gold/15 text-xs font-semibold transition-all"
          >
            المصادر والمراجع
          </a>
        </div>
      </nav>

      {/* Chapters Content */}
      <main className="space-y-10">
        {prophet.chapters.map((chapter) => (
          <section
            key={chapter.id}
            id={chapter.id}
            className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111D2C] border border-gold/25 shadow-md space-y-6 scroll-mt-36"
          >
            {/* Chapter Title */}
            <div className="border-b border-gold/20 pb-4">
              <span className="text-xs font-bold text-gold uppercase tracking-wider">
                المحطة {chapter.order} من {prophet.chapters.length}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-royal dark:text-gold font-quran mt-1">
                {chapter.title}
              </h3>
            </div>

            {/* Narrative text */}
            <div className={`text-slate-700 dark:text-slate-200 ${getTextSizeClass()}`}>
              <p className="leading-relaxed whitespace-pre-line">{chapter.content}</p>
            </div>

            {/* Quranic Ayahs in Chapter */}
            {chapter.ayahs && chapter.ayahs.length > 0 && (
              <div className="space-y-4 pt-2">
                {chapter.ayahs.map((ayah, i) => (
                  <div
                    key={i}
                    className="p-5 sm:p-6 rounded-2xl bg-royal/5 dark:bg-white/[0.03] border-r-4 border-gold border-y border-l border-gold/20 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-gold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>سورة {ayah.surahName} [آية: {ayah.ayahNumber}]</span>
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopyAyah(ayah.text, `${ayah.surahName}: ${ayah.ayahNumber}`)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-gold hover:bg-gold/10 transition-colors text-xs flex items-center gap-1"
                          title="نسخ نص الآية"
                        >
                          {copiedAyah === `${ayah.surahName}: ${ayah.ayahNumber}` ? (
                            <span className="text-emerald-500 font-bold flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" />
                              <span>تم النسخ</span>
                            </span>
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <Link
                          to="/quran"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-gold hover:bg-gold/10 transition-colors text-xs flex items-center gap-1"
                          title="فتح في المصحف الرقمي"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">المصحف</span>
                        </Link>
                      </div>
                    </div>

                    {/* Quranic Text */}
                    <p className="font-quran text-lg sm:text-2xl text-royal dark:text-slate-100 text-center leading-loose font-semibold py-2">
                      ﴿{ayah.text}﴾
                    </p>

                    {/* Tafsir Al-Muyassar Note */}
                    <div className="pt-2 border-t border-gold/15 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-white/40 dark:bg-black/20 p-3 rounded-xl">
                      <strong className="text-gold font-bold block mb-1">
                        من التفسير الميسر (مجمع الملك فهد):
                      </strong>
                      <span>{ayah.tafsir}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Sahih Hadiths in Chapter */}
            {chapter.hadiths && chapter.hadiths.length > 0 && (
              <div className="space-y-3 pt-2">
                {chapter.hadiths.map((h, i) => (
                  <div
                    key={i}
                    className="p-4 sm:p-5 rounded-2xl bg-amber-500/5 dark:bg-amber-500/[0.03] border border-amber-500/25 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>حديث نبوي ثابت عن {h.narrator}</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[11px] font-extrabold border border-emerald-500/30">
                        {h.grade}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">
                      «{h.text}»
                    </p>

                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-amber-500/15">
                      <span>المصدر: {h.source} {h.hadithNumber ? `(رقم: ${h.hadithNumber})` : ''}</span>
                      {h.explanation && <span className="text-gold/90">{h.explanation}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}

        {/* Lessons & Morals (الدروس والعبر المستفادة) */}
        <section
          id="lessons"
          className="p-6 sm:p-8 rounded-3xl bg-royal/5 dark:bg-white/[0.02] border border-gold/30 shadow-md space-y-5 scroll-mt-36"
        >
          <div className="flex items-center gap-2 border-b border-gold/20 pb-3">
            <Sparkles className="w-5 h-5 text-gold" />
            <h3 className="text-xl sm:text-2xl font-black text-royal dark:text-gold font-quran">
              أبرز الدروس والعبر المستفادة من قصة {prophet.shortName} عليه السلام
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prophet.lessons.map((lesson, idx) => (
              <div
                key={lesson.id}
                className="p-4 rounded-2xl bg-white dark:bg-[#111D2C] border border-gold/20 space-y-2 shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-gold text-royal text-xs font-black flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <h4 className="text-sm font-bold text-royal dark:text-gold">
                    {lesson.title}
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {lesson.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Quranic Mentions Stations (مواضع ذكر القصة في القرآن الكريم) */}
        <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111D2C] border border-gold/25 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-royal dark:text-gold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-gold" />
            <span>مواضع ذكر قصة {prophet.shortName} في القرآن الكريم:</span>
          </h3>

          <div className="flex flex-wrap gap-2">
            {prophet.quranicStations.map((st, i) => (
              <span
                key={i}
                className="px-3.5 py-2 rounded-xl bg-royal/5 dark:bg-white/5 border border-gold/20 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-gold" />
                <span>سورة {st.surah}: الآيات ({st.verses})</span>
              </span>
            ))}
          </div>
        </section>

        {/* Scholarly References Box (المصادر والمراجع الشرعية المعتمدة) */}
        <section
          id="references"
          className="p-6 sm:p-8 rounded-3xl bg-royal/5 dark:bg-white/[0.02] border border-gold/30 shadow-sm space-y-4 scroll-mt-36"
        >
          <div className="flex items-center justify-between gap-2 border-b border-gold/20 pb-3">
            <h3 className="text-lg font-bold text-royal dark:text-gold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span>المصادر والمراجع الشرعية المعتمدة لهذه القصة:</span>
            </h3>
            <span className="text-xs text-gold font-bold">موثق من المصادر السعودية الرسمية</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {prophet.references.map((ref, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-white dark:bg-[#111D2C] border border-gold/20 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <strong className="text-royal dark:text-gold font-bold">{ref.name}</strong>
                  {ref.url && (
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold hover:underline inline-flex items-center gap-1 text-[11px]"
                    >
                      <span>المصدر الأصلي</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  الكتاب: {ref.book} — الجهة: {ref.authorOrOrg}
                </p>
                {ref.details && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-gold/10">
                    {ref.details}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Quick links to Saudi official platforms */}
          <div className="p-3.5 rounded-2xl bg-gold/10 border border-gold/25 text-xs text-slate-700 dark:text-slate-300 flex flex-wrap items-center justify-between gap-3">
            <span>
              جميع نصوص الآيات والتفاسير المعتمدة مستقاة مباشرة من منشورات <strong>مجمع الملك فهد لطباعة المصحف الشريف بالمدينة المنورة</strong>، والأحاديث مخرجة من الصحيحين وخدمة السنة بالرئاسة العامة للإفتاء.
            </span>
            <div className="flex items-center gap-2">
              {OFFICIAL_SCHOLARLY_RESOURCES.slice(0, 2).map((res) => (
                <a
                  key={res.name}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-royal dark:bg-white text-white dark:text-royal font-bold text-[11px] hover:scale-105 transition-transform inline-flex items-center gap-1"
                >
                  <span>{res.name}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom Previous / Next Prophet Navigation */}
        <nav aria-label="التنقل بين الأنبياء" className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gold/20">
          {prevProphet ? (
            <button
              type="button"
              onClick={() => onSelectProphet(prevProphet.id)}
              className="p-4 rounded-2xl bg-white dark:bg-[#111D2C] border border-gold/20 hover:border-gold transition-all text-right flex items-center gap-3 group"
            >
              <div className="p-2.5 rounded-xl bg-royal/5 dark:bg-white/5 text-gold group-hover:bg-gold group-hover:text-royal transition-colors shrink-0">
                <ChevronRight className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">القصة السابقة</span>
                <span className="text-sm font-bold text-royal dark:text-gold truncate block font-quran">
                  {prevProphet.name}
                </span>
              </div>
            </button>
          ) : (
            <div />
          )}

          {nextProphet ? (
            <button
              type="button"
              onClick={() => onSelectProphet(nextProphet.id)}
              className="p-4 rounded-2xl bg-white dark:bg-[#111D2C] border border-gold/20 hover:border-gold transition-all text-left flex items-center justify-end gap-3 group sm:col-start-2"
            >
              <div className="min-w-0 text-right">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">القصة التالية</span>
                <span className="text-sm font-bold text-royal dark:text-gold truncate block font-quran">
                  {nextProphet.name}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-royal/5 dark:bg-white/5 text-gold group-hover:bg-gold group-hover:text-royal transition-colors shrink-0">
                <ChevronLeft className="w-5 h-5" />
              </div>
            </button>
          ) : (
            <div />
          )}
        </nav>
      </main>
    </article>
  );
};

