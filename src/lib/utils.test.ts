import { describe, it, expect } from 'vitest';
import { truncateTitle, formatNumber, formatCurrency } from './utils';
import type { BudgetRange } from '@/types';

describe('truncateTitle', () => {
  it('returns the title unchanged when it is 80 characters or fewer', () => {
    const title = 'A'.repeat(80);
    expect(truncateTitle(title)).toBe(title);
  });

  it('truncates to 80 characters with ellipsis when title exceeds 80 characters', () => {
    const title = 'B'.repeat(100);
    const result = truncateTitle(title);
    expect(result).toBe('B'.repeat(80) + '…');
    expect(result.length).toBe(81); // 80 chars + 1 ellipsis character
  });

  it('returns an empty string unchanged', () => {
    expect(truncateTitle('')).toBe('');
  });

  it('respects a custom maxLength parameter', () => {
    const title = 'Hello World';
    expect(truncateTitle(title, 5)).toBe('Hello…');
  });

  it('does not truncate when title length equals maxLength exactly', () => {
    const title = 'Exact';
    expect(truncateTitle(title, 5)).toBe('Exact');
  });
});

describe('formatNumber', () => {
  it('formats a large number with commas', () => {
    expect(formatNumber(1234567)).toBe('1,234,567');
  });

  it('does not add commas for numbers under 1000', () => {
    expect(formatNumber(999)).toBe('999');
  });

  it('formats zero', () => {
    expect(formatNumber(0)).toBe('0');
  });

  it('formats a number in the thousands', () => {
    expect(formatNumber(1000)).toBe('1,000');
  });
});

describe('formatCurrency', () => {
  it('maps all budget ranges to display strings', () => {
    const cases: [BudgetRange, string][] = [
      ['under_500', 'Under $500'],
      ['500_1000', '$500 – $1,000'],
      ['1000_5000', '$1,000 – $5,000'],
      ['5000_10000', '$5,000 – $10,000'],
      ['over_10000', 'Over $10,000'],
    ];

    for (const [input, expected] of cases) {
      expect(formatCurrency(input)).toBe(expected);
    }
  });
});
