import { motion } from 'framer-motion';

interface HeaderProps {
  onAddClick?: () => void;
  activeTab?: 'tools' | 'commands' | 'favorites' | 'prompts';
  onTabChange?: (tab: 'tools' | 'commands' | 'favorites' | 'prompts') => void;
  addButtonLabel?: string;
  isLoggedIn?: boolean;
  username?: string | null;
  onLoginClick?: () => void;
  onLogout?: () => void;
}

export function Header({
  onAddClick,
  activeTab = 'tools',
  onTabChange,
  addButtonLabel,
  isLoggedIn,
  username,
  onLoginClick,
  onLogout,
}: HeaderProps) {
  const getAddButtonLabel = () => {
    if (addButtonLabel) return addButtonLabel;
    switch (activeTab) {
      case 'commands': return '添加命令';
      case 'prompts': return '添加提示词';
      default: return '添加工具';
    }
  };
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/60 border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-white flex items-center justify-center transition-transform group-hover:scale-105">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-black">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>
          <span className="text-white font-semibold tracking-tight text-lg">熙烨的AI集合站</span>
        </a>

        <nav className="flex items-center gap-1">
          <button
            onClick={() => onTabChange?.('tools')}
            className={`px-4 py-2 text-sm transition-colors ${
              activeTab === 'tools' ? 'text-white' : 'text-white/70 hover:text-white'
            }`}
          >
            工具
          </button>
          <button
            onClick={() => onTabChange?.('commands')}
            className={`px-4 py-2 text-sm transition-colors ${
              activeTab === 'commands' ? 'text-white' : 'text-white/70 hover:text-white'
            }`}
          >
            命令
          </button>
          <button
            onClick={() => onTabChange?.('prompts')}
            className={`px-4 py-2 text-sm transition-colors flex items-center gap-1.5 ${
              activeTab === 'prompts' ? 'text-white' : 'text-white/70 hover:text-white'
            }`}
          >
            <i className="fa-solid fa-lightbulb text-xs" />
            提示词
          </button>
          <button
            onClick={() => onTabChange?.('favorites')}
            className={`px-4 py-2 text-sm transition-colors flex items-center gap-1.5 ${
              activeTab === 'favorites' ? 'text-white' : 'text-white/70 hover:text-white'
            }`}
          >
            <i className="fa-solid fa-star text-xs" />
            收藏
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={onAddClick}
            className="flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors"
          >
            <i className="fa-solid fa-plus text-xs" />
            {getAddButtonLabel()}
          </button>

          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-400 hidden sm:inline">{username}</span>
              <button
                onClick={onLogout}
                className="px-3 py-2 text-sm text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 transition-colors"
              >
                <i className="fa-solid fa-right-from-bracket text-xs" />
                <span className="hidden sm:inline ml-1">退出</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="px-3 py-2 text-sm text-cyan-400 hover:text-cyan-300 border border-cyan-500/50 hover:border-cyan-400 transition-colors"
            >
              <i className="fa-solid fa-user text-xs" />
              <span className="hidden sm:inline ml-1">登录</span>
            </button>
          )}
        </div>
      </div>
    </motion.header>
  );
}
