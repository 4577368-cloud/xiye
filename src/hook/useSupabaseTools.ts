import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../supabase/client';
import { AITool, FilterType, ToolType } from '../types';
import { toolsData as localToolsData } from '../data/tools';
import { extendedToolsData } from '../data/extendedTools';

export function useSupabaseTools() {
  const [tools, setTools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const fetchTools = useCallback(async () => {
    const baseTools = [...localToolsData, ...extendedToolsData];
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
        tags: item.tags || [],
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
      const { data, error } = await supabase
        .from('ai_tools')
        .insert({
          name: tool.name,
          type: tool.type,
          url: tool.url,
          description: tool.description,
          tags: tool.tags,
          icon: tool.icon,
          featured: tool.featured || false,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding tool:', error);
        return { success: false, error: error.message };
      }

      const newTool: AITool = {
        id: data.id,
        name: data.name,
        type: data.type as ToolType,
        url: data.url,
        description: data.description,
        tags: data.tags || [],
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
      const { data, error } = await supabase
        .from('ai_tools')
        .update({
          name: tool.name,
          type: tool.type,
          url: tool.url,
          description: tool.description,
          tags: tool.tags,
          icon: tool.icon,
          featured: tool.featured,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating tool:', error);
        return { success: false, error: error.message };
      }

      const updatedTool: AITool = {
        id: data.id,
        name: data.name,
        type: data.type as ToolType,
        url: data.url,
        description: data.description,
        tags: data.tags || [],
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
        return { success: false, error: error.message };
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
    return Array.from(tagSet).sort();
  }, [tools]);

  // 根据当前筛选条件计算可用的标签
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    filteredTools.forEach(tool => {
      tool.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
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
