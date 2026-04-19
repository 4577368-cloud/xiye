export type ToolType = 'ai-product' | 'website' | 'app' | 'github' | 'skill';

export interface AITool {
  id: string;
  name: string;
  type: ToolType;
  url: string;
  description: string;
  tags: string[];
  icon: string;
  featured?: boolean;
}

export type FilterType = 'all' | ToolType;

export interface FilterOption {
  value: FilterType;
  label: string;
  icon: string;
}

export type PromptCategory = 'writing' | 'coding' | 'design' | 'analysis' | 'other';

export interface Prompt {
  id: string;
  title: string;
  category: PromptCategory;
  content: string;
  description: string;
  tags: string[];
}
