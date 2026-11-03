import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  GraduationCap,
  ScrollText,
  Users,
  Award,
  Sparkles,
  ShieldCheck,
  Compass,
  Search,
  ArrowRight,
  Shield,
  HeartHandshake,
  CheckCircle2,
  Layers,
  BookMarked,
  Tent,
  Crown,
  Landmark,
  CheckSquare
} from 'lucide-react';

interface EncyclopediaModuleCard {
  id: string;
  path: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  stats: string;
  colorGradient: string;
}

const ENCYCLOPEDIA_MODULES: EncyclopediaModuleCard[] = [
  {
    id: 'companion',
    path: '/companion',
    title: 'رفيق المسلم اليومي',
    subtitle: 'لوحة متابعة الطاعات والسنن والورد القرآني',
    description: 'مساحتك الشخصية لتنظيم صلواتك، وردك القرآني اليومي، أذكار الصباح والمساء، وصيام التطوع مع إحصائيات أسبوعية.',
    icon: CheckSquare,
    tag: 'رفيق يومي',
    stats: 'متابعة تفاعلية وإحصائيات',
    colorGradient: 'from-emerald-950 via-[#072A20] to-[#0A3D2E]',
  },
  {
    id: 'hajj-umrah',
    path: '/hajj-umrah',
    title: 'دليل الحج والعمرة التفاعلي',
    subtitle: 'دليل المناسك التفاعلي والمشاعر والمواقيت المعتمدة',
    description: 'رحلة تفاعلية خطوة بخطوة للعمرة والحج مع الأدعية المأثورة، خريطة المشاعر التفاعلية، المواقيت الخمسة، وقائمة التجهيز.',
    icon: Tent,
    tag: 'مناسك الحرمين',
    stats: 'العمرة والحج والمواقيت',
    colorGradient: 'from-[#072A20] via-teal-950 to-[#0A3D2E]',
  },
  {
    id: 'kids',
    path: '/kids',
    title: 'عالم الأطفال المسلم',
    subtitle: 'بيئة تفاعلية لتعليم القرآن والأركان والقصص والألعاب',
    description: 'عالم تعليمي آمن يضم الحروف القرآنية، قصار السور، تعليم الوضوء والصلاة، ألعاب الذكاء، وقصص الأنبياء بدون تجسيد.',
    icon: Crown,
    tag: 'للنشء الصغير',
    stats: 'ألعاب وقصص وأوسمة',
    colorGradient: 'from-amber-950 via-[#072A20] to-emerald-950',
  },
  {
    id: 'history-atlas',
    path: '/history-atlas',
    title: 'أطلس التاريخ الإسلامي',
    subtitle: 'خريطة تفاعلية كبرى والخط الزمني للحواضر والفتوحات',
    description: 'خريطة جغرافية كبرى وخط زمني من العصر النبوي وحتى العصر الحديث، توثق الحواضر والعلماء والمعارك الفاصلة.',
    icon: Landmark,
    tag: 'أطلس جغرافي',
    stats: '30+ حاضرة و 50+ حدثاً',
    colorGradient: 'from-[#072A20] via-emerald-950 to-slate-950',
  },
  {
    id: 'prophets',
    path: '/prophets',
    title: 'قصص الأنبياء عليهم السلام',
    subtitle: 'الموسوعة الشاملة لـ 25 نبياً ورسولاً',
    description: 'سير الأنبياء المذكورين في القرآن الكريم بالأدلة القرآنية والآثار الموثقة والعبر والدروس التربوية.',
    icon: ScrollText,
    tag: 'قصص موثقة',
    stats: '25 نبياً ورسولاً',
    colorGradient: 'from-emerald-950 via-[#072A20] to-emerald-900',
  },
  {
    id: 'seerah',
    path: '/seerah',
    title: 'السيرة النبوية الشريفة',
    subtitle: 'الخط الزمني الموثق لحياة المصطفى ﷺ',
    description: 'محطات حياة خير الورى من المولد الشريف في مكة إلى تأسيس الدولة والفتوحات الكبرى والوفاة مع الخرائط والأحاديث.',
    icon: Compass,
    tag: 'سيرة المصطفى',
    stats: '13 محطة مفصلية',
    colorGradient: 'from-[#072A20] via-teal-950 to-emerald-950',
  },
  {
    id: 'companions',
    path: '/companions',
    title: 'موسوعة الصحابة والصحابيات',
    subtitle: 'سير الخلفاء والعشرة وأمهات المؤمنين والرواة',
    description: 'تراجم جيل النصر والتمكين، مناقبهم، تضحياتهم، ومأثور أقوالهم المخرجة في أصح كتب السنة.',
    icon: Users,
    tag: 'جيل الصحابة',
    stats: 'تراجم محررة ومناقب',
    colorGradient: 'from-slate-900 via-[#072A20] to-emerald-950',
  },
  {
    id: 'tafsir',
    path: '/tafsir',
    title: 'موسوعة تفسير القرآن الكريم',
    subtitle: 'التفسير الميسر المعتمد من مجمع الملك فهد',
    description: 'تفسير آية بآية لجميع سور القرآن الكريم مع بيان مقاصد السور، أسباب النزول، وغريب الكلمات والربط المباشر بالمصحف.',
    icon: BookOpen,
    tag: 'التفسير الميسر',
    stats: '114 سورة كاملة',
    colorGradient: 'from-[#093528] via-[#072A20] to-teal-950',
  },
  {
    id: 'hadith',
    path: '/hadith',
    title: 'موسوعة الحديث الشريف',
    subtitle: 'الأربعون النووية ورياض الصالحين والصحيحان',
    description: 'مكتبة حديثية شاملة محققة مع أحكام التخريج وشروح الأئمة والفوائد الفقهية والمسلكية المستنبطة.',
    icon: Award,
    tag: 'السنة الصحيحة',
    stats: 'تخريج وتحقيق معتمد',
    colorGradient: 'from-[#072A20] via-emerald-950 to-slate-950',
  },
  {
    id: 'academy',
    path: '/academy',
    title: 'أكاديمية مدار اليقين',
    subtitle: '10 مسارات تعليمية تفاعلية مع شهادات إتمام',
    description: 'منظومة تفاعلية تشمل مسار المسلم الجديد، فقه الصلاة، الطهارة، التجويد، العقيدة، واختبارات قياس الفهم مع شهادات تقديرية.',
    icon: GraduationCap,
    tag: 'تعليم تفاعلي',
    stats: '10 مسارات وشهادات',
    colorGradient: 'from-[#0a382b] via-[#072A20] to-emerald-900',
  },
  {
    id: 'worship',
    path: '/worship',
    title: 'موسوعة تعليم العبادات',
    subtitle: 'دليل عملي مصور خطوة بخطوة',
    description: 'شرح تطبيقي مصور للوضوء، الغسل، صفة الصلاة النبوية من التكبير للتسليم، سجود السهو، الصيام، الزكاة، والحج والعمرة.',
    icon: HeartHandshake,
    tag: 'فقه عملي',
    stats: 'خطوات وأدلة وأخطاء شائعة',
    colorGradient: 'from-emerald-900 via-[#072A20] to-teal-900',
  },
  {
    id: 'aqeedah',
    path: '/aqeedah',
    title: 'موسوعة العقيدة الإسلامية',
    subtitle: 'أقسام التوحيد وأركان الإيمان وأسماء الله الحسنى',
    description: 'تأصيل عقدي وسطي وفق منهج أهل السنة والجماعة وهيئة كبار العلماء، مع معاني الأسماء الحسنى وضوابط التكفير وبنك الفتاوى.',
    icon: Shield,
    tag: 'العقيدة النقية',
    stats: 'التوحيد وأسماء الله',
    colorGradient: 'from-[#072A20] via-slate-900 to-emerald-950',
  },
  {
    id: 'fatwas',
    path: '/fatwas',
    title: 'موسوعة الفتاوى الإسلامية',
    subtitle: 'فتاوى رسمية موثقة من هيئة كبار العلماء والرئاسة',
    description: 'أرشيف موثق للقرارات والفتاوى الرسمية في الطهارة، الصلاة، الصيام، المعاملات والأسرة مع أرقام المراجع الأصلية.',
    icon: ShieldCheck,
    tag: 'فتاوى رسمية',
    stats: 'روابط التحقق الرسمية',
    colorGradient: 'from-teal-950 via-[#072A20] to-emerald-950',
  },
];

