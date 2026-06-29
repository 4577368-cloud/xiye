import { motion } from 'framer-motion';
import { AITool } from '../types';
import { ToolCard } from './ToolCard';
import { Theme } from '../hook/useTheme';

interface ToolGridProps {
  tools: AITool[];
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (tool: AITool) => void;
  onToolClick: (tool: AITool) => void;
  theme: Theme;
}

export function ToolGrid({ tools, isFavorite, onToggleFavorite, onToolClick, theme }: ToolGridProps) {
  if (tools.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-24 text-center ${theme === 'dark' ? 'text-zinc-400' : 'text-gray-500'}`}>
        <div className={`w-16 h-16 mb-6 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-zinc-800' : 'bg-gray-200'}`}>
          <i className={`fa-solid fa-search text-xl ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-400'}`}></i>
        </div>
        <h3 className={`text-lg font-medium mb-2 ${theme === 'dark' ? 'text-zinc-300' : 'text-gray-700'}`}>未找到相关工具</h3>
        <p className={`text-sm ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-400'}`}>尝试使用其他关键词或筛选条件</p>
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {tools.map((tool, index) => (
        <motion.div
          key={tool.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <ToolCard
            tool={tool}
            isFavorite={isFavorite(tool.id)}
            onToggleFavorite={() => onToggleFavorite(tool)}
            onClick={() => onToolClick(tool)}
            theme={theme}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
