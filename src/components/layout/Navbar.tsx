import React, { useState, useEffect, useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Compass,
  BookOpen,
  Mic2,
  CalendarCheck,
  Sparkles,
  CircleDot,
  MoonStar,
  HeartHandshake,
  Radio,
  Tv,
  Settings,
  Sun,
  Moon,
  Menu,
  X,
  MapPin,
  Smartphone,
  HandHeart,
  ScrollText,
  GraduationCap,
  Award,
  ShieldCheck,
  Layers,
  Users,
  Search,
  Shield,
  CheckSquare,
  Tent,
  Crown,
  Landmark,
  Scale,
  Headphones,
  Palette,
  Building2,
  Languages,
} from 'lucide-react';
import { Logo } from './Logo';
import { MobileConnectModal } from './MobileConnectModal';
import { useApp } from '../../context/AppContext';
import { getLatestWebsiteVersion, getUnreadPublishedUpdates } from '../../services/updatesService';

export interface NavRouteItem {
  path: string;
  label: string;
  shortLabel: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const NAV_ROUTES: NavRouteItem[] = [
  { path: '/', label: 'الرئيسية', shortLabel: 'الرئيسية', description: 'الواجهة الترحيبية ومواقيت اليوم', icon: Home },
  { path: '/companion', label: 'رفيق المسلم اليومي', shortLabel: 'رفيق المسلم', description: 'لوحة متابعة الطاعات والسنن والورد القرآني', icon: CheckSquare },
  { path: '/hajj-umrah', label: 'دليل الحج والعمرة التفاعلي', shortLabel: 'الحج والعمرة', description: 'دليل المناسك التفاعلي والمشاعر والمواقيت المعتمدة', icon: Tent },
  { path: '/kids', label: 'عالم الأطفال المسلم', shortLabel: 'عالم الأطفال', description: 'بيئة تفاعلية لتعليم القرآن والأركان والقصص والألعاب', icon: Crown },
  { path: '/history-atlas', label: 'أطلس التاريخ الإسلامي', shortLabel: 'أطلس التاريخ', description: 'خريطة تفاعلية كبرى والخط الزمني للحواضر والفتوحات', icon: Landmark },
  { path: '/content-verifier', label: 'تحقق من صحة الحديث', shortLabel: 'تحقق الحديث', description: 'فحص الأحاديث والرسائل المتداولة وتخريجها المعتمد', icon: ShieldCheck },
  { path: '/daily-fiqh', label: 'فقه الحياة اليومية المعاصرة', shortLabel: 'فقه المعاملات', description: 'أحكام المعاملات المالية والطبية والتقنية والسفر', icon: Scale },
  { path: '/janazah', label: 'دليل الجنائز والتعزية', shortLabel: 'دليل الجنائز', description: 'صفة الغسل والتكفين وصلاة الجنازة والدفن والتعزية', icon: HeartHandshake },
  { path: '/audio-library', label: 'المكتبة الصوتية الإسلامية', shortLabel: 'المكتبة الصوتية', description: 'تلاوات نادرة، دروس الأئمة، والسيرة صوتياً', icon: Headphones },
  { path: '/card-studio', label: 'استوديو البطاقات الإسلامية', shortLabel: 'استوديو البطاقات', description: 'تصميم بطاقات دعوية وآيات وأحاديث وتصديرها بدقة عالية', icon: Palette },
  { path: '/islamic-centers', label: 'دليل المراكز وحلقات التحفيظ', shortLabel: 'مراكز التحفيظ', description: 'جمعيات التحفيظ والمقارئ الإلكترونية والجوامع الكبرى', icon: Building2 },
  { path: '/scholars', label: 'موسوعة العلماء والمصنفات', shortLabel: 'العلماء والكتب', description: 'سير الأئمة الأربعة والمحدثين وكبار المحققين وأمهات الكتب', icon: GraduationCap },
  { path: '/quran-coach', label: 'مدرّب حفظ القرآن ومراجعته', shortLabel: 'مدرّب الحفظ', description: 'جدول الحفظ والتكرار الذكي والتسميع الصوتي والمراجعة التراكمية', icon: Award },
  { path: '/tajweed-lab', label: 'معمل النطق والتجويد التفاعلي', shortLabel: 'معمل التجويد', description: 'مخارج الحروف وصفاتها والمدود والغنة ومختبر التسجيل الصوتي', icon: Mic2 },
  { path: '/quranic-arabic', label: 'أكاديمية لغة القرآن والمفردات', shortLabel: 'لغة القرآن', description: 'إعراب وبلاغة الآيات وجذور الكلمات القرآنية وترجمتها متعددة اللغات', icon: Languages },
  { path: '/sign-language', label: 'مركز التعليم الإسلامي بلغة الإشارة', shortLabel: 'لغة الإشارة', description: 'فيديوهات وشروح إشارية معتمدة لأركان الإسلام والوضوء والصلاة والأذكار', icon: HeartHandshake },
  { path: '/encyclopedia', label: 'الموسوعة والأكاديمية', shortLabel: 'الموسوعة', description: 'البوابة الكبرى للموسوعات والأكاديمية التعليمية', icon: Layers },
  { path: '/quran', label: 'القرآن الكريم', shortLabel: 'المصحف', description: 'المصحف العثماني والتفسير والتلاوة', icon: BookOpen },
  { path: '/tafsir', label: 'تفسير القرآن الكريم', shortLabel: 'التفسير', description: 'التفسير الميسر المعتمد من مجمع الملك فهد', icon: BookOpen },
  { path: '/prophets', label: 'قصص الأنبياء', shortLabel: 'قصص الأنبياء', description: 'الموسوعة الموثقة لقصص 25 نبياً ورسولاً', icon: ScrollText },
  { path: '/seerah', label: 'السيرة النبوية الشريفة', shortLabel: 'السيرة النبوية', description: 'الخط الزمني الموثق والمعالم النبوية', icon: Compass },
  { path: '/companions', label: 'موسوعة الصحابة', shortLabel: 'الصحابة', description: 'سير الخلفاء والعشرة وأمهات المؤمنين', icon: Users },
  { path: '/hadith', label: 'موسوعة الحديث الشريف', shortLabel: 'الحديث الشريف', description: 'الأربعون النووية والصحيحان والشروح', icon: Award },
  { path: '/academy', label: 'أكاديمية مدار اليقين', shortLabel: 'الأكاديمية', description: '10 مسارات واختبارات وشهادات إتمام', icon: GraduationCap },
  { path: '/worship', label: 'تعليم العبادات', shortLabel: 'العبادات', description: 'دليل عملي مصور للوضوء والصلاة والصيام والحج', icon: HeartHandshake },
  { path: '/aqeedah', label: 'العقيدة الإسلامية', shortLabel: 'العقيدة', description: 'التوحيد وأسماء الله وضوابط التكفير', icon: Shield },
  { path: '/fatwas', label: 'الفتاوى الموثقة', shortLabel: 'الفتاوى', description: 'أحكام وفتاوى هيئة كبار العلماء والرئاسة', icon: ShieldCheck },
  { path: '/prayer', label: 'مواقيت الصلاة والقبلة', shortLabel: 'الصلاة والقبلة', description: 'الحساب الفلكي الدقيق وبوصلة القبلة', icon: Compass },
  { path: '/search', label: 'محرك البحث الموحد', shortLabel: 'البحث', description: 'بحث فوري في جميع الموسوعات والأكاديمية', icon: Search },
  { path: '/reciters', label: 'أطلس قراء العالم', shortLabel: 'القراء', description: 'قراء القارات الست والمشغل المتتابع', icon: Mic2 },
  { path: '/khatmah', label: 'الختمة القرآنية', shortLabel: 'الختمة', description: 'تخطيط ومتابعة الورد القرآني الذكي', icon: CalendarCheck },
  { path: '/duas', label: 'موسوعة الأدعية', shortLabel: 'موسوعة الأدعية', description: 'الأدعية القرآنية والنبوية الصحيحة والمأثورة وأدعية الأحوال والكروب', icon: Sparkles },
  { path: '/adhkar', label: 'واحة الأذكار', shortLabel: 'الأذكار', description: 'حصن المسلم بالتخريج والعداد التفاعلي', icon: Sparkles },
  { path: '/tasbih', label: 'المسبحة الإلكترونية', shortLabel: 'المسبحة', description: 'عداد التسبيح الدائري الفاخر والإحصائيات', icon: CircleDot },
  { path: '/sleep', label: 'حاسبة النوم والقيام', shortLabel: 'النوم والقيام', description: 'دورات النوم التقديرية ومنبه الفجر والقيام', icon: MoonStar },
  { path: '/charity', label: 'حاسبة الزكاة والصدقات', shortLabel: 'الزكاة', description: 'حاسبة الزكاة الشرعية ونصاب الذهب', icon: HeartHandshake },
  { path: '/donations', label: 'بوابة التبرعات الرسمية', shortLabel: 'التبرعات', description: 'دليل منصات التبرع السعودية الرسمية والتحقق', icon: HandHeart },
  { path: '/channels', label: 'القنوات الدينية المباشرة', shortLabel: 'القنوات', description: 'بث قنوات القرآن والسنة والرسالة وإقرأ', icon: Tv },
  { path: '/radio', label: 'الإذاعات الإسلامية العالمية', shortLabel: 'الإذاعات', description: 'مكتبة الإذاعات القرآنية والعلمية والدعوية', icon: Radio },
  { path: '/live', label: 'بث الحرمين المباشر', shortLabel: 'بث الحرمين', description: 'البث المشترك للحرمين الشريفين', icon: Radio },
  { path: '/updates', label: 'سجل التحديثات وما الجديد', shortLabel: 'ما الجديد', description: 'سجل الإصدارات وتاريخ التحديثات والمزايا المنشورة', icon: Sparkles },
  { path: '/settings', label: 'الإعدادات', shortLabel: 'الإعدادات', description: 'تخصيص المظهر وطريقة الحساب والخطوط', icon: Settings },
];

export const Navbar: React.FC = () => {
  const { settings, toggleTheme } = useApp();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileModalOpen, setMobileModalOpen] = useState(false);
  const [unreadUpdatesCount, setUnreadUpdatesCount] = useState<number>(0);
  const location = useLocation();

