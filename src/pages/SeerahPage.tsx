import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  MapPin,
  Calendar,
  BookOpen,
  Sparkles,
  Search,
  CheckCircle2,
  ChevronDown,
  Share2,
  Copy,
  Check,
  Award,
  Milestone,
  ArrowRight,
  BookMarked
} from 'lucide-react';
import {
  SEERAH_MILESTONES,
  SEERAH_PHASES,
  SeerahMilestone
} from '../data/seerahData';
import { PageWrapper } from '../components/layout/PageWrapper';
import { useShare } from '../context/ShareContext';
import { copyTextToClipboard } from '../services/shareService';
import { SITE_CONFIG } from '../config/siteConfig';

export const SeerahPage: React.FC = () => {
  const { openShare } = useShare();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialMilestoneId = searchParams.get('milestone');

  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeMilestoneId, setActiveMilestoneId] = useState<string>(
    initialMilestoneId || SEERAH_MILESTONES[0].id
  );
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [sharedText, setSharedText] = useState<boolean>(false);

  // Filtered milestones
  const filteredMilestones = useMemo(() => {
    return SEERAH_MILESTONES.filter((item) => {
      const matchPhase =
        selectedPhase === 'all' || item.phase === selectedPhase;
      const matchQuery =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.narrative.some((n) =>
          n.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchPhase && matchQuery;
    });
  }, [selectedPhase, searchQuery]);

  const activeMilestone = useMemo(() => {
    return (
      SEERAH_MILESTONES.find((m) => m.id === activeMilestoneId) ||
      SEERAH_MILESTONES[0]
    );
  }, [activeMilestoneId]);

  const handleSelectMilestone = (id: string) => {
    setActiveMilestoneId(id);
    setSearchParams({ milestone: id });
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const handleCopyNarrative = async () => {
    const text = `${activeMilestone.title}\n${activeMilestone.period} (${activeMilestone.yearApprox})\n\n${activeMilestone.narrative.join('\n\n')}\n\nعبر ودروس:\n${activeMilestone.lessons.map((l) => `• ${l}`).join('\n')}\n\n— من موسوعة السيرة النبوية بمشروع مدار اليقين (${SITE_CONFIG.productionUrl}/seerah?milestone=${activeMilestone.id})`;
    const ok = await copyTextToClipboard(text);
    if (ok) {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    }
  };

  const handleShareNarrative = async () => {
    const res = await openShare({
      type: 'article',
      title: `${activeMilestone.title} — السيرة النبوية الشريفة`,
      text: `${activeMilestone.summary}\n\n${activeMilestone.narrative[0] || ''}`,
      source: `المحطة ${activeMilestone.order}: ${activeMilestone.period} (${activeMilestone.yearApprox})`,
      categoryLabel: 'موسوعة السيرة النبوية الشريفة',
      canonicalUrl: `${SITE_CONFIG.productionUrl}/seerah?milestone=${activeMilestone.id}`,
    });
    if (res.status === 'shared') {
      setSharedText(true);
      setTimeout(() => setSharedText(false), 2200);
    }
  };

  return (
    <PageWrapper
      title={activeMilestone ? `${activeMilestone.title} | السيرة النبوية الشريفة` : 'السيرة النبوية الشريفة والخط الزمني الموثق'}
      description={activeMilestone ? `${activeMilestone.title} (${activeMilestone.period}) - ${activeMilestone.narrative[0]?.substring(0, 150)}...` : 'رحلة موثقة في سيرة النبي محمد ﷺ؛ محطات العهد المكي والمدني، الغزوات والعهود، والأخلاق والشمائل النبوية الشريفة.'}
      canonicalPath="/seerah"
      breadcrumbs={[
        { name: 'الرئيسية', url: '/' },
        { name: 'السيرة النبوية', url: '/seerah' },
        ...(activeMilestone ? [{ name: activeMilestone.title, url: '/seerah' }] : []),
      ]}
      schemaType="Article"
    >
      <div className="py-2 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="relative rounded-3xl p-8 sm:p-12 mb-10 overflow-hidden bg-gradient-to-br from-[#072A20] via-[#093528] to-[#041a14] border border-gold/30 shadow-2xl text-white">
        <div className="islamic-pattern absolute inset-0 opacity-15 pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            <span>الموسوعة النبوية الموثقة</span>
          </div>
          <h1 className="font-quran text-3xl sm:text-5xl text-gold font-bold mb-4 leading-tight">
            السيرة النبوية الشريفة
          </h1>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-6">
            رحلة إيمانية موثقة تستعرض محطات حياة خاتم الأنبياء والمرسلين محمد ﷺ، من مولده الشريف في مكة ونشأته بالحق، إلى هجرته وتأسيس الدولة الإسلامية وفتوحاته ووفاته، مع الآيات القرآنية والأحاديث الصحيحة والعبر التربوية.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl border border-white/10">
              <BookMarked className="w-3.5 h-3.5 text-gold" />
              13 محطة تاريخية كبرى
            </span>
            <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl border border-white/10">
              <Compass className="w-3.5 h-3.5 text-gold" />
              خرائط ومعالم جغرافية موثقة
            </span>
            <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl border border-white/10">
              <Award className="w-3.5 h-3.5 text-gold" />
              تخريج معتمد من الصحيحين
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white/70 dark:bg-slate-900/70 p-4 rounded-2xl border border-gold/20 backdrop-blur-md">
        {/* Phase Chips */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {SEERAH_PHASES.map((phase) => (
            <button
              key={phase.id}
              onClick={() => setSelectedPhase(phase.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                selectedPhase === phase.id
                  ? 'bg-royal text-gold shadow-md shadow-royal/30 dark:bg-gold dark:text-royal'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-gold/10'
              }`}
            >
              {phase.label}
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
            placeholder="بحث في محطات السيرة والعبر..."
            className="w-full pl-4 pr-10 py-2 rounded-xl text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-gold"
          />
        </div>
      </div>

      {/* Main Layout: Timeline Sidebar + Detailed Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left / Navigation List (4 cols) */}
        <div className="lg:col-span-4 space-y-3 max-h-[800px] overflow-y-auto pr-1">
          <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center justify-between">
            <span>الخط الزمني للمحطات ({filteredMilestones.length})</span>
            <span className="text-xs text-gold font-normal">اختر لقراءة التفاصيل</span>
          </h2>

          {filteredMilestones.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500 bg-white/40 dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
              لا توجد نتائج مطابقة لبحثك
            </div>
          ) : (
            filteredMilestones.map((m) => {
              const isActive = m.id === activeMilestone.id;
              return (
                <div
                  key={m.id}
                  onClick={() => handleSelectMilestone(m.id)}
                  className={`cursor-pointer p-4 rounded-2xl transition-all border text-right relative overflow-hidden ${
                    isActive
                      ? 'bg-gradient-to-r from-royal/10 via-royal/5 to-transparent dark:from-gold/15 dark:via-gold/5 dark:to-transparent border-gold shadow-lg shadow-gold/5'
                      : 'bg-white dark:bg-slate-900 hover:bg-gold/5 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {isActive && (
                    <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-gold" />
                  )}
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-bold text-gold flex items-center gap-1">
                      <Milestone className="w-3.5 h-3.5" />
                      المحطة {m.order}
                    </span>
                    <span>{m.period}</span>
                  </div>
                  <h3
                    className={`font-bold text-sm leading-snug mb-1.5 ${
                      isActive ? 'text-royal dark:text-gold' : 'text-slate-800 dark:text-slate-100'
                    }`}
                  >
                    {m.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {m.summary}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Right / Detailed Reader (8 cols) */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMilestone.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-gold/25 shadow-xl relative"
            >
              {/* Header Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800 mb-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-gold mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-gold/15 border border-gold/30">
                      المحطة النبوية #{activeMilestone.order}
                    </span>
                    <span>• {activeMilestone.period}</span>
                    <span>({activeMilestone.yearApprox})</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-quran text-slate-900 dark:text-slate-100">
                    {activeMilestone.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShareNarrative}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gold/15 hover:bg-gold/25 text-royal dark:text-gold border border-gold/30 transition-all"
                    title="مشاركة المحطة"
                  >
                    {sharedText ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-500">تمت المشاركة</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5 text-gold" />
                        <span>مشاركة</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCopyNarrative}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-royal/5 dark:bg-white/5 hover:bg-gold/20 text-slate-700 dark:text-slate-300 border border-gold/20 transition-all"
                    title="نسخ المحطة"
                  >
                    {copiedText ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-500">تم النسخ</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-gold" />
                        <span>نسخ النص</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Summary Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/5 dark:bg-gold/5 border border-gold/25 text-slate-800 dark:text-slate-200 text-sm leading-relaxed mb-6 font-medium">
                {activeMilestone.summary}
              </div>

              {/* Detailed Narrative */}
              <div className="space-y-4 mb-8">
                <h3 className="text-base font-bold text-royal dark:text-gold flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>السياق التاريخي والرواية المعتمدة</span>
                </h3>
                <div className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                  {activeMilestone.narrative.map((para, idx) => (
                    <p key={idx} className="indent-4 text-justify">
                      {para}
                    </p>
                  ))}
                </div>
              </div>

              {/* Key Verses */}
              {activeMilestone.keyVerses.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-base font-bold text-royal dark:text-gold flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4" />
                    <span>آيات قرآنية نزلت في هذه المناسبة</span>
                  </h3>
                  <div className="space-y-3">
                    {activeMilestone.keyVerses.map((v, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl bg-[#072A20]/5 dark:bg-white/[0.03] border-r-4 border-gold border-y border-l border-gold/15"
                      >
                        <p className="font-quran text-base sm:text-lg text-slate-900 dark:text-slate-100 mb-2 leading-loose text-center">
                          {v.text}
                        </p>
                        <div className="text-left text-xs font-bold text-gold">
                          [سورة {v.surah}: الآية {v.ayah}]
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Authentic Hadiths */}
              {activeMilestone.hadiths.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-base font-bold text-royal dark:text-gold flex items-center gap-2 mb-3">
                    <Award className="w-4 h-4" />
                    <span>أحاديث نبوية صحيحة مرتبطة بالمحطة</span>
                  </h3>
                  <div className="space-y-3">
                    {activeMilestone.hadiths.map((h, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
                      >
                        <p className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100 mb-2 leading-relaxed">
                          {h.text}
                        </p>
                        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
                          <span>الراوي: {h.narrator}</span>
                          <span className="font-bold text-gold">{h.source}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Educational Lessons */}
              {activeMilestone.lessons.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-base font-bold text-royal dark:text-gold flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>الدروس والعبر التربوية والدعوية</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeMilestone.lessons.map((lesson, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-royal/5 dark:bg-white/[0.03] border border-gold/15 flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300"
                      >
                        <span className="w-2 h-2 rounded-full bg-gold shrink-0 mt-1.5" />
                        <span>{lesson}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Geographic Locations */}
              {activeMilestone.locations.length > 0 && (
                <div>
                  <h3 className="text-base font-bold text-royal dark:text-gold flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>المعالم الجغرافية والأماكن التاريخية</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeMilestone.locations.map((loc, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1"
                      >
                        <div className="text-sm font-bold text-royal dark:text-gold">
                          {loc.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gold" />
                          <span>{loc.modernLocation}</span>
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-300 pt-1">
                          {loc.significance}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
    </PageWrapper>
  );
};

