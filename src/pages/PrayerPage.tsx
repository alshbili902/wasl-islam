import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Compass,
  MapPin,
  Calendar,
  Clock,
  Sliders,
  Navigation,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { useApp } from '../context/AppContext';
import { CITIES_LIST, CALCULATION_METHODS_INFO } from '../data/citiesData';
import {
  computePrayerTimesForDate,
  ComputedPrayerState,
} from '../utils/prayerUtils';
import { CalculationMethodId, MadhabId } from '../types';

export const PrayerPage: React.FC = () => {
  const { settings, setCity, updateSettings, detectGpsLocation, isLocating } = useApp();
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [prayerState, setPrayerState] = useState<ComputedPrayerState>(() =>
    computePrayerTimesForDate(
      settings.selectedCity.latitude,
      settings.selectedCity.longitude,
      settings.calculationMethod,
      settings.madhab,
      new Date()
    )
  );

  const [locationMsg, setLocationMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [sensorStatus, setSensorStatus] = useState<'idle' | 'active' | 'unsupported'>('idle');
  const [customLat, setCustomLat] = useState<string>(String(settings.selectedCity.latitude));
  const [customLng, setCustomLng] = useState<string>(String(settings.selectedCity.longitude));

  // Real-time update for prayer times & countdown
  useEffect(() => {
    const update = () => {
      const now = new Date();
      // If selectedDate is today, use real-time `now`, otherwise compute for selectedDate at noon
      const isToday =
        selectedDate.getFullYear() === now.getFullYear() &&
        selectedDate.getMonth() === now.getMonth() &&
        selectedDate.getDate() === now.getDate();

      setPrayerState(
        computePrayerTimesForDate(
          settings.selectedCity.latitude,
          settings.selectedCity.longitude,
          settings.calculationMethod,
          settings.madhab,
          isToday ? now : selectedDate
        )
      );
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [settings.selectedCity, settings.calculationMethod, settings.madhab, selectedDate]);

  useEffect(() => {
    setCustomLat(String(settings.selectedCity.latitude));
    setCustomLng(String(settings.selectedCity.longitude));
  }, [settings.selectedCity]);

  // Device Orientation Sensor for Qibla Compass
  const activateCompassSensor = async () => {
    if (typeof window === 'undefined' || !('DeviceOrientationEvent' in window)) {
      setSensorStatus('unsupported');
      return;
    }

    try {
      // iOS 13+ permission check
      const anyDeviceOrientation = DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<'granted' | 'denied'>;
      };
      if (typeof anyDeviceOrientation.requestPermission === 'function') {
        const res = await anyDeviceOrientation.requestPermission();
        if (res !== 'granted') {
          setSensorStatus('unsupported');
          return;
        }
      }

      const handler = (event: DeviceOrientationEvent) => {
        const webkitCompass = (event as unknown as { webkitCompassHeading?: number })
          .webkitCompassHeading;
        if (typeof webkitCompass === 'number') {
          setDeviceHeading(Math.round(webkitCompass));
          setSensorStatus('active');
        } else if (typeof event.alpha === 'number') {
          setDeviceHeading(Math.round((360 - event.alpha) % 360));
          setSensorStatus('active');
        }
      };

      window.addEventListener('deviceorientation', handler, true);
      setSensorStatus('active');
    } catch {
      setSensorStatus('unsupported');
    }
  };

  const handleGpsClick = async () => {
    const res = await detectGpsLocation();
    setLocationMsg({ type: res.success ? 'ok' : 'err', text: res.message });
    setTimeout(() => setLocationMsg(null), 5000);
  };

  const handleApplyCustomCoords = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(customLat);
    const lng = parseFloat(customLng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setLocationMsg({ type: 'err', text: 'يرجى إدخال إحداثيات خط عرض وخط طول صحيحة.' });
      return;
    }
    setCity({
      id: 'custom-coords',
      nameAr: `إحداثيات مخصصة (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`,
      countryAr: 'تحديد يدوي',
      latitude: lat,
      longitude: lng,
      method: settings.calculationMethod,
    });
    setLocationMsg({ type: 'ok', text: 'تم تحديث المواقيت والقبلة للإحداثيات المخصصة.' });
  };

  const changeDay = (delta: number) => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + delta);
    setSelectedDate(next);
  };

  // Relative Qibla angle taking device heading into account if sensor is active
  const relativeQiblaAngle =
    deviceHeading !== null
      ? (prayerState.qiblaDirection - deviceHeading + 360) % 360
      : prayerState.qiblaDirection;

  // Generate 7-day forecast table for current week
  const weekSchedule = Array.from({ length: 7 }, (_, idx) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + idx);
    const st = computePrayerTimesForDate(
      settings.selectedCity.latitude,
      settings.selectedCity.longitude,
      settings.calculationMethod,
      settings.madhab,
      d
    );
    return {
      date: d,
      hijri: st.hijriDateFormatted,
      gregorian: st.gregorianDateFormatted,
      schedule: st.schedule,
    };
  });

  return (
    <PageWrapper
      title="مواقيت الصلاة واتجاه القبلة"
      description="حساب فلكي دقيق لمواقيت الصلوات الخمس والشروق، عداد الصلاة القادمة، التقويم الهجري والميلادي، وبوصلة اتجاه القبلة التفاعلية."
      canonicalPath="/prayer"
      breadcrumbs={[
        { label: 'الرئيسية', path: '/' },
        { label: 'مواقيت الصلاة والقبلة', path: '/prayer' }
      ]}
    >
      <div className="space-y-8">
        {/* Header Banner */}
        <section className="rounded-3xl royal-gradient text-white p-6 sm:p-8 border border-gold/35 shadow-xl relative overflow-hidden">
          <div className="islamic-pattern absolute inset-0 opacity-30 pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-bold">
                <Compass className="w-4 h-4" />
                <span>الحساب الفلكي المعتمد وبوصلة القبلة</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black">
                مواقيت الصلاة واتجاه القبلة
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 max-w-2xl">
                مواقيت الصلاة محسوبة فلكياً لحظة بلحظة وفق إحداثيات{' '}
                <strong className="text-gold">{settings.selectedCity.nameAr}</strong> ({settings.selectedCity.latitude.toFixed(4)}° شمالاً، {settings.selectedCity.longitude.toFixed(4)}° شرقاً).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleGpsClick}
                disabled={isLocating}
                className="px-4 py-3 rounded-2xl gold-gradient text-royal font-extrabold text-xs sm:text-sm shadow-gold-glow inline-flex items-center gap-2 hover:scale-[1.02] transition-transform"
              >
                <Navigation className="w-4 h-4" />
                <span>{isLocating ? 'جاري تحديد الموقع...' : 'تحديد موقعي تلقائياً (GPS)'}</span>
              </button>
            </div>
          </div>

          {locationMsg && (
            <div
              className={`mt-4 relative z-10 p-3 rounded-2xl border text-xs font-bold flex items-center gap-2 ${
                locationMsg.type === 'ok'
                  ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-200'
                  : 'bg-amber-500/20 border-amber-400/40 text-amber-200'
              }`}
            >
              {locationMsg.type === 'ok' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{locationMsg.text}</span>
            </div>
          )}
        </section>

        {/* Controls Grid: City Selector, Calculation Method, Madhab, Date Navigator */}
        <section className="glass-panel rounded-3xl p-5 sm:p-6 border border-gold/25 space-y-5">
          <div className="flex items-center gap-2 text-royal dark:text-gold font-extrabold text-base">
            <Sliders className="w-5 h-5 text-gold" />
            <h2>إعدادات الموقع الجغرافي وطريقة الحساب الفلكي</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. City Selector */}
            <div className="space-y-1.5">
              <label htmlFor="prayer-city-select" className="block text-xs font-bold text-slate-600 dark:text-slate-300">
                اختيار المدينة
              </label>
              <select
                id="prayer-city-select"
                value={
                  CITIES_LIST.some((c) => c.id === settings.selectedCity.id)
                    ? settings.selectedCity.id
                    : 'custom'
                }
                onChange={(e) => {
                  const found = CITIES_LIST.find((c) => c.id === e.target.value);
                  if (found) setCity(found);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0B131E] border border-gold/30 text-sm font-bold text-royal dark:text-white focus:outline-none focus:border-gold"
              >
                {!CITIES_LIST.some((c) => c.id === settings.selectedCity.id) && (
                  <option value="custom">{settings.selectedCity.nameAr}</option>
                )}
                {CITIES_LIST.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.nameAr} — {city.countryAr}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Calculation Method */}
            <div className="space-y-1.5">
              <label htmlFor="prayer-method-select" className="block text-xs font-bold text-slate-600 dark:text-slate-300">
                طريقة الحساب المعتمدة
              </label>
              <select
                id="prayer-method-select"
                value={settings.calculationMethod}
                onChange={(e) =>
                  updateSettings({ calculationMethod: e.target.value as CalculationMethodId })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0B131E] border border-gold/30 text-sm font-bold text-royal dark:text-white focus:outline-none focus:border-gold"
              >
                {CALCULATION_METHODS_INFO.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nameAr}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Asr Juristic Method (Madhab) */}
            <div className="space-y-1.5">
              <label htmlFor="prayer-madhab-select" className="block text-xs font-bold text-slate-600 dark:text-slate-300">
                حساب وقت العصر (المذهب الفقهي)
              </label>
              <select
                id="prayer-madhab-select"
                value={settings.madhab}
                onChange={(e) => updateSettings({ madhab: e.target.value as MadhabId })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0B131E] border border-gold/30 text-sm font-bold text-royal dark:text-white focus:outline-none focus:border-gold"
              >
                <option value="Shafi">جمهور الفقهاء (الشافعي، المالكي، الحنبلي)</option>
                <option value="Hanafi">المذهب الحنفي (ظل المثلين)</option>
              </select>
            </div>

            {/* 4. Custom Coordinates Form */}
            <form onSubmit={handleApplyCustomCoords} className="space-y-1.5">
              <span className="block text-xs font-bold text-slate-600 dark:text-slate-300">
                إحداثيات العرض والطول (اختياري)
              </span>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  step="any"
                  value={customLat}
                  onChange={(e) => setCustomLat(e.target.value)}
                  placeholder="العرض"
                  aria-label="خط العرض"
                  className="w-full min-w-0 px-2.5 py-2 rounded-xl bg-white dark:bg-[#0B131E] border border-gold/30 text-xs font-mono text-royal dark:text-white"
                />
                <input
                  type="number"
                  step="any"
                  value={customLng}
                  onChange={(e) => setCustomLng(e.target.value)}
                  placeholder="الطول"
                  aria-label="خط الطول"
                  className="w-full min-w-0 px-2.5 py-2 rounded-xl bg-white dark:bg-[#0B131E] border border-gold/30 text-xs font-mono text-royal dark:text-white"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-xl royal-gradient text-gold text-xs font-bold shrink-0"
                >
                  تطبيق
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Main Content Grid: Prayer Times & Countdown (7 cols) + Qibla Compass (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left/Right 7 cols: Hijri/Gregorian Date Bar + Next Prayer Countdown + 6 Prayer Cards */}
          <div className="lg:col-span-7 space-y-6 min-w-0">
            {/* Hijri & Gregorian Calendar Navigation Card */}
            <div className="glass-panel rounded-3xl p-5 border border-gold/25 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl royal-gradient text-gold flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-royal dark:text-white">
                    {prayerState.hijriDateFormatted}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    الموافق: {prayerState.gregorianDateFormatted}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => changeDay(-1)}
                  className="p-2 rounded-xl bg-royal/5 dark:bg-white/5 hover:bg-gold/20 text-royal dark:text-gold transition-colors"
                  title="اليوم السابق"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDate(new Date())}
                  className="px-3 py-1.5 rounded-xl bg-gold/15 text-royal dark:text-gold text-xs font-bold hover:bg-gold/25 transition-colors"
                >
                  اليوم
                </button>
                <button
                  type="button"
                  onClick={() => changeDay(1)}
                  className="p-2 rounded-xl bg-royal/5 dark:bg-white/5 hover:bg-gold/20 text-royal dark:text-gold transition-colors"
                  title="اليوم التالي"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Live Countdown Banner */}
            <div className="rounded-3xl royal-gradient text-white p-6 border border-gold/40 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-right">
                <span className="text-xs text-gold font-bold flex items-center justify-center sm:justify-start gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>الصلاة القادمة في {settings.selectedCity.nameAr}</span>
                </span>
                <h3 className="text-2xl sm:text-3xl font-black">
                  صلاة {prayerState.nextPrayer.nameAr} — {prayerState.nextPrayer.formattedTime}
                </h3>
              </div>

              <div className="px-5 py-3 rounded-2xl bg-black/30 border border-gold/40 text-center">
                <span className="text-[11px] text-slate-300 block">العداد التنازلي المباشر</span>
                <span dir="ltr" className="text-3xl font-mono font-black text-gold tracking-wider">
                  {prayerState.remainingFormatted}
                </span>
              </div>
            </div>

            {/* Six Times Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {prayerState.schedule.map((item) => {
                const isNext = prayerState.nextPrayer.id === item.id;
                const isCurrent = prayerState.currentPrayerId === item.id;

                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.01 }}
                    className={`rounded-2xl p-4 sm:p-5 border flex items-center justify-between gap-3 ${
                      isNext
                        ? 'royal-gradient text-white border-gold shadow-gold-glow'
                        : isCurrent
                        ? 'glass-panel border-gold bg-gold/10'
                        : 'glass-panel border-gold/20'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-lg font-extrabold ${
                            isNext ? 'text-gold' : 'text-royal dark:text-white'
                          }`}
                        >
                          {item.nameAr}
                        </span>
                        {isNext && (
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-gold text-royal font-extrabold">
                            الصلاة القادمة
                          </span>
                        )}
                        {!isNext && isCurrent && (
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold">
                            الوقت الحالي
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-xs ${
                          isNext ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {item.isPrayer ? 'فرض مكتوب' : 'وقت الشروق وانتهاء وقت الفجر'}
                      </p>
                    </div>

                    <div className="text-2xl font-black tracking-tight">
                      {item.formattedTime}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* 5 cols: Interactive Qibla Compass */}
          <div className="lg:col-span-5 glass-panel rounded-3xl p-6 border border-gold/30 flex flex-col justify-between gap-6">
            <div className="space-y-2 text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 text-gold text-xs font-bold border border-gold/30">
                <Compass className="w-4 h-4" />
                <span>بوصلة الكعبة المشرفة الدقيقة</span>
              </div>
              <h3 className="text-xl font-extrabold text-royal dark:text-white">
                اتجاه القبلة من {settings.selectedCity.nameAr}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                زاوية الانحراف المعيارية عن الشمال الحقيقي:{' '}
                <strong className="text-gold font-mono text-sm">{prayerState.qiblaDirection}°</strong>
              </p>
            </div>

            {/* Interactive SVG Qibla Compass Dial */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full royal-gradient border-4 border-gold/50 shadow-2xl" />
              <svg viewBox="0 0 240 240" className="w-full h-full relative z-10">
                <circle
                  cx="120"
                  cy="120"
                  r="106"
                  fill="none"
                  stroke="#C5A059"
                  strokeWidth="1.5"
                  strokeOpacity="0.4"
                />
                <circle
                  cx="120"
                  cy="120"
                  r="90"
                  fill="none"
                  stroke="#C5A059"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  strokeOpacity="0.5"
                />

                {/* Cardinal Points */}
                <text x="120" y="28" textAnchor="middle" fill="#DFC082" fontSize="13" fontWeight="bold">
                  شمال (N)
                </text>
                <text x="212" y="124" textAnchor="middle" fill="#94A3B8" fontSize="11" fontWeight="bold">
                  شرق
                </text>
                <text x="120" y="220" textAnchor="middle" fill="#94A3B8" fontSize="11" fontWeight="bold">
                  جنوب
                </text>
                <text x="28" y="124" textAnchor="middle" fill="#94A3B8" fontSize="11" fontWeight="bold">
                  غرب
                </text>

                {/* Rotating Qibla Pointer */}
                <g transform={`rotate(${relativeQiblaAngle}, 120, 120)`}>
                  {/* Golden Needle towards Makkah */}
                  <polygon points="120,34 112,120 128,120" fill="#C5A059" />
                  <polygon points="120,195 114,120 126,120" fill="#334155" />
                  {/* Kaaba Icon at Tip */}
                  <rect
                    x="111"
                    y="36"
                    width="18"
                    height="18"
                    rx="3"
                    fill="#0B131E"
                    stroke="#DFC082"
                    strokeWidth="2"
                  />
                  <line x1="111" y1="42" x2="129" y2="42" stroke="#C5A059" strokeWidth="2.5" />
                </g>

                <circle cx="120" cy="120" r="8" fill="#DFC082" stroke="#072A20" strokeWidth="3" />
              </svg>
            </div>

            <div className="space-y-3 text-center">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-royal/5 dark:bg-white/5 border border-gold/20">
                  <span className="text-slate-500 dark:text-slate-400 block">زاوية القبلة الفلكية</span>
                  <span className="text-base font-black text-gold">{prayerState.qiblaDirection}°</span>
                </div>
                <div className="p-3 rounded-2xl bg-royal/5 dark:bg-white/5 border border-gold/20">
                  <span className="text-slate-500 dark:text-slate-400 block">مستشعر البوصلة</span>
                  <span className="text-base font-black text-royal dark:text-white">
                    {deviceHeading !== null ? `${deviceHeading}°` : 'وضع الخريطة الثابتة'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={activateCompassSensor}
                className="w-full py-3 rounded-2xl bg-gold/15 hover:bg-gold/25 border border-gold/40 text-royal dark:text-gold font-extrabold text-xs transition-colors"
              >
                {sensorStatus === 'active'
                  ? 'مستشعر اتجاه الجهاز مفعل بنجاح'
                  : sensorStatus === 'unsupported'
                  ? 'مستشعر البوصلة غير متاح في هذا المتصفح — يتم عرض الزاوية الفلكية الدقيقة'
                  : 'تفعيل مستشعر البوصلة الحية (للجوال والأجهزة الداعمة)'}
              </button>
            </div>
          </div>
        </div>

        {/* 7-Day Prayer Schedule Table (Responsive Cards on Mobile, Table on Desktop) */}
        <section className="glass-panel rounded-3xl p-5 sm:p-6 border border-gold/25 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-royal dark:text-white">
                جدول مواقيت الصلاة للأيام السبعة القادمة
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                التقويم الهجري والميلادي ومواقيت الصلوات لمدينة {settings.selectedCity.nameAr}
              </p>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-gold/20">
            <table className="w-full text-right text-sm">
              <thead className="royal-gradient text-gold text-xs">
                <tr>
                  <th className="py-3.5 px-4">التاريخ الهجري</th>
                  <th className="py-3.5 px-4">الميلادي</th>
                  <th className="py-3.5 px-3">الفجر</th>
                  <th className="py-3.5 px-3">الشروق</th>
                  <th className="py-3.5 px-3">الظهر</th>
                  <th className="py-3.5 px-3">العصر</th>
                  <th className="py-3.5 px-3">المغرب</th>
                  <th className="py-3.5 px-3">العشاء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/15">
                {weekSchedule.map((day, idx) => (
                  <tr
                    key={idx}
                    className={
                      idx === 0
                        ? 'bg-gold/10 font-bold'
                        : 'hover:bg-royal/[0.03] dark:hover:bg-white/[0.02]'
                    }
                  >
                    <td className="py-3 px-4 text-royal dark:text-gold">{day.hijri}</td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-xs">
                      {day.gregorian}
                    </td>
                    {day.schedule.map((p) => (
                      <td key={p.id} className="py-3 px-3 font-mono font-bold">
                        {p.formattedTime}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Responsive Cards (Zero Horizontal Scroll) */}
          <div className="md:hidden space-y-3">
            {weekSchedule.map((day, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border space-y-2.5 ${
                  idx === 0
                    ? 'border-gold bg-gold/10'
                    : 'border-gold/20 bg-royal/[0.02] dark:bg-white/[0.02]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 border-b border-gold/15 pb-2">
                  <span className="text-xs font-extrabold text-royal dark:text-gold">
                    {day.hijri}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {day.gregorian}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {day.schedule.map((p) => (
                    <div
                      key={p.id}
                      className="p-2 rounded-xl bg-white/70 dark:bg-black/25 border border-gold/15"
                    >
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                        {p.nameAr}
                      </span>
                      <span className="text-xs font-extrabold text-royal dark:text-white">
                        {p.formattedTime}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageWrapper>
  );
};

