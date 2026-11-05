import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  BookOpen,
  Search,
  Sparkles,
  Copy,
  Check,
  Share2,
  CheckCircle2,
  BookMarked,
  Filter,
  ShieldCheck
} from 'lucide-react';
import {
  HADITH_DATA,
  HADITH_COLLECTIONS,
  HADITH_TOPICS,
  HadithItem,
  HadithCollectionId,
  HadithTopic
} from '../data/hadithData';
import { ShareButton } from '../components/sharing/ShareButton';
import { SITE_CONFIG } from '../config/siteConfig';

export const HadithPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialHadithId = searchParams.get('hadithId');

  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedHadithId, setCopiedHadithId] = useState<string | null>(null);

  // Filtered Hadiths
  const filteredHadiths = useMemo(() => {
    return HADITH_DATA.filter((h) => {
      const matchCol =
        selectedCollection === 'all' || h.collection === selectedCollection;
      const matchTopic = selectedTopic === 'all' || h.topic === selectedTopic;
      const matchQuery =
        !searchQuery.trim() ||
        h.hadithText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.narrator.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.sourceBook.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.benefits.some((b) => b.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCol && matchTopic && matchQuery;
    });
  }, [selectedCollection, selectedTopic, searchQuery]);

  const handleCopyHadith = (h: HadithItem) => {
    const text = `عن ${h.narrator}:\n${h.hadithText}\n\n[المصدر: ${h.sourceBook} - ${h.hadithNumber} - درجة الحديث: ${h.grading}]\n\nالشرح والبيان:\n${h.explanation}\n\nالفوائد المستنبطة:\n${h.benefits.map((b) => `• ${b}`).join('\n')}\n\n— من موسوعة الحديث الشريف بمشروع مدار اليقين`;
    navigator.clipboard.writeText(text);
    setCopiedHadithId(h.id);
    setTimeout(() => setCopiedHadithId(null), 2500);
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="relative rounded-3xl p-8 sm:p-12 mb-10 overflow-hidden bg-gradient-to-br from-[#072A20] via-[#093528] to-[#041a14] border border-gold/30 shadow-2xl text-white">
        <div className="islamic-pattern absolute inset-0 opacity-15 pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-semibold mb-4">
            <Award className="w-4 h-4" />
            <span>السنة النبوية الصحيحة المطهرة</span>
          </div>
          <h1 className="font-quran text-3xl sm:text-5xl text-gold font-bold mb-4 leading-tight">
            موسوعة الحديث الشريف
          </h1>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-6">
            مكتبة جامعة لأصح الأحاديث النبوية؛ متضمنة متن الأربعين النووية للإمام النووي كاملاً مع شروحه وفوائده، ومختارات من رياض الصالحين، والدرر المخرجة من صحيحي البخاري ومسلم، مع التخريج الدقيق وبيان الأحكام الفقهية المستنبطة.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-gold" />
              الأربعون النووية كاملة بشروحها
            </span>
            <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl border border-white/10">
              <BookMarked className="w-3.5 h-3.5 text-gold" />
              مختارات رياض الصالحين
            </span>
            <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl border border-white/10">
              <Award className="w-3.5 h-3.5 text-gold" />
              متفق عليه والصحيحان
            </span>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="space-y-4 mb-8 bg-white/70 dark:bg-slate-900/70 p-5 rounded-3xl border border-gold/20 backdrop-blur-md">
        {/* Collection Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 shrink-0 ml-1">المصدر:</span>
          {HADITH_COLLECTIONS.map((col) => (
            <button
              key={col.id}
              onClick={() => setSelectedCollection(col.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                selectedCollection === col.id
                  ? 'bg-royal text-gold shadow-md dark:bg-gold dark:text-royal'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-gold/10'
              }`}
            >
              {col.label}
            </button>
          ))}
        </div>

        {/* Topic Selector + Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-xs font-bold text-slate-400 shrink-0 ml-1">الباب:</span>
            {HADITH_TOPICS.map((topic) => (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(topic.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  selectedTopic === topic.id
                    ? 'bg-gold/20 text-gold border border-gold/40 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-gold'
                }`}
              >
                {topic.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بكلمة من الحديث أو الراوي..."
              className="w-full pl-3 pr-10 py-2 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-gold"
            />
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 mb-6 px-1">
        <span>عرض {filteredHadiths.length} حديثاً مباركاً</span>
        <span className="text-gold font-semibold">تخريج وتحقيق معتمد</span>
      </div>

      {/* Hadiths Stream */}
      <div className="space-y-6">
        {filteredHadiths.map((hadith) => (
          <motion.div
            key={hadith.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-gold/25 shadow-lg relative overflow-hidden"
          >
            {/* Header Badges */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-royal/10 dark:bg-gold/15 text-royal dark:text-gold border border-gold/25">
                  {hadith.collectionNameAr} #{hadith.numberInCollection}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {hadith.topicNameAr}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  {hadith.grading}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <ShareButton
                  content={{
                    type: 'hadith',
                    title: `حديث نبوي: ${hadith.topicNameAr}`,
                    text: hadith.hadithText,
                    narrator: hadith.narrator,
                    sourceBook: hadith.sourceBook,
                    sourceNumber: hadith.hadithNumber,
                    grade: hadith.grading,
                    explanation: hadith.explanation,
                    categoryLabel: hadith.collectionNameAr,
                    canonicalUrl: `${SITE_CONFIG.productionUrl}/hadith?collection=${hadith.collection}&id=${hadith.id}`,
                  }}
                  variant="primary"
                  size="sm"
                  customLabel="مشاركة وتصدير"
                />

                <button
                  onClick={() => handleCopyHadith(hadith)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-gold/20 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-all"
                  title="نسخ الحديث والشرح"
                >
                  {copiedHadithId === hadith.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500">تم النسخ</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-gold" />
                      <span>نسخ الحديث</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Narrator */}
            <div className="text-xs text-gold font-bold mb-2">
              عن {hadith.narrator}:
            </div>

            {/* Hadith Matn */}
            <p className="font-quran text-lg sm:text-xl text-slate-900 dark:text-slate-100 leading-loose text-justify mb-5">
              {hadith.hadithText}
            </p>

            {/* Source Reference */}
            <div className="text-xs text-slate-400 mb-6 flex items-center gap-1.5">
              <BookMarked className="w-3.5 h-3.5 text-gold" />
              <span>{hadith.sourceBook} — {hadith.hadithNumber}</span>
            </div>

            {/* Explanation / Sharh */}
            <div className="p-4 sm:p-5 rounded-2xl bg-royal/5 dark:bg-white/[0.03] border-r-4 border-gold border-y border-l border-gold/15 mb-6 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
              <h4 className="font-bold text-royal dark:text-gold mb-1">
                الشرح والبيان:
              </h4>
              <p>{hadith.explanation}</p>
            </div>

            {/* Benefits */}
            {hadith.benefits.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold" />
                  <span>الفوائد والأحكام المستنبطة:</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {hadith.benefits.map((ben, bIdx) => (
                    <div
                      key={bIdx}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
                      <span>{ben}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ))}

        {filteredHadiths.length === 0 && (
          <div className="p-12 text-center text-slate-500 bg-white/40 dark:bg-slate-900/40 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
            لم يتم العثور على أحاديث مطابقة لبحثك
          </div>
        )}
      </div>
    </div>
  );
};

