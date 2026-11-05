/**
 * Unified Sharing Service for Madar Al-Yaqeen
 * خدمة المشاركة الموحدة وتنسيق النصوص وروابط التواصل الاجتماعي
 */

import { ShareableContent, SocialShareLink } from '../types/sharing';
import { SITE_CONFIG } from '../config/siteConfig';
import { exportCanvasToFile, downloadCanvasImage } from './imageGeneratorService';

/**
 * Format Arabic Islamic content with full diacritics, proper quotes, and verified citations
 */
export function formatContentAsText(content: ShareableContent): string {
  const url = content.canonicalUrl || SITE_CONFIG.productionUrl;
  const sections: string[] = [];

  switch (content.type) {
    case 'quran': {
      sections.push('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ');
      const verseText = content.text.startsWith('﴿') ? content.text : `﴿ ${content.text} ﴾`;
      sections.push(verseText);
      
      const ref = content.surahName && content.ayahNumber
        ? `[سورة ${content.surahName} : الآية ${content.ayahNumber}]`
        : content.source ? `[${content.source}]` : '';
      if (ref) sections.push(ref);
      break;
    }

    case 'hadith': {
      if (content.title && !content.title.includes('حديث')) {
        sections.push(`【 ${content.title} 】`);
      }
      sections.push('قال رسول الله ﷺ:');
      sections.push(`« ${content.text} »`);

      const metaLines: string[] = [];
      if (content.narrator) metaLines.push(`• الراوي: ${content.narrator}`);
      if (content.sourceBook) {
        metaLines.push(`• المحدث/المصدر: ${content.sourceBook}${content.sourceNumber ? ` (رقم ${content.sourceNumber})` : ''}`);
      } else if (content.source) {
        metaLines.push(`• المصدر: ${content.source}`);
      }
      if (content.grade) metaLines.push(`• درجة الحديث: ${content.grade}`);
      if (metaLines.length > 0) sections.push(metaLines.join('\n'));
      break;
    }

    case 'dhikr': {
      sections.push(`【 ${content.title || 'ذكر نبوي شريف'} 】`);
      sections.push(content.text);

      const dLines: string[] = [];
      if (content.repetitionCount && content.repetitionCount > 1) {
        dLines.push(`• التكرار: ${content.repetitionCount} مرات`);
      }
      if (content.virtue) {
        dLines.push(`• الفضل: ${content.virtue}`);
      }
      if (content.source) {
        dLines.push(`• المرجع: ${content.source}`);
      }
      if (dLines.length > 0) sections.push(dLines.join('\n'));
      break;
    }

    case 'dua': {
      sections.push(`【 ${content.title || 'دعاء مأثور'} 】`);
      sections.push(`« ${content.text} »`);

      const duaLines: string[] = [];
      if (content.source) duaLines.push(`• المصدر: ${content.source}`);
      if (content.explanation) duaLines.push(`• المناسبة/الفضل: ${content.explanation}`);
      if (duaLines.length > 0) sections.push(duaLines.join('\n'));
      break;
    }

    case 'fiqh': {
      sections.push(`【 مسألة فقهية: ${content.title} 】`);
      sections.push(`السؤال/المسألة:\n${content.text}`);
      if (content.explanation) {
        sections.push(`البيان الفقهي والدليل:\n${content.explanation}`);
      }
      if (content.source) {
        sections.push(`• المرجع المعتمد: ${content.source}`);
      }
      break;
    }

    case 'verifier': {
      sections.push(`【 تحقيق شرعي: ${content.title} 】`);
      sections.push(`النص المحقق:\n« ${content.text} »`);
      if (content.grade) sections.push(`• الحكم: ${content.grade}`);
      if (content.explanation) sections.push(`• بيان التحقيق: ${content.explanation}`);
      if (content.source) sections.push(`• المصدر: ${content.source}`);
      break;
    }

    default: {
      if (content.title) sections.push(`【 ${content.title} 】`);
      sections.push(content.text);
      if (content.source) sections.push(`• المصدر: ${content.source}`);
      break;
    }
  }

  // Canonical attribution footer
  sections.push(`───\nنُشرت عبر ${SITE_CONFIG.name}\n${url}`);

  return sections.join('\n\n');
}

