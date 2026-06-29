import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Theme } from '../hook/useTheme';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  theme: Theme;
}

export function LoginModal({ isOpen, onClose, onLogin, theme }: LoginModalProps) {
  const isDark = theme === 'dark';
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.username.trim() || !formData.password.trim()) {
      setError('请输入用户名和密码');
      setLoading(false);
      return;
    }

    const result = await onLogin(formData.username.trim(), formData.password.trim());

    setLoading(false);
    if (result.success) {
      setFormData({ username: '', password: '' });
      onClose();
    } else {
      setError(result.error || '登录失败');
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
            className={`fixed inset-0 backdrop-blur-sm z-50 ${isDark ? 'bg-black/60' : 'bg-gray-900/50'}`}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-xl shadow-2xl z-[60] ${
              isDark
                ? 'bg-zinc-900 border border-zinc-700'
                : 'bg-white border border-gray-200'
            }`}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>登录</h2>
                <button onClick={onClose} className={`${isDark ? 'text-zinc-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}>
                  <i className="fa-solid fa-xmark text-xl" />
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={`block text-sm mb-1 ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>用户名</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-lg border outline-none transition-colors ${
                      isDark
                        ? 'bg-zinc-800 border-zinc-700 text-white focus:border-cyan-500'
                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-cyan-500'
                    }`}
                    placeholder="admin"
                    autoFocus
                  />
                </div>

                <div>
                  <label className={`block text-sm mb-1 ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>密码</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-lg border outline-none transition-colors ${
                      isDark
                        ? 'bg-zinc-800 border-zinc-700 text-white focus:border-cyan-500'
                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-cyan-500'
                    }`}
                    placeholder="admin"
                  />
                </div>

                <div className={`text-xs ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                  默认账号: admin / admin
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className={`flex-1 px-4 py-2.5 rounded-lg border transition-colors ${
                      isDark
                        ? 'border-zinc-600 text-zinc-300 hover:bg-zinc-800'
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium rounded-lg hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 transition-all shadow-lg shadow-cyan-500/20"
                  >
                    {loading ? '登录中...' : '登录'}
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
