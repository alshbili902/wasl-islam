import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShieldCheck, BookOpenCheck, Compass, Sparkles } from 'lucide-react';
import { Logo } from './Logo';
import { NAV_ROUTES } from './Navbar';
import { useAudio } from '../../context/AudioContext';

export const Footer: React.FC = () => {
  const { currentTrack } = useAudio();

  return (
    <footer
      className={`mt-16 border-t border-gold/25 bg-[#072A20] text-slate-200 relative overflow-hidden ${
        currentTrack ? 'pb-32' : 'pb-10'
      }`}
    >
      <div className="islamic-pattern absolute inset-0 opacity-30 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-gold/20">
          {/* Column 1: Brand Identity */}
          <div className="space-y-4 min-w-0">
            <div className="bg-white/5 w-fit p-2.5 rounded-2xl border border-gold/20">
              <Logo size="md" />
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              منصة إسلامية رقمية عالمية تجمع بين الفخامة المعمارية الإسلامية والتقنيات الحديثة، مع الالتزام التام بموثوقية المصادر الشرعية المعتمدة.
            </p>
            <div className="flex items-center gap-2 text-xs text-gold font-semibold">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>محتوى موثق من المصادر الشرعية المعتمدة</span>
            </div>
          </div>

          {/* Column 2: Quick Navigation 1 */}
          <div className="space-y-3 min-w-0">
            <h3 className="text-base font-bold text-gold flex items-center gap-2">
              <BookOpenCheck className="w-4 h-4" />
              <span>القرآن الكريم والعبادات</span>
            </h3>
            <ul className="space-y-2 text-sm">
              {NAV_ROUTES.slice(0, 6).map((item) => (
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

          {/* Column 3: Quick Navigation 2 */}
          <div className="space-y-3 min-w-0">
            <h3 className="text-base font-bold text-gold flex items-center gap-2">
              <Compass className="w-4 h-4" />
              <span>الأدوات الذكية والبث المباشر</span>
            </h3>
            <ul className="space-y-2 text-sm">
              {NAV_ROUTES.slice(6).map((item) => (
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
              <li>• المصحف الشريف: رواية حفص بالرسم العثماني والتفسير الميسر.</li>
              <li>• الأذكار والأدعية: كتاب حصن المسلم من أذكار الكتاب والسنة مع التخريج.</li>
              <li>• مواقيت الصلاة: الحساب الفلكي المعتمد (تقويم أم القرى ورابطة العالم الإسلامي).</li>
              <li>• الزكاة والصدقات: معيار الذهب الشرعي (85 جراماً عيار 24) ومنصة إحسان الوطنية.</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} مدار اليقين | Madar Al-Yaqeen — جميع الحقوق محفوظة.</p>
          <p className="font-quran text-sm text-gold">
            ﴿أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ﴾
          </p>
        </div>
      </div>
    </footer>
  );
};

