import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DutchPayCalculator from '../DutchPayCalculator';
import './testUtils';

describe('DutchPayCalculator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders total amount and people count inputs', () => {
    render(<DutchPayCalculator />);

    const inputs = screen.getAllByRole('spinbutton');
    expect(inputs.length).toBeGreaterThanOrEqual(2);
  });

  it('calculates equal split correctly', async () => {
    render(<DutchPayCalculator />);
    const user = userEvent.setup();

    const inputs = screen.getAllByRole('spinbutton');

    // Total amount
    await user.clear(inputs[0]);
    await user.type(inputs[0], '30000');

    // Number of people
    await user.clear(inputs[1]);
    await user.type(inputs[1], '3');

    // Each person should pay 10000
    expect(screen.getByText(/10,?000|10000/)).toBeInTheDocument();
  });

  it('handles uneven splits (with remainder)', async () => {
    render(<DutchPayCalculator />);
    const user = userEvent.setup();

    const inputs = screen.getAllByRole('spinbutton');

    await user.clear(inputs[0]);
    await user.type(inputs[0], '10000');

    await user.clear(inputs[1]);
    await user.type(inputs[1], '3');

    // 10000 / 3 = ~3333.33
    // Should show some indication of the split
    const textContent = document.body.textContent;
    expect(textContent).toMatch(/3,?333|3333/);
  });

  it('handles single person (no split needed)', async () => {
    render(<DutchPayCalculator />);
    const user = userEvent.setup();

    const inputs = screen.getAllByRole('spinbutton');

    await user.clear(inputs[0]);
    await user.type(inputs[0], '50000');

    await user.clear(inputs[1]);
    await user.type(inputs[1], '1');

    // Single person pays the full amount
    expect(screen.getByText(/50,?000|50000/)).toBeInTheDocument();
  });

  it('handles large amounts correctly', async () => {
    render(<DutchPayCalculator />);
    const user = userEvent.setup();

    const inputs = screen.getAllByRole('spinbutton');

    await user.clear(inputs[0]);
    await user.type(inputs[0], '1000000');

    await user.clear(inputs[1]);
    await user.type(inputs[1], '4');

    // 1000000 / 4 = 250000
    expect(screen.getByText(/250,?000|250000/)).toBeInTheDocument();
  });

  it('handles zero amount gracefully', async () => {
    render(<DutchPayCalculator />);
    const user = userEvent.setup();

    const inputs = screen.getAllByRole('spinbutton');

    await user.clear(inputs[0]);
    await user.type(inputs[0], '0');

    await user.clear(inputs[1]);
    await user.type(inputs[1], '5');

    // Should show 0 per person
    const textContent = document.body.textContent;
    expect(textContent).toMatch(/0|무료/);
  });
});
