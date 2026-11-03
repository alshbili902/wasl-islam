import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Crown,
  BookOpen,
  ShieldCheck,
  CheckCircle2,
  Clock,
  RotateCcw,
  ExternalLink,
  BookMarked,
  Scroll,
} from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import {
  PROPHETS_DATA,
  PROPHETS_STATS,
  ProphetCategoryId,
  getProphetById,
  filterProphets,
  OFFICIAL_SCHOLARLY_RESOURCES,
} from '../../src/data/prophetsData';
import { ProphetCard } from '../components/prophets/ProphetCard';
import { ProphetFilters, ReadStatusFilter } from '../components/prophets/ProphetFilters';
import { ProphetReader } from '../components/prophets/ProphetReader';

const STORAGE_KEYS = {
  READ_PROPHETS: 'madar_read_prophets_v1',
  BOOKMARKED_PROPHETS: 'madar_bookmarked_prophets_v1',
  LAST_VIEWED: 'madar_last_viewed_prophet_v1',
};

export const ProphetsPage: React.FC = () => {
  const { prophetId } = useParams<{ prophetId?: string }>();
  const navigate = useNavigate();

  // State
  const [selectedCategory, setSelectedCategory] = useState<ProphetCategoryId>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [readStatus, setReadStatus] = useState<ReadStatusFilter>('all');

  // Local storage state
  const [readProphets, setReadProphets] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.READ_PROPHETS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [bookmarkedProphets, setBookmarkedProphets] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BOOKMARKED_PROPHETS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Save to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.READ_PROPHETS, JSON.stringify(readProphets));
    } catch {
      // Ignore storage errors
    }
  }, [readProphets]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKMARKED_PROPHETS, JSON.stringify(bookmarkedProphets));
    } catch {
      // Ignore storage errors
    }
  }, [bookmarkedProphets]);

  // Track active prophet
  const activeProphet = useMemo(() => {
    if (!prophetId) return null;
    return getProphetById(prophetId) || null;
  }, [prophetId]);

  // Update last viewed
  useEffect(() => {
    if (activeProphet) {
      try {
        localStorage.setItem(STORAGE_KEYS.LAST_VIEWED, activeProphet.id);
      } catch {
        // Ignore
      }
    }
  }, [activeProphet]);

  // Handlers
  const handleSelectProphet = (id: string) => {
    navigate(`/prophets/${id}`);
  };

  const handleBackToList = () => {
    navigate('/prophets');
  };

  const handleToggleRead = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setReadProphets((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleToggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarkedProphets((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // Filtered list
  const filteredProphets = useMemo(() => {
    let list = filterProphets(selectedCategory, searchQuery);

    if (readStatus === 'read') {
      list = list.filter((p) => readProphets.includes(p.id));
    } else if (readStatus === 'unread') {
      list = list.filter((p) => !readProphets.includes(p.id));
    } else if (readStatus === 'bookmarked') {
      list = list.filter((p) => bookmarkedProphets.includes(p.id));
    }

    return list;
  }, [selectedCategory, searchQuery, readStatus, readProphets, bookmarkedProphets]);

  // Calculate reading progress %
  const readPercentage = Math.round((readProphets.length / PROPHETS_STATS.totalCount) * 100);

  return (
    <PageWrapper
      title={activeProphet ? activeProphet.name : 'قصص الأنبياء عليهم السلام'}
      description="موسوعة قصص الأنبياء والمرسلين الخمسة والعشرين في القرآن الكريم، موثقة بالكامل من مجمع الملك فهد لطباعة المصحف الشريف، التفسير الميسر، والصحيحين."
    >
      <div className="space-y-8">
        {activeProphet ? (
          // ================= SINGLE PROPHET READER VIEW =================
          <ProphetReader
            prophet={activeProphet}
            isRead={readProphets.includes(activeProphet.id)}
            isBookmarked={bookmarkedProphets.includes(activeProphet.id)}
            onBack={handleBackToList}
            onSelectProphet={handleSelectProphet}
            onToggleRead={() => handleToggleRead(activeProphet.id)}
            onToggleBookmark={() => handleToggleBookmark(activeProphet.id)}
          />
        ) : (
          // ================= ALL PROPHETS LIST / CATALOG VIEW =================
          <>
            {/* Majestic Hero Banner */}
            <section className="relative rounded-3xl royal-gradient text-white p-6 sm:p-10 lg:p-12 overflow-hidden border border-gold/30 shadow-2xl">
              <div className="islamic-pattern absolute inset-0 opacity-25 pointer-events-none" />
              <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-gold/15 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-4xl space-y-5 text-right">
                {/* Quranic Verse Accent */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-gold/30 text-xs font-semibold text-gold">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>﴿نَحْنُ نَقُصُّ عَلَيْكَ أَحْسَنَ الْقَصَصِ بِمَا أَوْحَيْنَا إِلَيْكَ هَٰذَا الْقُرْآنَ﴾</span>
                  <span className="text-white/60">[يوسف: 3]</span>
                </div>

                {/* Section Title */}
                <div className="space-y-2">
                  <h1 className="text-3xl sm:text-5xl font-black font-quran leading-tight">
                    قصص الأنبياء <span className="gold-text-gradient">عليهم الصلاة والسلام</span>
                  </h1>
                  <p className="text-sm sm:text-base text-slate-200/90 leading-relaxed max-w-3xl">
                    موسوعة إسلامية شاملة وموثقة لقصص الأنبياء والمرسلين الخمسة والعشرين المذكورين صراحةً في كتاب الله تعالى؛ محررة وفق منهج أهل السنة والجماعة، ومستندة حصرياً إلى نصوص القرآن الكريم، وبيانات التفسير الميسر الصادرة عن مجمع الملك فهد، وصحيحي البخاري ومسلم، مع خلو تام من الإسرائيليات والروايات غير الثابتة.
                  </p>
                </div>

                {/* Key Statistics Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-gold/20 text-center">
                    <span className="text-2xl sm:text-3xl font-black text-gold block font-quran">
                      {PROPHETS_STATS.totalCount}
                    </span>
                    <span className="text-xs text-slate-300">نبياً ورسولاً بالقرآن</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/5 border border-gold/20 text-center">
                    <span className="text-2xl sm:text-3xl font-black text-gold block font-quran">
                      {PROPHETS_STATS.uluAlAzmCount}
                    </span>
                    <span className="text-xs text-slate-300">أولو العزم من الرسل</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/5 border border-gold/20 text-center">
                    <span className="text-2xl sm:text-3xl font-black text-gold block font-quran">
                      {PROPHETS_STATS.totalChapters}+
                    </span>
                    <span className="text-xs text-slate-300">محطة تاريخية موثقة</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/5 border border-gold/20 text-center">
                    <span className="text-2xl sm:text-3xl font-black text-gold block font-quran">
                      {PROPHETS_STATS.totalLessons}+
                    </span>
                    <span className="text-xs text-slate-300">درساً وعبرة مستفادة</span>
                  </div>
                </div>

                {/* Reading Tracker Bar */}
                <div className="p-4 rounded-2xl bg-black/25 border border-gold/25 space-y-2 mt-4">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-200 flex items-center gap-1.5">
                      <BookMarked className="w-4 h-4 text-gold shrink-0" />
                      <span>تقدم القراءة الشخصي: قرأت {readProphets.length} من {PROPHETS_STATS.totalCount} قصة</span>
                    </span>
                    <span className="text-gold">{readPercentage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full gold-gradient transition-all duration-500 rounded-full"
                      style={{ width: `${readPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Official Scholarly Guarantee Banner */}
            <section className="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="space-y-0.5 text-xs sm:text-sm">
                  <strong className="font-bold block">توثيق شرعي معتمد من المصادر الرسمية</strong>
                  <p className="text-emerald-800 dark:text-emerald-300">
                    جميع التفاسير مستقاة من مجمع الملك فهد لطباعة المصحف الشريف، والأحاديث مخرجة ومحققة من الصحيحين وخدمة السنة برئاسة الإفتاء بالمملكة العربية السعودية.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 self-end md:self-auto shrink-0">
                {OFFICIAL_SCHOLARLY_RESOURCES.slice(0, 2).map((res) => (
                  <a
                    key={res.name}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#111D2C] border border-emerald-500/30 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-gold transition-colors inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <span>{res.name}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-gold" />
                  </a>
                ))}
              </div>
            </section>

            {/* Filters & Search Component */}
            <ProphetFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              readStatus={readStatus}
              onReadStatusChange={setReadStatus}
              totalFilteredCount={filteredProphets.length}
              totalCount={PROPHETS_STATS.totalCount}
            />

            {/* Grid of Prophets */}
            {filteredProphets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {filteredProphets.map((prophet) => (
                  <ProphetCard
                    key={prophet.id}
                    prophet={prophet}
                    isRead={readProphets.includes(prophet.id)}
                    isBookmarked={bookmarkedProphets.includes(prophet.id)}
                    onSelect={handleSelectProphet}
                    onToggleRead={handleToggleRead}
                    onToggleBookmark={handleToggleBookmark}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center rounded-3xl bg-royal/5 dark:bg-white/[0.02] border border-gold/20 space-y-4">
                <Scroll className="w-12 h-12 text-gold/60 mx-auto" />
                <h3 className="text-lg font-bold text-royal dark:text-gold">
                  لم يتم العثور على قصص مطابقة لخيارات البحث الحالية
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  تأكد من كتابة الاسم بشكل صحيح أو قم بإعادة ضبط الفلاتر لعرض كافة الأنبياء الخمسة والعشرين.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setReadStatus('all');
                  }}
                  className="px-4 py-2 rounded-xl gold-gradient text-royal font-bold text-xs inline-flex items-center gap-1.5 shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>إعادة ضبط البحث والفلاتر</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </PageWrapper>
  );
};

