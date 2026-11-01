import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, QrCode, Copy, Check, Wifi, X, Share2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface MobileConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileConnectModal: React.FC<MobileConnectModalProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [copied, setCopied] = useState(false);
  const [includeCurrentPage, setIncludeCurrentPage] = useState(false);

  const lanIp = typeof __LAN_IP__ !== 'undefined' ? __LAN_IP__ : '192.168.8.103';
  const port = window.location.port || '5173';
  const baseUrl = `http://${lanIp}:${port}`;
  const fullUrl = includeCurrentPage ? `${baseUrl}${location.pathname}${location.search}` : baseUrl;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&color=072A20&bgcolor=FFFDF7&data=${encodeURIComponent(
    fullUrl
  )}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  const handleNativeShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'مدار اليقين | Madar Al-Yaqeen',
          text: 'افتح تطبيق مدار اليقين على الهاتف عبر الشبكة المحلية',
          url: fullUrl,
        });
      } else {
        handleCopy();
      }
    } catch {
      // ignore
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/65 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            className="relative z-10 w-full max-w-md rounded-3xl bg-[#F8FAF9] dark:bg-[#0B131E] border-2 border-gold/45 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 royal-gradient text-white flex items-center justify-between gap-3 border-b border-gold/30">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gold/20 border border-gold/40 flex items-center justify-center text-gold">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg">
                    فتح التطبيق على الهاتف عبر الشبكة
                  </h3>
                  <p className="text-[11px] text-gold/90">
                    متصل على نفس شبكة الواي فاي (Wi-Fi LAN)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="إغلاق النافذة"
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 text-center">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold">
                <Wifi className="w-4 h-4 animate-pulse" />
                <span>البث الشبكي للهواتف مفعل على العنوان: {lanIp}</span>
              </div>

              {/* QR Code Frame */}
              <div className="mx-auto w-56 h-56 rounded-3xl p-3 bg-[#FFFDF7] border-2 border-gold/50 shadow-gold-glow flex items-center justify-center">
                <img
                  src={qrImageUrl}
                  alt={`رمز QR لفتح ${fullUrl} على الهاتف`}
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                وجّه كاميرا هاتفك نحو رمز <strong className="text-gold">QR Code</strong> أعلاه أو افتح الرابط التالي مباشرة في متصفح الهاتف (Safari أو Chrome):
              </p>

              {/* Toggle Current Page vs Home */}
              {location.pathname !== '/' && (
                <div className="flex items-center justify-center gap-2 text-xs">
                  <input
                    id="qr-current-page"
                    type="checkbox"
                    checked={includeCurrentPage}
                    onChange={(e) => setIncludeCurrentPage(e.target.checked)}
                    className="accent-[#C5A059] w-4 h-4 rounded cursor-pointer"
                  />
                  <label htmlFor="qr-current-page" className="font-bold text-royal dark:text-slate-200 cursor-pointer">
                    فتح نفس الصفحة الحالية ({location.pathname}) على الهاتف
                  </label>
                </div>
              )}

              {/* Direct LAN URL Copy Box */}
              <div className="p-3 rounded-2xl bg-royal/5 dark:bg-white/5 border border-gold/30 flex items-center justify-between gap-2">
                <span
                  dir="ltr"
                  className="text-xs sm:text-sm font-mono font-black text-royal dark:text-gold truncate select-all"
                >
                  {fullUrl}
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="px-3 py-1.5 rounded-xl gold-gradient text-royal text-xs font-extrabold inline-flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNativeShare}
                    title="مشاركة الرابط"
                    className="p-1.5 rounded-xl bg-gold/15 text-gold hover:bg-gold/25"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Helpful Tips for Mobile */}
              <div className="text-right p-3.5 rounded-2xl bg-gold/10 border border-gold/25 text-[11px] space-y-1 text-slate-700 dark:text-slate-200">
                <p className="font-extrabold text-royal dark:text-gold flex items-center gap-1.5">
                  <QrCode className="w-3.5 h-3.5" />
                  <span>مميزات التشغيل على الهاتف:</span>
                </p>
                <p>• تأكد أن الهاتف والكمبيوتر متصلان بنفس شبكة الـ Wi-Fi.</p>
                <p>• يمكنك اختيار «إضافة إلى الشاشة الرئيسية / Add to Home Screen» لتثبيت مدار اليقين كتطبيق مستقل على هاتفك.</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

