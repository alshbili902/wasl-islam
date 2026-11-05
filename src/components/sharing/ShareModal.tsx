import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Share2,
  Download,
  Copy,
  Check,
  X,
  Sparkles,
  Smartphone,
  Square,
  Maximize2,
  Type,
  QrCode,
  Layers,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MessageCircle,
  Send,
  Twitter,
  Facebook,
  FileText,
  Sliders
} from 'lucide-react';
import { 
  ShareableContent, 
  ImageTemplateId, 
  ImageDimensionId, 
  ImageExportConfig 
} from '../../types/sharing';
import { 
  TEMPLATES_CONFIG, 
  renderContentToCanvas, 
  downloadCanvasImage 
} from '../../services/imageGeneratorService';
import { 
  formatContentAsText, 
  copyFormattedText, 
  shareCanvasImage, 
  canShareFiles,
  canShareNative,
  SOCIAL_SHARE_PROVIDERS 
} from '../../services/shareService';
import { Logo } from '../layout/Logo';
import { SITE_CONFIG } from '../../config/siteConfig';

interface ShareModalProps {
  content: ShareableContent;
  isOpen: boolean;
  onClose: () => void;
}

type ShareTab = 'image_share' | 'image_download' | 'apps' | 'text';

export const ShareModal: React.FC<ShareModalProps> = ({ content, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<ShareTab>('image_share');

  // Image Export Configuration
  const [templateId, setTemplateId] = useState<ImageTemplateId>('royal_green');
  const [dimension, setDimension] = useState<ImageDimensionId>('auto');
  const [fontSizeDelta, setFontSizeDelta] = useState<number>(0);
  const [showLogo, setShowLogo] = useState<boolean>(true);
  const [showMetadata, setShowMetadata] = useState<boolean>(true);
  const [showQr, setShowQr] = useState<boolean>(true);

  // States
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Preview Canvas reference
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderedCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Auto-dismiss feedback message
  useEffect(() => {
    if (feedbackMessage) {
      const timer = setTimeout(() => setFeedbackMessage(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [feedbackMessage]);

  // Re-render canvas whenever options change
  const updateCanvasPreview = useCallback(async () => {
    if (!content) return;
    setIsRendering(true);

    try {
      const config: ImageExportConfig = {
        templateId,
        dimension,
        fontSizeDelta,
        showLogo,
        showMetadata,
        showQr,
      };

      const highResCanvas = await renderContentToCanvas(content, config);
      renderedCanvasRef.current = highResCanvas;

      // Render to visible preview canvas with appropriate scale
      const previewCanvas = previewCanvasRef.current;
      if (previewCanvas) {
        previewCanvas.width = highResCanvas.width;
        previewCanvas.height = highResCanvas.height;
        const ctx = previewCanvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
          ctx.drawImage(highResCanvas, 0, 0);
        }
      }
    } catch (err) {
      console.error('Error generating card canvas:', err);
    } finally {
      setIsRendering(false);
    }
  }, [content, templateId, dimension, fontSizeDelta, showLogo, showMetadata, showQr]);

  // Render on mount and options change
  useEffect(() => {
    if (isOpen) {
      updateCanvasPreview();
    }
  }, [isOpen, updateCanvasPreview]);

  // Keyboard navigation (Escape to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handlers
  const handleShareImage = async () => {
    if (!renderedCanvasRef.current) return;
    setIsActionLoading(true);

    try {
      const res = await shareCanvasImage(renderedCanvasRef.current, content);
      setFeedbackMessage({
        text: res.message || 'تمت العملية بنجاح',
        type: 'success',
      });
    } catch {
      setFeedbackMessage({
        text: 'تعذر مشاركة الصورة مباشرة، يرجى استخدام خيار التنزيل',
        type: 'error',
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDownloadImage = () => {
    if (!renderedCanvasRef.current) return;
    setIsActionLoading(true);

    try {
      downloadCanvasImage(renderedCanvasRef.current, `madar-${content.type}`);
      setFeedbackMessage({
        text: 'تم بدء تنزيل الصورة بدقة فائقة PNG إلى جهازك',
        type: 'success',
      });
    } catch {
      setFeedbackMessage({
        text: 'حدث خطأ أثناء تنزيل الصورة',
        type: 'error',
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleCopyText = async () => {
    const success = await copyFormattedText(content);
    if (success) {
      setCopiedText(true);
      setFeedbackMessage({
        text: 'تم نسخ النص الشرعي المنسق بكامل توثيقه إلى الحافظة',
        type: 'success',
      });
      setTimeout(() => setCopiedText(false), 2500);
    } else {
      setFeedbackMessage({
        text: 'تعذر النسخ إلى الحافظة تلقائياً',
        type: 'error',
      });
    }
  };

  const handleCopyLink = async () => {
    const url = content.canonicalUrl || SITE_CONFIG.productionUrl;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setFeedbackMessage({
        text: 'تم نسخ الرابط المباشر إلى الحافظة',
        type: 'success',
      });
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      setFeedbackMessage({
        text: 'تعذر نسخ الرابط',
        type: 'error',
      });
    }
  };

  const handleSocialShare = (provider: typeof SOCIAL_SHARE_PROVIDERS[0]) => {
    const text = formatContentAsText(content);
    const url = content.canonicalUrl || SITE_CONFIG.productionUrl;
    const shareUrl = provider.getUrl(text, url, content.title || SITE_CONFIG.name);
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=650,height=600');
  };

  const handleNativeTextShare = async () => {
    if (!canShareNative()) return;
    try {
      await navigator.share({
        title: content.title || SITE_CONFIG.name,
        text: formatContentAsText(content),
        url: content.canonicalUrl || SITE_CONFIG.productionUrl,
      });
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        handleCopyText();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/80 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-label="نافذة المشاركة وتصدير البطاقات الإسلامية"
      >
        {/* Backdrop click to dismiss */}
        <div className="fixed inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-[#072A20] text-white border-2 border-gold/45 shadow-2xl overflow-hidden my-auto"
        >
          {/* Subtle Islamic Pattern Overlay */}
          <div className="islamic-pattern absolute inset-0 opacity-20 pointer-events-none" />

          {/* Feedback notification toast */}
          <AnimatePresence>
            {feedbackMessage && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold shadow-xl border backdrop-blur-md ${
                  feedbackMessage.type === 'success'
                    ? 'bg-emerald-900/90 text-emerald-200 border-emerald-500/50'
                    : feedbackMessage.type === 'error'
                    ? 'bg-rose-900/90 text-rose-200 border-rose-500/50'
                    : 'bg-gold/20 text-gold-light border-gold/40'
                }`}
              >
                {feedbackMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                )}
                <span>{feedbackMessage.text}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header Banner */}
          <div className="relative z-10 px-5 sm:px-7 pt-5 pb-3 border-b border-gold/20 flex items-center justify-between gap-4 bg-[#051C15]/80">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-2xl bg-gold/15 border border-gold/30 text-gold">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-gold tracking-wide">
                    منصة مدار اليقين
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/20 text-gold font-bold">
                    نظام المشاركة الموحد
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight line-clamp-1">
                  {content.title || 'مشاركة وتصدير المحتوى الإسلامي'}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors border border-white/10"
              aria-label="إغلاق النافذة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="relative z-10 px-4 sm:px-6 pt-3 pb-2 border-b border-gold/15 bg-[#06241B]/70 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('image_share')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'image_share'
                  ? 'bg-gold text-[#072A20] shadow-md shadow-gold/20'
                  : 'bg-white/5 text-white/75 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span>مشاركة كصورة</span>
            </button>

            <button
              onClick={() => setActiveTab('image_download')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'image_download'
                  ? 'bg-gold text-[#072A20] shadow-md shadow-gold/20'
                  : 'bg-white/5 text-white/75 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>تنزيل البطاقة (PNG)</span>
            </button>

            <button
              onClick={() => setActiveTab('apps')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'apps'
                  ? 'bg-gold text-[#072A20] shadow-md shadow-gold/20'
                  : 'bg-white/5 text-white/75 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>مشاركة عبر التطبيقات</span>
            </button>

            <button
              onClick={() => setActiveTab('text')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'text'
                  ? 'bg-gold text-[#072A20] shadow-md shadow-gold/20'
                  : 'bg-white/5 text-white/75 hover:bg-white/10 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>نسخ كنص منسق</span>
            </button>
          </div>

          {/* Modal Main Body */}
          <div className="relative z-10 p-4 sm:p-6 overflow-y-auto max-h-[calc(92vh-180px)] space-y-6">
            
            {/* TAB 1: SHARE AS IMAGE & TAB 2: DOWNLOAD AS IMAGE */}
            {(activeTab === 'image_share' || activeTab === 'image_download') && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Visual Canvas Preview Column (5 cols on lg) */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center p-3 rounded-2xl bg-black/40 border border-gold/20">
                  <div className="w-full flex items-center justify-between text-xs text-gold/80 mb-2 px-1">
                    <span className="flex items-center gap-1.5 font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                      معاينة البطاقة الحية
                    </span>
                    {isRendering && (
                      <span className="text-[11px] text-gold animate-pulse">
                        جاري المعالجة...
                      </span>
                    )}
                  </div>

                  {/* Responsive Canvas Container */}
                  <div className="relative w-full flex items-center justify-center min-h-[280px] max-h-[460px] overflow-hidden rounded-xl bg-[#04140F]">
                    <canvas
                      ref={previewCanvasRef}
                      className="max-w-full max-h-[440px] w-auto h-auto object-contain rounded-lg shadow-2xl transition-transform duration-200"
                    />

                    {isRendering && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                        <div className="w-8 h-8 border-3 border-gold border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>

                  {/* Quick Action below preview */}
                  <div className="w-full mt-3">
                    {activeTab === 'image_share' ? (
                      <button
                        onClick={handleShareImage}
                        disabled={isActionLoading || isRendering}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-[#072A20] font-black text-sm shadow-lg shadow-gold/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>مشاركة كصورة الآن</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleDownloadImage}
                        disabled={isActionLoading || isRendering}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-[#072A20] font-black text-sm shadow-lg shadow-gold/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
                      >
                        <Download className="w-4 h-4" />
                        <span>تنزيل الصورة بدقة فائقة (PNG)</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Customization Controls Column (7 cols on lg) */}
                <div className="lg:col-span-7 space-y-5">
                  
                  {/* 1. Style / Template Picker */}
                  <div>
                    <label className="block text-xs font-bold text-gold mb-2.5 flex items-center gap-1.5">
                      <Layers className="w-4 h-4" />
                      اختر قالب التصميم الإسلامي (7 طُرز فاخرة):
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {Object.values(TEMPLATES_CONFIG).map((tmpl) => {
                        const isSelected = templateId === tmpl.id;
                        return (
                          <button
                            key={tmpl.id}
                            type="button"
                            onClick={() => setTemplateId(tmpl.id)}
                            className={`p-2.5 rounded-xl border text-right transition-all flex flex-col justify-between ${
                              isSelected
                                ? 'border-gold bg-gold/20 shadow-md shadow-gold/15 ring-1 ring-gold'
                                : 'border-white/10 bg-white/5 hover:bg-white/10 text-white/80'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1 w-full mb-1.5">
                              <span className="text-xs font-bold truncate">
                                {tmpl.nameAr}
                              </span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-gold flex-shrink-0" />}
                            </div>

                            <div className="flex items-center gap-1.5">
                              <span 
                                className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-xs" 
                                style={{ background: tmpl.bgGradientStart }} 
                              />
                              <span 
                                className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-xs" 
                                style={{ background: tmpl.accentGold }} 
                              />
                              <span className="text-[10px] text-white/50 truncate">
                                {tmpl.nameEn}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Dimensions Selector */}
                  <div>
                    <label className="block text-xs font-bold text-gold mb-2 flex items-center gap-1.5">
                      <Maximize2 className="w-4 h-4" />
                      أبعاد وتنسيق البطاقة:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <button
                        type="button"
                        onClick={() => setDimension('auto')}
                        className={`p-2 rounded-xl border text-center transition-all ${
                          dimension === 'auto'
                            ? 'border-gold bg-gold/20 text-gold font-bold ring-1 ring-gold'
                            : 'border-white/10 bg-white/5 hover:bg-white/10 text-white/70 text-xs'
                        }`}
                      >
                        <Sparkles className="w-4 h-4 mx-auto mb-1 text-gold" />
                        <div className="text-xs font-bold">متكيف تلقائياً</div>
                        <div className="text-[10px] opacity-60">حسب طول النص</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDimension('story')}
                        className={`p-2 rounded-xl border text-center transition-all ${
                          dimension === 'story'
                            ? 'border-gold bg-gold/20 text-gold font-bold ring-1 ring-gold'
                            : 'border-white/10 bg-white/5 hover:bg-white/10 text-white/70 text-xs'
                        }`}
                      >
                        <Smartphone className="w-4 h-4 mx-auto mb-1 text-gold" />
                        <div className="text-xs font-bold">ستوري / حالة</div>
                        <div className="text-[10px] opacity-60">1080 × 1920</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDimension('square')}
                        className={`p-2 rounded-xl border text-center transition-all ${
                          dimension === 'square'
                            ? 'border-gold bg-gold/20 text-gold font-bold ring-1 ring-gold'
                            : 'border-white/10 bg-white/5 hover:bg-white/10 text-white/70 text-xs'
                        }`}
                      >
                        <Square className="w-4 h-4 mx-auto mb-1 text-gold" />
                        <div className="text-xs font-bold">مربع للمنشورات</div>
                        <div className="text-[10px] opacity-60">1080 × 1080</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDimension('portrait')}
                        className={`p-2 rounded-xl border text-center transition-all ${
                          dimension === 'portrait'
                            ? 'border-gold bg-gold/20 text-gold font-bold ring-1 ring-gold'
                            : 'border-white/10 bg-white/5 hover:bg-white/10 text-white/70 text-xs'
                        }`}
                      >
                        <Maximize2 className="w-4 h-4 mx-auto mb-1 text-gold" />
                        <div className="text-xs font-bold">منشور رأسي</div>
                        <div className="text-[10px] opacity-60">1080 × 1350</div>
                      </button>
                    </div>
                  </div>

                  {/* 3. Font Size Slider */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-gold mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <Type className="w-4 h-4" />
                        حجم الخط:
                      </span>
                      <span className="text-[11px] text-white/70 font-mono">
                        {fontSizeDelta === 0 ? 'قياسي (0)' : fontSizeDelta > 0 ? `+${fontSizeDelta}` : fontSizeDelta}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-white/50">أصغر</span>
                      <input
                        type="range"
                        min="-6"
                        max="14"
                        step="2"
                        value={fontSizeDelta}
                        onChange={(e) => setFontSizeDelta(Number(e.target.value))}
                        className="w-full accent-gold bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-xs text-white/50">أكبر</span>
                    </div>
                  </div>

                  {/* 4. Display Toggles */}
                  <div>
                    <label className="block text-xs font-bold text-gold mb-2 flex items-center gap-1.5">
                      <Sliders className="w-4 h-4" />
                      عناصر البطاقة الإضافية:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                        <input
                          type="checkbox"
                          checked={showLogo}
                          onChange={(e) => setShowLogo(e.target.checked)}
                          className="w-4 h-4 rounded text-gold focus:ring-gold accent-gold"
                        />
                        <span className="text-xs font-medium">شعار المنصة</span>
                      </label>

                      <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                        <input
                          type="checkbox"
                          checked={showMetadata}
                          onChange={(e) => setShowMetadata(e.target.checked)}
                          className="w-4 h-4 rounded text-gold focus:ring-gold accent-gold"
                        />
                        <span className="text-xs font-medium">التوثيق والمصدر</span>
                      </label>

                      <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                        <input
                          type="checkbox"
                          checked={showQr}
                          onChange={(e) => setShowQr(e.target.checked)}
                          className="w-4 h-4 rounded text-gold focus:ring-gold accent-gold"
                        />
                        <span className="text-xs font-medium">رمز الاستجابة QR</span>
                      </label>
                    </div>
                  </div>

                  {/* Information banner */}
                  <div className="p-3 rounded-xl bg-gold/10 border border-gold/25 text-xs text-gold-light/90 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 flex-shrink-0 text-gold mt-0.5" />
                    <span>
                      تُولد البطاقات بدقة 1080px أصلية باستخدام محرك الرسم الخالي من لقطات الشاشة، مما يضمن أعلى جودة عند الطباعة أو النشر في منصات التواصل.
                    </span>
                  </div>

                </div>

              </div>
            )}

            {/* TAB 3: SHARE VIA APPS */}
            {activeTab === 'apps' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-gold mb-1 flex items-center gap-1.5">
                    <Share2 className="w-4 h-4" />
                    نشر ومشاركة عبر شبكات التواصل الاجتماعي:
                  </h4>
                  <p className="text-xs text-white/60">
                    شارك المحتوى مباشرة بنقرة واحدة عبر تطبيقك المفضل:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SOCIAL_SHARE_PROVIDERS.map((provider) => (
                    <button
                      key={provider.id}
                      onClick={() => handleSocialShare(provider)}
                      className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-gold/30 transition-all group text-right"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md"
                          style={{ backgroundColor: provider.color }}
                        >
                          {provider.id === 'whatsapp' && <MessageCircle className="w-5 h-5" />}
                          {provider.id === 'telegram' && <Send className="w-5 h-5" />}
                          {provider.id === 'x' && <Twitter className="w-5 h-5" />}
                          {provider.id === 'facebook' && <Facebook className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-white group-hover:text-gold transition-colors">
                            {provider.nameAr}
                          </div>
                          <div className="text-xs text-white/50 font-mono">
                            {provider.nameEn}
                          </div>
                        </div>
                      </div>

                      <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-gold transition-colors" />
                    </button>
                  ))}
                </div>

                {/* Device native share if supported */}
                {canShareNative() && (
                  <div className="pt-2">
                    <button
                      onClick={handleNativeTextShare}
                      className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-gold/20 hover:bg-gold/30 border border-gold/40 text-gold-light font-bold text-sm transition-all"
                    >
                      <Smartphone className="w-5 h-5" />
                      <span>مشاركة عبر قائمة تطبيقات النظام (Native Share)</span>
                    </button>
                  </div>
                )}

                {/* Direct Link Copy Card */}
                <div className="p-4 rounded-2xl bg-black/40 border border-gold/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-right w-full sm:w-auto">
                    <div className="text-xs font-bold text-gold">الرابط المباشر للمحتوى:</div>
                    <div className="text-xs text-white/60 font-mono truncate max-w-md mt-0.5">
                      {content.canonicalUrl || SITE_CONFIG.productionUrl}
                    </div>
                  </div>

                  <button
                    onClick={handleCopyLink}
                    className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold text-[#072A20] font-black text-xs shadow-md shadow-gold/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'تم النسخ' : 'نسخ الرابط'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 4: COPY AS FORMATTED TEXT */}
            {activeTab === 'text' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-gold mb-0.5 flex items-center gap-1.5">
                      <FileText className="w-4 h-4" />
                      النص العربي الموثق والمنسق:
                    </h4>
                    <p className="text-xs text-white/60">
                      نص منسق بدقة مع كامل التشكيل والتخريج ورابط المصدر:
                    </p>
                  </div>

                  <button
                    onClick={handleCopyText}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold text-[#072A20] font-black text-xs shadow-md shadow-gold/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    {copiedText ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedText ? 'تم النسخ إلى الحافظة' : 'نسخ النص بالكامل'}</span>
                  </button>
                </div>

                {/* Formatted Text Preview Container */}
                <div className="p-5 rounded-2xl bg-black/40 border border-gold/30 font-quran text-base sm:text-lg leading-relaxed text-white/95 whitespace-pre-wrap select-all shadow-inner max-h-[360px] overflow-y-auto">
                  {formatContentAsText(content)}
                </div>

                <div className="flex items-center justify-between text-xs text-white/50 px-1">
                  <span>تم توثيق النص ومطابقته وفق المصادر الشرعية المعتمدة</span>
                  <span className="font-mono">{content.text.length} حرف</span>
                </div>
              </div>
            )}

          </div>

          {/* Footer Bar */}
          <div className="relative z-10 px-5 sm:px-7 py-3.5 border-t border-gold/20 bg-[#051C15]/90 flex items-center justify-between text-xs text-white/60">
            <div className="flex items-center gap-2">
              <Logo size="sm" />
              <span className="hidden sm:inline">{SITE_CONFIG.officialOrganization}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 hover:text-white transition-colors"
              >
                إغلاق
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

