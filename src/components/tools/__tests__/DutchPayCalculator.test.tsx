import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DutchPayCalculator from '../DutchPayCalculator';
import './testUtils';

describe('DutchPayCalculator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders total amount input and quick people-count controls', () => {
    render(<DutchPayCalculator />);

    const inputs = screen.getAllByRole('spinbutton');
    expect(inputs).toHaveLength(1);
    expect(screen.getByRole('button', { name: '3명' })).toBeInTheDocument();
  });

  it('calculates equal split correctly', async () => {
    render(<DutchPayCalculator />);
    const user = userEvent.setup();

    const inputs = screen.getAllByRole('spinbutton');

    // Total amount
    await user.clear(inputs[0]);
    await user.type(inputs[0], '30000');

    await user.click(screen.getByRole('button', { name: '3명' }));

    // Each person should pay 10000
    expect(screen.getByText(/10,?000|10000/)).toBeInTheDocument();
  });

  it('handles uneven splits (with remainder)', async () => {
    render(<DutchPayCalculator />);
    const user = userEvent.setup();

    const inputs = screen.getAllByRole('spinbutton');

    await user.clear(inputs[0]);
    await user.type(inputs[0], '10000');

    await user.click(screen.getByRole('button', { name: '3명' }));

    // The quick display rounds each share up so the total is fully covered.
    const textContent = document.body.textContent;
    expect(textContent).toMatch(/3,?334|3334/);
  });

  it('uses the default two-person split when no quick-count control is selected', async () => {
    render(<DutchPayCalculator />);
    const user = userEvent.setup();

    const inputs = screen.getAllByRole('spinbutton');

    await user.clear(inputs[0]);
    await user.type(inputs[0], '50000');

    // The quick controls intentionally support two or more participants.
    expect(screen.getByText(/25,?000|25000/)).toBeInTheDocument();
  });

  it('handles large amounts correctly', async () => {
    render(<DutchPayCalculator />);
    const user = userEvent.setup();

    const inputs = screen.getAllByRole('spinbutton');

    await user.clear(inputs[0]);
    await user.type(inputs[0], '1000000');

    await user.click(screen.getByRole('button', { name: '4명' }));

    // 1000000 / 4 = 250000
    expect(screen.getByText(/250,?000|250000/)).toBeInTheDocument();
  });

  it('handles zero amount gracefully', async () => {
    render(<DutchPayCalculator />);
    const user = userEvent.setup();

    const inputs = screen.getAllByRole('spinbutton');

    await user.clear(inputs[0]);
    await user.type(inputs[0], '0');

    await user.click(screen.getByRole('button', { name: '5명' }));

    // Should show 0 per person
    const textContent = document.body.textContent;
    expect(textContent).toMatch(/0|무료/);
  });
});