export const EncyclopediaHubPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Hero Header */}
      <div className="relative rounded-3xl p-8 sm:p-14 overflow-hidden bg-gradient-to-br from-[#072A20] via-[#093528] to-[#041a14] border border-gold/30 shadow-2xl text-white text-center">
        <div className="islamic-pattern absolute inset-0 opacity-15 pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-semibold mb-2">
            <Sparkles className="w-4 h-4" />
            <span>الصرح المعرفي والتعليمي الشامل</span>
          </div>

          <h1 className="font-quran text-3xl sm:text-5xl text-gold font-bold leading-tight">
            بوابة الموسوعة والأكاديمية الإسلامية
          </h1>

          <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            منظومة معرفية إسلامية موثوقة تجمع بين العلوم الشرعية المعتمدة، والسير النبوية العطرة، والتفسير الميسر، والسنة الصحيحة، والتعليم التفاعلي في مكان واحد وفق المصادر السعودية الرسمية.
          </p>

          {/* Quick Search Trigger */}
          <div className="pt-4 max-w-xl mx-auto">
            <Link
              to="/search"
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-gold/30 text-slate-200 text-xs sm:text-sm backdrop-blur-md transition-all shadow-lg"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-gold" />
                <span>ابحث في جميع الموسوعات والأكاديمية...</span>
              </div>
              <span className="px-2.5 py-1 rounded-xl bg-gold text-royal text-xs font-bold">
                البحث الموحد
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Trust & Source Badges Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gold/20 shadow-md text-center space-y-1">
          <div className="text-xl sm:text-2xl font-bold text-royal dark:text-gold font-quran">
            100% موثق
          </div>
          <div className="text-xs text-slate-500">
            مصادر معتمدة من هيئة كبار العلماء
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gold/20 shadow-md text-center space-y-1">
          <div className="text-xl sm:text-2xl font-bold text-royal dark:text-gold font-quran">
            مجمع الملك فهد
          </div>
          <div className="text-xs text-slate-500">
            المصحف والتفسير الميسر المعتمد
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gold/20 shadow-md text-center space-y-1">
          <div className="text-xl sm:text-2xl font-bold text-royal dark:text-gold font-quran">
            10 مسارات
          </div>
          <div className="text-xs text-slate-500">
            أكاديمية تعليمية وشهادات إتمام
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gold/20 shadow-md text-center space-y-1">
          <div className="text-xl sm:text-2xl font-bold text-royal dark:text-gold font-quran">
            الصحيحان
          </div>
          <div className="text-xs text-slate-500">
            أحاديث مخرجة من أصح كتب السنة
          </div>
        </div>
      </div>

      {/* Section Title */}
      <div className="flex items-center justify-between pb-2 border-b border-gold/20">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-quran text-slate-900 dark:text-slate-100">
            الموسوعات والأقسام التخصصية
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            اختر القسم الذي ترغب في استكشافه والتعلم منه
          </p>
        </div>

        <Link
          to="/search"
          className="flex items-center gap-1.5 text-xs font-bold text-gold hover:text-royal dark:hover:text-white transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span>البحث الموحد</span>
        </Link>
      </div>

      {/* Modules Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ENCYCLOPEDIA_MODULES.map((mod) => {
          const Icon = mod.icon;
          return (
            <motion.div
              key={mod.id}
              whileHover={{ y: -5 }}
              onClick={() => navigate(mod.path)}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gold/25 shadow-md hover:shadow-2xl hover:border-gold/50 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Card Top */}
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-royal/10 via-royal/5 to-transparent dark:from-gold/20 dark:to-transparent border border-gold/30 flex items-center justify-center text-royal dark:text-gold group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-gold/15 text-gold border border-gold/30">
                    {mod.tag}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold font-quran text-slate-900 dark:text-slate-100 mb-1 group-hover:text-gold transition-colors">
                  {mod.title}
                </h3>

                <p className="text-xs text-gold font-semibold mb-3">
                  {mod.subtitle}
                </p>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4 text-justify">
                  {mod.description}
                </p>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  {mod.stats}
                </span>

                <span className="flex items-center gap-1 font-bold text-royal dark:text-gold group-hover:translate-x-[-4px] transition-transform">
                  <span>تصفح القسم</span>
                  <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

