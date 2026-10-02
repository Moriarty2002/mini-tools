import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { FavoritesProvider, useFavorites } from './context/FavoritesContext';
import { useHashRouter } from './router/useHashRouter';
import { getToolBySlug } from './tools/registry';
import { Header } from './components/Header';
import { HubView } from './components/HubView';
import { CommandPalette } from './components/CommandPalette';
import { DeployModal } from './components/DeployModal';
import { ArrowLeft, Compass } from 'lucide-react';

const AppContent: React.FC = () => {
  const { toolSlug, navigate, navigateHome } = useHashRouter();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const { recordToolUsage } = useFavorites();

  // Record tool usage whenever active tool changes
  useEffect(() => {
    if (toolSlug) {
      recordToolUsage(toolSlug);
    }
  }, [toolSlug, recordToolUsage]);

  // Global keyboard shortcut for Command Palette (Ctrl+K / Win+K / /)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (e.key === '/' && !isInput) {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const activeTool = toolSlug ? getToolBySlug(toolSlug) : undefined;
  const ToolComponent = activeTool ? activeTool.component : null;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      {/* Top Bar Navigation */}
      <Header
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onNavigate={(route) => {
          if (route) {
            navigate(route);
          } else {
            navigateHome();
          }
        }}
        currentToolSlug={toolSlug}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 pt-4 pb-12">
        {activeTool && ToolComponent ? (
          <ToolComponent onNavigate={(slug) => (slug ? navigate(slug) : navigateHome())} />
        ) : toolSlug ? (
          /* 404 / Tool not found fallback */
          <div className="py-20 text-center space-y-4 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-neutral-200 dark:bg-neutral-800 text-neutral-500 mx-auto flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              Tool Not Found
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              The tool &ldquo;{toolSlug}&rdquo; hasn&apos;t been added yet or the route is incorrect.
            </p>
            <button
              type="button"
              onClick={navigateHome}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 text-xs font-semibold rounded-full hover:opacity-90 transition-opacity"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Mini Tools Hub
            </button>
          </div>
        ) : (
          <HubView
            onSelectTool={(slug) => navigate(slug)}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          />
        )}
      </main>

      {/* Clean Minimal Footer (Removed promotional/compat lines) */}
      <footer className="border-t border-neutral-200/80 dark:border-neutral-800/80 bg-white/40 dark:bg-neutral-950/40 py-5 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-2 font-medium">
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">
              MiniTools Hub
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsCommandPaletteOpen(true)}
              className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
            >
              <span>Search (Ctrl+K)</span>
            </button>
            <button
              type="button"
              onClick={navigateHome}
              className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer font-medium"
            >
              All Tools
            </button>
          </div>
        </div>
      </footer>

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTool={(slug) => navigate(slug)}
      />

      {/* GitHub Pages Deploy Guide Modal */}
      <DeployModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <AppContent />
      </FavoritesProvider>
    </ThemeProvider>
  );
}
