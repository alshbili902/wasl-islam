import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showSubtitle = true }) => {
  const iconDimensions = size === 'sm' ? 'w-9 h-9' : size === 'lg' ? 'w-14 h-14' : 'w-11 h-11';
  const titleSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <div className="flex items-center gap-3 select-none min-w-0">
      <div className={`relative ${iconDimensions} shrink-0 flex items-center justify-center rounded-2xl royal-gradient border border-gold/40 shadow-gold-glow`}>
        <svg viewBox="0 0 100 100" className="w-4/5 h-4/5" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(50,50)">
            <rect
              x="-26"
              y="-26"
              width="52"
              height="52"
              rx="4"
              stroke="#C5A059"
              strokeWidth="2.8"
              fill="#0D4334"
              fillOpacity="0.6"
            />
            <rect
              x="-26"
              y="-26"
              width="52"
              height="52"
              rx="4"
              transform="rotate(45)"
              stroke="#C5A059"
              strokeWidth="2.8"
              fill="#072A20"
              fillOpacity="0.9"
            />
            <circle r="15" stroke="#DFC082" strokeWidth="1.4" strokeDasharray="3 3" />
            <path d="M4 -8A9 9 0 1 0 4 8A7.2 7.2 0 1 1 4 -8Z" fill="#C5A059" />
            <circle cx="-4" cy="0" r="2.2" fill="#DFC082" />
          </g>
        </svg>
      </div>
      <div className="flex flex-col min-w-0">
        <span className={`font-extrabold tracking-tight ${titleSize} text-royal dark:text-white leading-tight truncate`}>
          مدار <span className="text-gold">اليقين</span>
        </span>
        {showSubtitle && (
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 tracking-wide truncate">
            MADAR AL-YAQEEN
          </span>
        )}
      </div>
    </div>
  );
};

