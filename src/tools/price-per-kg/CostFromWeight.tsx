import React, { useState, useId } from 'react';
import { WEIGHT_UNITS, Currency } from '../../types/tool';
import { Copy, Check, RotateCcw } from 'lucide-react';

interface CostFromWeightProps {
  currency: Currency;
  onSaveToHistory?: (entry: {
    title: string;
    detail: string;
    result: string;
  }) => void;
}

export const CostFromWeight: React.FC<CostFromWeightProps> = ({ currency }) => {
  const priceInputId = useId();
  const weightInputId = useId();
  const [unitPrice, setUnitPrice] = useState<string>('12.50');
  const [rateUnit, setRateUnit] = useState<string>('kg');
  const [weightValue, setWeightValue] = useState<string>('450');
  const [weightUnit, setWeightUnit] = useState<string>('g');
  const [copied, setCopied] = useState<boolean>(false);

  const parsedPrice = parseFloat(unitPrice) || 0;
  const parsedWeight = parseFloat(weightValue) || 0;

  const selectedRateUnit = WEIGHT_UNITS.find((u) => u.id === rateUnit) || WEIGHT_UNITS[0];
  const selectedWeightUnit = WEIGHT_UNITS.find((u) => u.id === weightUnit) || WEIGHT_UNITS[1];

  // Convert rate to Price per Gram
  const pricePerGram = selectedRateUnit.gramsPerUnit > 0 
    ? parsedPrice / selectedRateUnit.gramsPerUnit 
    : 0;

  // Total weight in grams
  const totalGrams = parsedWeight * selectedWeightUnit.gramsPerUnit;

  // Final Total Cost
  const totalCost = pricePerGram * totalGrams;

  const handleCopy = () => {
    const text = `${currency.symbol}${totalCost.toFixed(2)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setUnitPrice('');
    setWeightValue('');
  };

  return (
    <div className="space-y-5">
      {/* Material Outlined Input Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Rate Input */}
        <div className="space-y-1.5">
          <label htmlFor={priceInputId} className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            Price Rate
          </label>
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
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                placeholder="0.00"
                className="w-full pl-9 pr-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-2xl text-neutral-900 dark:text-neutral-100 font-mono text-base shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all"
              />
            </div>
            <select
              aria-label="Base unit rate"
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

        {/* Item Weight Input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor={weightInputId} className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Item Weight
            </label>
            {(unitPrice || weightValue) && (
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
            <input
              id={weightInputId}
              type="number"
              step="any"
              min="0"
              value={weightValue}
              onChange={(e) => setWeightValue(e.target.value)}
              placeholder="0"
              className="flex-1 px-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-2xl text-neutral-900 dark:text-neutral-100 font-mono text-base shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all"
            />
            <select
              aria-label="Item weight unit"
              value={weightUnit}
              onChange={(e) => setWeightUnit(e.target.value)}
              className="w-28 py-3 px-3.5 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-2xl text-neutral-900 dark:text-neutral-100 text-sm font-medium shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all cursor-pointer"
            >
              {WEIGHT_UNITS.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.symbol}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Material 3 Elevated Result Card with Purple Accent */}
      <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-sm transition-colors">
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-700 dark:text-purple-400 block mb-1">
              Total Calculated Cost
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tight tabular-nums text-neutral-900 dark:text-neutral-100">
                {currency.symbol}{totalCost > 0 && totalCost < 999999 ? totalCost.toFixed(2) : '0.00'}
              </span>
              <span className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 font-mono">
                for {parsedWeight || 0} {selectedWeightUnit.symbol}
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

        {/* Breakdown */}
        <div className="mt-6 pt-5 border-t border-neutral-100 dark:border-neutral-800/80 grid grid-cols-3 gap-3">
          <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 text-center">
            <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 block">per kg</span>
            <span className="text-sm font-bold font-mono text-neutral-800 dark:text-neutral-200 tabular-nums">
              {currency.symbol}{(pricePerGram * 1000).toFixed(2)}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 text-center">
            <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 block">per 100g</span>
            <span className="text-sm font-bold font-mono text-neutral-800 dark:text-neutral-200 tabular-nums">
              {currency.symbol}{(pricePerGram * 100).toFixed(2)}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 text-center">
            <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 block">per lb</span>
            <span className="text-sm font-bold font-mono text-neutral-800 dark:text-neutral-200 tabular-nums">
              {currency.symbol}{(pricePerGram * 453.592).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
