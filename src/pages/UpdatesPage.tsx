import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Flame,
  Wrench,
  Zap,
  Bell,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
  ExternalLink,
  Share2,
  Lock,
  Eye,
  Check,
  ChevronRight,
  ChevronLeft,
  X,
  RotateCcw,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import {
  getAllReleases,
  getPublishedUpdates,
  getLatestWebsiteVersion,
  isUpdateRead,
  markUpdateAsRead,
  markAllUpdatesAsRead,
  getUpdateById
} from '../services/updatesService';
import { WebsiteUpdate, UpdateCategory, WebsiteRelease } from '../types/updates';
import { UpdatesAdminModal } from '../components/updates/UpdatesAdminModal';
import { WhatsNewModal } from '../components/updates/WhatsNewModal';
import { useApp } from '../context/AppContext';

export const UpdatesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { updateId: paramUpdateId } = useParams<{ updateId?: string }>();
  const { settings } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<UpdateCategory | 'all'>('all');
  const [selectedVersion, setSelectedVersion] = useState<string>('all');
  const [onlyUnread, setOnlyUnread] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isWhatsNewOpen, setIsWhatsNewOpen] = useState<boolean>(false);
  const [selectedDetailUpdate, setSelectedDetailUpdate] = useState<WebsiteUpdate | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // Listen to update changes across tabs or admin actions
  useEffect(() => {
    const handleChanged = () => setRefreshKey((prev) => prev + 1);
    window.addEventListener('madar_updates_changed', handleChanged);
    return () => window.removeEventListener('madar_updates_changed', handleChanged);
  }, []);

  const latestVersion = useMemo(() => getLatestWebsiteVersion(), [refreshKey]);
  const allReleases = useMemo(() => getAllReleases(), [refreshKey]);
  const publishedUpdates = useMemo(() => getPublishedUpdates(), [refreshKey]);

  // Handle URL deep linking (e.g. /updates?id=... or /updates/:id)
  useEffect(() => {
    const targetId = paramUpdateId || searchParams.get('id');
    if (targetId) {
      const found = getUpdateById(targetId);
      if (found) {
        setSelectedDetailUpdate(found);
      }
    }
  }, [paramUpdateId, searchParams, refreshKey]);

  // Filtered updates
  const filteredUpdates = useMemo(() => {
    let list = publishedUpdates;

    if (selectedCategory !== 'all') {
      list = list.filter((u) => u.category === selectedCategory);
    }

    if (selectedVersion !== 'all') {
      list = list.filter((u) => u.version === selectedVersion || `v${u.version}` === selectedVersion);
    }

    if (onlyUnread) {
      list = list.filter((u) => !isUpdateRead(u.id));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (u) =>
          u.title.toLowerCase().includes(q) ||
          u.shortDescription.toLowerCase().includes(q) ||
          u.fullDescription.toLowerCase().includes(q) ||
          u.version.toLowerCase().includes(q) ||
          u.highlights.some((h) => h.toLowerCase().includes(q))
      );
    }

    return list;
  }, [publishedUpdates, selectedCategory, selectedVersion, onlyUnread, searchQuery, refreshKey]);

  const unreadCount = useMemo(() => {
    return publishedUpdates.filter((u) => !isUpdateRead(u.id)).length;
  }, [publishedUpdates, refreshKey]);

  const handleShareUpdate = (update: WebsiteUpdate, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/updates?id=${update.id}`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopiedId(update.id);
      setTimeout(() => setCopiedId(null), 2200);
    }
  };

  const getCategoryBadge = (cat: UpdateCategory) => {
    switch (cat) {
      case 'new_feature':
        return { label: 'ميزة جديدة', icon: Sparkles, color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
      case 'improvement':
        return { label: 'تحسين وتطوير', icon: Flame, color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'bug_fix':
        return { label: 'إصلاح ومعالجة', icon: Wrench, color: 'bg-sky-500/20 text-sky-300 border-sky-500/30' };
      case 'performance':
        return { label: 'أداء وسرعة', icon: Zap, color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
      case 'announcement':
        return { label: 'إعلان رسمي', icon: Bell, color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
    }
  };

  const CATEGORY_TABS: { id: UpdateCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'كافة التحديثات' },
    { id: 'new_feature', label: 'ميزات جديدة' },
    { id: 'improvement', label: 'تحسينات' },
    { id: 'bug_fix', label: 'إصلاحات' },
    { id: 'performance', label: 'أداء وسرعة' },
    { id: 'announcement', label: 'إعلانات هامة' }
  ];

  const pageTitle = selectedDetailUpdate
    ? `${selectedDetailUpdate.title} | تحديثات مدار اليقين`
    : `سجل التحديثات والإصدارات — ${latestVersion}`;
  const pageDescription = selectedDetailUpdate
    ? selectedDetailUpdate.shortDescription
    : 'سجل شامل وموثق لجميع التحديثات والميزات والتحسينات الصادرة في منصة مدار اليقين الإسلامية.';
  const canonicalPath = selectedDetailUpdate
    ? `/updates?id=${selectedDetailUpdate.id}`
    : '/updates';

  return (
    <PageWrapper
      title={pageTitle}
      description={pageDescription}
      canonicalPath={canonicalPath}
      schemaType={selectedDetailUpdate ? 'article' : 'collection'}
      breadcrumbs={[
        { label: 'الرئيسية', path: '/' },
        { label: 'سجل التحديثات', path: '/updates' },
        ...(selectedDetailUpdate ? [{ label: selectedDetailUpdate.title, path: `/updates?id=${selectedDetailUpdate.id}` }] : [])
      ]}
    >
      <div className="space-y-8">
        {/* Hero Section */}
        <section className="rounded-3xl royal-gradient text-white p-6 sm:p-8 border border-gold/35 shadow-xl relative overflow-hidden">
          <div className="islamic-pattern absolute inset-0 opacity-30 pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>سجل التطوير المستمر — منصة مدار اليقين</span>
                <span className="font-mono bg-white/10 px-2 py-0.5 rounded-full text-slate-100">
                  {latestVersion}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black">
                سجل التحديثات وإشعارات ما الجديد
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
                اطلع على كافة المزايا والتحسينات والإصدارات التاريخية لمنصة مدار اليقين لحظة بلحظة، وتعرف على التفاصيل الكاملة لكل إضافة شرعية وتقنية.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setIsWhatsNewOpen(true)}
                className="px-4 py-2.5 rounded-2xl gold-gradient text-royal font-black text-xs inline-flex items-center gap-2 shadow-gold-glow hover:scale-[1.02] transition-transform"
              >
                <Sparkles className="w-4 h-4" />
                <span>استعراض نافذة ما الجديد التفاعلية</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAdminOpen(true)}
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-gold/30 text-xs font-extrabold text-gold inline-flex items-center gap-2 transition-colors"
                title="لوحة تحكم ونشر التحديثات للإدارة"
              >
                <Lock className="w-4 h-4" />
                <span>إدارة التحديثات (للإدارة)</span>
              </button>
            </div>
          </div>
        </section>

        {/* Current Release Highlights Banner */}
        {allReleases.length > 0 && (
          <section className="glass-panel rounded-3xl p-6 border-2 border-gold/35 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gold/20 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 rounded-full royal-gradient text-gold text-xs font-black font-mono">
                  {allReleases[0].version}
                </span>
                <h2 className="text-base sm:text-lg font-black text-royal dark:text-white">
                  {allReleases[0].name}
                </h2>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Calendar className="w-4 h-4 text-gold" />
                <span>
                  تاريخ الإطلاق:{' '}
                  {new Date(allReleases[0].releaseDate).toLocaleDateString('ar-SA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              {allReleases[0].summary}
            </p>
          </section>
        )}

        {/* Search & Filters Bar */}
        <section className="glass-panel rounded-3xl p-4 sm:p-5 border border-gold/25 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في عناوين التحديثات، الإصدارات، أو المزايا..."
                className="w-full pr-11 pl-10 py-3 rounded-2xl bg-royal/5 dark:bg-white/5 border border-gold/25 focus:border-gold outline-none text-xs sm:text-sm text-royal dark:text-white"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-royal dark:hover:text-gold"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Version Select Filter */}
            <select
              value={selectedVersion}
              onChange={(e) => setSelectedVersion(e.target.value)}
              className="px-3 py-3 rounded-2xl bg-royal/5 dark:bg-white/5 border border-gold/25 text-xs sm:text-sm font-bold text-royal dark:text-gold outline-none"
            >
              <option value="all">كافة الإصدارات</option>
              {allReleases.map((r) => (
                <option key={r.id} value={r.version}>
                  {r.version} — {r.name}
                </option>
              ))}
            </select>

            {/* Unread Only Button */}
            <button
              type="button"
              onClick={() => setOnlyUnread((prev) => !prev)}
              className={`px-4 py-3 rounded-2xl border text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 transition-all ${
                onlyUnread
                  ? 'gold-gradient text-royal border-gold shadow-gold-glow'
                  : 'bg-royal/5 dark:bg-white/5 border-gold/25 text-royal dark:text-slate-200 hover:border-gold'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${onlyUnread ? 'text-royal' : 'text-gold'}`} />
              <span>غير المقروءة ({unreadCount})</span>
            </button>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => markAllUpdatesAsRead()}
                className="px-3.5 py-3 rounded-2xl bg-royal/5 dark:bg-white/5 hover:bg-gold/15 border border-gold/20 text-xs font-bold text-slate-500 hover:text-gold transition-colors shrink-0"
                title="تحديد كافة التحديثات كمقروءة"
              >
                تحديد الكل كمقروء
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
            <span className="text-slate-400 text-[11px] whitespace-nowrap pl-1">التصنيف:</span>
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                  selectedCategory === tab.id
                    ? 'royal-gradient text-gold border border-gold/40 shadow-sm'
                    : 'bg-royal/5 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-gold'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {/* Updates List / Timeline */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-royal dark:text-white flex items-center gap-2">
              <span>التحديثات المعروضة:</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-gold/20 text-gold font-bold">
                {filteredUpdates.length} تحديث
              </span>
            </h3>
          </div>

          {filteredUpdates.length === 0 ? (
            <div className="glass-panel rounded-3xl p-12 text-center space-y-4 border border-gold/20">
              <Sparkles className="w-12 h-12 text-gold/40 mx-auto" />
              <h4 className="text-base font-extrabold text-royal dark:text-white">
                لا توجد تحديثات مطابقة للشروط المحددة
              </h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                جرب مسح كلمات البحث أو إزالة تصفية غير المقروءة لاستعراض كامل السجل.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedVersion('all');
                  setOnlyUnread(false);
                }}
                className="px-4 py-2 rounded-2xl gold-gradient text-royal font-black text-xs inline-flex items-center gap-2"
              >
                <span>إعادة ضبط الفلاتر</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredUpdates.map((update, idx) => {
                const isRead = isUpdateRead(update.id);
                const badge = getCategoryBadge(update.category);
                const Icon = badge.icon;

                return (
                  <div
                    key={update.id}
                    onClick={() => {
                      markUpdateAsRead(update.id);
                      setSelectedDetailUpdate(update);
                    }}
                    className={`glass-panel rounded-3xl p-5 sm:p-6 border transition-all space-y-4 cursor-pointer hover:border-gold/60 ${
                      !isRead
                        ? 'border-gold/40 shadow-sm bg-gold/[0.02]'
                        : 'border-gold/20 opacity-90'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gold/15 pb-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono px-2.5 py-0.5 rounded-lg bg-gold/15 text-gold font-bold border border-gold/30">
                          v{update.version}
                        </span>

                        <span className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${badge.color}`}>
                          <Icon className="w-3 h-3" />
                          <span>{badge.label}</span>
                        </span>

                        <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-gold" />
                          <span>{update.releaseDate}</span>
                        </span>

                        {!isRead && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold">
                            جديد لم يُقرأ
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={(e) => handleShareUpdate(update, e)}
                          className="p-2 rounded-xl bg-royal/5 dark:bg-white/5 hover:bg-gold/20 text-gold transition-colors"
                          title="نسخ رابط هذا التحديث"
                        >
                          {copiedId === update.id ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Share2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-base sm:text-lg font-black text-royal dark:text-white leading-snug">
                        {update.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                        {update.shortDescription}
                      </p>
                    </div>

                    {update.highlights && update.highlights.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-slate-600 dark:text-slate-300">
                        {update.highlights.slice(0, 4).map((h, hIdx) => (
                          <div key={hIdx} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                            <span className="line-clamp-1">{h}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gold/15 text-xs">
                      <span className="text-gold font-bold inline-flex items-center gap-1 hover:underline">
                        <span>عرض التفاصيل الكاملة</span>
                        <ChevronLeft className="w-4 h-4" />
                      </span>

                      {update.actionUrl && (
                        <Link
                          to={update.actionUrl}
                          onClick={(e) => {
                            e.stopPropagation();
                            markUpdateAsRead(update.id);
                          }}
                          className="px-4 py-2 rounded-xl gold-gradient text-royal font-black text-xs inline-flex items-center gap-1.5 shadow-sm hover:scale-[1.02] transition-transform"
                        >
                          <span>{update.actionLabel || 'استكشف الميزة'}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Detailed Modal for Selected Update */}
        <AnimatePresence>
          {selectedDetailUpdate && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
              <div className="fixed inset-0" onClick={() => setSelectedDetailUpdate(null)} />

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative z-10 w-full max-w-2xl rounded-3xl bg-[#072A20] text-white border-2 border-gold/45 shadow-2xl p-6 sm:p-8 space-y-6 my-auto max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between border-b border-gold/20 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono px-2.5 py-0.5 rounded-lg bg-gold/15 text-gold font-bold">
                        v{selectedDetailUpdate.version}
                      </span>
                      <span className="text-xs text-slate-300">
                        {selectedDetailUpdate.releaseDate}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-white">
                      {selectedDetailUpdate.title}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedDetailUpdate(null)}
                    className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <p className="text-sm font-bold text-amber-100 leading-relaxed">
                    {selectedDetailUpdate.shortDescription}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line font-light">
                    {selectedDetailUpdate.fullDescription}
                  </p>
                </div>

                {selectedDetailUpdate.highlights && selectedDetailUpdate.highlights.length > 0 && (
                  <div className="p-4 rounded-2xl bg-white/5 border border-gold/20 space-y-2.5">
                    <span className="text-xs font-bold text-gold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>المزايا والخصائص المضافة:</span>
                    </span>
                    <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                      {selectedDetailUpdate.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gold/20">
                  <button
                    type="button"
                    onClick={(e) => handleShareUpdate(selectedDetailUpdate, e)}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-gold inline-flex items-center gap-1.5"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>{copiedId === selectedDetailUpdate.id ? 'تم نسخ الرابط' : 'مشاركة التحديث'}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {selectedDetailUpdate.actionUrl && (
                      <Link
                        to={selectedDetailUpdate.actionUrl}
                        onClick={() => setSelectedDetailUpdate(null)}
                        className="px-5 py-2.5 rounded-xl gold-gradient text-royal font-black text-xs inline-flex items-center gap-2 shadow-gold-glow"
                      >
                        <span>{selectedDetailUpdate.actionLabel || 'استكشف الميزة الآن'}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => setSelectedDetailUpdate(null)}
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-200"
                    >
                      إغلاق
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Administration CMS Modal */}
        <UpdatesAdminModal
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          onUpdateChanged={() => setRefreshKey((prev) => prev + 1)}
        />

        {/* What's New Walkthrough Modal */}
        {isWhatsNewOpen && (
          <WhatsNewModal
            manualOpen={true}
            onManualClose={() => setIsWhatsNewOpen(false)}
          />
        )}
      </div>
    </PageWrapper>
  );
};

