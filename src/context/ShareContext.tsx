import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { ShareableContent, ShareTab } from '../types/sharing';
import { ShareModal } from '../components/sharing/ShareModal';
import { handleNativeShare } from '../services/shareService';

export interface OpenShareOptions {
  forceModal?: boolean;
  initialTab?: ShareTab;
}

export interface OpenShareResult {
  status: 'shared' | 'cancelled' | 'fallback_opened';
}

interface ShareContextValue {
  openShare: (content: ShareableContent, options?: OpenShareOptions) => Promise<OpenShareResult>;
  openCardShare: (content: ShareableContent) => void;
  closeShare: () => void;
  isShareOpen: boolean;
  activeContent: ShareableContent | null;
}

const ShareContext = createContext<ShareContextValue | null>(null);

export const ShareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeContent, setActiveContent] = useState<ShareableContent | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [initialTab, setInitialTab] = useState<ShareTab>('apps');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const openShare = useCallback(
    async (
      content: ShareableContent,
      options?: OpenShareOptions
    ): Promise<OpenShareResult> => {
      if (options?.forceModal) {
        setActiveContent(content);
        setInitialTab(options.initialTab || 'image_share');
        setIsOpen(true);
        return { status: 'fallback_opened' };
      }

      // Trigger Web Share API synchronously inside the user's click event
      // before any asynchronous work or React state transitions so transient
      // user activation is preserved on iOS Safari, Android Chrome, and PWAs.
      const nativeResult = await handleNativeShare(content);

      if (nativeResult.status === 'shared') {
        setToastMessage('تمت المشاركة بنجاح');
        return { status: 'shared' };
      }

      if (nativeResult.status === 'cancelled') {
        // User dismissed the system share sheet: do not show checkmark, error, or modal.
        return { status: 'cancelled' };
      }

      // Native sharing is unsupported or rejected by the browser:
      // open the responsive fallback sharing dialog (WhatsApp, Telegram, X, Facebook, Copy, Image Card).
      setActiveContent(content);
      setInitialTab(options?.initialTab || 'apps');
      setIsOpen(true);
      return { status: 'fallback_opened' };
    },
    []
  );

  const openCardShare = useCallback((content: ShareableContent) => {
    setActiveContent(content);
    setInitialTab('image_share');
    setIsOpen(true);
  }, []);

  const closeShare = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      openShare,
      openCardShare,
      closeShare,
      isShareOpen: isOpen,
      activeContent,
    }),
    [openShare, openCardShare, closeShare, isOpen, activeContent]
  );

  return (
    <ShareContext.Provider value={value}>
      {children}

      {/* Global confirmation toast shown ONLY after native share completes */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] flex items-center gap-2.5 px-5 py-3 rounded-full bg-emerald-950/95 text-emerald-100 border border-gold/50 shadow-2xl backdrop-blur-md text-sm font-bold animate-fade-in pointer-events-none"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {isOpen && activeContent && (
        <ShareModal
          content={activeContent}
          isOpen={isOpen}
          initialTab={initialTab}
          onClose={closeShare}
        />
      )}
    </ShareContext.Provider>
  );
};

export const useShare = (): ShareContextValue => {
  const context = useContext(ShareContext);
  if (!context) {
    throw new Error('useShare must be used within a ShareProvider');
  }
  return context;
};
