import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AITool, ToolType } from '../types';

interface AddToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tool: {
    name: string;
    type: ToolType;
    url: string;
    description: string;
    tags: string[];
    icon: string;
  }) => Promise<{ success: boolean; error?: string }>;
  editingTool?: AITool | null;
  onUpdate?: (id: string, tool: Partial<AITool>) => Promise<{ success: boolean; error?: string }>;
}

const typeOptions: { value: ToolType; label: string }[] = [
  { value: 'ai-product', label: 'AI产品' },
  { value: 'website', label: '网站' },
  { value: 'app', label: '应用' },
  { value: 'github', label: 'GitHub' },
  { value: 'skill', label: '技能' },
];

export function AddToolModal({ isOpen, onClose, onSubmit, editingTool, onUpdate }: AddToolModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'ai-product' as ToolType,
    url: '',
    description: '',
    tags: '',
    icon: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isEditing = !!editingTool;

  useEffect(() => {
    if (editingTool) {
      setFormData({
        name: editingTool.name,
        type: editingTool.type,
        url: editingTool.url,
        description: editingTool.description,
        tags: editingTool.tags.join(', '),
        icon: editingTool.icon || '',
      });
    } else {
      setFormData({
        name: '',
        type: 'ai-product' as ToolType,
        url: '',
        description: '',
        tags: '',
        icon: '',
      });
    }
  }, [editingTool, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.name.trim() || !formData.url.trim() || !formData.description.trim()) {
      setError('请填写必填字段');
      setLoading(false);
      return;
    }

    const data = {
      name: formData.name.trim(),
      type: formData.type,
      url: formData.url.trim(),
      description: formData.description.trim(),
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      icon: formData.icon.trim() || 'fa-cube',
    };

    try {
      let result;
      if (isEditing && editingTool && onUpdate) {
        result = await onUpdate(editingTool.id, data);
      } else {
        result = await onSubmit(data);
      }

      if (result?.success) {
        setFormData({ name: '', type: 'ai-product', url: '', description: '', tags: '', icon: '' });
        onClose();
      } else {
        setError(result?.error || (isEditing ? '更新失败' : '添加失败'));
      }
    } catch (err: any) {
      setError(err?.message || '保存失败，请检查网络连接');
    } finally {
      setLoading(false);
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
                <h2 className="text-xl font-semibold text-white">{isEditing ? '编辑工具' : '添加新工具'}</h2>
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
                    placeholder="工具名称"
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-1">类型 *</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value as ToolType })}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-white focus:border-cyan-500 outline-none"
                  >
                    {typeOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-1">链接 *</label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={e => setFormData({ ...formData, url: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-white focus:border-cyan-500 outline-none"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-1">描述 *</label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-white focus:border-cyan-500 outline-none resize-none"
                    placeholder="简要描述..."
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-1">标签（用逗号分隔）</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={e => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-white focus:border-cyan-500 outline-none"
                    placeholder="AI, 设计, 开发..."
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-1">图标URL</label>
                  <input
                    type="url"
                    value={formData.icon}
                    onChange={e => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-white focus:border-cyan-500 outline-none"
                    placeholder="https://...（可选）"
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
