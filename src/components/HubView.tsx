import React, { useState, useId } from 'react';
import { TOOLS_REGISTRY } from '../tools/registry';
import { Search, ArrowRight, Scale } from 'lucide-react';

interface HubViewProps {
  onSelectTool: (slug: string) => void;
  onOpenCommandPalette: () => void;
}

export const HubView: React.FC<HubViewProps> = ({ onSelectTool }) => {
  const searchInputId = useId();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = TOOLS_REGISTRY.filter((tool) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      tool.name.toLowerCase().includes(q) ||
      tool.shortDescription.toLowerCase().includes(q) ||
      tool.keywords.some((k) => k.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-6">
      {/* Material Headline */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          Mini Tools Hub
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Fast, lightweight utility tools with instant calculations.
        </p>
      </div>

      {/* Material 3 Search Bar (Pill Shape with soft shadow) */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          id={searchInputId}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search mini tools..."
          aria-label="Search mini tools"
          className="w-full pl-11 pr-10 py-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 shadow-xs focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* Material Cards List with Purple Accent */}
      <div className="space-y-3 pt-2">
        {filteredTools.length === 0 ? (
          <div className="p-8 text-center border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-900">
            <p className="text-sm text-neutral-500">No tools matched your search.</p>
          </div>
        ) : (
          filteredTools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => onSelectTool(tool.slug)}
              className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs hover:shadow-md hover:border-purple-300 dark:hover:border-purple-900/60 transition-all duration-200 flex items-center justify-between gap-4 cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0">
                  <Scale className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">
                    {tool.name}
                  </h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                    {tool.shortDescription}
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 group-hover:bg-purple-600 group-hover:text-white dark:group-hover:bg-purple-500 dark:group-hover:text-neutral-950 text-xs font-medium transition-colors">
                <span className="hidden sm:inline">Open</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
