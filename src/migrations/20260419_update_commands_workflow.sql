-- ============================================
-- 更新 commands 表，添加 workflow 分组支持
-- ============================================

-- 添加 workflow_group 字段用于工作流分组
ALTER TABLE public.commands 
ADD COLUMN IF NOT EXISTS workflow_group TEXT,
ADD COLUMN IF NOT EXISTS step_order INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT FALSE;

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_commands_workflow_group ON public.commands(workflow_group);
CREATE INDEX IF NOT EXISTS idx_commands_step_order ON public.commands(step_order);

-- 更新 command_category 枚举，添加更多类别
-- 注意：PostgreSQL 不支持直接修改枚举，这里我们创建新枚举并迁移数据

-- 清空现有命令，重新插入带工作流分组的命令
TRUNCATE TABLE public.commands;

-- 插入新的命令数据（按工作流分组）

-- ==================== GIT 工作流 ====================
INSERT INTO public.commands (name, command, description, category, workflow_group, step_order, tags) VALUES
('Git 初始化配置', 'git config --global user.name "Your Name"\ngit config --global user.email "your.email@example.com"\ngit config --global init.defaultBranch main', '配置 Git 用户名、邮箱和默认分支', 'git', 'git-setup', 1, ARRAY['git', 'config', '初始化']),
('Git 克隆仓库', 'git clone https://github.com/username/repository.git\ncd repository', '克隆远程仓库到本地', 'git', 'git-setup', 2, ARRAY['git', 'clone', '下载']),
('Git 创建分支', 'git checkout -b feature/new-feature\n# 或者\ngit switch -c feature/new-feature', '创建并切换到新功能分支', 'git', 'git-workflow', 1, ARRAY['git', 'branch', 'feature']),
('Git 查看状态', 'git status', '查看当前工作区状态', 'git', 'git-workflow', 2, ARRAY['git', 'status']),
('Git 添加文件', 'git add filename.js\n# 添加所有改动\ngit add .', '将文件添加到暂存区', 'git', 'git-workflow', 3, ARRAY['git', 'add']),
('Git 提交更改', 'git commit -m "feat: add new feature"\n# 修改上次提交\ngit commit --amend -m "feat: add new feature with fixes"', '提交暂存区的更改', 'git', 'git-workflow', 4, ARRAY['git', 'commit']),
('Git 拉取更新', 'git pull origin main', '从远程拉取最新代码', 'git', 'git-workflow', 5, ARRAY['git', 'pull']),
('Git 推送代码', 'git push origin feature/new-feature', '推送本地分支到远程', 'git', 'git-workflow', 6, ARRAY['git', 'push']),
('Git 合并分支', 'git checkout main\ngit merge feature/new-feature', '合并功能分支到主分支', 'git', 'git-workflow', 7, ARRAY['git', 'merge']),
('Git 查看日志', 'git log --oneline --graph --all -20', '查看提交历史（图形化）', 'git', 'git-workflow', 8, ARRAY['git', 'log', 'history']),
('Git 撤销修改', 'git checkout -- filename.js\n# 或者恢复所有\ngit reset --hard HEAD', '撤销未提交的修改', 'git', 'git-advanced', 1, ARRAY['git', 'undo', 'reset']),
('Git 暂存修改', 'git stash\n# 恢复暂存\ngit stash pop', '暂存当前修改，稍后恢复', 'git', 'git-advanced', 2, ARRAY['git', 'stash']),
('Git 查看差异', 'git diff\n# 查看已暂存的\ngit diff --staged', '查看文件改动差异', 'git', 'git-advanced', 3, ARRAY['git', 'diff']),
('Git 标签管理', 'git tag -a v1.0.0 -m "Version 1.0.0"\ngit push origin v1.0.0', '创建并推送版本标签', 'git', 'git-advanced', 4, ARRAY['git', 'tag', 'version']),
('Git 变基操作', 'git rebase main\n# 交互式变基\ngit rebase -i HEAD~3', '变基到主分支（整理提交）', 'git', 'git-advanced', 5, ARRAY['git', 'rebase']);

