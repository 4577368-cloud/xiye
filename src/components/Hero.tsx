import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AITool } from '../types';
import { Theme } from '../hook/useTheme';

interface HeroProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  featuredTools?: AITool[];
  theme: Theme;
}

const typeConfig: Record<string, { label: string; gradient: string; accent: string }> = {
  'ai-product': { label: 'AI产品', gradient: 'from-cyan-500/20 to-blue-500/20', accent: 'text-cyan-400 border-cyan-400/30' },
  'website': { label: '网站', gradient: 'from-emerald-500/20 to-teal-500/20', accent: 'text-emerald-400 border-emerald-400/30' },
  'app': { label: '应用', gradient: 'from-violet-500/20 to-purple-500/20', accent: 'text-violet-400 border-violet-400/30' },
  'github': { label: 'GitHub', gradient: 'from-slate-500/20 to-gray-500/20', accent: 'text-slate-300 border-slate-400/30' },
  'skill': { label: '技能', gradient: 'from-amber-500/20 to-orange-500/20', accent: 'text-amber-400 border-amber-400/30' },
};

const brandColors = [
  'from-red-500 to-orange-500',
  'from-orange-500 to-amber-500',
  'from-amber-500 to-yellow-500',
  'from-yellow-500 to-green-500',
  'from-green-500 to-emerald-500',
  'from-emerald-500 to-teal-500',
  'from-teal-500 to-cyan-500',
  'from-cyan-500 to-blue-500',
  'from-blue-500 to-indigo-500',
  'from-indigo-500 to-violet-500',
  'from-violet-500 to-purple-500',
  'from-purple-500 to-fuchsia-500',
  'from-fuchsia-500 to-pink-500',
  'from-pink-500 to-rose-500',
];

function getBrandColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return brandColors[Math.abs(hash) % brandColors.length];
}

function getInitials(name: string): string {
  const parts = name.split(/[\s\-_.]+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export const Hero: React.FC<HeroProps> = ({ searchQuery, onSearch, featuredTools, theme }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const isDark = theme === 'dark';

  const limitedFeaturedTools = featuredTools?.slice(0, 6) || [];

  useEffect(() => {
    if (!limitedFeaturedTools || limitedFeaturedTools.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % limitedFeaturedTools.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [limitedFeaturedTools]);

  const featuredTool = limitedFeaturedTools?.[currentSlide];
  const config = featuredTool ? typeConfig[featuredTool.type] || typeConfig['ai-product'] : null;
  const brandColor = featuredTool ? getBrandColor(featuredTool.name) : '';
  const initials = featuredTool ? getInitials(featuredTool.name) : '';

  return (
    <section className={`relative min-h-[50vh] sm:min-h-[55vh] flex flex-col items-center justify-center px-4 sm:px-6 py-16 sm:py-20 overflow-hidden transition-colors duration-300 ${isDark ? 'bg-black' : 'bg-gradient-to-b from-gray-100 to-white'}`}>
      <div className={`absolute inset-0 ${isDark ? 'bg-black' : 'bg-white'}`} />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-cyan-500/20 rounded-full blur-[100px] sm:blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 sm:w-80 h-48 sm:h-80 bg-purple-500/20 rounded-full blur-[80px] sm:blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-blue-500/5 rounded-full blur-[120px] sm:blur-[150px]" />
      </div>

      <div className="relative z-10 text-center w-full max-w-4xl mx-auto px-2">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className={`text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
            熙烨的
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">AI</span>
            集合站
          </h1>
          <p className={`text-base sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-xl mx-auto leading-relaxed px-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            发现优质AI工具、网站、GitHub仓库与技能，一站式探索人工智能世界
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative mx-auto mb-8 sm:mb-12"
          style={{ maxWidth: '500px' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl blur-xl" />
          <div className={`relative flex items-center border rounded-xl overflow-hidden backdrop-blur-sm shadow-2xl ${isDark ? 'bg-gray-900/80 border-gray-700/50' : 'bg-white/80 border-gray-200'}`}>
            <div className={`flex items-center px-3 sm:px-4 py-3 sm:py-4 border-r ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
              <i className={`fa-solid fa-search text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="搜索AI工具、标签..."
              className={`w-full px-3 sm:px-4 py-3 sm:py-4 bg-transparent placeholder-gray-500 outline-none text-sm sm:text-base ${isDark ? 'text-white' : 'text-gray-900'}`}
            />
            <button className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium hover:from-cyan-400 hover:to-blue-400 transition-all text-sm">
              搜索
            </button>
          </div>
        </motion.div>

        {limitedFeaturedTools && limitedFeaturedTools.length > 0 && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full max-w-md sm:max-w-lg mx-auto"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4 px-1">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-rocket text-cyan-400" />
                <span className={`text-xs sm:text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>热门推荐</span>
              </div>
              <div className="flex items-center gap-1.5">
                {limitedFeaturedTools.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                      index === currentSlide ? 'bg-cyan-400 w-4 sm:w-6' : isDark ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={`border rounded-xl p-4 sm:p-5 backdrop-blur-sm transition-colors cursor-pointer hover:shadow-lg ${isDark ? 'bg-gray-900/60 border-gray-700/30 hover:border-gray-600/50' : 'bg-white/60 border-gray-200 hover:border-cyan-300'}`}
              >
                {featuredTool && config && (
                  <div className="flex items-center gap-3">
                    <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-gradient-to-br ${brandColor} rounded-lg overflow-hidden shadow-md`}>
                      {featuredTool.icon?.startsWith('http') ? (
                        <img
                          src={featuredTool.icon}
                          alt={featuredTool.name}
                          className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                        />
                      ) : featuredTool.icon && featuredTool.icon.startsWith('fa-') ? (
                        <i className={`fa-solid ${featuredTool.icon} text-base text-white/90`} />
                      ) : (
                        <span className="text-sm font-bold text-white">{initials}</span>
                      )}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className={`text-sm sm:text-base font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{featuredTool.name}</h3>
                        <span className={`text-xs px-2 py-0.5 border rounded-sm ${config.accent} font-medium`}>
                          {config.label}
                        </span>
                      </div>
                      <p className={`text-xs sm:text-sm line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{featuredTool.description}</p>
                    </div>
                    <a
                      href={featuredTool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-colors"
                      style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)' }}
                    >
                      <i className="fa-solid fa-arrow-up-right-from-square text-white text-xs" />
                    </a>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
};