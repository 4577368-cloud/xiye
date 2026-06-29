import { motion } from 'framer-motion';
import { FilterType } from '../types';
import { filterOptions } from '../data/tools';
import { Theme } from '../hook/useTheme';

interface FilterBarProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  availableTags?: string[];
  activeTag?: string | null;
  onTagChange?: (tag: string | null) => void;
  theme: Theme;
  searchQuery?: string;
  resultCount?: number;
}

export function FilterBar({ 
  activeFilter, 
  onFilterChange, 
  availableTags = [],
  activeTag,
  onTagChange,
  theme,
  searchQuery,
  resultCount = 0
}: FilterBarProps) {
  const isDark = theme === 'dark';
  const hasSearchQuery = searchQuery && searchQuery.trim().length > 0;
  return (
    <div className="space-y-4 mb-6">
      {/* 搜索结果提示 */}
      {hasSearchQuery && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`px-4 py-3 rounded-xl border ${
            isDark
              ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
              : 'bg-cyan-50 border-cyan-200 text-cyan-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-search text-sm" />
            <span className="text-sm font-medium">
              搜索 "<span className="font-semibold">{searchQuery}</span>" 
              找到 <span className="font-bold">{resultCount}</span> 个结果
            </span>
            <button
              onClick={() => onFilterChange('all')}
              className={`ml-auto text-xs px-2 py-1 rounded transition-colors ${
                isDark
                  ? 'bg-white/10 hover:bg-white/20'
                  : 'bg-cyan-100 hover:bg-cyan-200'
              }`}
            >
              清除搜索
            </button>
          </div>
        </motion.div>
      )}

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
                ? isDark
                  ? 'bg-white text-black border-white'
                  : 'bg-gray-900 text-white border-gray-900'
                : isDark
                  ? 'bg-transparent text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-zinc-200'
                  : 'bg-transparent text-gray-600 border-gray-300 hover:border-gray-400 hover:text-gray-900'
              }
            `}
          >
            <span className={`
              flex items-center justify-center w-5 h-5 text-xs
              ${activeFilter === option.value
                ? isDark ? 'text-black' : 'text-white'
                : isDark ? 'text-zinc-500 group-hover:text-zinc-300' : 'text-gray-500 group-hover:text-gray-700'
              }
            `}>
              <i className={`fa-solid ${option.icon}`}></i>
            </span>
            <span>{option.label}</span>
            {activeFilter === option.value && (
              <motion.div
                layoutId="activeFilter"
                className={isDark ? 'bg-white -z-10' : 'bg-gray-900 -z-10'}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* 标签筛选 - 允许多行显示 */}
      {availableTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className={`text-xs ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>标签:</span>
          <button
            onClick={() => onTagChange?.(null)}
            className={`text-xs px-2 py-1 rounded-sm transition-colors ${
              activeTag === null
                ? isDark
                  ? 'bg-white text-black'
                  : 'bg-gray-900 text-white'
                : isDark
                  ? 'bg-white/10 text-zinc-400 hover:bg-white/20'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
                  ? isDark
                    ? 'bg-white text-black'
                    : 'bg-gray-900 text-white'
                  : isDark
                    ? 'bg-white/10 text-zinc-400 hover:bg-white/20'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
