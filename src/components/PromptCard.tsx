import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prompt, PromptCategory } from '../types';

interface PromptCardProps {
  prompt: Prompt;
  onCopy: (text: string) => Promise<{ success: boolean }>;
  onEdit?: (prompt: Prompt) => void;
  onDelete?: (id: string) => Promise<{ success: boolean; error?: string }>;
}

const categoryColors: Record<PromptCategory, string> = {
  writing: 'text-pink-400 border-pink-400/30 bg-pink-400/10',
  coding: 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10',
  design: 'text-violet-400 border-violet-400/30 bg-violet-400/10',
  analysis: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
  other: 'text-zinc-400 border-zinc-400/30 bg-zinc-400/10',
};

const categoryLabels: Record<PromptCategory, string> = {
  writing: '写作',
  coding: '编程',
  design: '设计',
  analysis: '分析',
  other: '其他',
};

export function PromptCard({ prompt, onCopy, onEdit, onDelete }: PromptCardProps) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopy = async () => {
    const result = await onCopy(prompt.content);
    if (result.success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleEdit = () => {
    onEdit?.(prompt);
  };

  const handleDelete = async () => {
    if (confirm('确定要删除这个提示词吗？')) {
      await onDelete?.(prompt.id);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="group p-5 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.06] transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-[15px] font-medium text-white/90">{prompt.title}</h3>
            <span className={`text-[10px] px-1.5 py-0.5 border rounded-sm ${categoryColors[prompt.category]}`}>
              {categoryLabels[prompt.category]}
            </span>
          </div>
          <p className="text-[13px] text-white/50">{prompt.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className={`flex-shrink-0 px-3 py-1.5 text-xs font-medium transition-all ${
              copied
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'} mr-1.5`} />
            {copied ? '已复制' : '复制'}
          </button>
          {(onEdit || onDelete) && (
            <div className="flex items-center gap-1">
              {onEdit && (
                <button
                  onClick={handleEdit}
                  className="p-1.5 text-white/40 hover:text-cyan-400 transition-colors"
                  title="编辑"
                >
                  <i className="fa-solid fa-pen text-xs" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={handleDelete}
                  className="p-1.5 text-white/40 hover:text-red-400 transition-colors"
                  title="删除"
                >
                  <i className="fa-solid fa-trash text-xs" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="relative">
        <div
          className={`relative p-4 bg-black/40 rounded-sm border border-white/10 ${
            isExpanded ? '' : 'max-h-32 overflow-hidden'
          }`}
        >
          <p className="text-[13px] text-zinc-300 leading-relaxed whitespace-pre-wrap">
            {prompt.content}
          </p>
          {!isExpanded && prompt.content.length > 150 && (
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />
          )}
        </div>

        {prompt.content.length > 150 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-[12px] text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
          >
            <i className={`fa-solid fa-chevron-${isExpanded ? 'up' : 'down'}`} />
            {isExpanded ? '收起' : '展开更多'}
          </button>
        )}
      </div>

      {prompt.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {prompt.tags.map((tag) => (
            <span key={tag} className="text-[10px] text-white/30 px-1.5 py-0.5 bg-white/[0.04]">
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
