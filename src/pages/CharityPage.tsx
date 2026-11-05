import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  HeartHandshake,
  Calculator,
  Coins,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Droplets,
  Heart,
  Utensils,
  Sprout,
  Building2,
} from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { VERIFIED_CHARITIES } from '../data/charityData';

const CURRENCIES = [
  { code: 'SAR', nameAr: 'ريال سعودي (ر.س)', rateToUsd: 3.75, defaultGold24PerGram: 325 },
  { code: 'AED', nameAr: 'درهم إماراتي (د.إ)', rateToUsd: 3.67, defaultGold24PerGram: 318 },
  { code: 'KWD', nameAr: 'دينار كويتي (د.ك)', rateToUsd: 0.307, defaultGold24PerGram: 26.5 },
  { code: 'QAR', nameAr: 'ريال قطري (ر.ق)', rateToUsd: 3.64, defaultGold24PerGram: 316 },
  { code: 'EGP', nameAr: 'جنيه مصري (ج.م)', rateToUsd: 49.2, defaultGold24PerGram: 4250 },
  { code: 'USD', nameAr: 'دولار أمريكي ($)', rateToUsd: 1.0, defaultGold24PerGram: 86.8 },
];

export const CharityPage: React.FC = () => {
  const [currencyCode, setCurrencyCode] = useState<string>('SAR');
  const [gold24PricePerGram, setGold24PricePerGram] = useState<number>(325);
  const [cashSavings, setCashSavings] = useState<number>(45000);
  const [businessAssets, setBusinessAssets] = useState<number>(0);
  const [debtsOwedToYou, setDebtsOwedToYou] = useState<number>(0);
  const [immediateLiabilities, setImmediateLiabilities] = useState<number>(0);

  // Gold weights by Karat
  const [gold24Grams, setGold24Grams] = useState<number>(0);
  const [gold21Grams, setGold21Grams] = useState<number>(0);
  const [gold18Grams, setGold18Grams] = useState<number>(0);

  const [isFetchingGold, setIsFetchingGold] = useState<boolean>(false);
  const [goldUpdateStatus, setGoldUpdateStatus] = useState<string | null>(null);

  const selectedCurrency =
    CURRENCIES.find((c) => c.code === currencyCode) || CURRENCIES[0];

  const handleCurrencyChange = (code: string) => {
    setCurrencyCode(code);
    const found = CURRENCIES.find((c) => c.code === code);
    if (found) {
      setGold24PricePerGram(found.defaultGold24PerGram);
    }
  };

  // Live fetch of global gold price per gram (24K) from reliable public financial endpoint with graceful fallback
  const handleFetchLiveGoldPrice = async () => {
    setIsFetchingGold(true);
    setGoldUpdateStatus(null);
    try {
      // Fetch XAU (Gold Troy Ounce = 31.1034768 grams) in USD from public exchange API
      const res = await fetch('https://api.gold-api.com/price/XAU');
      if (!res.ok) throw new Error('API unavailable');
      const data = await res.json();
      const ouncePriceUsd = Number(data?.price);
      if (Number.isFinite(ouncePriceUsd) && ouncePriceUsd > 1000) {
        const gramUsd = ouncePriceUsd / 31.1034768;
        const gramInLocal = Math.round(gramUsd * selectedCurrency.rateToUsd * 100) / 100;
        setGold24PricePerGram(gramInLocal);
        setGoldUpdateStatus(
          `تم تحديث سعر جرام الذهب عيار 24 لحظياً من البورصة العالمية: ${gramInLocal} ${selectedCurrency.code}`
        );
        setIsFetchingGold(false);
        return;
      }
      throw new Error('Invalid price');
    } catch {
      setGold24PricePerGram(selectedCurrency.defaultGold24PerGram);
      setGoldUpdateStatus(
        `تم ضبط السعر المرجعي المعتمد لجرام الذهب عيار 24 (${selectedCurrency.defaultGold24PerGram} ${selectedCurrency.code}) — يمكنك أيضاً تعديله يدوياً حسب تسعيرة الصاغة المحلية.`
      );
      setIsFetchingGold(false);
    }
  };

  // Detailed Zakat Calculation (Nisab = 85g of 24K pure gold, Rate = 2.5%)
  const zakatResult = useMemo(() => {
    const NISAB_GRAMS_24K = 85;
    const nisabMonetaryValue = NISAB_GRAMS_24K * gold24PricePerGram;

    // Convert 21K and 18K gold to pure 24K equivalent
    const equivalentPureGoldGrams =
      gold24Grams + (gold21Grams * 21) / 24 + (gold18Grams * 18) / 24;
    const totalGoldValue = equivalentPureGoldGrams * gold24PricePerGram;

    const totalCashAndAssets =
      Math.max(0, cashSavings) +
      Math.max(0, businessAssets) +
      Math.max(0, debtsOwedToYou);

    const netZakatableWealth = Math.max(
      0,
      totalCashAndAssets + totalGoldValue - Math.max(0, immediateLiabilities)
    );

    const reachesNisab = netZakatableWealth >= nisabMonetaryValue && nisabMonetaryValue > 0;
    const zakatDue = reachesNisab ? netZakatableWealth * 0.025 : 0;

    return {
      NISAB_GRAMS_24K,
      nisabMonetaryValue,
      equivalentPureGoldGrams,
      totalGoldValue,
      totalCashAndAssets,
      netZakatableWealth,
      reachesNisab,
      zakatDue,
    };
  }, [
    gold24PricePerGram,
    cashSavings,
    businessAssets,
    debtsOwedToYou,
    immediateLiabilities,
    gold24Grams,
    gold21Grams,
    gold18Grams,
  ]);

  const getCharityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Droplets':
        return Droplets;
      case 'Heart':
        return Heart;
      case 'Utensils':
        return Utensils;
      case 'Sprout':
        return Sprout;
      default:
        return Building2;
    }
  };

  return (
    <PageWrapper
      title="بوابة الخير وحاسبة الزكاة الشرعية"
      description="حاسبة نصاب الزكاة الشرعية للأموال والذهب وعروض التجارة بنسبة 2.5% مع بوابة الصدقات والجهات الخيرية الرسمية المعتمدة."
      canonicalPath="/charity"
      breadcrumbs={[
        { label: 'الرئيسية', path: '/' },
        { label: 'حاسبة الزكاة وبوابة الخير', path: '/charity' }
      ]}
    >
      <div className="space-y-10">
        {/* Hero Header */}
        <section className="rounded-3xl royal-gradient text-white p-6 sm:p-8 border border-gold/35 shadow-xl relative overflow-hidden">
          <div className="islamic-pattern absolute inset-0 opacity-30 pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-bold">
                <HeartHandshake className="w-4 h-4" />
                <span>الزكاة الشرعية والجهات الخيرية المعتمدة</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black">
                بوابة الخير وحاسبة الزكاة الشرعية
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 max-w-2xl">
                ﴿وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَمَا تُقَدِّمُوا لِأَنفُسِكُم مِّنْ خَيْرٍ تَجِدُوهُ عِندَ اللَّهِ﴾ — احسب زكاة أموالك وذهبك بدقة فقهية مع روابط رسمية موثقة لأبواب الخير.
              </p>
            </div>

            <button
              type="button"
              onClick={handleFetchLiveGoldPrice}
              disabled={isFetchingGold}
              className="px-5 py-3 rounded-2xl gold-gradient text-royal font-extrabold text-xs sm:text-sm shadow-gold-glow inline-flex items-center gap-2 self-start lg:self-auto"
            >
              <RefreshCw className={`w-4 h-4 ${isFetchingGold ? 'animate-spin' : ''}`} />
              <span>
                {isFetchingGold ? 'جاري جلب سعر الذهب...' : 'تحديث سعر الذهب عالمياً'}
              </span>
            </button>
          </div>

          {goldUpdateStatus && (
            <div className="mt-4 relative z-10 p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{goldUpdateStatus}</span>
            </div>
          )}
        </section>

        {/* Part 1: Comprehensive Zakat Calculator */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* 7 cols: Inputs Form */}
          <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 border border-gold/30 space-y-6">
            <div className="flex items-center justify-between border-b border-gold/20 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl royal-gradient text-gold flex items-center justify-center">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-extrabold text-lg sm:text-xl text-royal dark:text-white">
                    بيانات الأموال والذهب الخاضعة للزكاة
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    النصاب الشرعي المعتمد = 85 جراماً من الذهب الخالص (عيار 24) • نسبة الزكاة = 2.5%
                  </p>
                </div>
              </div>
            </div>

            {/* Currency & Gold Gram Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                  العملة المستخدمة
                </label>
                <select
                  value={currencyCode}
                  onChange={(e) => handleCurrencyChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0B131E] border border-gold/30 text-sm font-bold text-royal dark:text-white"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.nameAr}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                  سعر جرام الذهب عيار 24 ({selectedCurrency.code})
                </label>
                <input
                  type="number"
                  min={1}
                  step="any"
                  value={gold24PricePerGram}
                  onChange={(e) => setGold24PricePerGram(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0B131E] border border-gold/30 text-sm font-black font-mono text-royal dark:text-gold"
                />
              </div>
            </div>

            {/* Cash & Monetary Assets */}
            <div className="space-y-3 pt-2 border-t border-gold/15">
              <h3 className="text-sm font-extrabold text-royal dark:text-gold flex items-center gap-2">
                <Coins className="w-4 h-4" />
                <span>أولاً: السيولة النقدية وعروض التجارة والديون</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                    الأموال النقدية والأرصدة البنكية المدخرة
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={cashSavings}
                    onChange={(e) => setCashSavings(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0B131E] border border-gold/30 text-sm font-mono font-bold text-royal dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                    قيمة عروض التجارة والأسهم المعدة للتجارة
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={businessAssets}
                    onChange={(e) => setBusinessAssets(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0B131E] border border-gold/30 text-sm font-mono font-bold text-royal dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                    الديون المرجوة التي لك عند الآخرين
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={debtsOwedToYou}
                    onChange={(e) => setDebtsOwedToYou(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0B131E] border border-gold/30 text-sm font-mono font-bold text-royal dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                    الديون والالتزامات الحالة التي عليك (تُخصم)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={immediateLiabilities}
                    onChange={(e) => setImmediateLiabilities(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0B131E] border border-gold/30 text-sm font-mono font-bold text-royal dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Gold Weights by Karat */}
            <div className="space-y-3 pt-2 border-t border-gold/15">
              <h3 className="text-sm font-extrabold text-royal dark:text-gold">
                ثانياً: وزن الذهب المدخر بالجرام (يُحوَّل تلقائياً إلى معيار الذهب الخالص عيار 24)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                    ذهب عيار 24 (جرام)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    value={gold24Grams}
                    onChange={(e) => setGold24Grams(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0B131E] border border-gold/30 text-sm font-mono font-bold text-royal dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                    ذهب عيار 21 (جرام)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    value={gold21Grams}
                    onChange={(e) => setGold21Grams(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0B131E] border border-gold/30 text-sm font-mono font-bold text-royal dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                    ذهب عيار 18 (جرام)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    value={gold18Grams}
                    onChange={(e) => setGold18Grams(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0B131E] border border-gold/30 text-sm font-mono font-bold text-royal dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 5 cols: Detailed Calculation Breakdown & Result */}
          <div className="lg:col-span-5 glass-panel rounded-3xl p-6 sm:p-8 border-2 border-gold/40 space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-extrabold text-gold">نتيجة الحساب الفقهي المفصل</span>
              <h2 className="text-xl sm:text-2xl font-black text-royal dark:text-white">
                بيان الزكاة المستحقة
              </h2>
            </div>

            {/* Nisab Status Banner */}
            <div
              className={`p-4 rounded-2xl border flex items-start gap-3 ${
                zakatResult.reachesNisab
                  ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-800 dark:text-emerald-200'
                  : 'bg-amber-500/15 border-amber-500/35 text-amber-800 dark:text-amber-200'
              }`}
            >
              {zakatResult.reachesNisab ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              )}
              <div className="text-xs space-y-1">
                <p className="font-extrabold text-sm">
                  {zakatResult.reachesNisab
                    ? 'الأموال بلغت النصاب الشرعي (تجب فيها الزكاة عند تمام الحول الهجري)'
                    : 'الأموال أقل من النصاب الشرعي (لا زكاة واجبة فيها حالياً)'}
                </p>
                <p>
                  قيمة النصاب الشرعي (85 جرام ذهب عيار 24) ={' '}
                  <strong>
                    {zakatResult.nisabMonetaryValue.toLocaleString('ar-SA', {
                      maximumFractionDigits: 2,
                    })}{' '}
                    {selectedCurrency.code}
                  </strong>
                </p>
              </div>
            </div>

            {/* Final Zakat Amount Highlight */}
            <div className="rounded-3xl royal-gradient text-white p-6 border border-gold/40 text-center space-y-2 shadow-lg">
              <span className="text-xs text-gold font-bold block">
                مقدار الزكاة الواجب إخراجه (2.5% — ربع العشر)
              </span>
              <div className="text-3xl sm:text-4xl font-black font-mono text-white">
                {zakatResult.zakatDue.toLocaleString('ar-SA', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                <span className="text-lg text-gold">{selectedCurrency.code}</span>
              </div>
            </div>

            {/* Step-by-Step Breakdown Table */}
            <div className="space-y-2.5 text-xs border-t border-gold/20 pt-4">
              <h3 className="font-extrabold text-royal dark:text-gold text-sm">
                طريقة الحساب بالتفصيل:
              </h3>

              <div className="flex items-center justify-between py-1.5 border-b border-gold/10">
                <span className="text-slate-500 dark:text-slate-400">إجمالي السيولة والعروض والديون المرجوة:</span>
                <span className="font-bold font-mono">
                  {zakatResult.totalCashAndAssets.toLocaleString('ar-SA')} {selectedCurrency.code}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-gold/10">
                <span className="text-slate-500 dark:text-slate-400">
                  قيمة الذهب ({zakatResult.equivalentPureGoldGrams.toFixed(1)} جرام صافي عيار 24):
                </span>
                <span className="font-bold font-mono">
                  {zakatResult.totalGoldValue.toLocaleString('ar-SA', { maximumFractionDigits: 2 })}{' '}
                  {selectedCurrency.code}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-gold/10">
                <span className="text-slate-500 dark:text-slate-400">الالتزامات والديون الحالة المخصومة:</span>
                <span className="font-bold font-mono text-rose-500">
                  - {immediateLiabilities.toLocaleString('ar-SA')} {selectedCurrency.code}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 font-extrabold text-sm text-royal dark:text-white">
                <span>صافي الوعاء الزكوي الخاضع للزكاة:</span>
                <span className="font-mono text-gold">
                  {zakatResult.netZakatableWealth.toLocaleString('ar-SA', {
                    maximumFractionDigits: 2,
                  })}{' '}
                  {selectedCurrency.code}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Part 2: Verified Official Charity & Sadaqah Gateways */}
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-royal dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-gold" />
                <span>أبواب الصدقات والجهات الرسمية المعتمدة</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                حرصاً على موثوقية العمل الخيري، نعرض حصرياً المنصات الحكومية والوطنية الرسمية المعتمدة
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {VERIFIED_CHARITIES.map((item) => {
              const Icon = getCharityIcon(item.icon);
              return (
                <motion.article
                  key={item.id}
                  whileHover={{ y: -4 }}
                  className="glass-panel rounded-3xl p-6 border border-gold/25 hover:border-gold transition-all flex flex-col justify-between gap-5"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="w-12 h-12 rounded-2xl royal-gradient text-gold flex items-center justify-center shadow-sm">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/30">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>جهة رسمية موثقة</span>
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-lg font-extrabold text-royal dark:text-white">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {item.subtitle}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-royal/[0.03] dark:bg-white/[0.03] border border-gold/20 space-y-1">
                      <p className="font-quran text-base text-royal dark:text-amber-50 leading-relaxed">
                        {item.hadithOrVerse}
                      </p>
                      <p className="text-[11px] text-gold font-bold">{item.hadithSource}</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-gold/15">
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      <strong className="text-royal dark:text-slate-200 block">
                        {item.officialPlatformName}
                      </strong>
                      <span>{item.licenseInfo}</span>
                    </div>

                    <a
                      href={item.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-2xl royal-gradient text-white font-extrabold text-xs inline-flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
                    >
                      <span>الانتقال إلى المنصة الرسمية المعتمدة</span>
                      <ExternalLink className="w-3.5 h-3.5 text-gold" />
                    </a>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </section>
      </div>
    </PageWrapper>
  );
};

