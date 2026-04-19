import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <i className="fa-solid fa-layer-group text-white text-xl"></i>
            <span className="text-white font-medium text-lg">熙烨的AI集合站</span>
          </div>
          <div className="flex items-center gap-8">
            <a href="#/about" className="text-zinc-400 hover:text-white transition-colors text-sm">
              关于
            </a>
            <a href="#/feedback" className="text-zinc-400 hover:text-white transition-colors text-sm">
              反馈
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors text-sm">
              <i className="fa-brands fa-github text-lg"></i>
            </a>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-zinc-800 text-center">
          <p className="text-zinc-500 text-sm">
            © 2024 熙烨的AI集合站. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
