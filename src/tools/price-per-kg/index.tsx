import React, { useState } from 'react';
import { POPULAR_CURRENCIES, Currency } from '../../types/tool';
import { CostFromWeight } from './CostFromWeight';
import { PriceFromCost } from './PriceFromCost';
import { QuantityFromBudget } from './QuantityFromBudget';
import { ComparePackages } from './ComparePackages';
import { WeightReferenceTable } from './WeightReferenceTable';
import { useFavorites } from '../../context/FavoritesContext';
import {
  Scale,
  Calculator,
  ArrowRightLeft,
  Coins,
  TableProperties,
  Star,
  History,
  Trash2,
  ChevronLeft,
  Share2,
  Check,
} from 'lucide-react';

interface HistoryItem {
  id: string;
  timestamp: string;
  title: string;
  detail: string;
  result: string;
}

interface PricePerKgCalculatorProps {
  onNavigate?: (slug: string) => void;
}

export const PricePerKgCalculator: React.FC<PricePerKgCalculatorProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'cost' | 'unit-price' | 'budget' | 'compare' | 'table'>('cost');
  const [currency, setCurrency] = useState<Currency>(POPULAR_CURRENCIES[0]);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('minitools_price_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [shareCopied, setShareCopied] = useState<boolean>(false);

  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite('price-per-kg');

  const addHistoryItem = (item: { title: string; detail: string; result: string }) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      ...item,
    };
    const updated = [newItem, ...history].slice(0, 15);
    setHistory(updated);
    try {
      localStorage.setItem('minitools_price_history', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('minitools_price_history');
    } catch {
      // ignore
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Breadcrumb & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('')}
              className="inline-flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors py-1 px-2 rounded-md hover:bg-neutral-200/60 dark:hover:bg-neutral-800"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              All Mini Tools
            </button>
          )}
          <span className="text-neutral-300 dark:text-neutral-700">/</span>
          <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
            Price per Kg & Weight Calculator
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Currency Switcher */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-neutral-500 dark:text-neutral-400">Currency:</span>
            <select
              aria-label="Currency"
              value={currency.code}
              onChange={(e) => {
                const found = POPULAR_CURRENCIES.find((c) => c.code === e.target.value);
                if (found) setCurrency(found);
              }}
              className="py-1 px-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-medium text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-emerald-500"
            >
              {POPULAR_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} ({c.symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Favorite Toggle */}
          <button
            type="button"
            onClick={() => toggleFavorite('price-per-kg')}
            className={`p-1.5 rounded-lg border transition-colors ${
              favorited
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-500'
                : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
            }`}
            title={favorited ? 'Remove from favorites' : 'Pin to favorites'}
          >
            <Star className="w-4 h-4 fill-current" />
          </button>

          {/* Share Deep-Link */}
          <button
            type="button"
            onClick={handleShare}
            className="p-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
            title="Copy direct tool link"
          >
            {shareCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
          </button>

          {/* History Drawer Toggle */}
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
              showHistory
                ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 border-neutral-900'
                : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>History ({history.length})</span>
          </button>
        </div>
      </div>

      {/* Tool Hero Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                Price per Kilogram & Weight Cost Calculator
              </h1>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 max-w-2xl">
              Calculate total purchase cost by weight, discover exact unit rates (/kg, /100g, /lb, /oz), calculate affordable weight within your budget, or compare package sizes to find the best value.
            </p>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="mt-6 flex flex-wrap items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800/80 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('cost')}
            className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'cost'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>1. Calculate Total Cost</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('unit-price')}
            className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'unit-price'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>2. Find Price / Kg</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('budget')}
            className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'budget'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>3. Budget to Quantity</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('compare')}
            className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'compare'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>4. Compare Packages</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('table')}
            className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'table'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            <TableProperties className="w-3.5 h-3.5" />
            <span>5. Quick Table</span>
          </button>
        </div>
      </div>

      {/* History Drawer */}
      {showHistory && (
        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-neutral-500" />
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                Calculation Scratchpad History
              </span>
            </div>
            {history.length > 0 && (
              <button
                type="button"
                onClick={clearHistory}
                className="text-xs text-neutral-500 hover:text-red-500 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <p className="text-xs text-neutral-400 py-3 text-center">
              No calculations saved yet. Click &quot;Save to History&quot; in any tab to record entries.
            </p>
          ) : (
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800 max-h-56 overflow-y-auto pr-1">
              {history.map((item) => (
                <div key={item.id} className="py-2 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-medium text-neutral-900 dark:text-neutral-100 mr-2">
                      {item.title}
                    </span>
                    <span className="text-neutral-500 dark:text-neutral-400">
                      {item.detail}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {item.result}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {item.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Active Tab View */}
      {activeTab === 'cost' && (
        <CostFromWeight currency={currency} onSaveToHistory={addHistoryItem} />
      )}
      {activeTab === 'unit-price' && (
        <PriceFromCost currency={currency} onSaveToHistory={addHistoryItem} />
      )}
      {activeTab === 'budget' && (
        <QuantityFromBudget currency={currency} onSaveToHistory={addHistoryItem} />
      )}
      {activeTab === 'compare' && (
        <ComparePackages currency={currency} onSaveToHistory={addHistoryItem} />
      )}
      {activeTab === 'table' && (
        <WeightReferenceTable currency={currency} initialPricePerKg={12.5} />
      )}
    </div>
  );
};
