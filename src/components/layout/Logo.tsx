import React from 'react';

export interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'responsive';
  className?: string;
  priority?: boolean;
  /** Maintained for backwards compatibility */
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  className = '',
  priority = true,
}) => {
  // Balanced responsive dimensions preserving the 2.52:1 horizontal aspect ratio without stretching, distortion, or overflow
  const sizeClasses: Record<string, string> = {
    // Header & Mobile Drawer: clamp(120px, 16vw, 195px), max height 50px ensures it fits comfortably in the 80px navbar
    sm: 'w-[clamp(120px,16vw,195px)] h-auto max-h-[46px] xs:max-h-[50px] sm:max-h-[54px]',
    // Footer & Section Headers: clamp(150px, 20vw, 230px)
    md: 'w-[clamp(150px,20vw,230px)] h-auto max-h-[80px]',
    // Hero & Welcome Screens: clamp(210px, 30vw, 360px)
    lg: 'w-[clamp(210px,30vw,360px)] h-auto max-h-[140px]',
    // Extra large display: clamp(260px, 38vw, 440px)
    xl: 'w-[clamp(260px,38vw,440px)] h-auto max-h-[170px]',
    // Dynamic CSS clamp as suggested
    responsive: 'w-[clamp(125px,15vw,220px)] h-auto',
  };

  const selectedSizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <img
      src="/images/madar-al-yaqeen-logo-horizontal.png"
      alt="شعار منصة مدار اليقين"
      width={901}
      height={358}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      // @ts-expect-error - fetchPriority attribute standard in modern browsers
      fetchpriority={priority ? 'high' : 'auto'}
      className={`object-contain select-none transition-transform duration-300 pointer-events-auto shrink-0 ${selectedSizeClass} ${className}`}
    />
  );
};
