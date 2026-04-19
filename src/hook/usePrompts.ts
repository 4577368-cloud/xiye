import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../supabase/client';
import { Prompt, PromptCategory } from '../types';

export function usePrompts() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<PromptCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPrompts = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching prompts:', error);
        setPrompts([]);
        return;
      }

      const formattedPrompts: Prompt[] = (data || []).map(item => ({
        id: item.id,
        title: item.title,
        category: item.category as PromptCategory,
        content: item.content,
        description: item.description,
        tags: item.tags || [],
      }));

      setPrompts(formattedPrompts);
    } catch (err) {
      console.error('Failed to fetch prompts:', err);
      setPrompts([]);
    } finally {
      setLoading(false);
    }
  }, []);

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
        return { success: false, error: error.message };
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
        return { success: false, error: error.message };
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
        return { success: false, error: error.message };
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
