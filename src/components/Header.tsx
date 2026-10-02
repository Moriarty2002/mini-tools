import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Github, Search } from 'lucide-react';
import { DeployModal } from './DeployModal';

interface HeaderProps {
  onOpenCommandPalette: () => void;
  onNavigate: (route: string) => void;
  currentToolSlug: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCommandPalette,
  onNavigate,
  currentToolSlug,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [showDeployGuide, setShowDeployGuide] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Brand Wordmark (Material Headline with Purple Accent) */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('')}
              className="text-base font-bold tracking-tight text-neutral-900 dark:text-neutral-100 hover:opacity-85 transition-opacity cursor-pointer flex items-center gap-2.5"
            >
              <span>MiniTools</span>
            </button>
          </div>

          {/* Navigation & Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('')}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors cursor-pointer ${
                !currentToolSlug
                  ? 'bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-200'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              Hub
            </button>

            <button
              type="button"
              onClick={() => onNavigate('price-per-kg')}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors cursor-pointer ${
                currentToolSlug === 'price-per-kg'
                  ? 'bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-200'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              Price/kg
            </button>

            {/* Quick Find Button with Windows icon & Ctrl+K */}
            <button
              type="button"
              onClick={onOpenCommandPalette}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-neutral-600 dark:text-neutral-300 text-xs transition-colors cursor-pointer border border-neutral-200/60 dark:border-neutral-700/60"
              title="Search tools (Ctrl+K)"
            >
              <Search className="w-3 h-3 text-neutral-400" />
              <kbd className="px-1.5 py-0.2 text-[10px] font-mono bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-500 dark:text-neutral-400">
                Ctrl+K
              </kbd>
            </button>

            <button
              type="button"
              onClick={() => setShowDeployGuide(true)}
              className="p-2 rounded-full text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              title="GitHub Pages Guide"
            >
              <Github className="w-4 h-4" />
            </button>

            {/* Material Icon Button for Dark/Light Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-neutral-700" />
              )}
            </button>
          </div>
        </div>
      </header>

      <DeployModal
        isOpen={showDeployGuide}
        onClose={() => setShowDeployGuide(false)}
      />
    </>
  );
};
