import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, QrCode, Copy, Check, X, Share2, ExternalLink, Download, Sparkles, Globe } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import QRCode from 'qrcode';
import { SITE_CONFIG } from '../../config/siteConfig';
import { copyTextToClipboard } from '../../services/shareService';
import { useShare } from '../../context/ShareContext';

interface MobileConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileConnectModal: React.FC<MobileConnectModalProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { openShare } = useShare();
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [includeCurrentPage, setIncludeCurrentPage] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const baseUrl = SITE_CONFIG.productionUrl;
  const targetUrl = includeCurrentPage && location.pathname !== '/'
    ? `${baseUrl}${location.pathname}${location.search}`
    : baseUrl;

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    QRCode.toDataURL(targetUrl, {
      width: 480,
      margin: 2,
      color: {
        dark: '#072A20', // Royal emerald green
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'H',
    })
      .then((dataUrl) => {
        if (isMounted) {
          setQrDataUrl(dataUrl);
        }
      })
      .catch((err) => {
        console.error('Failed to generate local QR code', err);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, targetUrl]);

  const handleCopy = async () => {
    const ok = await copyTextToClipboard(targetUrl);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    const res = await openShare({
      type: 'general',
      title: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`,
      text: `افتح منصة ${SITE_CONFIG.name} الإسلامية على هاتفك المحمول عبر الرابط الرسمي المعتمد`,
      canonicalUrl: targetUrl,
    });
    if (res.status === 'shared') {
      setShared(true);
      setTimeout(() => setShared(false), 2500);
    } else if (res.status === 'fallback_opened') {
      onClose();
    }
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `madar-alyaqeen-qr.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-md rounded-3xl bg-[#FCFAF5] dark:bg-[#0B131E] border-2 border-gold/45 shadow-2xl overflow-hidden"
          >
            {/* Decorative Top Bar */}
            <div className="h-1.5 w-full gold-gradient" />

            {/* Header */}
            <div className="p-5 royal-gradient text-white flex items-center justify-between gap-3 border-b border-gold/30">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gold/20 border border-gold/40 flex items-center justify-center text-gold shadow-sm">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-gold flex items-center gap-2">
                    فتح المنصة على الهاتف
                    <Sparkles className="w-4 h-4 text-gold animate-pulse" />
                  </h3>
                  <p className="text-[11px] text-white/80">
                    الوصول المباشر لمنصة {SITE_CONFIG.name} عبر أي هاتف ذكي
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="إغلاق النافذة"
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 sm:p-6 space-y-4 text-center">
              {/* Official Verified Domain Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>الرابط الرسمي المعتمد:</span>
                <span dir="ltr" className="font-mono font-bold text-emerald-700 dark:text-emerald-300">{SITE_CONFIG.canonicalDomain}</span>
              </div>

              {/* Instruction banner */}
              <p className="text-sm text-slate-700 dark:text-slate-200 leading-snug">
                امسح الرمز بكاميرا هاتفك لفتح منصة <strong className="text-gold font-bold">{SITE_CONFIG.name}</strong> مباشرة، أو استخدم الأزرار أدناه:
              </p>

              {/* QR Code Container with Frame */}
              <div className="relative mx-auto w-56 h-56 rounded-3xl p-3 bg-white border-2 border-gold/50 shadow-gold-glow flex items-center justify-center">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`رمز QR لفتح منصة مدار اليقين على الهاتف`}
                    className="w-full h-full object-contain rounded-2xl"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 text-royal/60">
                    <QrCode className="w-10 h-10 animate-spin text-gold" />
                    <span className="text-xs">جارٍ توليد الرمز...</span>
                  </div>
                )}
              </div>

              {/* Toggle Current Page vs Home */}
              {location.pathname !== '/' && (
                <div className="flex items-center justify-center gap-2 text-xs pt-1">
                  <input
                    id="qr-current-page"
                    type="checkbox"
                    checked={includeCurrentPage}
                    onChange={(e) => setIncludeCurrentPage(e.target.checked)}
                    className="accent-[#C5A059] w-4 h-4 rounded cursor-pointer"
                  />
                  <label htmlFor="qr-current-page" className="font-medium text-royal dark:text-slate-200 cursor-pointer">
                    فتح نفس الصفحة الحالية ({location.pathname}) على الهاتف
                  </label>
                </div>
              )}

              {/* URL Display Box */}
              <div className="p-3 rounded-2xl bg-royal/5 dark:bg-white/5 border border-gold/30 flex items-center justify-between gap-2">
                <a
                  href={targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  dir="ltr"
                  className="text-xs sm:text-sm font-mono font-bold text-royal dark:text-gold hover:underline truncate select-all flex items-center gap-1.5"
                  title="فتح الرابط في نافذة جديدة"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-gold shrink-0" />
                  <span className="truncate">{targetUrl}</span>
                </a>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="px-3 py-1.5 rounded-xl gold-gradient text-royal text-xs font-bold inline-flex items-center gap-1 hover:brightness-105 active:scale-95 transition-all shadow-sm"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'تم النسخ!' : 'نسخ الرابط'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNativeShare}
                    title="مشاركة الرابط"
                    aria-label="مشاركة الرابط"
                    className="p-1.5 rounded-xl bg-gold/15 text-gold hover:bg-gold/25 transition-colors"
                  >
                    {shared ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Action Buttons: Open & Download QR */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-royal text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-royal/90 transition-colors shadow-sm"
                >
                  <ExternalLink className="w-4 h-4 text-gold" />
                  <span>فتح الموقع الآن</span>
                </a>

                <button
                  type="button"
                  onClick={handleDownloadQr}
                  disabled={!qrDataUrl}
                  className="py-2.5 px-3 rounded-xl border border-gold/40 bg-gold/10 hover:bg-gold/20 text-royal dark:text-gold text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-4 h-4 text-gold" />
                  <span>تحميل رمز QR</span>
                </button>
              </div>

              {/* Web Browser Access Tip */}
              <div className="text-right p-3.5 rounded-2xl bg-gold/10 border border-gold/25 text-[11px] space-y-1.5 text-slate-700 dark:text-slate-300">
                <p className="font-bold text-royal dark:text-gold flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-gold" />
                  <span>منصة ويب متكاملة وفورية:</span>
                </p>
                <p>• تعمل المنصة مباشرة عبر متصفح الويب على الهواتف والأجهزة اللوحية والحواسيب بدون الحاجة لأي تطبيقات خارجية.</p>
                <p>• يمكنك حفظ الرابط في المفضلة بمتصفحك أو إضافته إلى الشاشة الرئيسية للوصول السريع بلمسة واحدة.</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
