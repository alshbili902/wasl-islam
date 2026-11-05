import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { ShareableContent } from '../types/sharing';
import { ShareModal } from '../components/sharing/ShareModal';

interface ShareContextValue {
  openShare: (content: ShareableContent) => void;
  closeShare: () => void;
  isShareOpen: boolean;
  activeContent: ShareableContent | null;
}

const ShareContext = createContext<ShareContextValue | null>(null);

export const ShareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeContent, setActiveContent] = useState<ShareableContent | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openShare = useCallback((content: ShareableContent) => {
    setActiveContent(content);
    setIsOpen(true);
  }, []);

  const closeShare = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      openShare,
      closeShare,
      isShareOpen: isOpen,
      activeContent,
    }),
    [openShare, closeShare, isOpen, activeContent]
  );

  return (
    <ShareContext.Provider value={value}>
      {children}
      {isOpen && activeContent && (
        <ShareModal
          content={activeContent}
          isOpen={isOpen}
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

