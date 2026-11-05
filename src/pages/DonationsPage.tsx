import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeartHandshake,
  Sprout,
  Heart,
  Droplets,
  HandHeart,
  Stethoscope,
  Landmark,
  Users,
  Home,
  Utensils,
  BookOpen,
  Globe,
  Building2,
  Sparkles,
  ShieldCheck,
  Search,
  ExternalLink,
  CalendarCheck,
  AlertTriangle,
  Info,
  Calculator,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import {
  DONATIONS_HUB_METADATA,
  DONATION_CATEGORIES,
  OFFICIAL_DONATION_PLATFORMS,
  DonationCategoryId,
  DonationCategoryItem,
  OfficialDonationPlatform,
} from '../data/donationsConfig';

export const DonationsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<DonationCategoryId>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const getCategoryIcon = (iconName: DonationCategoryItem['iconName']) => {
    switch (iconName) {
      case 'HeartHandshake':
        return HeartHandshake;
      case 'Sprout':
        return Sprout;
      case 'Heart':
        return Heart;
      case 'Droplets':
        return Droplets;
      case 'HandHeart':
        return HandHeart;
      case 'Stethoscope':
        return Stethoscope;
      case 'Landmark':
        return Landmark;
      case 'Users':
        return Users;
      case 'Home':
        return Home;
      case 'Utensils':
        return Utensils;
      case 'BookOpen':
        return BookOpen;
      case 'Globe':
        return Globe;
      case 'Building2':
        return Building2;
      default:
        return Sparkles;
    }
  };

  const getPlatformIcon = (iconName: OfficialDonationPlatform['iconName']) => {
    switch (iconName) {
      case 'HeartHandshake':
        return HeartHandshake;
      case 'Globe':
        return Globe;
      case 'Home':
        return Home;
      case 'Stethoscope':
        return Stethoscope;
      default:
        return ShieldCheck;
    }
  };

  const activeCategoryMeta = useMemo(
    () => DONATION_CATEGORIES.find((c) => c.id === selectedCategory) || DONATION_CATEGORIES[0],
    [selectedCategory]
  );

  // Filter platforms strictly by linked category and search query
  const filteredPlatforms = useMemo(() => {
    return OFFICIAL_DONATION_PLATFORMS.filter((platform) => {
      if (
        selectedCategory !== 'all' &&
        !platform.supportedCategories.includes(selectedCategory)
      ) {
        return false;
      }

      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;

      return (
        platform.nameAr.toLowerCase().includes(q) ||
        platform.classificationAr.toLowerCase().includes(q) ||
        platform.organizationAr.toLowerCase().includes(q) ||
        platform.descriptionAr.toLowerCase().includes(q) ||
        platform.fieldsOfWorkAr.some((f) => f.toLowerCase().includes(q))
      );
    });
  }, [selectedCategory, searchQuery]);

  const sadaqahJariyahPlatforms = useMemo(
    () => OFFICIAL_DONATION_PLATFORMS.filter((p) => p.isSadaqahJariyahSupported),
    []
  );

  return (
    <PageWrapper
      title="بوابة التبرعات الرسمية | Donations Hub"
      description="دليل منصات التبرع الرسمية في المملكة العربية السعودية: منصة إحسان، منصة ساهم، جود الإسكان، منصة شفاء، والمركز الوطني لتنمية القطاع غير الربحي."
      canonicalPath="/donations"
      schemaType="collection"
      breadcrumbs={[
        { label: 'الرئيسية', path: '/' },
        { label: 'بوابة التبرعات الرسمية', path: '/donations' }
      ]}
    >
      <div className="space-y-10">
        {/* 1. Majestic Hero Section with Title, Motivational Phrase & Authentic Quranic Verse */}
        <section className="rounded-3xl royal-gradient text-white p-6 sm:p-10 border border-gold/40 shadow-2xl relative overflow-hidden">
          <div className="islamic-pattern absolute inset-0 opacity-30 pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex flex-wrap items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-extrabold">
                <HeartHandshake className="w-4 h-4" />
                <span>بوابة التبرعات الرسمية • Donations Hub</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black leading-tight">
                {DONATIONS_HUB_METADATA.pageTitleAr}{' '}
                <span className="gold-text-gradient text-2xl sm:text-3xl block sm:inline mt-1 sm:mt-0">
                  | Donations Hub
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl">
                {DONATIONS_HUB_METADATA.motivationalQuoteAr}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href={DONATIONS_HUB_METADATA.verificationPortal.donateSafelyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-2xl gold-gradient text-royal font-extrabold text-xs sm:text-sm shadow-gold-glow inline-flex items-center gap-2 hover:scale-[1.02] transition-transform"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>خدمة التحقق من التراخيص (تبرع بأمان)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <Link
                  to="/charity"
                  className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-gold/35 text-white font-bold text-xs sm:text-sm inline-flex items-center gap-2 transition-colors"
                >
                  <Calculator className="w-4 h-4 text-gold" />
                  <span>حاسبة الزكاة الشرعية</span>
                </Link>
              </div>
            </div>

            {/* Authentic Quranic Verse Box */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl bg-black/30 backdrop-blur-xl border border-gold/40 p-6 space-y-4 shadow-inner">
                <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <span className="text-xs font-bold text-gold flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    <span>في فضل الإنفاق في سبيل الله</span>
                  </span>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-gold/20 text-gold font-bold">
                    {DONATIONS_HUB_METADATA.quranVerse.source}
                  </span>
                </div>

                <blockquote className="font-quran text-xl sm:text-2xl text-amber-50 leading-[2.2] text-center">
                  {DONATIONS_HUB_METADATA.quranVerse.text}
                </blockquote>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
                  <span>روابط رسمية مباشرة في تبويب مستقل</span>
                  <span className="text-gold font-bold">بدون وسيط مالي</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. "Verify Before You Donate" (تحقق قبل أن تتبرع) Feature Banner */}
        <section
          aria-labelledby="verify-before-donating-heading"
          className="glass-panel rounded-3xl p-6 sm:p-8 border-2 border-gold/45 shadow-xl space-y-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gold/20 pb-5">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl royal-gradient border border-gold/40 flex items-center justify-center text-gold shrink-0 shadow-gold-glow">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2
                    id="verify-before-donating-heading"
                    className="text-xl sm:text-2xl font-black text-royal dark:text-white"
                  >
                    {DONATIONS_HUB_METADATA.verificationPortal.titleAr}
                  </h2>
                  <span className="px-3 py-0.5 rounded-full bg-gold/15 border border-gold/35 text-royal dark:text-gold text-xs font-extrabold">
                    إرشادات الأمان والحوكمة
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  تاريخ آخر مراجعة لروابط الدليل المركزي:{' '}
                  <strong className="font-mono text-gold">
                    {DONATIONS_HUB_METADATA.verificationPortal.lastConfigReviewDate}
                  </strong>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <a
                href={DONATIONS_HUB_METADATA.verificationPortal.donateSafelyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-2xl royal-gradient text-white font-extrabold text-xs inline-flex items-center gap-2 border border-gold/40 hover:opacity-95 transition-opacity"
              >
                <ShieldCheck className="w-4 h-4 text-gold" />
                <span>بوابة التحقق من التراخيص (تبرع بأمان)</span>
                <ExternalLink className="w-3.5 h-3.5 text-gold" />
              </a>

              <a
                href={DONATIONS_HUB_METADATA.verificationPortal.ncnpMainUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-2xl bg-gold/15 hover:bg-gold/25 border border-gold/35 text-royal dark:text-gold font-extrabold text-xs inline-flex items-center gap-2 transition-colors"
              >
                <span>المركز الوطني لتنمية القطاع غير الربحي</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {DONATIONS_HUB_METADATA.verificationPortal.principlesAr.map((rule, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-royal/[0.03] dark:bg-white/[0.03] border border-gold/20 flex items-start gap-3 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-200"
              >
                <AlertTriangle className="w-4 h-4 text-gold shrink-0 mt-1" />
                <span>{rule}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Interactive Donation Categories & Search Bar */}
        <section className="space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-royal dark:text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-gold" />
                <span>اختر مجال العطاء والتبرع</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                يتم عرض المنصات الرسمية المرتبطة بكل تصنيف فقط دون إنشاء حملات افتراضية
              </p>
            </div>

            {/* Platform Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-gold absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن منصة أو مجال عمل..."
                className="w-full pr-10 pl-4 py-2.5 rounded-2xl glass-panel border border-gold/30 text-xs sm:text-sm font-bold text-royal dark:text-white focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          {/* 14 Category Pills (All + 13 specific categories) */}
          <div className="flex flex-wrap gap-2">
            {DONATION_CATEGORIES.map((cat) => {
              const Icon = getCategoryIcon(cat.iconName);
              const isSelected = selectedCategory === cat.id;
              const linkedCount =
                cat.id === 'all'
                  ? OFFICIAL_DONATION_PLATFORMS.length
                  : OFFICIAL_DONATION_PLATFORMS.filter((p) =>
                      p.supportedCategories.includes(
                        cat.id as Exclude<DonationCategoryId, 'all'>
                      )
                    ).length;

              return (
                <motion.button
                  key={cat.id}
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2.5 rounded-2xl border text-xs font-extrabold transition-all inline-flex items-center gap-2 ${
                    isSelected
                      ? 'royal-gradient text-white border-gold shadow-gold-glow'
                      : 'glass-panel border-gold/20 hover:border-gold text-royal dark:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4 text-gold shrink-0" />
                  <span>{cat.labelAr}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] ${
                      isSelected ? 'bg-gold text-royal' : 'bg-gold/15 text-gold'
                    }`}
                  >
                    {linkedCount}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Active Category Context Strip */}
          <div className="p-4 rounded-2xl bg-gold/10 border border-gold/25 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-royal dark:text-gold">
              <Info className="w-4 h-4 text-gold shrink-0" />
              <span>
                التصنيف المختار: <strong>{activeCategoryMeta.labelAr}</strong> —{' '}
                {activeCategoryMeta.descriptionAr}
              </span>
            </div>
            <span className="font-extrabold text-slate-600 dark:text-slate-300">
              عدد المنصات المعروضة: {filteredPlatforms.length}
            </span>
          </div>
        </section>

        {/* 4. Official Platforms Cards Grid */}
        <section aria-labelledby="official-platforms-heading" className="space-y-4">
          <h2 id="official-platforms-heading" className="sr-only">
            بطاقات المنصات الرسمية
          </h2>

          {filteredPlatforms.length === 0 ? (
            <div className="glass-panel rounded-3xl p-12 text-center space-y-3 border border-gold/25">
              <Filter className="w-10 h-10 text-gold mx-auto" />
              <h3 className="text-lg font-extrabold text-royal dark:text-white">
                لا توجد منصات مطابقة لعبارة البحث في هذا التصنيف
              </h3>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl gold-gradient text-royal text-xs font-extrabold"
              >
                عرض جميع المنصات الرسمية
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredPlatforms.map((platform, idx) => {
                  const PlatformIcon = getPlatformIcon(platform.iconName);

                  return (
                    <motion.article
                      key={platform.id}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05, duration: 0.32 }}
                      whileHover={{ y: -4 }}
                      className="glass-panel rounded-3xl p-6 sm:p-7 border border-gold/30 hover:border-gold transition-all flex flex-col justify-between gap-6"
                    >
                      <div className="space-y-4">
                        {/* Card Top Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div
                              className={`w-13 h-13 p-3.5 rounded-2xl bg-gradient-to-br ${platform.accentGradient} border border-gold/45 text-gold flex items-center justify-center shrink-0 shadow-gold-glow`}
                            >
                              <PlatformIcon className="w-6 h-6" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs font-extrabold text-gold block">
                                {platform.classificationAr}
                              </span>
                              <h3 className="text-xl sm:text-2xl font-black text-royal dark:text-white truncate">
                                {platform.nameAr}
                              </h3>
                              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                {platform.organizationAr}
                              </p>
                            </div>
                          </div>

                          <div className="shrink-0 text-left">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-royal/5 dark:bg-white/5 border border-gold/25 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                              <CalendarCheck className="w-3.5 h-3.5 text-gold" />
                              <span>مراجعة: {platform.lastReviewedDate}</span>
                            </span>
                          </div>
                        </div>

                        {/* Platform Description */}
                        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                          {platform.descriptionAr}
                        </p>

                        {/* Fields of Work */}
                        <div className="space-y-2">
                          <span className="text-xs font-extrabold text-royal dark:text-gold block">
                            مجالات العمل والمبادرات المتاحة في المنصة:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {platform.fieldsOfWorkAr.map((field) => (
                              <span
                                key={field}
                                className="px-2.5 py-1 rounded-xl bg-royal/5 dark:bg-white/5 border border-gold/20 text-xs font-semibold text-royal dark:text-slate-200"
                              >
                                {field}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Verification & Regulatory Notice Box */}
                        <div className="p-3.5 rounded-2xl bg-gold/10 border border-gold/25 space-y-1.5 text-xs">
                          <div className="flex items-center gap-1.5 font-extrabold text-royal dark:text-gold">
                            <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                            <span>حالة مراجعة الرابط: {platform.verificationStatusTextAr}</span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                            {platform.regulatoryNoticeAr}
                          </p>
                        </div>
                      </div>

                      {/* Footer: Explicit Official URL & External Tab Action Button(s) */}
                      <div className="pt-4 border-t border-gold/20 space-y-3">
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span className="text-slate-500 dark:text-slate-400 font-semibold">
                            الرابط الرسمي المباشر:
                          </span>
                          <span
                            dir="ltr"
                            className="font-mono font-bold text-royal dark:text-gold truncate"
                          >
                            {platform.officialUrl}
                          </span>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                          <a
                            href={platform.officialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-3 px-4 rounded-2xl royal-gradient text-white font-extrabold text-xs sm:text-sm inline-flex items-center justify-center gap-2 border border-gold/40 hover:opacity-95 active:scale-[0.99] transition-all shadow-md"
                          >
                            <span>
                              {platform.platformType === 'regulatory_verification'
                                ? `الانتقال إلى ${platform.nameAr}`
                                : `الانتقال للتبرع عبر ${platform.nameAr}`}
                            </span>
                            <ExternalLink className="w-4 h-4 text-gold shrink-0" />
                          </a>

                          {platform.secondaryUrl && platform.secondaryUrlLabelAr && (
                            <a
                              href={platform.secondaryUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="py-3 px-4 rounded-2xl gold-gradient text-royal font-extrabold text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-gold-glow active:scale-[0.99] transition-all"
                            >
                              <ShieldCheck className="w-4 h-4 shrink-0" />
                              <span>{platform.secondaryUrlLabelAr}</span>
                              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </section>

        {/* 5. Dedicated Sadaqah Jariyah (الصدقة الجارية) Section */}
        <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-gold/35 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gold/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl royal-gradient text-gold flex items-center justify-center shrink-0">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-royal dark:text-white">
                  أبواب الصدقة الجارية والأوقاف المستدامة
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  مسارات الصدقة الجارية المتاحة عبر المنصات الوطنية الرسمية في مجالات الأوقاف والصحة والمساجد والسقيا والإسكان
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sadaqahJariyahPlatforms.map((p) => (
              <div
                key={p.id}
                className="p-5 rounded-2xl bg-royal/[0.03] dark:bg-white/[0.03] border border-gold/25 flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <span className="text-[11px] font-extrabold text-gold block">
                    {p.classificationAr}
                  </span>
                  <h3 className="text-base font-extrabold text-royal dark:text-white">
                    {p.nameAr}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {p.sadaqahJariyahSummaryAr}
                  </p>
                </div>

                <a
                  href={p.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-xl bg-gold/15 hover:bg-gold/25 border border-gold/35 text-royal dark:text-gold font-extrabold text-xs inline-flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>استعراض الفرص في الموقع الرسمي</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Governmental & Charitable Ecosystem Overview Section */}
        <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-gold/30 space-y-5">
          <div className="flex items-center gap-3 border-b border-gold/20 pb-4">
            <div className="w-11 h-11 rounded-2xl royal-gradient text-gold flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-royal dark:text-white">
                منظومة المنصات الحكومية والخيرية في المملكة
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                تتكامل المنصات الوطنية المتخصصة لتغطية كافة مجالات البر والإحسان وفق حوكمة تنظيمية دقيقة
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className="p-5 rounded-2xl bg-royal/[0.03] dark:bg-white/[0.03] border border-gold/20 space-y-2">
              <h3 className="font-extrabold text-base text-royal dark:text-gold">
                1. المنصات الوطنية الشاملة والمتخصصة
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                تشمل <strong>منصة إحسان</strong> للعمل الخيري العام، و<strong>منصة جود الإسكان</strong> للتكافل السكني، و<strong>منصة شفاء</strong> التابعة لصندوق الوقف الصحي لعلاج المرضى والأوقاف الصحية.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-royal/[0.03] dark:bg-white/[0.03] border border-gold/20 space-y-2">
              <h3 className="font-extrabold text-base text-royal dark:text-gold">
                2. الإغاثة والعمل الإنساني الدولي
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                تُمثّل <strong>منصة ساهم</strong> التابعة لمركز الملك سلمان للإغاثة والأعمال الإنسانية القناة الرسمية المعتمدة للمساهمة في البرامج الإغاثية والإنسانية خارج المملكة.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-royal/[0.03] dark:bg-white/[0.03] border border-gold/20 space-y-2">
              <h3 className="font-extrabold text-base text-royal dark:text-gold">
                3. الرقابة والتحقق من التراخيص
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                يتولى <strong>المركز الوطني لتنمية القطاع غير الربحي (NCNP)</strong> تنظيم تراخيص جمع التبرعات وإتاحة خدمة التحقق المباشر عبر بوابة حوكمة التبرعات.
              </p>
            </div>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
};
