import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShieldCheck, BookOpenCheck, Compass, Sparkles } from 'lucide-react';
import { Logo } from './Logo';
import { NAV_ROUTES } from './Navbar';
import { useAudio } from '../../context/AudioContext';
import { getLatestWebsiteVersion } from '../../services/updatesService';

export const Footer: React.FC = () => {
  const { currentTrack } = useAudio();
  const latestVersion = getLatestWebsiteVersion();

  return (
    <footer
      className={`mt-16 border-t border-gold/25 bg-[#072A20] text-slate-200 relative overflow-hidden ${currentTrack ? 'pb-32' : 'pb-10'
        }`}
    >
      <div className="islamic-pattern absolute inset-0 opacity-30 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-gold/20">
          {/* Column 1: Brand Identity */}
          <div className="space-y-4 min-w-0">
            <NavLink
              to="/"
              className="inline-block focus:outline-none transition-transform hover:scale-105"
              aria-label="مدار اليقين - العودة إلى الرئيسية"
            >
              <Logo size="md" />
            </NavLink>
            <p className="text-sm text-slate-300 leading-relaxed">
              منصة إسلامية رقمية عالمية تجمع بين الفخامة المعمارية الإسلامية والتقنيات الحديثة، مع الالتزام التام بموثوقية المصادر الشرعية المعتمدة.
            </p>
            <div className="flex items-center gap-2 text-xs text-gold font-semibold">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>محتوى موثق من المصادر الشرعية المعتمدة</span>
            </div>
          </div>

          {/* Column 2: Encyclopedias and Academy */}
          <div className="space-y-3 min-w-0">
            <h3 className="text-base font-bold text-gold flex items-center gap-2">
              <BookOpenCheck className="w-4 h-4" />
              <span>الموسوعات والأكاديمية</span>
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { path: '/companion', label: 'رفيق المسلم اليومي' },
                { path: '/hajj-umrah', label: 'دليل الحج والعمرة التفاعلي' },
                { path: '/kids', label: 'عالم الأطفال المسلم' },
                { path: '/history-atlas', label: 'أطلس التاريخ الإسلامي' },
                { path: '/content-verifier', label: 'تحقق من صحة الحديث' },
                { path: '/daily-fiqh', label: 'فقه الحياة اليومية' },
                { path: '/quran-coach', label: 'مدرّب حفظ القرآن ومراجعته' },
                { path: '/tajweed-lab', label: 'معمل النطق والتجويد التفاعلي' },
                { path: '/quranic-arabic', label: 'أكاديمية لغة القرآن' },
                { path: '/sign-language', label: 'مركز التعليم الإسلامي بلغة الإشارة' },
                { path: '/scholars', label: 'موسوعة العلماء والمصنفات' },
                { path: '/encyclopedia', label: 'بوابة الموسوعة الإسلامية' },
                { path: '/academy', label: 'أكاديمية مدار اليقين' },
                { path: '/prophets', label: 'قصص الأنبياء عليهم السلام' },
                { path: '/seerah', label: 'السيرة النبوية الشريفة' },
                { path: '/companions', label: 'موسوعة الصحابة والصحابيات' },
                { path: '/tafsir', label: 'تفسير القرآن الكريم' },
                { path: '/hadith', label: 'موسوعة الحديث الشريف' },
                { path: '/worship', label: 'تعليم العبادات خطوة بخطوة' },
                { path: '/aqeedah', label: 'العقيدة وأسماء الله الحسنى' },
                { path: '/fatwas', label: 'الفتاوى الإسلامية الموثقة' },
              ].map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className="text-slate-300 hover:text-gold transition-colors inline-flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gold/70" />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Smart Tools & Services */}
          <div className="space-y-3 min-w-0">
            <h3 className="text-base font-bold text-gold flex items-center gap-2">
              <Compass className="w-4 h-4" />
              <span>الخدمات والعبادات الذكية</span>
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { path: '/janazah', label: 'دليل الجنائز والتعزية' },
                { path: '/audio-library', label: 'المكتبة الصوتية الإسلامية' },
                { path: '/card-studio', label: 'استوديو البطاقات الإسلامية' },
                { path: '/islamic-centers', label: 'دليل المراكز وحلقات التحفيظ' },
                { path: '/quran', label: 'المصحف الشريف والتلاوات' },
                { path: '/prayer', label: 'مواقيت الصلاة والقبلة' },
                { path: '/khatmah', label: 'الختمة القرآنية الذكية' },
                { path: '/duas', label: 'موسوعة الأدعية المأثورة' },
                { path: '/adhkar', label: 'واحة الأذكار وحصن المسلم' },
                { path: '/tasbih', label: 'المسبحة الإلكترونية' },
                { path: '/sleep', label: 'حاسبة النوم والقيام' },
                { path: '/charity', label: 'حاسبة الزكاة الشرعية' },
                { path: '/donations', label: 'بوابة التبرعات الرسمية' },
                { path: '/search', label: 'محرك البحث الإسلامي الموحد' },
                { path: '/channels', label: 'القنوات والإذاعات المباشرة' },
                { path: '/updates', label: 'سجل التحديثات وما الجديد' },
              ].map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className="text-slate-300 hover:text-gold transition-colors inline-flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gold/70" />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Authentic Sources */}
          <div className="space-y-3 min-w-0">
            <h3 className="text-base font-bold text-gold flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>المصادر الشرعية المعتمدة</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <li>• مجمع الملك فهد لطباعة المصحف الشريف والتفسير الميسر.</li>
              <li>• الرئاسة العامة للبحوث العلمية والإفتاء وهيئة كبار العلماء بالمملكة.</li>
              <li>• صحيحا البخاري ومسلم ومتن الأربعين النووية ورياض الصالحين.</li>
              <li>• تقويم أم القرى ومنصة إحسان الوطنية للعمل الخيري.</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-2">
            <p>© {new Date().getFullYear()} مدار اليقين | Madar Al-Yaqeen — جميع الحقوق محفوظة.</p>
            <span className="text-gold/40">•</span>
            <NavLink
              to="/updates"
              className="text-gold hover:text-amber-300 font-mono font-bold transition-colors inline-flex items-center gap-1"
            >
              <span>{latestVersion}</span>
              <span className="font-sans text-[11px] font-normal text-slate-300">(سجل التحديثات)</span>
            </NavLink>
          </div>
          <p className="font-quran text-sm text-gold">
            ﴿أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ﴾
          </p>
        </div>
      </div>
    </footer>
  );
};

