export interface RankingItem {
  id: string;
  name: string;
  url: string;
  description: string;
  rank: number;
  score?: number;
  calls?: number;
  trend: 'up' | 'down' | 'stable';
  trendValue?: string;
  icon?: string;
}

export interface Ranking {
  id: string;
  title: string;
  description: string;
  items: RankingItem[];
}

export const rankingsData: Ranking[] = [
  {
    id: 'usage',
    title: 'AI调用榜',
    description: '基于实际调用量排序，最受欢迎的AI工具',
    items: [
      { id: 'r1', name: 'ChatGPT', url: 'https://chat.openai.com', description: 'OpenAI推出的顶级对话式AI', rank: 1, calls: 8542000, trend: 'up', trendValue: '+12%', icon: 'fa-brain' },
      { id: 'r2', name: 'Gemini', url: 'https://gemini.google.com', description: 'Google多模态AI模型', rank: 2, calls: 6235000, trend: 'up', trendValue: '+8%', icon: 'fa-brain' },
      { id: 'r3', name: 'Claude', url: 'https://claude.ai', description: 'Anthropic安全性AI助手', rank: 3, calls: 4128000, trend: 'stable', icon: 'fa-brain' },
      { id: 'r4', name: 'Perplexity', url: 'https://perplexity.ai', description: 'AI搜索引擎', rank: 4, calls: 2956000, trend: 'up', trendValue: '+25%', icon: 'fa-searchengin' },
      { id: 'r5', name: 'Midjourney', url: 'https://midjourney.com', description: 'AI绘画工具', rank: 5, calls: 2341000, trend: 'down', trendValue: '-5%', icon: 'fa-palette' },
      { id: 'r6', name: 'Kimi', url: 'https://kimi.moonshot.cn', description: '月之暗面长文本AI', rank: 6, calls: 1876000, trend: 'up', trendValue: '+32%', icon: 'fa-moon' },
      { id: 'r7', name: '通义千问', url: 'https://tongyi.aliyun.com', description: '阿里大模型', rank: 7, calls: 1542000, trend: 'up', trendValue: '+18%', icon: 'fa-globe' },
      { id: 'r8', name: 'Copilot', url: 'https://copilot.microsoft.com', description: '微软AI助手', rank: 8, calls: 1235000, trend: 'stable', icon: 'fa-microsoft' },
      { id: 'r9', name: 'DeepSeek', url: 'https://deepseek.com', description: '深度求索大模型', rank: 9, calls: 987000, trend: 'up', trendValue: '+45%', icon: 'fa-water' },
      { id: 'r10', name: 'Cursor', url: 'https://cursor.com', description: 'AI代码编辑器', rank: 10, calls: 765000, trend: 'up', trendValue: '+52%', icon: 'fa-code' },
    ],
  },
  {
    id: 'new',
    title: '上新榜',
    description: '近期上线的热门AI工具',
    items: [
      { id: 'n1', name: 'Grok', url: 'https://x.ai', description: '马斯克xAI推出的AI助手', rank: 1, score: 9.2, trend: 'up', trendValue: 'New', icon: 'fa-bolt' },
      { id: 'n2', name: 'Flux', url: 'https://flux.ai', description: '新一代图像生成模型', rank: 2, score: 9.0, trend: 'up', trendValue: 'New', icon: 'fa-bolt' },
      { id: 'n3', name: '可灵AI', url: 'https://klingai.kuaishou.com', description: '快手AI视频生成', rank: 3, score: 8.8, trend: 'up', trendValue: 'New', icon: 'fa-video' },
      { id: 'n4', name: 'Trae', url: 'https://trae.ai', description: '字节AI编程工具', rank: 4, score: 8.7, trend: 'up', trendValue: 'New', icon: 'fa-code' },
      { id: 'n5', name: 'Devin', url: 'https://cognition.ai', description: 'AI软件工程师', rank: 5, score: 8.6, trend: 'up', trendValue: 'New', icon: 'fa-code' },
      { id: 'n6', name: 'Udio', url: 'https://udio.com', description: 'AI音乐生成平台', rank: 6, score: 8.5, trend: 'up', trendValue: 'New', icon: 'fa-headphones' },
      { id: 'n7', name: 'Ideogram', url: 'https://ideogram.ai', description: '文字渲染AI绘画', rank: 7, score: 8.4, trend: 'up', trendValue: '+1', icon: 'fa-image' },
      { id: 'n8', name: '海螺AI', url: 'https://hailuoai.video', description: '字节AI视频生成', rank: 8, score: 8.3, trend: 'up', trendValue: '+2', icon: 'fa-video' },
      { id: 'n9', name: 'Consensus', url: 'https://consensus.app', description: '科研文献AI搜索', rank: 9, score: 8.2, trend: 'stable', icon: 'fa-graduation-cap' },
      { id: 'n10', name: 'Pika', url: 'https://pika.art', description: 'AI视频生成工具', rank: 10, score: 8.1, trend: 'down', trendValue: '-1', icon: 'fa-clapperboard' },
    ],
  },
  {
    id: 'rating',
    title: '评分榜',
    description: '用户评分最高的AI工具',
    items: [
      { id: 's1', name: 'ChatGPT', url: 'https://chat.openai.com', description: 'OpenAI对话AI', rank: 1, score: 9.6, trend: 'stable', icon: 'fa-brain' },
      { id: 's2', name: 'Claude', url: 'https://claude.ai', description: 'Anthropic安全AI', rank: 2, score: 9.5, trend: 'up', trendValue: '+1', icon: 'fa-brain' },
      { id: 's3', name: 'Midjourney', url: 'https://midjourney.com', description: 'AI绘画工具', rank: 3, score: 9.4, trend: 'down', trendValue: '-1', icon: 'fa-palette' },
      { id: 's4', name: 'Gemini', url: 'https://gemini.google.com', description: 'Google多模态', rank: 4, score: 9.3, trend: 'up', trendValue: '+2', icon: 'fa-brain' },
      { id: 's5', name: 'Suno', url: 'https://suno.ai', description: 'AI音乐生成', rank: 5, score: 9.2, trend: 'stable', icon: 'fa-music' },
      { id: 's6', name: 'Perplexity', url: 'https://perplexity.ai', description: 'AI搜索引擎', rank: 6, score: 9.1, trend: 'up', trendValue: '+3', icon: 'fa-searchengin' },
      { id: 's7', name: 'Cursor', url: 'https://cursor.com', description: 'AI代码编辑器', rank: 7, score: 9.0, trend: 'up', trendValue: '+1', icon: 'fa-code' },
      { id: 's8', name: 'Kimi', url: 'https://kimi.moonshot.cn', description: '长文本AI', rank: 8, score: 8.9, trend: 'stable', icon: 'fa-moon' },
      { id: 's9', name: 'Canva', url: 'https://canva.com', description: 'AI设计平台', rank: 9, score: 8.8, trend: 'down', trendValue: '-1', icon: 'fa-paint-brush' },
      { id: 's10', name: 'Gamma', url: 'https://gamma.app', description: 'AI PPT生成', rank: 10, score: 8.7, trend: 'up', trendValue: '+2', icon: 'fa-presentation' },
    ],
  },
];
