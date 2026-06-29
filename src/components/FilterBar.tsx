import { motion } from 'framer-motion';
import { FilterType } from '../types';
import { filterOptions } from '../data/tools';

interface FilterBarProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  availableTags?: string[];
  activeTag?: string | null;
  onTagChange?: (tag: string | null) => void;
}

export function FilterBar({ 
  activeFilter, 
  onFilterChange, 
  availableTags = [],
  activeTag,
  onTagChange 
}: FilterBarProps) {
  return (
    <div className="space-y-4 mb-10">
      {/* 分类筛选 */}
      <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
        {filterOptions.map((option) => (
          <motion.button
            key={option.value}
            onClick={() => onFilterChange(option.value)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              group relative px-4 py-2 text-sm font-medium transition-all duration-200
              border flex items-center gap-2 whitespace-nowrap flex-shrink-0
              ${activeFilter === option.value
                ? 'bg-white text-black border-white'
                : 'bg-transparent text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-zinc-200'
              }
            `}
          >
            <span className={`
              flex items-center justify-center w-5 h-5 text-xs
              ${activeFilter === option.value ? 'text-black' : 'text-zinc-500 group-hover:text-zinc-300'}
            `}>
              <i className={`fa-solid ${option.icon}`}></i>
            </span>
            <span>{option.label}</span>
            {activeFilter === option.value && (
              <motion.div
                layoutId="activeFilter"
                className="absolute inset-0 bg-white -z-10"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* 标签筛选 - 允许多行显示 */}
      {availableTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-zinc-500">标签:</span>
          <button
            onClick={() => onTagChange?.(null)}
            className={`text-xs px-2 py-1 rounded-sm transition-colors ${
              activeTag === null
                ? 'bg-white text-black'
                : 'bg-white/10 text-zinc-400 hover:bg-white/20'
            }`}
          >
            全部
          </button>
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagChange?.(tag === activeTag ? null : tag)}
              className={`text-xs px-2 py-1 rounded-sm transition-colors ${
                activeTag === tag
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-zinc-400 hover:bg-white/20'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
