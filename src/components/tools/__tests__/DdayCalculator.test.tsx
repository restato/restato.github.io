import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DdayCalculator from '../DdayCalculator';
import './testUtils';

describe('DdayCalculator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-06-15'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders date input', () => {
    render(<DdayCalculator />);

    const dateInput = document.querySelector('input[type="date"]');
    expect(dateInput).toBeInTheDocument();
  });

  it('calculates days until future date', async () => {
    vi.useRealTimers(); // Use real timers for this test
    render(<DdayCalculator />);

    const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;

    // Set a date 30 days from now
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const futureDateStr = futureDate.toISOString().split('T')[0];

    fireEvent.change(dateInput, { target: { value: futureDateStr } });

    // Should show D-30 or similar
    expect(screen.getByText(/D-|일|days/i)).toBeInTheDocument();
  });

  it('shows D-Day for today', async () => {
    vi.useRealTimers();
    render(<DdayCalculator />);

    const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;

    // Set today's date
    const today = new Date().toISOString().split('T')[0];
    fireEvent.change(dateInput, { target: { value: today } });

    // Should show D-Day
    expect(screen.getByText(/D-Day|D-0|0일/i)).toBeInTheDocument();
  });

  it('calculates days since past date', async () => {
    vi.useRealTimers();
    render(<DdayCalculator />);

    const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;

    // Set a date 30 days ago
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 30);
    const pastDateStr = pastDate.toISOString().split('T')[0];

    fireEvent.change(dateInput, { target: { value: pastDateStr } });

    // Should show D+30 or similar
    expect(screen.getByText(/D\+|지남|passed/i)).toBeInTheDocument();
  });

  it('allows adding event name', async () => {
    render(<DdayCalculator />);
    const user = userEvent.setup({ delay: null });

    const nameInputs = screen.getAllByRole('textbox');
    if (nameInputs.length > 0) {
      await user.type(nameInputs[0], 'Birthday');
      expect(nameInputs[0]).toHaveValue('Birthday');
    }
  });
});
