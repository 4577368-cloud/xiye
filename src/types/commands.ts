export type CommandCategory = 'mac' | 'ollama' | 'docker' | 'git' | 'npm' | 'general';

export interface Command {
  id: string;
  name: string;
  category: CommandCategory;
  command: string;
  description: string;
  tags: string[];
  workflow_group?: string | null;
  step_order?: number;
  is_favorite?: boolean;
}

export const commandCategoryLabels: Record<CommandCategory, string> = {
  mac: 'Mac',
  ollama: 'Ollama',
  docker: 'Docker',
  git: 'Git',
  npm: 'NPM',
  general: '通用',
};

export const commandCategoryIcons: Record<CommandCategory, string> = {
  mac: 'fa-apple',
  ollama: 'fa-robot',
  docker: 'fa-docker',
  git: 'fa-git-alt',
  npm: 'fa-npm',
  general: 'fa-terminal',
};

// Workflow group labels for display
export const workflowGroupLabels: Record<string, string> = {
  // Git workflows
  'git-setup': '🔧 Git 初始化设置',
  'git-workflow': '🔄 Git 日常 workflow',
  'git-advanced': '🚀 Git 高级操作',
  // Docker workflows
  'docker-setup': '🐳 Docker 环境检查',
  'docker-basic': '📦 Docker 基础命令',
  'docker-workflow': '🔄 Docker 工作流',
  'docker-compose': '⚙️ Docker Compose',
  'docker-advanced': '🚀 Docker 高级操作',
  // NPM workflows
  'npm-setup': '📦 NPM 初始化',
  'npm-workflow': '🔄 NPM 日常 workflow',
  'yarn-workflow': '🧶 Yarn 工作流',
  'pnpm-workflow': '📦 PNPM 工作流',
  'npm-advanced': '🚀 NPM 高级操作',
  // Frontend workflows
  'frontend-setup': '⚛️ 前端项目创建',
  'frontend-tooling': '🛠️ 前端工具链',
  'frontend-deploy': '🚀 前端部署',
  // Backend workflows
  'backend-deploy': '🚀 后端部署',
  'backend-database': '🗄️ 数据库操作',
  'backend-test': '✅ API 测试',
  // Mac workflows
  'mac-setup': '🍎 Mac 环境配置',
  'mac-workflow': '🔄 Mac 日常 workflow',
  'mac-basic': '📋 Mac 基础命令',
  'mac-advanced': '🚀 Mac 高级操作',
  // Ollama workflows
  'ollama-setup': '🤖 Ollama 安装',
  'ollama-workflow': '🔄 Ollama 日常使用',
  'ollama-advanced': '🚀 Ollama 高级操作',
  // Tools workflows
  'tools-file': '📁 文件管理',
  'tools-search': '🔍 搜索工具',
  'tools-api': '🌐 API 测试',
  'tools-data': '📊 数据处理',
  'tools-system': '⚙️ 系统监控',
  'tools-network': '🌐 网络工具',
  'tools-help': '❓ 帮助文档',
  // AI Agent workflows
  'openclaude-deploy': '🤖 OpenClaude 部署工作流',
  'hermes-deploy': '🚀 Hermes Agent 部署工作流',
  '其他': '📦 其他命令',
};
