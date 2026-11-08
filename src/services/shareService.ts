/**
 * Unified Sharing Service for Madar Al-Yaqeen
 * خدمة المشاركة الموحدة وتنسيق النصوص وروابط التواصل الاجتماعي
 */

import { ShareableContent, SocialShareLink, NativeShareResult } from '../types/sharing';
import { SITE_CONFIG } from '../config/siteConfig';
import { exportCanvasToFile, downloadCanvasImage } from './imageGeneratorService';

/**
 * Module-level lock to prevent duplicate concurrent navigator.share() calls from rapid taps
 */
let isNativeShareActive = false;

export function isSharingInProgress(): boolean {
  return isNativeShareActive;
}

/**
 * Normalize any URL to a valid, parsable absolute HTTP/HTTPS URL
 */
export function normalizeShareUrl(rawUrl?: string): string {
  const base = SITE_CONFIG.productionUrl || 'https://wasl-islam.fun';
  if (!rawUrl || !rawUrl.trim()) {
    if (typeof window !== 'undefined' && window.location?.href?.startsWith('http')) {
      return window.location.href;
    }
    return base;
  }

  try {
    return new URL(rawUrl, base).toString();
  } catch {
    return base;
  }
}

/**
 * Format core Arabic Islamic content with full diacritics, proper quotes, and verified citations
 * (without the trailing URL footer so native share doesn't duplicate the URL)
 */
export function formatContentBody(content: ShareableContent): string {
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
      if (content.explanation) sections.push(content.explanation);
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

  return sections.join('\n\n');
}

/**
 * Format Arabic Islamic content with full diacritics, proper quotes, verified citations, and canonical URL footer
 */
export function formatContentAsText(content: ShareableContent): string {
  const url = normalizeShareUrl(content.canonicalUrl);
  const body = formatContentBody(content);
  return `${body}\n\n───\nنُشرت عبر ${SITE_CONFIG.name}\n${url}`;
}

/**
 * Safe cross-browser text copy to clipboard (supports Clipboard API + textarea fallback)
 */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (!text) return false;

  if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to legacy textarea execCommand fallback
    }
  }

  if (typeof document === 'undefined') return false;

  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.setAttribute('readonly', '');
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, text.length);
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return Boolean(success);
  } catch {
    return false;
  }
}

/**
 * Copy formatted Islamic content text to user clipboard with safety fallback
 */
export async function copyFormattedText(content: ShareableContent): Promise<boolean> {
  const text = formatContentAsText(content);
  return copyTextToClipboard(text);
}

/**
 * Detect whether an error thrown by navigator.share() is a user cancellation
 */
