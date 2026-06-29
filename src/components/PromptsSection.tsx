import { motion } from 'framer-motion';
import { Prompt, PromptCategory } from '../types';
import { PromptCard } from './PromptCard';
import { usePrompts } from '../hook/usePrompts';

const categories: { value: PromptCategory | 'all'; label: string; icon: string }[] = [
  { value: 'all', label: '全部', icon: 'fa-layer-group' },
  { value: 'writing', label: '写作', icon: 'fa-pen-nib' },
  { value: 'coding', label: '编程', icon: 'fa-code' },
  { value: 'design', label: '设计', icon: 'fa-palette' },
  { value: 'analysis', label: '分析', icon: 'fa-chart-line' },
  { value: 'other', label: '其他', icon: 'fa-shapes' },
];

interface PromptsSectionProps {
  onEdit?: (prompt: Prompt) => void;
}

export function PromptsSection({ onEdit }: PromptsSectionProps) {
  const {
    prompts,
    loading,
    activeCategory,
    searchQuery,
    setActiveCategory,
    setSearchQuery,
    copyToClipboard,
    deletePrompt,
  } = usePrompts();

  return (
    <section className="py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-3">AI 提示词库</h2>
          <p className="text-zinc-400">精选高效提示词，一键复制使用</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value as PromptCategory | 'all')}
              className={`px-4 py-2 text-sm font-medium border transition-all flex items-center gap-2 ${
                activeCategory === cat.value
                  ? 'bg-white text-black border-white'
                  : 'bg-transparent text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-zinc-200'
              }`}
            >
              <i className={`fa-solid ${cat.icon} text-xs`} />
              {cat.label}
            </button>
          ))}
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <i className="fa-solid fa-search text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索提示词..."
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:border-cyan-500 outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent animate-spin" />
          </div>
        ) : prompts.length === 0 ? (
          <div className="text-center py-16 text-zinc-500">
            <i className="fa-solid fa-lightbulb text-4xl mb-4 opacity-30" />
            <p>暂无提示词</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {prompts.map((prompt, index) => (
              <motion.div
                key={prompt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <PromptCard prompt={prompt} onCopy={copyToClipboard} onEdit={onEdit} onDelete={deletePrompt} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
