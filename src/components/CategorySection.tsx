import { useState } from 'react';
import { motion } from 'framer-motion';
import { AITool, ToolType } from '../types';
import { Theme } from '../hook/useTheme';

interface CategorySectionProps {
  tools: AITool[];
  onCategoryClick: (type: ToolType | 'all' | string) => void;
  activeFilter: ToolType | 'all';
  theme: Theme;
}

const categoryConfig: Record<string, { label: string; icon: string; gradient: string; color: string }> = {
  'ai-product': { label: 'AI产品', icon: 'fa-brain', gradient: 'from-cyan-500/20 to-blue-500/20', color: 'text-cyan-400' },
  'website': { label: '网站', icon: 'fa-globe', gradient: 'from-emerald-500/20 to-teal-500/20', color: 'text-emerald-400' },
  'app': { label: '应用', icon: 'fa-mobile-screen-button', gradient: 'from-violet-500/20 to-purple-500/20', color: 'text-violet-400' },
  'github': { label: 'GitHub', icon: 'fa-github', gradient: 'from-slate-500/20 to-gray-500/20', color: 'text-slate-300' },
  'skill': { label: '技能', gradient: 'from-amber-500/20 to-orange-500/20', icon: 'fa-graduation-cap', color: 'text-amber-400' },
};

const categoryOrder: ToolType[] = ['ai-product', 'website', 'app', 'github', 'skill'];

const useCaseConfig: Record<string, { label: string; icon: string; gradient: string; color: string; tags: string[] }> = {
  'programming': { label: '编程开发', icon: 'fa-code', gradient: 'from-blue-500/20 to-indigo-500/20', color: 'text-blue-400', tags: ['AI编程', '编程', '代码', '开发', 'IDE', 'SDK'] },
  'graphic': { label: '图形处理', icon: 'fa-image', gradient: 'from-purple-500/20 to-pink-500/20', color: 'text-purple-400', tags: ['AI绘画', '图像生成', '设计', '照片', '抠图'] },
  'video': { label: '视频制作', icon: 'fa-video', gradient: 'from-red-500/20 to-orange-500/20', color: 'text-red-400', tags: ['AI视频', '视频生成', '剪辑', '动画'] },
  'music': { label: '音乐音频', icon: 'fa-music', gradient: 'from-green-500/20 to-emerald-500/20', color: 'text-green-400', tags: ['AI音乐', '音乐', '音频', '语音'] },
  'writing': { label: '写作创作', icon: 'fa-pen-to-square', gradient: 'from-amber-500/20 to-yellow-500/20', color: 'text-amber-400', tags: ['写作', '文案', '翻译', '文档'] },
  'search': { label: 'AI搜索', icon: 'fa-search', gradient: 'from-cyan-500/20 to-teal-500/20', color: 'text-cyan-400', tags: ['AI搜索', '搜索', '学术', '问答'] },
  'chat': { label: 'AI对话', icon: 'fa-message', gradient: 'from-indigo-500/20 to-violet-500/20', color: 'text-indigo-400', tags: ['AI对话', 'LLM', '聊天', '对话'] },
  'office': { label: '办公效率', icon: 'fa-file', gradient: 'from-rose-500/20 to-pink-500/20', color: 'text-rose-400', tags: ['PPT', '思维导图', '表格', '办公'] },
};

const useCaseOrder = ['programming', 'graphic', 'video', 'music', 'writing', 'search', 'chat', 'office'];

export function CategorySection({ tools, onCategoryClick, activeFilter, theme }: CategorySectionProps) {
  const [viewMode, setViewMode] = useState<'type' | 'usecase'>('type');
  const isDark = theme === 'dark';

  const categoryCounts = categoryOrder.reduce((acc, type) => {
    acc[type] = tools.filter(tool => tool.type === type).length;
    return acc;
  }, {} as Record<ToolType, number>);

  const useCaseCounts = useCaseOrder.reduce((acc, key) => {
    const config = useCaseConfig[key];
    acc[key] = tools.filter(tool => 
      config.tags.some(tag => tool.tags.includes(tag))
    ).length;
    return acc;
  }, {} as Record<string, number>);

  const totalTools = tools.length;

  return (
    <section className={`max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 transition-colors duration-300 ${isDark ? '' : 'bg-gray-50'}`}>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-6 sm:mb-8"
      >
        <h2 className={`text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>工具分类</h2>
        <p className={`text-sm sm:text-base mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>共收录 {totalTools} 个工具，按类别浏览</p>
        
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setViewMode('type')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === 'type'
                ? 'bg-cyan-500 text-white'
                : isDark
                  ? 'bg-gray-800 text-gray-400 hover:text-white'
                  : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200'
            }`}
          >
            <i className="fa-solid fa-boxes mr-2" />
            按类型
          </button>
          <button
            onClick={() => setViewMode('usecase')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === 'usecase'
                ? 'bg-cyan-500 text-white'
                : isDark
                  ? 'bg-gray-800 text-gray-400 hover:text-white'
                  : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200'
            }`}
          >
            <i className="fa-solid fa-layer-group mr-2" />
            按场景
          </button>
        </div>
      </motion.div>

      {viewMode === 'type' ? (
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
                    ? isDark ? 'bg-white/10 border-white/30 shadow-lg shadow-white/5' : 'bg-white border-cyan-500 shadow-lg shadow-cyan-500/10'
                    : isDark ? 'bg-white/[0.03] border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.06]' : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-gradient-to-br ${config.gradient} rounded-lg mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                  <i className={`fa-solid ${config.icon} text-sm sm:text-lg ${config.color}`} />
                </div>
                <h3 className={`text-sm sm:text-lg font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{config.label}</h3>
                <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{count} 个工具</p>
                <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity ${
                  isActive ? '' : 'bg-gradient-to-br from-white/5 to-transparent'
                }`} />
              </motion.button>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {useCaseOrder.map((key, index) => {
            const config = useCaseConfig[key];
            const count = useCaseCounts[key];

            return (
              <motion.button
                key={key}
                onClick={() => onCategoryClick(key)}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.03, y: -3 }}
                whileTap={{ scale: 0.98 }}
                className={`group relative p-3 sm:p-4 rounded-xl border transition-all duration-300 text-left ${
                  isDark
                    ? 'bg-white/[0.03] border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.06]'
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <div className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-gradient-to-br ${config.gradient} rounded-lg mb-2 sm:mb-3 group-hover:scale-110 transition-transform`}>
                  <i className={`fa-solid ${config.icon} text-xs sm:text-sm ${config.color}`} />
                </div>
                <h3 className={`text-xs sm:text-sm font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{config.label}</h3>
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{count} 个</p>
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-white/5 to-transparent" />
              </motion.button>
            );
          })}
        </div>
      )}

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
              ? isDark ? 'bg-white/10 border-white/30 text-white' : 'bg-white border-cyan-500 text-cyan-600'
              : isDark ? 'bg-transparent border-white/10 text-gray-400 hover:text-white hover:border-white/30' : 'bg-white border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300'
          }`}
        >
          <i className="fa-solid fa-layer-group" />
          <span>查看全部工具</span>
        </button>
      </motion.div>
    </section>
  );
}