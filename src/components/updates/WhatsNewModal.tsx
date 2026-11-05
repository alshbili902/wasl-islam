import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  ExternalLink,
  Flame,
  Wrench,
  Zap,
  Bell,
  ArrowLeft,
  Eye,
  Layers,
  AlertTriangle,
  Calendar
} from 'lucide-react';
import { Logo } from '../layout/Logo';
import { WebsiteUpdate, UpdateCategory } from '../../types/updates';
import {
  getEligiblePopupUpdates,
  markUpdateAsRead,
  dismissUpdatePopup,
  acknowledgeCriticalUpdate
} from '../../services/updatesService';
import { useAudio } from '../../context/AudioContext';
import { useApp } from '../../context/AppContext';

interface WhatsNewModalProps {
  /**
   * تمرير تحديث يدوي للمعاينة الحية من لوحة الإدارة
   */
  previewUpdate?: WebsiteUpdate | null;
  /**
   * في حال فتح النافذة يدوياً من صفحة التحديثات
   */
  manualOpen?: boolean;
  /**
   * دالة إغلاق مخصصة في حال المعاينة
   */
  onManualClose?: () => void;
}

export const WhatsNewModal: React.FC<WhatsNewModalProps> = ({
  previewUpdate,
  manualOpen,
  onManualClose
}) => {
  const navigate = useNavigate();
  const { isPlaying } = useAudio();
  const { settings } = useApp();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [updatesQueue, setUpdatesQueue] = useState<WebsiteUpdate[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Check eligible updates or handle manual / preview
  const refreshEligibleUpdates = useCallback(() => {
    if (previewUpdate) {
      setUpdatesQueue([previewUpdate]);
      setCurrentIndex(0);
      setIsOpen(true);
      return;
    }

    if (manualOpen) {
      setIsOpen(true);
      return;
    }

    // Do not show popup if audio or Quran is playing!
    if (isPlaying) {
      setIsOpen(false);
      return;
    }

    const eligible = getEligiblePopupUpdates(false);
    if (eligible.length > 0) {
      setUpdatesQueue(eligible);
      setCurrentIndex(0);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [previewUpdate, manualOpen, isPlaying]);

  // Initial load check with gentle 1.5s delay
  useEffect(() => {
    if (previewUpdate || manualOpen) {
      refreshEligibleUpdates();
      return;
    }

    const timer = setTimeout(() => {
      refreshEligibleUpdates();
    }, 1500);

    return () => clearTimeout(timer);
  }, [refreshEligibleUpdates, previewUpdate, manualOpen]);

  // Listen for manual trigger events from navbar or updates page
  useEffect(() => {
    const handleTrigger = (e: any) => {
      const explicitUpdates = e.detail?.updates;
      if (explicitUpdates && explicitUpdates.length > 0) {
        setUpdatesQueue(explicitUpdates);
        setCurrentIndex(0);
        setIsOpen(true);
      } else {
        refreshEligibleUpdates();
      }
    };

    window.addEventListener('madar_open_whats_new', handleTrigger);
    window.addEventListener('madar_updates_changed', refreshEligibleUpdates);

    return () => {
      window.removeEventListener('madar_open_whats_new', handleTrigger);
      window.removeEventListener('madar_updates_changed', refreshEligibleUpdates);
    };
  }, [refreshEligibleUpdates]);

  // Close when audio begins playing to respect recitation!
  useEffect(() => {
    if (isPlaying && isOpen && !previewUpdate) {
      setIsOpen(false);
    }
  }, [isPlaying, isOpen, previewUpdate]);

  const currentUpdate: WebsiteUpdate | undefined = updatesQueue[currentIndex];

  const handleNext = () => {
    if (currentIndex < updatesQueue.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleMarkAsReadAndAdvance = () => {
    if (!currentUpdate) return;

    if (!previewUpdate) {
      if (currentUpdate.importance === 'critical') {
        acknowledgeCriticalUpdate(currentUpdate.id);
      } else {
        markUpdateAsRead(currentUpdate.id);
      }
    }

    // If more updates exist in queue, advance
    if (currentIndex < updatesQueue.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Close modal
      handleClose();
    }
  };

  const handleActionClick = () => {
    if (!currentUpdate) return;

    if (!previewUpdate) {
      markUpdateAsRead(currentUpdate.id);
    }

    setIsOpen(false);
    if (onManualClose) onManualClose();

    if (currentUpdate.actionUrl) {
      navigate(currentUpdate.actionUrl);
    }
  };

  const handleClose = () => {
    if (currentUpdate && !previewUpdate) {
      if (currentUpdate.importance === 'critical' && currentUpdate.popupVisibility?.forceUntilAcknowledged) {
        acknowledgeCriticalUpdate(currentUpdate.id);
      } else {
        dismissUpdatePopup(currentUpdate.id);
      }
    }

    setIsOpen(false);
    if (onManualClose) onManualClose();
  };

  // Keyboard navigation (Esc, Arrows)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowLeft') {
        handleNext();
      } else if (e.key === 'ArrowRight') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, updatesQueue.length]);

  if (!isOpen || !currentUpdate) return null;

  const getCategoryMeta = (cat: UpdateCategory) => {
    switch (cat) {
      case 'new_feature':
        return { label: 'ميزة جديدة', icon: Sparkles, color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
      case 'improvement':
        return { label: 'تحسين وتطوير', icon: Flame, color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'bug_fix':
        return { label: 'إصلاح ومعالجة', icon: Wrench, color: 'bg-sky-500/20 text-sky-300 border-sky-500/30' };
      case 'performance':
        return { label: 'أداء وسرعة', icon: Zap, color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
      case 'announcement':
        return { label: 'إعلان هام', icon: Bell, color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
    }
  };

  const catMeta = getCategoryMeta(currentUpdate.category);
  const CatIcon = catMeta.icon;
  const isCritical = currentUpdate.importance === 'critical';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-md">
        {/* Backdrop click */}
        <div className="fixed inset-0" onClick={handleClose} />

        <motion.div
          initial={{ opacity: 0, scale: settings.reduceMotion ? 1 : 0.92, y: settings.reduceMotion ? 0 : 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: settings.reduceMotion ? 1 : 0.95 }}
          transition={{ duration: settings.reduceMotion ? 0.05 : 0.28, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-2xl rounded-3xl bg-[#072A20] text-white border-2 border-gold/45 shadow-2xl overflow-hidden my-auto"
        >
          {/* Subtle Islamic Pattern Overlay */}
          <div className="islamic-pattern absolute inset-0 opacity-25 pointer-events-none" />

          {/* Header Banner */}
          <div className="relative z-10 px-6 sm:px-8 pt-6 pb-4 border-b border-gold/20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-2xl bg-gold/15 border border-gold/30">
                <Logo size="sm" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-gold tracking-wide">
                    ما الجديد في مدار اليقين
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-200 border border-gold/25 font-mono">
                    v{currentUpdate.version}
                  </span>
                  {previewUpdate && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-200 border border-amber-400/40 font-bold">
                      وضع المعاينة الإدارية
                    </span>
                  )}
                </div>
                <h3 className="text-base sm:text-lg font-black text-white mt-0.5 line-clamp-1">
                  {currentUpdate.title}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors border border-gold/20 shrink-0"
              aria-label="إغلاق نافذة التحديثات"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Multi-Update Bar (Shown only if multiple updates exist) */}
          {updatesQueue.length > 1 && (
            <div className="relative z-10 px-6 sm:px-8 py-2.5 bg-black/25 border-b border-gold/15 flex items-center justify-between text-xs">
              <span className="text-slate-300 font-bold">
                تحديث {currentIndex + 1} من أصل {updatesQueue.length}
              </span>

              <div className="flex items-center gap-1.5">
                {updatesQueue.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentIndex ? 'w-6 bg-gold' : 'w-2 bg-white/25 hover:bg-white/50'
                    }`}
                    title={`الانتقال إلى التحديث ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={currentIndex <= 0}
                  onClick={handlePrev}
                  className="p-1 rounded-lg hover:bg-white/10 disabled:opacity-30 text-gold"
                  title="السابق"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={currentIndex >= updatesQueue.length - 1}
                  onClick={handleNext}
                  className="p-1 rounded-lg hover:bg-white/10 disabled:opacity-30 text-gold"
                  title="التالي"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Modal Body */}
          <div className="relative z-10 p-6 sm:p-8 space-y-5 max-h-[62vh] overflow-y-auto">
            {/* Meta Tags Row */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold border ${catMeta.color}`}>
                <CatIcon className="w-3.5 h-3.5" />
                <span>{catMeta.label}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 text-slate-300 border border-gold/20 font-medium">
                <Calendar className="w-3.5 h-3.5 text-gold" />
                <span>{new Date(currentUpdate.releaseDate).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </span>

              {isCritical && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/25 text-rose-200 border border-rose-500/40 font-black animate-pulse">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>تنبيه هام</span>
                </span>
              )}
            </div>

            {/* Media Preview (If provided) */}
            {currentUpdate.mediaUrl && (
              <div className="rounded-2xl overflow-hidden border border-gold/25 bg-black/40 max-h-52 flex items-center justify-center">
                {currentUpdate.mediaType === 'video' ? (
                  <video
                    src={currentUpdate.mediaUrl}
                    controls
                    className="w-full max-h-52 object-contain"
                  />
                ) : (
                  <img
                    src={currentUpdate.mediaUrl}
                    alt={currentUpdate.title}
                    className="w-full max-h-52 object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                )}
              </div>
            )}

            {/* Main Descriptions */}
            <div className="space-y-3">
              <p className="text-sm sm:text-base font-bold text-amber-100 leading-relaxed">
                {currentUpdate.shortDescription}
              </p>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light whitespace-pre-line">
                {currentUpdate.fullDescription}
              </p>
            </div>

            {/* Highlights List */}
            {currentUpdate.highlights && currentUpdate.highlights.length > 0 && (
              <div className="p-4 rounded-2xl bg-white/5 border border-gold/25 space-y-2.5">
                <span className="text-xs font-bold text-gold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>أبرز ما يقدمه هذا التحديث:</span>
                </span>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                  {currentUpdate.highlights.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="relative z-10 px-6 sm:px-8 py-5 border-t border-gold/20 bg-black/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              to="/updates"
              onClick={handleClose}
              className="text-xs text-gold/90 hover:text-gold font-bold inline-flex items-center gap-1 transition-colors"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>استعراض سجل جميع التحديثات والإصدارات</span>
            </Link>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleMarkAsReadAndAdvance}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-gold/30 text-xs font-bold text-slate-200 hover:text-white transition-colors"
              >
                {updatesQueue.length > 1 && currentIndex < updatesQueue.length - 1
                  ? 'التالي (فهمت)'
                  : 'تم الاطلاع / فهمت'}
              </button>

              {currentUpdate.actionUrl && (
                <button
                  type="button"
                  onClick={handleActionClick}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-2xl gold-gradient text-royal font-black text-xs inline-flex items-center justify-center gap-2 shadow-gold-glow hover:scale-[1.02] transition-transform"
                >
                  <span>{currentUpdate.actionLabel || 'استكشف الميزة الآن'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

