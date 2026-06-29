import { motion } from 'framer-motion';
import { AITool, ToolType } from '../types';

interface CategorySectionProps {
  tools: AITool[];
  onCategoryClick: (type: ToolType | 'all') => void;
  activeFilter: ToolType | 'all';
}

const categoryConfig: Record<string, { label: string; icon: string; gradient: string; color: string }> = {
  'ai-product': { label: 'AI产品', icon: 'fa-brain', gradient: 'from-cyan-500/20 to-blue-500/20', color: 'text-cyan-400' },
  'website': { label: '网站', icon: 'fa-globe', gradient: 'from-emerald-500/20 to-teal-500/20', color: 'text-emerald-400' },
  'app': { label: '应用', icon: 'fa-mobile-screen-button', gradient: 'from-violet-500/20 to-purple-500/20', color: 'text-violet-400' },
  'github': { label: 'GitHub', icon: 'fa-github', gradient: 'from-slate-500/20 to-gray-500/20', color: 'text-slate-300' },
  'skill': { label: '技能', gradient: 'from-amber-500/20 to-orange-500/20', icon: 'fa-graduation-cap', color: 'text-amber-400' },
};

const categoryOrder: ToolType[] = ['ai-product', 'website', 'app', 'github', 'skill'];

export function CategorySection({ tools, onCategoryClick, activeFilter }: CategorySectionProps) {
  const categoryCounts = categoryOrder.reduce((acc, type) => {
    acc[type] = tools.filter(tool => tool.type === type).length;
    return acc;
  }, {} as Record<ToolType, number>);

  const totalTools = tools.length;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8 sm:mb-12"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">工具分类</h2>
        <p className="text-sm sm:text-base text-gray-400">共收录 {totalTools} 个工具，按类别浏览</p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
        {categoryOrder.map((type, index) => {
          const config = categoryConfig[type];
          const isActive = activeFilter === type;
          const count = categoryCounts[type];

          return (
            <motion.button
              key={type}
              onClick={() => onCategoryClick(type)}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.98 }}
              className={`group relative p-4 sm:p-6 rounded-xl border transition-all duration-300 text-left ${
                isActive
                  ? 'bg-white/10 border-white/30 shadow-lg shadow-white/5'
                  : 'bg-white/[0.03] border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.06]'
              }`}
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-gradient-to-br ${config.gradient} rounded-lg mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                <i className={`fa-solid ${config.icon} text-sm sm:text-lg ${config.color}`} />
              </div>
              <h3 className="text-sm sm:text-lg font-semibold text-white mb-1">{config.label}</h3>
              <p className="text-xs sm:text-sm text-gray-400">{count} 个工具</p>
              <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity ${
                isActive ? '' : 'bg-gradient-to-br from-white/5 to-transparent'
              }`} />
            </motion.button>
          );
        })}
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 sm:mt-12 text-center"
      >
        <button
          onClick={() => onCategoryClick('all')}
          className={`inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg border transition-all text-sm sm:text-base ${
            activeFilter === 'all'
              ? 'bg-white/10 border-white/30 text-white'
              : 'bg-transparent border-white/10 text-gray-400 hover:text-white hover:border-white/30'
          }`}
        >
          <i className="fa-solid fa-layer-group" />
          <span>查看全部工具</span>
        </button>
      </motion.div>
    </section>
  );
}