-- ==================== Docker 工作流 ====================
INSERT INTO public.commands (name, command, description, category, workflow_group, step_order, tags) VALUES
('Docker 查看状态', 'docker info\n# 或者查看版本\ndocker --version', '检查 Docker 安装和状态', 'docker', 'docker-setup', 1, ARRAY['docker', 'info']),
('Docker 运行容器', 'docker run -d -p 80:80 --name myapp nginx', '运行 Nginx 容器', 'docker', 'docker-basic', 1, ARRAY['docker', 'run']),
('Docker 查看容器', 'docker ps\n# 查看所有（包括停止的）\ndocker ps -a\n# 查看日志\ndocker logs myapp', '查看运行中的容器', 'docker', 'docker-basic', 2, ARRAY['docker', 'ps', 'list']),
('Docker 停止容器', 'docker stop myapp\n# 删除容器\ndocker rm myapp', '停止并删除容器', 'docker', 'docker-basic', 3, ARRAY['docker', 'stop', 'rm']),
('Docker 构建镜像', 'docker build -t myapp:1.0 .', '构建 Docker 镜像', 'docker', 'docker-workflow', 1, ARRAY['docker', 'build']),
('Docker 查看镜像', 'docker images\n# 删除镜像\ndocker rmi myapp:1.0', '查看本地镜像列表', 'docker', 'docker-workflow', 2, ARRAY['docker', 'images']),
('Docker Compose 启动', 'docker-compose up -d\n# 重建并启动\ndocker-compose up -d --build', '使用 Compose 启动服务', 'docker', 'docker-compose', 1, ARRAY['docker-compose', 'up']),
('Docker Compose 停止', 'docker-compose down\n# 删除卷和网络\ndocker-compose down -v', '停止并移除 Compose 服务', 'docker', 'docker-compose', 2, ARRAY['docker-compose', 'down']),
('Docker Compose 查看', 'docker-compose ps\n# 查看日志\ndocker-compose logs -f', '查看 Compose 服务状态', 'docker', 'docker-compose', 3, ARRAY['docker-compose', 'ps']),
('Docker 进入容器', 'docker exec -it myapp /bin/bash\n# 或者\ndocker exec -it myapp sh', '进入运行中的容器', 'docker', 'docker-advanced', 1, ARRAY['docker', 'exec']),
('Docker 复制文件', 'docker cp myapp:/app/file.txt ./local/\n# 反向复制\ndocker cp ./local/file.txt myapp:/app/', '在容器和主机间复制文件', 'docker', 'docker-advanced', 2, ARRAY['docker', 'cp']),
('Docker 清理资源', 'docker system prune -f\n# 清理卷\ndocker volume prune -f', '清理未使用的 Docker 资源', 'docker', 'docker-advanced', 3, ARRAY['docker', 'cleanup']),
('Docker 网络管理', 'docker network ls\n# 查看网络详情\ndocker network inspect bridge', '查看 Docker 网络', 'docker', 'docker-advanced', 4, ARRAY['docker', 'network']);

