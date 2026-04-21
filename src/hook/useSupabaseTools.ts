import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../supabase/client';
import { AITool, FilterType, ToolType } from '../types';
import { toolsData as localToolsData } from '../data/tools';
import { extendedToolsData } from '../data/extendedTools';

const STANDARD_TAGS = [
  'AI助手',
  'AI编程',
  'AI绘画',
  'AI视频',
  '模型与推理',
  '提示词与文档',
  '前端开发',
  '后端与数据库',
  'UI与设计',
  '数据可视化',
  '自动化与工作流',
  '测试与调试',
  '部署与DevOps',
  '开发工具',
  '开源框架',
] as const;

const TAG_RULES: Array<{ tag: (typeof STANDARD_TAGS)[number]; keywords: string[] }> = [
  { tag: 'AI助手', keywords: ['ai对话', '聊天', 'chat', 'bot', 'assistant', 'copilot'] },
  { tag: 'AI编程', keywords: ['ai编程', '代码', 'code', 'copilot', 'cursor', 'continue'] },
  { tag: 'AI绘画', keywords: ['图像生成', '文生图', 'midjourney', 'stable diffusion', '设计图'] },
  { tag: 'AI视频', keywords: ['视频生成', '视频', 'sora'] },
  { tag: '模型与推理', keywords: ['llm', '大模型', '模型', '推理', '向量', 'rag', 'embedding'] },
  { tag: '提示词与文档', keywords: ['提示词', '提示工程', '文档', 'guide', 'prompt'] },
  { tag: '前端开发', keywords: ['react', 'vue', 'vite', 'frontend', '前端', 'typescript', 'javascript'] },
  { tag: '后端与数据库', keywords: ['后端', 'database', '数据库', 'orm', 'supabase', 'postgresql', 'mysql', 'api'] },
  { tag: 'UI与设计', keywords: ['ui', '设计', '组件', 'tailwind', 'figma', '动画', '3d', 'webgl'] },
  { tag: '数据可视化', keywords: ['图表', '可视化', 'dashboard', 'd3', 'charts'] },
  { tag: '自动化与工作流', keywords: ['自动化', '工作流', 'workflow', 'n8n', '集成'] },
  { tag: '测试与调试', keywords: ['测试', 'test', 'e2e', 'debug', 'devtools', '调试'] },
  { tag: '部署与DevOps', keywords: ['部署', 'ci/cd', 'devops', 'vercel', 'netlify', 'serverless'] },
  { tag: '开发工具', keywords: ['编辑器', 'ide', '终端', 'shell', '工具', '开发工具'] },
  { tag: '开源框架', keywords: ['框架', 'sdk', 'library', '开源', 'langchain', 'next.js'] },
];

const TAG_ORDER = new Map(STANDARD_TAGS.map((tag, index) => [tag, index]));

function normalizeTags(tags: string[] = []): string[] {
  const normalized = new Set<string>();
  const lowerTags = tags.map(tag => tag.toLowerCase());

  TAG_RULES.forEach(rule => {
    const matched = lowerTags.some(tag =>
      rule.keywords.some(keyword => tag.includes(keyword.toLowerCase()))
    );
    if (matched) normalized.add(rule.tag);
  });

  if (normalized.size === 0) normalized.add('开发工具');

  return Array.from(normalized)
    .sort((a, b) => (TAG_ORDER.get(a) ?? 999) - (TAG_ORDER.get(b) ?? 999))
    .slice(0, 3);
}

function isRlsDeniedError(error: unknown): boolean {
  const message = String((error as { message?: string })?.message || '').toLowerCase();
  const code = String((error as { code?: string })?.code || '');
  return code === '42501' || message.includes('row-level security') || message.includes('rls');
}

