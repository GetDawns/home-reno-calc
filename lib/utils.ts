import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatUSD(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(n);
}

export function round(n: number, decimals = 2): number {
  const m = Math.pow(10, decimals);
  return Math.round(n * m) / m;
}

export function pluralize(n: number, singular: string, plural?: string): string {
  return n === 1 ? singular : plural ?? `${singular}s`;
}
