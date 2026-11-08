import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { ShareableContent } from '../../types/sharing';
import { useShare } from '../../context/ShareContext';

export interface ShareButtonProps {
  content: ShareableContent;
  variant?: 'primary' | 'secondary' | 'icon' | 'pill' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  customLabel?: string;
  className?: string;
  title?: string;
  forceModal?: boolean;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  content,
  variant = 'secondary',
  size = 'md',
  showLabel = true,
  customLabel,
  className = '',
  title = 'مشاركة المحتوى',
  forceModal = false,
}) => {
  const { openShare } = useShare();
  const [isSharing, setIsSharing] = useState(false);
  const [sharedSuccess, setSharedSuccess] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isSharing) return;

    // Invoke openShare synchronously on the first line so navigator.share()
    // executes inside the original user gesture with transient user activation intact.
    const sharePromise = openShare(content, { forceModal });
    setIsSharing(true);

    try {
      const result = await sharePromise;
      if (result.status === 'shared') {
        setSharedSuccess(true);
        setTimeout(() => setSharedSuccess(false), 2200);
      }
    } finally {
      setIsSharing(false);
    }
  };

  const label = sharedSuccess ? 'تمت المشاركة' : customLabel || 'مشاركة';

  // Base sizing
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-sm px-3.5 py-1.5 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  }[size];

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }[size];

  // Variants
  let variantClass = '';
  switch (variant) {
    case 'primary':
      variantClass =
        'bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-[#072A20] font-black shadow-md shadow-gold/20 hover:scale-[1.02] active:scale-[0.98] border border-gold/40';
      break;
    case 'pill':
      variantClass =
        'rounded-full bg-gold/15 hover:bg-gold/25 text-gold-light hover:text-gold border border-gold/30 hover:border-gold/50 shadow-xs font-bold';
      break;
    case 'icon':
      variantClass =
        'p-2 rounded-xl bg-white/5 hover:bg-gold/20 text-white/70 hover:text-gold border border-white/10 hover:border-gold/30 transition-all';
      break;
    case 'ghost':
      variantClass =
        'bg-transparent hover:bg-gold/10 text-gold-light hover:text-gold font-bold';
      break;
    case 'secondary':
    default:
      variantClass =
        'bg-white/5 hover:bg-gold/15 text-white/80 hover:text-gold border border-white/10 hover:border-gold/30 font-bold transition-all';
      break;
  }

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={isSharing}
        className={`${variantClass} ${className} flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gold/50 disabled:opacity-60`}
        title={title}
        aria-label={title}
      >
        {sharedSuccess ? (
          <Check className={`${iconSizes} text-emerald-400`} />
        ) : (
          <Share2 className={iconSizes} />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isSharing}
      className={`inline-flex items-center justify-center rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold/50 disabled:opacity-60 ${sizeClasses} ${variantClass} ${className}`}
      title={title}
      aria-label={title}
    >
      {sharedSuccess ? (
        <Check className={`${iconSizes} text-emerald-400`} />
      ) : (
        <Share2 className={iconSizes} />
      )}
      {showLabel && <span>{label}</span>}
    </button>
  );
};
