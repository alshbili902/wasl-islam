import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Search,
  Volume2,
  Bookmark,
  BookmarkCheck,
  Share2,
  ZoomIn,
  ZoomOut,
  Moon,
  Sun,
  Play,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Check,
  Loader2,
} from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { SURAHS_META, FALLBACK_SURAHS_CONTENT } from '../data/surahsMeta';
import { RECITERS_DATA } from '../data/recitersData';
import { AyahItem } from '../types';
import { useApp } from '../context/AppContext';
import { useAudio } from '../context/AudioContext';
import { useShare } from '../context/ShareContext';
import { SITE_CONFIG } from '../config/siteConfig';

const TAFSIR_EDITIONS = [
  { id: 'ar.muyassar', nameAr: 'التفسير الميسر — مجمع الملك فهد لطباعة المصحف الشريف' },
  { id: 'ar.jalalayn', nameAr: 'تفسير الجلالين — المحلي والسيوطي' },
];

export const QuranPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    settings,
    updateSettings,
    quranBookmarks,
    saveQuranBookmark,
  } = useApp();
  const { playReciterSurah, playTrack } = useAudio();
  const { openShare } = useShare();

  const initialSurahNum = Number(searchParams.get('surah')) || 1;
  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number>(
    initialSurahNum >= 1 && initialSurahNum <= 114 ? initialSurahNum : 1
  );
  const [surahQuery, setSurahQuery] = useState<string>('');
  const [ayahQuery, setAyahQuery] = useState<string>('');
  const [revelationFilter, setRevelationFilter] = useState<'all' | 'Meccan' | 'Medinan'>('all');
  const [ayahs, setAyahs] = useState<AyahItem[]>([]);
  const [loadingSurah, setLoadingSurah] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedAyahForTafsir, setSelectedAyahForTafsir] = useState<number | null>(1);
  const [mushafViewMode, setMushafViewMode] = useState<'connected' | 'cards'>('connected');
  const [mushafNightPaper, setMushafNightPaper] = useState<boolean>(settings.theme === 'dark');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [selectedReciterId, setSelectedReciterId] = useState<string>(settings.defaultReciterId);

  const currentSurahMeta = useMemo(
    () => SURAHS_META.find((s) => s.number === selectedSurahNumber) || SURAHS_META[0],
    [selectedSurahNumber]
  );

  const currentReciter = useMemo(
    () => RECITERS_DATA.find((r) => r.id === selectedReciterId) || RECITERS_DATA[0],
    [selectedReciterId]
  );

  // Fetch Uthmani Text + Authentic Tafsir from AlQuran Cloud API
  useEffect(() => {
    let cancelled = false;

    const loadSurahData = async () => {
      setLoadingSurah(true);
      setFetchError(null);

      const cacheKey = `madar_surah_v1_${selectedSurahNumber}_${settings.defaultTafsirId}`;
      try {
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          const parsed: AyahItem[] = JSON.parse(cached);
          if (!cancelled && parsed.length > 0) {
            setAyahs(parsed);
            setSelectedAyahForTafsir(1);
            setLoadingSurah(false);
            return;
          }
        }
      } catch {
        // ignore cache error
      }

      try {
        const response = await fetch(
          `https://api.alquran.cloud/v1/surah/${selectedSurahNumber}/editions/quran-uthmani,${settings.defaultTafsirId}`
        );
        if (!response.ok) throw new Error('Network error');
        const json = await response.json();
        const editions = json?.data;

        if (Array.isArray(editions) && editions.length >= 2) {
          const uthmaniAyahs = editions[0].ayahs || [];
          const tafsirAyahs = editions[1].ayahs || [];

          const combined: AyahItem[] = uthmaniAyahs.map((a: any, idx: number) => ({
            number: a.number,
            numberInSurah: a.numberInSurah,
            text: a.text,
            juz: a.juz,
            page: a.page,
            hizbQuarter: a.hizbQuarter,
            tafsir: tafsirAyahs[idx]?.text || '',
          }));

          if (!cancelled) {
            setAyahs(combined);
            setSelectedAyahForTafsir(1);
            setLoadingSurah(false);
            try {
              sessionStorage.setItem(cacheKey, JSON.stringify(combined));
            } catch {
              // ignore quota
            }
          }
          return;
        }
        throw new Error('Invalid response');
      } catch {
        if (!cancelled) {
          const fallback = FALLBACK_SURAHS_CONTENT[selectedSurahNumber];
          if (fallback) {
            setAyahs(fallback);
            setSelectedAyahForTafsir(1);
          } else {
            setAyahs([]);
            setFetchError(
              'تعذر الاتصال بخادم المصحف الشريف حالياً. يرجى التحقق من اتصال الإنترنت لتحميل آيات هذه السورة الكريمة.'
            );
          }
          setLoadingSurah(false);
        }
      }
    };

    loadSurahData();
    return () => {
      cancelled = true;
    };
  }, [selectedSurahNumber, settings.defaultTafsirId]);

  const handleSelectSurah = (num: number) => {
    setSelectedSurahNumber(num);
    setSearchParams({ surah: String(num) });
  };

  const filteredSurahs = useMemo(() => {
    return SURAHS_META.filter((s) => {
      const matchesRev = revelationFilter === 'all' || s.revelationType === revelationFilter;
      const q = surahQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        s.name.includes(q) ||
        s.englishName.toLowerCase().includes(q) ||
        String(s.number) === q;
      return matchesRev && matchesQuery;
    });
  }, [surahQuery, revelationFilter]);

  const filteredAyahs = useMemo(() => {
    const q = ayahQuery.trim();
    if (!q) return ayahs;
    return ayahs.filter(
      (a) =>
        a.text.includes(q) ||
        (a.tafsir && a.tafsir.includes(q)) ||
        String(a.numberInSurah) === q
    );
  }, [ayahs, ayahQuery]);

  const handlePlaySingleAyah = (ayah: AyahItem) => {
    const edition = currentReciter.ayahEdition || 'ar.alafasy';
    playTrack({
      id: `ayah-${selectedSurahNumber}-${ayah.numberInSurah}`,
      title: `سورة ${currentSurahMeta.name} — الآية ${ayah.numberInSurah}`,
      subtitle: currentReciter.riwayah,
      reciterName: currentReciter.nameAr,
      reciterId: currentReciter.id,
      surahNumber: selectedSurahNumber,
      url: `https://cdn.islamic.network/quran/audio/128/${edition}/${ayah.number}.mp3`,
    });
  };

  const handleShareAyah = (ayah: AyahItem) => {
    openShare({
      type: 'quran',
      title: `سورة ${currentSurahMeta.name} — الآية ${ayah.numberInSurah}`,
      text: ayah.text,
      surahName: currentSurahMeta.name,
      surahNumber: selectedSurahNumber,
      ayahNumber: ayah.numberInSurah,
      explanation: ayah.tafsir ? `التفسير: ${ayah.tafsir}` : undefined,
      categoryLabel: `سورة ${currentSurahMeta.name} (${ayah.numberInSurah})`,
      canonicalUrl: `${SITE_CONFIG.productionUrl}/quran?surah=${selectedSurahNumber}&ayah=${ayah.numberInSurah}`,
      source: `المصحف الشريف — سورة ${currentSurahMeta.name}: الآية ${ayah.numberInSurah}`,
    });
  };

  const handleBookmarkAyah = (ayahNumber: number) => {
    saveQuranBookmark({
      surahNumber: selectedSurahNumber,
      ayahNumber,
      surahName: currentSurahMeta.name,
      timestamp: new Date().toLocaleDateString('ar-SA'),
    });
  };

  const activeTafsirAyah =
    ayahs.find((a) => a.numberInSurah === selectedAyahForTafsir) || ayahs[0];

  const surahTypeAr = currentSurahMeta.revelationType === 'Meccan' ? 'مكية' : 'مدنية';

  return (
    <PageWrapper
      title={`سورة ${currentSurahMeta.name} مكتوبة بالرسم العثماني (${currentSurahMeta.englishName}) | المصحف الشريف`}
      description={`قراءة سورة ${currentSurahMeta.name} بالرسم العثماني المعتمد (${surahTypeAr}، ${currentSurahMeta.numberOfAyahs} آية، الجزء ${currentSurahMeta.juz}) مع التلاوة المرتلة والتفسير الميسر.`}
      canonicalPath={`/quran?surah=${currentSurahMeta.number}`}
      breadcrumbs={[
        { name: 'الرئيسية', url: '/' },
        { name: 'المصحف الشريف', url: '/quran' },
        { name: `سورة ${currentSurahMeta.name}`, url: `/quran?surah=${currentSurahMeta.number}` },
      ]}
      schemaType="CollectionPage"
    >
      <div className="space-y-6">
        {/* Top Mushaf Control Header */}
        <section className="rounded-3xl royal-gradient text-white p-6 sm:p-8 border border-gold/35 shadow-xl relative overflow-hidden">
          <div className="islamic-pattern absolute inset-0 opacity-30 pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-bold">
                <BookOpen className="w-4 h-4" />
                <span>المصحف الشريف بالرسم العثماني المعتمد</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black">
                القرآن الكريم والمصحف الرقمي
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 max-w-2xl">
                تلاوة وتدبر سور القرآن الكريم الـ 114 بالرسم العثماني، مع التفسير الموثوق والاستماع لكبار القراء وحفظ علامات الوقف.
              </p>
            </div>

            {/* Bookmarks Quick Jump */}
            {quranBookmarks.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-black/30 border border-gold/35 flex items-center gap-3">
                <BookmarkCheck className="w-5 h-5 text-gold shrink-0" />
                <div className="text-xs min-w-0">
                  <span className="text-slate-300 block">آخر موضع قراءة محفوظ:</span>
                  <button
                    type="button"
                    onClick={() => {
                      handleSelectSurah(quranBookmarks[0].surahNumber);
                      setSelectedAyahForTafsir(quranBookmarks[0].ayahNumber);
                    }}
                    className="font-extrabold text-gold hover:underline truncate block"
                  >
                    سورة {quranBookmarks[0].surahName} • الآية {quranBookmarks[0].ayahNumber}
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Reader Toolbar: Reciter, Tafsir Source, Font Size, View Mode, Mushaf Night Paper */}
        <section className="glass-panel rounded-3xl p-4 sm:p-5 border border-gold/25 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-center">
          {/* Reciter Select (3 cols) */}
          <div className="lg:col-span-3 space-y-1">
            <label htmlFor="mushaf-reciter" className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
              القارئ والرواية
            </label>
            <select
              id="mushaf-reciter"
              value={selectedReciterId}
              onChange={(e) => {
                setSelectedReciterId(e.target.value);
                updateSettings({ defaultReciterId: e.target.value });
              }}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0B131E] border border-gold/30 text-xs font-bold text-royal dark:text-white"
            >
              {RECITERS_DATA.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.nameAr} ({r.riwayah})
                </option>
              ))}
            </select>
          </div>

          {/* Tafsir Select (4 cols) */}
          <div className="lg:col-span-4 space-y-1">
            <label htmlFor="mushaf-tafsir" className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
              مصدر التفسير المعتمد
            </label>
            <select
              id="mushaf-tafsir"
              value={settings.defaultTafsirId}
              onChange={(e) => updateSettings({ defaultTafsirId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0B131E] border border-gold/30 text-xs font-bold text-royal dark:text-white"
            >
              {TAFSIR_EDITIONS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nameAr}
                </option>
              ))}
            </select>
          </div>

          {/* Font Size & Display Mode Controls (5 cols) */}
          <div className="lg:col-span-5 flex flex-wrap items-center justify-between sm:justify-end gap-2 pt-2 lg:pt-4">
            {/* Font Size */}
            <div className="flex items-center gap-1 bg-royal/5 dark:bg-white/5 px-2.5 py-1.5 rounded-xl border border-gold/20">
              <button
                type="button"
                onClick={() =>
                  updateSettings({ quranFontSize: Math.max(20, settings.quranFontSize - 2) })
                }
                title="تصغير خط المصحف"
                className="p-1.5 rounded-lg hover:bg-gold/20 text-royal dark:text-gold"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold px-2 text-royal dark:text-white">
                {settings.quranFontSize}px
              </span>
              <button
                type="button"
                onClick={() =>
                  updateSettings({ quranFontSize: Math.min(44, settings.quranFontSize + 2) })
                }
                title="تكبير خط المصحف"
                className="p-1.5 rounded-lg hover:bg-gold/20 text-royal dark:text-gold"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* Connected Mushaf vs Verse Cards */}
            <div className="flex items-center bg-royal/5 dark:bg-white/5 p-1 rounded-xl border border-gold/20 text-xs font-bold">
              <button
                type="button"
                onClick={() => setMushafViewMode('connected')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                  mushafViewMode === 'connected'
                    ? 'royal-gradient text-gold shadow-sm'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                مصحف متصل
              </button>
              <button
                type="button"
                onClick={() => setMushafViewMode('cards')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                  mushafViewMode === 'cards'
                    ? 'royal-gradient text-gold shadow-sm'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                آية وتفسير
              </button>
            </div>

            {/* Mushaf Night Paper Toggle */}
            <button
              type="button"
              onClick={() => setMushafNightPaper(!mushafNightPaper)}
              title="الوضع الليلي للمصحف"
              className="px-3 py-2 rounded-xl bg-royal/5 dark:bg-white/5 border border-gold/25 text-xs font-bold text-royal dark:text-gold inline-flex items-center gap-1.5"
            >
              {mushafNightPaper ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span>{mushafNightPaper ? 'ورق نهاري' : 'ورق ليلي'}</span>
            </button>
          </div>
        </section>

        {/* Main Mushaf Layout: Sidebar Index of 114 Surahs (4 cols) + Mushaf Reading Canvas (8 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* 4 cols: 114 Surahs Index & Filter */}
          <aside className="lg:col-span-4 glass-panel rounded-3xl p-4 sm:p-5 border border-gold/25 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-extrabold text-base text-royal dark:text-white">
                فهرس سور القرآن (114 سورة)
              </h2>
              <span className="text-xs font-bold text-gold">{filteredSurahs.length} سورة</span>
            </div>

            {/* Search Surah Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-gold absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={surahQuery}
                onChange={(e) => setSurahQuery(e.target.value)}
                placeholder="ابحث باسم السورة أو رقمها..."
                className="w-full pr-10 pl-3 py-2.5 rounded-xl bg-white dark:bg-[#0B131E] border border-gold/30 text-xs font-bold text-royal dark:text-white focus:outline-none focus:border-gold"
              />
            </div>

            {/* Revelation Type Filter */}
            <div className="grid grid-cols-3 gap-1.5 text-xs font-bold bg-royal/5 dark:bg-white/5 p-1 rounded-xl">
              {[
                { id: 'all', label: 'الكل (114)' },
                { id: 'Meccan', label: 'مكية (86)' },
                { id: 'Medinan', label: 'مدنية (28)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setRevelationFilter(tab.id as any)}
                  className={`py-1.5 rounded-lg transition-colors ${
                    revelationFilter === tab.id
                      ? 'royal-gradient text-gold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-gold'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Scrollable List of 114 Surahs */}
            <div className="max-h-[460px] overflow-y-auto space-y-1.5 pr-0.5">
              {filteredSurahs.map((s) => {
                const isSelected = s.number === selectedSurahNumber;
                return (
                  <button
                    key={s.number}
                    type="button"
                    onClick={() => handleSelectSurah(s.number)}
                    className={`w-full text-right p-3 rounded-2xl border transition-all flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'royal-gradient text-white border-gold shadow-sm'
                        : 'bg-white/60 dark:bg-white/[0.02] border-gold/15 hover:border-gold/50 text-slate-800 dark:text-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-extrabold shrink-0 ${
                          isSelected
                            ? 'gold-gradient text-royal'
                            : 'bg-royal/10 dark:bg-white/10 text-gold'
                        }`}
                      >
                        {s.number}
                      </span>
                      <div className="min-w-0">
                        <p className="font-extrabold text-sm truncate">سورة {s.name}</p>
                        <p
                          className={`text-[11px] truncate ${
                            isSelected ? 'text-gold/90' : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {s.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} • {s.numberOfAyahs} آية • جزء {s.juz}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-lg shrink-0 ${
                        isSelected
                          ? 'bg-white/15 text-gold font-bold'
                          : 'bg-gold/10 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      ص {s.page}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* 8 cols: Mushaf Page & Verses Display */}
          <div className="lg:col-span-8 space-y-5 min-w-0">
            {/* Surah Header Banner & Full Surah Audio Play */}
            <div className="rounded-3xl royal-gradient text-white p-5 sm:p-6 border border-gold/40 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2 text-xs text-gold font-bold">
                  <span>السورة رقم {currentSurahMeta.number}</span>
                  <span>•</span>
                  <span>{currentSurahMeta.revelationType === 'Meccan' ? 'سورة مكية' : 'سورة مدنية'}</span>
                  <span>•</span>
                  <span>{currentSurahMeta.numberOfAyahs} آية</span>
                  <span>•</span>
                  <span>الجزء {currentSurahMeta.juz} (صفحة {currentSurahMeta.page})</span>
                </div>
                <h2 className="font-quran text-3xl sm:text-4xl text-white">
                  سُورَةُ {currentSurahMeta.name}
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => playReciterSurah(currentReciter, currentSurahMeta.number)}
                  className="px-4 py-2.5 rounded-2xl gold-gradient text-royal font-extrabold text-xs sm:text-sm shadow-gold-glow inline-flex items-center gap-2 hover:scale-[1.02] transition-transform"
                >
                  <Play className="w-4 h-4" />
                  <span>تشغيل السورة بصوت {currentReciter.nameAr}</span>
                </button>
              </div>
            </div>

            {/* Search inside current Surah Ayahs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gold absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  value={ayahQuery}
                  onChange={(e) => setAyahQuery(e.target.value)}
                  placeholder={`ابحث في آيات وتفسير سورة ${currentSurahMeta.name} أو اكتب رقم الآية...`}
                  className="w-full pr-10 pl-4 py-2.5 rounded-2xl glass-panel border border-gold/30 text-xs sm:text-sm font-bold text-royal dark:text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2">
                <button
                  type="button"
                  disabled={selectedSurahNumber <= 1}
                  onClick={() => handleSelectSurah(selectedSurahNumber - 1)}
                  className="px-3 py-2.5 rounded-xl glass-panel border border-gold/25 text-xs font-bold text-royal dark:text-gold disabled:opacity-40 inline-flex items-center gap-1"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>السورة السابقة</span>
                </button>
                <button
                  type="button"
                  disabled={selectedSurahNumber >= 114}
                  onClick={() => handleSelectSurah(selectedSurahNumber + 1)}
                  className="px-3 py-2.5 rounded-xl glass-panel border border-gold/25 text-xs font-bold text-royal dark:text-gold disabled:opacity-40 inline-flex items-center gap-1"
                >
                  <span>السورة التالية</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mushaf Paper Container */}
            <div
              className={`rounded-3xl p-5 sm:p-8 border-2 border-gold/40 shadow-xl transition-colors ${
                mushafNightPaper
                  ? 'bg-[#08121C] text-amber-50'
                  : 'bg-[#FFFDF7] text-[#072A20]'
              }`}
            >
              {/* Basmalah Header (except Surah At-Tawbah #9 and Al-Fatiha #1 where it's Ayah 1) */}
              {selectedSurahNumber !== 1 && selectedSurahNumber !== 9 && (
                <div className="text-center pb-6 mb-6 border-b border-gold/25">
                  <p className="font-quran text-2xl sm:text-3xl text-gold">
                    بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                  </p>
                </div>
              )}

              {loadingSurah ? (
                <div className="py-16 flex flex-col items-center justify-center gap-3 text-gold">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <p className="text-sm font-bold">
                    جاري تحميل آيات سورة {currentSurahMeta.name} بالرسم العثماني والتفسير...
                  </p>
                </div>
              ) : fetchError ? (
                <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-3">
                  <p className="text-sm font-bold text-amber-600 dark:text-amber-300">
                    {fetchError}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleSelectSurah(1)}
                    className="px-4 py-2 rounded-xl gold-gradient text-royal text-xs font-bold"
                  >
                    عرض سورة الفاتحة المحفوظة محلياً
                  </button>
                </div>
              ) : mushafViewMode === 'connected' ? (
                /* Connected Traditional Mushaf View */
                <div className="space-y-6">
                  <div
                    className="font-quran text-justify leading-[2.45] select-text"
                    style={{ fontSize: `${settings.quranFontSize}px` }}
                  >
                    {filteredAyahs.map((ayah) => {
                      const isSelected = selectedAyahForTafsir === ayah.numberInSurah;
                      const isBookmarked = quranBookmarks.some(
                        (b) =>
                          b.surahNumber === selectedSurahNumber &&
                          b.ayahNumber === ayah.numberInSurah
                      );

                      return (
                        <span
                          key={ayah.numberInSurah}
                          onClick={() => setSelectedAyahForTafsir(ayah.numberInSurah)}
                          className={`inline cursor-pointer rounded-xl px-1.5 py-0.5 transition-colors ${
                            isSelected
                              ? 'bg-gold/25 text-gold font-bold'
                              : 'hover:bg-gold/10'
                          }`}
                        >
                          <span>{ayah.text} </span>
                          <span
                            title={`الآية ${ayah.numberInSurah} — اضغط لعرض التفسير والاستماع`}
                            className={`inline-flex items-center justify-center mx-1 px-2 py-0.5 rounded-full text-sm font-sans font-extrabold border align-middle ${
                              isBookmarked
                                ? 'gold-gradient text-royal border-gold'
                                : 'bg-gold/15 text-gold border-gold/40'
                            }`}
                          >
                            {ayah.numberInSurah}
                          </span>{' '}
                        </span>
                      );
                    })}
                  </div>

                  {/* Interactive Tafsir & Audio Panel for Selected Ayah */}
                  {activeTafsirAyah && (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTafsirAyah.numberInSurah}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-5 rounded-2xl bg-gold/10 border border-gold/35 space-y-3 font-sans"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-gold" />
                            <span className="text-xs sm:text-sm font-extrabold text-gold">
                              سورة {currentSurahMeta.name} • الآية {activeTafsirAyah.numberInSurah} (الجزء {activeTafsirAyah.juz} • صفحة {activeTafsirAyah.page})
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handlePlaySingleAyah(activeTafsirAyah)}
                              className="px-3 py-1.5 rounded-xl royal-gradient text-gold text-xs font-bold inline-flex items-center gap-1.5"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>استماع للآية</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleBookmarkAyah(activeTafsirAyah.numberInSurah)}
                              className="px-3 py-1.5 rounded-xl bg-gold/20 hover:bg-gold/30 text-gold text-xs font-bold inline-flex items-center gap-1.5"
                            >
                              <Bookmark className="w-3.5 h-3.5" />
                              <span>حفظ الموضع</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleShareAyah(activeTafsirAyah)}
                              className="px-3 py-1.5 rounded-xl bg-gold/20 hover:bg-gold/30 text-gold text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                              title="مشاركة الآية وتصدير بطاقة مذهبة"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                              <span>مشاركة الآية</span>
                            </button>
                          </div>
                        </div>

                        <p className="text-sm leading-relaxed opacity-95">
                          <strong className="text-gold">التفسير: </strong>
                          {activeTafsirAyah.tafsir || 'اضغط على أي آية لعرض تفسيرها المعتمد.'}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>
              ) : (
                /* Verse-by-Verse Cards with Full Tafsir & Actions */
                <div className="space-y-4 font-sans">
                  {filteredAyahs.map((ayah) => (
                    <div
                      key={ayah.numberInSurah}
                      className="p-4 sm:p-5 rounded-2xl border border-gold/25 bg-gold/[0.04] space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gold/15 pb-2.5">
                        <span className="px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-extrabold">
                          الآية {ayah.numberInSurah} • الجزء {ayah.juz} • صفحة {ayah.page}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handlePlaySingleAyah(ayah)}
                            className="p-2 rounded-xl bg-gold/15 hover:bg-gold/25 text-gold"
                            title="استماع للآية"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleBookmarkAyah(ayah.numberInSurah)}
                            className="p-2 rounded-xl bg-gold/15 hover:bg-gold/25 text-gold"
                            title="حفظ موضع القراءة"
                          >
                            <Bookmark className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleShareAyah(ayah)}
                            className="p-2 rounded-xl bg-gold/15 hover:bg-gold/25 text-gold"
                            title="مشاركة الآية"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <p
                        className="font-quran leading-[2.3] py-2"
                        style={{ fontSize: `${settings.quranFontSize}px` }}
                      >
                        {ayah.text}
                      </p>

                      {ayah.tafsir && (
                        <div className="p-3.5 rounded-xl bg-black/10 dark:bg-white/5 border border-gold/20 text-xs sm:text-sm leading-relaxed">
                          <strong className="text-gold">التفسير المعتمد: </strong>
                          {ayah.tafsir}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

