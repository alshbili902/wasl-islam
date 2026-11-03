import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Palette, 
  Download, 
  Share2, 
  Sparkles, 
  QrCode, 
  Type, 
  Square, 
  Smartphone, 
  Check, 
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';
import QRCode from 'qrcode';
import { CARD_PRESETS, CARD_THEMES, CardThemeConfig } from '../data/cardStudioData';
import { CardOrientation } from '../types/extraModules';
import { SITE_CONFIG } from '../config/siteConfig';

export const CardStudioPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Studio State
  const [cardText, setCardText] = useState<string>('﴿أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ﴾');
  const [cardSource, setCardSource] = useState<string>('سورة الرعد: الآية 28');
  const [selectedThemeId, setSelectedThemeId] = useState<string>('emerald_gold');
  const [orientation, setOrientation] = useState<CardOrientation>('square_1_1');
  const [fontSize, setFontSize] = useState<number>(44);
  const [showBorder, setShowBorder] = useState<boolean>(true);
  const [showQr, setShowQr] = useState<boolean>(true);
  const [showLogo, setShowLogo] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  const selectedTheme = CARD_THEMES.find((t) => t.id === selectedThemeId) || CARD_THEMES[0];

  // Canvas Dimensions
  const width = 1080;
  const height = orientation === 'square_1_1' ? 1080 : 1920;

  // Render Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    // 1. Draw Background Gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, selectedTheme.bgGradientStart);
    gradient.addColorStop(1, selectedTheme.bgGradientEnd);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 2. Draw Decorative Borders
    if (showBorder) {
      ctx.strokeStyle = selectedTheme.borderGold;
      ctx.lineWidth = 6;
      ctx.strokeRect(50, 50, width - 100, height - 100);

      ctx.strokeStyle = selectedTheme.accentColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(62, 62, width - 124, height - 124);

      // Corner ornaments
      const cornerSize = 40;
      ctx.fillStyle = selectedTheme.borderGold;
      // Top Left
      ctx.fillRect(45, 45, cornerSize, 6);
      ctx.fillRect(45, 45, 6, cornerSize);
      // Top Right
      ctx.fillRect(width - 45 - cornerSize, 45, cornerSize, 6);
      ctx.fillRect(width - 51, 45, 6, cornerSize);
      // Bottom Left
      ctx.fillRect(45, height - 51, cornerSize, 6);
      ctx.fillRect(45, height - 45 - cornerSize, 6, cornerSize);
      // Bottom Right
      ctx.fillRect(width - 45 - cornerSize, height - 51, cornerSize, 6);
      ctx.fillRect(width - 51, height - 45 - cornerSize, 6, cornerSize);
    }

    // 3. Header Stamp
    if (showLogo) {
      ctx.font = 'bold 30px "Noto Naskh Arabic", "Amiri", serif';
      ctx.fillStyle = selectedTheme.accentColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(`⚜️ ${SITE_CONFIG.name} ⚜️`, width / 2, 100);

      ctx.font = '20px sans-serif';
      ctx.fillStyle = selectedTheme.textColor;
      ctx.fillText(SITE_CONFIG.tagline, width / 2, 145);
    }

    // 4. Word-Wrap Helper for Arabic Card Text
    ctx.fillStyle = selectedTheme.textColor;
    ctx.font = `bold ${fontSize}px "Amiri", "Noto Naskh Arabic", serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const maxLineWidth = width - 240;
    const words = cardText.split(/\s+/);
    let line = '';
    const lines: string[] = [];

    for (let i = 0; i < words.length; i++) {
      const testLine = line + (line ? ' ' : '') + words[i];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxLineWidth && i > 0) {
        lines.push(line);
        line = words[i];
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    // Calculate vertical starting point
    const lineHeight = fontSize * 1.6;
    const totalTextHeight = lines.length * lineHeight;
    const startY = height / 2 - totalTextHeight / 2 - 20;

    lines.forEach((l, idx) => {
      ctx.fillText(l, width / 2, startY + idx * lineHeight);
    });

    // 5. Source / Reference
    if (cardSource.trim()) {
      ctx.font = 'bold 26px "Amiri", "Noto Naskh Arabic", serif';
      ctx.fillStyle = selectedTheme.accentColor;
      ctx.fillText(`— ${cardSource} —`, width / 2, startY + totalTextHeight + 50);
    }

    // 6. Draw Footer & QR Code
    const footerY = height - 140;

    if (showQr) {
      // Generate QR base64 synchronously or embed
      QRCode.toDataURL(SITE_CONFIG.productionUrl, {
        width: 140,
        margin: 1,
        color: { dark: '#072A20', light: '#FFFFFF' },
      }).then((qrUrl) => {
        const qrImg = new Image();
        qrImg.onload = () => {
          const qrX = width - 220;
          const qrY = height - 210;
          // White rounded backdrop
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.roundRect(qrX - 10, qrY - 10, 140, 140, 16);
          ctx.fill();
          ctx.drawImage(qrImg, qrX - 5, qrY - 5, 130, 130);

          ctx.font = '16px sans-serif';
          ctx.fillStyle = selectedTheme.textColor;
          ctx.textAlign = 'right';
          ctx.fillText('امسح لفتح مدار اليقين', qrX - 25, qrY + 45);
          ctx.font = 'bold 18px monospace';
          ctx.fillStyle = selectedTheme.accentColor;
          ctx.fillText(SITE_CONFIG.canonicalDomain, qrX - 25, qrY + 75);
        };
        qrImg.src = qrUrl;
      });
    } else {
      ctx.font = '20px monospace';
      ctx.fillStyle = selectedTheme.accentColor;
      ctx.textAlign = 'center';
      ctx.fillText(SITE_CONFIG.productionUrl, width / 2, footerY);
    }
  }, [
    cardText,
    cardSource,
    selectedTheme,
    orientation,
    fontSize,
    showBorder,
    showQr,
    showLogo,
    width,
    height,
  ]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsExporting(true);

    setTimeout(() => {
      const link = document.createElement('a');
      link.download = `madar-alyaqeen-card-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
      setIsExporting(false);
    }, 200);
  };

  const handleShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      if (navigator.share && canvas.toBlob) {
        canvas.toBlob(async (blob) => {
          if (!blob) return;
          const file = new File([blob], 'madar-alyaqeen-card.png', { type: 'image/png' });
          await navigator.share({
            title: 'بطاقة إسلامية من منصة مدار اليقين',
            text: `${cardText} (${cardSource}) - ${SITE_CONFIG.productionUrl}`,
            files: [file],
          });
        }, 'image/png');
      } else {
        await navigator.clipboard.writeText(`${cardText}\n${cardSource}\n${SITE_CONFIG.productionUrl}`);
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 2500);
      }
    } catch {
      // Fallback
      handleDownload();
    }
  };

  const handleSelectPreset = (preset: typeof CARD_PRESETS[0]) => {
    setCardText(preset.text);
    setCardSource(preset.source);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F4] dark:bg-[#070D14] text-slate-800 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl royal-gradient p-6 sm:p-10 text-white shadow-xl border-2 border-gold/40">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-bold">
              <Palette className="w-4 h-4" />
              <span>استوديو البطاقات والتصاميم الإسلامية الفاخرة</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-gold tracking-tight">
              استوديو البطاقات الإسلامية
            </h1>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              صمّم بطاقات دعوية وآيات قرآنية وأحاديث نبوية وتهاني الجمعة بدقة فائقة وبطابع إسلامي زمردي وذهبي، وصدرها فوراً بدقة عالية لمشاركتها على واتساب وإنستغرام.
            </p>
          </div>
          <div className="absolute left-4 bottom-4 opacity-10 pointer-events-none">
            <ImageIcon className="w-64 h-64 text-gold" />
          </div>
        </div>

        {/* Main Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-5">
            {/* Presets Picker */}
            <div className="bg-white dark:bg-[#0E1726] p-5 rounded-2xl border border-gold/30 shadow-sm space-y-3">
              <h3 className="font-bold text-xs sm:text-sm text-royal dark:text-gold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold" />
                <span>نماذج جاهزة للاختيار السريع:</span>
              </h3>
              <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto pr-1">
                {CARD_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectPreset(p)}
                    className="text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-gold/20 text-slate-700 dark:text-slate-300 transition-colors text-right truncate max-w-full"
                    title={p.text}
                  >
                    {p.text.slice(0, 32)}...
                  </button>
                ))}
              </div>
            </div>

            {/* Text Editor Box */}
            <div className="bg-white dark:bg-[#0E1726] p-5 rounded-2xl border border-gold/30 shadow-sm space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-royal dark:text-gold block">
                  نص الآية / الحديث / المقولة:
                </label>
                <textarea
                  rows={4}
                  value={cardText}
                  onChange={(e) => setCardText(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#090F1A] border border-slate-200 dark:border-slate-800 text-sm font-semibold focus:outline-none focus:border-gold transition-colors leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-royal dark:text-gold block">
                  المصدر أو الراوي:
                </label>
                <input
                  type="text"
                  value={cardSource}
                  onChange={(e) => setCardSource(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#090F1A] border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-none focus:border-gold transition-colors"
                />
              </div>

              {/* Font Size Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>حجم الخط:</span>
                  <span>{fontSize}px</span>
                </div>
                <input
                  type="range"
                  min="26"
                  max="68"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-[#C5A059] cursor-pointer"
                />
              </div>
            </div>

            {/* Format & Themes */}
            <div className="bg-white dark:bg-[#0E1726] p-5 rounded-2xl border border-gold/30 shadow-sm space-y-4">
              {/* Aspect Ratio */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 block">أبعاد البطاقة:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOrientation('square_1_1')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      orientation === 'square_1_1'
                        ? 'bg-royal text-gold border-gold shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Square className="w-4 h-4" />
                    <span>مربع 1:1 (منشور)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrientation('story_9_16')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      orientation === 'story_9_16'
                        ? 'bg-royal text-gold border-gold shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>طولي 9:16 (قصة / حالة)</span>
                  </button>
                </div>
              </div>

              {/* Theme Picker */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 block">الهوية البصرية والألوان:</span>
                <div className="grid grid-cols-2 gap-2">
                  {CARD_THEMES.map((th) => (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => setSelectedThemeId(th.id)}
                      className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                        selectedThemeId === th.id
                          ? 'border-gold bg-gold/15 text-gold font-bold shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <div
                        className="w-4 h-4 rounded-full border border-gold shrink-0"
                        style={{ backgroundColor: th.bgGradientStart }}
                      />
                      <span className="truncate">{th.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showBorder}
                    onChange={(e) => setShowBorder(e.target.checked)}
                    className="accent-[#C5A059] w-4 h-4 rounded"
                  />
                  <span>إظهار الإطار والزخارف الذهبية</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showLogo}
                    onChange={(e) => setShowLogo(e.target.checked)}
                    className="accent-[#C5A059] w-4 h-4 rounded"
                  />
                  <span>إظهار ترويسة مدار اليقين</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showQr}
                    onChange={(e) => setShowQr(e.target.checked)}
                    className="accent-[#C5A059] w-4 h-4 rounded"
                  />
                  <span>إظهار رمز QR للرابط الرسمي (wasl-islam.fun)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Canvas Live Preview & Export Column */}
          <div className="lg:col-span-7 flex flex-col items-center space-y-5">
            <div className="w-full bg-white dark:bg-[#0E1726] p-4 sm:p-6 rounded-3xl border border-gold/30 shadow-md flex flex-col items-center">
              <span className="text-xs font-bold text-slate-400 mb-3 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-gold" />
                <span>معاينة البطاقة الحية (جاهزة للتصدير بدقة 1080px):</span>
              </span>

              {/* Responsive Container for Canvas */}
              <div
                className={`w-full max-w-[420px] rounded-2xl overflow-hidden shadow-2xl border-2 border-gold/50 transition-all ${
                  orientation === 'square_1_1' ? 'aspect-square' : 'aspect-[9/16]'
                }`}
              >
                <canvas
                  ref={canvasRef}
                  className="w-full h-full object-contain block select-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 w-full max-w-md pt-5">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isExporting}
                  className="py-3 px-4 rounded-xl gold-gradient text-royal font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:brightness-105 active:scale-95 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>{isExporting ? 'جارٍ التصدير...' : 'تحميل صورة PNG'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="py-3 px-4 rounded-xl bg-royal text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-royal/90 active:scale-95 transition-all shadow-md"
                >
                  {copiedShare ? (
                    <>
                      <Check className="w-4 h-4 text-gold" />
                      <span>تم نسخ الرابط!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 text-gold" />
                      <span>مشاركة البطاقة</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
