-- One-time init and seed for Supabase
-- Project: xorfzgubieexgmqhiwiu

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tool_type') THEN
    CREATE TYPE tool_type AS ENUM ('ai-product', 'website', 'app', 'github', 'skill');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'command_category') THEN
    CREATE TYPE command_category AS ENUM ('mac', 'ollama', 'docker', 'git', 'npm', 'general');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.ai_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type tool_type NOT NULL,
  url TEXT NOT NULL,
  description TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  icon TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, tool_id)
);

CREATE TABLE IF NOT EXISTS public.commands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category command_category NOT NULL,
  command TEXT NOT NULL,
  description TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.ai_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commands ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'ai_tools' AND policyname = '所有人可查看AI工具') THEN
    CREATE POLICY "所有人可查看AI工具" ON public.ai_tools FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'ai_tools' AND policyname = '认证用户可添加AI工具') THEN
    CREATE POLICY "认证用户可添加AI工具" ON public.ai_tools FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'ai_tools' AND policyname = '认证用户可更新自己的AI工具') THEN
    CREATE POLICY "认证用户可更新自己的AI工具" ON public.ai_tools FOR UPDATE USING (auth.uid() IS NOT NULL);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'ai_tools' AND policyname = '认证用户可删除自己的AI工具') THEN
    CREATE POLICY "认证用户可删除自己的AI工具" ON public.ai_tools FOR DELETE USING (auth.uid() IS NOT NULL);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'favorites' AND policyname = '用户可以查看自己的收藏') THEN
    CREATE POLICY "用户可以查看自己的收藏" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'favorites' AND policyname = '用户可以添加收藏') THEN
    CREATE POLICY "用户可以添加收藏" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'favorites' AND policyname = '用户可以删除自己的收藏') THEN
    CREATE POLICY "用户可以删除自己的收藏" ON public.favorites FOR DELETE USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'commands' AND policyname = '所有人可查看命令') THEN
    CREATE POLICY "所有人可查看命令" ON public.commands FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'commands' AND policyname = '认证用户可添加命令') THEN
    CREATE POLICY "认证用户可添加命令" ON public.commands FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_ai_tools_type ON public.ai_tools(type);
CREATE INDEX IF NOT EXISTS idx_ai_tools_featured ON public.ai_tools(featured);
CREATE INDEX IF NOT EXISTS idx_commands_category ON public.commands(category);

-- Optional reset for repeated seeding
TRUNCATE TABLE public.favorites;
TRUNCATE TABLE public.ai_tools;
TRUNCATE TABLE public.commands;

