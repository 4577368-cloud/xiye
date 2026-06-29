import { useState, useMemo, useCallback } from 'react';
import { AITool, FilterType } from '../types';
import { toolsData } from '../data/tools';

export function useTools() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filteredTools = useMemo(() => {
    return toolsData.filter((tool: AITool) => {
      const matchesFilter = activeFilter === 'all' || tool.type === activeFilter;
      const matchesSearch = searchQuery === '' ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesFilter && matchesSearch;
    });
  }, [searchQuery, activeFilter]);

  const featuredTools = useMemo(() => {
    return toolsData.filter((tool: AITool) => tool.featured);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleFilterChange = useCallback((filter: FilterType) => {
    setActiveFilter(filter);
  }, []);

  return {
    tools: filteredTools,
    featuredTools,
    searchQuery,
    activeFilter,
    handleSearch,
    handleFilterChange,
  };
}
