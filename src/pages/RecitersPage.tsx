import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic2,
  Globe,
  Search,
  Heart,
  Play,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Filter,
  Volume2,
  X,
} from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { RECITERS_DATA, CONTINENTS_LIST } from '../data/recitersData';
import { SURAHS_META } from '../data/surahsMeta';
import { Reciter } from '../types';
import { useApp } from '../context/AppContext';
import { useAudio } from '../context/AudioContext';

export const RecitersPage: React.FC = () => {
  const { favoriteReciters, toggleFavoriteReciter } = useApp();
  const { playReciterSurah, currentTrack, isPlaying } = useAudio();

  const [selectedContinent, setSelectedContinent] = useState<string>('all');
  const [selectedRiwayah, setSelectedRiwayah] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeReciterModal, setActiveReciterModal] = useState<Reciter | null>(null);
  const [modalSurahSearch, setModalSurahSearch] = useState<string>('');

  const allCountries = useMemo(() => {
    const set = new Set(RECITERS_DATA.map((r) => r.countryAr));
    return Array.from(set);
  }, []);

  const allRiwayat = useMemo(() => {
    const set = new Set(RECITERS_DATA.map((r) => r.riwayah));
    return Array.from(set);
  }, []);

  const filteredReciters = useMemo(() => {
    return RECITERS_DATA.filter((r) => {
      if (selectedContinent !== 'all' && r.continent !== selectedContinent) return false;
      if (selectedRiwayah !== 'all' && r.riwayah !== selectedRiwayah) return false;
      if (selectedCountry !== 'all' && r.countryAr !== selectedCountry) return false;
      if (onlyFavorites && !favoriteReciters.includes(r.id)) return false;

      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;
      return (
        r.nameAr.includes(q) ||
        r.nameEn.toLowerCase().includes(q) ||
        r.countryAr.includes(q) ||
        r.riwayah.includes(q) ||
        r.style.includes(q)
      );
    });
  }, [selectedContinent, selectedRiwayah, selectedCountry, onlyFavorites, favoriteReciters, searchQuery]);

  const modalFilteredSurahs = useMemo(() => {
    const q = modalSurahSearch.trim().toLowerCase();
    if (!q) return SURAHS_META;
    return SURAHS_META.filter(
      (s) =>
        s.name.includes(q) ||
        s.englishName.toLowerCase().includes(q) ||
        String(s.number) === q
    );
  }, [modalSurahSearch]);

  return (
    <PageWrapper
      title="أطلس قراء العالم"
      description="موسوعة قراء القرآن الكريم عبر القارات الست مع التصفية حسب القارة والدولة والرواية والتشغيل المتتابع للسور."
      canonicalPath="/reciters"
      schemaType="collection"
      breadcrumbs={[
        { label: 'الرئيسية', path: '/' },
        { label: 'أطلس القراء', path: '/reciters' }
      ]}
    >
      <div className="space-y-8">
        {/* Hero Header */}
        <section className="rounded-3xl royal-gradient text-white p-6 sm:p-8 border border-gold/35 shadow-xl relative overflow-hidden">
          <div className="islamic-pattern absolute inset-0 opacity-30 pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-bold">
                <Globe className="w-4 h-4" />
                <span>أطلس القراء العالمي عبر القارات الست</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black">
                أطلس قراء العالم الإسلامي
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 max-w-2xl">
                استمع إلى المصاحف المرتلة الكاملة لكبار قراء العالم عبر القارات الست (آسيا، أفريقيا، أوروبا، أمريكا الشمالية، أمريكا الجنوبية، وأستراليا) مع دعم التشغيل التلقائي المتتابع.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setOnlyFavorites(!onlyFavorites)}
                className={`px-4 py-2.5 rounded-2xl border text-xs font-extrabold inline-flex items-center gap-2 transition-all ${
                  onlyFavorites
                    ? 'gold-gradient text-royal border-gold shadow-gold-glow'
                    : 'bg-white/10 text-white border-gold/35 hover:bg-white/20'
                }`}
              >
                <Heart className={`w-4 h-4 ${onlyFavorites ? 'fill-current' : 'text-gold'}`} />
                <span>المفضلة ({favoriteReciters.length})</span>
              </button>
            </div>
          </div>
        </section>

        {/* Six Continents Tabs */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
            <Globe className="w-4 h-4 text-gold" />
            <span>تصنيف القراء حسب القارات الست:</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {CONTINENTS_LIST.map((cont) => {
              const active = selectedContinent === cont.id;
              const count =
                cont.id === 'all'
                  ? RECITERS_DATA.length
                  : RECITERS_DATA.filter((r) => r.continent === cont.id).length;

              return (
                <button
                  key={cont.id}
                  type="button"
                  onClick={() => setSelectedContinent(cont.id)}
                  className={`p-3 rounded-2xl border text-right transition-all flex items-center justify-between gap-2 ${
                    active
                      ? 'royal-gradient text-white border-gold shadow-gold-glow'
                      : 'glass-panel border-gold/20 hover:border-gold text-royal dark:text-slate-200'
                  }`}
                >
                  <span className="text-xs font-extrabold truncate">{cont.nameAr}</span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-bold shrink-0 ${
                      active ? 'bg-gold text-royal' : 'bg-gold/15 text-gold'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Search & Advanced Filters (Country & Riwayah) */}
        <section className="glass-panel rounded-3xl p-4 sm:p-5 border border-gold/25 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-gold absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم القارئ، الدولة، الرواية، أو أسلوب التلاوة..."
              className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-white dark:bg-[#0B131E] border border-gold/30 text-xs sm:text-sm font-bold text-royal dark:text-white focus:outline-none focus:border-gold"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              aria-label="التصفية حسب الدولة"
              className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-[#0B131E] border border-gold/30 text-xs font-bold text-royal dark:text-white"
            >
              <option value="all">جميع الدول ({allCountries.length})</option>
              {allCountries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedRiwayah}
              onChange={(e) => setSelectedRiwayah(e.target.value)}
              aria-label="التصفية حسب الرواية"
              className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-[#0B131E] border border-gold/30 text-xs font-bold text-royal dark:text-white"
            >
              <option value="all">جميع الروايات</option>
              {allRiwayat.map((rw) => (
                <option key={rw} value={rw}>
                  رواية {rw}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Reciters Cards Grid */}
        {filteredReciters.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center space-y-3 border border-gold/25">
            <Filter className="w-10 h-10 text-gold mx-auto" />
            <h3 className="text-lg font-extrabold text-royal dark:text-white">
              لا توجد نتائج مطابقة لمعايير التصفية الحالية
            </h3>
            <button
              type="button"
              onClick={() => {
                setSelectedContinent('all');
                setSelectedCountry('all');
                setSelectedRiwayah('all');
                setOnlyFavorites(false);
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl gold-gradient text-royal text-xs font-extrabold"
            >
              إعادة ضبط الفلاتر
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredReciters.map((reciter) => {
              const isFav = favoriteReciters.includes(reciter.id);
              const isCurrentlyPlayingReciter =
                currentTrack?.reciterId === reciter.id && isPlaying;

              return (
                <motion.article
                  key={reciter.id}
                  whileHover={{ y: -4 }}
                  className={`glass-panel rounded-3xl p-5 sm:p-6 border transition-all flex flex-col justify-between gap-5 ${
                    isCurrentlyPlayingReciter
                      ? 'border-gold shadow-gold-glow'
                      : 'border-gold/25 hover:border-gold/60'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Top Row: Avatar Badge + Name + Favorite Button */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-2xl royal-gradient border border-gold/40 flex items-center justify-center text-gold font-black text-base shrink-0">
                          {reciter.countryCode}
                        </div>
                        <div className="min-w-0">
                          <h2 className="font-extrabold text-base sm:text-lg text-royal dark:text-white truncate">
                            {reciter.nameAr}
                          </h2>
                          <p className="text-xs text-gold font-bold truncate">
                            {reciter.countryAr} • {reciter.riwayah}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleFavoriteReciter(reciter.id)}
                        aria-label={isFav ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
                        className={`p-2 rounded-xl border transition-colors shrink-0 ${
                          isFav
                            ? 'bg-rose-500/15 border-rose-400/40 text-rose-500'
                            : 'bg-royal/5 dark:bg-white/5 border-gold/20 text-slate-400 hover:text-rose-400'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Style & Bio */}
                    <div className="space-y-2">
                      <span className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-0.5 rounded-full bg-gold/15 text-royal dark:text-gold font-bold border border-gold/25">
                        <Sparkles className="w-3 h-3" />
                        <span>{reciter.style}</span>
                      </span>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {reciter.bio}
                      </p>
                    </div>

                    {/* Quick Featured Surahs */}
                    <div className="space-y-2 pt-2 border-t border-gold/15">
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                        تشغيل سريع للسور المختارة (تتابع تلقائي):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {reciter.featuredSurahs.map((surahNum) => {
                          const surah = SURAHS_META[surahNum - 1];
                          const isThisSurahPlaying =
                            currentTrack?.reciterId === reciter.id &&
                            currentTrack?.surahNumber === surahNum &&
                            isPlaying;

                          return (
                            <button
                              key={surahNum}
                              type="button"
                              onClick={() => playReciterSurah(reciter, surahNum)}
                              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1 ${
                                isThisSurahPlaying
                                  ? 'gold-gradient text-royal shadow-sm'
                                  : 'bg-royal/5 dark:bg-white/5 hover:bg-gold/20 text-royal dark:text-slate-200 border border-gold/20'
                              }`}
                            >
                              <Play className="w-3 h-3 text-gold" />
                              <span>{surah.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Buttons */}
                  <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-gold/15">
                    <button
                      type="button"
                      onClick={() => playReciterSurah(reciter, 1)}
                      className="py-2.5 px-3 rounded-xl royal-gradient text-white text-xs font-extrabold inline-flex items-center justify-center gap-1.5 hover:opacity-95"
                    >
                      <Volume2 className="w-4 h-4 text-gold" />
                      <span>تشغيل الختمة المرتلة</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveReciterModal(reciter);
                        setModalSurahSearch('');
                      }}
                      className="py-2.5 px-3 rounded-xl bg-gold/15 hover:bg-gold/25 border border-gold/35 text-royal dark:text-gold text-xs font-extrabold inline-flex items-center justify-center gap-1.5"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>جميع السور (114)</span>
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}

        {/* Modal for All 114 Surahs of Selected Reciter */}
        <AnimatePresence>
          {activeReciterModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveReciterModal(null)}
                className="fixed inset-0 bg-black/65 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="relative z-10 w-full max-w-4xl max-h-[85vh] rounded-3xl bg-[#F8FAF9] dark:bg-[#0B131E] border border-gold/40 shadow-2xl flex flex-col overflow-hidden"
              >
                <div className="p-5 sm:p-6 royal-gradient text-white flex items-center justify-between gap-4 border-b border-gold/30">
                  <div className="min-w-0">
                    <span className="text-xs text-gold font-bold block">
                      المصحف المرتل الكامل (114 سورة) • {activeReciterModal.riwayah}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black truncate">
                      القارئ {activeReciterModal.nameAr}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveReciterModal(null)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-4 border-b border-gold/20 bg-royal/5 dark:bg-white/[0.02]">
                  <div className="relative">
                    <Search className="w-4 h-4 text-gold absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="search"
                      value={modalSurahSearch}
                      onChange={(e) => setModalSurahSearch(e.target.value)}
                      placeholder="ابحث عن السورة لتشغيلها بصوت القارئ..."
                      className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-white dark:bg-[#0B131E] border border-gold/30 text-xs sm:text-sm font-bold text-royal dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {modalFilteredSurahs.map((surah) => {
                    const isActive =
                      currentTrack?.reciterId === activeReciterModal.id &&
                      currentTrack?.surahNumber === surah.number;

                    return (
                      <button
                        key={surah.number}
                        type="button"
                        onClick={() => playReciterSurah(activeReciterModal, surah.number)}
                        className={`p-3 rounded-2xl border text-right transition-all flex items-center justify-between gap-2 ${
                          isActive
                            ? 'royal-gradient text-white border-gold shadow-sm'
                            : 'glass-panel border-gold/20 hover:border-gold text-royal dark:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-7 h-7 rounded-lg bg-gold/20 text-gold text-xs font-extrabold flex items-center justify-center shrink-0">
                            {surah.number}
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-extrabold truncate">
                              سورة {surah.name}
                            </p>
                            <p
                              className={`text-[10px] truncate ${
                                isActive ? 'text-gold' : 'text-slate-400'
                              }`}
                            >
                              {surah.numberOfAyahs} آية • جزء {surah.juz}
                            </p>
                          </div>
                        </div>
                        <Play className="w-4 h-4 text-gold shrink-0" />
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
};

