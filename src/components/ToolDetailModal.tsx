import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AITool } from '../types';

interface ToolDetailModalProps {
  tool: AITool | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const typeLabels: Record<string, string> = {
  'ai-product': 'AI产品',
  'website': '网站',
  'app': '应用',
  'github': 'GitHub',
  'skill': '技能',
};

const typeColors: Record<string, string> = {
  'ai-product': 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10',
  'website': 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
  'app': 'text-violet-400 border-violet-400/30 bg-violet-400/10',
  'github': 'text-slate-300 border-slate-400/30 bg-slate-400/10',
  'skill': 'text-amber-400 border-amber-400/30 bg-amber-400/10',
};

export function ToolDetailModal({ tool, isOpen, onClose, isFavorite, onToggleFavorite }: ToolDetailModalProps) {
  const [copied, setCopied] = useState(false);

  if (!tool) return null;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(tool.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const isExternalIcon = tool.icon?.startsWith('http') || false;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:top-20 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl bg-zinc-900 border border-zinc-700 z-50 overflow-auto max-h-[90vh]"
          >
            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 flex items-center justify-center bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-white/10`}>
                    {isExternalIcon ? (
                      <img src={tool.icon} alt={tool.name} className="w-8 h-8 object-contain" />
                    ) : (
                      <i className={`fa-solid ${tool.icon || 'fa-cube'} text-2xl text-white/80`} />
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-white">{tool.name}</h2>
                    <span className={`inline-block mt-1 text-xs px-2 py-0.5 border rounded-sm ${typeColors[tool.type]}`}>
                      {typeLabels[tool.type]}
                    </span>
                  </div>
                </div>
                <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
                  <i className="fa-solid fa-xmark text-xl" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-zinc-400 mb-2">描述</h3>
                  <p className="text-zinc-300 leading-relaxed">{tool.description}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-zinc-400 mb-2">标签</h3>
                  <div className="flex flex-wrap gap-2">
                    {tool.tags.map((tag) => (
                      <span key={tag} className="text-xs text-zinc-400 px-2 py-1 bg-zinc-800 border border-zinc-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-zinc-400 mb-2">链接</h3>
                  <div className="flex items-center gap-2 p-3 bg-zinc-800 border border-zinc-700">
                    <code className="flex-1 text-sm text-cyan-400 truncate">{tool.url}</code>
                    <button
                      onClick={handleCopyUrl}
                      className="px-3 py-1 text-xs bg-zinc-700 text-zinc-300 hover:bg-zinc-600 transition-colors"
                    >
                      {copied ? '已复制' : '复制'}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-zinc-800">
                  <button
                    onClick={onToggleFavorite}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border transition-colors ${
                      isFavorite
                        ? 'bg-amber-500/10 border-amber-500/50 text-amber-400'
                        : 'border-zinc-600 text-zinc-300 hover:bg-zinc-800'
                    }`}
                  >
                    <i className={`fa-${isFavorite ? 'solid' : 'regular'} fa-star`} />
                    {isFavorite ? '已收藏' : '收藏'}
                  </button>
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-cyan-500 text-black font-medium hover:bg-cyan-400 transition-colors"
                  >
                    <i className="fa-solid fa-external-link-alt" />
                    访问网站
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
