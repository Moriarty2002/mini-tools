import React, { useState, useId } from 'react';
import { WEIGHT_UNITS, WeightUnit, Currency } from '../../types/tool';
import { Copy, Check, Plus, RotateCcw, BookmarkPlus } from 'lucide-react';

interface CostFromWeightProps {
  currency: Currency;
  onSaveToHistory: (entry: {
    title: string;
    detail: string;
    result: string;
  }) => void;
}

export const CostFromWeight: React.FC<CostFromWeightProps> = ({
  currency,
  onSaveToHistory,
}) => {
  const priceInputId = useId();
  const weightInputId = useId();
  const [unitPrice, setUnitPrice] = useState<string>('12.50');
  const [rateUnit, setRateUnit] = useState<string>('kg');
  const [weightValue, setWeightValue] = useState<string>('450');
  const [weightUnit, setWeightUnit] = useState<string>('g');
  const [copied, setCopied] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);

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

  // Derived unit prices
  const costPerKg = pricePerGram * 1000;
  const costPer100g = pricePerGram * 100;
  const costPerLb = pricePerGram * 453.59237;
  const costPerOz = pricePerGram * 28.349523;

  const handleCopy = () => {
    const text = `${currency.symbol}${totalCost.toFixed(2)} (${parsedWeight} ${selectedWeightUnit.symbol} @ ${currency.symbol}${parsedPrice}/${selectedRateUnit.symbol})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    onSaveToHistory({
      title: 'Cost by Weight',
      detail: `${parsedWeight} ${selectedWeightUnit.symbol} @ ${currency.symbol}${parsedPrice}/${selectedRateUnit.symbol}`,
      result: `${currency.symbol}${totalCost.toFixed(2)}`,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const addWeight = (deltaGrams: number) => {
    const currentG = parsedWeight * selectedWeightUnit.gramsPerUnit;
    const newG = Math.max(0, currentG + deltaGrams);
    const converted = newG / selectedWeightUnit.gramsPerUnit;
    setWeightValue(Number.isInteger(converted) ? converted.toString() : converted.toFixed(2));
  };

  const handleReset = () => {
    setUnitPrice('12.50');
    setWeightValue('450');
    setWeightUnit('g');
    setRateUnit('kg');
  };

  return (
    <div className="space-y-6">
      {/* Input Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Rate Input */}
        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <label htmlFor={priceInputId} className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
            Base Unit Price
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
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-3 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono text-base focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
              />
            </div>
            <div className="w-36">
              <select
                aria-label="Base unit rate"
                value={rateUnit}
                onChange={(e) => setRateUnit(e.target.value)}
                className="w-full py-2.5 px-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
              >
                {WEIGHT_UNITS.map((u) => (
                  <option key={u.id} value={u.id}>
                    per {u.symbol} ({u.name})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
            <span>Standard store shelf tag rate (e.g. {currency.symbol}12.50 per kg)</span>
          </div>
        </div>

        {/* Item Weight Input */}
        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <label htmlFor={weightInputId} className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
            Item Weight
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
                aria-label="Item weight unit"
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

          {/* Quick Adjustment Buttons */}
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-neutral-400 mr-1">Quick add:</span>
            {[50, 100, 250, 500, 1000].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => addWeight(g)}
                className="px-2 py-0.5 text-xs font-medium bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded transition-colors"
              >
                +{g >= 1000 ? `${g / 1000}kg` : `${g}g`}
              </button>
            ))}
            <button
              type="button"
              onClick={handleReset}
              className="ml-auto inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
              title="Reset fields"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Main Calculated Cost Highlight Card */}
      <div className="p-6 rounded-2xl bg-neutral-900 text-white dark:bg-neutral-900/90 border border-neutral-800 dark:border-neutral-700 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-neutral-400 block mb-1">
              Total Calculated Cost
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-bold font-mono tracking-tight tabular-nums text-emerald-400">
                {currency.symbol}{totalCost.toFixed(2)}
              </span>
              <span className="text-sm text-neutral-400 font-mono">
                for {parsedWeight} {selectedWeightUnit.symbol}
              </span>
            </div>
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

        {/* Normalized Breakdown Grid */}
        <div className="mt-6 pt-5 border-t border-neutral-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-2.5 rounded-lg bg-neutral-800/60 border border-neutral-800">
            <span className="text-[11px] uppercase tracking-wider text-neutral-400 block">Price / kg</span>
            <span className="text-base font-semibold font-mono text-neutral-100 tabular-nums">
              {currency.symbol}{costPerKg.toFixed(2)}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-neutral-800/60 border border-neutral-800">
            <span className="text-[11px] uppercase tracking-wider text-neutral-400 block">Price / 100g</span>
            <span className="text-base font-semibold font-mono text-neutral-100 tabular-nums">
              {currency.symbol}{costPer100g.toFixed(2)}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-neutral-800/60 border border-neutral-800">
            <span className="text-[11px] uppercase tracking-wider text-neutral-400 block">Price / lb</span>
            <span className="text-base font-semibold font-mono text-neutral-100 tabular-nums">
              {currency.symbol}{costPerLb.toFixed(2)}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-neutral-800/60 border border-neutral-800">
            <span className="text-[11px] uppercase tracking-wider text-neutral-400 block">Price / oz</span>
            <span className="text-base font-semibold font-mono text-neutral-100 tabular-nums">
              {currency.symbol}{costPerOz.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
