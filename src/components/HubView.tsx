import React, { useState, useId } from 'react';
import { TOOLS_REGISTRY, ROADMAP_TOOLS } from '../tools/registry';
import { ToolCategory } from '../types/tool';
import { useFavorites } from '../context/FavoritesContext';
import {
  Scale,
  ArrowRightLeft,
  Receipt,
  ChefHat,
  Percent,
  Search,
  Star,
  ArrowRight,
  Sparkles,
  PlusCircle,
  Zap,
} from 'lucide-react';

interface HubViewProps {
  onSelectTool: (slug: string) => void;
  onOpenCommandPalette: () => void;
}

const CATEGORIES: { id: ToolCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All Tools' },
  { id: 'pricing', label: 'Pricing & Weight' },
  { id: 'units', label: 'Units & Measures' },
  { id: 'kitchen', label: 'Kitchen & Portions' },
  { id: 'math', label: 'Math & Percentages' },
];

export const HubView: React.FC<HubViewProps> = ({
  onSelectTool,
  onOpenCommandPalette,
}) => {
  const searchInputId = useId();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');
  const { isFavorite, toggleFavorite } = useFavorites();

  const filterItem = (item: {
    name: string;
    shortDescription: string;
    category: string;
    keywords: string[];
  }) => {
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.shortDescription.toLowerCase().includes(q) ||
      item.keywords.some((k) => k.toLowerCase().includes(q));
    return matchesCategory && matchesQuery;
  };

  const activeTools = TOOLS_REGISTRY.filter(filterItem);
  const plannedTools = ROADMAP_TOOLS.filter(filterItem);

  return (
    <div className="space-y-8 pb-16">
      {/* Hero / Brand Intro Section */}
      <section className="pt-6 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-2">
            <span>Modular Utility Suite</span>
            <span aria-hidden="true">·</span>
            <span>Static-Ready for github.io</span>
            <span aria-hidden="true">·</span>
            <span>Zero Runtime Overhead</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 text-balance">
            Precision Mini Tools for Everyday Math &amp; Weight Pricing
          </h1>

          <p className="text-base text-neutral-600 dark:text-neutral-400 mt-2 max-w-2xl leading-relaxed">
            Fast, client-side tools designed for lightning lookup. Built with an isolated modular architecture so each tool runs independently with zero server dependencies.
          </p>
        </div>

        {/* Search Bar & Fast Filter Tabs */}
        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              id={searchInputId}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools by name, tag, or conversion..."
              aria-label="Search tools by name, tag, or conversion"
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-neutral-400/20 focus:border-neutral-400 transition-colors shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                Clear
              </button>
            )}
          </div>

          {/* Interactive Category Segmented Tabs */}
          <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-xl overflow-x-auto border border-neutral-200/60 dark:border-neutral-800">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-2xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Available Tools Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-500" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
              Active Mini Tools ({activeTools.length})
            </h2>
          </div>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            Ready to use immediately
          </span>
        </div>

        {activeTools.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <p className="text-xs text-neutral-500">No active tools found for your filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeTools.map((tool) => {
              const favorite = isFavorite(tool.slug);

              return (
                <div
                  key={tool.id}
                  className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all shadow-xs flex flex-col justify-between group"
                >
                  <div>
                    {/* Header line with quiet unboxed metadata */}
                    <div className="flex items-center justify-between gap-3 text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="capitalize">{tool.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>v{tool.version}</span>
                        <span aria-hidden="true">·</span>
                        <span>Updated {tool.lastUpdated}</span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(tool.slug);
                        }}
                        className={`p-1 rounded-md transition-colors ${
                          favorite
                            ? 'text-amber-500'
                            : 'text-neutral-300 dark:text-neutral-600 hover:text-neutral-500'
                        }`}
                        title={favorite ? 'Remove favorite' : 'Pin favorite'}
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>

                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <Scale className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {tool.name}
                        </h3>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1.5 leading-relaxed">
                          {tool.shortDescription}
                        </p>
                      </div>
                    </div>

                    {/* Quick Features tags */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {['Cost by Weight', 'Price per 100g/kg', 'Budget Estimator', 'Multi-Pack Compare'].map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-[11px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                    <span className="text-xs text-neutral-500 font-mono">
                      #/{tool.slug}
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectTool(tool.slug)}
                      className="px-4 py-2 text-xs font-semibold rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:hover:bg-neutral-200 dark:text-neutral-900 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Open Tool</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Modular Roadmap & Extensibility Showcase */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-500" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
              Upcoming Modular Mini Tools ({plannedTools.length})
            </h2>
          </div>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            Plug-and-play architecture ready for expansion
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {plannedTools.map((tool) => {
            const IconComponent =
              tool.icon === 'ArrowRightLeft' ? ArrowRightLeft :
              tool.icon === 'Receipt' ? Receipt :
              tool.icon === 'ChefHat' ? ChefHat :
              Percent;

            return (
              <div
                key={tool.id}
                className="p-4 rounded-xl bg-white/60 dark:bg-neutral-900/60 border border-dashed border-neutral-300 dark:border-neutral-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-2">
                    <span className="capitalize">{tool.category}</span>
                    <span className="font-mono">In Queue</span>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300 mb-2.5">
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                    {tool.name}
                  </h4>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                    {tool.shortDescription}
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-400 font-mono">
                  Slug: #{tool.slug}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Developer Architecture & GitHub Pages Guide Card */}
      <section className="p-6 rounded-2xl bg-neutral-100/70 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 space-y-3">
        <div className="flex items-center gap-2">
          <PlusCircle className="w-4 h-4 text-emerald-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
            How to Add Future Mini Tools (Simple &amp; Modular)
          </h3>
        </div>
        <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-3xl">
          To maintain extreme modularity as requested, each mini tool lives in its own folder under <code className="px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 font-mono text-[11px]">src/tools/&lt;tool-name&gt;/</code>.
          Simply export your component and add a single entry to <code className="px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 font-mono text-[11px]">src/tools/registry.ts</code>.
          The hash router, command palette, search system, and theme will automatically wire it up!
        </p>
      </section>
    </div>
  );
};
