import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Languages, 
  BookOpen, 
  Sparkles, 
  RotateCw, 
  Bookmark, 
  BookmarkCheck, 
  CheckCircle2, 
  ArrowRight, 
  Globe, 
  HelpCircle,
  Volume2
} from 'lucide-react';
import { 
  SUPPORTED_LANGUAGES, 
  QURANIC_ARABIC_LEVELS, 
  WORD_BY_WORD_VERSES, 
  CORE_VOCABULARY_CARDS 
} from '../data/quranicArabicData';
import { SupportedLanguageCode } from '../types/quranLearning';
import { PageWrapper } from '../components/layout/PageWrapper';

export const QuranicArabicPage: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState<SupportedLanguageCode>('en');
  const [activeTab, setActiveTab] = useState<'levels' | 'wordbyword' | 'vocab'>('wordbyword');

  // Word-by-word state
  const [activeVerseIndex, setActiveVerseIndex] = useState<number>(0);
  const currentVerse = WORD_BY_WORD_VERSES[activeVerseIndex] || WORD_BY_WORD_VERSES[0];

  // Flashcards state
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [savedVocabIds, setSavedVocabIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('madar_saved_quranic_vocab_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const activeCard = CORE_VOCABULARY_CARDS[currentCardIndex] || CORE_VOCABULARY_CARDS[0];
  const isCardSaved = savedVocabIds.includes(activeCard.id);

  const toggleSaveVocab = (id: string) => {
    setSavedVocabIds((prev) => {
      const updated = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem('madar_saved_quranic_vocab_v1', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const playAudio = (url: string) => {
    const a = new Audio(url);
    a.play().catch(() => {});
  };

  return (
    <PageWrapper
      title="أكاديمية تعلم لغة القرآن الكريم والمفردات القرآنية"
      description="تعلّم العربية القرآنية خطوة بخطوة عبر تحليل الآيات كلمة بكلمة، والتعرف على الجذور اللغوية، وبطاقات المفردات الأكثر تكراراً المترجمة لـ 7 لغات عالمية."
      canonicalPath="/quranic-arabic"
      breadcrumbs={[
        { name: 'الرئيسية', url: '/' },
        { name: 'أكاديمية لغة القرآن', url: '/quranic-arabic' },
      ]}
      schemaType="LearningResource"
    >
      <div className="pb-12 min-w-0 space-y-8">

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl royal-gradient p-6 sm:p-10 text-white shadow-xl border-2 border-gold/40">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-bold">
              <GraduationCap className="w-4 h-4" />
              <span>أكاديمية لغة التنزيل والبيان القرآني</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-gold tracking-tight">
              أكاديمية تعلم لغة القرآن
            </h1>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              تعلّم العربية القرآنية خطوة بخطوة عبر تحليل الآيات كلمة بكلمة، والتعرف على الجذور الثلاثية، وبطاقات المفردات الأكثر تكراراً المترجمة لـ 7 لغات عالمية لغير الناطقين بالعربية.
            </p>
          </div>
          <div className="absolute left-4 bottom-4 opacity-10 pointer-events-none">
            <Languages className="w-64 h-64 text-gold" />
          </div>
        </div>

        {/* Language Selector Bar */}
        <div className="bg-white dark:bg-[#0E1726] p-4 rounded-2xl border border-gold/30 shadow-sm flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-royal dark:text-gold">
            <Globe className="w-4 h-4 text-gold" />
            <span>لغة الترجمة والتفسير اللغوي المساعدة:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setSelectedLang(lang.code)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  selectedLang === lang.code
                    ? 'bg-royal text-gold border border-gold shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-gold/15'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.nameNative}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-[#0E1726] p-2 rounded-2xl border border-gold/30 shadow-sm flex flex-wrap gap-2">
          {[
            { id: 'wordbyword', label: 'التحليل القرآني كلمة بكلمة', icon: BookOpen },
            { id: 'vocab', label: 'بطاقات المفردات والجذور (80%)', icon: RotateCw },
            { id: 'levels', label: 'المستويات التعليمية الخمسة', icon: GraduationCap }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                  isActive
                    ? 'bg-royal text-gold border border-gold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-gold/15'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Word by Word Analysis */}
        {activeTab === 'wordbyword' && (
          <div className="space-y-6">
            {/* Verse Selector Header */}
            <div className="bg-white dark:bg-[#0E1726] p-5 rounded-3xl border border-gold/30 shadow-sm flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-slate-400 block mb-1">الآية المعروضة للتحليل:</span>
                <h3 className="text-lg font-bold text-royal dark:text-gold">
                  سورة {currentVerse.surahName} (الآية {currentVerse.ayahNumber})
                </h3>
              </div>
              <div className="flex gap-2">
                {WORD_BY_WORD_VERSES.map((v, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveVerseIndex(i)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                      activeVerseIndex === i
                        ? 'bg-royal text-gold border border-gold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                    }`}
                  >
                    آية {v.ayahNumber}
                  </button>
                ))}
              </div>
            </div>

            {/* Complete Ayah Display */}
            <div className="bg-white dark:bg-[#0E1726] rounded-3xl p-6 sm:p-8 border-2 border-gold/40 shadow-lg text-center space-y-4">
              <p className="font-quran text-2xl sm:text-3xl font-bold text-royal dark:text-gold leading-loose" dir="rtl">
                {currentVerse.fullAyahText}
              </p>
              <div className="p-3.5 rounded-2xl bg-royal/5 dark:bg-white/5 border border-gold/25 text-xs text-slate-700 dark:text-slate-300">
                <strong className="text-gold">التفسير الميسر:</strong> {currentVerse.tafsirSummary}
              </div>
            </div>

            {/* Individual Word Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {currentVerse.words.map((w) => (
                <div
                  key={w.wordId}
                  className="bg-white dark:bg-[#0E1726] rounded-2xl p-5 border border-gold/30 hover:border-gold shadow-sm flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2 text-center">
                    <span className="font-quran text-2xl sm:text-3xl font-bold text-royal dark:text-gold block" dir="rtl">
                      {w.wordArabic}
                    </span>
                    <span className="text-xs text-slate-400 font-mono block" dir="ltr">
                      [{w.transliteration}]
                    </span>

                    <div className="p-2.5 rounded-xl bg-gold/10 border border-gold/20 text-xs font-bold text-royal dark:text-gold">
                      {w.meanings[selectedLang] || w.meanings.en}
                    </div>

                    <div className="space-y-1 text-right text-[11px] text-slate-600 dark:text-slate-400 pt-1">
                      {w.rootArabic && (
                        <div className="flex justify-between">
                          <span>الجذر اللغوي:</span>
                          <strong className="text-gold font-bold">{w.rootArabic}</strong>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>النوع النحوي:</span>
                        <span>{w.grammarCategoryAr}</span>
                      </div>
                    </div>
                  </div>

                  {w.linguisticBenefitAr && (
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#080E18] text-[10px] text-slate-600 dark:text-slate-300 leading-snug border border-slate-200 dark:border-slate-800">
                      💡 {w.linguisticBenefitAr}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Flashcards & Roots */}
        {activeTab === 'vocab' && (
          <div className="space-y-6">
            <div className="max-w-xl mx-auto space-y-5">
              {/* Card Container */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="cursor-pointer min-h-[300px] bg-white dark:bg-[#0E1726] rounded-3xl p-8 border-2 border-gold/50 shadow-xl flex flex-col justify-between text-center select-none transition-all hover:scale-[1.01]"
              >
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-bold text-gold bg-gold/15 px-2.5 py-0.5 rounded-full">
                    {activeCard.themeCategoryLabelAr}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaveVocab(activeCard.id);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-gold"
                    title={isCardSaved ? 'إزالة من المحفوظات' : 'حفظ الكلمة'}
                  >
                    <Bookmark className={`w-4 h-4 ${isCardSaved ? 'fill-gold text-gold' : ''}`} />
                  </button>
                </div>

                {!isFlipped ? (
                  // Front
                  <div className="space-y-4 py-6">
                    <span className="font-quran text-4xl sm:text-5xl font-extrabold text-royal dark:text-gold block" dir="rtl">
                      {activeCard.wordArabic}
                    </span>
                    <span className="text-xs text-slate-400">
                      تكررت في القرآن: <strong className="text-gold">{activeCard.frequencyInQuran}</strong> مرة
                    </span>
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-slate-800 text-xs italic text-slate-600 dark:text-slate-300 font-quran" dir="rtl">
                      «{activeCard.exampleAyah.text}»
                    </div>
                    <span className="text-[11px] text-slate-400 block">اضغط على البطاقة لقلبها ومشاهدة المعنى والجذر</span>
                  </div>
                ) : (
                  // Back
                  <div className="space-y-4 py-6">
                    <div className="p-4 rounded-2xl gold-gradient text-royal font-extrabold text-lg shadow-sm">
                      {activeCard.meanings[selectedLang] || activeCard.meanings.en}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#080E18]">
                        <span className="text-slate-400 block">الجذر:</span>
                        <strong className="text-gold text-sm">{activeCard.rootArabic}</strong>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#080E18]">
                        <span className="text-slate-400 block">النوع:</span>
                        <span className="font-bold">{activeCard.grammaticalType}</span>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 block">اضغط للعودة إلى وجه البطاقة</span>
                  </div>
                )}

                <div className="text-[11px] text-slate-400">
                  البطاقة {currentCardIndex + 1} من {CORE_VOCABULARY_CARDS.length}
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsFlipped(false);
                    setCurrentCardIndex((prev) => Math.max(0, prev - 1));
                  }}
                  disabled={currentCardIndex === 0}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold disabled:opacity-30 hover:bg-slate-100"
                >
                  السابقة
                </button>

                <button
                  type="button"
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="px-5 py-2.5 rounded-xl bg-royal text-gold font-bold text-xs"
                >
                  {isFlipped ? 'عرض الكلمة' : 'اقلب البطاقة'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsFlipped(false);
                    setCurrentCardIndex((prev) => Math.min(CORE_VOCABULARY_CARDS.length - 1, prev + 1));
                  }}
                  disabled={currentCardIndex === CORE_VOCABULARY_CARDS.length - 1}
                  className="px-5 py-2.5 rounded-xl gold-gradient text-royal font-bold text-xs disabled:opacity-30"
                >
                  التالية
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Curriculum Levels */}
        {activeTab === 'levels' && (
          <div className="space-y-4">
            {QURANIC_ARABIC_LEVELS.map((lvl) => (
              <div
                key={lvl.levelNumber}
                className="bg-white dark:bg-[#0E1726] rounded-3xl p-6 border border-gold/30 shadow-sm space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gold/20 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl gold-gradient text-royal font-black text-lg flex items-center justify-center">
                      {lvl.levelNumber}
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-royal dark:text-gold">
                        {lvl.titleAr}
                      </h3>
                      <p className="text-xs text-slate-400">{lvl.titleEn}</p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {lvl.descriptionAr}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {lvl.modulesList.map((m) => (
                    <div
                      key={m.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-[#090F1A] border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
                    >
                      <h4 className="font-bold text-royal dark:text-gold">{m.titleAr}</h4>
                      <p className="text-slate-500 text-[11px]">{m.summaryAr}</p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {m.topics.map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-gold/10 text-royal dark:text-slate-300 text-[10px] font-semibold"
                          >
                            • {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </PageWrapper>
  );
};

export default QuranicArabicPage;
