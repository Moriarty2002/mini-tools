import React, { useState, useId } from 'react';
import { WEIGHT_UNITS, Currency } from '../../types/tool';
import { Copy, Check, RotateCcw } from 'lucide-react';

interface QuantityFromBudgetProps {
  currency: Currency;
  onSaveToHistory?: (entry: {
    title: string;
    detail: string;
    result: string;
  }) => void;
}

export const QuantityFromBudget: React.FC<QuantityFromBudgetProps> = ({ currency }) => {
  const budgetInputId = useId();
  const priceInputId = useId();
  const [budget, setBudget] = useState<string>('20.00');
  const [ratePrice, setRatePrice] = useState<string>('14.50');
  const [rateUnit, setRateUnit] = useState<string>('kg');
  const [copied, setCopied] = useState<boolean>(false);

  const parsedBudget = parseFloat(budget) || 0;
  const parsedPrice = parseFloat(ratePrice) || 0;

  const selectedRateUnit = WEIGHT_UNITS.find((u) => u.id === rateUnit) || WEIGHT_UNITS[0];

  const pricePerGram = selectedRateUnit.gramsPerUnit > 0 
    ? parsedPrice / selectedRateUnit.gramsPerUnit 
    : 0;

  const affordableGrams = pricePerGram > 0 ? parsedBudget / pricePerGram : 0;
  const affordableKg = affordableGrams / 1000;
  const affordableLb = affordableGrams / 453.59237;

  const handleCopy = () => {
    const text = affordableKg >= 1 ? `${affordableKg.toFixed(3)} kg` : `${affordableGrams.toFixed(1)} g`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setBudget('');
    setRatePrice('');
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Budget */}
        <div className="space-y-1.5">
          <label htmlFor={budgetInputId} className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            Available Budget
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-sm font-semibold">
              {currency.symbol}
            </span>
            <input
              id={budgetInputId}
              type="number"
              step="any"
              min="0"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="0.00"
              className="w-full pl-9 pr-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-2xl text-neutral-900 dark:text-neutral-100 font-mono text-base shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all"
            />
          </div>
        </div>

        {/* Rate */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor={priceInputId} className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Unit Rate
            </label>
            {(budget || ratePrice) && (
              <button
                type="button"
                onClick={handleReset}
                className="text-[11px] font-medium text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-sm font-semibold">
                {currency.symbol}
              </span>
              <input
                id={priceInputId}
                type="number"
                step="any"
                min="0"
                value={ratePrice}
                onChange={(e) => setRatePrice(e.target.value)}
                placeholder="0.00"
                className="w-full pl-9 pr-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-2xl text-neutral-900 dark:text-neutral-100 font-mono text-base shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all"
              />
            </div>
            <select
              aria-label="Unit rate for budget calculation"
              value={rateUnit}
              onChange={(e) => setRateUnit(e.target.value)}
              className="w-28 py-3 px-3.5 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-2xl text-neutral-900 dark:text-neutral-100 text-sm font-medium shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all cursor-pointer"
            >
              {WEIGHT_UNITS.map((u) => (
                <option key={u.id} value={u.id}>
                  per {u.symbol}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Material 3 Result Box with Purple Accent */}
      <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-sm transition-colors">
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-700 dark:text-purple-400 block mb-1">
              Affordable Quantity
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tight tabular-nums text-neutral-900 dark:text-neutral-100">
                {affordableKg >= 1 ? affordableKg.toFixed(3) : affordableGrams.toFixed(1)}
              </span>
              <span className="text-base font-semibold text-neutral-500 dark:text-neutral-400 font-mono">
                {affordableKg >= 1 ? 'kg' : 'grams'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="px-4 py-2.5 rounded-full bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/80 dark:hover:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <div className="mt-6 pt-5 border-t border-neutral-100 dark:border-neutral-800/80 grid grid-cols-3 gap-3">
          <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 text-center">
            <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 block">in kilograms</span>
            <span className="text-sm font-bold font-mono text-neutral-800 dark:text-neutral-200 tabular-nums">
              {affordableKg.toFixed(3)} kg
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 text-center">
            <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 block">in grams</span>
            <span className="text-sm font-bold font-mono text-neutral-800 dark:text-neutral-200 tabular-nums">
              {affordableGrams.toFixed(0)} g
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 text-center">
            <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 block">in pounds</span>
            <span className="text-sm font-bold font-mono text-neutral-800 dark:text-neutral-200 tabular-nums">
              {affordableLb.toFixed(2)} lb
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
