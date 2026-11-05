/**
 * Canvas Image Generator Engine for Madar Al-Yaqeen Unified Sharing System
 * محرك توليد وتصدير البطاقات الإسلامية عالي الدقة (HTML5 Canvas)
 */

import QRCode from 'qrcode';
import { 
  ShareableContent, 
  ImageTemplateId, 
  ImageDimensionId, 
  ImageTemplateConfig, 
  ImageExportConfig 
} from '../types/sharing';
import { SITE_CONFIG } from '../config/siteConfig';

export const TEMPLATES_CONFIG: Record<ImageTemplateId, ImageTemplateConfig> = {
  royal_green: {
    id: 'royal_green',
    nameAr: 'الأخضر الزمردي الملكي',
    nameEn: 'Royal Emerald & Gold',
    descriptionAr: 'الطابع الرسمي لمدار اليقين بخلفية زمردية عميقة وأطر ذهبية ملكية',
    bgGradientStart: '#062319',
    bgGradientEnd: '#0D382A',
    textColor: '#F6F9F7',
    accentGold: '#D4AF37',
    secondaryText: '#A3C2B4',
    borderColor: '#C5A059',
    innerBorderColor: '#8C6D37',
    headerStampColor: '#E6CA85',
    patternType: 'islamic_arch',
    isDark: true,
  },
  elegant_ivory: {
    id: 'elegant_ivory',
    nameAr: 'العاجي الأندلسي الفاخر',
    nameEn: 'Andalusian Warm Ivory',
    descriptionAr: 'خلفية قرطاسية دافئة فاخرة مستوحاة من المخطوطات الأندلسية العريقة',
    bgGradientStart: '#FCF9F2',
    bgGradientEnd: '#F5EFE0',
    textColor: '#2C2416',
    accentGold: '#8C6D37',
    secondaryText: '#6B5E4A',
    borderColor: '#B8860B',
    innerBorderColor: '#D8C39E',
    headerStampColor: '#7A5B27',
    patternType: 'arabesque',
    isDark: false,
  },
  minimal_white: {
    id: 'minimal_white',
    nameAr: 'الأبيض النقي العصري',
    nameEn: 'Minimal Modern Pure',
    descriptionAr: 'تصميم ناصع البياض فائق النقاء بخطوط عصرية هادئة ووضوح بصري عالٍ',
    bgGradientStart: '#FFFFFF',
    bgGradientEnd: '#F8FAFC',
    textColor: '#0F172A',
    accentGold: '#94783E',
    secondaryText: '#64748B',
    borderColor: '#E2E8F0',
    innerBorderColor: '#CBD5E1',
    headerStampColor: '#334155',
    patternType: 'minimal_lines',
    isDark: false,
  },
  premium_dark: {
    id: 'premium_dark',
    nameAr: 'الأسود الكحلي والذهب',
    nameEn: 'Obsidian & Radiant Gold',
    descriptionAr: 'خلفية سبجية داكنة فخمة يضيء فيها الذهب الساطع بتباين عالي الجودة',
    bgGradientStart: '#0B131E',
    bgGradientEnd: '#050A10',
    textColor: '#F8FAFC',
    accentGold: '#E5B842',
    secondaryText: '#94A3B8',
    borderColor: '#D4AF37',
    innerBorderColor: '#92762A',
    headerStampColor: '#F5D061',
    patternType: 'geometric_stars',
    isDark: true,
  },
  quran_inspired: {
    id: 'quran_inspired',
    nameAr: 'طراز المصحف الشريف المذهب',
    nameEn: 'Illuminated Mushaf Tradition',
    descriptionAr: 'مستوحى من إطارات وزخارف مصاحف مجمع الملك فهد الشريفة وأفاريز السور',
    bgGradientStart: '#081F18',
    bgGradientEnd: '#03140F',
    textColor: '#FFFDF5',
    accentGold: '#ECC94B',
    secondaryText: '#BFD4C9',
    borderColor: '#D69E2E',
    innerBorderColor: '#975A16',
    headerStampColor: '#F6E05E',
    patternType: 'illuminated_mushaf',
    isDark: true,
  },
  islamic_geometric: {
    id: 'islamic_geometric',
    nameAr: 'الزخرفة الهندسية الياقوتية',
    nameEn: 'Sapphire Geometric Stars',
    descriptionAr: 'أزرق كحلي ملكي مزين بنجوم مثمنة وأشكال هندسية إسلامية أصيلة',
    bgGradientStart: '#091E3A',
    bgGradientEnd: '#040F1E',
    textColor: '#FFFFFF',
    accentGold: '#E2C374',
    secondaryText: '#93A8C7',
    borderColor: '#C8A755',
    innerBorderColor: '#78612B',
    headerStampColor: '#F3D896',
    patternType: 'geometric_stars',
    isDark: true,
  },
  modern_elegant: {
    id: 'modern_elegant',
    nameAr: 'العصري الهادئ (زمرد وميرمية)',
    nameEn: 'Sage & Emerald Contemporary',
    descriptionAr: 'تدرج أنيق بدرجات خضراء هادئة مناسب للمشاركة اليومية العصرية',
    bgGradientStart: '#0E2A24',
    bgGradientEnd: '#173D35',
    textColor: '#FFFFFF',
    accentGold: '#B8DECA',
    secondaryText: '#A1C4B5',
    borderColor: '#609B84',
    innerBorderColor: '#366151',
    headerStampColor: '#D1EADE',
    patternType: 'minimal_lines',
    isDark: true,
  },
};

