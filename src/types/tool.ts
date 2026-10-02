import { ComponentType } from 'react';

export type ToolCategory = 'pricing' | 'units' | 'math' | 'kitchen';

export interface ToolMetadata {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  category: ToolCategory;
  keywords: string[];
  icon: string;
  status: 'active' | 'planned';
  version: string;
  lastUpdated: string;
}

export interface ToolDefinition extends ToolMetadata {
  component: ComponentType<{ onNavigate?: (slug: string) => void }>;
}

export interface WeightUnit {
  id: string;
  name: string;
  symbol: string;
  gramsPerUnit: number;
}

export const WEIGHT_UNITS: WeightUnit[] = [
  { id: 'kg', name: 'Kilograms', symbol: 'kg', gramsPerUnit: 1000 },
  { id: 'g', name: 'Grams', symbol: 'g', gramsPerUnit: 1 },
  { id: 'mg', name: 'Milligrams', symbol: 'mg', gramsPerUnit: 0.001 },
  { id: 'lb', name: 'Pounds', symbol: 'lb', gramsPerUnit: 453.59237 },
  { id: 'oz', name: 'Ounces', symbol: 'oz', gramsPerUnit: 28.349523125 },
  { id: 't', name: 'Metric Tonnes', symbol: 't', gramsPerUnit: 1000000 },
];

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export const POPULAR_CURRENCIES: Currency[] = [
  { code: 'EUR', symbol: '€', name: 'Euro (€)' },
  { code: 'USD', symbol: '$', name: 'US Dollar ($)' },
  { code: 'GBP', symbol: '£', name: 'British Pound (£)' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc (CHF)' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar (CA$)' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar (A$)' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen (¥)' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee (₹)' },
];
