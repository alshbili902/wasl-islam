import React from 'react';
import { BookOpen, Crown, Clock, CheckCircle2, Bookmark, BookmarkCheck, Sparkles, ChevronLeft } from 'lucide-react';
import { Prophet } from '../../data/prophetsTypes';

interface ProphetCardProps {
  prophet: Prophet;
  isRead: boolean;
  isBookmarked: boolean;
  onSelect: (prophetId: string) => void;
  onToggleRead: (prophetId: string, e: React.MouseEvent) => void;
  onToggleBookmark: (prophetId: string, e: React.MouseEvent) => void;
}

export const ProphetCard: React.FC<ProphetCardProps> = ({
  prophet,
  isRead,
  isBookmarked,
  onSelect,
  onToggleRead,
  onToggleBookmark,
}) => {
  return (
    <div
      onClick={() => onSelect(prophet.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(prophet.id);
        }
      }}
      className={`group relative rounded-3xl p-6 transition-all duration-300 text-right cursor-pointer flex flex-col justify-between overflow-hidden border ${
        isRead
          ? 'bg-royal/5 dark:bg-white/[0.03] border-gold/30 hover:border-gold'
          : 'bg-white dark:bg-[#111D2C] border-gold/20 hover:border-gold/60 shadow-lg hover:shadow-2xl hover:-translate-y-1'
      }`}
    >
      {/* Subtle Islamic pattern background */}
      <div className="islamic-pattern absolute inset-0 opacity-15 pointer-events-none group-hover:opacity-25 transition-opacity" />

      {/* Decorative top glow */}
      <div className="absolute -top-12 -left-12 w-32 h-32 rounded-full bg-gold/10 blur-2xl pointer-events-none group-hover:bg-gold/20 transition-all" />

      <div className="relative z-10 space-y-4">
        {/* Header badges: Order, Ulu Al-Azm, Bookmark & Read status */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-gold/15 dark:bg-gold/20 text-gold font-bold text-xs flex items-center justify-center border border-gold/30">
              {String(prophet.order).padStart(2, '0')}
            </span>

            {prophet.isUluAlAzm && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[11px] font-extrabold shadow-sm">
                <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>أولو العزم</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => onToggleBookmark(prophet.id, e)}
              title={isBookmarked ? 'إزالة من المحفوظات' : 'حفظ في المفضلة'}
              className="p-1.5 rounded-lg text-slate-400 hover:text-gold hover:bg-gold/10 transition-colors"
              aria-label={isBookmarked ? 'إزالة من المحفوظات' : 'حفظ في المفضلة'}
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-4 h-4 text-gold fill-gold" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              onClick={(e) => onToggleRead(prophet.id, e)}
              title={isRead ? 'تمت القراءة (اضغط للإلغاء)' : 'تحديد كمقروء'}
              className={`p-1.5 rounded-lg transition-colors ${
                isRead
                  ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/15'
                  : 'text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/10'
              }`}
              aria-label={isRead ? 'تمت القراءة' : 'تحديد كمقروء'}
            >
              <CheckCircle2 className={`w-4 h-4 ${isRead ? 'fill-emerald-500 text-white' : ''}`} />
            </button>
          </div>
        </div>

        {/* Name and Title */}
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-royal dark:text-gold group-hover:text-gold transition-colors font-quran leading-tight">
            {prophet.name}
          </h3>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">
            {prophet.title}
          </p>
        </div>

        {/* Short Summary */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
          {prophet.summary}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {prophet.keyThemes.slice(0, 3).map((theme) => (
            <span
              key={theme}
              className="px-2 py-0.5 rounded-md bg-royal/5 dark:bg-white/5 text-[11px] text-slate-600 dark:text-slate-400 border border-gold/15"
            >
              {theme}
            </span>
          ))}
        </div>
      </div>

      {/* Footer info: Quran mentions count, Chapters count, Read button */}
      <div className="relative z-10 pt-4 mt-4 border-t border-gold/15 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-[11px]">
          <span className="inline-flex items-center gap-1" title="عدد مرات ذكره في القرآن الكريم">
            <Sparkles className="w-3.5 h-3.5 text-gold shrink-0" />
            <span>ذكر {prophet.quranMentionsCount} مرات</span>
          </span>
          <span>•</span>
          <span className="inline-flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-gold shrink-0" />
            <span>{prophet.chapters.length} محطات</span>
          </span>
          <span>•</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-gold shrink-0" />
            <span>~{prophet.estimatedReadingTimeMinutes} د</span>
          </span>
        </div>

        <div className="inline-flex items-center gap-1 text-xs font-bold text-gold group-hover:translate-x-[-4px] transition-transform">
          <span>اقرأ القصة</span>
          <ChevronLeft className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

