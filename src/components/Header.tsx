import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

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
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/60 border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a href="#/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-white flex items-center justify-center transition-transform group-hover:scale-105">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-black">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
            <span className="text-white font-semibold tracking-tight text-base sm:text-lg hidden sm:block">熙烨的AI集合站</span>
          </a>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id as any)}
                className={`px-4 py-2 text-sm transition-colors flex items-center gap-1.5 ${
                  activeTab === item.id ? 'text-white' : 'text-white/70 hover:text-white'
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
              className="p-2 border border-white/10 hover:border-white/30 hover:bg-white/5 transition-colors"
              title={theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}
            >
              <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'} text-white/70`} />
            </button>

            <button
              onClick={onAddClick}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors"
            >
              <i className="fa-solid fa-plus text-xs" />
              <span className="hidden sm:inline">{getAddButtonLabel()}</span>
            </button>

            {isLoggedIn ? (
              <button
                onClick={onLogout}
                className="px-3 py-2 text-sm text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 transition-colors hidden sm:flex items-center gap-1"
              >
                <i className="fa-solid fa-right-from-bracket text-xs" />
                <span>退出</span>
              </button>
            ) : (
              <button
                onClick={onLoginClick}
                className="px-3 py-2 text-sm text-cyan-400 hover:text-cyan-300 border border-cyan-500/50 hover:border-cyan-400 transition-colors hidden sm:flex items-center gap-1"
              >
                <i className="fa-solid fa-user text-xs" />
                <span>登录</span>
              </button>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-white/70 hover:text-white"
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
            className="fixed top-16 left-0 right-0 z-40 md:hidden backdrop-blur-xl bg-black/80 border-b border-white/5"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-white/10 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <i className={`fa-solid ${item.icon}`} />
                  <span>{item.label}</span>
                </button>
              ))}
              <div className="pt-4 border-t border-white/10">
                {isLoggedIn ? (
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-zinc-400">{username}</span>
                    <button
                      onClick={() => { onLogout?.(); setIsMobileMenuOpen(false); }}
                      className="text-sm text-zinc-400 hover:text-white"
                    >
                      退出登录
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { onLoginClick?.(); setIsMobileMenuOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-cyan-400 border border-cyan-500/50 rounded-lg"
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