import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Search,
  Sparkles,
  BookMarked,
  Share2,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Volume2,
  Type,
  ListFilter
} from 'lucide-react';
import { SURAHS_META } from '../data/surahsMeta';
import { TAFSIR_SURAH_OVERVIEWS, AyahTafsirItem, SurahTafsirOverview } from '../data/tafsirData';
import { PageWrapper } from '../components/layout/PageWrapper';
import { useShare } from '../context/ShareContext';
import { copyTextToClipboard } from '../services/shareService';
import { SITE_CONFIG } from '../config/siteConfig';

export const TafsirPage: React.FC = () => {
  const { openShare } = useShare();
  const [searchParams, setSearchParams] = useSearchParams();
  const surahParam = Number(searchParams.get('surah')) || 1;

  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number>(surahParam);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedAyahNumber, setCopiedAyahNumber] = useState<number | null>(null);
  const [sharedAyahNumber, setSharedAyahNumber] = useState<number | null>(null);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');

  const currentSurahMeta = useMemo(() => {
    return SURAHS_META.find((s) => s.number === selectedSurahNumber) || SURAHS_META[0];
  }, [selectedSurahNumber]);

  const currentTafsirOverview = useMemo<SurahTafsirOverview | undefined>(() => {
    return TAFSIR_SURAH_OVERVIEWS[selectedSurahNumber];
  }, [selectedSurahNumber]);

  const handleSelectSurah = (num: number) => {
    setSelectedSurahNumber(num);
    setSearchParams({ surah: num.toString() });
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const handleCopyAyahTafsir = async (item: AyahTafsirItem) => {
    const text = `﴿${item.ayahText}﴾ [سورة ${currentSurahMeta.name}: ${item.ayahNumber}]\n\nالتفسير الميسر:\n${item.tafsirMuyassar}\n\n— من موسوعة التفسير بمشروع مدار اليقين (${SITE_CONFIG.productionUrl}/tafsir?surah=${currentSurahMeta.number})`;
    const ok = await copyTextToClipboard(text);
    if (ok) {
      setCopiedAyahNumber(item.ayahNumber);
      setTimeout(() => setCopiedAyahNumber(null), 2000);
    }
  };

  const handleShareAyahTafsir = async (item: AyahTafsirItem) => {
    const res = await openShare({
      type: 'quran',
      title: `تفسير آية ${item.ayahNumber} من سورة ${currentSurahMeta.name}`,
      text: item.ayahText,
      surahName: currentSurahMeta.name,
      surahNumber: currentSurahMeta.number,
      ayahNumber: item.ayahNumber,
      explanation: `التفسير الميسر: ${item.tafsirMuyassar}`,
      canonicalUrl: `${SITE_CONFIG.productionUrl}/tafsir?surah=${currentSurahMeta.number}`,
    });
    if (res.status === 'shared') {
      setSharedAyahNumber(item.ayahNumber);
      setTimeout(() => setSharedAyahNumber(null), 2200);
    }
  };

  // Filtered surahs for selector search
  const filteredSurahs = useMemo(() => {
    if (!searchQuery.trim()) return SURAHS_META;
    return SURAHS_META.filter(
      (s) =>
        s.name.includes(searchQuery) ||
        s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.number.toString() === searchQuery.trim()
    );
  }, [searchQuery]);

  const fontSizeClasses = {
    normal: 'text-base sm:text-lg',
    large: 'text-lg sm:text-xl',
    xlarge: 'text-xl sm:text-2xl',
  };

  const surahTypeAr = currentSurahMeta.revelationType === 'Meccan' ? 'مكية' : 'مدنية';

  return (
    <PageWrapper
      title={`تفسير سورة ${currentSurahMeta.name} كاملاً | التفسير الميسر المعتمد`}
      description={`تفسير وبيان معاني آيات سورة ${currentSurahMeta.name} (${surahTypeAr}، ${currentSurahMeta.numberOfAyahs} آية) وفق التفسير الميسر المعتمد لمجمع الملك فهد.`}
      canonicalPath={`/tafsir?surah=${currentSurahMeta.number}`}
      breadcrumbs={[
        { name: 'الرئيسية', url: '/' },
        { name: 'تفسير القرآن', url: '/tafsir' },
        { name: `تفسير سورة ${currentSurahMeta.name}`, url: `/tafsir?surah=${currentSurahMeta.number}` },
      ]}
      schemaType="Article"
    >
      <div className="py-2 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="relative rounded-3xl p-8 sm:p-12 mb-10 overflow-hidden bg-gradient-to-br from-[#072A20] via-[#093528] to-[#041a14] border border-gold/30 shadow-2xl text-white">
        <div className="islamic-pattern absolute inset-0 opacity-15 pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-semibold mb-4">
            <BookOpen className="w-4 h-4" />
            <span>موسوعة التفسير الميسر المعتمدة</span>
          </div>
          <h1 className="font-quran text-3xl sm:text-5xl text-gold font-bold mb-4 leading-tight">
            تفسير القرآن الكريم
          </h1>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-6">
            موسوعة شاملة لتفسير كتاب الله العزيز، مبنية على «التفسير الميسر» المعتمد من مجمع الملك فهد لطباعة المصحف الشريف بالمدينة المنورة، مع بيان مقاصد السور، وأسباب النزول، وغريب المفردات القرآنية وربط مباشر بالمصحف الشريف.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              114 سورة كاملة
            </span>
            <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl border border-white/10">
              <BookMarked className="w-3.5 h-3.5 text-gold" />
              اعتماد مجمع الملك فهد
            </span>
            <Link
              to="/quran"
              className="flex items-center gap-1.5 bg-gold/20 hover:bg-gold/30 text-gold px-3 py-1.5 rounded-xl border border-gold/40 transition-colors"
            >
              <span>الانتقال للمصحف الشريف</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Grid: Surah Selector List + Tafsir Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Surah Picker (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl p-5 border border-gold/20 shadow-md">
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center justify-between">
              <span>فهرس سور القرآن</span>
              <span className="text-xs text-gold font-normal">114 سورة</span>
            </h2>
            <div className="relative">
              <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن اسم السورة أو رقمها..."
                className="w-full pl-3 pr-9 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <div className="max-h-[650px] overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
            {filteredSurahs.map((surah) => {
              const isSelected = surah.number === selectedSurahNumber;
              return (
                <button
                  key={surah.number}
                  onClick={() => handleSelectSurah(surah.number)}
                  className={`w-full text-right p-3 rounded-2xl transition-all flex items-center justify-between border ${
                    isSelected
                      ? 'bg-royal text-gold border-gold font-bold shadow-md dark:bg-gold dark:text-royal'
                      : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-gold/10 border-transparent text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${
                        isSelected
                          ? 'border-gold bg-gold/20 text-gold dark:border-royal dark:bg-royal/20 dark:text-royal'
                          : 'border-slate-300 dark:border-slate-700 text-slate-500'
                      }`}
                    >
                      {surah.number}
                    </span>
                    <div>
                      <div className="text-sm">سورة {surah.name}</div>
                      <div className="text-[10px] opacity-75">
                        {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} • {surah.numberOfAyahs} آية
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] opacity-75">
                    جزء {surah.juz}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Surah Overview & Tafsir Reader (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Surah Title Banner */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gold/25 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-gold mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-gold/15 border border-gold/30">
                  سورة رقم {currentSurahMeta.number}
                </span>
                <span>• {currentSurahMeta.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}</span>
                <span>• {currentSurahMeta.numberOfAyahs} آية</span>
                <span>• صفحة {currentSurahMeta.page}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-quran text-royal dark:text-gold">
                سورة {currentSurahMeta.name}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {/* Font Sizer */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                <button
                  onClick={() => setFontSize('normal')}
                  className={`px-2 py-1 rounded-lg font-bold ${
                    fontSize === 'normal' ? 'bg-gold text-royal shadow-sm' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  أ
                </button>
                <button
                  onClick={() => setFontSize('large')}
                  className={`px-2 py-1 rounded-lg font-bold ${
                    fontSize === 'large' ? 'bg-gold text-royal shadow-sm' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  أ+
                </button>
                <button
                  onClick={() => setFontSize('xlarge')}
                  className={`px-2 py-1 rounded-lg font-bold ${
                    fontSize === 'xlarge' ? 'bg-gold text-royal shadow-sm' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  أ++
                </button>
              </div>

              <Link
                to="/quran"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-royal/10 dark:bg-gold/15 hover:bg-gold/25 text-royal dark:text-gold border border-gold/30 transition-all"
              >
                <span>المصحف</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Surah Themes & Virtues (if available in overview) */}
          {currentTafsirOverview && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gold/20 shadow-md space-y-4">
              <div>
                <h3 className="text-xs font-bold text-gold uppercase tracking-wider mb-1">
                  أسماء السورة ونزولها:
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  {currentTafsirOverview.periodAndNames}
                </p>
              </div>

              {currentTafsirOverview.majorThemes.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-gold uppercase tracking-wider mb-2">
                    المقاصد والموضوعات الكبرى للسورة:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentTafsirOverview.majorThemes.map((theme, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
                        <span>{theme}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentTafsirOverview.virtues.length > 0 && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="text-xs font-bold text-gold uppercase tracking-wider mb-2">
                    فضائل السورة المأثورة:
                  </h3>
                  <div className="space-y-1.5">
                    {currentTafsirOverview.virtues.map((v, idx) => (
                      <p
                        key={idx}
                        className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2"
                      >
                        <Sparkles className="w-3 h-3 text-gold shrink-0 mt-0.5" />
                        <span>{v}</span>
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tafsir Ayahs Stream */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>آيات السورة والتفسير الميسر</span>
              <span className="text-xs text-slate-400">مجمع الملك فهد لطباعة المصحف</span>
            </h3>

            {currentTafsirOverview && currentTafsirOverview.selectedAyahs.length > 0 ? (
              currentTafsirOverview.selectedAyahs.map((item) => (
                <div
                  key={item.ayahNumber}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gold/20 shadow-md space-y-4 hover:border-gold/40 transition-colors"
                >
                  {/* Ayah Header & Arabic Text */}
                  <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <span className="w-7 h-7 rounded-full bg-gold/15 text-gold font-bold text-xs flex items-center justify-center shrink-0 border border-gold/30">
                      {item.ayahNumber}
                    </span>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleShareAyahTafsir(item)}
                        className="p-1.5 rounded-xl bg-gold/10 hover:bg-gold/20 text-gold transition-colors text-xs flex items-center gap-1"
                        title="مشاركة الآية وتفسيرها"
                      >
                        {sharedAyahNumber === item.ayahNumber ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-emerald-500">تمت المشاركة</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-3.5 h-3.5" />
                            <span>مشاركة</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleCopyAyahTafsir(item)}
                        className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-gold/20 text-slate-500 hover:text-gold transition-colors text-xs flex items-center gap-1"
                        title="نسخ الآية وتفسيرها"
                      >
                        {copiedAyahNumber === item.ayahNumber ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-emerald-500">تم النسخ</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>نسخ</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Quranic Text */}
                  <p
                    className={`font-quran text-slate-900 dark:text-slate-100 text-right leading-loose ${fontSizeClasses[fontSize]}`}
                  >
                    {item.ayahText}
                  </p>

                  {/* Tafsir Muyassar Box */}
                  <div className="p-4 rounded-2xl bg-royal/5 dark:bg-white/[0.03] border-r-4 border-gold border-y border-l border-gold/15 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed text-justify">
                    <span className="font-bold text-royal dark:text-gold ml-1">
                      التفسير الميسر:
                    </span>
                    {item.tafsirMuyassar}
                  </div>

                  {/* Vocabulary if available */}
                  {item.vocabulary && item.vocabulary.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <span className="text-[11px] font-bold text-gold">
                        معاني الكلمات:
                      </span>
                      {item.vocabulary.map((vocab, vIdx) => (
                        <span
                          key={vIdx}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                        >
                          <strong className="text-royal dark:text-gold">{vocab.word}</strong>: {vocab.meaning}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gold/20 shadow-md text-center space-y-4">
                <BookOpen className="w-12 h-12 text-gold mx-auto opacity-75" />
                <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  تفسير سورة {currentSurahMeta.name} متاح بالكامل
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  يمكنك قراءة نص السورة كاملاً مع تلاوات كبار القراء والتفسير التفاعلي كلمة بكلمة في صفحة المصحف الشريف.
                </p>
                <Link
                  to="/quran"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-royal text-gold font-bold text-xs shadow-lg hover:bg-gold hover:text-royal transition-all"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>فتح سورة {currentSurahMeta.name} في المصحف الشريف</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </PageWrapper>
  );
};