/**
 * Wait for web fonts to load before canvas drawing
 */
async function ensureFontsLoaded(): Promise<void> {
  if (typeof document !== 'undefined' && 'fonts' in document) {
    try {
      await Promise.race([
        document.fonts.ready,
        new Promise((resolve) => setTimeout(resolve, 800)),
      ]);
    } catch {
      // Continue anyway if font check fails
    }
  }
}

/**
 * Word wrap helper for Arabic text on HTML5 Canvas
 */
function wrapArabicText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  // Normalize extra whitespace and split into paragraphs first
  const cleanText = text.replace(/\r\n/g, '\n').trim();
  const paragraphs = cleanText.split('\n');
  const allLines: string[] = [];

  for (const paragraph of paragraphs) {
    if (!paragraph.trim()) {
      allLines.push('');
      continue;
    }

    const words = paragraph.split(/\s+/);
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth && currentLine) {
        allLines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      allLines.push(currentLine);
    }
  }

  return allLines;
}

/**
 * Draw decorative 8-pointed star in Canvas
 */
function drawIslamicStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  color: string,
  lineWidth = 2
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.translate(cx, cy);

  const half = size / 2;
  // First square
  ctx.strokeRect(-half, -half, size, size);
  // Second square rotated 45 deg
  ctx.rotate((45 * Math.PI) / 180);
  ctx.strokeRect(-half, -half, size, size);

  ctx.restore();
}

/**
 * Draw corner ornaments for canvas borders
 */
function drawCornerBrackets(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  length: number,
  color: string,
  thickness: number
) {
  ctx.fillStyle = color;
  // Top-Left
  ctx.fillRect(x, y, length, thickness);
  ctx.fillRect(x, y, thickness, length);

  // Top-Right
  ctx.fillRect(x + w - length, y, length, thickness);
  ctx.fillRect(x + w - thickness, y, thickness, length);

  // Bottom-Left
  ctx.fillRect(x, y + h - thickness, length, thickness);
  ctx.fillRect(x, y + h - length, thickness, length);

  // Bottom-Right
  ctx.fillRect(x + w - length, y + h - thickness, length, thickness);
  ctx.fillRect(x + w - thickness, y + h - length, thickness, length);
}

/**
 * Calculate dynamic dimensions and layout metrics
 */
