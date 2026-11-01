import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  MoonStar,
  AlarmClock,
  Sun,
  Bell,
  BellRing,
  Volume2,
  Info,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { useApp } from '../context/AppContext';
import { computePrayerTimesForDate } from '../utils/prayerUtils';

export const SleepPage: React.FC = () => {
  const { settings } = useApp();

  const prayerState = useMemo(
    () =>
      computePrayerTimesForDate(
        settings.selectedCity.latitude,
        settings.selectedCity.longitude,
        settings.calculationMethod,
        settings.madhab,
        new Date()
      ),
    [settings.selectedCity, settings.calculationMethod, settings.madhab]
  );

  const fajrSchedule = prayerState.schedule.find((s) => s.id === 'fajr');
  const maghribSchedule = prayerState.schedule.find((s) => s.id === 'maghrib');

  // Default wake up time set to Fajr time
  const defaultFajrHHMM = useMemo(() => {
    if (!fajrSchedule) return '04:45';
    const h = String(fajrSchedule.time.getHours()).padStart(2, '0');
    const m = String(fajrSchedule.time.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  }, [fajrSchedule]);

  // Calculate Last Third of the Night (الثلث الأخير من الليل) between Maghrib and Fajr
  const lastThirdInfo = useMemo(() => {
    if (!maghribSchedule || !fajrSchedule) return { timeStr: '03:15', formatted: '03:15 ص' };
    const maghribMs = maghribSchedule.time.getTime();
    let fajrMs = fajrSchedule.time.getTime();
    if (fajrMs <= maghribMs) {
      fajrMs += 24 * 3600 * 1000;
    }
    const nightDuration = fajrMs - maghribMs;
    const lastThirdStart = new Date(fajrMs - nightDuration / 3);
    const h = String(lastThirdStart.getHours()).padStart(2, '0');
    const m = String(lastThirdStart.getMinutes()).padStart(2, '0');
    return {
      timeStr: `${h}:${m}`,
      formatted: lastThirdStart.toLocaleTimeString('ar-SA', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  }, [maghribSchedule, fajrSchedule]);

  const [wakeTime, setWakeTime] = useState<string>(defaultFajrHHMM);
  const [fallAsleepMinutes, setFallAsleepMinutes] = useState<number>(15);
  const [alarmEnabled, setAlarmEnabled] = useState<boolean>(false);
  const [alarmTime, setAlarmTime] = useState<string>(defaultFajrHHMM);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [alarmRinging, setAlarmRinging] = useState<boolean>(false);

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play gentle harmonic chime using Web Audio API
  const playGentleAlarmChime = () => {
    if (!soundEnabled) return;
    try {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = audioCtxRef.current || new Ctx();
      audioCtxRef.current = ctx;

      const now = ctx.currentTime;
      const notes = [528, 660, 792, 528];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.35);
        gain.gain.setValueAtTime(0.001, now + idx * 0.35);
        gain.gain.exponentialRampToValueAtTime(0.22, now + idx * 0.35 + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.35 + 0.32);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.35);
        osc.stop(now + idx * 0.35 + 0.34);
      });
    } catch {
      // ignore audio restrictions
    }
  };

  // Monitor browser alarm
  useEffect(() => {
    if (!alarmEnabled) return;
    const interval = setInterval(() => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      if (`${hh}:${mm}` === alarmTime && now.getSeconds() < 3) {
        setAlarmRinging(true);
        playGentleAlarmChime();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [alarmEnabled, alarmTime, soundEnabled]);

  // Calculate recommended bedtimes based on 90-minute cycles (6, 5, 4, 3 cycles)
  const sleepSuggestions = useMemo(() => {
    const [hh, mm] = wakeTime.split(':').map(Number);
    if (!Number.isFinite(hh) || !Number.isFinite(mm)) return [];

    const baseWake = new Date();
    baseWake.setHours(hh, mm, 0, 0);

    const cyclesList = [
      { cycles: 6, label: 'نوم مثالي مكتمل (6 دورات)', quality: 'ممتاز جداً', badgeColor: 'bg-emerald-500/20 text-emerald-400' },
      { cycles: 5, label: 'نوم متوازن ومريح (5 دورات)', quality: 'موصى به', badgeColor: 'bg-gold/25 text-gold' },
      { cycles: 4, label: 'نوم كافٍ للنشاط (4 دورات)', quality: 'جيد', badgeColor: 'bg-sky-500/20 text-sky-400' },
      { cycles: 3, label: 'حد أدنى قبل القيام/الفجر (3 دورات)', quality: 'مقبول', badgeColor: 'bg-amber-500/20 text-amber-400' },
    ];

    return cyclesList.map((item) => {
      const totalSleepMinutes = item.cycles * 90;
      const totalWithLatency = totalSleepMinutes + fallAsleepMinutes;
      const bedDate = new Date(baseWake.getTime() - totalWithLatency * 60 * 1000);
      const formattedBedtime = bedDate.toLocaleTimeString('ar-SA', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      const hoursText = (totalSleepMinutes / 60).toFixed(1).replace('.0', '');
      return {
        ...item,
        formattedBedtime,
        hoursText,
        totalSleepMinutes,
      };
    });
  }, [wakeTime, fallAsleepMinutes]);

  return (
    <PageWrapper
      title="حاسبة النوم والقيام الذكية"
      description="حاسبة دورات النوم التقديرية (90 دقيقة) للاستيقاظ لصلاة الفجر وقيام الليل مع منبه مدمج داخل المتصفح."
    >
      <div className="space-y-8">
        {/* Hero Banner */}
        <section className="rounded-3xl royal-gradient text-white p-6 sm:p-8 border border-gold/35 shadow-xl relative overflow-hidden">
          <div className="islamic-pattern absolute inset-0 opacity-30 pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-bold">
                <MoonStar className="w-4 h-4" />
                <span>تنظيم النوم على هدي السنة النبوية ودورات النوم</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black">
                حاسبة النوم والقيام الذكية
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 max-w-2xl">
                خطط لوقت نومك واستيقاظك لصلاة الفجر أو الثلث الأخير من الليل اعتماداً على دورات النوم التقديرية البالغة 90 دقيقة لكل دورة.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/30 border border-gold/35 text-xs space-y-1">
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-300">بداية الثلث الأخير الليلة:</span>
                <span className="font-extrabold text-gold">{lastThirdInfo.formatted}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-300">موعد أذان الفجر ({settings.selectedCity.nameAr}):</span>
                <span className="font-extrabold text-emerald-300">
                  {fajrSchedule?.formattedTime}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Scientific & Medical Disclaimer Alert (Required by Section 10) */}
        <section className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/35 flex items-start gap-3 text-xs sm:text-sm text-amber-800 dark:text-amber-200">
          <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <strong className="font-extrabold">تنبيه علمي مهم: </strong>
            حساب دورات النوم (90 دقيقة للدورة الواحدة مع مدة الاستغراق التقديرية) هو حساب تقديري استرشادي يساعد على تجنب الاستيقاظ في منتصف مرحلة النوم العميق، ولكنه ليس ضماناً طبياً قاطعاً للاستيقاظ بنشاط؛ إذ تختلف طبيعة النوم بحسب الحالة الصحية والجهد البدني لكل إنسان.
          </div>
        </section>

        {/* Main Grid: Calculator Controls & Suggested Bedtimes (7 cols) + In-Browser Alarm (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* 7 cols: Wake Time Input & Suggested Bedtimes */}
          <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 border border-gold/30 space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg sm:text-xl font-extrabold text-royal dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold" />
                <span>حدد وقت الاستيقاظ المطلوب</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="wake-time-input" className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                    وقت الاستيقاظ المستهدف
                  </label>
                  <input
                    id="wake-time-input"
                    type="time"
                    value={wakeTime}
                    onChange={(e) => setWakeTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-[#0B131E] border border-gold/35 text-lg font-black font-mono text-royal dark:text-gold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="latency-input" className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                    مدة الاستغراق التقديرية في النوم (دقيقة)
                  </label>
                  <select
                    id="latency-input"
                    value={fallAsleepMinutes}
                    onChange={(e) => setFallAsleepMinutes(Number(e.target.value))}
                    className="w-full px-4 py-3.5 rounded-2xl bg-white dark:bg-[#0B131E] border border-gold/35 text-sm font-bold text-royal dark:text-white"
                  >
                    <option value={10}>10 دقائق (نوم سريع)</option>
                    <option value={15}>15 دقيقة (المعدل الطبيعي التقديري)</option>
                    <option value={20}>20 دقيقة (استغراق متوسط)</option>
                    <option value={30}>30 دقيقة (استغراق هادئ)</option>
                  </select>
                </div>
              </div>

              {/* Quick Islamic Wake Presets */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  اختيار سريع:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setWakeTime(defaultFajrHHMM);
                    setAlarmTime(defaultFajrHHMM);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-gold/15 hover:bg-gold/25 border border-gold/30 text-xs font-extrabold text-royal dark:text-gold inline-flex items-center gap-1.5"
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>وقت صلاة الفجر ({fajrSchedule?.formattedTime})</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setWakeTime(lastThirdInfo.timeStr);
                    setAlarmTime(lastThirdInfo.timeStr);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-royal/10 dark:bg-white/10 hover:bg-gold/20 border border-gold/25 text-xs font-extrabold text-royal dark:text-slate-200 inline-flex items-center gap-1.5"
                >
                  <MoonStar className="w-3.5 h-3.5 text-gold" />
                  <span>الثلث الأخير لقيام الليل ({lastThirdInfo.formatted})</span>
                </button>
              </div>
            </div>

            {/* Suggested Bedtime Cards */}
            <div className="space-y-3 pt-4 border-t border-gold/20">
              <h3 className="text-base font-extrabold text-royal dark:text-white">
                الأوقات المقترحة للنوم (مع احتساب {fallAsleepMinutes} دقيقة للاستغراق في النوم):
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {sleepSuggestions.map((sug) => (
                  <motion.div
                    key={sug.cycles}
                    whileHover={{ y: -3 }}
                    className={`p-4 sm:p-5 rounded-2xl border flex flex-col justify-between gap-3 ${
                      sug.cycles === 5 || sug.cycles === 6
                        ? 'royal-gradient text-white border-gold/50 shadow-md'
                        : 'bg-royal/[0.03] dark:bg-white/[0.03] border-gold/25'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-extrabold ${sug.badgeColor}`}>
                        {sug.cycles} دورات نوم ({sug.hoursText} ساعات)
                      </span>
                      <span className="text-xs font-bold text-gold">{sug.quality}</span>
                    </div>

                    <div>
                      <span
                        className={`text-xs block ${
                          sug.cycles >= 5 ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        ينبغي التوجه للفراش عند الساعة:
                      </span>
                      <p className="text-2xl sm:text-3xl font-black tracking-tight mt-0.5">
                        {sug.formattedBedtime}
                      </p>
                    </div>

                    <p
                      className={`text-[11px] ${
                        sug.cycles >= 5 ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {sug.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* 5 cols: In-Browser Smart Alarm */}
          <div className="lg:col-span-5 glass-panel rounded-3xl p-6 sm:p-8 border border-gold/30 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-11 h-11 rounded-2xl royal-gradient text-gold flex items-center justify-center">
                  <AlarmClock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-extrabold text-lg text-royal dark:text-white">
                    منبه القيام والفجر في المتصفح
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    تنبيه صوتي وبصري داخل المتصفح عند حلول الوقت
                  </p>
                </div>
              </div>
            </div>

            {alarmRinging && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-4 rounded-2xl gold-gradient text-royal font-extrabold flex items-center justify-between gap-3 shadow-gold-glow"
              >
                <div className="flex items-center gap-2">
                  <BellRing className="w-6 h-6 animate-bounce" />
                  <div>
                    <p className="text-sm">حان الآن موعد الاستيقاظ المضبوط ({alarmTime})!</p>
                    <p className="text-xs opacity-85">«الحمد لله الذي أحيانا بعد ما أماتنا وإليه النشور»</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAlarmRinging(false)}
                  className="px-3 py-1.5 rounded-xl bg-royal text-gold text-xs font-bold shrink-0"
                >
                  إيقاف التنبيه
                </button>
              </motion.div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="alarm-time-input" className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                  موعد المنبه
                </label>
                <input
                  id="alarm-time-input"
                  type="time"
                  value={alarmTime}
                  onChange={(e) => setAlarmTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-[#0B131E] border border-gold/35 text-xl font-black font-mono text-royal dark:text-gold"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-royal/5 dark:bg-white/5 border border-gold/20">
                <span className="text-xs font-bold text-royal dark:text-slate-200">
                  تشغيل نغمة صوتية هادئة عند المنبه
                </span>
                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`px-3 py-1 rounded-xl text-xs font-extrabold ${
                    soundEnabled ? 'gold-gradient text-royal' : 'bg-slate-500/20 text-slate-400'
                  }`}
                >
                  {soundEnabled ? 'مفعل' : 'صامت'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setAlarmEnabled(!alarmEnabled)}
                  className={`py-3 px-4 rounded-2xl font-extrabold text-xs sm:text-sm inline-flex items-center justify-center gap-2 transition-all ${
                    alarmEnabled
                      ? 'bg-emerald-600 text-white shadow-lg'
                      : 'royal-gradient text-white border border-gold/40'
                  }`}
                >
                  {alarmEnabled ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>المنبه مفعل ({alarmTime})</span>
                    </>
                  ) : (
                    <>
                      <Bell className="w-4 h-4 text-gold" />
                      <span>تفعيل المنبه الآن</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={playGentleAlarmChime}
                  className="py-3 px-4 rounded-2xl bg-gold/15 hover:bg-gold/25 border border-gold/35 text-royal dark:text-gold font-extrabold text-xs sm:text-sm inline-flex items-center justify-center gap-2"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>تجربة صوت المنبه</span>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-royal/5 dark:bg-white/5 border border-gold/20 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <p className="font-extrabold text-royal dark:text-gold">
                من آداب النوم النبوية:
              </p>
              <ul className="space-y-1 leading-relaxed">
                <li>• الوضوء قبل النوم والنوم على الشق الأيمن.</li>
                <li>• قراءة آية الكرسي والإخلاص والمعوذتين والنفث في الكفين.</li>
                <li>• عقد النية الصالحة للاستيقاظ لصلاة الفجر وقيام الليل.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

