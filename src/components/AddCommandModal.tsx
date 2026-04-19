import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Command, CommandCategory } from '../types/commands';

interface AddCommandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (command: Omit<Command, 'id'>) => Promise<{ success: boolean; error?: string }>;
  editingCommand?: Command | null;
  onUpdate?: (id: string, command: Partial<Command>) => Promise<{ success: boolean; error?: string }>;
}

const categoryOptions: { value: CommandCategory; label: string }[] = [
  { value: 'mac', label: 'Mac' },
  { value: 'ollama', label: 'Ollama' },
  { value: 'docker', label: 'Docker' },
  { value: 'git', label: 'Git' },
  { value: 'npm', label: 'NPM' },
  { value: 'general', label: '通用' },
];

export function AddCommandModal({ isOpen, onClose, onSubmit, editingCommand, onUpdate }: AddCommandModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'general' as CommandCategory,
    command: '',
    description: '',
    tags: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isEditing = !!editingCommand;

  useEffect(() => {
    if (editingCommand) {
      setFormData({
        name: editingCommand.name,
        category: editingCommand.category,
        command: editingCommand.command,
        description: editingCommand.description,
        tags: editingCommand.tags.join(', '),
      });
    } else {
      setFormData({
        name: '',
        category: 'general' as CommandCategory,
        command: '',
        description: '',
        tags: '',
      });
    }
  }, [editingCommand, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.name.trim() || !formData.command.trim() || !formData.description.trim()) {
      setError('请填写必填字段');
      setLoading(false);
      return;
    }

    const data = {
      name: formData.name.trim(),
      category: formData.category,
      command: formData.command.trim(),
      description: formData.description.trim(),
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
    };

    let result;
    if (isEditing && editingCommand && onUpdate) {
      result = await onUpdate(editingCommand.id, data);
    } else {
      result = await onSubmit(data);
    }

    setLoading(false);
    if (result.success) {
      setFormData({ name: '', category: 'general', command: '', description: '', tags: '' });
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
            className="fixed inset-4 md:inset-auto md:top-20 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg bg-zinc-900 border border-zinc-700 z-50 overflow-auto max-h-[calc(100vh-2rem)] md:max-h-[calc(100vh-6rem)]"
          >
            <div className="p-6 pb-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">
                  {isEditing ? '编辑命令' : '添加新命令'}
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
                  <label className="block text-sm text-zinc-400 mb-1">名称 *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-white focus:border-cyan-500 outline-none"
                    placeholder="命令名称"
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-1">分类 *</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as CommandCategory })}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-white focus:border-cyan-500 outline-none"
                  >
                    {categoryOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-1">命令 *</label>
                  <textarea
                    value={formData.command}
                    onChange={e => setFormData({ ...formData, command: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-white focus:border-cyan-500 outline-none resize-none font-mono"
                    placeholder="输入命令..."
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-1">描述 *</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-white focus:border-cyan-500 outline-none"
                    placeholder="命令用途描述"
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-1">标签（用逗号分隔）</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={e => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-white focus:border-cyan-500 outline-none"
                    placeholder="mac, shell, dev..."
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
