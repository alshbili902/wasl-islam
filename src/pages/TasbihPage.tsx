import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CircleDot,
  RotateCcw,
  Target,
  Vibrate,
  Award,
  Sparkles,
  CheckCircle2,
  BarChart3,
} from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { TASBIH_PRESETS } from '../data/adhkarData';
import { useApp } from '../context/AppContext';

interface TasbihStats {
  totalAllTime: number;
  todayCount: number;
  todayDate: string;
  byPreset: Record<string, number>;
}

export const TasbihPage: React.FC = () => {
  const { settings, updateSettings } = useApp();
  const [selectedPresetId, setSelectedPresetId] = useState<string>(TASBIH_PRESETS[0].id);
  const [sessionCount, setSessionCount] = useState<number>(0);
  const [dailyTarget, setDailyTarget] = useState<number>(100);
  const [pulseKey, setPulseKey] = useState<number>(0);

  const todayStr = new Date().toLocaleDateString('ar-SA');

  const [stats, setStats] = useState<TasbihStats>(() => {
    try {
      const saved = localStorage.getItem('madar_tasbih_stats_v1');
      if (saved) {
        const parsed: TasbihStats = JSON.parse(saved);
        if (parsed.todayDate !== todayStr) {
          return {
            ...parsed,
            todayCount: 0,
            todayDate: todayStr,
          };
        }
        return parsed;
      }
    } catch {
      // ignore
    }
    return {
      totalAllTime: 0,
      todayCount: 0,
      todayDate: todayStr,
      byPreset: {},
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem('madar_tasbih_stats_v1', JSON.stringify(stats));
    } catch {
      // ignore
    }
  }, [stats]);

  const activePreset =
    TASBIH_PRESETS.find((p) => p.id === selectedPresetId) || TASBIH_PRESETS[0];

  const handleSelectPreset = (id: string) => {
    setSelectedPresetId(id);
    const found = TASBIH_PRESETS.find((p) => p.id === id);
    if (found) {
      setDailyTarget(found.recommendedTarget);
    }
    setSessionCount(0);
  };

  const handleIncrement = () => {
    const nextSession = sessionCount + 1;
    setSessionCount(nextSession);
    setPulseKey((k) => k + 1);

    if (settings.hapticFeedback && typeof navigator !== 'undefined' && navigator.vibrate) {
      if (nextSession % dailyTarget === 0) {
        navigator.vibrate([40, 60, 40]);
      } else {
        navigator.vibrate(15);
      }
    }

    setStats((prev) => ({
      totalAllTime: prev.totalAllTime + 1,
      todayCount: prev.todayCount + 1,
      todayDate: todayStr,
      byPreset: {
        ...prev.byPreset,
        [selectedPresetId]: (prev.byPreset[selectedPresetId] || 0) + 1,
      },
    }));
  };

  const handleResetSession = () => {
    setSessionCount(0);
  };

  const progressFraction = Math.min(1, (sessionCount % dailyTarget || (sessionCount > 0 && sessionCount % dailyTarget === 0 ? dailyTarget : 0)) / Math.max(1, dailyTarget));
  const circleRadius = 112;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circleCircumference * (1 - progressFraction);
  const completedRounds = Math.floor(sessionCount / Math.max(1, dailyTarget));

  return (
    <PageWrapper
      title="المسبحة الإلكترونية الفاخرة"
      description="مسبحة إلكترونية بتصميم دائري إسلامي فاخر مع عداد الجلسة، الهدف اليومي، الاهتزاز التفاعلي، وحفظ إحصائيات التسبيح."
    >
      <div className="space-y-8">
        {/* Hero Banner */}
        <section className="rounded-3xl royal-gradient text-white p-6 sm:p-8 border border-gold/35 shadow-xl relative overflow-hidden">
          <div className="islamic-pattern absolute inset-0 opacity-30 pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-bold">
                <CircleDot className="w-4 h-4" />
                <span>حلقة الذكر والتسبيح الرقمية</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black">
                المسبحة الإلكترونية الفاخرة
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 max-w-2xl">
                ﴿فَسَبِّحْ بِحَمْدِ رَبِّكَ وَكُن مِّنَ السَّاجِدِينَ﴾ — اختر صيغة التسبيح النبوية المأثورة، وحدد هدفك اليومي مع حفظ تلقائي لإحصائياتك.
              </p>
            </div>

            <button
              type="button"
              onClick={() => updateSettings({ hapticFeedback: !settings.hapticFeedback })}
              className={`px-4 py-2.5 rounded-2xl border text-xs font-extrabold inline-flex items-center gap-2 transition-all self-start lg:self-auto ${
                settings.hapticFeedback
                  ? 'gold-gradient text-royal border-gold shadow-gold-glow'
                  : 'bg-white/10 text-slate-200 border-white/20'
              }`}
            >
              <Vibrate className="w-4 h-4" />
              <span>
                الاهتزاز اللمسي: {settings.hapticFeedback ? 'مفعل' : 'متوقف'}
              </span>
            </button>
          </div>
        </section>

        {/* Main Grid: Circular Luxury Tasbih Dial (7 cols) + Presets & Stats (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* 7 cols: Interactive Luxury Circular Dial */}
          <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 border border-gold/35 flex flex-col items-center justify-between gap-6 relative overflow-hidden">
            {/* Selected Dhikr Display */}
            <div className="w-full text-center space-y-2 border-b border-gold/20 pb-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 text-gold text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{activePreset.source}</span>
              </span>
              <h2 className="font-quran text-2xl sm:text-3xl lg:text-4xl text-royal dark:text-amber-50 leading-relaxed">
                {activePreset.text}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
                {activePreset.virtue}
              </p>
            </div>

            {/* Interactive Circular Tasbih Ring */}
            <div className="relative flex items-center justify-center my-2">
              <svg className="w-72 h-72 sm:w-80 sm:h-80 -rotate-90" viewBox="0 0 260 260">
                {/* Background Track Circle */}
                <circle
                  cx="130"
                  cy="130"
                  r={circleRadius}
                  fill="none"
                  stroke="rgba(197, 160, 89, 0.18)"
                  strokeWidth="12"
                />
                {/* Animated Progress Ring */}
                <circle
                  cx="130"
                  cy="130"
                  r={circleRadius}
                  fill="none"
                  stroke="#C5A059"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={circleCircumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300"
                />
              </svg>

              {/* Center Big Tap Button */}
              <motion.button
                key={pulseKey}
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={handleIncrement}
                aria-label="اضغط للتسبيح"
                className="absolute w-52 h-52 sm:w-56 sm:h-56 rounded-full royal-gradient text-white border-4 border-gold/50 shadow-2xl flex flex-col items-center justify-center gap-1.5 cursor-pointer select-none focus:outline-none hover:border-gold transition-colors"
              >
                <span className="text-xs font-bold text-gold tracking-wide">اضغط للتسبيح</span>
                <span className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-white">
                  {sessionCount}
                </span>
                <span className="text-xs text-slate-300">
                  الهدف: {dailyTarget} {completedRounds > 0 ? `• (${completedRounds} دورة)` : ''}
                </span>
              </motion.button>
            </div>

            {/* Controls Bar under the Ring: Target Selector & Reset */}
            <div className="w-full flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gold/20">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Target className="w-4 h-4 text-gold" />
                  <span>الهدف:</span>
                </span>
                {[33, 100, 300, 1000].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setDailyTarget(t)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-colors ${
                      dailyTarget === t
                        ? 'gold-gradient text-royal shadow-sm'
                        : 'bg-royal/5 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-gold/15'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleResetSession}
                className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/25 text-xs font-extrabold inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>تصفير عداد الجلسة</span>
              </button>
            </div>
          </div>

          {/* 5 cols: Presets List & Cumulative Statistics */}
          <div className="lg:col-span-5 space-y-6">
            {/* Cumulative Statistics Cards */}
            <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-gold/25 space-y-4">
              <div className="flex items-center gap-2 text-royal dark:text-gold font-extrabold text-base">
                <BarChart3 className="w-5 h-5 text-gold" />
                <h3>إحصائيات التسبيح المحفوظة</h3>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3.5 rounded-2xl bg-royal/5 dark:bg-white/5 border border-gold/20">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                    عداد الجلسة
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-gold font-mono">
                    {sessionCount}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-royal/5 dark:bg-white/5 border border-gold/20">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                    تسبيحات اليوم
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-royal dark:text-white font-mono">
                    {stats.todayCount}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-royal/5 dark:bg-white/5 border border-gold/20">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                    الإجمالي الكلي
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    {stats.totalAllTime}
                  </span>
                </div>
              </div>
            </div>

            {/* Selectable Prophetic Tasbih Formulas */}
            <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-gold/25 space-y-3.5">
              <div className="flex items-center gap-2 text-royal dark:text-gold font-extrabold text-base">
                <Award className="w-5 h-5 text-gold" />
                <h3>اختر صيغة التسبيح والذكر</h3>
              </div>

              <div className="space-y-2.5">
                {TASBIH_PRESETS.map((preset) => {
                  const active = preset.id === selectedPresetId;
                  const countForThis = stats.byPreset[preset.id] || 0;

                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset.id)}
                      className={`w-full text-right p-4 rounded-2xl border transition-all flex flex-col gap-1.5 ${
                        active
                          ? 'royal-gradient text-white border-gold shadow-gold-glow'
                          : 'bg-white/60 dark:bg-white/[0.02] border-gold/20 hover:border-gold text-royal dark:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-quran text-lg sm:text-xl font-bold">
                          {preset.text}
                        </span>
                        {active && <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />}
                      </div>
                      <div className="flex items-center justify-between gap-2 text-[11px]">
                        <span className={active ? 'text-gold/90' : 'text-slate-500 dark:text-slate-400'}>
                          الهدف المقترح: {preset.recommendedTarget} مرة
                        </span>
                        <span className="font-bold text-gold">
                          مجموعك فيها: {countForThis}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

