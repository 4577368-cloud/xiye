import { motion } from 'framer-motion';
import { Command, CommandCategory, commandCategoryLabels, commandCategoryIcons, workflowGroupLabels } from '../types/commands';
import { CommandCard } from './CommandCard';
import { useCommands } from '../hook/useCommands';

const categories: { value: CommandCategory | 'all'; label: string; icon: string }[] = [
  { value: 'all', label: '全部', icon: 'fa-layer-group' },
  { value: 'mac', label: 'Mac', icon: 'fa-apple' },
  { value: 'ollama', label: 'Ollama', icon: 'fa-robot' },
  { value: 'docker', label: 'Docker', icon: 'fa-docker' },
  { value: 'git', label: 'Git', icon: 'fa-git-alt' },
  { value: 'npm', label: 'NPM', icon: 'fa-npm' },
];

interface CommandsSectionProps {
  onEdit?: (command: Command) => void;
}

export function CommandsSection({ onEdit }: CommandsSectionProps) {
  const {
    groupedCommands,
    loading,
    activeCategory,
    searchQuery,
    setActiveCategory,
    setSearchQuery,
    copyToClipboard,
    deleteCommand,
  } = useCommands();

  return (
    <section className="py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-3">命令行专区</h2>
          <p className="text-zinc-400">常用开发命令，按工作流分组，一键复制使用</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value as CommandCategory | 'all')}
              className={`px-4 py-2 text-sm font-medium border transition-all flex items-center gap-2 ${
                activeCategory === cat.value
                  ? 'bg-white text-black border-white'
                  : 'bg-transparent text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-zinc-200'
              }`}
            >
              <i className={`fa-brands ${cat.icon} text-xs`} />
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
              placeholder="搜索命令..."
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:border-cyan-500 outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent animate-spin" />
          </div>
        ) : groupedCommands.length === 0 ? (
          <div className="text-center py-16 text-zinc-500">
            <i className="fa-solid fa-terminal text-4xl mb-4 opacity-30" />
            <p>暂无命令</p>
          </div>
        ) : (
          <div className="space-y-8">
            {groupedCommands.map((group, groupIndex) => (
              <motion.div
                key={group.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: groupIndex * 0.1 }}
              >
                {/* Workflow Group Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg">
                    <span className="text-lg">{workflowGroupLabels[group.name] || group.name}</span>
                    <span className="text-xs text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-full">
                      {group.commands.length} 个命令
                    </span>
                  </div>
                  {/* Step flow indicator */}
                  <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/30 to-transparent" />
                </div>

                {/* Commands Grid with Step Numbers */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {group.commands.map((cmd, cmdIndex) => (
                    <motion.div
                      key={cmd.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: groupIndex * 0.1 + cmdIndex * 0.05 }}
                      className="relative"
                    >
                      {/* Step Number Badge */}
                      {cmd.step_order !== undefined && cmd.step_order > 0 && (
                        <div className="absolute -left-3 -top-3 w-6 h-6 bg-cyan-500 text-black text-xs font-bold rounded-full flex items-center justify-center z-10 shadow-lg">
                          {cmd.step_order}
                        </div>
                      )}
                      <CommandCard 
                        command={cmd} 
                        onCopy={copyToClipboard} 
                        onEdit={onEdit} 
                        onDelete={deleteCommand}
                        showStepNumber={false}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