export function useSupabaseTools() {
  const [tools, setTools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const fetchTools = useCallback(async () => {
    const baseTools = [...localToolsData, ...extendedToolsData].map(tool => ({
      ...tool,
      tags: normalizeTags(tool.tags),
    }));
    try {
      const { data, error } = await supabase
        .from('ai_tools')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tools:', error);
        setTools(baseTools);
        return;
      }

      const dbTools: AITool[] = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        type: item.type as ToolType,
        url: item.url,
        description: item.description,
        tags: normalizeTags(item.tags || []),
        icon: item.icon || 'fa-cube',
        featured: item.featured || false,
      }));

      const allTools = [...baseTools, ...dbTools];
      setTools(allTools);
    } catch (err) {
      console.error('Failed to fetch tools:', err);
      setTools(baseTools);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTools();
  }, [fetchTools]);

  const addTool = useCallback(async (tool: Omit<AITool, 'id'>) => {
    try {
      const normalizedTags = normalizeTags(tool.tags);
      const { data, error } = await supabase
        .from('ai_tools')
        .insert({
          name: tool.name,
          type: tool.type,
          url: tool.url,
          description: tool.description,
          tags: normalizedTags,
          icon: tool.icon,
          featured: tool.featured || false,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding tool:', error);
        if (!isRlsDeniedError(error)) {
          return { success: false, error: error.message };
        }

        // RLS 拒绝时回退到本地状态，保证页面可继续使用
        const localTool: AITool = {
          id: crypto.randomUUID(),
          name: tool.name,
          type: tool.type,
          url: tool.url,
          description: tool.description,
          tags: normalizedTags,
          icon: tool.icon || 'fa-cube',
          featured: tool.featured || false,
        };
        setTools(prev => [localTool, ...prev]);
        return { success: true, error: '已本地添加（Supabase RLS 拒绝写入，未同步到云端）' };
      }

      const newTool: AITool = {
        id: data.id,
        name: data.name,
        type: data.type as ToolType,
        url: data.url,
        description: data.description,
        tags: normalizeTags(data.tags || []),
        icon: data.icon || 'fa-cube',
        featured: data.featured || false,
      };

      setTools(prev => [newTool, ...prev]);
      return { success: true, data: newTool };
    } catch (err) {
      console.error('Failed to add tool:', err);
      return { success: false, error: '添加失败' };
    }
  }, []);

  const updateTool = useCallback(async (id: string, tool: Partial<AITool>) => {
    try {
      const normalizedTags = normalizeTags(tool.tags || []);
      const { data, error } = await supabase
        .from('ai_tools')
        .update({
          name: tool.name,
          type: tool.type,
          url: tool.url,
          description: tool.description,
          tags: normalizedTags,
          icon: tool.icon,
          featured: tool.featured,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating tool:', error);
        if (!isRlsDeniedError(error)) {
          return { success: false, error: error.message };
        }

        setTools(prev =>
          prev.map(t =>
            t.id === id
              ? {
                  ...t,
                  ...tool,
                  tags: normalizedTags.length > 0 ? normalizedTags : t.tags,
                }
              : t
          )
        );
        return { success: true, error: '已本地更新（Supabase RLS 拒绝写入，未同步到云端）' };
      }

      const updatedTool: AITool = {
        id: data.id,
        name: data.name,
        type: data.type as ToolType,
        url: data.url,
        description: data.description,
        tags: normalizeTags(data.tags || []),
        icon: data.icon || 'fa-cube',
        featured: data.featured || false,
      };

      setTools(prev => prev.map(t => t.id === id ? updatedTool : t));
      return { success: true, data: updatedTool };
    } catch (err) {
      console.error('Failed to update tool:', err);
      return { success: false, error: '更新失败' };
    }
  }, []);

  const deleteTool = useCallback(async (id: string) => {
    try {
      const { error } = await supabase.from('ai_tools').delete().eq('id', id);

      if (error) {
        console.error('Error deleting tool:', error);
        if (!isRlsDeniedError(error)) {
          return { success: false, error: error.message };
        }

        setTools(prev => prev.filter(t => t.id !== id));
        return { success: true, error: '已本地删除（Supabase RLS 拒绝写入，未同步到云端）' };
      }

      setTools(prev => prev.filter(t => t.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Failed to delete tool:', err);
      return { success: false, error: '删除失败' };
    }
  }, []);

  const filteredTools = tools.filter((tool: AITool) => {
    const matchesFilter = activeFilter === 'all' || tool.type === activeFilter;
    const matchesSearch = searchQuery === '' ||
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTag = activeTag === null || tool.tags.includes(activeTag);
    return matchesFilter && matchesSearch && matchesTag;
  });

  const featuredTools = tools.filter((tool: AITool) => tool.featured);

  // 计算所有可用标签
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    tools.forEach(tool => {
      tool.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort((a, b) => (TAG_ORDER.get(a) ?? 999) - (TAG_ORDER.get(b) ?? 999));
  }, [tools]);

  // 根据当前筛选条件计算可用的标签
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    filteredTools.forEach(tool => {
      tool.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort((a, b) => (TAG_ORDER.get(a) ?? 999) - (TAG_ORDER.get(b) ?? 999));
  }, [filteredTools]);

  return {
    tools: filteredTools,
    allTools: tools,
    featuredTools,
    allTags,
    availableTags,
    loading,
    searchQuery,
    activeFilter,
    activeTag,
    setSearchQuery,
    setActiveFilter,
    setActiveTag,
    addTool,
    updateTool,
    deleteTool,
    refreshTools: fetchTools,
  };
}
