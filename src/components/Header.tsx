import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Search, Github, HelpCircle } from 'lucide-react';
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
      <header className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Zone 1: Brand title, one line wordmark */}
          <button
            type="button"
            onClick={() => onNavigate('')}
            className="text-base font-bold tracking-tight text-neutral-900 dark:text-neutral-100 hover:opacity-80 transition-opacity text-left cursor-pointer shrink-0"
          >
            MiniTools Hub
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-neutral-600 dark:text-neutral-400">
            <button
              type="button"
              onClick={() => onNavigate('')}
              className={`hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer ${
                !currentToolSlug ? 'text-neutral-900 dark:text-neutral-100 font-semibold' : ''
              }`}
            >
              Hub Overview
            </button>
            <button
              type="button"
              onClick={() => onNavigate('price-per-kg')}
              className={`hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer ${
                currentToolSlug === 'price-per-kg' ? 'text-neutral-900 dark:text-neutral-100 font-semibold' : ''
              }`}
            >
              Price per Kg
            </button>
            <button
              type="button"
              onClick={() => setShowDeployGuide(true)}
              className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Github className="w-3.5 h-3.5" />
              github.io Ready
            </button>
          </nav>

          {/* Zone 3: Primary Actions (Quick Search Trigger & Light/Dark Theme Toggle) */}
          <div className="flex items-center gap-2">
            {/* Quick Find Button */}
            <button
              type="button"
              onClick={onOpenCommandPalette}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs transition-colors cursor-pointer"
              title="Search tools (Press Cmd+K or /)"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Find Tool...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.2 text-[10px] font-mono bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-500">
                ⌘K
              </kbd>
            </button>

            {/* Quick Toggle Light / Dark Mode */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
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

      {/* Deploy Guide Modal */}
      <DeployModal
        isOpen={showDeployGuide}
        onClose={() => setShowDeployGuide(false)}
      />
    </>
  );
};