export function calculateCanvasDimensions(
  content: ShareableContent,
  dimension: ImageDimensionId,
  fontSizeDelta = 0
): { width: number; height: number; baseFontSize: number } {
  const width = 1080;

  if (dimension === 'story') {
    return { width, height: 1920, baseFontSize: 46 + fontSizeDelta };
  }
  if (dimension === 'square') {
    return { width, height: 1080, baseFontSize: 40 + fontSizeDelta };
  }
  if (dimension === 'portrait') {
    return { width, height: 1350, baseFontSize: 44 + fontSizeDelta };
  }

  // AUTO: Calculate required height dynamically so text never gets crammed
  const charCount = content.text.length;
  let dynamicFontSize = 46 + fontSizeDelta;
  if (charCount > 350) dynamicFontSize = 38 + fontSizeDelta;
  if (charCount > 600) dynamicFontSize = 34 + fontSizeDelta;
  if (charCount > 1000) dynamicFontSize = 30 + fontSizeDelta;

  // Approximate line calculation
  const charsPerLine = Math.floor(820 / (dynamicFontSize * 0.55));
  const estimatedLines = Math.max(3, Math.ceil(charCount / charsPerLine) + 2);
  const textBlockHeight = estimatedLines * (dynamicFontSize * 1.65);
  const headerHeight = 220;
  const footerHeight = 260;
  const metadataHeight = content.source || content.referenceText ? 120 : 40;

  let calculatedHeight = Math.round(headerHeight + textBlockHeight + metadataHeight + footerHeight);
  // Clamp between 840 and 2400
  calculatedHeight = Math.max(840, Math.min(2400, calculatedHeight));

  return { width, height: calculatedHeight, baseFontSize: dynamicFontSize };
}

/**
 * Main Canvas Render Function
 * Generates an HTML5 Canvas containing the beautifully formatted Islamic card
 */
