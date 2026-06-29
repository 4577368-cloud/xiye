import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { rankingsData, RankingItem } from '../data/rankings';
import { Theme } from '../hook/useTheme';

interface RankingPageProps {
  theme: Theme;
}

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

function formatCalls(calls: number): string {
  if (calls >= 10000) {
    return (calls / 10000).toFixed(1) + '万';
  }
  return calls.toLocaleString();
}

function RankingItemCard({ item, index, isDark }: { item: RankingItem; index: number; isDark: boolean }) {
  const brandColor = getBrandColor(item.name);
  const initials = getInitials(item.name);

  const rankStyle = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-br from-yellow-400 to-amber-500 text-black font-bold';
    if (rank === 2) return 'bg-gradient-to-br from-gray-300 to-gray-400 text-black font-bold';
    if (rank === 3) return 'bg-gradient-to-br from-amber-600 to-amber-700 text-white font-bold';
    return isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500';
  };

  const trendStyle = () => {
    switch (item.trend) {
      case 'up':
        return 'text-green-500 bg-green-500/10';
      case 'down':
        return 'text-red-500 bg-red-500/10';
      default:
        return isDark ? 'text-gray-500 bg-gray-800' : 'text-gray-400 bg-gray-100';
    }
  };

  const trendIcon = () => {
    switch (item.trend) {
      case 'up':
        return 'fa-arrow-up';
      case 'down':
        return 'fa-arrow-down';
      default:
        return 'fa-minus';
    }
  };

  return (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.01 }}
      className={`group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border cursor-pointer transition-all ${
        isDark
          ? 'bg-gray-900/50 border-gray-800 hover:border-gray-700 hover:bg-gray-900/70'
          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
      }`}
      onClick={() => window.open(item.url, '_blank')}
    >
      <div className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-xs sm:text-sm font-medium ${rankStyle(item.rank)}`}>
        {item.rank}
      </div>

      <div className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-gradient-to-br ${brandColor} rounded-lg flex-shrink-0`}>
        {item.icon && item.icon.startsWith('fa-') ? (
          <i className={`fa-solid ${item.icon} text-sm text-white/90`} />
        ) : (
          <span className="text-xs font-bold text-white">{initials}</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className={`text-sm sm:text-base font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {item.name}
        </h3>
        <p className={`text-xs sm:text-sm line-clamp-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
          {item.description}
        </p>
      </div>

      <div className={`flex-shrink-0 text-right ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        {item.score !== undefined ? (
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold text-cyan-400">{item.score}</span>
            <i className="fa-solid fa-star text-amber-400 text-xs" />
          </div>
        ) : item.calls !== undefined ? (
          <div>
            <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{formatCalls(item.calls)}</span>
            <div className="text-xs">调用量</div>
          </div>
        ) : null}
      </div>

      {item.trendValue && (
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${trendStyle()}`}>
          <i className={`fa-solid ${trendIcon()}`} />
          <span>{item.trendValue}</span>
        </div>
      )}

      <div className={`flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
        <i className="fa-solid fa-arrow-up-right-from-square text-sm" />
      </div>
    </motion.div>
  );
}

export function RankingPage({ theme }: RankingPageProps) {
  const [activeRank, setActiveRank] = useState(rankingsData[0].id);
  const isDark = theme === 'dark';
  const currentRanking = rankingsData.find(r => r.id === activeRank) || rankingsData[0];

  return (
    <section className={`max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 transition-colors duration-300 ${isDark ? '' : 'bg-gray-50'}`}>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8 sm:mb-10"
      >
        <h2 className={`text-2xl sm:text-3xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>AI榜单</h2>
        <p className={`text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>追踪最热门、最新、评分最高的AI工具</p>
      </motion.div>

      <div className="flex justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
        {rankingsData.map((ranking) => (
          <motion.button
            key={ranking.id}
            onClick={() => setActiveRank(ranking.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium text-sm sm:text-base transition-all ${
              activeRank === ranking.id
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20'
                : isDark
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {ranking.title}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeRank}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <div className={`mb-4 sm:mb-6 px-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <p className="text-sm">{currentRanking.description}</p>
          </div>

          <div className="space-y-2 sm:space-y-3">
            {currentRanking.items.map((item, index) => (
              <RankingItemCard key={item.id} item={item} index={index} isDark={isDark} />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className={`mt-8 sm:mt-10 text-center p-4 sm:p-6 rounded-xl ${isDark ? 'bg-gray-900/50 border border-gray-800' : 'bg-white border border-gray-200'}`}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <i className="fa-solid fa-clock text-cyan-400" />
          <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>数据更新时间</span>
        </div>
        <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
          2026年6月 • 数据来源：产品使用量统计、用户评分、市场调研
        </p>
      </motion.div>
    </section>
  );
}
