import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import DiscountCalculator from '../DiscountCalculator';
import PercentCalculator from '../PercentCalculator';
import RegexTester from '../RegexTester';
import UnitConverter from '../UnitConverter';
import './testUtils';

function expectSelected(button: HTMLElement) {
  expect(button).toHaveAttribute('aria-pressed', 'true');
  expect(button).toHaveClass('fc-button-primary');
  expect(button).not.toHaveClass('fc-button-secondary');
}

describe('tool option selected-state contract', () => {
  it('moves the primary treatment to a non-first unit category', () => {
    render(<UnitConverter />);
    const weight = screen.getByRole('button', { name: '무게' });
    fireEvent.click(weight);
    expectSelected(weight);
    expect(screen.getByRole('button', { name: '길이' })).toHaveClass('fc-button-secondary');
  });

  it('moves the primary treatment to a non-first regex flag', () => {
    render(<RegexTester />);
    const ignoreCase = screen.getByRole('button', { name: 'Ignore case (i)' });
    fireEvent.click(ignoreCase);
    expectSelected(ignoreCase);
  });

  it('moves the primary treatment to a non-first percent mode', () => {
    render(<PercentCalculator />);
    const percentOf = screen.getByRole('button', { name: 'B의 A%는?' });
    fireEvent.click(percentOf);
    expectSelected(percentOf);
    expect(screen.getByRole('button', { name: 'A는 B의 몇 %?' })).toHaveClass('fc-button-secondary');
  });

  it('moves the primary treatment to a non-first discount preset', () => {
    render(<DiscountCalculator />);
    const seventy = screen.getAllByRole('button', { name: /70%/ })[0];
    fireEvent.click(seventy);
    expectSelected(seventy);
    expect(screen.getAllByRole('button', { name: /^5%$/ })[0]).toHaveClass('fc-button-secondary');
  });
});