-- ==================== NPM/Yarn/PNPM 工作流 ====================
INSERT INTO public.commands (name, command, description, category, workflow_group, step_order, tags) VALUES
('NPM 初始化项目', 'npm init -y', '快速初始化 package.json', 'npm', 'npm-setup', 1, ARRAY['npm', 'init']),
('NPM 安装依赖', 'npm install\n# 安装生产依赖\nnpm install --production\n# 安装并保存到 devDependencies\nnpm install -D package-name', '安装项目依赖', 'npm', 'npm-workflow', 1, ARRAY['npm', 'install']),
('NPM 运行脚本', 'npm run dev\n# 运行 build\nnpm run build\n# 运行 test\nnpm test', '运行 package.json 中的脚本', 'npm', 'npm-workflow', 2, ARRAY['npm', 'run']),
('NPM 更新依赖', 'npm update\n# 检查过时\nnpm outdated\n# 升级到最新\nnpm install package-name@latest', '更新项目依赖', 'npm', 'npm-workflow', 3, ARRAY['npm', 'update']),
('NPM 缓存清理', 'npm cache clean --force\n# 验证缓存\nnpm cache verify', '清理 NPM 缓存', 'npm', 'npm-advanced', 1, ARRAY['npm', 'cache']),
('NPM 发布包', 'npm login\nnpm publish\n# 发布测试版\nnpm publish --tag beta', '登录并发布 NPM 包', 'npm', 'npm-advanced', 2, ARRAY['npm', 'publish']),
('Yarn 安装依赖', 'yarn install\n# 添加依赖\nyarn add package-name\n# 开发依赖\nyarn add -D package-name', '使用 Yarn 安装依赖', 'npm', 'yarn-workflow', 1, ARRAY['yarn', 'install']),
('PNPM 安装依赖', 'pnpm install\n# 添加依赖\npnpm add package-name', '使用 PNPM 安装依赖（更快更省空间）', 'npm', 'pnpm-workflow', 1, ARRAY['pnpm', 'install']),
('PNPM 运行脚本', 'pnpm dev\n# 或使用 run\npnpm run build', '使用 PNPM 运行脚本', 'npm', 'pnpm-workflow', 2, ARRAY['pnpm', 'run']);

-- ==================== Mac 终端命令 ====================
INSERT INTO public.commands (name, command, description, category, workflow_group, step_order, tags) VALUES
('Mac 安装 Homebrew', '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"', '安装 Mac 包管理器 Homebrew', 'mac', 'mac-setup', 1, ARRAY['mac', 'homebrew', 'install']),
('Mac 安装软件', 'brew install git node yarn\n# 安装 GUI 应用\nbrew install --cask visual-studio-code', '使用 Brew 安装软件', 'mac', 'mac-workflow', 1, ARRAY['brew', 'install']),
('Mac 更新软件', 'brew update && brew upgrade\n# 清理旧版本\nbrew cleanup', '更新 Brew 和所有软件', 'mac', 'mac-workflow', 2, ARRAY['brew', 'update']),
('Mac 查找文件', 'find . -name "*.js" -type f\n# 或者使用 mdfind\nmdfind -name "filename"', '查找文件', 'mac', 'mac-basic', 1, ARRAY['find', 'search']),
('Mac 查看端口', 'lsof -i :3000\n# 或者\nnetstat -anv | grep 3000', '查看端口占用情况', 'mac', 'mac-basic', 2, ARRAY['port', 'lsof']),
('Mac 杀死进程', 'kill -9 PID\n# 根据名称查找\nkillall node', '强制终止进程', 'mac', 'mac-basic', 3, ARRAY['kill', 'process']),
('Mac 查看系统信息', 'system_profiler SPHardwareDataType\n# 或者\nneofetch', '查看 Mac 硬件信息', 'mac', 'mac-basic', 4, ARRAY['system', 'info']),
('Mac 清理 DNS', 'sudo dscacheutil -flushcache\nsudo killall -HUP mDNSResponder', '刷新 DNS 缓存', 'mac', 'mac-advanced', 1, ARRAY['dns', 'flush']),
('Mac 显示隐藏文件', 'defaults write com.apple.finder AppleShowAllFiles -bool true\nkillall Finder', '显示 Mac 隐藏文件', 'mac', 'mac-advanced', 2, ARRAY['finder', 'hidden']),
('Mac 创建符号链接', 'ln -s /path/to/original /path/to/link', '创建软链接（快捷方式）', 'mac', 'mac-advanced', 3, ARRAY['ln', 'symlink']);