export async function renderContentToCanvas(
  content: ShareableContent,
  config: ImageExportConfig
): Promise<HTMLCanvasElement> {
  await ensureFontsLoaded();

  const template = TEMPLATES_CONFIG[config.templateId] || TEMPLATES_CONFIG.royal_green;
  const { width, height, baseFontSize } = calculateCanvasDimensions(
    content,
    config.dimension,
    config.fontSizeDelta
  );

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('Could not get canvas 2d context');

  // Enable high-quality smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // 1. BACKGROUND GRADIENT
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, template.bgGradientStart);
  bgGrad.addColorStop(1, template.bgGradientEnd);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. BACKGROUND AMBIENT PATTERNS (Canvas Paths)
  if (template.patternType === 'geometric_stars') {
    // Subtle geometric stars in corners
    ctx.save();
    ctx.globalAlpha = template.isDark ? 0.08 : 0.04;
    drawIslamicStar(ctx, 160, 160, 140, template.accentGold, 3);
    drawIslamicStar(ctx, width - 160, 160, 140, template.accentGold, 3);
    drawIslamicStar(ctx, 160, height - 160, 140, template.accentGold, 3);
    drawIslamicStar(ctx, width - 160, height - 160, 140, template.accentGold, 3);
    ctx.restore();
  } else if (template.patternType === 'illuminated_mushaf') {
    // Subtle arch ornament in top center
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.strokeStyle = template.accentGold;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(width / 2, 90, 120, Math.PI, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(width / 2, 90, 135, Math.PI, 0);
    ctx.stroke();
    ctx.restore();
  }

  // 3. DECORATIVE FRAMES & BORDERS
  const margin = 50;
  const innerMargin = 64;

  // Outer Gold Frame
  ctx.strokeStyle = template.borderColor;
  ctx.lineWidth = 4;
  ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);

  // Inner Subtle Frame
  ctx.strokeStyle = template.innerBorderColor;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(innerMargin, innerMargin, width - innerMargin * 2, height - innerMargin * 2);

  // Corner Brackets
  drawCornerBrackets(ctx, margin - 4, margin - 4, width - margin * 2 + 8, height - margin * 2 + 8, 36, template.accentGold, 5);
  drawIslamicStar(ctx, margin + 2, margin + 2, 16, template.accentGold, 2);
  drawIslamicStar(ctx, width - margin - 2, margin + 2, 16, template.accentGold, 2);
  drawIslamicStar(ctx, margin + 2, height - margin - 2, 16, template.accentGold, 2);
  drawIslamicStar(ctx, width - margin - 2, height - margin - 2, 16, template.accentGold, 2);

  // 4. HEADER STAMP & LOGO
  let currentY = 110;

  if (config.showLogo) {
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    // Top Platform Crown Logo
    ctx.font = 'bold 30px "Amiri", "Noto Naskh Arabic", serif';
    ctx.fillStyle = template.headerStampColor;
    ctx.fillText(`⚜️  ${SITE_CONFIG.name}  ⚜️`, width / 2, currentY);

    currentY += 46;

    // Platform Tagline or Category Label
    const headerBadge = content.categoryLabel 
      ? `﴿ ${content.categoryLabel} ﴾` 
      : getHeaderBadgeForType(content.type);

    ctx.font = 'bold 22px "Amiri", "Noto Naskh Arabic", serif';
    ctx.fillStyle = template.accentGold;
    ctx.fillText(headerBadge, width / 2, currentY);

    currentY += 36;

    // Decorative Separator line with diamond in center
    ctx.strokeStyle = template.borderColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 140, currentY);
    ctx.lineTo(width / 2 - 25, currentY);
    ctx.moveTo(width / 2 + 25, currentY);
    ctx.lineTo(width / 2 + 140, currentY);
    ctx.stroke();

    drawIslamicStar(ctx, width / 2, currentY, 14, template.accentGold, 1.5);

    currentY += 45;
  } else {
    currentY += 40;
  }

  // 5. TEXT CONTENT WRAPPING & LAYOUT
  const maxTextWidth = width - 240;
  ctx.font = `bold ${baseFontSize}px "Amiri", "Noto Naskh Arabic", serif`;
  
  // Format Quran with verse brackets if not already present
  let textToRender = content.text;
  if (content.type === 'quran' && !textToRender.startsWith('﴿')) {
    textToRender = `﴿ ${textToRender} ﴾`;
  }

  const lines = wrapArabicText(ctx, textToRender, maxTextWidth);
  const lineHeight = Math.round(baseFontSize * 1.68);
  const totalTextHeight = lines.length * lineHeight;

  // Space available for content
  const reservedFooterHeight = config.showQr ? 220 : 160;
  const availableHeight = (height - reservedFooterHeight) - currentY;

  // Center vertical placement
  let textStartY = currentY + Math.max(20, Math.floor((availableHeight - totalTextHeight) / 2));

  // If text would overflow top or overlap header, clamp
  if (textStartY < currentY + 10) {
    textStartY = currentY + 10;
  }

  // Draw Content Text Lines
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle = template.textColor;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const yPos = textStartY + i * lineHeight;
    // Highlight first line or quotes softly if desired
    ctx.fillText(line, width / 2, yPos);
  }

  let afterTextY = textStartY + totalTextHeight + 35;

  // 6. METADATA / SOURCE / CITATION / HADITH GRADE
  if (config.showMetadata) {
    const metaParts: string[] = [];

    if (content.surahName && content.ayahNumber) {
      metaParts.push(`سورة ${content.surahName} : الآية ${content.ayahNumber}`);
    } else if (content.source) {
      metaParts.push(content.source);
    }

    if (content.narrator) {
      metaParts.push(`عن ${content.narrator}`);
    }

    if (content.sourceBook) {
      const bookDetail = content.sourceNumber 
        ? `${content.sourceBook} (رقم ${content.sourceNumber})`
        : content.sourceBook;
      metaParts.push(bookDetail);
    }

    if (content.grade) {
      metaParts.push(`درجة الحديث: ${content.grade}`);
    }

    if (content.repetitionCount && content.repetitionCount > 1) {
      metaParts.push(`التكرار: ${content.repetitionCount} مرات`);
    }

    if (content.referenceText && metaParts.length === 0) {
      metaParts.push(content.referenceText);
    }

    if (metaParts.length > 0) {
      const metadataStr = `— ${metaParts.join('  •  ')} —`;
      ctx.font = 'bold 24px "Amiri", "Noto Naskh Arabic", serif';
      ctx.fillStyle = template.accentGold;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      // Check if metadata line is too long, wrap if needed
      const metaLines = wrapArabicText(ctx, metadataStr, maxTextWidth);
      for (const metaLine of metaLines) {
        ctx.fillText(metaLine, width / 2, afterTextY);
        afterTextY += 34;
      }
    }
  }

  // 7. FOOTER & EMBEDDED QR CODE
  const footerY = height - 120;

  if (config.showQr) {
    const targetUrl = content.canonicalUrl || SITE_CONFIG.productionUrl;
    try {
      const qrDataUrl = await QRCode.toDataURL(targetUrl, {
        width: 140,
        margin: 1,
        color: {
          dark: template.isDark ? '#072A20' : '#1E293B',
          light: '#FFFFFF',
        },
      });

      const qrImg = await loadImage(qrDataUrl);
      const qrSize = 100;
      const qrX = width - margin - 24 - qrSize;
      const qrY = height - margin - 20 - qrSize;

      // Rounded background for QR Code
      ctx.fillStyle = '#FFFFFF';
      drawRoundedRect(ctx, qrX - 8, qrY - 8, qrSize + 16, qrSize + 16, 12);
      ctx.fill();

      // Draw QR Image
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

      // QR Labels on the left of QR (Arabic RTL)
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = template.textColor;
      ctx.font = '16px "Cairo", sans-serif';
      ctx.fillText('امسح الرمز لقراءة التوثيق والمزيد', qrX - 16, qrY + 34);

      ctx.fillStyle = template.accentGold;
      ctx.font = 'bold 18px "Cairo", monospace';
      ctx.fillText(SITE_CONFIG.canonicalDomain, qrX - 16, qrY + 66);
    } catch {
      // Fallback text footer if QR fails
      drawTextFooter(ctx, template, width, footerY);
    }
  } else {
    drawTextFooter(ctx, template, width, footerY);
  }

  return canvas;
}

