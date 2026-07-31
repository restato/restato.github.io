import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import AgeCalculator from '../AgeCalculator';
import './testUtils';

describe('AgeCalculator local calendar dates', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 2, 21, 12));
  });

  afterEach(() => vi.useRealTimers());

  it('keeps a date-only birthday on its local zodiac boundary', () => {
    const { container } = render(<AgeCalculator />);

    fireEvent.change(screen.getByLabelText('생년월일'), { target: { value: '2000-03-21' } });

    expect(screen.getByText('양자리')).toBeInTheDocument();
    expect(container.querySelector('.fc-tool-result-success')).toHaveAttribute('role', 'status');
  });

  it('does not calculate a future local-calendar birthday', () => {
    render(<AgeCalculator />);

    fireEvent.change(screen.getByLabelText('생년월일'), { target: { value: '2026-03-22' } });

    expect(screen.queryByText(/세$/)).not.toBeInTheDocument();
  });
});
