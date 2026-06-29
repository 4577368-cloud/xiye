import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prompt, PromptCategory } from '../types';

interface AddPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prompt: Omit<Prompt, 'id'>) => Promise<{ success: boolean; error?: string }>;
  editingPrompt?: Prompt | null;
  onUpdate?: (id: string, prompt: Partial<Prompt>) => Promise<{ success: boolean; error?: string }>;
}

const categoryOptions: { value: PromptCategory; label: string }[] = [
  { value: 'writing', label: '写作' },
  { value: 'coding', label: '编程' },
  { value: 'design', label: '设计' },
  { value: 'analysis', label: '分析' },
  { value: 'other', label: '其他' },
];

export function AddPromptModal({ isOpen, onClose, onSubmit, editingPrompt, onUpdate }: AddPromptModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'other' as PromptCategory,
    content: '',
    description: '',
    tags: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isEditing = !!editingPrompt;

  useEffect(() => {
    if (editingPrompt) {
      setFormData({
        title: editingPrompt.title,
        category: editingPrompt.category,
        content: editingPrompt.content,
        description: editingPrompt.description,
        tags: editingPrompt.tags.join(', '),
      });
    } else {
      setFormData({
        title: '',
        category: 'other' as PromptCategory,
        content: '',
        description: '',
        tags: '',
      });
    }
  }, [editingPrompt, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.title.trim() || !formData.content.trim() || !formData.description.trim()) {
      setError('请填写必填字段');
      setLoading(false);
      return;
    }

    const data = {
      title: formData.title.trim(),
      category: formData.category,
      content: formData.content.trim(),
      description: formData.description.trim(),
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
    };

    let result;
    if (isEditing && editingPrompt && onUpdate) {
      result = await onUpdate(editingPrompt.id, data);
    } else {
      result = await onSubmit(data);
    }

    setLoading(false);
    if (result.success) {
      setFormData({ title: '', category: 'other', content: '', description: '', tags: '' });
      onClose();
    } else {
      setError(result.error || (isEditing ? '更新失败' : '添加失败'));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:top-20 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl bg-zinc-900 border border-zinc-700 z-50 overflow-auto max-h-[calc(100vh-2rem)] md:max-h-[calc(100vh-6rem)]"
          >
            <div className="p-6 pb-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">
                  {isEditing ? '编辑提示词' : '添加新提示词'}
                </h2>
                <button onClick={onClose} className="text-zinc-400 hover:text-white">
                  <i className="fa-solid fa-xmark text-xl" />
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">标题 *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-white focus:border-cyan-500 outline-none"
                    placeholder="提示词标题"
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-1">分类 *</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as PromptCategory })}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-white focus:border-cyan-500 outline-none"
                  >
                    {categoryOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-1">描述 *</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-white focus:border-cyan-500 outline-none"
                    placeholder="提示词用途描述"
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-1">提示词内容 *</label>
                  <textarea
                    value={formData.content}
                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                    rows={8}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-white focus:border-cyan-500 outline-none resize-none"
                    placeholder="输入完整的提示词内容..."
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-1">标签（用逗号分隔）</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={e => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-white focus:border-cyan-500 outline-none"
                    placeholder="AI, GPT, Claude..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-zinc-600 text-zinc-300 hover:bg-zinc-800 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-cyan-500 text-black font-medium hover:bg-cyan-400 disabled:opacity-50 transition-colors"
                  >
                    {loading ? (isEditing ? '保存中...' : '添加中...') : (isEditing ? '保存' : '添加')}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
