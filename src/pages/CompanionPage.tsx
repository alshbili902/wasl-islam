import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Clock,
  BookOpen,
  Sparkles,
  HeartHandshake,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Sun,
  Moon,
  MoonStar,
  Users,
  Award,
  ScrollText,
  BarChart3,
  Flame,
  ShieldCheck,
  Edit3,
  RotateCcw,
  Info
} from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { useApp } from '../context/AppContext';
import { computePrayerTimesForDate, ComputedPrayerState } from '../utils/prayerUtils';
import {
  DEFAULT_COMPANION_ACTIVITIES,
  ENCOURAGING_WISDOM
} from '../data/companionData';
import {
  CompanionState,
  DailyActivity,
  ActivityCategory
} from '../types/companion';
import {
  loadCompanionState,
  saveCompanionState,
  toggleActivityCompletion,
  updateDayReflection,
  updateQuranProgress,
  addCustomActivity,
  removeCustomActivity,
  getTodayDateString,
  formatArabicDate,
  getWeeklyStats
} from '../utils/companionStorage';

export const CompanionPage: React.FC = () => {
  const { settings } = useApp();

  // Storage State
  const [companionState, setCompanionState] = useState<CompanionState>(loadCompanionState);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [showAddCustomModal, setShowAddCustomModal] = useState<boolean>(false);
  const [newActivityTitle, setNewActivityTitle] = useState<string>('');
  const [newActivityDesc, setNewActivityDesc] = useState<string>('');
  const [newActivityCat, setNewActivityCat] = useState<ActivityCategory>('custom');
  const [reflectionInput, setReflectionInput] = useState<string>('');
  const [reflectionSavedAlert, setReflectionSavedAlert] = useState<boolean>(false);

  // Prayer Info
  const [prayerState, setPrayerState] = useState<ComputedPrayerState>(() =>
    computePrayerTimesForDate(
      settings.selectedCity.latitude,
      settings.selectedCity.longitude,
      settings.calculationMethod,
      settings.madhab,
      new Date()
    )
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setPrayerState(
        computePrayerTimesForDate(
          settings.selectedCity.latitude,
          settings.selectedCity.longitude,
          settings.calculationMethod,
          settings.madhab,
          new Date()
        )
      );
    }, 1000);
    return () => clearInterval(timer);
  }, [settings.selectedCity, settings.calculationMethod, settings.madhab]);

  // Load reflection input when selectedDate changes
  useEffect(() => {
    const record = companionState.history[selectedDate];
    setReflectionInput(record?.reflectionNote || '');
  }, [selectedDate, companionState]);

  // Combine default & custom activities
  const allActivities: DailyActivity[] = useMemo(() => {
    return [...DEFAULT_COMPANION_ACTIVITIES, ...companionState.customActivities];
  }, [companionState.customActivities]);

  // Filtered activities
  const filteredActivities = useMemo(() => {
    if (activeCategoryFilter === 'all') return allActivities;
    if (activeCategoryFilter === 'fard') return allActivities.filter((a) => a.isObligatory);
    if (activeCategoryFilter === 'sunnah') return allActivities.filter((a) => !a.isObligatory);
    return allActivities.filter((a) => a.category === activeCategoryFilter);
  }, [allActivities, activeCategoryFilter]);

  // Current day's record
  const currentDayRecord = companionState.history[selectedDate] || {
    date: selectedDate,
    activities: {},
    quranPagesRead: 0,
    memorizationMinutes: 0
  };

  // Completion metrics for selected date
  const metrics = useMemo(() => {
    let completedCount = 0;
    let obligatoryCompleted = 0;
    let obligatoryTotal = 0;
    let voluntaryCompleted = 0;
    let voluntaryTotal = 0;

    allActivities.forEach((act) => {
      const isDone = Boolean(currentDayRecord.activities[act.id]?.completed);
      if (isDone) completedCount++;

      if (act.isObligatory) {
        obligatoryTotal++;
        if (isDone) obligatoryCompleted++;
      } else {
        voluntaryTotal++;
        if (isDone) voluntaryCompleted++;
      }
    });

    const total = allActivities.length || 1;
    const percentage = Math.round((completedCount / total) * 100);

    return {
      total,
      completedCount,
      percentage,
      obligatoryCompleted,
      obligatoryTotal,
      voluntaryCompleted,
      voluntaryTotal
    };
  }, [allActivities, currentDayRecord]);

  // Weekly stats
  const weeklyStats = useMemo(() => {
    return getWeeklyStats(companionState, allActivities);
  }, [companionState, allActivities]);

  // Handlers
  const handleToggleActivity = (actId: string) => {
    const updated = toggleActivityCompletion(companionState, actId, selectedDate);
    setCompanionState(updated);
  };

  const handleSaveReflection = () => {
    const updated = updateDayReflection(companionState, selectedDate, reflectionInput);
    setCompanionState(updated);
    setReflectionSavedAlert(true);
    setTimeout(() => setReflectionSavedAlert(false), 2500);
  };

  const handleQuickAddQuranPages = (pagesToAdd: number) => {
    const current = currentDayRecord.quranPagesRead || 0;
    const updated = updateQuranProgress(companionState, selectedDate, current + pagesToAdd);
    setCompanionState(updated);
  };

  const handleCreateCustomActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivityTitle.trim()) return;

    const updated = addCustomActivity(companionState, {
      title: newActivityTitle.trim(),
      description: newActivityDesc.trim() || 'نشاط إيماني خاص',
      category: newActivityCat,
      isObligatory: false,
      period: 'anytime',
      iconName: 'Sparkles'
    });

    setCompanionState(updated);
    setNewActivityTitle('');
    setNewActivityDesc('');
    setShowAddCustomModal(false);
  };

  const handleDeleteCustomActivity = (actId: string) => {
    const updated = removeCustomActivity(companionState, actId);
    setCompanionState(updated);
  };

  // Date Navigation
  const isToday = selectedDate === getTodayDateString();

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(getTodayDateString(d));
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(getTodayDateString(d));
  };

  const handleJumpToToday = () => {
    setSelectedDate(getTodayDateString());
  };

  const randomWisdom = ENCOURAGING_WISDOM[0];

  return (
    <PageWrapper
      title="رفيق المسلم اليومي"
      description="لوحة متابعة إيمانية شخصية لتنظيم العبادات اليومية، الورد القرآني، الأذكار النبوية، والسنن الرواتب."
    >
      <div className="space-y-8">
        {/* 1. Header Banner */}
        <section className="relative rounded-3xl p-6 sm:p-10 overflow-hidden bg-gradient-to-br from-[#072A20] via-[#093528] to-[#041a14] border border-gold/30 shadow-2xl text-white">
          <div className="islamic-pattern absolute inset-0 opacity-15 pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 text-gold border border-gold/30 text-xs font-bold">
                <Sparkles className="w-4 h-4" />
                <span>رفيقك الشخصي للسكينة والمداومة على الطاعات</span>
              </div>
              <h1 className="font-quran text-3xl sm:text-4xl text-gold font-bold">
                رفيق المسلم اليومي
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                مساحتك الإيمانية الخاصة لتنظيم يومك بين الفروض والنوافل، ومتابعة وردك القرآني، وأذكار الصباح والمساء، بأسلوب شخصي يعينك على المداومة اقتداءً بهدي الحبيب ﷺ.
              </p>
            </div>

            {/* Date Navigator in Header */}
            <div className="bg-black/35 backdrop-blur-md rounded-2xl p-4 border border-gold/30 flex flex-col items-center gap-3 shrink-0 self-stretch md:self-auto">
              <div className="flex items-center justify-between gap-3 w-full">
                <button
                  type="button"
                  onClick={handleNextDay}
                  className="p-2 rounded-xl bg-white/10 hover:bg-gold/20 text-gold transition-colors"
                  title="اليوم التالي"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <div className="text-center min-w-[160px]">
                  <p className="text-xs text-gold font-bold">{isToday ? 'اليوم المبارك' : 'سجل سابق'}</p>
                  <p className="text-sm font-extrabold text-white mt-0.5">{formatArabicDate(selectedDate)}</p>
                </div>

                <button
                  type="button"
                  onClick={handlePrevDay}
                  className="p-2 rounded-xl bg-white/10 hover:bg-gold/20 text-gold transition-colors"
                  title="اليوم السابق"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>

              {!isToday && (
                <button
                  type="button"
                  onClick={handleJumpToToday}
                  className="px-3 py-1 rounded-full bg-gold text-royal text-xs font-bold hover:opacity-90 transition-opacity"
                >
                  العودة لتاريخ اليوم
                </button>
              )}
            </div>
          </div>
        </section>

        {/* 2. Today's Live Prayer Card & Quick Overview Strip */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Prayer Quick Card (4 cols) */}
          <div className="md:col-span-5 glass-panel rounded-3xl p-5 border border-gold/30 flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gold" />
                <h3 className="font-bold text-sm text-royal dark:text-gold">الصلاة القادمة</h3>
              </div>
              <Link to="/prayer" className="text-xs text-gold hover:underline font-bold">
                {settings.selectedCity.nameAr}
              </Link>
            </div>

            <div className="text-center py-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">الوقت المتبقي لصلاة</span>
              <h4 className="text-2xl font-black text-royal dark:text-white mt-1">
                {prayerState.nextPrayer.nameAr} ({prayerState.nextPrayer.formattedTime})
              </h4>
              <div dir="ltr" className="text-3xl font-mono font-bold text-gold mt-1">
                {prayerState.remainingFormatted}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-gold/15">
              <span className="text-slate-500 dark:text-slate-400">اتجاه القبلة:</span>
              <span className="font-bold text-gold">{prayerState.qiblaDirection}° من الشمال</span>
            </div>
          </div>

          {/* Daily Quran & Adhkar Hub (7 cols) */}
          <div className="md:col-span-7 glass-panel rounded-3xl p-5 border border-gold/30 flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-gold" />
                <h3 className="font-bold text-sm text-royal dark:text-gold">الورد القرآني وواحة الأذكار</h3>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to="/quran"
                  className="px-2.5 py-1 rounded-xl bg-gold/15 text-gold text-xs font-bold hover:bg-gold/25 transition-colors"
                >
                  المصحف
                </Link>
                <Link
                  to="/adhkar"
                  className="px-2.5 py-1 rounded-xl bg-gold/15 text-gold text-xs font-bold hover:bg-gold/25 transition-colors"
                >
                  الأذكار
                </Link>
              </div>
            </div>

            {/* Quran Reading Progress Counter */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-royal/5 dark:bg-white/5 border border-gold/20 flex flex-col justify-between gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400">الصفحات المقروءة اليوم:</span>
                  <span className="text-base font-black text-gold">
                    {currentDayRecord.quranPagesRead || 0} ص
                  </span>
                </div>
                <div className="flex items-center gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => handleQuickAddQuranPages(1)}
                    className="flex-1 py-1 rounded-lg bg-gold/20 hover:bg-gold/30 text-royal dark:text-gold text-xs font-bold transition-colors"
                  >
                    +1 صفحة
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickAddQuranPages(5)}
                    className="flex-1 py-1 rounded-lg bg-gold/20 hover:bg-gold/30 text-royal dark:text-gold text-xs font-bold transition-colors"
                  >
                    +5 صفحات
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickAddQuranPages(-1)}
                    className="px-2 py-1 rounded-lg bg-royal/5 dark:bg-white/5 hover:bg-red-500/10 text-slate-500 text-xs transition-colors"
                    title="تراجع صفحة"
                  >
                    -
                  </button>
                </div>
              </div>

              {/* Memorization Goal */}
              <div className="p-3.5 rounded-2xl bg-royal/5 dark:bg-white/5 border border-gold/20 flex flex-col justify-between gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400">هدف الحفظ الحالي:</span>
                  <span className="text-xs font-bold text-royal dark:text-white">
                    {companionState.memorizationGoalSurah}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 text-xs">
                  <Link to="/khatmah" className="text-gold hover:underline font-semibold">
                    متابعة خطة الختمة الذكية
                  </Link>
                  <span className="text-[11px] text-slate-400">تلاوة متصلة</span>
                </div>
              </div>
            </div>

            {/* Motivational Prophetic Quote */}
            <div className="p-2.5 rounded-xl bg-gold/10 border border-gold/20 text-xs flex items-center gap-2 text-royal dark:text-slate-200">
              <Info className="w-4 h-4 text-gold shrink-0" />
              <span>{randomWisdom.text} — <strong className="text-gold">{randomWisdom.source}</strong></span>
            </div>
          </div>
        </section>

        {/* 3. Daily Completion Metrics Cards */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="glass-panel rounded-2xl p-4 border border-gold/20 text-center space-y-1">
            <span className="text-xs text-slate-500 dark:text-slate-400">إنجاز اليوم العام</span>
            <div className="text-2xl font-black text-gold">{metrics.percentage}%</div>
            <div className="text-[11px] text-slate-400">
              {metrics.completedCount} من {metrics.total} أعمال
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-4 border border-gold/20 text-center space-y-1">
            <span className="text-xs text-slate-500 dark:text-slate-400">الصلوات والفروض</span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {metrics.obligatoryCompleted} / {metrics.obligatoryTotal}
            </div>
            <div className="text-[11px] text-slate-400">الفريضة أحب ما تقرب به العبد</div>
          </div>

          <div className="glass-panel rounded-2xl p-4 border border-gold/20 text-center space-y-1">
            <span className="text-xs text-slate-500 dark:text-slate-400">السنن والنوافل</span>
            <div className="text-2xl font-black text-gold">
              {metrics.voluntaryCompleted} / {metrics.voluntaryTotal}
            </div>
            <div className="text-[11px] text-slate-400">تطوع مستحب لرفعة الدرجات</div>
          </div>

          <div className="glass-panel rounded-2xl p-4 border border-gold/20 text-center space-y-1">
            <span className="text-xs text-slate-500 dark:text-slate-400">الورد القرآني</span>
            <div className="text-2xl font-black text-royal dark:text-white">
              {currentDayRecord.quranPagesRead || 0} <span className="text-xs font-normal">صفحات</span>
            </div>
            <div className="text-[11px] text-slate-400">تلاوة وتدبر لآيات الكتاب</div>
          </div>
        </section>

        {/* 4. Interactive Activities Tracker Section */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-royal dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-gold" />
                <span>أنشطة وطاعات اليوم ({formatArabicDate(selectedDate)})</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                انقر على الدائرة لتمييز العمل المنجز • يتم حفظ تقدمك تلقائياً في جهازك
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAddCustomModal(true)}
                className="px-3 py-1.5 rounded-xl bg-gold text-royal font-bold text-xs hover:opacity-95 transition-opacity inline-flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة هدف خاص</span>
              </button>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'all', label: 'جميع الأنشطة' },
              { id: 'fard', label: 'الفروض الخمسة' },
              { id: 'sunnah', label: 'السنن والنوافل' },
              { id: 'adhkar', label: 'الأذكار النبوية' },
              { id: 'quran', label: 'القرآن الكريم' },
              { id: 'charity', label: 'الصدقة والإحسان' },
              { id: 'custom', label: 'أهدافي الخاصة' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategoryFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
                  activeCategoryFilter === tab.id
                    ? 'bg-gold text-royal shadow-sm'
                    : 'bg-royal/5 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-gold/15'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Activities List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredActivities.map((act) => {
              const isCompleted = Boolean(currentDayRecord.activities[act.id]?.completed);

              return (
                <motion.div
                  key={act.id}
                  whileHover={{ y: -2 }}
                  className={`rounded-2xl p-4 border transition-all flex items-start justify-between gap-3 ${
                    isCompleted
                      ? 'glass-panel border-emerald-500/50 bg-emerald-500/[0.04]'
                      : 'glass-panel border-gold/20 hover:border-gold/50'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={() => handleToggleActivity(act.id)}
                      className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                        isCompleted
                          ? 'text-emerald-500 hover:scale-110'
                          : 'text-slate-400 hover:text-gold hover:scale-110'
                      }`}
                      title={isCompleted ? 'إلغاء التحديد' : 'تحديد كمنجز'}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 fill-emerald-500 text-white dark:text-slate-900" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3
                          className={`font-bold text-sm leading-tight ${
                            isCompleted
                              ? 'line-through text-slate-400 dark:text-slate-500'
                              : 'text-royal dark:text-white'
                          }`}
                        >
                          {act.title}
                        </h3>

                        {act.isObligatory ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/25">
                            فرض مكتوب
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/15 text-royal dark:text-gold font-semibold border border-gold/25">
                            سنة مستحبة
                          </span>
                        )}

                        {act.isCustom && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 font-bold">
                            هدف مخصص
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {act.description}
                      </p>

                      {act.referenceEvidence && (
                        <p className="text-[11px] text-gold/80 italic font-quran pt-0.5">
                          {act.referenceEvidence}
                        </p>
                      )}
                    </div>
                  </div>

                  {act.isCustom && (
                    <button
                      type="button"
                      onClick={() => handleDeleteCustomActivity(act.id)}
                      className="text-slate-400 hover:text-red-500 p-1 rounded-lg transition-colors shrink-0"
                      title="حذف هذا الهدف المخصص"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* 5. Weekly Activity Summary & Reflection Note */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Weekly Heatmap / Chart (6 cols) */}
          <div className="lg:col-span-6 glass-panel rounded-3xl p-6 border border-gold/30 flex flex-col justify-between gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-gold" />
                <h3 className="font-bold text-base text-royal dark:text-white">
                  المتابعة الأسبوعية للأيام السبعة الماضية
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-semibold">استمرارية الطاعات</span>
            </div>

            <div className="grid grid-cols-7 gap-2 pt-2">
              {weeklyStats.map((st) => {
                const isSelected = st.date === selectedDate;
                return (
                  <button
                    key={st.date}
                    type="button"
                    onClick={() => setSelectedDate(st.date)}
                    className={`p-2.5 rounded-2xl flex flex-col items-center justify-between gap-2 border transition-all ${
                      isSelected
                        ? 'border-gold bg-gold/20 shadow-sm'
                        : 'border-gold/15 bg-royal/[0.02] dark:bg-white/[0.02] hover:border-gold/40'
                    }`}
                  >
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">{st.dayLabel}</span>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white"
                      style={{
                        backgroundColor:
                          st.percentage >= 80
                            ? '#059669'
                            : st.percentage >= 50
                            ? '#D97706'
                            : st.percentage > 0
                            ? '#2563EB'
                            : '#64748B'
                      }}
                    >
                      {st.percentage}%
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {st.completedActivities} عمل
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-gold/15 pt-3">
              💡 «أحب الأعمال إلى الله أدومها وإن قل»؛ لا يشترط إكمال كل شيء كل يوم، وإنما القصد المداومة والتسديد والمقاربة بقلب خاشع.
            </p>
          </div>

          {/* Daily Reflection Journal (6 cols) */}
          <div className="lg:col-span-6 glass-panel rounded-3xl p-6 border border-gold/30 flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-gold" />
                <h3 className="font-bold text-base text-royal dark:text-white">
                  خاطرة وتدبر اليوم ({formatArabicDate(selectedDate)})
                </h3>
              </div>
              {reflectionSavedAlert && (
                <span className="text-xs text-emerald-500 font-bold animate-pulse">
                  تم الحفظ بنجاح ✓
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              سجل آية استوقفتك اليوم، أو نعمة تشكر الله عليها، أو دعاء تلح به على ربك:
            </p>

            <textarea
              rows={4}
              value={reflectionInput}
              onChange={(e) => setReflectionInput(e.target.value)}
              placeholder="اكتب خواطرك الإيمانية وتأملاتك هنا لتكون لك مرجعاً وسكينة..."
              className="w-full p-3.5 rounded-2xl bg-royal/5 dark:bg-white/5 border border-gold/25 text-royal dark:text-slate-100 text-sm focus:outline-none focus:border-gold resize-none"
            />

            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={handleSaveReflection}
                className="px-4 py-2 rounded-xl gold-gradient text-royal font-extrabold text-xs shadow-sm hover:scale-[1.02] transition-transform"
              >
                حفظ الخاطرة في سجل اليوم
              </button>
            </div>
          </div>
        </section>

        {/* Modal: Add Custom Activity */}
        <AnimatePresence>
          {showAddCustomModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-gold/40 shadow-2xl space-y-5"
              >
                <div className="flex items-center justify-between border-b border-gold/20 pb-3">
                  <h3 className="text-lg font-bold text-royal dark:text-gold flex items-center gap-2">
                    <Plus className="w-5 h-5 text-gold" />
                    <span>إضافة نشاط أو هدف يومي خاص</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowAddCustomModal(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCreateCustomActivity} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-royal dark:text-slate-200 mb-1.5">
                      عنوان النشاط أو العبادة:
                    </label>
                    <input
                      type="text"
                      required
                      value={newActivityTitle}
                      onChange={(e) => setNewActivityTitle(e.target.value)}
                      placeholder="مثال: قراءة صفحتين من كتاب التفسير، رياضة المشي..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-royal dark:text-slate-200 mb-1.5">
                      وصف مختصر:
                    </label>
                    <input
                      type="text"
                      value={newActivityDesc}
                      onChange={(e) => setNewActivityDesc(e.target.value)}
                      placeholder="وصف مشجع يساعدك على الالتزام..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-royal dark:text-slate-200 mb-1.5">
                      التصنيف:
                    </label>
                    <select
                      value={newActivityCat}
                      onChange={(e) => setNewActivityCat(e.target.value as ActivityCategory)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-gold"
                    >
                      <option value="custom">هدف عام / مخصص</option>
                      <option value="quran">القرآن والتدبر</option>
                      <option value="adhkar">الأذكار والدعاء</option>
                      <option value="sunnah_prayer">صلاة نافلة</option>
                      <option value="charity">صدقة وإحسان</option>
                      <option value="manners">أخلاق وصلة رحم</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-gold/15">
                    <button
                      type="button"
                      onClick={() => setShowAddCustomModal(false)}
                      className="px-4 py-2 rounded-xl text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl gold-gradient text-royal font-bold text-xs shadow-sm"
                    >
                      إضافة النشاط
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
};