-- ==================== Ollama AI 命令 ====================
INSERT INTO public.commands (name, command, description, category, workflow_group, step_order, tags) VALUES
('Ollama 安装', 'curl -fsSL https://ollama.com/install.sh | sh', '安装 Ollama', 'ollama', 'ollama-setup', 1, ARRAY['ollama', 'install']),
('Ollama 拉取模型', 'ollama pull llama3.2\n# 拉取代码模型\nollama pull codellama', '下载 AI 模型', 'ollama', 'ollama-workflow', 1, ARRAY['ollama', 'pull']),
('Ollama 运行模型', 'ollama run llama3.2', '启动交互式对话', 'ollama', 'ollama-workflow', 2, ARRAY['ollama', 'run']),
('Ollama 列出模型', 'ollama list', '查看已下载的模型', 'ollama', 'ollama-workflow', 3, ARRAY['ollama', 'list']),
('Ollama 删除模型', 'ollama rm llama3.2', '删除指定模型', 'ollama', 'ollama-workflow', 4, ARRAY['ollama', 'remove']),
('Ollama 复制模型', 'ollama cp llama3.2 my-model', '复制并创建自定义模型', 'ollama', 'ollama-advanced', 1, ARRAY['ollama', 'copy']),
('Ollama 创建自定义模型', 'ollama create my-model -f Modelfile', '从 Modelfile 创建模型', 'ollama', 'ollama-advanced', 2, ARRAY['ollama', 'create']),
('Ollama 查看模型信息', 'ollama show llama3.2', '查看模型详细信息', 'ollama', 'ollama-advanced', 3, ARRAY['ollama', 'show']);

-- ==================== 前端开发命令 ====================
INSERT INTO public.commands (name, command, description, category, workflow_group, step_order, tags) VALUES
('创建 Vite 项目', 'npm create vite@latest my-app -- --template react\n# 或者\nnpm create vite@latest my-app -- --template vue\n# 进入项目\ncd my-app && npm install', '使用 Vite 创建前端项目', 'npm', 'frontend-setup', 1, ARRAY['vite', 'create', 'react', 'vue']),
('创建 Next.js 项目', 'npx create-next-app@latest my-app\n# 使用 TypeScript\nnpx create-next-app@latest my-app --typescript', '创建 Next.js 项目', 'npm', 'frontend-setup', 2, ARRAY['nextjs', 'create']),
('创建 Nuxt 项目', 'npx nuxi@latest init my-app', '创建 Nuxt.js 项目', 'npm', 'frontend-setup', 3, ARRAY['nuxt', 'create']),
('ESLint 初始化', 'npm init @eslint/config@latest', '初始化 ESLint 配置', 'npm', 'frontend-tooling', 1, ARRAY['eslint', 'lint']),
('Prettier 格式化', 'npx prettier --write "src/**/*.{js,jsx,ts,tsx}"', '格式化代码', 'npm', 'frontend-tooling', 2, ARRAY['prettier', 'format']),
('TypeScript 编译', 'npx tsc --noEmit\n# 监视模式\nnpx tsc --watch', 'TypeScript 类型检查', 'npm', 'frontend-tooling', 3, ARRAY['typescript', 'tsc']),
('Tailwind 初始化', 'npx tailwindcss init -p', '初始化 Tailwind CSS 配置', 'npm', 'frontend-tooling', 4, ARRAY['tailwind', 'css']),
('Vite 构建', 'npm run build\n# 预览生产构建\nnpm run preview', '构建生产版本', 'npm', 'frontend-deploy', 1, ARRAY['vite', 'build']),
('NPM 检查安全漏洞', 'npm audit\n# 自动修复\nnpm audit fix', '检查依赖安全漏洞', 'npm', 'frontend-tooling', 5, ARRAY['npm', 'audit', 'security']);

