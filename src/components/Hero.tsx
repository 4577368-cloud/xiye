import React from 'react';
import { AITool } from '../types';

interface HeroProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  featuredTools?: AITool[];
}

export const Hero: React.FC<HeroProps> = ({ searchQuery, onSearch }) => {
  return (
    <section className="relative min-h-[50vh] flex flex-col items-center justify-center px-6 py-20 overflow-hidden">
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px]" />
      </div>
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
          熙烨的
          <span className="text-cyan-400">AI</span>
          集合站
        </h1>
        <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          发现优质AI工具、网站、GitHub仓库与技能，一站式探索人工智能世界
        </p>
        <div className="relative max-w-xl mx-auto">
          <div className="absolute inset-0 bg-cyan-500/20 rounded-lg blur-xl" />
          <div className="relative flex items-center bg-gray-900/80 border border-gray-700 rounded-lg overflow-hidden backdrop-blur-sm">
            <i className="fa-solid fa-search text-gray-500 ml-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="搜索AI工具、标签..."
              className="w-full px-4 py-4 bg-transparent text-white placeholder-gray-500 outline-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
