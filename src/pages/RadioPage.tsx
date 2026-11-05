import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Radio,
  Search,
  Play,
  Pause,
  Heart,
  SkipForward,
  SkipBack,
  Globe,
  Tv,
  Sparkles,
  Loader2,
  Filter,
  Volume2,
  History,
} from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import {
  ISLAMIC_RADIO_CATEGORIES,
  ISLAMIC_RADIO_STATIONS,
  IslamicRadioStation,
  RadioCategoryId,
} from '../data/channelsAndRadiosData';
import { AudioTrack } from '../types';
import { useAudio } from '../context/AudioContext';

export const RadioPage: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    isLoading,
    error,
    favoriteRadios,
    lastPlayedRadio,
    playTrack,
    togglePlay,
    nextTrack,
    prevTrack,
    toggleFavoriteRadio,
  } = useAudio();

  const [selectedCategory, setSelectedCategory] = useState<RadioCategoryId>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const allCountries = useMemo(() => {
    return Array.from(new Set(ISLAMIC_RADIO_STATIONS.map((s) => s.countryAr)));
  }, []);

  const allLanguages = useMemo(() => {
    return Array.from(new Set(ISLAMIC_RADIO_STATIONS.map((s) => s.languageAr)));
  }, []);

  const filteredStations = useMemo(() => {
    return ISLAMIC_RADIO_STATIONS.filter((st) => {
      if (selectedCategory !== 'all' && st.category !== selectedCategory) return false;
      if (selectedCountry !== 'all' && st.countryAr !== selectedCountry) return false;
      if (selectedLanguage !== 'all' && st.languageAr !== selectedLanguage) return false;
      if (onlyFavorites && !favoriteRadios.includes(st.id)) return false;

      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;
      return (
        st.nameAr.toLowerCase().includes(q) ||
        st.descriptionAr.toLowerCase().includes(q) ||
        st.categoryLabelAr.toLowerCase().includes(q) ||
        st.countryAr.toLowerCase().includes(q)
      );
    });
  }, [
    selectedCategory,
    selectedCountry,
    selectedLanguage,
    onlyFavorites,
    favoriteRadios,
    searchQuery,
  ]);

  const stationToAudioTrack = (st: IslamicRadioStation): AudioTrack => ({
    id: st.id,
    title: st.nameAr,
    subtitle: `${st.categoryLabelAr} • ${st.languageAr}`,
    reciterName: st.countryAr,
    url: st.streamUrl,
    backupUrl: st.backupStreamUrl,
    streamType: st.streamType,
    isLive: true,
  });

  const handlePlayStation = (station: IslamicRadioStation) => {
    if (currentTrack?.id === station.id) {
      togglePlay();
      return;
    }
    const queue = filteredStations.map(stationToAudioTrack);
    playTrack(stationToAudioTrack(station), queue);
  };

  return (
    <PageWrapper
      title="مكتبة الإذاعات الإسلامية العالمية"
      description="بث مباشر لإذاعة القرآن الكريم السعودية، إذاعة نداء الإسلام، إذاعات الحرمين الشريفين، التفسير، الحديث، الفقه، والسيرة النبوية."
      canonicalPath="/radio"
      schemaType="collection"
      breadcrumbs={[
        { label: 'الرئيسية', path: '/' },
        { label: 'الإذاعات الإسلامية', path: '/radio' }
      ]}
    >
      <div className="space-y-8">
        {/* 1. Architectural Hero Header (No Images) */}
        <section className="rounded-3xl royal-gradient text-white p-6 sm:p-8 border border-gold/35 shadow-xl relative overflow-hidden">
          <div className="islamic-pattern absolute inset-0 opacity-30 pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-bold">
                <Radio className="w-4 h-4 animate-pulse" />
                <span>المكتبة الإذاعية الإسلامية الشاملة • بث مباشر 24/7</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black">
                الإذاعات الإسلامية العالمية
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 max-w-2xl">
                استمع على مدار الساعة إلى إذاعة القرآن الكريم السعودية، إذاعة نداء الإسلام، إذاعات الحرمين الشريفين، والتفسير والحديث والفقه والسيرة بلغات متعددة مع استمرار الصوت أثناء تنقلك في التطبيق.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
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
                <span>إذاعاتي المفضلة ({favoriteRadios.length})</span>
              </button>

              <Link
                to="/channels"
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-gold/35 text-gold text-xs font-extrabold inline-flex items-center gap-2 transition-colors"
              >
                <Tv className="w-4 h-4" />
                <span>القنوات المرئية المباشرة</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 2. Now Playing / Last Played Radio Quick Control Bar */}
        {(currentTrack?.isLive || lastPlayedRadio) && (
          <section className="glass-panel rounded-3xl p-5 sm:p-6 border-2 border-gold/40 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-13 h-13 p-3.5 rounded-2xl royal-gradient border border-gold/45 flex items-center justify-center text-gold shrink-0 shadow-gold-glow">
                {isPlaying && currentTrack?.isLive ? (
                  <div className="flex items-end gap-0.5 h-5" aria-hidden="true">
                    {[0.5, 1, 0.65, 0.9, 0.55].map((h, i) => (
                      <motion.span
                        key={i}
                        animate={{ height: ['22%', `${h * 100}%`, '30%'] }}
                        transition={{ duration: 0.6 + i * 0.12, repeat: Infinity }}
                        className="w-1 bg-gold rounded-full block"
                      />
                    ))}
                  </div>
                ) : (
                  <History className="w-6 h-6" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-gold/15 text-gold font-extrabold border border-gold/30">
                    {currentTrack?.isLive
                      ? isLoading
                        ? 'جاري الاتصال بالبث...'
                        : isPlaying
                        ? 'يبث الآن مباشرة'
                        : 'متوقف مؤقتاً'
                      : 'آخر إذاعة تم تشغيلها'}
                  </span>
                  {error && (
                    <span className="text-[11px] text-rose-500 font-bold">{error}</span>
                  )}
                </div>
                <h2 className="text-base sm:text-xl font-black text-royal dark:text-white truncate mt-1">
                  {(currentTrack?.isLive ? currentTrack : lastPlayedRadio)?.title}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {(currentTrack?.isLive ? currentTrack : lastPlayedRadio)?.reciterName} •{' '}
                  {(currentTrack?.isLive ? currentTrack : lastPlayedRadio)?.subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
              <button
                type="button"
                onClick={prevTrack}
                title="الإذاعة السابقة"
                className="p-2.5 rounded-xl bg-royal/5 dark:bg-white/5 hover:bg-gold/20 border border-gold/25 text-royal dark:text-gold"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  if (currentTrack?.isLive) {
                    togglePlay();
                  } else if (lastPlayedRadio) {
                    playTrack(
                      lastPlayedRadio,
                      ISLAMIC_RADIO_STATIONS.map(stationToAudioTrack)
                    );
                  }
                }}
                className="px-5 py-2.5 rounded-2xl gold-gradient text-royal font-extrabold text-xs sm:text-sm inline-flex items-center gap-2 shadow-gold-glow"
              >
                {isLoading && currentTrack?.isLive ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جاري التحميل...</span>
                  </>
                ) : isPlaying && currentTrack?.isLive ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>إيقاف مؤقت</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>استئناف البث المباشر</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={nextTrack}
                title="الإذاعة التالية"
                className="p-2.5 rounded-xl bg-royal/5 dark:bg-white/5 hover:bg-gold/20 border border-gold/25 text-royal dark:text-gold"
              >
                <SkipBack className="w-4 h-4" />
              </button>
            </div>
          </section>
        )}

        {/* 3. Ten Required Categories Filter Pills */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
            <Sparkles className="w-4 h-4 text-gold" />
            <span>التصنيفات الإذاعية المتخصصة (10 تصنيفات):</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {ISLAMIC_RADIO_CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              const count =
                cat.id === 'all'
                  ? ISLAMIC_RADIO_STATIONS.length
                  : ISLAMIC_RADIO_STATIONS.filter((s) => s.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-2xl border text-xs font-extrabold transition-all inline-flex items-center gap-2 ${
                    active
                      ? 'royal-gradient text-white border-gold shadow-gold-glow'
                      : 'glass-panel border-gold/20 hover:border-gold text-royal dark:text-slate-200'
                  }`}
                >
                  <span>{cat.nameAr}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] ${
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

        {/* 4. Search & Filters Bar (By Name, Country, Language) */}
        <section className="glass-panel rounded-3xl p-4 sm:p-5 border border-gold/25 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-gold absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم الإذاعة (مثل: إذاعة القرآن الكريم السعودية، نداء الإسلام، التفسير...)"
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
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              aria-label="التصفية حسب اللغة"
              className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-[#0B131E] border border-gold/30 text-xs font-bold text-royal dark:text-white"
            >
              <option value="all">جميع اللغات ({allLanguages.length})</option>
              {allLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* 5. Radio Stations Glass Cards Grid (Zero Images) */}
        {filteredStations.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center space-y-3 border border-gold/25">
            <Filter className="w-10 h-10 text-gold mx-auto" />
            <h3 className="text-lg font-extrabold text-royal dark:text-white">
              لا توجد إذاعات مطابقة لخيارات البحث والتصفية الحالية
            </h3>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSelectedCountry('all');
                setSelectedLanguage('all');
                setOnlyFavorites(false);
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl gold-gradient text-royal text-xs font-extrabold"
            >
              إعادة ضبط الفلاتر وعرض جميع الإذاعات
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredStations.map((station, idx) => {
              const isCurrent = currentTrack?.id === station.id;
              const isActivelyPlaying = isCurrent && isPlaying;
              const isStationLoading = isCurrent && isLoading;
              const isFav = favoriteRadios.includes(station.id);

              return (
                <motion.article
                  key={station.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (idx % 6) * 0.04, duration: 0.3 }}
                  whileHover={{ y: -4 }}
                  className={`glass-panel rounded-3xl p-5 sm:p-6 border transition-all flex flex-col justify-between gap-5 ${
                    isActivelyPlaying
                      ? 'royal-gradient text-white border-gold shadow-gold-glow'
                      : 'border-gold/25 hover:border-gold'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Top Row: Icon + Category Badge + Favorite Button */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 ${
                            isActivelyPlaying
                              ? 'gold-gradient text-royal border-gold'
                              : 'royal-gradient text-gold border-gold/35'
                          }`}
                        >
                          {isActivelyPlaying ? (
                            <div className="flex items-end gap-0.5 h-4" aria-hidden="true">
                              {[0.5, 1, 0.6, 0.9].map((h, i) => (
                                <motion.span
                                  key={i}
                                  animate={{ height: ['25%', `${h * 100}%`, '30%'] }}
                                  transition={{ duration: 0.55 + i * 0.12, repeat: Infinity }}
                                  className="w-1 bg-royal rounded-full block"
                                />
                              ))}
                            </div>
                          ) : (
                            <Radio className="w-5 h-5" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <span
                            className={`text-[11px] font-extrabold block truncate ${
                              isActivelyPlaying ? 'text-gold' : 'text-gold'
                            }`}
                          >
                            {station.categoryLabelAr}
                          </span>
                          <div className="flex items-center gap-1.5 text-[11px]">
                            <Globe className="w-3 h-3 text-gold shrink-0" />
                            <span
                              className={`truncate ${
                                isActivelyPlaying
                                  ? 'text-slate-200'
                                  : 'text-slate-500 dark:text-slate-400'
                              }`}
                            >
                              {station.countryAr} • {station.languageAr}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleFavoriteRadio(station.id)}
                        aria-label={isFav ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
                        className={`p-2 rounded-xl border transition-colors shrink-0 ${
                          isFav
                            ? 'bg-rose-500/20 border-rose-400/40 text-rose-400'
                            : isActivelyPlaying
                            ? 'bg-white/10 border-white/20 text-slate-200 hover:text-rose-300'
                            : 'bg-royal/5 dark:bg-white/5 border-gold/20 text-slate-400 hover:text-rose-400'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Station Name & Concise Description Only */}
                    <div className="space-y-1.5">
                      <h2
                        className={`text-base sm:text-lg font-extrabold leading-snug ${
                          isActivelyPlaying ? 'text-white' : 'text-royal dark:text-white'
                        }`}
                      >
                        {station.nameAr}
                      </h2>
                      <p
                        className={`text-xs leading-relaxed ${
                          isActivelyPlaying
                            ? 'text-slate-200'
                            : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {station.descriptionAr}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Row: Live Status Indicator + Play/Pause Button */}
                  <div className="pt-3 border-t border-gold/20 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isActivelyPlaying
                            ? 'bg-emerald-400 animate-ping'
                            : isStationLoading
                            ? 'bg-gold animate-pulse'
                            : 'bg-emerald-500/70'
                        }`}
                      />
                      <span
                        className={
                          isActivelyPlaying
                            ? 'text-emerald-300'
                            : 'text-slate-500 dark:text-slate-400'
                        }
                      >
                        {isStationLoading
                          ? 'جاري الاتصال...'
                          : isActivelyPlaying
                          ? 'يبث الآن مباشرة'
                          : 'بث مباشر متاح'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handlePlayStation(station)}
                      className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs inline-flex items-center gap-2 transition-all ${
                        isActivelyPlaying
                          ? 'gold-gradient text-royal shadow-sm'
                          : 'royal-gradient text-white hover:opacity-95 border border-gold/30'
                      }`}
                    >
                      {isStationLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-gold" />
                          <span>تحميل...</span>
                        </>
                      ) : isActivelyPlaying ? (
                        <>
                          <Pause className="w-4 h-4" />
                          <span>إيقاف البث</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4 text-gold" />
                          <span>تشغيل الإذاعة</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

