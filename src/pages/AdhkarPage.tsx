import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Sun,
  Moon,
  BedDouble,
  Sunrise,
  HeartHandshake,
  CheckCircle2,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Search,
  Star,
  Share2,
  Copy,
  ExternalLink,
  Volume2,
  VolumeX,
  X,
  BookOpen,
  Home,
  Utensils,
  Compass,
  Building2,
  Info,
  Check,
  Palette
} from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { useShare } from '../context/ShareContext';
import { SITE_CONFIG } from '../config/siteConfig';
import {
  ADHKAR_CATEGORIES,
  ADHKAR_DATA,
  searchAdhkar,
  AdhkarCategoryMeta
} from '../data/adhkar';
import { AdhkarCategoryId, DhikrItem } from '../types';
import { useApp } from '../context/AppContext';

export const AdhkarPage: React.FC = () => {
  const { settings } = useApp();
  const { openShare } = useShare();

  // State
  const [selectedGroup, setSelectedGroup] = useState<'all' | 'daily' | 'worship' | 'life' | 'seasons'>('daily');
  const [selectedCategory, setSelectedCategory] = useState<AdhkarCategoryId | 'all'>('morning');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);
  const [modalDhikr, setModalDhikr] = useState<DhikrItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  // Favorites stored in localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('madar_adhkar_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Store remaining count per dhikr ID in localStorage
  const [remainingMap, setRemainingMap] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    for (const item of ADHKAR_DATA) {
      initial[item.id] = item.count;
    }
    try {
      const saved = localStorage.getItem('madar_adhkar_progress_v1');
      if (saved) {
        return { ...initial, ...JSON.parse(saved) };
      }
    } catch {
      // ignore
    }
    return initial;
  });

  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const synthRef = useRef<SpeechSynthesis | null>(
    typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null
  );

  // Persist progress
  useEffect(() => {
    try {
      localStorage.setItem('madar_adhkar_progress_v1', JSON.stringify(remainingMap));
    } catch {
      // ignore
    }
  }, [remainingMap]);

  // Persist favorites
  useEffect(() => {
    try {
      localStorage.setItem('madar_adhkar_favorites', JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites]);

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Categories filtered by sectionGroup
  const categoriesInGroup = useMemo(() => {
    if (selectedGroup === 'all') return ADHKAR_CATEGORIES;
    return ADHKAR_CATEGORIES.filter((c) => c.sectionGroup === selectedGroup);
  }, [selectedGroup]);

  // Active Category Meta
  const activeCategoryMeta = useMemo(() => {
    if (selectedCategory === 'all') {
      return {
        id: 'general' as AdhkarCategoryId,
        title: 'جميع الأذكار النبوية',
        titleEn: 'All Adhkar',
        subtitle: 'الموسوعة الكاملة للأذكار والتحصينات اليومية',
        icon: 'Sparkles',
        badge: 'الموسوعة الشاملة',
        sectionGroup: 'daily' as const
      };
    }
    return ADHKAR_CATEGORIES.find((c) => c.id === selectedCategory) || ADHKAR_CATEGORIES[0];
  }, [selectedCategory]);

  // Filtered Adhkar items
  const filteredItems = useMemo(() => {
    let list = ADHKAR_DATA;

    // Filter by category
    if (selectedCategory !== 'all') {
      list = list.filter((d) => d.category === selectedCategory);
    } else if (selectedGroup !== 'all') {
      const validCategoryIds = new Set(categoriesInGroup.map((c) => c.id));
      list = list.filter((d) => validCategoryIds.has(d.category));
    }

    // Filter by subcategory
    if (selectedSubCategory !== 'all') {
      list = list.filter((d) => d.subCategory === selectedSubCategory);
    }

    // Filter by favorites
    if (onlyFavorites) {
      list = list.filter((d) => favorites.includes(d.id));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      list = searchAdhkar(searchQuery, undefined, list);
    }

    return list;
  }, [selectedCategory, selectedGroup, categoriesInGroup, selectedSubCategory, onlyFavorites, favorites, searchQuery]);

  // Available subcategories in current view
  const availableSubCategories = useMemo(() => {
    let baseList = ADHKAR_DATA;
    if (selectedCategory !== 'all') {
      baseList = baseList.filter((d) => d.category === selectedCategory);
    }
    const subs = new Set<string>();
    for (const item of baseList) {
      if (item.subCategory) subs.add(item.subCategory);
    }
    return Array.from(subs);
  }, [selectedCategory]);

  // Reset focusedIndex on filter change
  useEffect(() => {
    setFocusedIndex(0);
    setSelectedSubCategory('all');
  }, [selectedCategory, selectedGroup, onlyFavorites]);

  // Completion calculation for current list
  const completedCount = useMemo(
    () => filteredItems.filter((item) => (remainingMap[item.id] ?? item.count) === 0).length,
    [filteredItems, remainingMap]
  );

  const progressPercent =
    filteredItems.length > 0 ? Math.round((completedCount / filteredItems.length) * 100) : 0;

  // Counter action
  const handleDecrementDhikr = (id: string, defaultCount: number, idxInList?: number) => {
    const current = remainingMap[id] ?? defaultCount;
    if (current <= 0) return;

    if (settings.hapticFeedback && typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(current === 1 ? [30, 40, 30] : 18);
    }

    const nextVal = current - 1;
    setRemainingMap((prev) => ({
      ...prev,
      [id]: nextVal,
    }));

    if (nextVal === 0 && typeof idxInList === 'number' && idxInList < filteredItems.length - 1) {
      setTimeout(() => {
        setFocusedIndex(idxInList + 1);
      }, 350);
    }
  };

  const handleResetCurrentSelection = () => {
    const updates: Record<string, number> = {};
    for (const item of filteredItems) {
      updates[item.id] = item.count;
    }
    setRemainingMap((prev) => ({ ...prev, ...updates }));
    setFocusedIndex(0);
  };

  const handleCopyText = (text: string, id: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleShareDhikr = (item: DhikrItem) => {
    openShare({
      type: 'dhikr',
      title: item.title || activeCategoryMeta.title,
      text: item.text,
      repetitionCount: item.count,
      virtue: item.virtue,
      grade: item.grade,
      explanation: item.explanation,
      source: item.source,
      canonicalUrl: `${SITE_CONFIG.productionUrl}/adhkar?category=${item.category}`,
      categoryLabel: activeCategoryMeta.title,
    });
  };

  const handleSpeak = (text: string, id: string) => {
    if (!synthRef.current) return;

    if (speakingId === id) {
      synthRef.current.cancel();
      setSpeakingId(null);
      return;
    }

    synthRef.current.cancel();
    const cleanText = text.replace(/[۝۞ۣۚۖۗۘۙۛۜ۟۠ۡۢۤۥۦ«»]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.9;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    synthRef.current.speak(utterance);
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun':
        return Sun;
      case 'Moon':
        return Moon;
      case 'BedDouble':
        return BedDouble;
      case 'Sunrise':
        return Sunrise;
      case 'Building2':
        return Building2;
      case 'BookOpen':
        return BookOpen;
      case 'Home':
        return Home;
      case 'Utensils':
        return Utensils;
      case 'Compass':
        return Compass;
      case 'HeartHandshake':
        return HeartHandshake;
      default:
        return Sparkles;
    }
  };

  const focusedDhikr = filteredItems[focusedIndex] || filteredItems[0];

  return (
    <PageWrapper
      title={`واحة الأذكار — ${activeCategoryMeta.title}`}
      description="الموسوعة الشاملة للأذكار والتحصينات النبوية الموثقة من الكتاب والسنة مع عداد تفاعلي، ومصادر الحديث وتخريجها، وتتبع الإنجاز اليومي."
    >
      <div className="space-y-8">
        {/* Hero Header */}
        <section className="rounded-3xl royal-gradient text-white p-6 sm:p-8 border border-gold/35 shadow-xl relative overflow-hidden">
          <div className="islamic-pattern absolute inset-0 opacity-30 pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>موسوعة الأذكار الموثقة — من صحيح البخاري ومسلم والسنن المعتمدة</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black">
                واحة الأذكار والأوراد النبوية
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
                حصن المسلم الشامل ومجامع التسبيح والاستغفار؛ نصوص مضبوطة بالشكل التام مع بيان المصدر والتخريج، الفضل والثواب، وعداد تفاعلي ذكي يحفظ تقدمك اليومي.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/tasbih"
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-gold/35 text-xs font-extrabold text-gold inline-flex items-center gap-2 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>المسبحة التفاعلية</span>
              </Link>
              <Link
                to="/duas"
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-gold/35 text-xs font-extrabold text-gold inline-flex items-center gap-2 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span>موسوعة الأدعية</span>
              </Link>
              <button
                type="button"
                onClick={handleResetCurrentSelection}
                className="px-4 py-2.5 rounded-2xl bg-gold/20 hover:bg-gold/30 border border-gold/50 text-xs font-extrabold text-amber-200 inline-flex items-center gap-2 transition-colors"
                title="تصفير العداد للقسم الحالي"
              >
                <RotateCcw className="w-4 h-4" />
                <span>تصفير عداد القسم</span>
              </button>
            </div>
          </div>
        </section>

        {/* Search & Favorites Controls Bar */}
        <section className="glass-panel rounded-3xl p-4 sm:p-5 border border-gold/25 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في نصوص الأذكار، التخريج، الفضائل، أو الآيات..."
                className="w-full pr-11 pl-10 py-3 rounded-2xl bg-royal/5 dark:bg-white/5 border border-gold/25 focus:border-gold outline-none text-xs sm:text-sm text-royal dark:text-white"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-royal dark:hover:text-gold"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Favorites Toggle */}
            <button
              type="button"
              onClick={() => setOnlyFavorites((prev) => !prev)}
              className={`px-4 py-3 rounded-2xl border text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 transition-all ${
                onlyFavorites
                  ? 'gold-gradient text-royal border-gold shadow-gold-glow'
                  : 'bg-royal/5 dark:bg-white/5 border-gold/25 text-royal dark:text-slate-200 hover:border-gold'
              }`}
            >
              <Star className={`w-4 h-4 ${onlyFavorites ? 'fill-royal' : 'text-gold'}`} />
              <span>أذكاري المفضلة ({favorites.length})</span>
            </button>
          </div>

          {/* Group Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
            <span className="text-slate-400 text-[11px] whitespace-nowrap pl-1">المجموعات:</span>
            {[
              { id: 'daily', title: 'الأوراد اليومية الكبرى' },
              { id: 'worship', title: 'الصلوات والمساجد' },
              { id: 'life', title: 'العادات والأحوال المعيشية' },
              { id: 'seasons', title: 'المواسم والمناسبات' },
              { id: 'all', title: 'كافة الأقسام (22 قسماً)' },
            ].map((group) => (
              <button
                key={group.id}
                type="button"
                onClick={() => {
                  setSelectedGroup(group.id as any);
                  if (group.id !== 'all') {
                    const firstInGroup = ADHKAR_CATEGORIES.find((c) => c.sectionGroup === group.id);
                    if (firstInGroup) setSelectedCategory(firstInGroup.id);
                  } else {
                    setSelectedCategory('all');
                  }
                }}
                className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                  selectedGroup === group.id
                    ? 'royal-gradient text-gold border border-gold/40 shadow-sm'
                    : 'bg-royal/5 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-gold'
                }`}
              >
                {group.title}
              </button>
            ))}
          </div>
        </section>

        {/* Categories Carousel / Grid */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-royal dark:text-white flex items-center gap-2">
              <span>أقسام الأذكار المتاحة:</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-gold/20 text-gold font-bold">
                {categoriesInGroup.length} تصنيف
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {categoriesInGroup.map((cat) => {
              const Icon = getCategoryIcon(cat.icon);
              const isSelected = selectedCategory === cat.id;
              const items = ADHKAR_DATA.filter((d) => d.category === cat.id);
              const doneCount = items.filter((i) => (remainingMap[i.id] ?? i.count) === 0).length;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setOnlyFavorites(false);
                  }}
                  className={`p-3.5 rounded-2xl border text-right transition-all flex flex-col justify-between gap-2.5 ${
                    isSelected
                      ? 'royal-gradient text-white border-gold shadow-gold-glow scale-[1.02]'
                      : 'glass-panel border-gold/20 hover:border-gold/60 text-royal dark:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'gold-gradient text-royal' : 'bg-gold/15 text-gold'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                        doneCount === items.length && items.length > 0
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : isSelected
                          ? 'bg-white/15 text-gold'
                          : 'bg-royal/5 dark:bg-white/5 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {doneCount}/{items.length}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-xs sm:text-sm line-clamp-1">{cat.title}</h3>
                    <p
                      className={`text-[10px] mt-0.5 line-clamp-1 ${
                        isSelected ? 'text-slate-200' : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {cat.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Subcategories Filter Chips */}
        {availableSubCategories.length > 1 && (
          <section className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-slate-400 text-[11px] whitespace-nowrap pl-1">المحاور:</span>
            <button
              type="button"
              onClick={() => setSelectedSubCategory('all')}
              className={`px-3 py-1 rounded-xl whitespace-nowrap font-bold transition-all ${
                selectedSubCategory === 'all'
                  ? 'bg-gold text-royal font-black'
                  : 'bg-royal/5 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-gold'
              }`}
            >
              الكل ({filteredItems.length})
            </button>
            {availableSubCategories.map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => setSelectedSubCategory(sub)}
                className={`px-3 py-1 rounded-xl whitespace-nowrap font-bold transition-all ${
                  selectedSubCategory === sub
                    ? 'bg-gold text-royal font-black'
                    : 'bg-royal/5 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-gold'
                }`}
              >
                {sub}
              </button>
            ))}
          </section>
        )}

        {/* Category Progress Bar */}
        <section className="glass-panel rounded-3xl p-5 border border-gold/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-gold/15 text-royal dark:text-gold text-[11px] font-extrabold border border-gold/30">
                {activeCategoryMeta.badge}
              </span>
              <h2 className="text-base sm:text-lg font-extrabold text-royal dark:text-white">
                {activeCategoryMeta.title}
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              أنجزت {completedCount} من أصل {filteredItems.length} أذكار في هذا العرض ({progressPercent}%)
            </p>
          </div>
          <div className="w-full sm:w-64 h-3 rounded-full bg-royal/10 dark:bg-white/10 overflow-hidden">
            <div
              className="h-full gold-gradient rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </section>

        {/* Focused Interactive Dhikr Card (Sequential Stepper) */}
        {focusedDhikr && (
          <section className="glass-panel rounded-3xl p-6 sm:p-8 border-2 border-gold/40 shadow-xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gold/20 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full royal-gradient text-gold text-xs font-extrabold">
                  الذكر {focusedIndex + 1} من {filteredItems.length}
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-royal dark:text-white">
                  {focusedDhikr.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => toggleFavorite(focusedDhikr.id, e)}
                  className="p-2 rounded-xl bg-royal/5 dark:bg-white/5 hover:bg-gold/20 text-gold transition-colors"
                  title="إضافة للمفضلة"
                >
                  <Star
                    className={`w-4 h-4 ${
                      favorites.includes(focusedDhikr.id) ? 'fill-gold text-gold' : 'text-slate-400'
                    }`}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => handleSpeak(focusedDhikr.text, focusedDhikr.id)}
                  className="p-2 rounded-xl bg-royal/5 dark:bg-white/5 hover:bg-gold/20 text-royal dark:text-gold transition-colors"
                  title="استماع صوتي"
                >
                  {speakingId === focusedDhikr.id ? (
                    <VolumeX className="w-4 h-4 text-amber-500 animate-pulse" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setModalDhikr(focusedDhikr)}
                  className="p-2 rounded-xl bg-royal/5 dark:bg-white/5 hover:bg-gold/20 text-royal dark:text-gold transition-colors"
                  title="عرض التخريج الكامل والشرح"
                >
                  <Info className="w-4 h-4" />
                </button>
                <div className="h-4 w-px bg-gold/30 mx-1" />
                <button
                  type="button"
                  disabled={focusedIndex <= 0}
                  onClick={() => setFocusedIndex((i) => Math.max(0, i - 1))}
                  className="px-3 py-1.5 rounded-xl bg-royal/5 dark:bg-white/5 hover:bg-gold/20 text-xs font-bold text-royal dark:text-gold disabled:opacity-40 inline-flex items-center gap-1"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>السابق</span>
                </button>
                <button
                  type="button"
                  disabled={focusedIndex >= filteredItems.length - 1}
                  onClick={() =>
                    setFocusedIndex((i) => Math.min(filteredItems.length - 1, i + 1))
                  }
                  className="px-3 py-1.5 rounded-xl bg-royal/5 dark:bg-white/5 hover:bg-gold/20 text-xs font-bold text-royal dark:text-gold disabled:opacity-40 inline-flex items-center gap-1"
                >
                  <span>التالي</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={focusedDhikr.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-5"
              >
                <p className="font-quran text-2xl sm:text-3xl leading-[2.3] text-center text-royal dark:text-amber-50 p-5 rounded-2xl bg-royal/[0.03] dark:bg-white/[0.03] border border-gold/20 select-text">
                  {focusedDhikr.text}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-gold/10 border border-gold/25 space-y-1">
                    <span className="font-extrabold text-royal dark:text-gold block">
                      الفضل والثواب:
                    </span>
                    <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                      {focusedDhikr.virtue}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-royal/5 dark:bg-white/5 border border-gold/20 space-y-1">
                    <span className="font-extrabold text-royal dark:text-gold block">
                      المصدر والتخريج ودرجة الصحة:
                    </span>
                    <p className="text-slate-700 dark:text-slate-200">{focusedDhikr.source}</p>
                    <p className="text-emerald-600 dark:text-emerald-400 font-bold">
                      الدرجة: {focusedDhikr.grade}
                    </p>
                  </div>
                </div>

                {/* Interactive Counter Button */}
                {(() => {
                  const rem = remainingMap[focusedDhikr.id] ?? focusedDhikr.count;
                  const isDone = rem === 0;
                  return (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleDecrementDhikr(focusedDhikr.id, focusedDhikr.count, focusedIndex)
                        }
                        className={`w-full sm:flex-1 py-4 px-6 rounded-2xl font-extrabold text-base transition-all flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] ${
                          isDone
                            ? 'bg-emerald-600 text-white cursor-default'
                            : 'royal-gradient text-white hover:scale-[1.01] border border-gold/40 cursor-pointer'
                        }`}
                      >
                        {isDone ? (
                          <>
                            <CheckCircle2 className="w-6 h-6 text-emerald-200" />
                            <span>اكتمل هذا الذكر بحمد الله ({focusedDhikr.count}/{focusedDhikr.count})</span>
                          </>
                        ) : (
                          <>
                            <span>اضغط للتسبيح والعد التنازلي</span>
                            <span className="px-4 py-1 rounded-xl gold-gradient text-royal font-black text-xl">
                              {rem}
                            </span>
                            <span className="text-xs text-gold/90">من أصل {focusedDhikr.count}</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        {isDone && (
                          <button
                            type="button"
                            onClick={() =>
                              setRemainingMap((prev) => ({
                                ...prev,
                                [focusedDhikr.id]: focusedDhikr.count,
                              }))
                            }
                            className="flex-1 sm:flex-initial px-4 py-4 rounded-2xl bg-royal/5 dark:bg-white/5 border border-gold/30 text-xs font-bold text-gold hover:bg-gold/15 transition-colors"
                          >
                            إعادة الذكر
                          </button>
                        )}
                        <Link
                          to={`/card-studio?text=${encodeURIComponent(focusedDhikr.text)}&source=${encodeURIComponent(focusedDhikr.title)}`}
                          className="flex-1 sm:flex-initial px-4 py-4 rounded-2xl bg-royal/5 dark:bg-white/5 border border-gold/30 text-xs font-bold text-royal dark:text-gold hover:bg-gold/15 inline-flex items-center justify-center gap-1.5 transition-colors"
                          title="تصميم بطاقة دعوية لهذا الذكر"
                        >
                          <Palette className="w-4 h-4" />
                          <span>تصميم بطاقة</span>
                        </Link>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            </AnimatePresence>
          </section>
        )}

        {/* Full List of All Adhkar in Selected View */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-extrabold text-royal dark:text-white flex items-center gap-2">
              <span>قائمة الأذكار المعروضة:</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-gold/20 text-gold font-bold">
                {filteredItems.length} ذكراً موثقاً
              </span>
            </h3>

            {filteredItems.length > 0 && (
              <button
                type="button"
                onClick={handleResetCurrentSelection}
                className="text-xs font-bold text-slate-500 hover:text-gold inline-flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة ضبط عدادات هذه القائمة</span>
              </button>
            )}
          </div>

          {filteredItems.length === 0 ? (
            <div className="glass-panel rounded-3xl p-12 text-center space-y-4 border border-gold/20">
              <Sparkles className="w-12 h-12 text-gold/40 mx-auto" />
              <h4 className="text-base font-extrabold text-royal dark:text-white">
                لم يتم العثور على أذكار مطابقة لبحثك
              </h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                جرب تغيير كلمات البحث، أو تصفية تصنيف مختلف، أو إلغاء تحديد المفضلة لإظهار كافة الأذكار.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('morning');
                  setSelectedSubCategory('all');
                  setOnlyFavorites(false);
                }}
                className="px-4 py-2 rounded-2xl gold-gradient text-royal font-black text-xs inline-flex items-center gap-2"
              >
                <span>العودة لأذكار الصباح</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredItems.map((item, idx) => {
                const rem = remainingMap[item.id] ?? item.count;
                const isDone = rem === 0;
                const isFav = favorites.includes(item.id);

                return (
                  <div
                    key={item.id}
                    className={`glass-panel rounded-3xl p-5 sm:p-6 border transition-all space-y-4 ${
                      isDone
                        ? 'border-emerald-500/40 bg-emerald-500/[0.04]'
                        : 'border-gold/25 hover:border-gold/60'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-xl royal-gradient text-gold text-xs font-black flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div>
                          <h4 className="font-extrabold text-base text-royal dark:text-white">
                            {item.title}
                          </h4>
                          {item.subCategory && (
                            <span className="text-[11px] text-slate-400 block mt-0.5">
                              {item.subCategory}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => toggleFavorite(item.id, e)}
                          className="p-1.5 rounded-lg hover:bg-gold/15 text-gold transition-colors"
                          title="حفظ في المفضلة"
                        >
                          <Star
                            className={`w-4 h-4 ${isFav ? 'fill-gold text-gold' : 'text-slate-400'}`}
                          />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSpeak(item.text, item.id)}
                          className="p-1.5 rounded-lg hover:bg-gold/15 text-royal dark:text-gold transition-colors"
                          title="قراءة صوتية"
                        >
                          {speakingId === item.id ? (
                            <VolumeX className="w-4 h-4 text-amber-500 animate-pulse" />
                          ) : (
                            <Volume2 className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopyText(item.text, item.id)}
                          className="p-1.5 rounded-lg hover:bg-gold/15 text-royal dark:text-gold transition-colors"
                          title="نسخ النص"
                        >
                          {copiedId === item.id ? (
                            <Check className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleShareDhikr(item)}
                          className="p-1.5 rounded-lg hover:bg-gold/15 text-royal dark:text-gold transition-colors"
                          title="مشاركة الذكر وتصدير بطاقة"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setModalDhikr(item)}
                          className="p-1.5 rounded-lg hover:bg-gold/15 text-royal dark:text-gold transition-colors"
                          title="عرض التخريج الكامل والشرح"
                        >
                          <Info className="w-4 h-4" />
                        </button>
                        <span className="text-xs px-3 py-1 rounded-full bg-gold/15 text-royal dark:text-gold font-bold border border-gold/25">
                          التكرار: {item.count} {item.count === 1 ? 'مرة' : 'مرات'}
                        </span>
                        {isDone && (
                          <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-extrabold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            مكتمل
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="font-quran text-xl sm:text-2xl leading-[2.2] text-royal dark:text-amber-50 select-text">
                      {item.text}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gold/15">
                      <div className="text-xs space-y-0.5 text-slate-600 dark:text-slate-300 max-w-2xl">
                        <p>
                          <strong className="text-gold">التخريج: </strong>
                          {item.source} ({item.grade})
                        </p>
                        <p className="text-slate-500 dark:text-slate-400 line-clamp-1">{item.virtue}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          to={`/card-studio?text=${encodeURIComponent(item.text)}&source=${encodeURIComponent(item.title)}`}
                          className="p-3 rounded-2xl bg-royal/5 dark:bg-white/5 border border-gold/25 text-royal dark:text-gold hover:bg-gold/15 transition-colors"
                          title="تصميم بطاقة دعوية"
                        >
                          <Palette className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDecrementDhikr(item.id, item.count)}
                          className={`px-5 py-3 rounded-2xl font-extrabold text-sm shrink-0 transition-transform active:scale-95 flex items-center justify-center gap-2 ${
                            isDone
                              ? 'bg-emerald-600 text-white'
                              : 'gold-gradient text-royal shadow-gold-glow'
                          }`}
                        >
                          {isDone ? (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              <span>تم الإنجاز (0)</span>
                            </>
                          ) : (
                            <>
                              <span>اضغط للعد</span>
                              <span className="px-2.5 py-0.5 rounded-lg bg-royal text-gold font-black">
                                {rem}
                              </span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Detailed Modal for Single Dhikr */}
        <AnimatePresence>
          {modalDhikr && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-panel w-full max-w-2xl rounded-3xl p-6 sm:p-8 border-2 border-gold/50 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between border-b border-gold/20 pb-4">
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-gold/15 text-royal dark:text-gold text-[11px] font-bold">
                      {modalDhikr.subCategory || 'تخريج وشرح الذكر'}
                    </span>
                    <h3 className="text-lg font-black text-royal dark:text-white">
                      {modalDhikr.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setModalDhikr(null)}
                    className="p-2 rounded-xl bg-royal/5 dark:bg-white/5 hover:bg-gold/20 text-slate-400 hover:text-royal dark:hover:text-gold transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-royal/[0.04] dark:bg-white/[0.04] border border-gold/25 text-center">
                  <p className="font-quran text-2xl leading-[2.3] text-royal dark:text-amber-100 select-text">
                    {modalDhikr.text}
                  </p>
                </div>

                {modalDhikr.transliteration && (
                  <div className="p-3.5 rounded-2xl bg-royal/5 dark:bg-white/5 border border-gold/20 space-y-1">
                    <span className="text-[11px] font-bold text-gold uppercase tracking-wider block">
                      Transliteration / النطق الصوتي بالحروف اللاتينية:
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-mono italic">
                      {modalDhikr.transliteration}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-gold/10 border border-gold/25 space-y-1.5">
                    <span className="font-extrabold text-royal dark:text-gold block">
                      الفضل والثواب النبوي:
                    </span>
                    <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                      {modalDhikr.virtue}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-royal/5 dark:bg-white/5 border border-gold/20 space-y-1.5">
                    <span className="font-extrabold text-royal dark:text-gold block">
                      التخريج ودرجة الحديث:
                    </span>
                    <p className="text-slate-700 dark:text-slate-200">{modalDhikr.source}</p>
                    <p className="text-emerald-600 dark:text-emerald-400 font-bold">
                      الحكم: {modalDhikr.grade}
                    </p>
                    {modalDhikr.scholarGrading && (
                      <p className="text-[11px] text-slate-500">
                        تحقيق العلماء: {modalDhikr.scholarGrading}
                      </p>
                    )}
                  </div>
                </div>

                {modalDhikr.explanation && (
                  <div className="p-4 rounded-2xl bg-royal/5 dark:bg-white/5 border border-gold/20 space-y-1">
                    <span className="font-extrabold text-royal dark:text-gold text-xs block">
                      الشرح والمعنى الإيماني:
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {modalDhikr.explanation}
                    </p>
                  </div>
                )}

                {modalDhikr.timing && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-800 dark:text-amber-200">
                    <strong>وقت الذكر المستحب: </strong>
                    {modalDhikr.timing}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gold/20">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyText(modalDhikr.text, modalDhikr.id)}
                      className="px-3.5 py-2 rounded-xl bg-royal/5 dark:bg-white/5 hover:bg-gold/20 text-xs font-bold text-royal dark:text-gold inline-flex items-center gap-1.5"
                    >
                      <Copy className="w-4 h-4" />
                      <span>{copiedId === modalDhikr.id ? 'تم النسخ' : 'نسخ الذكر'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(modalDhikr.id, e)}
                      className="px-3.5 py-2 rounded-xl bg-royal/5 dark:bg-white/5 hover:bg-gold/20 text-xs font-bold text-royal dark:text-gold inline-flex items-center gap-1.5"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          favorites.includes(modalDhikr.id) ? 'fill-gold text-gold' : ''
                        }`}
                      />
                      <span>
                        {favorites.includes(modalDhikr.id) ? 'في المفضلة' : 'إضافة للمفضلة'}
                      </span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleShareDhikr(modalDhikr)}
                      className="px-4 py-2 rounded-xl gold-gradient text-royal font-black text-xs inline-flex items-center gap-1.5 shadow-md shadow-gold/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>مشاركة وتصدير</span>
                    </button>
                    <Link
                      to={`/card-studio?text=${encodeURIComponent(modalDhikr.text)}&source=${encodeURIComponent(modalDhikr.title)}`}
                      className="px-3.5 py-2 rounded-xl bg-royal/10 dark:bg-white/10 hover:bg-gold/20 text-royal dark:text-gold font-bold text-xs inline-flex items-center gap-1.5"
                    >
                      <Palette className="w-4 h-4" />
                      <span>استوديو البطاقات</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => setModalDhikr(null)}
                      className="px-4 py-2 rounded-xl bg-royal/10 dark:bg-white/10 hover:bg-royal/20 text-xs font-bold text-royal dark:text-white"
                    >
                      إغلاق
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
};