/**
 * Fallback / Standard text footer
 */
function drawTextFooter(
  ctx: CanvasRenderingContext2D,
  template: ImageTemplateConfig,
  width: number,
  footerY: number
) {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '18px "Cairo", sans-serif';
  ctx.fillStyle = template.secondaryText;
  ctx.fillText('نُشرت عبر منصة مدار اليقين الرقمية', width / 2, footerY - 14);

  ctx.font = 'bold 20px "Cairo", monospace';
  ctx.fillStyle = template.accentGold;
  ctx.fillText(SITE_CONFIG.productionUrl, width / 2, footerY + 18);
}

/**
 * Category Badge default label
 */
function getHeaderBadgeForType(type: ShareableContent['type']): string {
  switch (type) {
    case 'quran':
      return '﴿ قُرْآنٌ كَرِيمٌ ﴾';
    case 'hadith':
      return '﴿ حَدِيثٌ نَبَوِيٌّ شَرِيفٌ ﴾';
    case 'dhikr':
      return '﴿ ذِكْرٌ مَأْثُورٌ ﴾';
    case 'dua':
      return '﴿ دُعَاءٌ مُسْتَجَابٌ ﴾';
    case 'fiqh':
      return '﴿ مَسْأَلَةٌ فِقْهِيَّةٌ ﴾';
    case 'verifier':
      return '﴿ تَحْقِيقٌ وَتَوْثِيقٌ شَرْعِيٌّ ﴾';
    case 'article':
      return '﴿ هِدَايَةٌ وَبَصِيرَةٌ ﴾';
    default:
      return '﴿ دُرَرٌ إِسْلَامِيَّةٌ ﴾';
  }
}

/**
 * Utility to load an HTML image from src url
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

/**
 * Rounded rectangle helper
 */
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Export Canvas to PNG Blob
 */
export function exportCanvasToBlob(
  canvas: HTMLCanvasElement,
  type = 'image/png',
  quality = 1.0
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas toBlob conversion failed'));
      },
      type,
      quality
    );
  });
}

/**
 * Export Canvas to File object for navigator.share
 */
export async function exportCanvasToFile(
  canvas: HTMLCanvasElement,
  filename = 'madar-alyaqeen-card.png'
): Promise<File> {
  const blob = await exportCanvasToBlob(canvas);
  return new File([blob], filename, { type: 'image/png' });
}

/**
 * Trigger direct file download in browser
 */
export function downloadCanvasImage(
  canvas: HTMLCanvasElement,
  baseFilename = 'madar-alyaqeen'
): void {
  const sanitized = baseFilename.replace(/[^a-z0-9_-]/gi, '-').toLowerCase();
  const filename = `${sanitized}-${Date.now()}.png`;
  const dataUrl = canvas.toDataURL('image/png', 1.0);

  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

