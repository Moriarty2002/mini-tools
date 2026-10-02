import React, { useState } from 'react';
import { WEIGHT_UNITS, Currency } from '../../types/tool';
import { Plus, Trash2, RotateCcw } from 'lucide-react';

interface PackageItem {
  id: string;
  name: string;
  price: string;
  weight: string;
  unit: string;
}

interface ComparePackagesProps {
  currency: Currency;
  onSaveToHistory?: (entry: {
    title: string;
    detail: string;
    result: string;
  }) => void;
}

export const ComparePackages: React.FC<ComparePackagesProps> = ({ currency }) => {
  const [packages, setPackages] = useState<PackageItem[]>([
    { id: '1', name: 'Option A', price: '4.99', weight: '450', unit: 'g' },
    { id: '2', name: 'Option B', price: '10.50', weight: '1.2', unit: 'kg' },
  ]);

  const addPackage = () => {
    if (packages.length >= 5) return;
    const nextLetter = String.fromCharCode(65 + packages.length);
    setPackages([
      ...packages,
      {
        id: Date.now().toString(),
        name: `Option ${nextLetter}`,
        price: '',
        weight: '',
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
      { id: '1', name: 'Option A', price: '', weight: '', unit: 'g' },
      { id: '2', name: 'Option B', price: '', weight: '', unit: 'g' },
    ]);
  };

  const analyzed = packages.map((pkg) => {
    const p = parseFloat(pkg.price) || 0;
    const w = parseFloat(pkg.weight) || 0;
    const unitObj = WEIGHT_UNITS.find((u) => u.id === pkg.unit) || WEIGHT_UNITS[1];
    const totalGrams = w * unitObj.gramsPerUnit;
    const pricePerGram = totalGrams > 0 ? p / totalGrams : Infinity;
    const pricePerKg = pricePerGram * 1000;
    return {
      ...pkg,
      parsedPrice: p,
      parsedWeight: w,
      totalGrams,
      pricePerKg,
    };
  });

  const validItems = analyzed.filter((item) => item.totalGrams > 0 && item.parsedPrice > 0);
  const bestItem = validItems.reduce((min, curr) => {
    if (!min) return curr;
    return curr.pricePerKg < min.pricePerKg ? curr : min;
  }, null as (typeof analyzed)[0] | null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
          Compare package unit rates side-by-side
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-medium text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Clear
          </button>
          <button
            type="button"
            onClick={addPackage}
            disabled={packages.length >= 5}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-full bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 disabled:opacity-30 flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Package
          </button>
        </div>
      </div>

      {/* Package Items in Material 3 Containers with Purple Accent */}
      <div className="space-y-3">
        {analyzed.map((item) => {
          const isBest = bestItem?.id === item.id && validItems.length > 1;

          return (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all ${
                isBest
                  ? 'bg-purple-50/50 dark:bg-purple-950/20 border-purple-300 dark:border-purple-800 shadow-xs'
                  : 'bg-white dark:bg-neutral-900 border-neutral-200/90 dark:border-neutral-800 shadow-2xs'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 flex-1">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updatePackage(item.id, 'name', e.target.value)}
                    className="w-24 text-xs font-semibold bg-transparent text-neutral-900 dark:text-neutral-100 border-b border-neutral-300 dark:border-neutral-700 pb-0.5 focus:outline-hidden"
                  />

                  {/* Price */}
                  <div className="relative w-28">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs font-mono font-semibold">
                      {currency.symbol}
                    </span>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={item.price}
                      onChange={(e) => updatePackage(item.id, 'price', e.target.value)}
                      placeholder="Price"
                      className="w-full pl-7 pr-2.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-xs font-mono text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-1 focus:ring-purple-500"
                    />
                  </div>

                  {/* Weight */}
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={item.weight}
                      onChange={(e) => updatePackage(item.id, 'weight', e.target.value)}
                      placeholder="Weight"
                      className="w-20 px-2.5 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-xs font-mono text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-1 focus:ring-purple-500"
                    />
                    <select
                      value={item.unit}
                      onChange={(e) => updatePackage(item.id, 'unit', e.target.value)}
                      className="py-2 px-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-neutral-100 focus:outline-hidden"
                    >
                      {WEIGHT_UNITS.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.symbol}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Rate */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <div className="text-right">
                    <span className={`text-sm font-bold font-mono ${isBest ? 'text-purple-700 dark:text-purple-400' : 'text-neutral-900 dark:text-neutral-100'}`}>
                      {item.pricePerKg < 999999 && item.pricePerKg > 0
                        ? `${currency.symbol}${item.pricePerKg.toFixed(2)}/kg`
                        : '--'}
                    </span>
                    {isBest && (
                      <span className="text-[10px] text-purple-700 dark:text-purple-400 block font-semibold">
                        Cheapest
                      </span>
                    )}
                  </div>

                  {packages.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removePackage(item.id)}
                      className="text-neutral-400 hover:text-red-500 p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
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
  );
};
