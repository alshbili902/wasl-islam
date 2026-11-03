import React from 'react';
import { Search, X, Filter, Crown, ShieldCheck, Flame, Scale, BookOpen, Heart, Sparkles, CheckCircle2, Bookmark } from 'lucide-react';
import { ProphetCategoryId, PROPHET_CATEGORIES } from '../../data/prophetsTypes';

export type ReadStatusFilter = 'all' | 'read' | 'unread' | 'bookmarked';

interface ProphetFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: ProphetCategoryId;
  onCategoryChange: (cat: ProphetCategoryId) => void;
  readStatus: ReadStatusFilter;
  onReadStatusChange: (status: ReadStatusFilter) => void;
  totalFilteredCount: number;
  totalCount: number;
}

export const ProphetFilters: React.FC<ProphetFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  readStatus,
  onReadStatusChange,
  totalFilteredCount,
  totalCount,
}) => {
  const getCategoryIcon = (id: ProphetCategoryId) => {
    switch (id) {
      case 'ulu_al_azm':
        return Crown;
      case 'patience':
        return ShieldCheck;
      case 'trust':
        return Flame;
      case 'wisdom':
        return Scale;
      case 'calling':
        return BookOpen;
      case 'family':
        return Heart;
      default:
        return Sparkles;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Bar & Status Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gold absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ابحث باسم النبي، أو لقبه، أو بالكلمات المفتاحية (مثل: موسى، إبراهيم، الصبر، زمزم)..."
            className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white dark:bg-[#111D2C] border border-gold/25 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="مسح البحث"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Read Status Filter Buttons */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-royal/5 dark:bg-white/5 border border-gold/20 shrink-0 self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => onReadStatusChange('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              readStatus === 'all'
                ? 'gold-gradient text-royal shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-gold'
            }`}
          >
            الكل ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => onReadStatusChange('read')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 whitespace-nowrap ${
              readStatus === 'read'
                ? 'gold-gradient text-royal shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-emerald-500'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>المقروء</span>
          </button>
          <button
            type="button"
            onClick={() => onReadStatusChange('bookmarked')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 whitespace-nowrap ${
              readStatus === 'bookmarked'
                ? 'gold-gradient text-royal shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-gold'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>المحفوظات</span>
          </button>
        </div>
      </div>

      {/* Thematic Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
        {PROPHET_CATEGORIES.map((cat) => {
          const Icon = getCategoryIcon(cat.id);
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onCategoryChange(cat.id)}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap border ${
                isSelected
                  ? 'royal-gradient text-white border-gold/40 shadow-md'
                  : 'bg-white/60 dark:bg-[#111D2C]/60 text-slate-700 dark:text-slate-300 hover:bg-gold/10 border-gold/15'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-gold' : 'text-gold/80'}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Results summary counter */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span>
          عرض <strong className="text-gold font-bold">{totalFilteredCount}</strong> من أصل {totalCount} نبياً ورسولاً
        </span>
        {searchQuery && (
          <span>
            نتائج مطابقة لكلمة: «<span className="text-slate-700 dark:text-slate-200">{searchQuery}</span>»
          </span>
        )}
      </div>
    </div>
  );
};

