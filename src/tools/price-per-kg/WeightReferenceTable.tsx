import React, { useState } from 'react';
import { Currency } from '../../types/tool';

interface WeightReferenceTableProps {
  currency: Currency;
  initialPricePerKg?: number;
}

const COMMON_STEPS = [
  { label: '50 g', grams: 50 },
  { label: '100 g', grams: 100 },
  { label: '150 g', grams: 150 },
  { label: '200 g', grams: 200 },
  { label: '250 g (1/4 kg)', grams: 250 },
  { label: '350 g', grams: 350 },
  { label: '500 g (1/2 kg)', grams: 500 },
  { label: '750 g (3/4 kg)', grams: 750 },
  { label: '1.0 kg', grams: 1000 },
  { label: '1.5 kg', grams: 1500 },
  { label: '2.0 kg', grams: 2000 },
  { label: '5.0 kg', grams: 5000 },
];

export const WeightReferenceTable: React.FC<WeightReferenceTableProps> = ({
  currency,
  initialPricePerKg = 15.0,
}) => {
  const [rate, setRate] = useState<string>(initialPricePerKg.toString());

  const parsedRate = parseFloat(rate) || 0;
  const pricePerGram = parsedRate / 1000;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block mb-1">
            Live Quick Reference Matrix
          </span>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            Instant cost estimates for standard butcher, deli, produce, and bulk portions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-neutral-500">Rate:</span>
          <div className="relative w-36">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-xs">
              {currency.symbol}
            </span>
            <input
              type="number"
              step="any"
              min="0"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="0.00"
              aria-label="Price per kg for reference table"
              className="w-full pl-6 pr-2 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-md text-xs font-mono text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-emerald-500"
            />
          </div>
          <span className="text-xs font-mono text-neutral-400">/kg</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 dark:text-neutral-400 font-medium">
              <th className="py-2.5 px-4 font-semibold">Portion Weight</th>
              <th className="py-2.5 px-4 font-semibold text-right">Calculated Cost</th>
              <th className="py-2.5 px-4 font-semibold text-right">Cost in Ounces (approx)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-mono">
            {COMMON_STEPS.map((step) => {
              const cost = pricePerGram * step.grams;
              const ozEquivalent = step.grams / 28.3495;
              return (
                <tr
                  key={step.grams}
                  className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors"
                >
                  <td className="py-2 px-4 text-neutral-800 dark:text-neutral-200 font-sans font-medium">
                    {step.label}
                  </td>
                  <td className="py-2 px-4 text-right text-emerald-600 dark:text-emerald-400 font-semibold tabular-nums">
                    {currency.symbol}{cost.toFixed(2)}
                  </td>
                  <td className="py-2 px-4 text-right text-neutral-400 tabular-nums">
                    ~{ozEquivalent.toFixed(1)} oz
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
