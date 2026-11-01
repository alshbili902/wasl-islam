import React, { useState } from 'react';
import {
  Settings,
  Sun,
  Moon,
  BookOpen,
  Compass,
  Sparkles,
  Download,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { useApp } from '../context/AppContext';
import { CITIES_LIST, CALCULATION_METHODS_INFO } from '../data/citiesData';
import { RECITERS_DATA } from '../data/recitersData';
import { CalculationMethodId, MadhabId } from '../types';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, setCity } = useApp();
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setSavedNotice(msg);
    setTimeout(() => setSavedNotice(null), 3500);
  };

  const handleExportUserData = () => {
    try {
      const payload = {
        exportedAt: new Date().toISOString(),
        settings,
        khatmahPlans: JSON.parse(localStorage.getItem('madar_khatmah_plans_v1') || '[]'),
        tasbihStats: JSON.parse(localStorage.getItem('madar_tasbih_stats_v1') || '{}'),
        adhkarProgress: JSON.parse(localStorage.getItem('madar_adhkar_progress_v1') || '{}'),
        quranBookmarks: JSON.parse(localStorage.getItem('madar_quran_bookmarks_v1') || '[]'),
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `madar-al-yaqeen-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('تم تصدير نسخة احتياطية كاملة لبياناتك وختماتك بنجاح.');
    } catch {
      // ignore
    }
  };

  const handleResetDefaults = () => {
    updateSettings({
      theme: 'dark',
      calculationMethod: 'UmmAlQura',
      madhab: 'Shafi',
      quranFontSize: 28,
      defaultReciterId: 'alafasy',
      defaultTafsirId: 'ar.muyassar',
      hapticFeedback: true,
      reduceMotion: false,
      selectedCity: CITIES_LIST[0],
    });
    showToast('تمت استعادة الإعدادات الافتراضية لمنصة مدار اليقين.');
  };

  return (
    <PageWrapper
      title="الإعدادات والتخصيص"
      description="تخصيص الهوية البصرية، الوضع النهاري والليلي، إعدادات المصحف الرقمي، وطرق حساب مواقيت الصلاة في مدار اليقين."
    >
      <div className="space-y-8">
        {/* Hero Header */}
        <section className="rounded-3xl royal-gradient text-white p-6 sm:p-8 border border-gold/35 shadow-xl relative overflow-hidden">
          <div className="islamic-pattern absolute inset-0 opacity-30 pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-bold">
                <Settings className="w-4 h-4" />
                <span>تخصيص التجربة الرقمية وحفظ التفضيلات</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black">
                إعدادات مدار اليقين
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 max-w-2xl">
                تحكم في المظهر النهاري والليلي، حجم الخط القرآني، القارئ المفضل، وطريقة الحساب الفلكي لمواقيت الصلاة؛ تُحفظ جميع إعداداتك تلقائياً.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleExportUserData}
                className="px-4 py-2.5 rounded-2xl gold-gradient text-royal font-extrabold text-xs inline-flex items-center gap-2 shadow-gold-glow"
              >
                <Download className="w-4 h-4" />
                <span>تصدير نسخة احتياطية</span>
              </button>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-gold/35 text-white font-bold text-xs inline-flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4 text-gold" />
                <span>استعادة الافتراضي</span>
              </button>
            </div>
          </div>

          {savedNotice && (
            <div className="mt-4 relative z-10 p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{savedNotice}</span>
            </div>
          )}
        </section>

        {/* Settings Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 1. Visual Identity & Accessibility */}
          <section className="glass-panel rounded-3xl p-6 border border-gold/25 space-y-5">
            <div className="flex items-center gap-2.5 border-b border-gold/20 pb-3.5">
              <Sparkles className="w-5 h-5 text-gold" />
              <h2 className="text-lg font-extrabold text-royal dark:text-white">
                المظهر البصري وإمكانية الوصول
              </h2>
            </div>

            {/* Theme Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                السمة اللونية للتطبيق
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => updateSettings({ theme: 'light' })}
                  className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${
                    settings.theme === 'light'
                      ? 'royal-gradient text-white border-gold shadow-gold-glow'
                      : 'bg-white/60 dark:bg-white/5 border-gold/20 text-royal dark:text-slate-200'
                  }`}
                >
                  <Sun className="w-5 h-5 text-gold shrink-0" />
                  <div className="text-right">
                    <p className="text-xs sm:text-sm font-extrabold">الوضع النهاري اللؤلؤي</p>
                    <p className="text-[11px] opacity-75">#F8FAF9 • إضاءة ناعمة</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => updateSettings({ theme: 'dark' })}
                  className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${
                    settings.theme === 'dark'
                      ? 'royal-gradient text-white border-gold shadow-gold-glow'
                      : 'bg-white/60 dark:bg-white/5 border-gold/20 text-royal dark:text-slate-200'
                  }`}
                >
                  <Moon className="w-5 h-5 text-gold shrink-0" />
                  <div className="text-right">
                    <p className="text-xs sm:text-sm font-extrabold">الوضع الليلي الفاخر</p>
                    <p className="text-[11px] opacity-75">#0B131E • راحة للعين</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Reduce Motion & Haptic Toggles */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-royal/5 dark:bg-white/5 border border-gold/20">
                <div>
                  <p className="text-xs sm:text-sm font-extrabold text-royal dark:text-white">
                    تقليل الحركات والانتقالات (Reduce Motion)
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    إيقاف تأثيرات الحركة لتوفير البطارية وراحة البصر
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => updateSettings({ reduceMotion: !settings.reduceMotion })}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold ${
                    settings.reduceMotion
                      ? 'gold-gradient text-royal'
                      : 'bg-slate-500/20 text-slate-500 dark:text-slate-300'
                  }`}
                >
                  {settings.reduceMotion ? 'مفعل' : 'متوقف'}
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-royal/5 dark:bg-white/5 border border-gold/20">
                <div>
                  <p className="text-xs sm:text-sm font-extrabold text-royal dark:text-white">
                    الاهتزاز اللمسي في المسبحة والأذكار
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    اهتزاز خفيف عند كل تسبيحة على الهواتف الداعمة
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => updateSettings({ hapticFeedback: !settings.hapticFeedback })}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold ${
                    settings.hapticFeedback
                      ? 'gold-gradient text-royal'
                      : 'bg-slate-500/20 text-slate-500 dark:text-slate-300'
                  }`}
                >
                  {settings.hapticFeedback ? 'مفعل' : 'متوقف'}
                </button>
              </div>
            </div>
          </section>

          {/* 2. Prayer & Location Defaults */}
          <section className="glass-panel rounded-3xl p-6 border border-gold/25 space-y-5">
            <div className="flex items-center gap-2.5 border-b border-gold/20 pb-3.5">
              <Compass className="w-5 h-5 text-gold" />
              <h2 className="text-lg font-extrabold text-royal dark:text-white">
                إعدادات المواقيت والحساب الفلكي
              </h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                  المدينة الافتراضية
                </label>
                <select
                  value={
                    CITIES_LIST.some((c) => c.id === settings.selectedCity.id)
                      ? settings.selectedCity.id
                      : CITIES_LIST[0].id
                  }
                  onChange={(e) => {
                    const found = CITIES_LIST.find((c) => c.id === e.target.value);
                    if (found) {
                      setCity(found);
                      showToast(`تم اعتماد مدينة ${found.nameAr}`);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0B131E] border border-gold/30 text-sm font-bold text-royal dark:text-white"
                >
                  {CITIES_LIST.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.nameAr} — {city.countryAr}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                  الهيئة المعتمدة لحساب الفجر والعشاء
                </label>
                <select
                  value={settings.calculationMethod}
                  onChange={(e) => {
                    updateSettings({ calculationMethod: e.target.value as CalculationMethodId });
                    showToast('تم تحديث طريقة الحساب الفلكي');
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0B131E] border border-gold/30 text-sm font-bold text-royal dark:text-white"
                >
                  {CALCULATION_METHODS_INFO.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nameAr} ({m.region})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                  المذهب الفقهي لحساب وقت العصر
                </label>
                <select
                  value={settings.madhab}
                  onChange={(e) => updateSettings({ madhab: e.target.value as MadhabId })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0B131E] border border-gold/30 text-sm font-bold text-royal dark:text-white"
                >
                  <option value="Shafi">جمهور الفقهاء (الشافعي، المالكي، الحنبلي)</option>
                  <option value="Hanafi">المذهب الحنفي</option>
                </select>
              </div>
            </div>
          </section>

          {/* 3. Mushaf Typography & Default Reciter */}
          <section className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-gold/25 space-y-5">
            <div className="flex items-center gap-2.5 border-b border-gold/20 pb-3.5">
              <BookOpen className="w-5 h-5 text-gold" />
              <h2 className="text-lg font-extrabold text-royal dark:text-white">
                تفضيلات المصحف الرقمي والتلاوة الصوتية
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                  القارئ الافتراضي للتلاوة
                </label>
                <select
                  value={settings.defaultReciterId}
                  onChange={(e) => updateSettings({ defaultReciterId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0B131E] border border-gold/30 text-sm font-bold text-royal dark:text-white"
                >
                  {RECITERS_DATA.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.nameAr} ({r.riwayah})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                  مصدر التفسير الافتراضي
                </label>
                <select
                  value={settings.defaultTafsirId}
                  onChange={(e) => updateSettings({ defaultTafsirId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0B131E] border border-gold/30 text-sm font-bold text-royal dark:text-white"
                >
                  <option value="ar.muyassar">التفسير الميسر — مجمع الملك فهد</option>
                  <option value="ar.jalalayn">تفسير الجلالين</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                  حجم خط الآيات القرآنية ({settings.quranFontSize}px)
                </label>
                <input
                  type="range"
                  min={20}
                  max={44}
                  step={2}
                  value={settings.quranFontSize}
                  onChange={(e) => updateSettings({ quranFontSize: Number(e.target.value) })}
                  className="w-full accent-[#C5A059] cursor-pointer mt-2"
                />
              </div>
            </div>

            {/* Live Quran Font Preview */}
            <div className="p-5 rounded-2xl bg-royal/[0.03] dark:bg-white/[0.03] border border-gold/25 text-center space-y-2">
              <span className="text-xs text-gold font-bold block">
                معاينة حية لحجم الخط القرآني (خط Amiri العثماني):
              </span>
              <p
                className="font-quran text-royal dark:text-amber-50 leading-loose"
                style={{ fontSize: `${settings.quranFontSize}px` }}
              >
                ﴿ إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ وَيُبَشِّرُ الْمُؤْمِنِينَ الَّذِينَ يَعْمَلُونَ الصَّالِحَاتِ أَنَّ لَهُمْ أَجْرًا كَبِيرًا ﴾
              </p>
            </div>
          </section>
        </div>
      </div>
    </PageWrapper>
  );
};