-- ==================== 后端/数据库命令 ====================
INSERT INTO public.commands (name, command, description, category, workflow_group, step_order, tags) VALUES
('SSH 连接服务器', 'ssh username@hostname\n# 使用密钥\nssh -i ~/.ssh/id_rsa username@hostname', 'SSH 远程登录服务器', 'mac', 'backend-deploy', 1, ARRAY['ssh', 'remote']),
('SCP 传输文件', 'scp localfile.txt username@hostname:/path/\n# 目录传输\nscp -r localdir/ username@hostname:/path/', '安全复制文件到服务器', 'mac', 'backend-deploy', 2, ARRAY['scp', 'transfer']),
('PM2 启动服务', 'pm2 start app.js --name myapp\n# 或者\npm2 start npm --name myapp -- run start', '使用 PM2 启动 Node.js 服务', 'npm', 'backend-deploy', 3, ARRAY['pm2', 'process']),
('PM2 查看状态', 'pm2 status\n# 查看日志\npm2 logs myapp\n# 监控\npm2 monit', '查看 PM2 进程状态', 'npm', 'backend-deploy', 4, ARRAY['pm2', 'status']),
('MySQL 连接', 'mysql -u root -p\n# 或者指定数据库\nmysql -u username -p database_name', '连接 MySQL 数据库', 'mac', 'backend-database', 1, ARRAY['mysql', 'database']),
('MongoDB 连接', 'mongosh "mongodb://localhost:27017/mydb"\n# 或者\nmongo localhost:27017/mydb', '连接 MongoDB 数据库', 'mac', 'backend-database', 2, ARRAY['mongodb', 'database']),
('Redis 连接', 'redis-cli\n# 测试连接\nping', '连接 Redis', 'mac', 'backend-database', 3, ARRAY['redis', 'cache']),
('PostgreSQL 连接', 'psql -U username -d database_name\n# 或者\npsql postgresql://user:pass@localhost:5432/mydb', '连接 PostgreSQL', 'mac', 'backend-database', 4, ARRAY['postgresql', 'database']),
('curl 测试 API', 'curl -X GET https://api.example.com/users\n# POST 请求\ncurl -X POST -H "Content-Type: application/json" -d ''{"name":"John"}'' https://api.example.com/users', '使用 curl 测试 API', 'mac', 'backend-test', 1, ARRAY['curl', 'api', 'http']),
('netstat 查看连接', 'netstat -tuln\n# 或者使用 ss\nss -tuln', '查看网络连接和端口', 'mac', 'backend-test', 2, ARRAY['netstat', 'network']);

-- ==================== 实用工具命令 ====================
INSERT INTO public.commands (name, command, description, category, workflow_group, step_order, tags) VALUES
('Tree 查看目录结构', 'tree -L 3\n# 显示文件\ntree -L 3 -f\n# 排除 node_modules\ntree -L 3 -I "node_modules"', '以树形结构查看目录', 'mac', 'tools-file', 1, ARRAY['tree', 'directory']),
('ripgrep 搜索', 'rg "search term"\n# 指定文件类型\nrg "search term" --type js\n# 排除目录\nrg "search term" -g "!node_modules"', '快速搜索文件内容（比 grep 更快）', 'mac', 'tools-search', 1, ARRAY['rg', 'grep', 'search']),
('fd 查找文件', 'fd "*.js"\n# 包含隐藏文件\nfd -H "*.config.js"\n# 排除目录\nfd "*.js" -E node_modules', '快速查找文件（比 find 更快）', 'mac', 'tools-search', 2, ARRAY['fd', 'find']),
('fzf 模糊搜索', 'fzf\n# 配合其他命令\nfind . -type f | fzf\n# 在历史记录中搜索\nhistory | fzf', '交互式模糊搜索', 'mac', 'tools-search', 3, ARRAY['fzf', 'search']),
('HTTPie 测试 API', 'http GET https://api.github.com/users/github\n# POST\nhttp POST https://httpbin.org/post name=John', '人性化的 HTTP 客户端', 'mac', 'tools-api', 1, ARRAY['httpie', 'api']),
('jq 处理 JSON', 'cat data.json | jq ''.name''\n# 格式化\ncat data.json | jq ''.\n# 数组操作\ncat data.json | jq ''.items[] | .name''', '命令行 JSON 处理器', 'mac', 'tools-data', 1, ARRAY['jq', 'json']),
('htop 系统监控', 'htop', '交互式进程查看器', 'mac', 'tools-system', 1, ARRAY['htop', 'monitor']),
('ngrok 内网穿透', 'ngrok http 3000\n# 指定域名\nngrok http 3000 --subdomain=myapp', '将本地服务暴露到公网', 'mac', 'tools-network', 1, ARRAY['ngrok', 'tunnel']),
('Watchman 监视文件', 'watchman watch .\n# 触发脚本\nwatchman -- trigger . mytrigger ''*.js'' -- npm test', 'Facebook 的文件监视工具', 'mac', 'tools-file', 2, ARRAY['watchman', 'watch']),
('Tldr 简化文档', 'tldr tar\n# 或者\ntldr git-commit', '简化的命令行帮助文档', 'mac', 'tools-help', 1, ARRAY['tldr', 'help']);

