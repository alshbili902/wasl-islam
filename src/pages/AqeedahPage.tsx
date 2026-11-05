import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Search,
  Sparkles,
  BookOpen,
  HelpCircle,
  AlertTriangle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Award,
  ShieldCheck
} from 'lucide-react';
import {
  ASMA_ALLAH_LIST,
  AQEEDAH_ARTICLES,
  AQEEDAH_QA_LIST,
  AQEEDAH_SECTIONS,
  AsmaAllahItem,
  AqeedahArticle,
  AqeedahQA
} from '../data/aqeedahData';
import { PageWrapper } from '../components/layout/PageWrapper';

export const AqeedahPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') || 'tawheed';

  const [activeTab, setActiveTab] = useState<string>(tabParam);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedQaLevel, setSelectedQaLevel] = useState<string>('all');
  const [expandedQaId, setExpandedQaId] = useState<string | null>(null);
  const [copiedItemId, setCopiedItemId] = useState<string | null>(null);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  // Filtered Asma Allah
  const filteredAsma = useMemo(() => {
    if (!searchQuery.trim()) return ASMA_ALLAH_LIST;
    return ASMA_ALLAH_LIST.filter(
      (a) =>
        a.name.includes(searchQuery) ||
        a.meaning.includes(searchQuery) ||
        a.impactOnBeliever.includes(searchQuery)
    );
  }, [searchQuery]);

  // Filtered QA
  const filteredQA = useMemo(() => {
    return AQEEDAH_QA_LIST.filter((qa) => {
      const matchLevel =
        selectedQaLevel === 'all' || qa.level === selectedQaLevel;
      const matchQuery =
        !searchQuery.trim() ||
        qa.question.includes(searchQuery) ||
        qa.answer.includes(searchQuery) ||
        qa.topicTag.includes(searchQuery);
      return matchLevel && matchQuery;
    });
  }, [selectedQaLevel, searchQuery]);

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(
      `${text}\n\n— من موسوعة العقيدة الإسلامية بمشروع مدار اليقين`
    );
    setCopiedItemId(id);
    setTimeout(() => setCopiedItemId(null), 2000);
  };

  return (
    <PageWrapper
      title="موسوعة العقيدة الإسلامية وأصول الإيمان وأسماء الله الحسنى"
      description="تأصيل علمي محكم لأقسام التوحيد الثلاثة، وأركان الإيمان الستة، والأسماء الحسنى ومعانيها وفق منهج أهل السنة والجماعة وهيئة كبار العلماء."
      canonicalPath="/aqeedah"
      breadcrumbs={[
        { name: 'الرئيسية', url: '/' },
        { name: 'أصول العقيدة', url: '/aqeedah' },
      ]}
      schemaType="CollectionPage"
    >
      <div className="py-2 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="relative rounded-3xl p-8 sm:p-12 mb-10 overflow-hidden bg-gradient-to-br from-[#072A20] via-[#093528] to-[#041a14] border border-gold/30 shadow-2xl text-white">
        <div className="islamic-pattern absolute inset-0 opacity-15 pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-semibold mb-4">
            <Shield className="w-4 h-4" />
            <span>عقيدة أهل السنة والجماعة الصافية</span>
          </div>
          <h1 className="font-quran text-3xl sm:text-5xl text-gold font-bold mb-4 leading-tight">
            موسوعة العقيدة الإسلامية
          </h1>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-6">
            تأصيل علمي محكم لقضايا الإيمان الكبرى؛ من أقسام التوحيد الثلاثة (الربوبية، الألوهية، الأسماء والصفات)، وأركان الإيمان الستة، والأسماء الحسنى ومعانيها، وضوابط التكفير والنواقض وفق منهج هيئة كبار العلماء، وبنك الأسئلة الإيمانية.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-gold" />
              المنهج الوسطي المعتمد
            </span>
            <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              فهرس أسماء الله الحسنى ومعانيها
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-8 bg-white/70 dark:bg-slate-900/70 p-3 rounded-2xl border border-gold/20 backdrop-blur-md">
        {AQEEDAH_SECTIONS.map((sec) => (
          <button
            key={sec.id}
            onClick={() => handleTabChange(sec.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === sec.id
                ? 'bg-royal text-gold shadow-md dark:bg-gold dark:text-royal'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-gold/10'
            }`}
          >
            {sec.label}
          </button>
        ))}
      </div>

      {/* ================= TAB CONTENT ================= */}

      {/* 1. Tawheed & Articles Tab */}
      {(activeTab === 'all' || activeTab === 'tawheed' || activeTab === 'iman_pillars' || activeTab === 'nawaqid') && (
        <div className="space-y-6 mb-12">
          {AQEEDAH_ARTICLES.filter(
            (art) =>
              activeTab === 'all' ||
              (activeTab === 'tawheed' && art.section === 'tawheed') ||
              (activeTab === 'iman_pillars' && art.section === 'iman_pillars') ||
              (activeTab === 'nawaqid' && art.section === 'nawaqid')
          ).map((article) => (
            <div
              key={article.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-gold/20 shadow-md space-y-5"
            >
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-royal/10 dark:bg-gold/15 text-royal dark:text-gold border border-gold/25">
                  {article.sectionTitleAr}
                </span>

                <button
                  onClick={() =>
                    handleCopyText(
                      article.id,
                      `${article.title}\n\n${article.summary}\n\n${article.content.join('\n\n')}`
                    )
                  }
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-gold/20 text-slate-500 hover:text-gold transition-colors text-xs flex items-center gap-1"
                >
                  {copiedItemId === article.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold font-quran text-slate-900 dark:text-slate-100">
                {article.title}
              </h2>

              <p className="p-4 rounded-2xl bg-amber-500/5 dark:bg-gold/5 border border-gold/20 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                {article.summary}
              </p>

              <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
                {article.content.map((p, pIdx) => (
                  <p key={pIdx} className="indent-3">
                    {p}
                  </p>
                ))}
              </div>

              {/* Proofs */}
              {article.proofs.length > 0 && (
                <div className="pt-2">
                  <h4 className="text-xs font-bold text-royal dark:text-gold mb-2">
                    الأدلة الصريحة من الكتاب والسنة:
                  </h4>
                  <div className="space-y-2">
                    {article.proofs.map((prf, prfIdx) => (
                      <div
                        key={prfIdx}
                        className="p-3.5 rounded-xl bg-[#072A20]/5 dark:bg-white/[0.03] border-r-4 border-gold border-y border-l border-gold/15"
                      >
                        <p className="font-quran text-sm sm:text-base text-slate-900 dark:text-slate-100 mb-1 leading-relaxed">
                          {prf.text}
                        </p>
                        <span className="text-[11px] font-bold text-gold">
                          [{prf.source}]
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Principles */}
              {article.keyPrinciples.length > 0 && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    القواعد والضوابط الكبرى:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
                    {article.keyPrinciples.map((prin, prIdx) => (
                      <div key={prIdx} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
                        <span>{prin}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 2. Names of Allah (أسماء الله الحسنى) */}
      {(activeTab === 'all' || activeTab === 'names_of_allah') && (
        <div className="space-y-6 mb-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/70 dark:bg-slate-900/70 p-4 rounded-2xl border border-gold/20">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold" />
                <span>فهرس أسماء الله الحسنى ومعانيها</span>
              </h3>
              <p className="text-xs text-slate-500">
                قال رسول الله ﷺ: «إن لله تسعة وتسعين اسماً، مائة إلا واحداً، من أحصاها دخل الجنة»
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في الأسماء والمعاني..."
                className="w-full pl-3 pr-9 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAsma.map((asma) => (
              <div
                key={asma.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-gold/20 shadow-md hover:border-gold/40 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-full bg-gold/15 text-gold text-xs font-bold flex items-center justify-center border border-gold/30">
                    {asma.id}
                  </span>
                  <span className="font-quran text-2xl text-royal dark:text-gold font-bold">
                    {asma.name}
                  </span>
                </div>

                <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
                  <strong className="text-royal dark:text-gold">المعنى:</strong> {asma.meaning}
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed border border-slate-100 dark:border-slate-800">
                  <strong className="text-slate-700 dark:text-slate-300 block mb-1">
                    أثر الإيمان به في قلب وسلوك المؤمن:
                  </strong>
                  {asma.impactOnBeliever}
                </div>

                <div className="text-[10px] text-gold font-quran text-left border-t border-slate-100 dark:border-slate-800 pt-2">
                  {asma.quranReference}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Questions & Answers (بنك الأسئلة والفتاوى العقدية) */}
      {(activeTab === 'all' || activeTab === 'qa') && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/70 dark:bg-slate-900/70 p-4 rounded-2xl border border-gold/20">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-gold" />
                <span>بنك الأسئلة والفتاوى العقدية المحررة</span>
              </h3>
              <p className="text-xs text-slate-500">
                إجابات موثقة على أهم الإشكالات والقضايا الإيمانية المعاصرة
              </p>
            </div>

            {/* Level Selector */}
            <div className="flex items-center gap-1.5 text-xs">
              <button
                onClick={() => setSelectedQaLevel('all')}
                className={`px-3 py-1 rounded-lg ${
                  selectedQaLevel === 'all'
                    ? 'bg-gold text-royal font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                الكل
              </button>
              <button
                onClick={() => setSelectedQaLevel('beginner')}
                className={`px-3 py-1 rounded-lg ${
                  selectedQaLevel === 'beginner'
                    ? 'bg-gold text-royal font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                مبتدئ
              </button>
              <button
                onClick={() => setSelectedQaLevel('intermediate')}
                className={`px-3 py-1 rounded-lg ${
                  selectedQaLevel === 'intermediate'
                    ? 'bg-gold text-royal font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                متوسط
              </button>
              <button
                onClick={() => setSelectedQaLevel('advanced')}
                className={`px-3 py-1 rounded-lg ${
                  selectedQaLevel === 'advanced'
                    ? 'bg-gold text-royal font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                متقدم
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredQA.map((qa) => {
              const isExpanded = expandedQaId === qa.id;
              return (
                <div
                  key={qa.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-gold/20 shadow-md overflow-hidden"
                >
                  <div
                    onClick={() => setExpandedQaId(isExpanded ? null : qa.id)}
                    className="p-5 cursor-pointer flex items-center justify-between gap-4 hover:bg-gold/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] bg-royal/10 dark:bg-gold/15 text-royal dark:text-gold border border-gold/25 font-bold shrink-0">
                        {qa.levelAr}
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                        {qa.question}
                      </h4>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gold shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800 space-y-3"
                      >
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
                          <strong className="text-royal dark:text-gold block mb-1">
                            الجواب الشرعي المحرر:
                          </strong>
                          {qa.answer}
                        </div>

                        <div className="text-xs text-slate-500 flex items-start gap-1.5 pt-1">
                          <strong className="text-gold shrink-0">الدليل:</strong>
                          <span>{qa.evidence}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
    </PageWrapper>
  );
};

