import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import PercentCalculator from '../PercentCalculator';
import './testUtils';

describe('PercentCalculator', () => {
  it('does not present Infinity when the percentage denominator is zero', () => {
    render(<PercentCalculator />);
    const [value, base] = screen.getAllByRole('spinbutton');

    fireEvent.change(value, { target: { value: '10' } });
    fireEvent.change(base, { target: { value: '0' } });
    fireEvent.click(screen.getByRole('button', { name: '계산하기' }));

    expect(screen.queryByText(/Infinity|NaN/)).not.toBeInTheDocument();
  });
});