INSERT INTO public.ai_tools (name, type, url, description, tags, icon, featured) VALUES
('ChatGPT', 'ai-product', 'https://chat.openai.com', 'OpenAI开发的对话式AI助手，支持自然语言交互和多种任务处理', ARRAY['对话', '写作', '编程', '通用'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/openai/openai-original.svg', true),
('Midjourney', 'ai-product', 'https://www.midjourney.com', '基于Discord的AI图像生成工具，可创建高质量艺术图像', ARRAY['图像生成', '设计', '艺术'], 'https://api.dicebear.com/7.x/identicon/svg?seed=midjourney', true),
('Claude', 'ai-product', 'https://claude.ai', 'Anthropic开发的AI助手，擅长长文本处理和复杂推理', ARRAY['对话', '写作', '分析'], 'https://api.dicebear.com/7.x/identicon/svg?seed=claude', true),
('GitHub Copilot', 'github', 'https://github.com/features/copilot', 'GitHub推出的AI编程助手，提供代码补全和建议', ARRAY['编程', '代码补全', '开发工具'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', true),
('Stable Diffusion', 'github', 'https://github.com/Stability-AI/stablediffusion', '开源的文本到图像生成模型，支持本地部署', ARRAY['图像生成', '开源', '本地部署'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('Notion AI', 'app', 'https://www.notion.so/product/ai', 'Notion内置的AI写作助手，支持内容生成和编辑', ARRAY['写作', '笔记', '生产力'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/notion/notion-original.svg', false),
('Figma AI', 'website', 'https://www.figma.com/ai', 'Figma的设计AI功能，支持设计生成和原型制作', ARRAY['设计', 'UI/UX', '原型'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg', false),
('AutoGPT', 'github', 'https://github.com/Significant-Gravitas/AutoGPT', '实验性的自主AI代理，可自动完成复杂任务', ARRAY['自动化', '代理', '实验性'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('Runway ML', 'website', 'https://runwayml.com', 'AI驱动的创意工具平台，支持视频编辑和图像生成', ARRAY['视频', '图像生成', '创意'], 'https://api.dicebear.com/7.x/identicon/svg?seed=runway', false),
('Prompt Engineering Guide', 'skill', 'https://www.promptingguide.ai', '提示工程完整指南，学习如何优化AI提示词', ARRAY['提示工程', '学习', '技能'], 'fa-book-open', false),
('Hugging Face', 'website', 'https://huggingface.co', 'AI模型和数据集社区，提供大量预训练模型', ARRAY['模型', '社区', '开源'], 'https://api.dicebear.com/7.x/identicon/svg?seed=huggingface', false),
('LangChain', 'github', 'https://github.com/langchain-ai/langchain', '构建LLM应用的框架，支持多种模型和工具集成', ARRAY['框架', '开发', 'LLM'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('DALL-E 3', 'ai-product', 'https://openai.com/dall-e-3', 'OpenAI的图像生成模型，支持高质量图像创作', ARRAY['图像生成', '设计', '艺术'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/openai/openai-original.svg', false),
('Perplexity', 'website', 'https://www.perplexity.ai', 'AI搜索引擎，提供带引用来源的答案', ARRAY['搜索', '研究', '信息'], 'https://api.dicebear.com/7.x/identicon/svg?seed=perplexity', false),
('Cursor', 'app', 'https://cursor.sh', 'AI驱动的代码编辑器，基于VS Code构建', ARRAY['编程', '编辑器', '开发工具'], 'https://api.dicebear.com/7.x/identicon/svg?seed=cursor', false),
('Replicate', 'website', 'https://replicate.com', '运行开源机器学习模型的云平台', ARRAY['模型', 'API', '部署'], 'https://api.dicebear.com/7.x/identicon/svg?seed=replicate', false),
('Vercel AI SDK', 'github', 'https://github.com/vercel/ai', '构建AI应用的开发工具包，支持流式响应', ARRAY['框架', '开发', '流式'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('Anthropic API', 'skill', 'https://docs.anthropic.com', 'Claude API文档，学习如何集成Claude到应用', ARRAY['API', '文档', '集成'], 'fa-code', false),
('Sora', 'ai-product', 'https://openai.com/sora', 'OpenAI的视频生成模型，可创建高质量视频内容', ARRAY['视频生成', '创意', 'AI产品'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/openai/openai-original.svg', false),
('Poe', 'app', 'https://poe.com', 'Quora推出的AI聊天平台，聚合多种AI模型', ARRAY['对话', '聚合', '聊天'], 'https://api.dicebear.com/7.x/identicon/svg?seed=poe', false),
('Gemini', 'ai-product', 'https://gemini.google.com', 'Google开发的多模态AI模型，支持文本、图像、音频和视频理解', ARRAY['对话', '多模态', '搜索', '谷歌'], 'https://api.dicebear.com/7.x/identicon/svg?seed=gemini', true),
('Copilot', 'ai-product', 'https://copilot.microsoft.com', '微软AI助手，集成Bing搜索和GPT-4技术', ARRAY['对话', '搜索', '微软', '办公'], 'https://api.dicebear.com/7.x/identicon/svg?seed=copilot', true),
('Leonardo.ai', 'website', 'https://leonardo.ai', '专业AI图像生成平台，支持多种艺术风格和模型', ARRAY['图像生成', '设计', '艺术', '游戏'], 'https://api.dicebear.com/7.x/identicon/svg?seed=leonardo', false),
('Anthropic Console', 'website', 'https://console.anthropic.com', 'Claude API控制台，管理和监控API使用情况', ARRAY['API', '控制台', '开发'], 'https://api.dicebear.com/7.x/identicon/svg?seed=anthropic', false),
('V0.dev', 'website', 'https://v0.dev', 'Vercel的AI UI生成器，通过自然语言生成React组件', ARRAY['UI生成', 'React', '开发', '设计'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg', true),
('Shadcn UI', 'github', 'https://github.com/shadcn-ui/ui', '精美的React组件库，使用Radix UI和Tailwind CSS构建', ARRAY['UI组件', 'React', 'Tailwind', '开源'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', true),
('Aceternity UI', 'website', 'https://ui.aceternity.com', '现代React组件和动画效果集合', ARRAY['UI组件', '动画', 'React', '设计'], 'https://api.dicebear.com/7.x/identicon/svg?seed=aceternity', false),
('Magic UI', 'github', 'https://github.com/magicui/magicui', '150+免费开源的React动画组件和效果', ARRAY['UI组件', '动画', 'React', '开源'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('Framer', 'app', 'https://www.framer.com', '专业网站设计工具，支持AI生成和可视化编辑', ARRAY['设计', '网站构建', '无代码', 'AI'], 'https://api.dicebear.com/7.x/identicon/svg?seed=framer', false),
('Webflow', 'website', 'https://webflow.com', '可视化网站构建平台，专业级设计到代码转换', ARRAY['网站构建', '无代码', '设计', 'CMS'], 'https://api.dicebear.com/7.x/identicon/svg?seed=webflow', false),
('Lovable', 'website', 'https://lovable.dev', 'AI驱动的全栈应用生成器，从想法到部署', ARRAY['全栈开发', 'AI生成', '无代码', '部署'], 'https://api.dicebear.com/7.x/identicon/svg?seed=lovable', true),
('Bolt.new', 'website', 'https://bolt.new', 'StackBlitz的AI开发环境，即时创建和部署全栈应用', ARRAY['开发环境', 'AI生成', '全栈', '部署'], 'https://api.dicebear.com/7.x/identicon/svg?seed=bolt', true),
('Llama', 'github', 'https://github.com/meta-llama/llama', 'Meta开源的大语言模型，支持本地部署', ARRAY['LLM', '开源', '本地部署', 'Meta'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('Ollama', 'github', 'https://github.com/ollama/ollama', '在本地运行大语言模型的工具，简单易用', ARRAY['LLM', '本地部署', '开源', '工具'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', true),
('LM Studio', 'app', 'https://lmstudio.ai', '本地运行和实验大语言模型的桌面应用', ARRAY['LLM', '本地部署', '桌面应用', '实验'], 'https://api.dicebear.com/7.x/identicon/svg?seed=lmstudio', false),
('Poe API', 'skill', 'https://developer.poe.com', '在Poe平台上创建和发布AI机器人的API文档', ARRAY['API', '机器人', '开发', '文档'], 'fa-robot', false),
('Vercel AI SDK', 'github', 'https://github.com/vercel/ai', '构建AI应用的React/Vue/Svelte SDK', ARRAY['SDK', 'React', 'AI', '流式'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('Next.js AI Chatbot', 'github', 'https://github.com/vercel/ai-chatbot', 'Vercel官方AI聊天机器人模板', ARRAY['模板', 'Next.js', 'AI', '聊天'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('Supabase', 'website', 'https://supabase.com', '开源Firebase替代方案，PostgreSQL数据库和实时功能', ARRAY['数据库', '后端', '开源', '实时'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg', true),
('Prisma', 'website', 'https://www.prisma.io', '下一代Node.js和TypeScript ORM', ARRAY['ORM', '数据库', 'TypeScript', '开发'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg', false),
('Drizzle', 'github', 'https://github.com/drizzle-team/drizzle-orm', 'TypeScript优先的ORM，类型安全且轻量', ARRAY['ORM', 'TypeScript', '数据库', '轻量'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('tRPC', 'github', 'https://github.com/trpc/trpc', '端到端类型安全的API框架', ARRAY['API', 'TypeScript', '全栈', '类型安全'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('Zustand', 'github', 'https://github.com/pmndrs/zustand', '轻量级React状态管理库', ARRAY['状态管理', 'React', '轻量', '开源'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('TanStack Query', 'website', 'https://tanstack.com/query', '强大的异步状态管理库，用于React、Vue等', ARRAY['数据获取', '缓存', 'React', '异步'], 'https://api.dicebear.com/7.x/identicon/svg?seed=tanstack', false),
('React Query', 'skill', 'https://tanstack.com/query/latest/docs/react/overview', 'React数据获取和缓存的最佳实践', ARRAY['React', '数据获取', '缓存', '技能'], 'fa-code', false),
('Tailwind CSS', 'website', 'https://tailwindcss.com', '实用优先的CSS框架，快速构建现代界面', ARRAY['CSS', '样式', '框架', '设计'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg', true),
('Radix UI', 'github', 'https://github.com/radix-ui/primitives', '无样式、可访问性优先的React组件原语', ARRAY['UI组件', '可访问性', 'React', '原语'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('Headless UI', 'github', 'https://github.com/tailwindlabs/headlessui', 'Tailwind Labs出品的完全无样式UI组件', ARRAY['UI组件', 'Tailwind', '无样式', 'React'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('Chakra UI', 'website', 'https://chakra-ui.com', '模块化、可访问的React组件库', ARRAY['UI组件', 'React', '可访问性', '设计'], 'https://api.dicebear.com/7.x/identicon/svg?seed=chakra', false),
('Mantine', 'website', 'https://mantine.dev', '功能齐全的React组件和钩子库', ARRAY['UI组件', 'React', '钩子', '完整'], 'https://api.dicebear.com/7.x/identicon/svg?seed=mantine', false),
('NextUI', 'github', 'https://github.com/nextui-org/nextui', '美观、快速、现代的React UI库', ARRAY['UI组件', 'React', '现代', '美观'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('DaisyUI', 'website', 'https://daisyui.com', '最受欢迎的Tailwind CSS组件库', ARRAY['UI组件', 'Tailwind', '组件库', '流行'], 'https://api.dicebear.com/7.x/identicon/svg?seed=daisy', false),
('Flowbite', 'website', 'https://flowbite.com', '基于Tailwind CSS的开源组件库', ARRAY['UI组件', 'Tailwind', '开源', '组件'], 'https://api.dicebear.com/7.x/identicon/svg?seed=flowbite', false),
('Preline UI', 'website', 'https://preline.co', '开源Tailwind CSS UI组件套件', ARRAY['UI组件', 'Tailwind', '开源', '套件'], 'https://api.dicebear.com/7.x/identicon/svg?seed=preline', false),
('HyperUI', 'github', 'https://github.com/markmead/hyperui', '免费开源的Tailwind CSS组件集合', ARRAY['UI组件', 'Tailwind', '免费', '开源'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('Tailblocks', 'website', 'https://tailblocks.cc', '即用型Tailwind CSS区块模板', ARRAY['模板', 'Tailwind', '区块', '即用'], 'https://api.dicebear.com/7.x/identicon/svg?seed=tailblocks', false),
('Meraki UI', 'github', 'https://github.com/bakateam/merakiui', '现代Tailwind CSS组件集合', ARRAY['UI组件', 'Tailwind', '现代', '集合'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('Kometa UI Kit', 'website', 'https://kit.kometa.co', 'Tailwind CSS UI组件和模板', ARRAY['UI组件', 'Tailwind', '模板', '套件'], 'https://api.dicebear.com/7.x/identicon/svg?seed=kometa', false),
('SaaS UI', 'github', 'https://github.com/saas-js/saas-ui', '构建SaaS应用的React组件库', ARRAY['UI组件', 'SaaS', 'React', '商业'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('Tremor', 'github', 'https://github.com/tremorlabs/tremor', 'React仪表盘组件库，用于数据可视化', ARRAY['仪表盘', '数据可视化', 'React', '组件'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('React Charts', 'skill', 'https://react-chartjs-2.js.org', 'Chart.js的React封装，轻松创建图表', ARRAY['图表', 'React', '数据可视化', '技能'], 'fa-chart-line', false),
('Recharts', 'github', 'https://github.com/recharts/recharts', '基于React和D3的图表库', ARRAY['图表', 'React', 'D3', '数据可视化'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('Victory', 'github', 'https://github.com/FormidableLabs/victory', 'React数据可视化组件库', ARRAY['图表', 'React', '数据可视化', '组件'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('Nivo', 'github', 'https://github.com/plouc/nivo', '基于D3的React数据可视化库', ARRAY['图表', 'React', 'D3', '数据可视化'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('Visx', 'github', 'https://github.com/airbnb/visx', 'Airbnb的低级可视化组件库', ARRAY['图表', 'React', 'Airbnb', '可视化'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('Mermaid', 'github', 'https://github.com/mermaid-js/mermaid', '基于Markdown的图表和流程图生成', ARRAY['图表', 'Markdown', '流程图', '文档'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('Excalidraw', 'github', 'https://github.com/excalidraw/excalidraw', '手绘风格的虚拟白板', ARRAY['白板', '绘图', '手绘', '协作'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('Tldraw', 'github', 'https://github.com/tldraw/tldraw', '可扩展的React白板组件', ARRAY['白板', 'React', '组件', '可扩展'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('React Flow', 'github', 'https://github.com/xyflow/xyflow', '高度可定制的React流程图库', ARRAY['流程图', 'React', '节点', '可定制'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('Dnd Kit', 'github', 'https://github.com/clauderic/dnd-kit', '现代React拖拽工具包', ARRAY['拖拽', 'React', '交互', '工具包'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('React Beautiful DnD', 'github', 'https://github.com/atlassian/react-beautiful-dnd', 'Atlassian出品的React拖拽库', ARRAY['拖拽', 'React', 'Atlassian', '列表'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('Framer Motion', 'github', 'https://github.com/framer/motion', 'React生产级动画库', ARRAY['动画', 'React', '生产级', '流畅'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', true),
('GSAP', 'website', 'https://greensock.com/gsap', '专业级JavaScript动画库', ARRAY['动画', 'JavaScript', '专业', '高性能'], 'https://api.dicebear.com/7.x/identicon/svg?seed=gsap', false),
('React Spring', 'github', 'https://github.com/pmndrs/react-spring', '基于弹簧物理的React动画库', ARRAY['动画', 'React', '物理', '弹簧'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('AutoAnimate', 'github', 'https://github.com/formkit/auto-animate', '零配置的JavaScript动画工具', ARRAY['动画', '零配置', 'JavaScript', '简单'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('Lottie', 'github', 'https://github.com/airbnb/lottie-web', 'After Effects动画导出为JSON并在Web播放', ARRAY['动画', 'After Effects', 'JSON', 'Airbnb'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('Rive', 'website', 'https://rive.app', '实时交互式动画工具', ARRAY['动画', '交互', '实时', '设计'], 'https://api.dicebear.com/7.x/identicon/svg?seed=rive', false),
('Spline', 'website', 'https://spline.design', '3D设计工具，创建交互式3D体验', ARRAY['3D', '设计', '交互', 'WebGL'], 'https://api.dicebear.com/7.x/identicon/svg?seed=spline', false),
('Three.js', 'github', 'https://github.com/mrdoob/three.js', 'JavaScript 3D库', ARRAY['3D', 'WebGL', 'JavaScript', '图形'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', true),
('React Three Fiber', 'github', 'https://github.com/pmndrs/react-three-fiber', 'React的Three.js渲染器', ARRAY['3D', 'React', 'Three.js', '渲染'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('Drei', 'github', 'https://github.com/pmndrs/drei', 'React Three Fiber的辅助组件', ARRAY['3D', 'React', 'Three.js', '组件'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('Leva', 'github', 'https://github.com/pmndrs/leva', 'React的GUI控制面板组件', ARRAY['GUI', 'React', '控制面板', '调试'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('Zustand Devtools', 'skill', 'https://github.com/pmndrs/zustand', 'Zustand状态管理的调试技巧', ARRAY['调试', '状态管理', 'Zustand', '技能'], 'fa-bug', false),
('React DevTools', 'skill', 'https://react.dev/learn/thinking-in-react', 'React开发者工具使用指南', ARRAY['调试', 'React', '开发工具', '技能'], 'fa-tools', false),
('Chrome DevTools', 'skill', 'https://developer.chrome.com/docs/devtools', 'Chrome开发者工具完整指南', ARRAY['调试', 'Chrome', '开发工具', '性能'], 'fa-chrome', false),
('VS Code', 'app', 'https://code.visualstudio.com', '最流行的代码编辑器', ARRAY['编辑器', '开发', '微软', '扩展'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg', true),
('WebStorm', 'app', 'https://www.jetbrains.com/webstorm', 'JetBrains出品的专业JavaScript IDE', ARRAY['IDE', 'JavaScript', 'JetBrains', '专业'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webstorm/webstorm-original.svg', false),
('Sublime Text', 'app', 'https://www.sublimetext.com', '轻量级但功能强大的文本编辑器', ARRAY['编辑器', '轻量', '快速', '文本'], 'https://api.dicebear.com/7.x/identicon/svg?seed=sublime', false),
('Neovim', 'github', 'https://github.com/neovim/neovim', 'Vim的现代化重构版本', ARRAY['编辑器', 'Vim', '终端', '高效'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('Helix', 'github', 'https://github.com/helix-editor/helix', '后现代模态文本编辑器', ARRAY['编辑器', '模态', 'Rust', '现代'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('Warp', 'app', 'https://www.warp.dev', '现代化的Rust终端', ARRAY['终端', 'Rust', '现代', 'AI'], 'https://api.dicebear.com/7.x/identicon/svg?seed=warp', false),
('Fig', 'app', 'https://fig.io', 'IDE风格的终端自动补全', ARRAY['终端', '自动补全', 'IDE', '效率'], 'https://api.dicebear.com/7.x/identicon/svg?seed=fig', false),
('Starship', 'github', 'https://github.com/starship/starship', '最小、极快、无限定制的Shell提示符', ARRAY['Shell', '提示符', 'Rust', '定制'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('Oh My Zsh', 'github', 'https://github.com/ohmyzsh/ohmyzsh', '社区驱动的Zsh框架', ARRAY['Shell', 'Zsh', '框架', '社区'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('Powerlevel10k', 'github', 'https://github.com/romkatv/powerlevel10k', 'Zsh的极速主题', ARRAY['Shell', 'Zsh', '主题', '快速'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('Homebrew', 'website', 'https://brew.sh', 'macOS缺失的包管理器', ARRAY['包管理', 'macOS', '工具', '安装'], 'https://api.dicebear.com/7.x/identicon/svg?seed=homebrew', false),
('asdf', 'github', 'https://github.com/asdf-vm/asdf', '多语言版本管理器', ARRAY['版本管理', '多语言', '工具', '开发'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('nvm', 'github', 'https://github.com/nvm-sh/nvm', 'Node.js版本管理器', ARRAY['Node.js', '版本管理', '工具', '开发'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('fnm', 'github', 'https://github.com/Schniz/fnm', '快速的Node.js版本管理器', ARRAY['Node.js', '版本管理', 'Rust', '快速'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('pnpm', 'github', 'https://github.com/pnpm/pnpm', '快速、节省磁盘空间的包管理器', ARRAY['包管理', 'Node.js', '快速', '高效'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', true),
('Yarn', 'github', 'https://github.com/yarnpkg/yarn', '快速、可靠、安全的依赖管理', ARRAY['包管理', 'Node.js', '依赖', '安全'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('Bun', 'github', 'https://github.com/oven-sh/bun', '极速JavaScript运行时和工具包', ARRAY['运行时', 'JavaScript', '快速', 'Zig'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', true),
('Deno', 'github', 'https://github.com/denoland/deno', '现代JavaScript和TypeScript运行时', ARRAY['运行时', 'TypeScript', '现代', '安全'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('Node.js', 'website', 'https://nodejs.org', 'JavaScript运行时环境', ARRAY['运行时', 'JavaScript', '后端', '服务器'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', true),
('TypeScript', 'website', 'https://www.typescriptlang.org', 'JavaScript的超集，添加类型系统', ARRAY['类型系统', 'JavaScript', '微软', '开发'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', true),
('ESLint', 'github', 'https://github.com/eslint/eslint', '可配置的JavaScript代码检查工具', ARRAY['代码检查', 'JavaScript', '质量', '规范'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('Prettier', 'github', 'https://github.com/prettier/prettier', '固执的代码格式化工具', ARRAY['格式化', '代码风格', '美化', '一致'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('Husky', 'github', 'https://github.com/typicode/husky', 'Git钩子工具，改善提交', ARRAY['Git', '钩子', '提交', '质量'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('Commitlint', 'github', 'https://github.com/conventional-changelog/commitlint', '规范Git提交信息', ARRAY['Git', '提交', '规范', '质量'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('Lint-staged', 'github', 'https://github.com/okonet/lint-staged', '对暂存文件运行代码检查', ARRAY['Git', '代码检查', '暂存', '质量'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('Nx', 'github', 'https://github.com/nrwl/nx', '智能、快速、可扩展的构建系统', ARRAY['构建', 'Monorepo', '可扩展', '智能'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('Turborepo', 'github', 'https://github.com/vercel/turborepo', '高性能JavaScript/TypeScript Monorepo工具', ARRAY['Monorepo', '构建', 'Vercel', '性能'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('Changesets', 'github', 'https://github.com/changesets/changesets', 'Monorepo版本管理和变更日志', ARRAY['版本管理', 'Monorepo', '变更日志', '发布'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('Semantic Release', 'github', 'https://github.com/semantic-release/semantic-release', '全自动版本管理和包发布', ARRAY['发布', '版本管理', '自动化', 'CI/CD'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', false),
('GitHub Actions', 'website', 'https://github.com/features/actions', '自动化工作流和CI/CD', ARRAY['CI/CD', '自动化', '工作流', 'GitHub'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', true),
('Vercel', 'website', 'https://vercel.com', '前端开发者平台，快速部署', ARRAY['部署', '托管', '前端', 'Serverless'], 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg', true),
('Netlify', 'website', 'https://www.netlify.com', '现代Web项目工作流平台', ARRAY['部署', '托管', 'CI/CD', 'Serverless'], 'https://api.dicebear.com/7.x/identicon/svg?seed=netlify', false),
('Railway', 'website', 'https://railway.app', '基础设施平台，从代码到部署', ARRAY['部署', '基础设施', '后端', '数据库'], 'https://api.dicebear.com/7.x/identicon/svg?seed=railway', false),
('Fly.io', 'website', 'https://fly.io', '在全球运行应用，靠近用户', ARRAY['部署', '边缘', '全球', '容器'], 'https://api.dicebear.com/7.x/identicon/svg?seed=flyio', false),
('PlanetScale', 'website', 'https://planetscale.com', 'MySQL平台，开发者优先', ARRAY['数据库', 'MySQL', 'Serverless', '平台'], 'https://api.dicebear.com/7.x/identicon/svg?seed=planetscale', false);

INSERT INTO public.commands (name, category, command, description, tags) VALUES
('安装 Homebrew', 'mac', '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"', 'macOS 包管理器安装', ARRAY['mac', '包管理']),
('安装 Node.js', 'mac', 'brew install node', '通过 Homebrew 安装 Node.js', ARRAY['mac', 'node']),
('安装 pnpm', 'mac', 'brew install pnpm', '安装 pnpm 包管理器', ARRAY['mac', 'pnpm']),
('安装 Git', 'mac', 'brew install git', '安装 Git 版本控制', ARRAY['mac', 'git']),
('安装 Ollama', 'mac', 'brew install ollama', '安装 Ollama 本地 AI 模型', ARRAY['mac', 'ollama']),
('运行 Llama2', 'ollama', 'ollama run llama2', '运行 Llama2 模型', ARRAY['ollama', 'llama']),
('运行 Mistral', 'ollama', 'ollama run mistral', '运行 Mistral 模型', ARRAY['ollama', 'mistral']),
('运行 CodeLlama', 'ollama', 'ollama run codellama', '运行 CodeLlama 编程助手', ARRAY['ollama', 'code']),
('列出本地模型', 'ollama', 'ollama list', '查看已下载的模型', ARRAY['ollama']),
('删除模型', 'ollama', 'ollama rm llama2', '删除指定模型', ARRAY['ollama']),
('Docker 构建', 'docker', 'docker build -t myapp .', '构建 Docker 镜像', ARRAY['docker', 'build']),
('Docker 运行', 'docker', 'docker run -p 3000:3000 myapp', '运行 Docker 容器', ARRAY['docker', 'run']),
('Docker Compose 启动', 'docker', 'docker-compose up -d', '后台启动 Compose 服务', ARRAY['docker', 'compose']),
('查看容器日志', 'docker', 'docker logs -f container_id', '实时查看容器日志', ARRAY['docker', 'logs']),
('Git 初始化', 'git', 'git init', '初始化 Git 仓库', ARRAY['git', 'init']),
('Git 克隆', 'git', 'git clone https://github.com/user/repo.git', '克隆远程仓库', ARRAY['git', 'clone']),
('Git 提交', 'git', 'git add . && git commit -m "message"', '添加并提交更改', ARRAY['git', 'commit']),
('Git 推送', 'git', 'git push origin main', '推送到远程仓库', ARRAY['git', 'push']),
('NPM 安装依赖', 'npm', 'npm install', '安装项目依赖', ARRAY['npm', 'install']),
('NPM 运行开发', 'npm', 'npm run dev', '运行开发服务器', ARRAY['npm', 'dev']),
('PNPM 安装', 'npm', 'pnpm install', '使用 pnpm 安装依赖', ARRAY['pnpm', 'install']);
