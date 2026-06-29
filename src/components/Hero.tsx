import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AITool } from '../types';

interface HeroProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  featuredTools?: AITool[];
}

const typeConfig: Record<string, { label: string; gradient: string; accent: string }> = {
  'ai-product': { label: 'AI产品', gradient: 'from-cyan-500/20 to-blue-500/20', accent: 'text-cyan-400 border-cyan-400/30' },
  'website': { label: '网站', gradient: 'from-emerald-500/20 to-teal-500/20', accent: 'text-emerald-400 border-emerald-400/30' },
  'app': { label: '应用', gradient: 'from-violet-500/20 to-purple-500/20', accent: 'text-violet-400 border-violet-400/30' },
  'github': { label: 'GitHub', gradient: 'from-slate-500/20 to-gray-500/20', accent: 'text-slate-300 border-slate-400/30' },
  'skill': { label: '技能', gradient: 'from-amber-500/20 to-orange-500/20', accent: 'text-amber-400 border-amber-400/30' },
};

export const Hero: React.FC<HeroProps> = ({ searchQuery, onSearch, featuredTools }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!featuredTools || featuredTools.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredTools.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [featuredTools]);

  const featuredTool = featuredTools?.[currentSlide];
  const config = featuredTool ? typeConfig[featuredTool.type] || typeConfig['ai-product'] : null;

  return (
    <section className="relative min-h-[55vh] flex flex-col items-center justify-center px-6 py-20 overflow-hidden">
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
            熙烨的
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">AI</span>
            集合站
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            发现优质AI工具、网站、GitHub仓库与技能，一站式探索人工智能世界
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative max-w-xl mx-auto mb-12"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl blur-xl" />
          <div className="relative flex items-center bg-gray-900/80 border border-gray-700/50 rounded-xl overflow-hidden backdrop-blur-sm shadow-2xl">
            <div className="flex items-center px-4 py-4 border-r border-gray-700/50">
              <i className="fa-solid fa-search text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="搜索AI工具、标签、命令..."
              className="w-full px-4 py-4 bg-transparent text-white placeholder-gray-500 outline-none text-base"
            />
            <button className="px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium hover:from-cyan-400 hover:to-blue-400 transition-all">
              搜索
            </button>
          </div>
        </motion.div>

        {featuredTools && featuredTools.length > 0 && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full max-w-2xl mx-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-rocket text-cyan-400" />
                <span className="text-sm font-medium text-gray-300">热门推荐</span>
              </div>
              <div className="flex items-center gap-2">
                {featuredTools.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentSlide ? 'bg-cyan-400 w-6' : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                  />
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-gray-900/50 border border-gray-700/30 rounded-xl p-6 backdrop-blur-sm hover:border-gray-600/50 transition-colors"
              >
                {featuredTool && config && (
                  <div className="flex items-center gap-4">
                    <div className={`flex-shrink-0 w-14 h-14 flex items-center justify-center bg-gradient-to-br ${config.gradient} rounded-lg overflow-hidden border border-white/10 shadow-lg`}>
                      {featuredTool.icon?.startsWith('http') ? (
                        <img
                          src={featuredTool.icon}
                          alt={featuredTool.name}
                          className="w-7 h-7 object-contain"
                        />
                      ) : (
                        <i className={`fa-solid ${featuredTool.icon || 'fa-cube'} text-lg text-white/90`} />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-white">{featuredTool.name}</h3>
                        <span className={`text-xs px-2 py-0.5 border rounded-sm ${config.accent} font-medium`}>
                          {config.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 line-clamp-2">{featuredTool.description}</p>
                    </div>
                    <a
                      href={featuredTool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                    >
                      <span>访问</span>
                      <i className="fa-solid fa-arrow-up-right-from-square text-xs" />
                    </a>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-xs text-gray-500">向下滚动探索更多</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 border-2 border-gray-500 rounded-full flex items-start justify-center p-1.5"
        >
          <div className="w-1 h-2 bg-gray-400 rounded-full" />
        </motion.div>
      </div>
    </section>
  );
};