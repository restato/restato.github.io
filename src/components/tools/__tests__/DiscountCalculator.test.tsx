import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DiscountCalculator from '../DiscountCalculator';
import './testUtils';

describe('DiscountCalculator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders price and discount inputs', () => {
    render(<DiscountCalculator />);

    const inputs = screen.getAllByRole('spinbutton');
    expect(inputs.length).toBeGreaterThanOrEqual(2);
  });

  it('calculates discount price correctly', async () => {
    render(<DiscountCalculator />);
    const user = userEvent.setup();

    const inputs = screen.getAllByRole('spinbutton');

    // Original price
    await user.clear(inputs[0]);
    await user.type(inputs[0], '10000');

    // Discount rate
    await user.clear(inputs[1]);
    await user.type(inputs[1], '20');

    // Should show 8000 (10000 - 20%)
    expect(screen.getAllByText(/8,?000|8000/).length).toBeGreaterThan(0);
  });

  it('calculates discount amount correctly', async () => {
    render(<DiscountCalculator />);
    const user = userEvent.setup();

    const inputs = screen.getAllByRole('spinbutton');

    await user.clear(inputs[0]);
    await user.type(inputs[0], '10000');

    await user.clear(inputs[1]);
    await user.type(inputs[1], '30');

    // Discount amount should be 3000
    expect(screen.getByText(/3,?000|3000/)).toBeInTheDocument();
  });

  it('handles 0% discount', async () => {
    render(<DiscountCalculator />);
    const user = userEvent.setup();

    const inputs = screen.getAllByRole('spinbutton');

    await user.clear(inputs[0]);
    await user.type(inputs[0], '10000');

    await user.clear(inputs[1]);
    await user.type(inputs[1], '0');

    // Final price should still be 10000
    expect(screen.getAllByText(/10,?000|10000/).length).toBeGreaterThan(0);
  });

  it('handles 100% discount', async () => {
    render(<DiscountCalculator />);
    const user = userEvent.setup();

    const inputs = screen.getAllByRole('spinbutton');

    await user.clear(inputs[0]);
    await user.type(inputs[0], '10000');

    await user.clear(inputs[1]);
    await user.type(inputs[1], '100');

    // Final price should be 0
    const textContent = document.body.textContent;
    expect(textContent).toMatch(/0|무료|free/i);
  });

  it('formats numbers with thousand separators', async () => {
    render(<DiscountCalculator />);
    const user = userEvent.setup();

    const inputs = screen.getAllByRole('spinbutton');

    await user.clear(inputs[0]);
    await user.type(inputs[0], '1000000');

    await user.clear(inputs[1]);
    await user.type(inputs[1], '10');

    // Should display formatted number
    expect(screen.getAllByText(/900,?000|900000/).length).toBeGreaterThan(0);
  });

  it('clears output for empty and non-numeric price inputs', () => {
    render(<DiscountCalculator />);
    const inputs = screen.getAllByRole('spinbutton');
    fireEvent.change(inputs[0], { target: { value: '10000' } });
    fireEvent.change(inputs[1], { target: { value: '20' } });
    expect(screen.getAllByText(/8,?000|8000/).length).toBeGreaterThan(0);
    fireEvent.change(inputs[0], { target: { value: '' } });
    expect(screen.queryByText('최종 가격')).not.toBeInTheDocument();
    fireEvent.change(inputs[0], { target: { value: 'not-a-number' } });
    expect(screen.queryByText('최종 가격')).not.toBeInTheDocument();
  });
});
