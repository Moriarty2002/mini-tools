import React, { useState, useEffect, useRef, useId } from 'react';
import { searchAllTools, TOOLS_REGISTRY } from '../tools/registry';
import { ToolMetadata } from '../types/tool';
import { Search, Scale, ArrowRightLeft, Receipt, ChefHat, Percent, Star, ArrowRight, CornerDownLeft, Sparkles } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (slug: string) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Scale: <Scale className="w-4 h-4 text-emerald-500" />,
  ArrowRightLeft: <ArrowRightLeft className="w-4 h-4 text-sky-500" />,
  Receipt: <Receipt className="w-4 h-4 text-amber-500" />,
  ChefHat: <ChefHat className="w-4 h-4 text-orange-500" />,
  Percent: <Percent className="w-4 h-4 text-indigo-500" />,
};

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectTool,
}) => {
  const searchInputId = useId();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isFavorite, recentTools } = useFavorites();

  const results = searchAllTools(query);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation inside modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, results.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + results.length) % Math.max(1, results.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = results[selectedIndex];
        if (selected) {
          if (selected.status === 'active') {
            onSelectTool(selected.slug);
            onClose();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose, onSelectTool]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Quick find mini tools"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-neutral-950/60 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative border-b border-neutral-200 dark:border-neutral-800 px-4 py-3 flex items-center gap-3">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            id={searchInputId}
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a tool name, unit, or math calculation..."
            aria-label="Search mini tools"
            className="w-full bg-transparent text-base text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-hidden"
          />
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-medium text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-400">
              No mini tools matched &ldquo;{query}&rdquo;
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((tool, idx) => {
                const isSelected = idx === selectedIndex;
                const isActive = tool.status === 'active';
                const favorite = isFavorite(tool.slug);

                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => {
                      if (isActive) {
                        onSelectTool(tool.slug);
                        onClose();
                      }
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full text-left p-3 rounded-xl transition-colors flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-neutral-100 dark:bg-neutral-800/80 text-neutral-900 dark:text-neutral-100'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 border border-neutral-200/50 dark:border-neutral-700/50">
                        {ICON_MAP[tool.icon] || <Scale className="w-4 h-4 text-neutral-400" />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold truncate text-neutral-900 dark:text-neutral-100">
                            {tool.name}
                          </span>
                          {favorite && (
                            <Star className="w-3 h-3 text-amber-500 fill-current shrink-0" />
                          )}
                          {!isActive && (
                            <span className="text-[10px] px-1.5 py-0.2 font-medium bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded">
                              Planned
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                          {tool.shortDescription}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5 text-neutral-400">
                      {isActive ? (
                        isSelected ? (
                          <span className="flex items-center gap-1 text-[11px] font-mono text-neutral-600 dark:text-neutral-300">
                            Open <CornerDownLeft className="w-3 h-3" />
                          </span>
                        ) : (
                          <ArrowRight className="w-3.5 h-3.5" />
                        )
                      ) : (
                        <span className="text-[10px] text-neutral-400">Soon</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer Shortcuts */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 px-4 py-2.5 bg-neutral-50 dark:bg-neutral-950/60 flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1 py-0.5 bg-white dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700">↑↓</kbd> Navigate
            </span>
            <span>
              <kbd className="px-1 py-0.5 bg-white dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700">↵</kbd> Select
            </span>
          </div>
          <span>Instant Launcher</span>
        </div>
      </div>
    </div>
  );
};
