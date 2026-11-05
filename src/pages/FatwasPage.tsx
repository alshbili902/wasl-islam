import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Search,
  ExternalLink,
  Copy,
  Check,
  BookMarked,
  Tag,
  AlertCircle,
  HelpCircle,
  Award
} from 'lucide-react';
import {
  VERIFIED_FATWAS,
  FATWA_CATEGORIES,
  VerifiedFatwaItem,
  FatwaCategoryId
} from '../data/fatwasData';
import { PageWrapper } from '../components/layout/PageWrapper';

export const FatwasPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const catParam = (searchParams.get('category') as FatwaCategoryId) || 'all';

  const [selectedCategory, setSelectedCategory] = useState<string>(catParam);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedFatwaId, setCopiedFatwaId] = useState<string | null>(null);

  // Filtered fatwas
  const filteredFatwas = useMemo(() => {
    return VERIFIED_FATWAS.filter((f) => {
      const matchCat =
        selectedCategory === 'all' || f.category === selectedCategory;
      const matchQuery =
        !searchQuery.trim() ||
        f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.scholarOrCommittee.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  const handleCopyFatwa = (f: VerifiedFatwaItem) => {
    const text = `عنوان الفتوى: ${f.title}\n\nالسؤال:\n${f.question}\n\nالجواب:\n${f.answer}\n\nالمفتي / الجهة: ${f.scholarOrCommittee}\nالمصدر المعتمد: ${f.sourceReference}\nالرابط المرجعي: ${f.officialUrl}\n\n— من موسوعة الفتاوى الإسلامية الموثقة بمشروع مدار اليقين`;
    navigator.clipboard.writeText(text);
    setCopiedFatwaId(f.id);
    setTimeout(() => setCopiedFatwaId(null), 2500);
  };

  return (
    <PageWrapper
      title="دليل الفتاوى الشرعية والقرارات الفقهية الرسمية المعتمدة"
      description="مرجع رسمي موثق لأحكام وفتاوى اللجنة الدائمة للبحوث العلمية والإفتاء، وهيئة كبار العلماء، وسماحة الشيخ ابن باز والشيخ ابن عثيمين رحمهما الله."
      canonicalPath="/fatwas"
      breadcrumbs={[
        { name: 'الرئيسية', url: '/' },
        { name: 'الفتاوى الشرعية', url: '/fatwas' },
      ]}
      schemaType="CollectionPage"
    >
      <div className="py-2 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="relative rounded-3xl p-8 sm:p-12 mb-8 overflow-hidden bg-gradient-to-br from-[#072A20] via-[#093528] to-[#041a14] border border-gold/30 shadow-2xl text-white">
        <div className="islamic-pattern absolute inset-0 opacity-15 pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-semibold mb-4">
            <ShieldCheck className="w-4 h-4" />
            <span>الفتاوى الشرعية الرسمية الموثقة</span>
          </div>
          <h1 className="font-quran text-3xl sm:text-5xl text-gold font-bold mb-4 leading-tight">
            موسوعة الفتاوى الإسلامية
          </h1>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-6">
            مرجع رسمي موثق لأحكام وفتاوى كبار العلماء في المملكة العربية السعودية: الرئاسة العامة للبحوث العلمية والإفتاء، وهيئة كبار العلماء، واللجنة الدائمة، وسماحة الشيخ عبد العزيز بن باز والشيخ محمد بن عثيمين رحمهما الله.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl border border-white/10">
              <BookMarked className="w-3.5 h-3.5 text-gold" />
              أرقام ومجلدات الفتاوى الأصلية
            </span>
            <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl border border-white/10">
              <Award className="w-3.5 h-3.5 text-gold" />
              روابط للتحقق من المصدر الرسمي
            </span>
          </div>
        </div>
      </div>

      {/* Prominent Official Disclaimer Box */}
      <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-amber-500/10 dark:bg-gold/10 border-2 border-gold/40 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-gold shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
          <strong className="text-royal dark:text-gold block mb-1">
            تنبيه شرعي ومسؤولية علمية:
          </strong>
          هذه الموسوعة هي أرشيف توثيقي للقرارات والفتاوى المعتمدة الصادرة عن هيئة كبار العلماء والرئاسة العامة للإفتاء في المملكة العربية السعودية، وليست بأي حال نظاماً لتوليد أو ابتكار الفتاوى بالذكاء الاصطناعي. لطلب فتوى جديدة خاصة بنازلتك، يرجى التوجه مباشرة إلى البوابة الرسمية للرئاسة العامة للإفتاء:{' '}
          <a
            href="https://alifta.gov.sa"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold font-bold underline inline-flex items-center gap-1 hover:text-royal dark:hover:text-white"
          >
            <span>alifta.gov.sa</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white/70 dark:bg-slate-900/70 p-4 rounded-2xl border border-gold/20 backdrop-blur-md">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {FATWA_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setSearchParams({ category: cat.id });
              }}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-royal text-gold shadow-md dark:bg-gold dark:text-royal'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-gold/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في نص السؤال أو المسألة..."
            className="w-full pl-3 pr-10 py-2 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-gold"
          />
        </div>
      </div>

      {/* Fatwa Cards List */}
      <div className="space-y-6">
        {filteredFatwas.map((fatwa) => (
          <motion.div
            key={fatwa.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-gold/20 shadow-md hover:border-gold/40 transition-all space-y-5"
          >
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-royal/10 dark:bg-gold/15 text-royal dark:text-gold border border-gold/25">
                  {fatwa.categoryNameAr}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                  المفتي: {fatwa.scholarOrCommittee}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={fatwa.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-gold/20 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-all"
                  title="التحقق من المصدر الرسمي"
                >
                  <span>المصدر الأصلي</span>
                  <ExternalLink className="w-3 h-3 text-gold" />
                </a>

                <button
                  onClick={() => handleCopyFatwa(fatwa)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-gold/20 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-all"
                  title="نسخ الفتوى"
                >
                  {copiedFatwaId === fatwa.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500">تم</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-gold" />
                      <span>نسخ</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Fatwa Title */}
            <h3 className="text-lg sm:text-xl font-bold font-quran text-slate-900 dark:text-slate-100">
              {fatwa.title}
            </h3>

            {/* Question */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
              <strong className="text-royal dark:text-gold block mb-1">
                نص السؤال:
              </strong>
              {fatwa.question}
            </div>

            {/* Answer */}
            <div className="p-5 rounded-2xl bg-royal/5 dark:bg-white/[0.03] border-r-4 border-gold border-y border-l border-gold/20 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
              <strong className="text-royal dark:text-gold block mb-1.5">
                الجواب الشرعي المعتمد:
              </strong>
              {fatwa.answer}
            </div>

            {/* Footer Reference & Tags */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <BookMarked className="w-3.5 h-3.5 text-gold" />
                <span>المرجع: {fatwa.sourceReference}</span>
              </div>

              {fatwa.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <Tag className="w-3 h-3 text-gold" />
                  {fatwa.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {filteredFatwas.length === 0 && (
          <div className="p-12 text-center text-slate-500 bg-white/40 dark:bg-slate-900/40 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
            لم يتم العثور على فتاوى مطابقة لبحثك
          </div>
        )}
      </div>
    </div>
    </PageWrapper>
  );
};