  const latestVersion = useMemo(() => getLatestWebsiteVersion(), [location.pathname]);

  useEffect(() => {
    const updateUnread = () => {
      setUnreadUpdatesCount(getUnreadPublishedUpdates().length);
    };
    updateUnread();
    window.addEventListener('madar_updates_changed', updateUnread);
    return () => window.removeEventListener('madar_updates_changed', updateUnread);
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  // Primary top bar routes for desktop header navigation
  const topBarRoutes: NavRouteItem[] = useMemo(() => {
    const primaryPaths = [
      '/',
      '/companion',
      '/hajj-umrah',
      '/kids',
      '/history-atlas',
      '/content-verifier',
      '/daily-fiqh',
      '/audio-library',
      '/card-studio',
      '/scholars',
      '/encyclopedia',
      '/quran',
      '/duas',
      '/prophets',
      '/seerah',
      '/hadith',
      '/academy',
      '/worship',
      '/fatwas',
      '/prayer',
      '/donations',
      '/search'
    ];
    return NAV_ROUTES.filter((r) => primaryPaths.includes(r.path));
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#F8FAF9]/90 dark:bg-[#0B131E]/90 border-b border-gold/20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-2">
          {/* Right: Logo + Drawer Menu Trigger */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <NavLink
              to="/"
              className="focus:outline-none min-w-0 shrink-0 inline-flex items-center transition-transform hover:scale-[1.02]"
              aria-label="مدار اليقين - الصفحة الرئيسية"
            >
              <Logo size="sm" />
            </NavLink>
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="فتح قائمة جميع الأقسام"
              title="قائمة جميع الأقسام"
              className="p-2 sm:p-2.5 rounded-xl bg-royal/5 dark:bg-white/5 text-royal dark:text-gold hover:bg-gold/15 transition-colors shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Center: Desktop Navigation Links (xl and above) */}
          <nav
            aria-label="التنقل الرئيسي"
            className="hidden xl:flex items-center gap-0.5 bg-royal/5 dark:bg-white/[0.04] p-1 rounded-2xl border border-gold/15 min-w-0"
          >
            {topBarRoutes.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`relative px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 whitespace-nowrap ${
                    isActive
                      ? 'text-white dark:text-royal'
                      : 'text-slate-700 dark:text-slate-300 hover:text-royal dark:hover:text-gold hover:bg-gold/10'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 rounded-xl royal-gradient dark:gold-gradient shadow-sm"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <Icon className={`w-3.5 h-3.5 relative z-10 ${isActive ? 'text-gold dark:text-royal' : 'text-gold'}`} />
                  <span className="relative z-10">{item.shortLabel}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Left: What's New + City indicator + Connect Phone over LAN button + Theme toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <NavLink
              to="/updates"
              title={`سجل التحديثات وما الجديد (${latestVersion})`}
              className="relative px-2.5 py-2 rounded-xl bg-gold/15 hover:bg-gold/25 border border-gold/35 text-royal dark:text-gold text-xs font-black flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span className="hidden sm:inline">ما الجديد</span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-md bg-royal/10 dark:bg-white/10 text-royal dark:text-amber-200">
                {latestVersion}
              </span>
              {unreadUpdatesCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0B131E] animate-pulse"
                  title={`${unreadUpdatesCount} تحديثات جديدة غير مقروءة`}
                />
              )}
            </NavLink>

            <NavLink
              to="/prayer"
              title="تغيير المدينة أو الموقع الجغرافي"
              className="hidden md:flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-royal/5 dark:bg-white/5 border border-gold/20 text-xs font-semibold text-royal dark:text-slate-200 hover:border-gold transition-colors max-w-[135px]"
            >
              <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
              <span className="truncate">{settings.selectedCity.nameAr}</span>
            </NavLink>

            <button
              type="button"
              onClick={() => setMobileModalOpen(true)}
              title="فتح التطبيق على الهاتف عبر الشبكة (QR Code)"
              aria-label="فتح التطبيق على الهاتف عبر الشبكة"
              className="px-2.5 py-2 rounded-xl bg-gold/15 hover:bg-gold/25 border border-gold/35 text-royal dark:text-gold text-xs font-extrabold flex items-center gap-1.5 transition-all"
            >
              <Smartphone className="w-4 h-4 text-gold shrink-0" />
              <span className="hidden lg:inline">الهاتف</span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={settings.theme === 'dark' ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع الليلي'}
              className="p-2 rounded-xl bg-royal/5 dark:bg-white/5 border border-gold/25 text-royal dark:text-gold hover:bg-gold/15 transition-all"
            >
              {settings.theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Network QR & URL Modal */}
      <MobileConnectModal
        isOpen={mobileModalOpen}
        onClose={() => setMobileModalOpen(false)}
      />

      {/* Slide-over Navigation Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[85vw] max-w-sm bg-[#F8FAF9] dark:bg-[#0B131E] border-l border-gold/25 shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="p-4 sm:p-5 border-b border-gold/20 flex items-center justify-between royal-gradient text-white">
                <div className="flex items-center gap-3 min-w-0">
                  <NavLink
                    to="/"
                    onClick={() => setDrawerOpen(false)}
                    aria-label="مدار اليقين - الصفحة الرئيسية"
                    className="focus:outline-none shrink-0"
                  >
                    <Logo size="sm" />
                  </NavLink>
                  <span className="hidden xs:inline text-xs text-gold/90 font-semibold truncate">بوابة الأقسام ({NAV_ROUTES.length})</span>
                </div>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="إغلاق القائمة"
                  className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-4 py-3 bg-gold/10 border-b border-gold/20 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <MapPin className="w-4 h-4 text-gold shrink-0" />
                  <span className="font-bold text-royal dark:text-slate-200 truncate">
                    الموقع: {settings.selectedCity.nameAr}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDrawerOpen(false);
                    setMobileModalOpen(true);
                  }}
                  className="text-gold font-extrabold hover:underline shrink-0 inline-flex items-center gap-1"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>رابط الهاتف</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
                {NAV_ROUTES.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.path === '/'
                      ? location.pathname === '/'
                      : location.pathname.startsWith(item.path);

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3.5 p-3 rounded-2xl transition-all ${
                        isActive
                          ? 'royal-gradient text-white shadow-md border border-gold/40'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-gold/10 border border-transparent'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isActive ? 'bg-gold text-royal' : 'bg-royal/10 dark:bg-white/5 text-gold'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-sm truncate">{item.label}</span>
                        <span
                          className={`text-xs truncate ${
                            isActive ? 'text-gold/90' : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {item.description}
                        </span>
                      </div>
                    </NavLink>
                  );
                })}
              </div>

              <div className="p-4 border-t border-gold/20 bg-royal/5 dark:bg-white/[0.02] flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  الوضع البصري الحالي: {settings.theme === 'dark' ? 'الليلي الفاخر' : 'النهاري اللؤلؤي'}
                </span>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="px-3 py-1.5 rounded-xl gold-gradient text-royal font-bold text-xs shadow-sm"
                >
                  تبديل المظهر
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
