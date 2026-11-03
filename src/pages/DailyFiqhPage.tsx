import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookMarked, 
  Search, 
  Scale, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  Share2, 
  HelpCircle, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Bookmark
} from 'lucide-react';
import { DAILY_FIQH_DATA } from '../data/dailyFiqhData';
import { FiqhCategory, FiqhRulingItem, FiqhRulingType } from '../types/extraModules';

export const DailyFiqhPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FiqhCategory | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>('fq-1');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('madar_saved_fiqh_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const categories: { id: FiqhCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'كافة المسائل' },
    { id: 'financial', label: 'المعاملات والتجارة المعاصرة' },
    { id: 'family', label: 'الأسرة والتربية' },
    { id: 'travel', label: 'فقه السفر والتنقل' },
    { id: 'medical', label: 'الفقه الطبي وأحكام المرضى' },
    { id: 'modern_tech', label: 'التقنية والذكاء الاصطناعي' },
    { id: 'worship_daily', label: 'نوازل العبادات والطهارة' },
  ];

  const filteredItems = useMemo(() => {
    return DAILY_FIQH_DATA.filter((item) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.title.includes(searchQuery.trim()) ||
        item.question.includes(searchQuery.trim()) ||
        item.summaryAnswer.includes(searchQuery.trim()) ||
        item.tags.some((t) => t.includes(searchQuery.trim()));

      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const toggleSave = (id: string) => {
    setSavedIds((prev) => {
      const updated = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem('madar_saved_fiqh_v1', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleCopy = async (item: FiqhRulingItem) => {
    const text = `📖 *فقه الحياة اليومية - مدار اليقين*:
❓ *المسألة*: ${item.title}
⚖️ *الحكم*: ${item.rulingLabelAr}
💡 *الخلاصة*: ${item.summaryAnswer}
📜 *المرجع الشرعي*: ${item.fatwaReference}
🔗 https://wasl-islam.fun/daily-fiqh`;

    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      // ignore
    }
  };

  const getRulingBadge = (ruling: FiqhRulingType) => {
    switch (ruling) {
      case 'wajib':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30">
            واجب شرعاً
          </span>
        );
      case 'mustahabb':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
            مستحب ومسنون
          </span>
        );
      case 'mubah':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-500/15 text-slate-700 dark:text-slate-300 border border-slate-500/30">
            مباح
          </span>
        );
      case 'permissible_with_conditions':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-500/15 text-teal-700 dark:text-teal-400 border border-teal-500/30">
            جائز بضوابط شرعية
          </span>
        );
      case 'makruh':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
            مكروه
          </span>
        );
      case 'haram':
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/15 text-red-700 dark:text-red-400 border border-red-500/30">
            محرم شرعاً
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F4] dark:bg-[#070D14] text-slate-800 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl royal-gradient p-6 sm:p-10 text-white shadow-xl border-2 border-gold/40">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-bold">
              <Scale className="w-4 h-4" />
              <span>فقه النوازل والمعاملات المعاصرة</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-gold tracking-tight">
              فقه الحياة اليومية المعاصرة
            </h1>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              دليلك الشرعي الميسر لأحكام المعاملات المالية، التقنية والذكاء الاصطناعي، الفقه الطبي، وأحكام السفر والأسرة وفق قرارات هيئة كبار العلماء ومجمع الفقه الإسلامي الدولي.
            </p>
          </div>
          <div className="absolute left-4 bottom-4 opacity-10 pointer-events-none">
            <Scale className="w-64 h-64 text-gold" />
          </div>
        </div>

        {/* Search & Categories */}
        <div className="bg-white dark:bg-[#0E1726] p-5 sm:p-6 rounded-2xl border border-gold/30 shadow-sm space-y-4">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في المسائل والفتاوى المعاصرة (مثل: تقسيط، فيزا، طائرة، بخاخ الربو، ذكاء اصطناعي)..."
              className="w-full pr-12 pl-4 py-3.5 rounded-xl bg-slate-50 dark:bg-[#090F1A] border border-slate-200 dark:border-slate-800 text-sm font-medium focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-royal text-gold border border-gold shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-gold/15'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Questions Accordion */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 px-1">
            <span>المسائل المتاحة ({filteredItems.length})</span>
            <span>المرجع: هيئة كبار العلماء والمجامع الفقهية المعتمدة</span>
          </div>

          {filteredItems.map((item) => {
            const isExpanded = expandedId === item.id;
            const isSaved = savedIds.includes(item.id);

            return (
              <motion.div
                key={item.id}
                layout
                className="bg-white dark:bg-[#0E1726] rounded-2xl border border-gold/25 hover:border-gold/50 shadow-sm transition-all overflow-hidden"
              >
                {/* Header Row */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="p-5 cursor-pointer flex items-start justify-between gap-4 select-none"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {getRulingBadge(item.ruling)}
                      <span className="text-[11px] font-bold text-slate-400">
                        {item.categoryLabelAr}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-royal dark:text-gold">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                      <strong className="text-gold">السؤال:</strong> {item.question}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pt-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSave(item.id);
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-gold hover:bg-gold/10 transition-colors"
                      title={isSaved ? 'إزالة من المحفوظات' : 'حفظ المسألة'}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-gold text-gold' : ''}`} />
                    </button>
                    <div className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Answer */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-5 pb-5 border-t border-slate-100 dark:border-slate-800 space-y-4 pt-4 text-xs sm:text-sm text-slate-700 dark:text-slate-200"
                    >
                      {/* Summary Box */}
                      <div className="p-3.5 rounded-xl bg-royal/5 dark:bg-white/5 border border-gold/30">
                        <h4 className="font-bold text-gold text-xs mb-1 flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-gold" />
                          <span>خلاصة الحكم الشرعي:</span>
                        </h4>
                        <p className="leading-relaxed font-semibold text-royal dark:text-slate-100">
                          {item.summaryAnswer}
                        </p>
                      </div>

                      {/* Detailed Evidence */}
                      <div className="space-y-2">
                        <h4 className="font-bold text-slate-900 dark:text-gold text-xs">
                          التفصيل والاستدلال:
                        </h4>
                        <p className="leading-relaxed whitespace-pre-line text-slate-600 dark:text-slate-300">
                          {item.detailedAnswer}
                        </p>
                      </div>

                      {/* Quran & Sunnah Evidences */}
                      {item.evidenceQuranSunnah.length > 0 && (
                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#090F1A] border border-slate-200 dark:border-slate-800 space-y-2">
                          <h4 className="font-bold text-gold text-xs flex items-center gap-1.5">
                            <BookMarked className="w-3.5 h-3.5 text-gold" />
                            <span>الأدلة من القرآن والسنة:</span>
                          </h4>
                          <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                            {item.evidenceQuranSunnah.map((ev, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-gold font-bold">•</span>
                                <span>{ev}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Conditions / Guidelines */}
                      {item.conditionsOrGuidelines && item.conditionsOrGuidelines.length > 0 && (
                        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 space-y-1.5">
                          <h4 className="font-bold text-emerald-800 dark:text-emerald-400 text-xs">
                            الضوابط والشروط الشرعية:
                          </h4>
                          <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-200">
                            {item.conditionsOrGuidelines.map((cond, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="text-emerald-600 font-bold">✓</span>
                                <span>{cond}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Fatwa Reference & Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                        <span className="text-slate-500">
                          المرجع: <strong className="text-royal dark:text-slate-300">{item.fatwaReference}</strong>
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleCopy(item)}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-gold/20 text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1.5 transition-colors"
                          >
                            {copiedId === item.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-600">تم النسخ</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>مشاركة المسألة</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
