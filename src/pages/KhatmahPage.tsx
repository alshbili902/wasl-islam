import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CalendarCheck,
  Plus,
  Pause,
  Play,
  Trash2,
  CheckCircle2,
  Circle,
  BookOpen,
  Sparkles,
  Award,
} from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { KhatmahPlan } from '../types';

const TOTAL_MUSHAF_PAGES = 604;

const DEFAULT_PLANS: KhatmahPlan[] = [
  {
    id: 'default-30-days',
    title: 'الختمة الشهرية المنتظمة (جزء يومياً)',
    targetDays: 30,
    startDate: new Date().toLocaleDateString('ar-SA'),
    startJuz: 1,
    completedDays: [1, 2, 3],
    completedPages: 60,
    isPaused: false,
  },
];

export const KhatmahPage: React.FC = () => {
  const [plans, setPlans] = useState<KhatmahPlan[]>(() => {
    try {
      const saved = localStorage.getItem('madar_khatmah_plans_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return DEFAULT_PLANS;
  });

  const [activePlanId, setActivePlanId] = useState<string>(() => plans[0]?.id || 'default-30-days');
  const [newTitle, setNewTitle] = useState<string>('ختمة تدبر وتلاوة جديدة');
  const [newDays, setNewDays] = useState<number>(30);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('madar_khatmah_plans_v1', JSON.stringify(plans));
    } catch {
      // ignore
    }
  }, [plans]);

  const activePlan = useMemo(
    () => plans.find((p) => p.id === activePlanId) || plans[0],
    [plans, activePlanId]
  );

  // Build daily schedule breakdown by pages (1..604) and Juz (1..30)
  const dailySchedule = useMemo(() => {
    if (!activePlan) return [];
    const days = Math.max(1, activePlan.targetDays);
    const items = [];
    for (let day = 1; day <= days; day++) {
      const startPage = Math.floor(((day - 1) * TOTAL_MUSHAF_PAGES) / days) + 1;
      const endPage =
        day === days
          ? TOTAL_MUSHAF_PAGES
          : Math.floor((day * TOTAL_MUSHAF_PAGES) / days);
      const pageCount = Math.max(1, endPage - startPage + 1);
      const approxJuzStart = Math.min(30, Math.max(1, Math.ceil(startPage / 20.13)));
      const approxJuzEnd = Math.min(30, Math.max(1, Math.ceil(endPage / 20.13)));

      items.push({
        day,
        startPage,
        endPage,
        pageCount,
        juzLabel:
          approxJuzStart === approxJuzEnd
            ? `الجزء ${approxJuzStart}`
            : `الجزء ${approxJuzStart} - ${approxJuzEnd}`,
        isCompleted: activePlan.completedDays.includes(day),
      });
    }
    return items;
  }, [activePlan]);

  const progressPercentage = useMemo(() => {
    if (!activePlan || activePlan.targetDays <= 0) return 0;
    return Math.min(
      100,
      Math.round((activePlan.completedDays.length / activePlan.targetDays) * 100)
    );
  }, [activePlan]);

  const pagesPerDay = activePlan
    ? Math.ceil(TOTAL_MUSHAF_PAGES / Math.max(1, activePlan.targetDays))
    : 20;
  const pagesPerPrayer = Math.ceil(pagesPerDay / 5);

  const handleToggleDay = (dayNumber: number) => {
    if (!activePlan || activePlan.isPaused) return;
    setPlans((prev) =>
      prev.map((p) => {
        if (p.id !== activePlan.id) return p;
        const exists = p.completedDays.includes(dayNumber);
        const nextDays = exists
          ? p.completedDays.filter((d) => d !== dayNumber)
          : [...p.completedDays, dayNumber].sort((a, b) => a - b);
        const nextPages = Math.min(
          TOTAL_MUSHAF_PAGES,
          Math.round((nextDays.length / p.targetDays) * TOTAL_MUSHAF_PAGES)
        );
        return {
          ...p,
          completedDays: nextDays,
          completedPages: nextPages,
        };
      })
    );
  };

  const handleTogglePause = () => {
    if (!activePlan) return;
    setPlans((prev) =>
      prev.map((p) => (p.id === activePlan.id ? { ...p, isPaused: !p.isPaused } : p))
    );
  };

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    const safeDays = Math.min(365, Math.max(1, Number(newDays) || 30));
    const created: KhatmahPlan = {
      id: `khatmah-${Date.now()}`,
      title: newTitle.trim() || `ختمة في ${safeDays} يوماً`,
      targetDays: safeDays,
      startDate: new Date().toLocaleDateString('ar-SA'),
      startJuz: 1,
      completedDays: [],
      completedPages: 0,
      isPaused: false,
    };
    setPlans((prev) => [created, ...prev]);
    setActivePlanId(created.id);
    setShowCreateForm(false);
    setNewTitle('ختمة قرآنية جديدة');
  };

  const handleDeletePlan = (id: string) => {
    if (plans.length <= 1) return;
    const remaining = plans.filter((p) => p.id !== id);
    setPlans(remaining);
    if (activePlanId === id && remaining[0]) {
      setActivePlanId(remaining[0].id);
    }
  };

  return (
    <PageWrapper
      title="الختمة القرآنية الذكية"
      description="إدارة خطط ختم القرآن الكريم، حساب الورد اليومي بالصفحات والأجزاء تلقائياً، ومتابعة نسبة الإنجاز."
      canonicalPath="/khatmah"
      breadcrumbs={[
        { label: 'الرئيسية', path: '/' },
        { label: 'الختمة القرآنية', path: '/khatmah' }
      ]}
    >
      <div className="space-y-8">
        {/* Hero Banner */}
        <section className="rounded-3xl royal-gradient text-white p-6 sm:p-8 border border-gold/35 shadow-xl relative overflow-hidden">
          <div className="islamic-pattern absolute inset-0 opacity-30 pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-bold">
                <CalendarCheck className="w-4 h-4" />
                <span>مخطط الورد القرآني الذكي • 604 صفحات</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black">
                الختمة القرآنية الذكية
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 max-w-2xl">
                خطط لختم القرآن الكريم في المدة التي تناسبك، مع تقسيم تلقائي للورد اليومي حسب الصفحات والأجزاء وتوزيع مقترح عقب الصلوات الخمس.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-5 py-3 rounded-2xl gold-gradient text-royal font-extrabold text-xs sm:text-sm shadow-gold-glow inline-flex items-center gap-2 self-start lg:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>إنشاء خطة ختمة جديدة</span>
            </button>
          </div>
        </section>

        {/* Create New Khatmah Plan Form */}
        {showCreateForm && (
          <motion.form
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleCreatePlan}
            className="glass-panel rounded-3xl p-6 border border-gold/40 space-y-5"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-royal dark:text-gold flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span>إعداد خطة ختمة قرآنية جديدة</span>
              </h2>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="text-xs text-slate-500 hover:text-rose-500 font-bold"
              >
                إلغاء
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                  اسم خطة الختمة
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: ختمة التلاوة الشهرية، ختمة التدبر..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#0B131E] border border-gold/30 text-sm font-bold text-royal dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                  عدد أيام الختمة (من 3 إلى 365 يوماً)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={365}
                    value={newDays}
                    onChange={(e) => setNewDays(Number(e.target.value))}
                    className="w-28 px-3 py-2.5 rounded-xl bg-white dark:bg-[#0B131E] border border-gold/30 text-sm font-bold text-royal dark:text-white"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {[7, 10, 15, 30, 60].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setNewDays(d)}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                          newDays === d
                            ? 'royal-gradient text-gold border-gold'
                            : 'bg-royal/5 dark:bg-white/5 border-gold/20 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {d} يوم
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gold/10 border border-gold/25 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div>
                <span className="font-extrabold text-royal dark:text-gold">الورد اليومي المحسوب: </span>
                <span>
                  نحو {Math.ceil(TOTAL_MUSHAF_PAGES / Math.max(1, newDays))} صفحة يومياً (بمعدل{' '}
                  {Math.ceil(Math.ceil(TOTAL_MUSHAF_PAGES / Math.max(1, newDays)) / 5)} صفحات بعد كل صلاة مفروضة).
                </span>
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl gold-gradient text-royal font-extrabold shadow-sm"
              >
                اعتماد وبدء الختمة
              </button>
            </div>
          </motion.form>
        )}

        {/* Multiple Khatmah Plans Selector Bar */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-600 dark:text-slate-300">
              خطط الختمات المحفوظة ({plans.length}):
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.map((plan) => {
              const isSelected = plan.id === activePlan?.id;
              const pct = Math.min(
                100,
                Math.round((plan.completedDays.length / Math.max(1, plan.targetDays)) * 100)
              );

              return (
                <div
                  key={plan.id}
                  onClick={() => setActivePlanId(plan.id)}
                  className={`cursor-pointer rounded-2xl p-4 border transition-all flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'royal-gradient text-white border-gold shadow-gold-glow'
                      : 'glass-panel border-gold/20 hover:border-gold'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3
                        className={`font-extrabold text-sm sm:text-base truncate ${
                          isSelected ? 'text-gold' : 'text-royal dark:text-white'
                        }`}
                      >
                        {plan.title}
                      </h3>
                      <p
                        className={`text-xs ${
                          isSelected ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        المدة: {plan.targetDays} يوماً • بدأت: {plan.startDate}
                      </p>
                    </div>
                    {plan.isPaused && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold shrink-0">
                        متوقفة مؤقتاً
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span>
                        أُنجز {plan.completedDays.length} من {plan.targetDays} يوم
                      </span>
                      <span className="text-gold">{pct}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-black/20 dark:bg-white/10 overflow-hidden">
                      <div
                        className="h-full gold-gradient rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Active Plan Dashboard & Daily Tracker */}
        {activePlan && (
          <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-gold/30 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-gold/20">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-gold" />
                  <h2 className="text-xl sm:text-2xl font-black text-royal dark:text-white">
                    {activePlan.title}
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  الورد اليومي: <strong className="text-gold">{pagesPerDay} صفحة</strong> يومياً (نحو{' '}
                  <strong>{pagesPerPrayer} صفحات</strong> دبر كل صلاة مفروضة)
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleTogglePause}
                  className={`px-4 py-2.5 rounded-xl text-xs font-extrabold inline-flex items-center gap-1.5 border transition-colors ${
                    activePlan.isPaused
                      ? 'gold-gradient text-royal border-gold'
                      : 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/30'
                  }`}
                >
                  {activePlan.isPaused ? (
                    <>
                      <Play className="w-4 h-4" />
                      <span>استئناف الختمة</span>
                    </>
                  ) : (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>إيقاف مؤقت للختمة</span>
                    </>
                  )}
                </button>

                <Link
                  to="/quran"
                  className="px-4 py-2.5 rounded-xl royal-gradient text-white text-xs font-extrabold inline-flex items-center gap-1.5"
                >
                  <BookOpen className="w-4 h-4 text-gold" />
                  <span>فتح المصحف للقراءة</span>
                </Link>

                {plans.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeletePlan(activePlan.id)}
                    className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/25"
                    title="حذف هذه الخطة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Progress Bar & Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-royal/5 dark:bg-white/5 border border-gold/20">
                <span className="text-xs text-slate-500 dark:text-slate-400 block">
                  نسبة الإنجاز الكلية
                </span>
                <span className="text-2xl font-black text-gold">{progressPercentage}%</span>
                <div className="mt-2 w-full h-2.5 rounded-full bg-royal/10 dark:bg-white/10 overflow-hidden">
                  <div
                    className="h-full gold-gradient rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-royal/5 dark:bg-white/5 border border-gold/20">
                <span className="text-xs text-slate-500 dark:text-slate-400 block">
                  الأيام المكتملة
                </span>
                <span className="text-2xl font-black text-royal dark:text-white">
                  {activePlan.completedDays.length} / {activePlan.targetDays} يوماً
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1">
                  متبقي {Math.max(0, activePlan.targetDays - activePlan.completedDays.length)} يوماً للختم
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-royal/5 dark:bg-white/5 border border-gold/20">
                <span className="text-xs text-slate-500 dark:text-slate-400 block">
                  الصفحات المقروءة تقريباً
                </span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {activePlan.completedPages} / {TOTAL_MUSHAF_PAGES} صفحة
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1">
                  من مصحف المدينة النبوية
                </span>
              </div>
            </div>

            {activePlan.isPaused && (
              <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/35 text-xs font-bold text-amber-700 dark:text-amber-300">
                هذه الختمة متوقفة مؤقتاً حالياً. اضغط على «استئناف الختمة» بالأعلى لمتابعة تسجيل إنجازك اليومي.
              </div>
            )}

            {/* Daily Schedule Grid */}
            <div className="space-y-3">
              <h3 className="text-base font-extrabold text-royal dark:text-white">
                جدول المتابعة اليومي (اضغط على اليوم لتحديد إنجازه):
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 max-h-[520px] overflow-y-auto p-1">
                {dailySchedule.map((item) => (
                  <button
                    key={item.day}
                    type="button"
                    disabled={activePlan.isPaused}
                    onClick={() => handleToggleDay(item.day)}
                    className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between gap-2.5 ${
                      item.isCompleted
                        ? 'royal-gradient text-white border-gold shadow-sm'
                        : 'bg-white/70 dark:bg-white/[0.03] border-gold/20 hover:border-gold text-royal dark:text-white'
                    } ${activePlan.isPaused ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-xs font-extrabold ${
                          item.isCompleted ? 'text-gold' : 'text-royal dark:text-gold'
                        }`}
                      >
                        اليوم {item.day}
                      </span>
                      {item.isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <p className="text-sm font-black">
                        ص {item.startPage} إلى ص {item.endPage}
                      </p>
                      <p
                        className={`text-[11px] ${
                          item.isCompleted ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {item.juzLabel} ({item.pageCount} صفحة)
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </PageWrapper>
  );
};

