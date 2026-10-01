import React, { useState, useId } from 'react';
import { WEIGHT_UNITS, Currency } from '../../types/tool';
import { Copy, Check, BookmarkPlus, RotateCcw } from 'lucide-react';

interface PriceFromCostProps {
  currency: Currency;
  onSaveToHistory: (entry: {
    title: string;
    detail: string;
    result: string;
  }) => void;
}

export const PriceFromCost: React.FC<PriceFromCostProps> = ({
  currency,
  onSaveToHistory,
}) => {
  const costInputId = useId();
  const weightInputId = useId();
  const [totalCost, setTotalCost] = useState<string>('5.99');
  const [weightValue, setWeightValue] = useState<string>('350');
  const [weightUnit, setWeightUnit] = useState<string>('g');
  const [copied, setCopied] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);

  const parsedCost = parseFloat(totalCost) || 0;
  const parsedWeight = parseFloat(weightValue) || 0;

  const selectedWeightUnit = WEIGHT_UNITS.find((u) => u.id === weightUnit) || WEIGHT_UNITS[1];

  // Total weight in grams
  const totalGrams = parsedWeight * selectedWeightUnit.gramsPerUnit;

  // Price per gram
  const pricePerGram = totalGrams > 0 ? parsedCost / totalGrams : 0;

  // Key normalized rates
  const pricePerKg = pricePerGram * 1000;
  const pricePer100g = pricePerGram * 100;
  const pricePerLb = pricePerGram * 453.59237;
  const pricePerOz = pricePerGram * 28.349523;

  const handleCopy = () => {
    const text = `${currency.symbol}${pricePerKg.toFixed(2)}/kg (${currency.symbol}${parsedCost} for ${parsedWeight}${selectedWeightUnit.symbol})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    onSaveToHistory({
      title: 'Unit Price (/kg)',
      detail: `${currency.symbol}${parsedCost} for ${parsedWeight} ${selectedWeightUnit.symbol}`,
      result: `${currency.symbol}${pricePerKg.toFixed(2)} / kg`,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const handleReset = () => {
    setTotalCost('5.99');
    setWeightValue('350');
    setWeightUnit('g');
  };

  return (
    <div className="space-y-6">
      {/* Input Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Total Cost Paid */}
        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <label htmlFor={costInputId} className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
            Total Price Paid
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-sm">
              {currency.symbol}
            </span>
            <input
              id={costInputId}
              type="number"
              step="any"
              min="0"
              value={totalCost}
              onChange={(e) => setTotalCost(e.target.value)}
              placeholder="0.00"
              className="w-full pl-8 pr-3 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono text-base focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
            />
          </div>
          <span className="mt-2.5 block text-xs text-neutral-500 dark:text-neutral-400">
            Total checkout or package price (e.g. {currency.symbol}5.99)
          </span>
        </div>

        {/* Package Weight */}
        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <label htmlFor={weightInputId} className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
            Net Weight / Quantity
          </label>
          <div className="flex gap-2">
            <input
              id={weightInputId}
              type="number"
              step="any"
              min="0"
              value={weightValue}
              onChange={(e) => setWeightValue(e.target.value)}
              placeholder="0"
              className="flex-1 px-3 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono text-base focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
            />
            <div className="w-36">
              <select
                aria-label="Unit of weight"
                value={weightUnit}
                onChange={(e) => setWeightUnit(e.target.value)}
                className="w-full py-2.5 px-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
              >
                {WEIGHT_UNITS.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.symbol} ({u.name})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <span>Net weight printed on the package</span>
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

      {/* Main Calculated Price / Kg Card */}
      <div className="p-6 rounded-2xl bg-neutral-900 text-white dark:bg-neutral-900/90 border border-neutral-800 dark:border-neutral-700 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-neutral-400 block mb-1">
              Normalized Unit Cost
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-bold font-mono tracking-tight tabular-nums text-emerald-400">
                {currency.symbol}{pricePerKg.toFixed(2)}
              </span>
              <span className="text-lg text-neutral-400 font-mono">
                / kg
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Equivalent to paying {currency.symbol}{(pricePerGram * 1000).toFixed(2)} for each kilogram
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

        {/* Normalized Breakdown Across Units */}
        <div className="mt-6 pt-5 border-t border-neutral-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-2.5 rounded-lg bg-neutral-800/60 border border-neutral-800">
            <span className="text-[11px] uppercase tracking-wider text-neutral-400 block">Cost / 100g</span>
            <span className="text-base font-semibold font-mono text-neutral-100 tabular-nums">
              {currency.symbol}{pricePer100g.toFixed(2)}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-neutral-800/60 border border-neutral-800">
            <span className="text-[11px] uppercase tracking-wider text-neutral-400 block">Cost / Pound (lb)</span>
            <span className="text-base font-semibold font-mono text-neutral-100 tabular-nums">
              {currency.symbol}{pricePerLb.toFixed(2)}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-neutral-800/60 border border-neutral-800">
            <span className="text-[11px] uppercase tracking-wider text-neutral-400 block">Cost / Ounce (oz)</span>
            <span className="text-base font-semibold font-mono text-neutral-100 tabular-nums">
              {currency.symbol}{pricePerOz.toFixed(2)}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-neutral-800/60 border border-neutral-800">
            <span className="text-[11px] uppercase tracking-wider text-neutral-400 block">Cost / 1 Gram</span>
            <span className="text-base font-semibold font-mono text-neutral-100 tabular-nums">
              {currency.symbol}{pricePerGram.toFixed(4)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
