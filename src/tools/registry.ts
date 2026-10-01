import { ToolDefinition, ToolMetadata } from '../types/tool';
import { PricePerKgCalculator } from './price-per-kg';

/**
 * MINI TOOLS CENTRAL REGISTRY
 *
 * Architecture Note for Easy Extension:
 * To add a new mini tool:
 * 1. Create a folder in `src/tools/<your-tool-name>/index.tsx`
 * 2. Implement the component (takes optional { onNavigate } prop)
 * 3. Add one entry in this array below!
 *
 * That's it! The hash router, command palette, search filter,
 * favorites system, and category views will automatically include it.
 */

export const TOOLS_REGISTRY: ToolDefinition[] = [
  {
    id: 'price-per-kg',
    slug: 'price-per-kg',
    name: 'Price per Kg & Weight Cost Calculator',
    shortDescription: 'Calculate costs by weight, normalize unit prices, find affordable quantities, and compare package deals.',
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

/**
 * Planned modular tools queued for addition to the hub.
 * These demonstrate the modular architecture for scaling as the number of tools grows.
 */
export const ROADMAP_TOOLS: ToolMetadata[] = [
  {
    id: 'unit-converter',
    slug: 'unit-converter',
    name: 'Universal Unit & Metric Converter',
    shortDescription: 'Instant bidirectional conversion between length, volume, temperature, and mass units.',
    fullDescription: 'High-precision metric and imperial unit conversions with live multi-unit comparison tables.',
    category: 'units',
    keywords: ['units', 'metric', 'imperial', 'length', 'volume', 'temperature', 'miles', 'kilometers', 'celsius', 'fahrenheit'],
    icon: 'ArrowRightLeft',
    status: 'planned',
    version: '1.0.0',
    lastUpdated: 'Upcoming',
  },
  {
    id: 'discount-tax',
    slug: 'discount-tax',
    name: 'Discount & Sales Tax Calculator',
    shortDescription: 'Calculate double discounts, clearance percentages, and regional sales tax in one step.',
    fullDescription: 'Fast shopping math: apply stacked coupons, VAT or sales tax rates, and final checkout totals.',
    category: 'pricing',
    keywords: ['discount', 'sale', 'percentage', 'tax', 'vat', 'shopping', 'coupon', 'savings'],
    icon: 'Receipt',
    status: 'planned',
    version: '1.0.0',
    lastUpdated: 'Upcoming',
  },
  {
    id: 'recipe-scaler',
    slug: 'recipe-scaler',
    name: 'Kitchen Recipe & Portion Scaler',
    shortDescription: 'Scale baking & cooking ingredient amounts by serving size or pan dimensions.',
    fullDescription: 'Multiply recipe ingredients, convert volumetric measurements (cups, tbsp) to precise weight grams.',
    category: 'kitchen',
    keywords: ['recipe', 'scale', 'baking', 'cook', 'portions', 'servings', 'grams', 'cups'],
    icon: 'ChefHat',
    status: 'planned',
    version: '1.0.0',
    lastUpdated: 'Upcoming',
  },
  {
    id: 'percentage-calculator',
    slug: 'percentage-calculator',
    name: 'Quick Percentage & Ratio Solver',
    shortDescription: 'Calculate X% of Y, percentage increase/decrease, margin vs markup, and ratios.',
    fullDescription: 'Solve any percentage question with four intuitive input modes and real-time visual representation.',
    category: 'math',
    keywords: ['percent', 'percentage', 'increase', 'decrease', 'margin', 'markup', 'ratio', 'math'],
    icon: 'Percent',
    status: 'planned',
    version: '1.0.0',
    lastUpdated: 'Upcoming',
  },
];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOLS_REGISTRY.find((t) => t.slug === slug);
}

export function searchAllTools(query: string): (ToolDefinition | ToolMetadata)[] {
  const q = query.toLowerCase().trim();
  if (!q) return [...TOOLS_REGISTRY, ...ROADMAP_TOOLS];

  const matches = (item: ToolMetadata) => {
    return (
      item.name.toLowerCase().includes(q) ||
      item.shortDescription.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.keywords.some((k) => k.toLowerCase().includes(q))
    );
  };

  const activeMatches = TOOLS_REGISTRY.filter(matches);
  const roadmapMatches = ROADMAP_TOOLS.filter(matches);

  return [...activeMatches, ...roadmapMatches];
}
