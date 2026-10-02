import { ToolDefinition } from '../types/tool';
import { PricePerKgCalculator } from './price-per-kg';

/**
 * MINI TOOLS CENTRAL REGISTRY
 *
 * To add a new mini tool:
 * 1. Create a folder in `src/tools/<your-tool-name>/index.tsx`
 * 2. Implement your component
 * 3. Add one entry in this array below.
 */

export const TOOLS_REGISTRY: ToolDefinition[] = [
  {
    id: 'price-per-kg',
    slug: 'price-per-kg',
    name: 'Price per Kg & Weight Cost Calculator',
    shortDescription: 'Calculate unit prices per kg, total cost from weight, budget limits, and compare packages.',
    fullDescription: 'Essential grocery and market tool. Compute exact costs from price-per-kg rates, convert between grams, ounces, and pounds, and discover the best value package on shelf tags.',
    category: 'pricing',
    keywords: [
      'price',
      'kg',
      'kilo',
      'kilogram',
      'cost',
      'weight',
      'grocery',
      'gram',
      'pound',
      'ounce',
      'unit price',
      'cheapest',
      'compare',
      'budget',
    ],
    icon: 'Scale',
    status: 'active',
    version: '1.0.0',
    lastUpdated: '2026-10-01',
    component: PricePerKgCalculator,
  },
];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOLS_REGISTRY.find((t) => t.slug === slug);
}

export function searchAllTools(query: string): ToolDefinition[] {
  const q = query.toLowerCase().trim();
  if (!q) return TOOLS_REGISTRY;

  return TOOLS_REGISTRY.filter((item) => {
    return (
      item.name.toLowerCase().includes(q) ||
      item.shortDescription.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.keywords.some((k) => k.toLowerCase().includes(q))
    );
  });
}
