import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Compass,
  HeartHandshake
} from 'lucide-react';
import {
  WORSHIP_GUIDES,
  WORSHIP_PILLARS,
  WorshipTopicGuide,
  WorshipPillarId
} from '../data/worshipData';
import { PageWrapper } from '../components/layout/PageWrapper';

export const WorshipPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const guideParam = searchParams.get('guideId');

  const [selectedPillar, setSelectedPillar] = useState<WorshipPillarId | 'all'>('all');
  const [activeGuideId, setActiveGuideId] = useState<string>(
    guideParam || WORSHIP_GUIDES[0].id
  );
  const [copiedStepIdx, setCopiedStepIdx] = useState<number | null>(null);

  // Filtered guides
  const filteredGuides = useMemo(() => {
    if (selectedPillar === 'all') return WORSHIP_GUIDES;
    return WORSHIP_GUIDES.filter((g) => g.pillar === selectedPillar);
  }, [selectedPillar]);

  const activeGuide = useMemo(() => {
    return (
      WORSHIP_GUIDES.find((g) => g.id === activeGuideId) || WORSHIP_GUIDES[0]
    );
  }, [activeGuideId]);

  const handleSelectGuide = (id: string) => {
    setActiveGuideId(id);
    setSearchParams({ guideId: id });
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const handleCopyStep = (stepText: string, idx: number) => {
    navigator.clipboard.writeText(
      `${stepText}\n\n— من موسوعة تعليم العبادات بمشروع مدار اليقين`
    );
    setCopiedStepIdx(idx);
    setTimeout(() => setCopiedStepIdx(null), 2000);
  };

  return (
    <PageWrapper
      title={activeGuide ? `${activeGuide.title} | موسوعة تعليم العبادات الإسلامية` : 'فقه العبادات الإسلامية وأحكام الطهارة والصلاة والصيام'}
      description={activeGuide ? `${activeGuide.title} - ${activeGuide.summary}` : 'دليل فقهي عملي خطوة بخطوة لأركان الإسلام والعبادات؛ صفة الوضوء، الصلاة، أحكام الصيام، زكاة المال، والحج والعمرة.'}
      canonicalPath="/worship"
      breadcrumbs={[
        { name: 'الرئيسية', url: '/' },
        { name: 'فقه العبادات', url: '/worship' },
        ...(activeGuide ? [{ name: activeGuide.title, url: '/worship' }] : []),
      ]}
      schemaType="Article"
    >
      <div className="py-2 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="relative rounded-3xl p-8 sm:p-12 mb-10 overflow-hidden bg-gradient-to-br from-[#072A20] via-[#093528] to-[#041a14] border border-gold/30 shadow-2xl text-white">
        <div className="islamic-pattern absolute inset-0 opacity-15 pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-semibold mb-4">
            <Compass className="w-4 h-4" />
            <span>الدليل العملي لفرائض وسنن الإسلام</span>
          </div>
          <h1 className="font-quran text-3xl sm:text-5xl text-gold font-bold mb-4 leading-tight">
            موسوعة تعليم العبادات
          </h1>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-6">
            دليل فقهي عملي مصور خطوة بخطوة لأركان الإسلام الكبرى؛ من الطهارة والوضوء والغسل، إلى صفة صلاة النبي ﷺ الكاملة، وسجود السهو، وأحكام الصيام والمفطرات المعاصرة، وأنصبة الزكاة وحاسبتها، ومناسك الحج والعمرة يوماً بيوم.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-gold" />
              أدلة صريحة من الكتاب وصحيح السنة
            </span>
            <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl border border-white/10">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              تنبيهات للأخطاء الشائعة في العبادات
            </span>
          </div>
        </div>
      </div>

      {/* Pillar Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-8 bg-white/70 dark:bg-slate-900/70 p-3 rounded-2xl border border-gold/20 backdrop-blur-md">
        {WORSHIP_PILLARS.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              setSelectedPillar(p.id as any);
              const matching =
                p.id === 'all'
                  ? WORSHIP_GUIDES[0]
                  : WORSHIP_GUIDES.find((g) => g.pillar === p.id);
              if (matching) setActiveGuideId(matching.id);
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              selectedPillar === p.id
                ? 'bg-royal text-gold shadow-md dark:bg-gold dark:text-royal'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-gold/10'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Main Layout: Guides Nav + Detailed Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Guides List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center justify-between">
            <span>الأدلة الفقهية المتاحة ({filteredGuides.length})</span>
            <span className="text-xs text-gold font-normal">اختر العبادة</span>
          </h2>

          {filteredGuides.map((guide) => {
            const isActive = guide.id === activeGuide.id;
            return (
              <div
                key={guide.id}
                onClick={() => handleSelectGuide(guide.id)}
                className={`cursor-pointer p-4 rounded-2xl transition-all border text-right relative overflow-hidden ${
                  isActive
                    ? 'bg-gradient-to-r from-royal/10 via-royal/5 to-transparent dark:from-gold/15 dark:via-gold/5 dark:to-transparent border-gold shadow-md'
                    : 'bg-white dark:bg-slate-900 hover:bg-gold/5 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                }`}
              >
                {isActive && (
                  <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-gold" />
                )}
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="font-bold text-gold">{guide.pillarNameAr}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800">
                    {guide.ruling}
                  </span>
                </div>
                <h3
                  className={`font-bold text-sm leading-snug mb-1 ${
                    isActive ? 'text-royal dark:text-gold' : 'text-slate-800 dark:text-slate-100'
                  }`}
                >
                  {guide.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {guide.subtitle}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right Side: Step-by-Step Practical Reader (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeGuide.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-gold/25 shadow-xl space-y-6"
            >
              {/* Guide Header */}
              <div className="pb-5 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-gold mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-gold/15 border border-gold/30">
                    {activeGuide.pillarNameAr}
                  </span>
                  <span>• حكمها: {activeGuide.ruling}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-quran text-slate-900 dark:text-slate-100">
                  {activeGuide.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {activeGuide.subtitle}
                </p>
              </div>

              {/* Summary */}
              <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-gold/5 border border-gold/20 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {activeGuide.summary}
              </div>

              {/* Conditions & Pillars Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Conditions */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                  <h4 className="text-xs font-bold text-royal dark:text-gold uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>شروط الصحة والوجوب:</span>
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                    {activeGuide.conditions.map((cond, cIdx) => (
                      <li key={cIdx} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
                        <span>{cond}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pillars / Obligations */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                  <h4 className="text-xs font-bold text-royal dark:text-gold uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    <span>الأركان والفرائض والواجبات:</span>
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                    {activeGuide.pillarsOrObligations.map((pil, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
                        <span>{pil}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Invalidators / Warnings */}
              {activeGuide.invalidators.length > 0 && (
                <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/25 space-y-2">
                  <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>المبطلات ومفسدات العبادة التي يجب التحرز منها:</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
                    {activeGuide.invalidators.map((inv, iIdx) => (
                      <div key={iIdx} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                        <span>{inv}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step-by-Step Flow */}
              <div className="pt-4 space-y-4">
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                  <span>الصفة العملية خطوة بخطوة ({activeGuide.steps.length} خطوات)</span>
                  <span className="text-xs text-gold font-normal">طبق بالترتيب الشرعي</span>
                </h3>

                <div className="space-y-4">
                  {activeGuide.steps.map((step, sIdx) => (
                    <div
                      key={step.stepNumber}
                      className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-3 relative overflow-hidden"
                    >
                      {/* Step Number + Title */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-full bg-royal text-gold font-bold text-xs flex items-center justify-center dark:bg-gold dark:text-royal">
                            {step.stepNumber}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                            {step.title}
                          </h4>
                        </div>

                        <button
                          onClick={() =>
                            handleCopyStep(
                              `${step.title}: ${step.actionDescription}\nالدليل: ${step.evidence}`,
                              sIdx
                            )
                          }
                          className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-500 hover:text-gold transition-colors text-xs flex items-center gap-1"
                          title="نسخ الخطوة"
                        >
                          {copiedStepIdx === sIdx ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Action Description */}
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
                        {step.actionDescription}
                      </p>

                      {/* Saying in Arabic if available */}
                      {step.sayingArabic && (
                        <div className="p-3 rounded-xl bg-gold/10 dark:bg-gold/15 border border-gold/30 text-center font-quran text-sm sm:text-base text-slate-900 dark:text-gold leading-relaxed">
                          {step.sayingArabic}
                        </div>
                      )}

                      {/* Evidence */}
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                        <strong className="text-gold">الدليل:</strong> {step.evidence}
                      </div>

                      {/* Common Mistakes */}
                      {step.commonMistakes && step.commonMistakes.length > 0 && (
                        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-[11px] text-amber-700 dark:text-amber-300 space-y-1">
                          <strong className="block font-bold">تنبيه لخطأ شائع:</strong>
                          {step.commonMistakes.map((mis, mIdx) => (
                            <div key={mIdx}>• {mis}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
    </PageWrapper>
  );
};

