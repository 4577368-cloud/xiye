import { motion } from 'framer-motion';
import { FilterType } from '../types';
import { filterOptions } from '../data/tools';

interface FilterBarProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-10">
      {filterOptions.map((option) => (
        <motion.button
          key={option.value}
          onClick={() => onFilterChange(option.value)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            group relative px-5 py-2.5 text-sm font-medium transition-all duration-200
            border flex items-center gap-2.5 overflow-hidden
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
  );
}
