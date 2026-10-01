import React, { useState, useId } from 'react';
import { WEIGHT_UNITS, Currency } from '../../types/tool';
import { Copy, Check, BookmarkPlus, RotateCcw } from 'lucide-react';

interface QuantityFromBudgetProps {
  currency: Currency;
  onSaveToHistory: (entry: {
    title: string;
    detail: string;
    result: string;
  }) => void;
}

export const QuantityFromBudget: React.FC<QuantityFromBudgetProps> = ({
  currency,
  onSaveToHistory,
}) => {
  const budgetInputId = useId();
  const priceInputId = useId();
  const [budget, setBudget] = useState<string>('20.00');
  const [ratePrice, setRatePrice] = useState<string>('14.50');
  const [rateUnit, setRateUnit] = useState<string>('kg');
  const [copied, setCopied] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);

  const parsedBudget = parseFloat(budget) || 0;
  const parsedPrice = parseFloat(ratePrice) || 0;

  const selectedRateUnit = WEIGHT_UNITS.find((u) => u.id === rateUnit) || WEIGHT_UNITS[0];

  // Price per gram
  const pricePerGram = selectedRateUnit.gramsPerUnit > 0 
    ? parsedPrice / selectedRateUnit.gramsPerUnit 
    : 0;

  // Total affordable weight in grams
  const affordableGrams = pricePerGram > 0 ? parsedBudget / pricePerGram : 0;
  const affordableKg = affordableGrams / 1000;
  const affordableLb = affordableGrams / 453.59237;
  const affordableOz = affordableGrams / 28.349523;

  const handleCopy = () => {
    const text = `${affordableKg.toFixed(3)} kg (${affordableGrams.toFixed(1)}g) for ${currency.symbol}${parsedBudget} @ ${currency.symbol}${parsedPrice}/${selectedRateUnit.symbol}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    onSaveToHistory({
      title: 'Affordable Quantity',
      detail: `Budget ${currency.symbol}${parsedBudget} @ ${currency.symbol}${parsedPrice}/${selectedRateUnit.symbol}`,
      result: `${affordableKg.toFixed(3)} kg (${affordableGrams.toFixed(0)}g)`,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const handleReset = () => {
    setBudget('20.00');
    setRatePrice('14.50');
    setRateUnit('kg');
  };

  return (
    <div className="space-y-6">
      {/* Input Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Budget Amount */}
        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <label htmlFor={budgetInputId} className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
            Target Budget / Spending Limit
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-sm">
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
              className="w-full pl-8 pr-3 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono text-base focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
            />
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
            <span>How much you want to spend</span>
          </div>
        </div>

        {/* Price per Kg / Unit */}
        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <label htmlFor={priceInputId} className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
            Unit Price Rate
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-sm">
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
                className="w-full pl-8 pr-3 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono text-base focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
              />
            </div>
            <div className="w-36">
              <select
                aria-label="Target unit rate"
                value={rateUnit}
                onChange={(e) => setRateUnit(e.target.value)}
                className="w-full py-2.5 px-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
              >
                {WEIGHT_UNITS.map((u) => (
                  <option key={u.id} value={u.id}>
                    per {u.symbol}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <span>Rate tag for this good</span>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Main Calculated Weight Card */}
      <div className="p-6 rounded-2xl bg-neutral-900 text-white dark:bg-neutral-900/90 border border-neutral-800 dark:border-neutral-700 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-neutral-400 block mb-1">
              Affordable Quantity
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-bold font-mono tracking-tight tabular-nums text-emerald-400">
                {affordableKg >= 1 ? affordableKg.toFixed(3) : affordableGrams.toFixed(1)}
              </span>
              <span className="text-lg text-neutral-400 font-mono">
                {affordableKg >= 1 ? 'kg' : 'grams'}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              For your budget of {currency.symbol}{parsedBudget.toFixed(2)} at {currency.symbol}{parsedPrice}/{selectedRateUnit.symbol}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3.5 py-2 text-xs font-medium rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-3.5 py-2 text-xs font-medium rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1.5"
            >
              {saved ? <Check className="w-3.5 h-3.5" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
              {saved ? 'Saved' : 'Save to History'}
            </button>
          </div>
        </div>

        {/* Normalized Breakdown in other units */}
        <div className="mt-6 pt-5 border-t border-neutral-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-2.5 rounded-lg bg-neutral-800/60 border border-neutral-800">
            <span className="text-[11px] uppercase tracking-wider text-neutral-400 block">In Kilograms (kg)</span>
            <span className="text-base font-semibold font-mono text-neutral-100 tabular-nums">
              {affordableKg.toFixed(3)} kg
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-neutral-800/60 border border-neutral-800">
            <span className="text-[11px] uppercase tracking-wider text-neutral-400 block">In Grams (g)</span>
            <span className="text-base font-semibold font-mono text-neutral-100 tabular-nums">
              {affordableGrams.toFixed(1)} g
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-neutral-800/60 border border-neutral-800">
            <span className="text-[11px] uppercase tracking-wider text-neutral-400 block">In Pounds (lb)</span>
            <span className="text-base font-semibold font-mono text-neutral-100 tabular-nums">
              {affordableLb.toFixed(3)} lb
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-neutral-800/60 border border-neutral-800">
            <span className="text-[11px] uppercase tracking-wider text-neutral-400 block">In Ounces (oz)</span>
            <span className="text-base font-semibold font-mono text-neutral-100 tabular-nums">
              {affordableOz.toFixed(2)} oz
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
