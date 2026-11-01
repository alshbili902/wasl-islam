import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
} from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { ADHKAR_CATEGORIES, ADHKAR_DATA } from '../data/adhkarData';
import { AdhkarCategoryId } from '../types';
import { useApp } from '../context/AppContext';

export const AdhkarPage: React.FC = () => {
  const { settings } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<AdhkarCategoryId>('morning');

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

  useEffect(() => {
    try {
      localStorage.setItem('madar_adhkar_progress_v1', JSON.stringify(remainingMap));
    } catch {
      // ignore
    }
  }, [remainingMap]);

  const categoryItems = useMemo(
    () => ADHKAR_DATA.filter((d) => d.category === selectedCategory),
    [selectedCategory]
  );

  useEffect(() => {
    setFocusedIndex(0);
  }, [selectedCategory]);

  const completedInCategory = useMemo(
    () => categoryItems.filter((item) => (remainingMap[item.id] ?? item.count) === 0).length,
    [categoryItems, remainingMap]
  );

  const categoryProgressPercent =
    categoryItems.length > 0
      ? Math.round((completedInCategory / categoryItems.length) * 100)
      : 0;

  const handleDecrementDhikr = (id: string, defaultCount: number, idxInCategory?: number) => {
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

    // If this dhikr just completed and user is in focused mode or wants smooth advance
    if (nextVal === 0 && typeof idxInCategory === 'number' && idxInCategory < categoryItems.length - 1) {
      setTimeout(() => {
        setFocusedIndex(idxInCategory + 1);
      }, 380);
    }
  };

  const handleResetCategory = () => {
    const updates: Record<string, number> = {};
    for (const item of categoryItems) {
      updates[item.id] = item.count;
    }
    setRemainingMap((prev) => ({ ...prev, ...updates }));
    setFocusedIndex(0);
  };

  const getCategoryIcon = (id: AdhkarCategoryId) => {
    switch (id) {
      case 'morning':
        return Sun;
      case 'evening':
        return Moon;
      case 'sleep':
        return BedDouble;
      case 'wakeup':
        return Sunrise;
      case 'prayer':
        return Sparkles;
      default:
        return HeartHandshake;
    }
  };

  const activeCategoryMeta =
    ADHKAR_CATEGORIES.find((c) => c.id === selectedCategory) || ADHKAR_CATEGORIES[0];

  const focusedDhikr = categoryItems[focusedIndex] || categoryItems[0];

  return (
    <PageWrapper
      title={`واحة الأذكار — ${activeCategoryMeta.title}`}
      description="أذكار الصباح والمساء والنوم والاستيقاظ وبعد الصلاة من كتاب حصن المسلم بألفاظها الصحيحة وتخريجها مع عداد تفاعلي."
    >
      <div className="space-y-8">
        {/* Hero Header */}
        <section className="rounded-3xl royal-gradient text-white p-6 sm:p-8 border border-gold/35 shadow-xl relative overflow-hidden">
          <div className="islamic-pattern absolute inset-0 opacity-30 pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>نصوص موثقة من الكتاب والسنة الصحيحة (حصن المسلم)</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black">
                واحة الأذكار والتحصين اليومي
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 max-w-2xl">
                أذكار الصباح والمساء والنوم والاستيقاظ ودبر الصلوات المفروضة، مضبوطة بالشكل مع بيان المصدر ودرجة الصحة والعداد التفاعلي.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleResetCategory}
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-gold/35 text-xs font-extrabold text-gold inline-flex items-center gap-2 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>تصفير عداد {activeCategoryMeta.title}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Six Categories Navigation Grid */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {ADHKAR_CATEGORIES.map((cat) => {
            const Icon = getCategoryIcon(cat.id);
            const isSelected = cat.id === selectedCategory;
            const items = ADHKAR_DATA.filter((d) => d.category === cat.id);
            const doneCount = items.filter((i) => (remainingMap[i.id] ?? i.count) === 0).length;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between gap-3 ${
                  isSelected
                    ? 'royal-gradient text-white border-gold shadow-gold-glow'
                    : 'glass-panel border-gold/20 hover:border-gold text-royal dark:text-white'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isSelected ? 'gold-gradient text-royal' : 'bg-gold/15 text-gold'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-extrabold ${
                      doneCount === items.length
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : isSelected
                        ? 'bg-white/15 text-gold'
                        : 'bg-royal/5 dark:bg-white/5 text-slate-500'
                    }`}
                  >
                    {doneCount}/{items.length}
                  </span>
                </div>

                <div>
                  <h2 className="font-extrabold text-sm">{cat.title}</h2>
                  <p
                    className={`text-[11px] mt-0.5 line-clamp-1 ${
                      isSelected ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {cat.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </section>

        {/* Category Progress Bar */}
        <section className="glass-panel rounded-3xl p-5 border border-gold/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-extrabold text-royal dark:text-white">
              {activeCategoryMeta.title} — {activeCategoryMeta.subtitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              أنجزت {completedInCategory} من أصل {categoryItems.length} أذكار في هذا القسم ({categoryProgressPercent}%)
            </p>
          </div>
          <div className="w-full sm:w-64 h-3 rounded-full bg-royal/10 dark:bg-white/10 overflow-hidden">
            <div
              className="h-full gold-gradient rounded-full transition-all duration-500"
              style={{ width: `${categoryProgressPercent}%` }}
            />
          </div>
        </section>

        {/* Focused Interactive Dhikr Card (Sequential Stepper) */}
        {focusedDhikr && (
          <section className="glass-panel rounded-3xl p-6 sm:p-8 border-2 border-gold/40 shadow-xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gold/20 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full royal-gradient text-gold text-xs font-extrabold">
                  الذكر {focusedIndex + 1} من {categoryItems.length}
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-royal dark:text-white">
                  {focusedDhikr.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={focusedIndex <= 0}
                  onClick={() => setFocusedIndex((i) => Math.max(0, i - 1))}
                  className="px-3 py-1.5 rounded-xl bg-royal/5 dark:bg-white/5 hover:bg-gold/20 text-xs font-bold text-royal dark:text-gold disabled:opacity-40 inline-flex items-center gap-1"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>الذكر السابق</span>
                </button>
                <button
                  type="button"
                  disabled={focusedIndex >= categoryItems.length - 1}
                  onClick={() =>
                    setFocusedIndex((i) => Math.min(categoryItems.length - 1, i + 1))
                  }
                  className="px-3 py-1.5 rounded-xl bg-royal/5 dark:bg-white/5 hover:bg-gold/20 text-xs font-bold text-royal dark:text-gold disabled:opacity-40 inline-flex items-center gap-1"
                >
                  <span>الذكر التالي</span>
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
                <p className="font-quran text-2xl sm:text-3xl leading-[2.3] text-center text-royal dark:text-amber-50 p-5 rounded-2xl bg-royal/[0.03] dark:bg-white/[0.03] border border-gold/20">
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
                        className={`w-full sm:flex-1 py-4 px-6 rounded-2xl font-extrabold text-base transition-all flex items-center justify-center gap-3 shadow-lg ${
                          isDone
                            ? 'bg-emerald-600 text-white cursor-default'
                            : 'royal-gradient text-white hover:scale-[1.01] border border-gold/40'
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

                      {isDone && (
                        <button
                          type="button"
                          onClick={() =>
                            setRemainingMap((prev) => ({
                              ...prev,
                              [focusedDhikr.id]: focusedDhikr.count,
                            }))
                          }
                          className="px-4 py-4 rounded-2xl bg-royal/5 dark:bg-white/5 border border-gold/30 text-xs font-bold text-gold hover:bg-gold/15"
                        >
                          إعادة هذا الذكر
                        </button>
                      )}
                    </div>
                  );
                })()}
              </motion.div>
            </AnimatePresence>
          </section>
        )}

        {/* Full List of All Adhkar in Selected Category */}
        <section className="space-y-4">
          <h3 className="text-lg font-extrabold text-royal dark:text-white">
            جميع أذكار {activeCategoryMeta.title} ({categoryItems.length}):
          </h3>

          <div className="grid grid-cols-1 gap-4">
            {categoryItems.map((item, idx) => {
              const rem = remainingMap[item.id] ?? item.count;
              const isDone = rem === 0;

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
                      <span className="w-7 h-7 rounded-xl royal-gradient text-gold text-xs font-black flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h4 className="font-extrabold text-base text-royal dark:text-white">
                        {item.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
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

                  <p className="font-quran text-xl sm:text-2xl leading-[2.2] text-royal dark:text-amber-50">
                    {item.text}
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gold/15">
                    <div className="text-xs space-y-0.5 text-slate-600 dark:text-slate-300">
                      <p>
                        <strong className="text-gold">التخريج: </strong>
                        {item.source} ({item.grade})
                      </p>
                      <p className="text-slate-500 dark:text-slate-400">{item.virtue}</p>
                    </div>

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
              );
            })}
          </div>
        </section>
      </div>
    </PageWrapper>
  );
};

