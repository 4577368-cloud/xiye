import { motion } from 'framer-motion';
import { AITool } from '../types';
import { ToolCard } from './ToolCard';

interface ToolGridProps {
  tools: AITool[];
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (tool: AITool) => void;
  onToolClick: (tool: AITool) => void;
}

export function ToolGrid({ tools, isFavorite, onToggleFavorite, onToolClick }: ToolGridProps) {
  if (tools.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 mb-6 rounded-full bg-zinc-800 flex items-center justify-center">
          <i className="fa-solid fa-search text-zinc-500 text-xl"></i>
        </div>
        <h3 className="text-lg font-medium text-zinc-300 mb-2">未找到相关工具</h3>
        <p className="text-sm text-zinc-500">尝试使用其他关键词或筛选条件</p>
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
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