/**
 * Copy formatted text to user clipboard with safety fallback
 */
export async function copyFormattedText(content: ShareableContent): Promise<boolean> {
  const text = formatContentAsText(content);

  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback to execCommand below
    }
  }

  // Fallback for older/restricted browsers
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  } catch {
    return false;
  }
}

/**
 * Check if the browser natively supports sharing files (PNG images)
 */
export function canShareFiles(): boolean {
  if (typeof navigator === 'undefined' || !navigator.share) {
    return false;
  }

  // Check if navigator.canShare is available
  if (typeof navigator.canShare === 'function') {
    try {
      const testFile = new File([''], 'test.png', { type: 'image/png' });
      return navigator.canShare({ files: [testFile] });
    } catch {
      return false;
    }
  }

  return false;
}

/**
 * Check if general navigator.share is available
 */
export function canShareNative(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
}

/**
 * Share generated image file natively, or gracefully fallback to download
 */
export async function shareCanvasImage(
  canvas: HTMLCanvasElement,
  content: ShareableContent
): Promise<{ status: 'shared' | 'downloaded' | 'fallback_clipboard'; message?: string }> {
  const filename = `madar-alyaqeen-${content.type}-${Date.now()}.png`;

  if (canShareFiles()) {
    try {
      const file = await exportCanvasToFile(canvas, filename);
      await navigator.share({
        title: content.title || SITE_CONFIG.name,
        text: `${content.title ? content.title + '\n' : ''}${SITE_CONFIG.name} — ${SITE_CONFIG.productionUrl}`,
        files: [file],
      });
      return { status: 'shared', message: 'تم فتح قائمة المشاركة بنجاح' };
    } catch (err: unknown) {
      // If user cancelled, don't download unnecessarily unless it was an AbortError
      if (err instanceof Error && err.name === 'AbortError') {
        return { status: 'shared', message: 'تم إلغاء المشاركة' };
      }
      // If sharing files failed, fallback to download
      downloadCanvasImage(canvas, filename);
      return { status: 'downloaded', message: 'تم حفظ الصورة إلى جهازك بنجاح' };
    }
  }

  // File sharing not supported on this device/browser (e.g. Desktop Chrome) -> Download directly
  downloadCanvasImage(canvas, filename);
  return { status: 'downloaded', message: 'تم تنزيل الصورة بدقة عالية إلى جهازك' };
}

/**
 * Social Sharing Providers Configuration
 */
export const SOCIAL_SHARE_PROVIDERS: SocialShareLink[] = [
  {
    id: 'whatsapp',
    nameAr: 'واتساب',
    nameEn: 'WhatsApp',
    icon: 'MessageCircle',
    color: '#25D366',
    getUrl: (text: string, url: string) => {
      const fullText = `${text}\n\n${url}`;
      return `https://api.whatsapp.com/send?text=${encodeURIComponent(fullText)}`;
    },
  },
  {
    id: 'telegram',
    nameAr: 'تيليجرام',
    nameEn: 'Telegram',
    icon: 'Send',
    color: '#229ED9',
    getUrl: (text: string, url: string) => {
      return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    },
  },
  {
    id: 'x',
    nameAr: 'منصة إكس (تويتر)',
    nameEn: 'X (Twitter)',
    icon: 'Twitter',
    color: '#000000',
    getUrl: (text: string, url: string) => {
      // Limit tweet preview to 200 chars for clean display
      const truncated = text.length > 200 ? `${text.substring(0, 197)}...` : text;
      return `https://x.com/intent/tweet?text=${encodeURIComponent(truncated)}&url=${encodeURIComponent(url)}`;
    },
  },
  {
    id: 'facebook',
    nameAr: 'فيسبوك',
    nameEn: 'Facebook',
    icon: 'Facebook',
    color: '#1877F2',
    getUrl: (_text: string, url: string) => {
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    },
  },
];

