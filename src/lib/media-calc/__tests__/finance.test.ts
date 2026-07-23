import { describe, expect, it } from 'vitest';
import { calculateCompoundInterest, calculateLoan } from '../finance';

describe('media-calc finance', () => {
  it('calculates an amortized monthly loan payment', () => {
    const result = calculateLoan(300_000, 6, 30);
    expect(result.monthlyPayment).toBeCloseTo(1798.65, 2);
    expect(result.totalInterest).toBeCloseTo(347_514.57, 2);
  });

  it('handles a zero-interest loan', () => {
    expect(calculateLoan(12_000, 0, 1).monthlyPayment).toBe(1000);
  });

  it('calculates compound growth with recurring monthly contributions', () => {
    const result = calculateCompoundInterest(10_000, 5, 10, 100);
    expect(result.futureValue).toBeCloseTo(31_998.32, 2);
    expect(result.contributions).toBe(22_000);
  });
});
