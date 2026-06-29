import { useState } from 'react';
import { motion } from 'framer-motion';
import { Command, CommandCategory, commandCategoryLabels } from '../types/commands';

interface CommandCardProps {
  command: Command;
  onCopy: (text: string) => Promise<{ success: boolean }>;
  onEdit?: (command: Command) => void;
  onDelete?: (id: string) => Promise<{ success: boolean; error?: string }>;
  showStepNumber?: boolean;
}

const categoryColors: Record<CommandCategory, string> = {
  mac: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
  ollama: 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10',
  docker: 'text-sky-400 border-sky-400/30 bg-sky-400/10',
  git: 'text-orange-400 border-orange-400/30 bg-orange-400/10',
  npm: 'text-red-400 border-red-400/30 bg-red-400/10',
  general: 'text-zinc-400 border-zinc-400/30 bg-zinc-400/10',
};

export function CommandCard({ command, onCopy, onEdit, onDelete, showStepNumber }: CommandCardProps) {
  const [copied, setCopied] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const handleEdit = () => {
    onEdit?.(command);
  };

  const handleDelete = async () => {
    if (confirm('确定要删除这个命令吗？')) {
      await onDelete?.(command.id);
    }
  };

  const handleCopy = async () => {
    const result = await onCopy(command.command);
    if (result.success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
            <h3 className="text-[15px] font-medium text-white/90">{command.name}</h3>
            <span className={`text-[10px] px-1.5 py-0.5 border rounded-sm ${categoryColors[command.category]}`}>
              {commandCategoryLabels[command.category]}
            </span>
          </div>
          <p className="text-[13px] text-white/50">{command.description}</p>
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
        <code className="block p-3 bg-black/40 text-[13px] text-cyan-400 font-mono overflow-x-auto whitespace-pre-wrap break-all">
          {command.command}
        </code>
      </div>

      {command.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {command.tags.map((tag) => (
            <span key={tag} className="text-[10px] text-white/30 px-1.5 py-0.5 bg-white/[0.04]">
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
