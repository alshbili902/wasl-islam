import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HeartHandshake, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  AlertTriangle, 
  BookOpen, 
  Copy, 
  Check, 
  HelpCircle,
  Sparkles,
  Info
} from 'lucide-react';
import { JANAZAH_STEPS, JANAZAH_FAQS } from '../data/janazahData';
import { JanazahStepId } from '../types/extraModules';

export const JanazahGuidePage: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [copiedDua, setCopiedDua] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const currentStep = JANAZAH_STEPS[activeStepIndex];

  const handleCopyText = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedDua(id);
      setTimeout(() => setCopiedDua(null), 2500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F4] dark:bg-[#070D14] text-slate-800 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl royal-gradient p-6 sm:p-10 text-white shadow-xl border-2 border-gold/40">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-bold">
              <HeartHandshake className="w-4 h-4" />
              <span>دليل فقهي وتطبيقي شامل وفق الهدي النبوي</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-gold tracking-tight">
              دليل الجنائز وحقوق الميت والتعزية
            </h1>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              تعرف على صفة تغسيل الميت وتكفينه، وأركان صلاة الجنازة بتكبيراتها الأربع وأدعيتها المأثورة، وآداب الدفن والتعزية المشروعة مع التحذير من البدع والمحدثات.
            </p>
          </div>
          <div className="absolute left-4 bottom-4 opacity-10 pointer-events-none">
            <HeartHandshake className="w-64 h-64 text-gold" />
          </div>
        </div>

        {/* Step Progression Bar */}
        <div className="bg-white dark:bg-[#0E1726] p-3 sm:p-4 rounded-2xl border border-gold/30 shadow-sm overflow-x-auto">
          <div className="flex items-center justify-between min-w-[600px] gap-2">
            {JANAZAH_STEPS.map((step, idx) => {
              const isActive = idx === activeStepIndex;
              const isPast = idx < activeStepIndex;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveStepIndex(idx)}
                  className={`flex-1 flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${
                    isActive
                      ? 'bg-royal text-gold shadow-sm border border-gold font-bold'
                      : isPast
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      isActive
                        ? 'gold-gradient text-royal'
                        : isPast
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span className="text-[11px] truncate max-w-[90px]">{step.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          key={currentStep.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-white dark:bg-[#0E1726] rounded-3xl p-6 sm:p-8 border border-gold/30 shadow-sm space-y-6"
        >
          {/* Header of Step */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gold/20 pb-4">
            <div>
              <div className="flex items-center gap-2 text-gold text-xs font-bold mb-1">
                <span>المرحلة {currentStep.order} من {JANAZAH_STEPS.length}</span>
                <span>•</span>
                <span>{currentStep.subtitle}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-royal dark:text-gold">
                {currentStep.title}
              </h2>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                disabled={activeStepIndex === 0}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold disabled:opacity-30 flex items-center gap-1 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <ChevronRight className="w-4 h-4" />
                <span>السابق</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveStepIndex((prev) => Math.min(JANAZAH_STEPS.length - 1, prev + 1))}
                disabled={activeStepIndex === JANAZAH_STEPS.length - 1}
                className="px-3.5 py-2 rounded-xl gold-gradient text-royal text-xs font-bold disabled:opacity-30 flex items-center gap-1 shadow-sm"
              >
                <span>التالي</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {currentStep.description}
          </p>

          {/* Rulings Checklist */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-royal dark:text-gold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>الأحكام والواجبات الشرعية في هذه المرحلة:</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {currentStep.rulings.map((ruling, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-[#090F1A] border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 font-bold text-[10px]">
                    ✓
                  </span>
                  <span className="leading-relaxed">{ruling}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Duas Section if present */}
          {currentStep.duasForStep && currentStep.duasForStep.length > 0 && (
            <div className="p-5 rounded-2xl bg-royal/5 dark:bg-white/5 border-2 border-gold/40 space-y-4">
              <h3 className="font-bold text-sm text-gold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold" />
                <span>الأدعية المأثورة الصحيحة لهذه المرحلة:</span>
              </h3>
              <div className="space-y-3">
                {currentStep.duasForStep.map((dua, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-white dark:bg-[#080E18] border border-gold/30 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-royal dark:text-gold">{dua.title}</span>
                      {dua.repeat && (
                        <span className="text-[11px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                          {dua.repeat}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-royal dark:text-slate-100 leading-loose py-1 font-serif text-justify" dir="rtl">
                      {dua.arabicText}
                    </p>
                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => handleCopyText(dua.arabicText, `dua-${i}`)}
                        className="text-xs font-bold text-gold hover:underline flex items-center gap-1"
                      >
                        {copiedDua === `dua-${i}` ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600">تم النسخ</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>نسخ الدعاء</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hadith Evidences */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-2">
            <h3 className="font-bold text-xs text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>الأحاديث النبوية المسندة:</span>
            </h3>
            <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {currentStep.hadithEvidences.map((h, i) => (
                <div key={i} className="space-y-1">
                  <p className="font-semibold italic">«{h.hadith}»</p>
                  <p className="text-[11px] text-slate-500">المصدر: {h.source}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mistakes and Innovations to Avoid */}
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/25 space-y-2">
            <h3 className="font-bold text-xs text-red-800 dark:text-red-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>أخطاء وبدع شائعة يجب تجنبها:</span>
            </h3>
            <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
              {currentStep.commonMistakesOrBidah.map((mistake, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-red-500 font-bold">✗</span>
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* FAQs Section */}
        <div className="bg-white dark:bg-[#0E1726] rounded-3xl p-6 sm:p-8 border border-gold/30 shadow-sm space-y-4">
          <h3 className="font-bold text-base sm:text-lg text-royal dark:text-gold flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-gold" />
            <span>الأسئلة الفقهية الشائعة في أحكام الجنائز</span>
          </h3>

          <div className="space-y-3">
            {JANAZAH_FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-right flex items-center justify-between gap-3 bg-slate-50 dark:bg-[#0A101C] hover:bg-gold/10 transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-bold text-royal dark:text-slate-200">
                      {faq.question}
                    </span>
                    <span className="text-gold font-bold text-sm">{isOpen ? '−' : '+'}</span>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2 border-t border-slate-200 dark:border-slate-800"
                      >
                        <p className="leading-relaxed">{faq.answer}</p>
                        <p className="text-[11px] text-slate-400">المرجع: {faq.source}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
