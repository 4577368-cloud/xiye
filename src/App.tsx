import { useState, useMemo } from 'react';
import { useSupabaseTools } from './hook/useSupabaseTools';
import { useFavorites } from './hook/useFavorites';
import { useCommands } from './hook/useCommands';
import { usePrompts } from './hook/usePrompts';
import { useAuth } from './hook/useAuth';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FilterBar } from './components/FilterBar';
import { ToolGrid } from './components/ToolGrid';
import { Footer } from './components/Footer';
import { AddToolModal } from './components/AddToolModal';
import { AddCommandModal } from './components/AddCommandModal';
import { AddPromptModal } from './components/AddPromptModal';
import { LoginModal } from './components/LoginModal';
import { ToolDetailModal } from './components/ToolDetailModal';
import { CommandsSection } from './components/CommandsSection';
import { PromptsSection } from './components/PromptsSection';
import { AITool } from './types';
import { Command } from './types/commands';
import { Prompt } from './types';

export default function App() {
  const {
    tools,
    allTools,
    loading,
    searchQuery,
    activeFilter,
    availableTags,
    activeTag,
    setSearchQuery,
    setActiveFilter,
    setActiveTag,
    addTool,
    updateTool,
    deleteTool,
  } = useSupabaseTools();

  const { isLoggedIn, username, login, logout } = useAuth();
  const { isFavorite, toggleFavorite, favorites } = useFavorites(isLoggedIn);

  const {
    commands,
    loading: commandsLoading,
    addCommand,
    updateCommand,
    deleteCommand,
  } = useCommands();

  const {
    prompts,
    loading: promptsLoading,
    addPrompt,
    updatePrompt,
    deletePrompt,
  } = usePrompts();

  const [isAddToolModalOpen, setIsAddToolModalOpen] = useState(false);
  const [isAddCommandModalOpen, setIsAddCommandModalOpen] = useState(false);
  const [isAddPromptModalOpen, setIsAddPromptModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null);
  const [editingTool, setEditingTool] = useState<AITool | null>(null);
  const [editingCommand, setEditingCommand] = useState<Command | null>(null);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [activeTab, setActiveTab] = useState<'tools' | 'commands' | 'favorites' | 'prompts'>('tools');

  const handleToolClick = (tool: AITool) => {
    setSelectedTool(tool);
  };

  const handleAddClick = () => {
    switch (activeTab) {
      case 'commands':
        setIsAddCommandModalOpen(true);
        break;
      case 'prompts':
        setIsAddPromptModalOpen(true);
        break;
      default:
        setIsAddToolModalOpen(true);
    }
  };

  const handleEditTool = (tool: AITool) => {
    setEditingTool(tool);
    setIsAddToolModalOpen(true);
  };

  const handleEditCommand = (command: Command) => {
    setEditingCommand(command);
    setIsAddCommandModalOpen(true);
  };

  const handleEditPrompt = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setIsAddPromptModalOpen(true);
  };

  const handleToggleFavorite = async (tool: AITool) => {
    await toggleFavorite(tool.id);
  };

  const favoriteTools = useMemo(() => {
    return allTools.filter(tool => favorites.has(tool.id));
  }, [allTools, favorites]);

  const displayTools = activeTab === 'favorites' ? favoriteTools : tools;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Header
        onAddClick={handleAddClick}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setEditingTool(null);
          setEditingCommand(null);
          setEditingPrompt(null);
        }}
        isLoggedIn={isLoggedIn}
        username={username}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLogout={logout}
      />
      <main>
        {activeTab !== 'commands' && (
          <Hero
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
          />
        )}

        {activeTab === 'tools' && (
          <section className="max-w-7xl mx-auto px-6 py-12">
            <FilterBar
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              availableTags={availableTags}
              activeTag={activeTag}
              onTagChange={setActiveTag}
            />
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <ToolGrid
                tools={displayTools}
                isFavorite={isFavorite}
                onToggleFavorite={handleToggleFavorite}
                onToolClick={handleToolClick}
              />
            )}
          </section>
        )}

        {activeTab === 'favorites' && (
          <section className="max-w-7xl mx-auto px-6 py-12">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-2">我的收藏</h2>
              <p className="text-zinc-400">共收藏 {favoriteTools.length} 个工具</p>
            </div>
            {favoriteTools.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 mb-6 bg-zinc-800 flex items-center justify-center">
                  <i className="fa-regular fa-star text-zinc-500 text-2xl" />
                </div>
                <h3 className="text-lg font-medium text-zinc-300 mb-2">暂无收藏</h3>
                <p className="text-sm text-zinc-500">点击工具卡片上的星标按钮添加收藏</p>
              </div>
            ) : (
              <ToolGrid
                tools={displayTools}
                isFavorite={isFavorite}
                onToggleFavorite={handleToggleFavorite}
                onToolClick={handleToolClick}
              />
            )}
          </section>
        )}

        {activeTab === 'commands' && (
          <div className="pt-20">
            <CommandsSection
              onEdit={handleEditCommand}
            />
          </div>
        )}

        {activeTab === 'prompts' && (
          <div className="pt-20">
            <PromptsSection
              onEdit={handleEditPrompt}
            />
          </div>
        )}
      </main>
      <Footer />
      <AddToolModal
        isOpen={isAddToolModalOpen}
        onClose={() => {
          setIsAddToolModalOpen(false);
          setEditingTool(null);
        }}
        onSubmit={addTool}
        editingTool={editingTool}
        onUpdate={updateTool}
      />
      <AddCommandModal
        isOpen={isAddCommandModalOpen}
        onClose={() => {
          setIsAddCommandModalOpen(false);
          setEditingCommand(null);
        }}
        onSubmit={addCommand}
        editingCommand={editingCommand}
        onUpdate={updateCommand}
      />
      <AddPromptModal
        isOpen={isAddPromptModalOpen}
        onClose={() => {
          setIsAddPromptModalOpen(false);
          setEditingPrompt(null);
        }}
        onSubmit={addPrompt}
        editingPrompt={editingPrompt}
        onUpdate={updatePrompt}
      />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={login}
      />
      <ToolDetailModal
        tool={selectedTool}
        isOpen={!!selectedTool}
        onClose={() => setSelectedTool(null)}
        isFavorite={selectedTool ? isFavorite(selectedTool.id) : false}
        onToggleFavorite={() => selectedTool && handleToggleFavorite(selectedTool)}
      />
    </div>
  );
}
