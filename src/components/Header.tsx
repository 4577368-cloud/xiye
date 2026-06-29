import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Theme } from '../hook/useTheme';

interface HeaderProps {
  onAddClick?: () => void;
  activeTab?: 'tools' | 'commands' | 'favorites' | 'prompts' | 'rankings';
  onTabChange?: (tab: 'tools' | 'commands' | 'favorites' | 'prompts' | 'rankings') => void;
  addButtonLabel?: string;
  isLoggedIn?: boolean;
  username?: string | null;
  onLoginClick?: () => void;
  onLogout?: () => void;
  theme?: 'light' | 'dark';
  onThemeChange?: () => void;
}

const navItems = [
  { id: 'tools', label: '工具', icon: 'fa-wrench' },
  { id: 'rankings', label: '榜单', icon: 'fa-chart-line' },
  { id: 'commands', label: '命令', icon: 'fa-terminal' },
  { id: 'prompts', label: '提示词', icon: 'fa-lightbulb' },
  { id: 'favorites', label: '收藏', icon: 'fa-star' },
];

export function Header({
  onAddClick,
  activeTab = 'tools',
  onTabChange,
  addButtonLabel,
  isLoggedIn,
  username,
  onLoginClick,
  onLogout,
  theme = 'dark',
  onThemeChange,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isDark = theme === 'dark';

  const getAddButtonLabel = () => {
    if (addButtonLabel) return addButtonLabel;
    switch (activeTab) {
      case 'commands': return '添加命令';
      case 'prompts': return '添加提示词';
      case 'rankings': return '添加工具';
      default: return '添加工具';
    }
  };

  const handleTabChange = (tab: 'tools' | 'commands' | 'favorites' | 'prompts' | 'rankings') => {
    onTabChange?.(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-colors duration-300 ${
          isDark
            ? 'bg-black/60 border-white/5'
            : 'bg-white/80 border-gray-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a href="#/" className="flex items-center gap-3 group">
            <div className={`w-9 h-9 flex items-center justify-center transition-transform group-hover:scale-105 ${isDark ? 'bg-white' : 'bg-black'}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={isDark ? 'text-black' : 'text-white'}>
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
            <span className={`font-semibold tracking-tight text-base sm:text-lg hidden sm:block ${isDark ? 'text-white' : 'text-gray-900'}`}>熙烨的AI集合站</span>
          </a>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id as any)}
                className={`px-4 py-2 text-sm transition-colors flex items-center gap-1.5 ${
                  activeTab === item.id
                    ? isDark ? 'text-white' : 'text-gray-900'
                    : isDark ? 'text-white/70 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <i className={`fa-solid ${item.icon} text-xs`} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onThemeChange}
              className={`p-2 rounded-lg transition-all ${
                isDark
                  ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400 hover:text-yellow-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'
              }`}
              title={theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}
            >
              <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`} />
            </button>

            <button
              onClick={onAddClick}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-medium hover:from-cyan-400 hover:to-blue-400 transition-all rounded-lg shadow-lg shadow-cyan-500/20"
            >
              <i className="fa-solid fa-plus text-xs" />
              <span className="hidden sm:inline">{getAddButtonLabel()}</span>
            </button>

            {isLoggedIn ? (
              <button
                onClick={onLogout}
                className={`px-3 py-2 text-sm border transition-colors hidden sm:flex items-center gap-1 ${
                  isDark
                    ? 'text-zinc-400 hover:text-white border-zinc-700 hover:border-zinc-500'
                    : 'text-gray-600 hover:text-gray-900 border-gray-300 hover:border-gray-400'
                }`}
              >
                <i className="fa-solid fa-right-from-bracket text-xs" />
                <span>退出</span>
              </button>
            ) : (
              <button
                onClick={onLoginClick}
                className={`px-3 py-2 text-sm border rounded-lg transition-colors hidden sm:flex items-center gap-1 ${
                  isDark
                    ? 'text-cyan-400 hover:text-cyan-300 border-cyan-500/50 hover:border-cyan-400'
                    : 'text-cyan-600 hover:text-cyan-700 border-cyan-300 hover:border-cyan-400'
                }`}
              >
                <i className="fa-solid fa-user text-xs" />
                <span>登录</span>
              </button>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                isDark ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
              aria-label="菜单"
            >
              <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`} />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`fixed top-16 left-0 right-0 z-40 md:hidden backdrop-blur-xl border-b transition-colors ${
              isDark ? 'bg-black/80 border-white/5' : 'bg-white/95 border-gray-200'
            }`}
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-900'
                      : isDark ? 'text-white/70 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <i className={`fa-solid ${item.icon}`} />
                  <span>{item.label}</span>
                </button>
              ))}
              <div className="pt-4 border-t border-gray-200 dark:border-white/10">
                {isLoggedIn ? (
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>{username}</span>
                    <button
                      onClick={() => { onLogout?.(); setIsMobileMenuOpen(false); }}
                      className={`text-sm ${isDark ? 'text-zinc-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                      退出登录
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { onLoginClick?.(); setIsMobileMenuOpen(false); }}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-2 border rounded-lg ${
                      isDark
                        ? 'text-cyan-400 border-cyan-500/50 hover:bg-cyan-500/10'
                        : 'text-cyan-600 border-cyan-300 hover:bg-cyan-50'
                    }`}
                  >
                    <i className="fa-solid fa-user" />
                    <span>登录</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}