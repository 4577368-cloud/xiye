import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../supabase/client';
import { Prompt, PromptCategory } from '../types';
import { presetPromptsData } from '../data/presetPrompts';

function isRlsDeniedError(error: unknown): boolean {
  const message = String((error as { message?: string })?.message || '').toLowerCase();
  const code = String((error as { code?: string })?.code || '');
  return code === '42501' || message.includes('row-level security') || message.includes('rls');
}

export function usePrompts() {
  const basePrompts = useMemo(() => 
    presetPromptsData.map((prompt, index) => ({
      ...prompt,
      id: `preset-${index}`,
      category: prompt.category as PromptCategory,
    })),
    []
  );
  
  const [prompts, setPrompts] = useState<Prompt[]>(basePrompts);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<PromptCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPrompts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching prompts:', error);
        return;
      }

      const dbPrompts: Prompt[] = (data || []).map(item => ({
        id: item.id,
        title: item.title,
        category: item.category as PromptCategory,
        content: item.content,
        description: item.description,
        tags: item.tags || [],
      }));

      const allPrompts = [...basePrompts, ...dbPrompts];
      setPrompts(allPrompts);
    } catch (err) {
      console.error('Failed to fetch prompts:', err);
    }
  }, [basePrompts]);

  useEffect(() => {
    fetchPrompts();
  }, [fetchPrompts]);

  const filteredPrompts = useMemo(() => {
    return prompts.filter(prompt => {
      const matchesCategory = activeCategory === 'all' || prompt.category === activeCategory;
      const matchesSearch = searchQuery === '' ||
        prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [prompts, activeCategory, searchQuery]);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return { success: true };
    } catch (err) {
      console.error('Failed to copy:', err);
      return { success: false, error: '复制失败' };
    }
  }, []);

  const addPrompt = useCallback(async (prompt: Omit<Prompt, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('prompts')
        .insert({
          title: prompt.title,
          category: prompt.category,
          content: prompt.content,
          description: prompt.description,
          tags: prompt.tags,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding prompt:', error);
        if (!isRlsDeniedError(error)) {
          return { success: false, error: error.message };
        }

        const localPrompt: Prompt = {
          id: crypto.randomUUID(),
          title: prompt.title,
          category: prompt.category,
          content: prompt.content,
          description: prompt.description,
          tags: prompt.tags,
        };
        setPrompts(prev => [localPrompt, ...prev]);
        return { success: true, error: '已本地添加（Supabase RLS 拒绝写入，未同步到云端）' };
      }

      const newPrompt: Prompt = {
        id: data.id,
        title: data.title,
        category: data.category as PromptCategory,
        content: data.content,
        description: data.description,
        tags: data.tags || [],
      };

      setPrompts(prev => [newPrompt, ...prev]);
      return { success: true, data: newPrompt };
    } catch (err) {
      console.error('Failed to add prompt:', err);
      return { success: false, error: '添加失败' };
    }
  }, []);

  const updatePrompt = useCallback(async (id: string, prompt: Partial<Prompt>) => {
    try {
      const { data, error } = await supabase
        .from('prompts')
        .update({
          title: prompt.title,
          category: prompt.category,
          content: prompt.content,
          description: prompt.description,
          tags: prompt.tags,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating prompt:', error);
        if (!isRlsDeniedError(error)) {
          return { success: false, error: error.message };
        }

        setPrompts(prev => prev.map(p => p.id === id ? { ...p, ...prompt } : p));
        return { success: true, error: '已本地更新（Supabase RLS 拒绝写入，未同步到云端）' };
      }

      const updatedPrompt: Prompt = {
        id: data.id,
        title: data.title,
        category: data.category as PromptCategory,
        content: data.content,
        description: data.description,
        tags: data.tags || [],
      };

      setPrompts(prev => prev.map(p => p.id === id ? updatedPrompt : p));
      return { success: true, data: updatedPrompt };
    } catch (err) {
      console.error('Failed to update prompt:', err);
      return { success: false, error: '更新失败' };
    }
  }, []);

  const deletePrompt = useCallback(async (id: string) => {
    try {
      const { error } = await supabase.from('prompts').delete().eq('id', id);

      if (error) {
        console.error('Error deleting prompt:', error);
        if (!isRlsDeniedError(error)) {
          return { success: false, error: error.message };
        }

        setPrompts(prev => prev.filter(p => p.id !== id));
        return { success: true, error: '已本地删除（Supabase RLS 拒绝写入，未同步到云端）' };
      }

      setPrompts(prev => prev.filter(p => p.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Failed to delete prompt:', err);
      return { success: false, error: '删除失败' };
    }
  }, []);

  return {
    prompts: filteredPrompts,
    allPrompts: prompts,
    loading,
    activeCategory,
    searchQuery,
    setActiveCategory,
    setSearchQuery,
    copyToClipboard,
    addPrompt,
    updatePrompt,
    deletePrompt,
    refreshPrompts: fetchPrompts,
  };
}
