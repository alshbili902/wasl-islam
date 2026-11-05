import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Compass,
  Clock,
  BookOpen,
  Mic2,
  CalendarCheck,
  Sparkles,
  CircleDot,
  MoonStar,
  HeartHandshake,
  Radio,
  Settings,
  Play,
  Volume2,
  MapPin,
  ChevronLeft,
  CheckCircle2,
  Share2,
  Tv,
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
import { PageWrapper } from '../components/layout/PageWrapper';
import { Logo } from '../components/layout/Logo';
import { useApp } from '../context/AppContext';
import { useAudio } from '../context/AudioContext';
import { computePrayerTimesForDate, ComputedPrayerState } from '../utils/prayerUtils';
import { DAILY_VERSES, DAILY_HADITHS } from '../data/dailyWisdomData';
import { RADIO_STATIONS, LIVE_TV_STREAMS } from '../data/liveChannelsData';
import { RECITERS_DATA } from '../data/recitersData';

export const HomePage: React.FC = () => {
  const { settings, detectGpsLocation, isLocating } = useApp();
  const { playTrack, playReciterSurah, currentTrack, isPlaying } = useAudio();

  const [prayerState, setPrayerState] = useState<ComputedPrayerState>(() =>
    computePrayerTimesForDate(
      settings.selectedCity.latitude,
      settings.selectedCity.longitude,
      settings.calculationMethod,
      settings.madhab,
      new Date()
    )
  );

  const [verseIndex, setVerseIndex] = useState<number>(() => {
    const dayOfYear = Math.floor(Date.now() / 86400000);
    return dayOfYear % DAILY_VERSES.length;
  });

  const [hadithIndex, setHadithIndex] = useState<number>(() => {
    const dayOfYear = Math.floor(Date.now() / 86400000);
    return dayOfYear % DAILY_HADITHS.length;
  });

  const [copiedMsg, setCopiedMsg] = useState<string | null>(null);

  useEffect(() => {
    const updateClock = () => {
      setPrayerState(
        computePrayerTimesForDate(
          settings.selectedCity.latitude,
          settings.selectedCity.longitude,
          settings.calculationMethod,
          settings.madhab,
          new Date()
        )
      );
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, [settings.selectedCity, settings.calculationMethod, settings.madhab]);

  const dailyVerse = DAILY_VERSES[verseIndex];
  const dailyHadith = DAILY_HADITHS[hadithIndex];

  const handlePlayDailySurah = () => {
    const reciter =
      RECITERS_DATA.find((r) => r.id === settings.defaultReciterId) || RECITERS_DATA[0];
    playReciterSurah(reciter, dailyVerse.surahNumber);
  };

  const handleShareVerse = async () => {
    const shareText = `﴿${dailyVerse.text}﴾ [${dailyVerse.surahName}: ${dailyVerse.ayahNumber}]\nالتفسير الميسر: ${dailyVerse.tafsir}\n— عبر منصة مدار اليقين`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'آية اليوم - مدار اليقين', text: shareText });
      } else {
        await navigator.clipboard.writeText(shareText);
        setCopiedMsg('تم نسخ الآية الكريمة مع التفسير');
        setTimeout(() => setCopiedMsg(null), 3000);
      }
    } catch {
      // ignore
    }
  };

  const quickServices = [
    {
      path: '/companion',
      title: 'رفيق المسلم اليومي',
      subtitle: 'لوحة متابعة الطاعات والسنن والورد القرآني',
      icon: CheckSquare,
      badge: 'جديد وتفاعلي',
    },
    {
      path: '/hajj-umrah',
      title: 'دليل الحج والعمرة التفاعلي',
      subtitle: 'دليل المناسك التفاعلي والمشاعر والمواقيت المعتمدة',
      icon: Tent,
      badge: 'دليل شامل',
    },
    {
      path: '/kids',
      title: 'عالم الأطفال المسلم',
      subtitle: 'بيئة تفاعلية لتعليم القرآن والأركان والقصص والألعاب',
      icon: Crown,
      badge: 'للنشء الصغير',
    },
    {
      path: '/history-atlas',
      title: 'أطلس التاريخ الإسلامي',
      subtitle: 'خريطة تفاعلية كبرى والخط الزمني للحواضر والفتوحات',
      icon: Landmark,
      badge: 'أطلس جغرافي',
    },
    {
      path: '/content-verifier',
      title: 'تحقق من صحة الحديث',
      subtitle: 'فحص الأحاديث والرسائل المتداولة وتخريجها المعتمد',
      icon: ShieldCheck,
      badge: 'فاحص ذكي',
    },
    {
      path: '/daily-fiqh',
      title: 'فقه الحياة اليومية المعاصرة',
      subtitle: 'أحكام النوازل المالية والطبية والتقنية والسفر',
      icon: Scale,
      badge: 'فتاوى معاصرة',
    },
    {
      path: '/janazah',
      title: 'دليل الجنائز والتعزية',
      subtitle: 'صفة الغسل والتكفين وصلاة الجنازة والدفن والتعزية',
      icon: HeartHandshake,
      badge: 'دليل فقهي',
    },
    {
      path: '/audio-library',
      title: 'المكتبة الصوتية الإسلامية',
      subtitle: 'تلاوات نادرة ودروس الأئمة والسيرة صوتياً',
      icon: Headphones,
      badge: 'صوتيات خاشعة',
    },
    {
      path: '/card-studio',
      title: 'استوديو البطاقات الإسلامية',
      subtitle: 'تصميم بطاقات دعوية وتصديرها بدقة عالية فوراً',
      icon: Palette,
      badge: 'تصميم ومشاركة',
    },
    {
      path: '/islamic-centers',
      title: 'دليل المراكز وحلقات التحفيظ',
      subtitle: 'جمعيات التحفيظ والمقارئ الإلكترونية والجوامع الكبرى',
      icon: Building2,
      badge: 'دليل شامل',
    },
    {
      path: '/scholars',
      title: 'موسوعة العلماء والمصنفات',
      subtitle: 'سير الأئمة الأربعة والمحدثين وكبار المحققين وأمهات الكتب',
      icon: GraduationCap,
      badge: 'أعلام الأمة',
    },
    {
      path: '/quran-coach',
      title: 'مدرّب حفظ القرآن ومراجعته',
      subtitle: 'جدول الحفظ والتكرار الذكي والتسميع الصوتي والمراجعة التراكمية',
      icon: Award,
      badge: 'مدرّب تفاعلي',
    },
    {
      path: '/tajweed-lab',
      title: 'معمل النطق والتجويد التفاعلي',
      subtitle: 'مخارج الحروف وصفاتها والمدود ومختبر التسجيل الصوتي والمقارنة',
      icon: Mic2,
      badge: 'معمل صوتي',
    },
    {
      path: '/quranic-arabic',
      title: 'أكاديمية لغة القرآن والمفردات',
      subtitle: 'إعراب وبلاغة الآيات وجذور الكلمات وترجمتها لـ 7 لغات عالمية',
      icon: Languages,
      badge: 'أكاديمية لغوية',
    },
    {
      path: '/sign-language',
      title: 'مركز التعليم الإسلامي بلغة الإشارة',
      subtitle: 'فيديوهات وشروح إشارية معتمدة للصم وضعاف السمع بدقة شرعية',
      icon: HeartHandshake,
      badge: 'للصم وضعاف السمع',
    },
    {
      path: '/duas',
      title: 'موسوعة الأدعية المحققة',
      subtitle: 'الأدعية القرآنية والنبوية الصحيحة والمأثورة وأدعية الأحوال والكروب',
      icon: Sparkles,
      badge: 'موسوعة شاملة',
    },
    {
      path: '/encyclopedia',
      title: 'بوابة الموسوعة الإسلامية',
      subtitle: 'بوابة العلوم الشرعية والموسوعات المتكاملة',
      icon: Layers,
      badge: 'الصرح المعرفي',
    },
    {
      path: '/academy',
      title: 'أكاديمية مدار اليقين',
      subtitle: '10 مسارات واختبارات وشهادات إتمام',
      icon: GraduationCap,
      badge: 'تعليم تفاعلي',
    },
    {
      path: '/seerah',
      title: 'السيرة النبوية الشريفة',
      subtitle: 'الخط الزمني الموثق والمعالم النبوية',
      icon: Compass,
      badge: '13 محطة كبرى',
    },
    {
      path: '/companions',
      title: 'موسوعة الصحابة والصحابيات',
      subtitle: 'سير الخلفاء والعشرة وأمهات المؤمنين',
      icon: Users,
      badge: 'مناقب موثقة',
    },
    {
      path: '/tafsir',
      title: 'تفسير القرآن الكريم',
      subtitle: 'التفسير الميسر المعتمد من مجمع الملك فهد',
      icon: BookOpen,
      badge: '114 سورة',
    },
    {
      path: '/hadith',
      title: 'موسوعة الحديث الشريف',
      subtitle: 'الأربعون النووية والصحيحان والشروح',
      icon: Award,
      badge: 'تخريج معتمد',
    },
    {
      path: '/worship',
      title: 'تعليم العبادات خطوة بخطوة',
      subtitle: 'دليل عملي مصور للوضوء والصلاة والحج',
      icon: HeartHandshake,
      badge: 'فقه عملي',
    },
    {
      path: '/aqeedah',
      title: 'موسوعة العقيدة الإسلامية',
      subtitle: 'التوحيد وأركان الإيمان وأسماء الله الحسنى',
      icon: Shield,
      badge: 'المنهج الوسطي',
    },
    {
      path: '/fatwas',
      title: 'الفتاوى الإسلامية الموثقة',
      subtitle: 'فتاوى هيئة كبار العلماء والرئاسة العامة',
      icon: ShieldCheck,
      badge: 'مصادر رسمية',
    },
    {
      path: '/search',
      title: 'محرك البحث الإسلامي الموحد',
      subtitle: 'بحث لحظي شامل في آلاف المواد والآيات',
      icon: Search,
      badge: 'بحث فوري',
    },
    {
      path: '/prayer',
      title: 'مواقيت الصلاة والقبلة',
      subtitle: 'حساب فلكي دقيق وبوصلة تفاعلية',
      icon: Compass,
      badge: `القبلة ${prayerState.qiblaDirection}°`,
    },
    {
      path: '/quran',
      title: 'المصحف الرقمي العثماني',
      subtitle: '114 سورة كاملة بالتفسير والتلاوة',
      icon: BookOpen,
      badge: 'رواية حفص',
    },
    {
      path: '/reciters',
      title: 'أطلس قراء العالم',
      subtitle: 'تصنيف القراء عبر القارات الست',
      icon: Mic2,
      badge: `${RECITERS_DATA.length} قارئاً`,
    },
    {
      path: '/khatmah',
      title: 'الختمة القرآنية الذكية',
      subtitle: 'تقسيم الورد اليومي ومتابعة الإنجاز',
      icon: CalendarCheck,
      badge: '604 صفحات',
    },
    {
      path: '/prophets',
      title: 'قصص الأنبياء عليهم السلام',
      subtitle: 'موسوعة موثقة لقصص 25 نبياً ورسولاً وعبرهم',
      icon: ScrollText,
      badge: '25 نبياً ورسولاً',
    },
    {
      path: '/adhkar',
      title: 'واحة الأذكار الموثقة',
      subtitle: 'حصن المسلم بالتخريج والعداد التفاعلي',
      icon: Sparkles,
      badge: '6 تصنيفات',
    },
    {
      path: '/tasbih',
      title: 'المسبحة الإلكترونية',
      subtitle: 'حلقة تسبيح فاخرة وإحصائيات يومية',
      icon: CircleDot,
      badge: 'عداد ذكي',
    },
    {
      path: '/sleep',
      title: 'حاسبة النوم والقيام',
      subtitle: 'دورات النوم التقديرية ومنبه الفجر',
      icon: MoonStar,
      badge: '90 د / دورة',
    },
    {
      path: '/charity',
      title: 'حاسبة الزكاة والصدقات',
      subtitle: 'حاسبة نصاب الزكاة والذهب بنسبة 2.5%',
      icon: HeartHandshake,
      badge: 'نسبة 2.5%',
    },
    {
      path: '/donations',
      title: 'بوابة التبرعات الرسمية',
      subtitle: 'إحسان، ساهم، جود الإسكان، شفاء، وتبرع بأمان',
      icon: HeartHandshake,
      badge: 'دليل رسمي',
    },
    {
      path: '/channels',
      title: 'القنوات الدينية المباشرة',
      subtitle: 'القرآن الكريم، السنة النبوية، الرسالة، وإقرأ',
      icon: Tv,
      badge: '4 قنوات HD',
    },
    {
      path: '/radio',
      title: 'الإذاعات الإسلامية العالمية',
      subtitle: 'إذاعة القرآن السعودية، نداء الإسلام، و10 تصنيفات',
      icon: Radio,
      badge: 'بث 24/7',
    },
    {
      path: '/settings',
      title: 'إعدادات مدار اليقين',
      subtitle: 'المظهر، طريقة الحساب، وحجم الخط',
      icon: Settings,
      badge: 'تخصيص شامل',
    },
  ];

  const currentScheduleItem = prayerState.schedule.find(
    (s) => s.id === prayerState.currentPrayerId
  );

  return (
    <PageWrapper
      title="الرئيسية"
      description="مدار اليقين | Madar Al-Yaqeen — المنصة الإسلامية الرقمية الشاملة: القرآن الكريم، التفسير الميسر، مواقيت الصلاة، الأذكار، الأدعية، والبث المباشر للحرمين الشريفين."
      canonicalPath="/"
      breadcrumbs={[
        { label: 'الرئيسية', path: '/' }
      ]}
    >
      <div className="space-y-10">
        {/* 1. Majestic Hero Section */}
        <section className="relative rounded-3xl royal-gradient text-white p-6 sm:p-10 lg:p-12 overflow-hidden border border-gold/35 shadow-2xl">
          <div className="islamic-pattern absolute inset-0 opacity-35 pointer-events-none" />
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-gold/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Right 7 cols: Brand Greeting & Daily Verse Preview */}
            <div className="lg:col-span-7 space-y-5 min-w-0">
              <div className="inline-flex flex-wrap items-center gap-3 px-3.5 py-1.5 rounded-full bg-white/10 border border-gold/35 text-xs font-semibold text-gold">
                <span>بسم الله الرحمن الرحيم</span>
                <span>•</span>
                <span>{prayerState.hijriDateFormatted}</span>
                <span className="hidden sm:inline">({prayerState.gregorianDateFormatted})</span>
              </div>

              <div className="flex items-center gap-4">
                <Logo size="lg" showSubtitle={false} />
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black leading-tight">
                أهلاً بك في رحاب <span className="gold-text-gradient">مدار اليقين</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-200/90 leading-relaxed max-w-2xl">
                منارتك الرقمية اليومية للسكينة واليقين؛ تجمع لك المصحف العثماني، مواقيت الصلاة الفلكية الدقيقة، أطلس قراء العالم، والأذكار النبوية الصحيحة في تجربة معمارية إسلامية فاخرة.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/quran"
                  className="px-5 py-3 rounded-2xl gold-gradient text-royal font-extrabold text-sm shadow-gold-glow hover:scale-[1.02] transition-transform inline-flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>افتح المصحف الرقمي</span>
                </Link>
                <Link
                  to="/adhkar"
                  className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-gold/35 text-white font-bold text-sm transition-colors inline-flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-gold" />
                  <span>أذكار الصباح والمساء</span>
                </Link>
                <button
                  type="button"
                  onClick={() => detectGpsLocation()}
                  disabled={isLocating}
                  className="px-4 py-3 rounded-2xl bg-black/25 hover:bg-black/40 border border-white/15 text-xs font-bold text-gold transition-colors inline-flex items-center gap-1.5"
                >
                  <MapPin className="w-4 h-4" />
                  <span>{isLocating ? 'جاري تحديد موقعك...' : 'تحديث موقعي الجغرافي'}</span>
                </button>
              </div>
            </div>

            {/* Left 5 cols: Next Prayer Live Countdown & Qibla Card */}
            <div className="lg:col-span-5 min-w-0">
              <div className="rounded-3xl bg-black/30 backdrop-blur-xl border border-gold/40 p-5 sm:p-6 space-y-5 shadow-inner">
                <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <MapPin className="w-4 h-4 text-gold shrink-0" />
                    <span className="text-xs sm:text-sm font-bold truncate">
                      {settings.selectedCity.nameAr} — {settings.selectedCity.countryAr}
                    </span>
                  </div>
                  <Link
                    to="/prayer"
                    className="text-xs text-gold hover:underline font-bold shrink-0"
                  >
                    تغيير المدينة
                  </Link>
                </div>

                <div className="text-center space-y-2 py-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      الوقت المتبقي لصلاة {prayerState.nextPrayer.nameAr} (
                      {prayerState.nextPrayer.formattedTime})
                    </span>
                  </div>

                  <div
                    dir="ltr"
                    className="text-4xl sm:text-5xl font-black font-mono tracking-wider text-white drop-shadow-sm py-1"
                  >
                    {prayerState.remainingFormatted}
                  </div>

                  <p className="text-xs text-slate-300">
                    حالة الوقت الحالي:{' '}
                    <span className="text-gold font-bold">
                      {currentScheduleItem
                        ? `وقت ${currentScheduleItem.nameAr} (دخل عند ${currentScheduleItem.formattedTime})`
                        : 'وقت العشاء / قيام الليل'}
                    </span>
                  </p>
                </div>

                {/* Qibla Direction & Prayer Link */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gold/20 border border-gold/40 flex items-center justify-center shrink-0">
                      <Compass
                        className="w-5 h-5 text-gold transition-transform duration-700"
                        style={{ transform: `rotate(${prayerState.qiblaDirection}deg)` }}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] text-slate-300">اتجاه القبلة</p>
                      <p className="text-sm font-extrabold text-gold truncate">
                        {prayerState.qiblaDirection}° من الشمال
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/prayer"
                    className="p-3 rounded-2xl bg-gold/15 hover:bg-gold/25 border border-gold/35 flex items-center justify-between gap-2 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-[11px] text-gold">البوصلة والمواقيت</p>
                      <p className="text-xs font-bold text-white truncate">عرض التفاصيل</p>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-gold shrink-0" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Five Daily Prayers + Sunrise Strip */}
        <section aria-labelledby="home-prayers-heading" className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 id="home-prayers-heading" className="text-xl sm:text-2xl font-extrabold text-royal dark:text-white flex items-center gap-2">
                <Clock className="w-6 h-6 text-gold" />
                <span>مواقيت الصلوات الخمس والشروق اليوم</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                محسوبة فلكياً لمدينة {settings.selectedCity.nameAr} • جميع الأوقات بالتوقيت المحلي
              </p>
            </div>
            <Link
              to="/prayer"
              className="text-xs sm:text-sm font-bold text-gold hover:underline inline-flex items-center gap-1"
            >
              <span>جدول الشهر وبوصلة القبلة</span>
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {prayerState.schedule.map((item) => {
              const isNext = prayerState.nextPrayer.id === item.id;
              const isCurrent = prayerState.currentPrayerId === item.id;

              return (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -3 }}
                  className={`rounded-2xl p-4 border transition-all flex flex-col justify-between gap-3 ${
                    isNext
                      ? 'royal-gradient text-white border-gold shadow-gold-glow'
                      : isCurrent
                      ? 'glass-panel border-gold/60 bg-gold/10 dark:bg-gold/10'
                      : 'glass-panel border-gold/20'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`text-sm font-extrabold ${
                        isNext ? 'text-gold' : 'text-royal dark:text-white'
                      }`}
                    >
                      {item.nameAr}
                    </span>
                    {isNext && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold text-royal font-extrabold">
                        القادمة
                      </span>
                    )}
                    {!isNext && isCurrent && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold">
                        الحالية
                      </span>
                    )}
                  </div>
                  <div className="text-xl sm:text-2xl font-black tracking-tight">
                    {item.formattedTime}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* 3. Daily Quranic Verse & Daily Authentic Hadith */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Daily Quranic Verse (7 cols) */}
          <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 flex flex-col justify-between gap-6 border border-gold/30 relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-royal/10 dark:bg-gold/15 text-royal dark:text-gold text-xs font-bold">
                  <BookOpen className="w-4 h-4 text-gold" />
                  <span>آية اليوم وتدبرها</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gold bg-gold/10 px-3 py-1 rounded-full border border-gold/25">
                    {dailyVerse.surahName} • الآية {dailyVerse.ayahNumber}
                  </span>
                  <button
                    type="button"
                    onClick={() => setVerseIndex((prev) => (prev + 1) % DAILY_VERSES.length)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-royal/5 dark:bg-white/5 hover:bg-gold/20 text-slate-600 dark:text-slate-300 font-semibold transition-colors"
                  >
                    آية أخرى
                  </button>
                </div>
              </div>

              <blockquote className="font-quran text-2xl sm:text-3xl lg:text-4xl text-royal dark:text-amber-50 leading-loose text-center py-4 px-3 rounded-2xl bg-royal/[0.03] dark:bg-white/[0.02] border border-gold/15">
                ﴿ {dailyVerse.text} ﴾
              </blockquote>

              <div className="p-4 rounded-2xl bg-gold/10 border border-gold/25 space-y-1.5">
                <p className="text-xs font-bold text-royal dark:text-gold">
                  {dailyVerse.tafsirSource}:
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  {dailyVerse.tafsir}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gold/15">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handlePlayDailySurah}
                  className="px-4 py-2.5 rounded-xl royal-gradient text-white text-xs font-bold inline-flex items-center gap-2 hover:opacity-95 transition-opacity"
                >
                  <Volume2 className="w-4 h-4 text-gold" />
                  <span>استمع إلى {dailyVerse.surahName}</span>
                </button>
                <Link
                  to={`/quran?surah=${dailyVerse.surahNumber}`}
                  className="px-4 py-2.5 rounded-xl bg-royal/5 dark:bg-white/5 hover:bg-gold/15 text-royal dark:text-slate-200 text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-gold" />
                  <span>قراءة السورة في المصحف</span>
                </Link>
              </div>

              <button
                type="button"
                onClick={handleShareVerse}
                className="px-3.5 py-2 rounded-xl border border-gold/30 text-xs font-bold text-gold hover:bg-gold/10 inline-flex items-center gap-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedMsg || 'مشاركة الآية'}</span>
              </button>
            </div>
          </div>

          {/* Daily Authentic Hadith (5 cols) */}
          <div className="lg:col-span-5 glass-panel rounded-3xl p-6 sm:p-8 flex flex-col justify-between gap-5 border border-gold/30">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-500/25">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>حديث نبوي شريف موثق</span>
                </span>
                <button
                  type="button"
                  onClick={() => setHadithIndex((prev) => (prev + 1) % DAILY_HADITHS.length)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-royal/5 dark:bg-white/5 hover:bg-gold/20 text-slate-600 dark:text-slate-300 font-semibold transition-colors"
                >
                  حديث آخر
                </button>
              </div>

              <h3 className="text-lg font-extrabold text-royal dark:text-gold">
                {dailyHadith.title}
              </h3>

              <p className="font-quran text-xl sm:text-2xl text-slate-800 dark:text-slate-100 leading-relaxed bg-royal/[0.03] dark:bg-white/[0.02] p-4 rounded-2xl border border-gold/15">
                {dailyHadith.text}
              </p>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong className="text-royal dark:text-gold">فقه الحديث: </strong>
                {dailyHadith.explanation}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-royal/5 dark:bg-white/5 border border-gold/20 text-xs space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-500 dark:text-slate-400">الراوي:</span>
                <span className="font-bold text-royal dark:text-slate-200">{dailyHadith.narrator}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-500 dark:text-slate-400">المصدر والتخريج:</span>
                <span className="font-bold text-gold">{dailyHadith.source}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-500 dark:text-slate-400">درجة الصحة:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{dailyHadith.grade}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Featured: Islamic Encyclopedia & Academy Banner */}
        <section className="relative rounded-3xl p-6 sm:p-10 overflow-hidden bg-gradient-to-br from-[#072A20] via-[#093528] to-[#041a14] border border-gold/30 shadow-2xl text-white">
          <div className="islamic-pattern absolute inset-0 opacity-15 pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 text-gold border border-gold/30 text-xs font-bold">
                <Sparkles className="w-4 h-4" />
                <span>جديد: الموسوعة والأكاديمية الإسلامية المتكاملة</span>
              </div>
              <h2 className="font-quran text-2xl sm:text-3xl text-gold font-bold">
                مرجعك الموثق في العلوم الشرعية والتعليم التفاعلي
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                ثمانية أقسام تخصصية موثقة: السيرة النبوية الشريفة، موسوعة الصحابة، تفسير القرآن الميسر، أصح الأحاديث، فقه العبادات المصور، العقيدة والأسماء الحسنى، الفتاوى المعتمدة من هيئة كبار العلماء، و10 مسارات أكاديمية تفاعلية بشهادات إتمام.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to="/encyclopedia"
                className="px-5 py-3 rounded-2xl royal-gradient bg-gold text-royal font-bold text-xs sm:text-sm shadow-xl hover:opacity-95 transition-all inline-flex items-center gap-2"
              >
                <Layers className="w-4 h-4" />
                <span>دخول بوابة الموسوعة</span>
              </Link>
              <Link
                to="/academy"
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-gold/30 text-gold font-bold text-xs sm:text-sm backdrop-blur-md transition-all inline-flex items-center gap-2"
              >
                <GraduationCap className="w-4 h-4" />
                <span>أكاديمية مدار اليقين</span>
              </Link>
              <Link
                to="/search"
                className="px-4 py-3 rounded-2xl bg-black/40 hover:bg-black/60 border border-white/15 text-slate-200 text-xs sm:text-sm transition-all inline-flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5 text-gold" />
                <span>البحث الموحد</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 4. Shortcuts to All Application Sections */}
        <section aria-labelledby="home-sections-heading" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 id="home-sections-heading" className="text-xl sm:text-2xl font-extrabold text-royal dark:text-white">
                بوابات مدار اليقين المتكاملة
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                انتقل مباشرة إلى أي خدمة في صفحة مستقلة متكاملة الوظائف
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {quickServices.map((srv) => {
              const Icon = srv.icon;
              return (
                <Link
                  key={srv.path}
                  to={srv.path}
                  className="group glass-panel rounded-2xl p-5 border border-gold/20 hover:border-gold transition-all hover:-translate-y-1 flex flex-col justify-between gap-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-11 h-11 rounded-2xl royal-gradient text-gold flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-gold/15 text-royal dark:text-gold font-bold border border-gold/25">
                      {srv.badge}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-base text-royal dark:text-white group-hover:text-gold transition-colors">
                      {srv.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {srv.subtitle}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 5. Haramain Live Broadcast & Quran Radio Quick Access */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Haramain Live Channels Preview */}
          <div className="lg:col-span-6 glass-panel rounded-3xl p-6 border border-gold/30 flex flex-col justify-between gap-5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl royal-gradient text-gold flex items-center justify-center">
                  <Tv className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-royal dark:text-white">
                    البث المباشر للحرمين الشريفين
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    متابعة حية لقناة القرآن الكريم من مكة وقناة السنة النبوية من المدينة
                  </p>
                </div>
              </div>
              <Link
                to="/channels"
                className="px-3 py-1.5 rounded-xl bg-gold/15 text-gold text-xs font-bold hover:bg-gold/25 transition-colors shrink-0"
              >
                قسم القنوات الدينية
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {LIVE_TV_STREAMS.map((stream) => (
                <Link
                  key={stream.id}
                  to={`/channels?ch=${stream.id === 'makkah-live' ? 'saudi-quran' : 'saudi-sunnah'}`}
                  className="p-4 rounded-2xl royal-gradient text-white border border-gold/35 hover:border-gold transition-all flex flex-col justify-between gap-3 group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      مباشر 24/7
                    </span>
                    <span className="text-xs text-gold font-bold">{stream.location}</span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm sm:text-base group-hover:text-gold transition-colors">
                      {stream.title}
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-2">{stream.subtitle}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Quran Radio Quick Player */}
          <div className="lg:col-span-6 glass-panel rounded-3xl p-6 border border-gold/30 flex flex-col justify-between gap-5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl royal-gradient text-gold flex items-center justify-center">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-royal dark:text-white">
                    إذاعة القرآن الكريم المباشرة
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    استمع الآن مع بقاء البث متصلاً أثناء تنقلك بين جميع صفحات التطبيق
                  </p>
                </div>
              </div>
              <Link
                to="/radio"
                className="px-3 py-1.5 rounded-xl bg-gold/15 text-gold text-xs font-bold hover:bg-gold/25 transition-colors shrink-0"
              >
                مكتبة الإذاعات (10 تصنيفات)
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {RADIO_STATIONS.slice(0, 4).map((station) => {
                const active = currentTrack?.id === station.id && isPlaying;
                return (
                  <button
                    key={station.id}
                    type="button"
                    onClick={() =>
                      playTrack({
                        id: station.id,
                        title: station.name,
                        subtitle: station.category,
                        reciterName: station.country,
                        url: station.streamUrl,
                        isLive: true,
                      })
                    }
                    className={`p-3.5 rounded-2xl border text-right transition-all flex items-center justify-between gap-3 ${
                      active
                        ? 'royal-gradient text-white border-gold shadow-gold-glow'
                        : 'bg-royal/[0.03] dark:bg-white/[0.03] border-gold/20 hover:border-gold'
                    }`}
                  >
                    <div className="min-w-0">
                      <p
                        className={`text-xs sm:text-sm font-bold truncate ${
                          active ? 'text-gold' : 'text-royal dark:text-white'
                        }`}
                      >
                        {station.name}
                      </p>
                      <p
                        className={`text-[11px] truncate ${
                          active ? 'text-slate-200' : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {station.category}
                      </p>
                    </div>
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        active ? 'gold-gradient text-royal' : 'bg-gold/15 text-gold'
                      }`}
                    >
                      <Play className="w-4 h-4" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
};