-- ==================== OpenClaude 部署工作流 ====================
INSERT INTO public.commands (name, command, description, category, workflow_group, step_order, tags) VALUES
('OpenClaude 安装依赖', 'git clone https://github.com/anthropics/openclaude.git\ncd openclaude\nnpm install', '克隆 OpenClaude 仓库并安装依赖', 'npm', 'openclaude-deploy', 1, ARRAY['openclaude', 'anthropic', 'ai', 'install']),
('OpenClaude 配置环境变量', 'cp .env.example .env\n# 编辑 .env 文件，添加你的 Anthropic API Key\n# ANTHROPIC_API_KEY=your_api_key_here', '配置 OpenClaude 环境变量', 'npm', 'openclaude-deploy', 2, ARRAY['openclaude', 'config', 'env']),
('OpenClaude 启动开发服务器', 'npm run dev\n# 或者使用 yarn\nyarn dev', '启动 OpenClaude 开发服务器', 'npm', 'openclaude-deploy', 3, ARRAY['openclaude', 'dev', 'start']),
('OpenClaude 构建生产版本', 'npm run build\nnpm start', '构建并启动生产版本', 'npm', 'openclaude-deploy', 4, ARRAY['openclaude', 'build', 'production']),
('OpenClaude Docker 部署', 'docker build -t openclaude .\ndocker run -p 3000:3000 --env-file .env openclaude', '使用 Docker 部署 OpenClaude', 'docker', 'openclaude-deploy', 5, ARRAY['openclaude', 'docker', 'deploy']);

-- ==================== Hermes Agent 部署工作流 ====================
INSERT INTO public.commands (name, command, description, category, workflow_group, step_order, tags) VALUES
('Hermes Agent 克隆仓库', 'git clone https://github.com/hermesagent/hermes.git\ncd hermes', '克隆 Hermes Agent 仓库', 'git', 'hermes-deploy', 1, ARRAY['hermes', 'agent', 'ai', 'clone']),
('Hermes Agent 安装 Poetry', 'curl -sSL https://install.python-poetry.org | python3 -\n# 或者使用 pip\npip install poetry', '安装 Poetry 依赖管理工具', 'mac', 'hermes-deploy', 2, ARRAY['hermes', 'poetry', 'python']),
('Hermes Agent 安装依赖', 'poetry install\n# 或者使用 pip\npip install -r requirements.txt', '安装 Hermes Agent 依赖', 'mac', 'hermes-deploy', 3, ARRAY['hermes', 'install', 'dependencies']),
('Hermes Agent 配置 API Keys', 'cp .env.template .env\n# 编辑 .env 文件添加:\n# OPENAI_API_KEY=your_key\n# ANTHROPIC_API_KEY=your_key\n# SERPER_API_KEY=your_key', '配置 Hermes Agent API 密钥', 'mac', 'hermes-deploy', 4, ARRAY['hermes', 'config', 'api']),
('Hermes Agent 启动服务', 'poetry run python -m hermes.server\n# 或者\npython -m hermes.server', '启动 Hermes Agent 服务', 'mac', 'hermes-deploy', 5, ARRAY['hermes', 'start', 'server']),
('Hermes Agent Docker 部署', 'docker-compose up -d\n# 查看日志\ndocker-compose logs -f hermes', '使用 Docker Compose 部署 Hermes Agent', 'docker', 'hermes-deploy', 6, ARRAY['hermes', 'docker', 'compose']);
