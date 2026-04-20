import { motion } from 'framer-motion';
import { AITool } from '../types';

interface ToolCardProps {
  tool: AITool;
  isFavorite?: boolean;
  onToggleFavorite?: (e: React.MouseEvent) => void;
  onClick?: () => void;
}

const typeConfig: Record<string, { label: string; gradient: string; accent: string }> = {
  'ai-product': { label: 'AI产品', gradient: 'from-cyan-500/20 to-blue-500/20', accent: 'text-cyan-400 border-cyan-400/30' },
  'website': { label: '网站', gradient: 'from-emerald-500/20 to-teal-500/20', accent: 'text-emerald-400 border-emerald-400/30' },
  'app': { label: '应用', gradient: 'from-violet-500/20 to-purple-500/20', accent: 'text-violet-400 border-violet-400/30' },
  'github': { label: 'GitHub', gradient: 'from-slate-500/20 to-gray-500/20', accent: 'text-slate-300 border-slate-400/30' },
  'skill': { label: '技能', gradient: 'from-amber-500/20 to-orange-500/20', accent: 'text-amber-400 border-amber-400/30' },
};

export function ToolCard({ tool, isFavorite, onToggleFavorite, onClick }: ToolCardProps) {
  const config = typeConfig[tool.type] || typeConfig['ai-product'];
  const isExternalIcon = tool.icon?.startsWith('http') || false;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(e);
  };

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
      className="group block p-6 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.06] transition-all duration-300 cursor-pointer relative"
    >
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gradient-to-br ${config.gradient} rounded-sm overflow-hidden border border-white/10`}>
          {isExternalIcon ? (
            <img
              src={tool.icon}
              alt={tool.name}
              className="w-6 h-6 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  const fallback = document.createElement('i');
                  fallback.className = 'fa-solid fa-cube text-lg text-white/80';
                  parent.appendChild(fallback);
                }
              }}
            />
          ) : (
            <i className={`fa-solid ${tool.icon || 'fa-cube'} text-lg text-white/80`} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-[15px] font-semibold text-white/90 tracking-tight truncate">
              {tool.name}
            </h3>
            <span className={`text-[11px] px-2 py-0.5 border rounded-sm ${config.accent} font-medium tracking-wide`}>
              {config.label}
            </span>
          </div>

          <p className="text-[13px] text-white/50 leading-relaxed line-clamp-2 mb-4">
            {tool.description}
          </p>

          <div className="flex items-center gap-1.5 overflow-hidden">
            {tool.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[11px] text-white/40 px-2 py-1 bg-white/[0.04] rounded-sm truncate flex-shrink-0 max-w-[80px]">
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
                : 'border-white/10 text-white/30 hover:text-white/60 hover:border-white/20 opacity-0 group-hover:opacity-100'
            }`}
          >
            <i className={`fa-${isFavorite ? 'solid' : 'regular'} fa-star text-xs`} />
          </button>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <i className="fa-solid fa-arrow-up-right-from-square text-white/30 text-sm" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