export function isShareAbortError(error: unknown): boolean {
  if (!error) return false;
  if (error instanceof Error) {
    if (error.name === 'AbortError') return true;
    const msg = error.message?.toLowerCase() || '';
    if (
      msg.includes('aborterror') ||
      msg.includes('share canceled') ||
      msg.includes('share cancelled') ||
      msg.includes('canceled') ||
      msg.includes('cancelled')
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Check if general Web Share API (navigator.share) is available
 */
export function canShareNative(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
}

/**
 * Check if the browser natively supports sharing files (PNG images)
 */
export function canShareFiles(file?: File): boolean {
  if (typeof navigator === 'undefined' || typeof navigator.share !== 'function') {
    return false;
  }

  if (typeof navigator.canShare === 'function') {
    try {
      const targetFile =
        file ||
        new File([new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])], 'card.png', {
          type: 'image/png',
        });
      return navigator.canShare({ files: [targetFile] });
    } catch {
      return false;
    }
  }

  return false;
}

/**
 * Trigger the native OS share sheet (iOS Share Sheet / Android Sharesheet / Desktop Share)
 * MUST be invoked directly within the user's click event handler with zero prior awaits
 * to preserve transient user activation.
 */
export async function handleNativeShare(content: ShareableContent): Promise<NativeShareResult> {
  if (isNativeShareActive) {
    return { status: 'cancelled' };
  }

  if (typeof navigator === 'undefined' || typeof navigator.share !== 'function') {
    return { status: 'unsupported' };
  }

  const title = content.title ? `${content.title} | ${SITE_CONFIG.name}` : SITE_CONFIG.name;
  const body = formatContentBody(content);
  const textWithAttribution = `${body}\n\n— ${SITE_CONFIG.name}`;
  const url = normalizeShareUrl(content.canonicalUrl);

  let sharePayload: ShareData = {
    title,
    text: textWithAttribution,
    url,
  };

  // Validate payload with navigator.canShare if available
  if (typeof navigator.canShare === 'function') {
    try {
      if (!navigator.canShare(sharePayload)) {
        const textOnlyPayload: ShareData = {
          title,
          text: `${textWithAttribution}\n${url}`,
        };
        if (navigator.canShare(textOnlyPayload)) {
          sharePayload = textOnlyPayload;
        } else if (navigator.canShare({ url })) {
          sharePayload = { title, url };
        }
      }
    } catch {
      // Keep default sharePayload and let navigator.share attempt it
    }
  }

  isNativeShareActive = true;
  try {
    await navigator.share(sharePayload);
    return { status: 'shared' };
  } catch (error: unknown) {
    if (isShareAbortError(error)) {
      return { status: 'cancelled' };
    }
    return { status: 'failed', error };
  } finally {
    isNativeShareActive = false;
  }
}

/**
 * Share a pre-generated PNG File natively within the user's synchronous gesture activation
 */
export async function sharePreparedImageFile(
  file: File,
  content: ShareableContent
): Promise<NativeShareResult> {
  if (isNativeShareActive) {
    return { status: 'cancelled' };
  }

  if (typeof navigator === 'undefined' || typeof navigator.share !== 'function') {
    return { status: 'unsupported' };
  }

  const title = content.title || SITE_CONFIG.name;
  const caption = `${content.title ? content.title + '\n' : ''}${SITE_CONFIG.name} — ${normalizeShareUrl(content.canonicalUrl)}`;

  // Build candidate payloads from richest to most minimal for cross-browser compatibility
  const candidates: ShareData[] = [
    { files: [file], title, text: caption },
    { files: [file], title },
    { files: [file] },
  ];

  let chosenPayload: ShareData | null = null;

  if (typeof navigator.canShare === 'function') {
    for (const candidate of candidates) {
      try {
        if (navigator.canShare(candidate)) {
          chosenPayload = candidate;
          break;
        }
      } catch {
        // Try next candidate
      }
    }
    if (!chosenPayload) {
      return { status: 'unsupported' };
    }
  } else {
    chosenPayload = candidates[0];
  }

  isNativeShareActive = true;
  try {
    await navigator.share(chosenPayload);
    return { status: 'shared' };
  } catch (error: unknown) {
    if (isShareAbortError(error)) {
      return { status: 'cancelled' };
    }
    return { status: 'failed', error };
  } finally {
    isNativeShareActive = false;
  }
}

/**
 * Share generated image file natively (using pre-rendered File if available to preserve user activation),
 * or gracefully fallback to download when file sharing is unsupported
 */
export async function shareCanvasImage(
  canvas: HTMLCanvasElement,
  content: ShareableContent,
  preRenderedFile?: File | null
): Promise<{ status: 'shared' | 'cancelled' | 'downloaded' | 'failed'; message?: string }> {
  const filename = `madar-alyaqeen-${content.type}-${Date.now()}.png`;

  // 1. If we already have a pre-rendered File ready, invoke navigator.share synchronously!
  if (preRenderedFile && canShareFiles(preRenderedFile)) {
    const res = await sharePreparedImageFile(preRenderedFile, content);
    if (res.status === 'shared') {
      return { status: 'shared', message: 'تمت مشاركة البطاقة بنجاح' };
    }
    if (res.status === 'cancelled') {
      return { status: 'cancelled' };
    }
  } else if (canShareFiles()) {
    // 2. Otherwise convert canvas to File and attempt share
    try {
      const file = await exportCanvasToFile(canvas, filename);
      const res = await sharePreparedImageFile(file, content);
      if (res.status === 'shared') {
        return { status: 'shared', message: 'تمت مشاركة البطاقة بنجاح' };
      }
      if (res.status === 'cancelled') {
        return { status: 'cancelled' };
      }
    } catch {
      // Fall through to download fallback
    }
  }

  // 3. File sharing is unsupported on this browser/device -> Download PNG and inform accurately
  try {
    downloadCanvasImage(canvas, filename);
    return {
      status: 'downloaded',
      message: 'هذا المتصفح لا يدعم مشاركة ملفات الصور مباشرة؛ تم تنزيل البطاقة بدقة عالية إلى جهازك',
    };
  } catch {
    return {
      status: 'failed',
      message: 'تعذر مشاركة أو تنزيل الصورة',
    };
  }
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
      const cleanText = text.includes(url) ? text : `${text}\n\n${url}`;
      return `https://api.whatsapp.com/send?text=${encodeURIComponent(cleanText)}`;
    },
  },
  {
    id: 'telegram',
    nameAr: 'تيليجرام',
    nameEn: 'Telegram',
    icon: 'Send',
    color: '#229ED9',
    getUrl: (text: string, url: string) => {
      const cleanBody = text.replace(url, '').trim();
      return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(cleanBody)}`;
    },
  },
  {
    id: 'x',
    nameAr: 'منصة إكس (تويتر)',
    nameEn: 'X (Twitter)',
    icon: 'Twitter',
    color: '#000000',
    getUrl: (text: string, url: string) => {
      const cleanBody = text.replace(url, '').trim();
      const truncated = cleanBody.length > 210 ? `${cleanBody.substring(0, 207)}...` : cleanBody;
      return `https://x.com/intent/tweet?text=${encodeURIComponent(truncated)}&url=${encodeURIComponent(url)}`;
    },
  },
  {
    id: 'facebook',
    nameAr: 'فيسبوك',
    nameEn: 'Facebook',
    icon: 'Facebook',
    color: '#1877F2',
    getUrl: (text: string, url: string) => {
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
    },
  },
];
