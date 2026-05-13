import type { BudgetRange } from '@/types';

/**
 * Truncates a title to the specified max length, appending an ellipsis if truncated.
 * If the title is at or below maxLength, it is returned unchanged.
 */
export function truncateTitle(title: string, maxLength: number = 80): string {
  if (title.length <= maxLength) {
    return title;
  }
  return title.slice(0, maxLength) + '…';
}

/**
 * Formats a number with comma separators (e.g., 1234567 → "1,234,567").
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

/**
 * Converts a BudgetRange enum value to a human-readable display string.
 */
export function formatCurrency(range: BudgetRange): string {
  const displayMap: Record<BudgetRange, string> = {
    under_500: 'Under $500',
    '500_1000': '$500 – $1,000',
    '1000_5000': '$1,000 – $5,000',
    '5000_10000': '$5,000 – $10,000',
    over_10000: 'Over $10,000',
  };
  return displayMap[range];
}
