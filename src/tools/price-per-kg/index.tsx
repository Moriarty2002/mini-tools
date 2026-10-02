import React, { useState } from 'react';
import { POPULAR_CURRENCIES, Currency } from '../../types/tool';
import { PriceFromCost } from './PriceFromCost';
import { CostFromWeight } from './CostFromWeight';
import { ComparePackages } from './ComparePackages';
import { QuantityFromBudget } from './QuantityFromBudget';
import { ChevronLeft } from 'lucide-react';

interface PricePerKgCalculatorProps {
  onNavigate?: (slug: string) => void;
}

export const PricePerKgCalculator: React.FC<PricePerKgCalculatorProps> = ({ onNavigate }) => {
  // 'unit-price' is the default and first tab
  const [activeTab, setActiveTab] = useState<'unit-price' | 'cost' | 'compare' | 'budget'>('unit-price');
  
  // Default currency is Euro (€)
  const [currency, setCurrency] = useState<Currency>(() => 
    POPULAR_CURRENCIES.find((c) => c.code === 'EUR') || POPULAR_CURRENCIES[0]
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-4">
      {/* Material Top Bar */}
      <div className="flex items-center justify-between gap-3">
        {onNavigate && (
          <button
            type="button"
            onClick={() => onNavigate('')}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors py-1.5 px-3 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>All Tools</span>
          </button>
        )}

        {/* Currency Switcher Dropdown (Material Outlined) */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Currency</span>
          <select
            aria-label="Currency"
            value={currency.code}
            onChange={(e) => {
              const found = POPULAR_CURRENCIES.find((c) => c.code === e.target.value);
              if (found) setCurrency(found);
            }}
            className="py-1.5 px-3 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-full text-xs font-semibold text-neutral-900 dark:text-neutral-100 shadow-2xs focus:outline-hidden focus:ring-1 focus:ring-purple-500 cursor-pointer"
          >
            {POPULAR_CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} ({c.symbol})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Material Section Headline */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          Price per Kilogram &amp; Weight Calculator
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Calculate unit prices per kg, total cost from weight, or compare deals.
        </p>
      </div>

      {/* Material 3 Segmented Button Navigation with Purple Accent */}
      <div className="p-1 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-full flex items-center gap-1 overflow-x-auto shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveTab('unit-price')}
          className={`flex-1 py-2 px-3.5 rounded-full text-xs font-medium transition-all duration-150 whitespace-nowrap cursor-pointer text-center ${
            activeTab === 'unit-price'
              ? 'bg-white dark:bg-neutral-800 text-purple-800 dark:text-purple-300 font-semibold shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
          }`}
        >
          1. Find Price / Kg
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('cost')}
          className={`flex-1 py-2 px-3.5 rounded-full text-xs font-medium transition-all duration-150 whitespace-nowrap cursor-pointer text-center ${
            activeTab === 'cost'
              ? 'bg-white dark:bg-neutral-800 text-purple-800 dark:text-purple-300 font-semibold shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
          }`}
        >
          2. Cost by Weight
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('compare')}
          className={`flex-1 py-2 px-3.5 rounded-full text-xs font-medium transition-all duration-150 whitespace-nowrap cursor-pointer text-center ${
            activeTab === 'compare'
              ? 'bg-white dark:bg-neutral-800 text-purple-800 dark:text-purple-300 font-semibold shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
          }`}
        >
          3. Compare Packages
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('budget')}
          className={`flex-1 py-2 px-3.5 rounded-full text-xs font-medium transition-all duration-150 whitespace-nowrap cursor-pointer text-center ${
            activeTab === 'budget'
              ? 'bg-white dark:bg-neutral-800 text-purple-800 dark:text-purple-300 font-semibold shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
          }`}
        >
          4. Budget Limit
        </button>
      </div>

      {/* Tab Content */}
      <div className="pt-2">
        {activeTab === 'unit-price' && <PriceFromCost currency={currency} />}
        {activeTab === 'cost' && <CostFromWeight currency={currency} />}
        {activeTab === 'compare' && <ComparePackages currency={currency} />}
        {activeTab === 'budget' && <QuantityFromBudget currency={currency} />}
      </div>
    </div>
  );
};
