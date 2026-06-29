import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../supabase/client';
import { Command, CommandCategory } from '../types/commands';
import { localCommandsData } from '../data/commands';

export interface WorkflowGroup {
  name: string;
  commands: Command[];
}

export function useCommands() {
  const [commands, setCommands] = useState<Command[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<CommandCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCommands = useCallback(async () => {
    const baseCommands = [...localCommandsData];
    try {
      const { data, error } = await supabase
        .from('commands')
        .select('*')
        .order('workflow_group', { ascending: true })
        .order('step_order', { ascending: true });

      if (error) {
        console.error('Error fetching commands:', error);
        setCommands(baseCommands);
        return;
      }

      const formattedCommands: Command[] = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        category: item.category as CommandCategory,
        command: item.command,
        description: item.description,
        tags: item.tags || [],
        workflow_group: item.workflow_group || null,
        step_order: item.step_order || 0,
        is_favorite: item.is_favorite || false,
      }));

      setCommands(formattedCommands.length > 0 ? formattedCommands : baseCommands);
    } catch (err) {
      console.error('Failed to fetch commands:', err);
      setCommands(baseCommands);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCommands();
  }, [fetchCommands]);

  const filteredCommands = useMemo(() => {
    return commands.filter(cmd => {
      const matchesCategory = activeCategory === 'all' || cmd.category === activeCategory;
      const matchesSearch = searchQuery === '' ||
        cmd.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cmd.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cmd.command.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cmd.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [commands, activeCategory, searchQuery]);

  // Group commands by workflow_group
  const groupedCommands = useMemo(() => {
    const groups: WorkflowGroup[] = [];
    const groupMap = new Map<string, Command[]>();
    
    filteredCommands.forEach(cmd => {
      const groupName = cmd.workflow_group || '其他';
      if (!groupMap.has(groupName)) {
        groupMap.set(groupName, []);
      }
      groupMap.get(groupName)!.push(cmd);
    });

    // Define the order of workflow groups
    const workflowOrder = [
      // Git workflow
      'git-setup', 'git-workflow', 'git-advanced',
      // Docker workflow
      'docker-setup', 'docker-basic', 'docker-workflow', 'docker-compose', 'docker-advanced',
      // NPM workflow
      'npm-setup', 'npm-workflow', 'yarn-workflow', 'pnpm-workflow', 'npm-advanced',
      // Frontend workflow
      'frontend-setup', 'frontend-tooling', 'frontend-deploy',
      // Backend workflow
      'backend-deploy', 'backend-database', 'backend-test',
      // Mac workflow
      'mac-setup', 'mac-workflow', 'mac-basic', 'mac-advanced',
      // Ollama workflow
      'ollama-setup', 'ollama-workflow', 'ollama-advanced',
      // Tools workflow
      'tools-file', 'tools-search', 'tools-api', 'tools-data', 'tools-system', 'tools-network', 'tools-help'
    ];

    // Convert to array in defined order
    workflowOrder.forEach(name => {
      if (groupMap.has(name)) {
        groups.push({ name, commands: groupMap.get(name)! });
        groupMap.delete(name);
      }
    });

    // Add any remaining groups (custom workflows)
    groupMap.forEach((cmds, name) => {
      if (name !== '其他' || cmds.length > 0) {
        groups.push({ name, commands: cmds });
      }
    });

    // Add '其他' at the end if there are commands without workflow_group
    if (groupMap.has('其他')) {
      const otherCmds = groupMap.get('其他')!;
      if (otherCmds.length > 0) {
        groups.push({ name: '其他', commands: otherCmds });
      }
    }

    return groups;
  }, [filteredCommands]);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return { success: true };
    } catch (err) {
      console.error('Failed to copy:', err);
      return { success: false, error: '复制失败' };
    }
  }, []);

  const addCommand = useCallback(async (command: Omit<Command, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('commands')
        .insert({
          name: command.name,
          category: command.category,
          command: command.command,
          description: command.description,
          tags: command.tags,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding command:', error);
        return { success: false, error: error.message };
      }

      const newCommand: Command = {
        id: data.id,
        name: data.name,
        category: data.category as CommandCategory,
        command: data.command,
        description: data.description,
        tags: data.tags || [],
      };

      setCommands(prev => [newCommand, ...prev]);
      return { success: true, data: newCommand };
    } catch (err) {
      console.error('Failed to add command:', err);
      return { success: false, error: '添加失败' };
    }
  }, []);

  const updateCommand = useCallback(async (id: string, command: Partial<Command>) => {
    try {
      const { data, error } = await supabase
        .from('commands')
        .update({
          name: command.name,
          category: command.category,
          command: command.command,
          description: command.description,
          tags: command.tags,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating command:', error);
        return { success: false, error: error.message };
      }

      const updatedCommand: Command = {
        id: data.id,
        name: data.name,
        category: data.category as CommandCategory,
        command: data.command,
        description: data.description,
        tags: data.tags || [],
      };

      setCommands(prev => prev.map(cmd => cmd.id === id ? updatedCommand : cmd));
      return { success: true, data: updatedCommand };
    } catch (err) {
      console.error('Failed to update command:', err);
      return { success: false, error: '更新失败' };
    }
  }, []);

  const deleteCommand = useCallback(async (id: string) => {
    try {
      const { error } = await supabase.from('commands').delete().eq('id', id);

      if (error) {
        console.error('Error deleting command:', error);
        return { success: false, error: error.message };
      }

      setCommands(prev => prev.filter(cmd => cmd.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Failed to delete command:', err);
      return { success: false, error: '删除失败' };
    }
  }, []);

  return {
    groupedCommands,
    commands: filteredCommands,
    allCommands: commands,
    loading,
    activeCategory,
    searchQuery,
    setActiveCategory,
    setSearchQuery,
    copyToClipboard,
    addCommand,
    updateCommand,
    deleteCommand,
    refreshCommands: fetchCommands,
  };
}
