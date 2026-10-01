import React, { useState } from 'react';
import { WEIGHT_UNITS, Currency } from '../../types/tool';
import { Plus, Trash2, Trophy, RotateCcw, Copy, Check } from 'lucide-react';

interface PackageItem {
  id: string;
  name: string;
  price: string;
  weight: string;
  unit: string;
}

interface ComparePackagesProps {
  currency: Currency;
  onSaveToHistory: (entry: {
    title: string;
    detail: string;
    result: string;
  }) => void;
}

export const ComparePackages: React.FC<ComparePackagesProps> = ({
  currency,
  onSaveToHistory,
}) => {
  const [packages, setPackages] = useState<PackageItem[]>([
    { id: '1', name: 'Standard Bag', price: '4.99', weight: '450', unit: 'g' },
    { id: '2', name: 'Family Pack', price: '10.50', weight: '1.2', unit: 'kg' },
    { id: '3', name: 'Snack Size', price: '2.40', weight: '180', unit: 'g' },
  ]);
  const [copied, setCopied] = useState<boolean>(false);

  const addPackage = () => {
    if (packages.length >= 6) return;
    const nextNum = packages.length + 1;
    setPackages([
      ...packages,
      {
        id: Date.now().toString(),
        name: `Option ${String.fromCharCode(64 + nextNum)}`,
        price: '5.00',
        weight: '500',
        unit: 'g',
      },
    ]);
  };

  const removePackage = (id: string) => {
    if (packages.length <= 2) return;
    setPackages(packages.filter((p) => p.id !== id));
  };

  const updatePackage = (id: string, field: keyof PackageItem, value: string) => {
    setPackages(packages.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const handleReset = () => {
    setPackages([
      { id: '1', name: 'Standard Bag', price: '4.99', weight: '450', unit: 'g' },
      { id: '2', name: 'Family Pack', price: '10.50', weight: '1.2', unit: 'kg' },
      { id: '3', name: 'Snack Size', price: '2.40', weight: '180', unit: 'g' },
    ]);
  };

  // Compute calculated metrics
  const analyzed = packages.map((pkg) => {
    const p = parseFloat(pkg.price) || 0;
    const w = parseFloat(pkg.weight) || 0;
    const unitObj = WEIGHT_UNITS.find((u) => u.id === pkg.unit) || WEIGHT_UNITS[1];
    const totalGrams = w * unitObj.gramsPerUnit;
    const pricePerGram = totalGrams > 0 ? p / totalGrams : Infinity;
    const pricePerKg = pricePerGram * 1000;
    const pricePer100g = pricePerGram * 100;
    return {
      ...pkg,
      parsedPrice: p,
      parsedWeight: w,
      totalGrams,
      pricePerKg,
      pricePer100g,
      unitSymbol: unitObj.symbol,
    };
  });

  // Find lowest price/kg (valid only)
  const validItems = analyzed.filter((item) => item.totalGrams > 0 && item.parsedPrice > 0);
  const bestItem = validItems.reduce((min, curr) => {
    if (!min) return curr;
    return curr.pricePerKg < min.pricePerKg ? curr : min;
  }, null as (typeof analyzed)[0] | null);

  const worstItem = validItems.reduce((max, curr) => {
    if (!max) return curr;
    return curr.pricePerKg > max.pricePerKg ? curr : max;
  }, null as (typeof analyzed)[0] | null);

  const maxSavingsPct = bestItem && worstItem && worstItem.pricePerKg > 0 && bestItem.id !== worstItem.id
    ? ((worstItem.pricePerKg - bestItem.pricePerKg) / worstItem.pricePerKg) * 100
    : 0;

  const handleCopySummary = () => {
    if (!bestItem) return;
    const text = `Best Value: ${bestItem.name} at ${currency.symbol}${bestItem.pricePerKg.toFixed(2)}/kg (saves ${maxSavingsPct.toFixed(1)}% vs most expensive)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Best Deal Summary */}
      {bestItem && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Best Value Deal
              </span>
              <p className="text-sm font-medium text-emerald-950 dark:text-emerald-100">
                <strong>{bestItem.name}</strong> is the cheapest at{' '}
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">
                  {currency.symbol}{bestItem.pricePerKg.toFixed(2)} / kg
                </span>
                {maxSavingsPct > 0 && (
                  <span className="ml-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                    (Save {maxSavingsPct.toFixed(1)}%)
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              type="button"
              onClick={handleCopySummary}
              className="px-3 py-1.5 text-xs font-medium bg-white dark:bg-neutral-800 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-lg hover:bg-emerald-100 dark:hover:bg-neutral-700 transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Result'}
            </button>
          </div>
        </div>
      )}

      {/* Package Rows */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Compare Options ({packages.length}/6)
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset defaults
            </button>
            <button
              type="button"
              onClick={addPackage}
              disabled={packages.length >= 6}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Option
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {analyzed.map((item, index) => {
            const isBest = bestItem?.id === item.id;
            const diffFromBest = bestItem && item.pricePerKg > bestItem.pricePerKg
              ? ((item.pricePerKg - bestItem.pricePerKg) / bestItem.pricePerKg) * 100
              : 0;

            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all ${
                  isBest
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/80 shadow-xs ring-1 ring-emerald-500/20'
                    : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-xs'
                }`}
              >
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  {/* Name */}
                  <div className="sm:col-span-3">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-neutral-200 dark:bg-neutral-800 text-[11px] font-mono font-medium flex items-center justify-center text-neutral-700 dark:text-neutral-300">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updatePackage(item.id, 'name', e.target.value)}
                        placeholder="Item label"
                        aria-label="Item label"
                        className="w-full px-2.5 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-md text-xs font-medium text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Price */}
                  <div className="sm:col-span-3">
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-xs">
                        {currency.symbol}
                      </span>
                      <input
                        type="number"
                        step="any"
                        min="0"
                        value={item.price}
                        onChange={(e) => updatePackage(item.id, 'price', e.target.value)}
                        placeholder="Price"
                        aria-label="Price"
                        className="w-full pl-6 pr-2 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-md text-xs font-mono text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Weight & Unit */}
                  <div className="sm:col-span-3 flex gap-1.5">
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={item.weight}
                      onChange={(e) => updatePackage(item.id, 'weight', e.target.value)}
                      placeholder="Weight"
                      aria-label="Weight"
                      className="w-full px-2 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-md text-xs font-mono text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-emerald-500"
                    />
                    <select
                      value={item.unit}
                      aria-label="Weight unit"
                      onChange={(e) => updatePackage(item.id, 'unit', e.target.value)}
                      className="py-1.5 px-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-md text-xs text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-emerald-500"
                    >
                      {WEIGHT_UNITS.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.symbol}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Rate / Result */}
                  <div className="sm:col-span-2 flex items-center justify-between sm:justify-end gap-3">
                    <div className="text-right">
                      <div className="flex items-center gap-1 sm:justify-end">
                        <span className={`font-mono text-sm font-bold tabular-nums ${isBest ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-900 dark:text-neutral-100'}`}>
                          {currency.symbol}{item.pricePerKg < 99999 ? item.pricePerKg.toFixed(2) : '--'}
                        </span>
                        <span className="text-[11px] text-neutral-400 font-mono">/kg</span>
                      </div>
                      {diffFromBest > 0 && (
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium block">
                          +{diffFromBest.toFixed(0)}% more exp.
                        </span>
                      )}
                      {isBest && (
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium block">
                          ✓ Lowest unit price
                        </span>
                      )}
                    </div>

                    {packages.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removePackage(item.id)}
                        className="text-neutral-400 hover:text-red-500 p-1 rounded transition-colors"
                        title="Delete option"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
