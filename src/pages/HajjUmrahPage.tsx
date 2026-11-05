import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  MapPin,
  CheckCircle2,
  Circle,
  BookOpen,
  Sparkles,
  PhoneCall,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Search,
  Copy,
  Check,
  HelpCircle,
  AlertTriangle,
  FileCheck2,
  ListTodo,
  ExternalLink,
  Info,
  Layers,
  Heart
} from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import {
  UMRAH_STEPS,
  HAJJ_STEPS,
  HAJJ_TYPES_INFO,
  MIQAT_LOCATIONS,
  HAJJ_CHECKLIST_DATA,
  OFFICIAL_SAUDI_SERVICES,
  HAJJ_UMRAH_FAQS
} from '../data/hajjUmrahData';
import { JourneyType, HajjType, JourneyStep } from '../types/hajjUmrah';

const HAJJ_UMRAH_STORAGE_KEY = 'madar_hajj_umrah_progress_v1';

export const HajjUmrahPage: React.FC = () => {
  // Navigation Tabs
  const [activeJourney, setActiveJourney] = useState<JourneyType>('umrah');
  const [selectedHajjType, setSelectedHajjType] = useState<HajjType>('tamattu');
  const [activeMainTab, setActiveMainTab] = useState<'journey' | 'miqats' | 'map' | 'supplications' | 'checklist' | 'faqs'>('journey');

  // Step selector
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  // Persistence: Completed steps & checklist
  const [completedSteps, setCompletedSteps] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(HAJJ_UMRAH_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.completedSteps || [];
      }
    } catch {}
    return [];
  });

  const [checkedChecklist, setCheckedChecklist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(HAJJ_UMRAH_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.checklist || [];
      }
    } catch {}
    return [];
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        HAJJ_UMRAH_STORAGE_KEY,
        JSON.stringify({
          completedSteps,
          checklist: checkedChecklist,
          selectedHajjType,
          lastUpdated: new Date().toISOString()
        })
      );
    } catch {}
  }, [completedSteps, checkedChecklist, selectedHajjType]);

  // Current active steps list
  const currentSteps: JourneyStep[] = useMemo(() => {
    return activeJourney === 'umrah' ? UMRAH_STEPS : HAJJ_STEPS;
  }, [activeJourney]);

  // Reset active step index if out of range
  useEffect(() => {
    if (activeStepIndex >= currentSteps.length) {
      setActiveStepIndex(0);
    }
  }, [activeJourney, currentSteps.length, activeStepIndex]);

  const currentStep = currentSteps[activeStepIndex] || currentSteps[0];

  // Journey completion rate
  const completionPercentage = useMemo(() => {
    const total = currentSteps.length || 1;
    const completedCount = currentSteps.filter((s) => completedSteps.includes(s.id)).length;
    return Math.round((completedCount / total) * 100);
  }, [currentSteps, completedSteps]);

  // Toggle step completion
  const handleToggleStep = (stepId: string) => {
    setCompletedSteps((prev) =>
      prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId]
    );
  };

  // Toggle checklist item
  const handleToggleChecklist = (itemId: string) => {
    setCheckedChecklist((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  // Supplications Search
  const [suppSearchQuery, setSuppSearchQuery] = useState('');
  const [copiedSuppId, setCopiedSuppId] = useState<string | null>(null);

  const allSupplications = useMemo(() => {
    const list: { stepTitle: string; title: string; arabicText: string; hadithSource: string; id: string }[] = [];
    [...UMRAH_STEPS, ...HAJJ_STEPS].forEach((step) => {
      step.supplications.forEach((supp) => {
        list.push({
          stepTitle: step.title,
          title: supp.title,
          arabicText: supp.arabicText,
          hadithSource: supp.hadithSource,
          id: supp.id
        });
      });
    });
    return list;
  }, []);

  const filteredSupplications = useMemo(() => {
    if (!suppSearchQuery.trim()) return allSupplications;
    const q = suppSearchQuery.toLowerCase();
    return allSupplications.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.arabicText.toLowerCase().includes(q) ||
        s.stepTitle.toLowerCase().includes(q)
    );
  }, [allSupplications, suppSearchQuery]);

  const handleCopyText = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSuppId(id);
      setTimeout(() => setCopiedSuppId(null), 2000);
    } catch {}
  };

  // Map pin modal / selection
  const [selectedMapLocation, setSelectedMapLocation] = useState<string | null>(null);

  return (
    <PageWrapper
      title="دليل الحج والعمرة التفاعلي"
      description="مرجع تفاعلي متكامل لمناسك الحج والعمرة خطوة بخطوة، مع الأدعية المأثورة، خريطة المشاعر، والمواقيت الشرعية المعتمدة."
      canonicalPath="/hajj-umrah"
      schemaType="learning"
      breadcrumbs={[
        { label: 'الرئيسية', path: '/' },
        { label: 'دليل الحج والعمرة', path: '/hajj-umrah' }
      ]}
    >
      <div className="space-y-8">
        {/* 1. Header Banner */}
        <section className="relative rounded-3xl p-6 sm:p-10 overflow-hidden bg-gradient-to-br from-[#072A20] via-[#093528] to-[#041a14] border border-gold/30 shadow-2xl text-white">
          <div className="islamic-pattern absolute inset-0 opacity-15 pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 text-gold border border-gold/30 text-xs font-bold">
                <Sparkles className="w-4 h-4" />
                <span>دليل الحاج والمعتمر الشرعي والتنفيذي الموثق</span>
              </div>
              <h1 className="font-quran text-3xl sm:text-4xl text-gold font-bold">
                دليل الحج والعمرة التفاعلي
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                رحلتك الإيمانية المباركة ميسرة وموثقة بأصح الأدلة من الكتاب والسنة والتوجيهات الرسمية لوزارة الحج والعمرة وهيئة كبار العلماء بالمملكة العربية السعودية.
              </p>
            </div>

            {/* Journey Switcher Buttons */}
            <div className="bg-black/40 backdrop-blur-md rounded-2xl p-2 border border-gold/30 flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setActiveJourney('umrah');
                  setActiveStepIndex(0);
                }}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                  activeJourney === 'umrah'
                    ? 'gold-gradient text-royal shadow-gold-glow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                دليل مناسك العمرة
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveJourney('hajj');
                  setActiveStepIndex(0);
                }}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                  activeJourney === 'hajj'
                    ? 'gold-gradient text-royal shadow-gold-glow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                دليل مناسك الحج
              </button>
            </div>
          </div>
        </section>

        {/* 2. Main Module Navigation Tabs */}
        <section className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-gold/20">
          {[
            { id: 'journey', label: activeJourney === 'umrah' ? 'مراحل العمرة خطوة بخطوة' : 'مراحل الحج خطوة بخطوة', icon: Layers },
            { id: 'map', label: 'خريطة المشاعر والمواقيت', icon: MapPin },
            { id: 'miqats', label: 'المواقيت المكانية الخمسة', icon: Compass },
            { id: 'supplications', label: 'موسوعة الأدعية المأثورة', icon: BookOpen },
            { id: 'checklist', label: 'حقيبة الحاج وقائمة التجهيز', icon: ListTodo },
            { id: 'faqs', label: 'فتاوى وأسئلة شائعة موثقة', icon: HelpCircle }
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeMainTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveMainTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
                  isCurrent
                    ? 'royal-gradient text-white border border-gold shadow-sm'
                    : 'bg-royal/5 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-gold/15'
                }`}
              >
                <Icon className={`w-4 h-4 ${isCurrent ? 'text-gold' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </section>

        {/* 3. TAB 1: STEP-BY-STEP JOURNEY */}
        {activeMainTab === 'journey' && (
          <div className="space-y-6">
            {/* If Hajj, show Hajj types selection card */}
            {activeJourney === 'hajj' && (
              <div className="glass-panel rounded-3xl p-5 border border-gold/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-royal dark:text-gold flex items-center gap-2">
                    <Layers className="w-4 h-4 text-gold" />
                    <span>حدد نوع حجك المبارك لمعرفة الفروق والأحكام:</span>
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {HAJJ_TYPES_INFO.map((ht) => (
                    <button
                      key={ht.type}
                      type="button"
                      onClick={() => setSelectedHajjType(ht.type)}
                      className={`p-3.5 rounded-2xl text-right border transition-all flex flex-col justify-between gap-2 ${
                        selectedHajjType === ht.type
                          ? 'border-gold bg-gold/15 shadow-sm'
                          : 'border-gold/15 bg-royal/[0.02] dark:bg-white/[0.02] hover:border-gold/35'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm text-royal dark:text-white">{ht.nameAr}</span>
                        {selectedHajjType === ht.type && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold text-royal font-bold">
                            النوع المختار
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {ht.subtitle}
                      </p>
                      <span className="text-[11px] text-gold font-semibold pt-1 border-t border-gold/15">
                        {ht.rulingOnHadi}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Journey Progress Bar */}
            <div className="glass-panel rounded-2xl p-4 border border-gold/25 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-10 h-10 rounded-full royal-gradient text-gold flex items-center justify-center font-bold text-sm shrink-0">
                  {completionPercentage}%
                </div>
                <div>
                  <h4 className="text-sm font-bold text-royal dark:text-white">
                    تقدمك في {activeJourney === 'umrah' ? 'مناسك العمرة' : 'مناسك الحج'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    أنجزت {currentSteps.filter((s) => completedSteps.includes(s.id)).length} من أصل {currentSteps.length} مرحلة
                  </p>
                </div>
              </div>

              {/* Step indicator buttons list */}
              <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
                {currentSteps.map((step, idx) => {
                  const isDone = completedSteps.includes(step.id);
                  const isCurrent = activeStepIndex === idx;

                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => setActiveStepIndex(idx)}
                      className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'royal-gradient text-gold border-2 border-gold scale-110 shadow-sm'
                          : isDone
                          ? 'bg-emerald-500 text-white'
                          : 'bg-royal/5 dark:bg-white/5 text-slate-400 hover:bg-gold/20'
                      }`}
                      title={step.title}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step Card Deep Dive */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-gold/30 space-y-6">
              {/* Step Title Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gold/20 pb-5">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-gold/15 text-gold font-bold border border-gold/30">
                      المرحلة {currentStep.stageNumber} من {currentSteps.length}
                    </span>

                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                        currentStep.ruling === 'pillar'
                          ? 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/25'
                          : currentStep.ruling === 'obligation'
                          ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25'
                          : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25'
                      }`}
                    >
                      {currentStep.rulingLabel}
                    </span>

                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      📍 {currentStep.locationName}
                    </span>
                  </div>

                  <h2 className="text-2xl font-black text-royal dark:text-white mt-1">
                    {currentStep.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-gold font-semibold">
                    ⏱ التوقيت: {currentStep.dateOrTiming}
                  </p>
                </div>

                {/* Completion Checkbox */}
                <button
                  type="button"
                  onClick={() => handleToggleStep(currentStep.id)}
                  className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 shrink-0 ${
                    completedSteps.includes(currentStep.id)
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-gold/15 hover:bg-gold/25 text-royal dark:text-gold border border-gold/35'
                  }`}
                >
                  {completedSteps.includes(currentStep.id) ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>تم إنجاز هذه المرحلة ✓</span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-5 h-5" />
                      <span>تحديد المرحلة كمنجزة</span>
                    </>
                  )}
                </button>
              </div>

              {/* Instructions & Required Actions Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Detailed Steps (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                  <h3 className="font-bold text-base text-royal dark:text-gold flex items-center gap-2">
                    <FileCheck2 className="w-5 h-5 text-gold" />
                    <span>البيان الشرعي والخطوات العملية:</span>
                  </h3>

                  <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-semibold">
                    {currentStep.summary}
                  </p>

                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    {currentStep.detailedInstructions.map((inst, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-gold shrink-0 mt-2" />
                        <span className="leading-relaxed">{inst}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Required Actions Pills */}
                  <div className="p-4 rounded-2xl bg-royal/5 dark:bg-white/5 border border-gold/20 space-y-2">
                    <h4 className="text-xs font-bold text-royal dark:text-gold">الواجبات والأفعال المطلوبة:</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentStep.requiredActions.map((act, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 text-xs text-royal dark:text-slate-200 border border-gold/25 font-semibold"
                        >
                          ✓ {act}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Evidence & Mistakes (5 cols) */}
                <div className="lg:col-span-5 space-y-4">
                  {/* Evidence Box */}
                  <div className="p-4 rounded-2xl bg-gold/10 border border-gold/30 space-y-2">
                    <h4 className="text-xs font-bold text-royal dark:text-gold flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-gold" />
                      <span>الدليل الشرعي الموثق:</span>
                    </h4>
                    <p className="font-quran text-sm sm:text-base text-royal dark:text-amber-100 leading-relaxed">
                      {currentStep.quranHadithEvidence.text}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold text-left" dir="ltr">
                      — {currentStep.quranHadithEvidence.source}
                    </p>
                  </div>

                  {/* Common Mistakes Warning Box */}
                  <div className="p-4 rounded-2xl bg-red-500/[0.04] border border-red-500/25 space-y-2">
                    <h4 className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <span>تنبيهات وأخطاء شائعة يجب الحذر منها:</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      {currentStep.commonMistakes.map((mis, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-red-500 font-bold shrink-0">✕</span>
                          <span>{mis}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Official Saudi Notes */}
                  <div className="p-3.5 rounded-2xl bg-royal/[0.02] dark:bg-white/[0.02] border border-gold/15 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    <strong className="text-gold">توجيه رسمي: </strong>
                    {currentStep.officialSaudiNotes}
                  </div>
                </div>
              </div>

              {/* Authenticated Supplications for this Step */}
              {currentStep.supplications.length > 0 && (
                <div className="pt-4 border-t border-gold/20 space-y-3">
                  <h3 className="font-bold text-sm text-royal dark:text-gold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-gold" />
                    <span>الأدعية المأثورة الصحيحة لهذه المرحلة:</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentStep.supplications.map((supp) => (
                      <div
                        key={supp.id}
                        className="p-4 rounded-2xl bg-royal/5 dark:bg-white/5 border border-gold/25 flex flex-col justify-between gap-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gold">{supp.title}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyText(supp.arabicText, supp.id)}
                            className="p-1.5 rounded-lg bg-gold/15 hover:bg-gold/25 text-gold text-xs transition-colors inline-flex items-center gap-1"
                            title="نسخ الدعاء"
                          >
                            {copiedSuppId === supp.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedSuppId === supp.id ? 'تم النسخ' : 'نسخ'}</span>
                          </button>
                        </div>

                        <p className="font-quran text-lg sm:text-xl text-royal dark:text-slate-100 leading-relaxed text-center py-2">
                          ﴿ {supp.arabicText} ﴾
                        </p>

                        <p className="text-[11px] text-slate-500 dark:text-slate-400 text-left" dir="ltr">
                          — {supp.hadithSource}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step Navigation Controls (Prev / Next) */}
              <div className="flex items-center justify-between pt-4 border-t border-gold/20">
                <button
                  type="button"
                  disabled={activeStepIndex === 0}
                  onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2.5 rounded-xl border border-gold/30 text-xs font-bold text-royal dark:text-slate-200 hover:bg-gold/10 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-1.5"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>المرحلة السابقة</span>
                </button>

                <span className="text-xs text-slate-400 font-mono">
                  {activeStepIndex + 1} / {currentSteps.length}
                </span>

                <button
                  type="button"
                  disabled={activeStepIndex === currentSteps.length - 1}
                  onClick={() => setActiveStepIndex((prev) => Math.min(currentSteps.length - 1, prev + 1))}
                  className="px-5 py-2.5 rounded-xl gold-gradient text-royal font-bold text-xs shadow-sm hover:scale-[1.02] disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-1.5"
                >
                  <span>المرحلة التالية</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 4. TAB 2: INTERACTIVE SVG MAP OF HOLY SITES */}
        {activeMainTab === 'map' && (
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-gold/30 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-royal dark:text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gold" />
                  <span>خريطة المشاعر المقدسة والمواقيت التفاعلية</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  انقر على أي موقع لمشاهدة تفاصيل النسك والمسافة والبيان الشرعي
                </p>
              </div>
            </div>

            {/* Interactive SVG Diagram of Holy Sites */}
            <div className="relative rounded-2xl bg-gradient-to-b from-[#072A20] to-[#041a14] border border-gold/40 p-4 sm:p-8 overflow-hidden min-h-[380px] flex items-center justify-center">
              <svg
                viewBox="0 0 900 500"
                className="w-full h-auto max-h-[500px]"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background Grid & Decorative lines */}
                <defs>
                  <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#C5A059" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#DFC082" stopOpacity="0.4" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Road between Sites */}
                <path
                  d="M 120 250 Q 280 180 420 250 T 640 250 T 820 250"
                  fill="none"
                  stroke="url(#roadGrad)"
                  strokeWidth="4"
                  strokeDasharray="6 6"
                />

                {/* 1. Al-Masjid Al-Haram (Makkah) */}
                <g
                  className="cursor-pointer transition-transform hover:scale-110"
                  onClick={() => setSelectedMapLocation('haram')}
                >
                  <circle cx="120" cy="250" r="32" fill="#072A20" stroke="#C5A059" strokeWidth="3" filter="url(#glow)" />
                  <text x="120" y="246" fill="#C5A059" fontSize="20" textAnchor="middle">🕋</text>
                  <text x="120" y="270" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">المسجد الحرام</text>
                  <text x="120" y="295" fill="#DFC082" fontSize="9" textAnchor="middle">طواف وسعي</text>
                </g>

                {/* 2. Mina (مشعر منى) */}
                <g
                  className="cursor-pointer transition-transform hover:scale-110"
                  onClick={() => setSelectedMapLocation('mina')}
                >
                  <circle cx="420" cy="250" r="28" fill="#072A20" stroke="#10B981" strokeWidth="2.5" filter="url(#glow)" />
                  <text x="420" y="246" fill="#10B981" fontSize="18" textAnchor="middle">⛺</text>
                  <text x="420" y="268" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">مشعر منى</text>
                  <text x="420" y="293" fill="#A7F3D0" fontSize="9" textAnchor="middle">التروية والجمار (7 كم)</text>
                </g>

                {/* 3. Muzdalifah (مشعر مزدلفة) */}
                <g
                  className="cursor-pointer transition-transform hover:scale-110"
                  onClick={() => setSelectedMapLocation('muzdalifah')}
                >
                  <circle cx="640" cy="250" r="26" fill="#072A20" stroke="#38BDF8" strokeWidth="2.5" filter="url(#glow)" />
                  <text x="640" y="246" fill="#38BDF8" fontSize="17" textAnchor="middle">🌙</text>
                  <text x="640" y="268" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">مزدلفة</text>
                  <text x="640" y="293" fill="#BAE6FD" fontSize="9" textAnchor="middle">المبيت وجمع الحصى</text>
                </g>

                {/* 4. Arafat (مشعر عرفات) */}
                <g
                  className="cursor-pointer transition-transform hover:scale-110"
                  onClick={() => setSelectedMapLocation('arafat')}
                >
                  <circle cx="820" cy="250" r="32" fill="#072A20" stroke="#F59E0B" strokeWidth="3" filter="url(#glow)" />
                  <text x="820" y="246" fill="#F59E0B" fontSize="20" textAnchor="middle">⛰️</text>
                  <text x="820" y="270" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">صعيد عرفات</text>
                  <text x="820" y="295" fill="#FDE68A" fontSize="9" textAnchor="middle">ركن الحج الأعظم (21 كم)</text>
                </g>

                {/* Miqat Connectors */}
                <path d="M 120 218 L 120 110" stroke="#C5A059" strokeWidth="1.5" strokeDasharray="3 3" />
                <circle cx="120" cy="100" r="14" fill="#C5A059" />
                <text x="120" y="104" fill="#072A20" fontSize="8" fontWeight="bold" textAnchor="middle">التنعيم</text>

                <path d="M 120 282 L 120 400" stroke="#C5A059" strokeWidth="1.5" strokeDasharray="3 3" />
                <circle cx="120" cy="410" r="14" fill="#C5A059" />
                <text x="120" y="414" fill="#072A20" fontSize="8" fontWeight="bold" textAnchor="middle">يلملم</text>
              </svg>
            </div>

            {/* Selected Location Info Card */}
            {selectedMapLocation && (
              <div className="p-4 rounded-2xl bg-royal/5 dark:bg-white/5 border border-gold/30 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-royal dark:text-gold">
                    {selectedMapLocation === 'haram' && 'المسجد الحرام والكعبة المشرفة (مكة المكرمة)'}
                    {selectedMapLocation === 'mina' && 'مشعر منى (موقع التروية ورمي الجمرات والمبيت)'}
                    {selectedMapLocation === 'muzdalifah' && 'مشعر مزدلفة (المشعر الحرام والمبيت ليلة النحر)'}
                    {selectedMapLocation === 'arafat' && 'صعيد عرفات المبارك (ركن الحج الأكبر يوم 9 ذو الحجة)'}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {selectedMapLocation === 'haram' && 'يبدأ منه طواف العمرة وطواف الإفاضة والوداع، والسعي بين الصفا والمروة.'}
                    {selectedMapLocation === 'mina' && 'يقيم فيه الحجاج يوم التروية وأيام التشريق لرمي الجمرات والمبيت.'}
                    {selectedMapLocation === 'muzdalifah' && 'يصل إليه الحجاج بعد غروب شمس عرفة ليجمعوا بين المغرب والعشاء ويمكثوا حتى الفجر.'}
                    {selectedMapLocation === 'arafat' && 'يقف فيه الحجاج من زوال شمس يوم 9 ذو الحجة حتى مغيبها بالتضرع والدعاء والاستغفار.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedMapLocation(null)}
                  className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  إغلاق ✕
                </button>
              </div>
            )}
          </div>
        )}

        {/* 5. TAB 3: MIQATS GUIDE */}
        {activeMainTab === 'miqats' && (
          <div className="space-y-6">
            <div className="glass-panel rounded-3xl p-6 border border-gold/30 space-y-2">
              <h2 className="text-xl font-bold text-royal dark:text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-gold" />
                <span>المواقيت المكانية الخمسة المعتمدة شرعاً</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                المواقيت التي وقتها رسول الله ﷺ لأهلها ولمن مر عليهن من غير أهلهن ممن أراد الحج أو العمرة.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {MIQAT_LOCATIONS.map((miqat) => (
                <div
                  key={miqat.id}
                  className="glass-panel rounded-2xl p-5 border border-gold/25 flex flex-col justify-between gap-4 hover:border-gold/60 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-base text-royal dark:text-gold">{miqat.nameAr}</h3>
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-gold/15 text-gold font-bold">
                        {miqat.distanceFromMakkahKm} كم عن مكة
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                      📍 الاسم المعاصر: <span className="text-royal dark:text-white font-bold">{miqat.modernName}</span>
                    </p>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {miqat.servingRegions}
                    </p>

                    <p className="text-[11px] text-slate-600 dark:text-slate-400 border-t border-gold/15 pt-2 leading-relaxed">
                      {miqat.historicalNote}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-royal/5 dark:bg-white/5 border border-gold/15 text-[11px] font-quran text-gold">
                    {miqat.hadithSource}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. TAB 4: SEARCHABLE SUPPLICATIONS COLLECTION */}
        {activeMainTab === 'supplications' && (
          <div className="space-y-6">
            <div className="glass-panel rounded-3xl p-6 border border-gold/30 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-royal dark:text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-gold" />
                    <span>موسوعة أدعية وأذكار الحج والعمرة المأثورة</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    أدعية صحيحة مخرجة من أمهات كتب الحديث لترديدها في كل منسك
                  </p>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  value={suppSearchQuery}
                  onChange={(e) => setSuppSearchQuery(e.target.value)}
                  placeholder="ابحث في الأدعية: التلبية، الطواف، الصفا والمروة، عرفة، زمزم..."
                  className="w-full pr-10 pl-4 py-2.5 rounded-2xl bg-royal/5 dark:bg-white/5 border border-gold/30 text-sm focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSupplications.map((supp) => (
                <div
                  key={supp.id}
                  className="glass-panel rounded-2xl p-5 border border-gold/25 flex flex-col justify-between gap-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/15 text-gold font-bold">
                        {supp.stepTitle}
                      </span>
                      <h3 className="font-bold text-sm text-royal dark:text-white mt-1">{supp.title}</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyText(supp.arabicText, supp.id)}
                      className="p-1.5 rounded-xl bg-gold/15 hover:bg-gold/25 text-gold text-xs transition-colors inline-flex items-center gap-1 shrink-0"
                    >
                      {copiedSuppId === supp.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSuppId === supp.id ? 'تم النسخ' : 'نسخ'}</span>
                    </button>
                  </div>

                  <p className="font-quran text-lg sm:text-xl text-royal dark:text-amber-50 leading-relaxed text-center py-2 bg-royal/[0.02] dark:bg-white/[0.02] rounded-xl border border-gold/10">
                    ﴿ {supp.arabicText} ﴾
                  </p>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 text-left" dir="ltr">
                    — {supp.hadithSource}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. TAB 5: PACKING CHECKLIST */}
        {activeMainTab === 'checklist' && (
          <div className="space-y-6">
            <div className="glass-panel rounded-3xl p-6 border border-gold/30 space-y-2">
              <h2 className="text-xl font-bold text-royal dark:text-white flex items-center gap-2">
                <ListTodo className="w-5 h-5 text-gold" />
                <span>حقيبة الحاج وقائمة التجهيز والاستعداد التفاعلية</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                قائمة تفقدية شاملة للوثائق الرسمية، الملابس، المستلزمات الطبية، والاستعداد الروحي.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {HAJJ_CHECKLIST_DATA.map((item) => {
                const isChecked = checkedChecklist.includes(item.id);

                return (
                  <div
                    key={item.id}
                    onClick={() => handleToggleChecklist(item.id)}
                    className={`cursor-pointer rounded-2xl p-4 border transition-all flex items-start gap-3 ${
                      isChecked
                        ? 'glass-panel border-emerald-500/50 bg-emerald-500/[0.04]'
                        : 'glass-panel border-gold/20 hover:border-gold/50'
                    }`}
                  >
                    <button
                      type="button"
                      className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                        isChecked ? 'text-emerald-500' : 'text-slate-400'
                      }`}
                    >
                      {isChecked ? (
                        <CheckCircle2 className="w-6 h-6 fill-emerald-500 text-white dark:text-slate-900" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4
                          className={`font-bold text-sm ${
                            isChecked ? 'line-through text-slate-400' : 'text-royal dark:text-white'
                          }`}
                        >
                          {item.title}
                        </h4>
                        {item.isEssential && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 font-bold">
                            أساسي
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 8. TAB 6: FAQS & OFFICIAL EMERGENCY SERVICES */}
        {activeMainTab === 'faqs' && (
          <div className="space-y-8">
            {/* Official Services Strip */}
            <div className="glass-panel rounded-3xl p-6 border border-gold/30 space-y-4">
              <h2 className="text-xl font-bold text-royal dark:text-white flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-gold" />
                <span>أرقام الطوارئ والخدمات الرسمية لضيوف الرحمن بالمملكة</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {OFFICIAL_SAUDI_SERVICES.map((srv, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-royal/5 dark:bg-white/5 border border-gold/20 flex flex-col justify-between gap-3"
                  >
                    <div>
                      <h4 className="font-bold text-xs text-royal dark:text-slate-200">{srv.nameAr}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{srv.description}</p>
                    </div>
                    {srv.number ? (
                      <a
                        href={`tel:${srv.number}`}
                        className="text-lg font-black font-mono text-gold hover:underline flex items-center gap-1.5"
                        dir="ltr"
                      >
                        <PhoneCall className="w-4 h-4" />
                        <span>{srv.number}</span>
                      </a>
                    ) : (
                      <a
                        href={srv.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-gold hover:underline inline-flex items-center gap-1"
                      >
                        <span>زيارة المنصة الرسمية</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Verified FAQs */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-royal dark:text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-gold" />
                <span>فتاوى وأسئلة الحج والعمرة الشائعة المعتمدة:</span>
              </h3>

              <div className="space-y-3">
                {HAJJ_UMRAH_FAQS.map((faq) => (
                  <div
                    key={faq.id}
                    className="glass-panel rounded-2xl p-5 border border-gold/25 space-y-2.5"
                  >
                    <h4 className="font-extrabold text-sm sm:text-base text-royal dark:text-gold flex items-center gap-2">
                      <span className="text-gold font-mono">؟</span>
                      <span>{faq.question}</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                      {faq.answer}
                    </p>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 border-t border-gold/15 pt-2 flex items-center gap-1.5 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                      <span>المصدر الشرعي: {faq.authoritySource}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

