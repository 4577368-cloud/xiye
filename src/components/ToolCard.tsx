import { motion } from 'framer-motion';
import { AITool } from '../types';
import { Theme } from '../hook/useTheme';

interface ToolCardProps {
  tool: AITool;
  isFavorite?: boolean;
  onToggleFavorite?: (e: React.MouseEvent) => void;
  onClick?: () => void;
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

export function ToolCard({ tool, isFavorite, onToggleFavorite, onClick, theme }: ToolCardProps) {
  const config = typeConfig[tool.type] || typeConfig['ai-product'];
  const isExternalIcon = tool.icon?.startsWith('http') || false;
  const brandColor = getBrandColor(tool.name);
  const initials = getInitials(tool.name);
  const isDark = theme === 'dark';

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(e);
  };

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
      className={`group block p-5 sm:p-6 backdrop-blur-xl border transition-all duration-300 cursor-pointer relative rounded-xl ${
        isDark
          ? 'bg-white/[0.03] border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.06]'
          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-gradient-to-br ${brandColor} rounded-lg overflow-hidden shadow-lg`}>
          {isExternalIcon ? (
            <img
              src={tool.icon}
              alt={tool.name}
              className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `<span class="text-sm sm:text-lg font-bold text-white">${initials}</span>`;
                }
              }}
            />
          ) : tool.icon && tool.icon.startsWith('fa-') ? (
            <i className={`fa-solid ${tool.icon} text-sm sm:text-lg text-white/90`} />
          ) : (
            <span className="text-sm sm:text-lg font-bold text-white">{initials}</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h3 className={`text-sm sm:text-[15px] font-semibold tracking-tight truncate ${isDark ? 'text-white/90' : 'text-gray-900'}`}>
              {tool.name}
            </h3>
            <span className={`text-xs sm:text-[11px] px-2 py-0.5 border rounded-sm ${config.accent} font-medium tracking-wide whitespace-nowrap flex-shrink-0`}>
              {config.label}
            </span>
          </div>

          <p className={`text-xs sm:text-[13px] leading-relaxed line-clamp-2 mb-3 sm:mb-4 ${isDark ? 'text-white/50' : 'text-gray-600'}`}>
            {tool.description}
          </p>

          <div className="flex items-center gap-1.5 overflow-hidden whitespace-nowrap">
            {tool.tags.slice(0, 3).map((tag) => (
              <span key={tag} className={`text-xs sm:text-[11px] px-2 py-1 rounded-sm truncate flex-shrink-0 max-w-[60px] sm:max-w-[70px] ${isDark ? 'text-white/40 bg-white/[0.04]' : 'text-gray-500 bg-gray-100'}`}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex-shrink-0 flex flex-col gap-2">
          <button
            onClick={handleFavoriteClick}
            className={`w-8 h-8 flex items-center justify-center border transition-all ${
              isFavorite
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                : isDark
                  ? 'border-white/10 text-white/30 hover:text-white/60 hover:border-white/20 opacity-0 group-hover:opacity-100'
                  : 'border-gray-200 text-gray-400 hover:text-amber-500 hover:border-amber-500/30 opacity-0 group-hover:opacity-100'
            }`}
          >
            <i className={`fa-${isFavorite ? 'solid' : 'regular'} fa-star text-xs`} />
          </button>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <i className={`fa-solid fa-arrow-up-right-from-square text-sm ${isDark ? 'text-white/30' : 'text-gray-400'}`} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}