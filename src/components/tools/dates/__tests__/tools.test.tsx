import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import LunarSolarTool from '../LunarSolarTool';

const setDate = (year: string, month: string, day: string) => {
  fireEvent.change(screen.getByLabelText('Year'), { target: { value: year } });
  fireEvent.change(screen.getByLabelText('Month'), { target: { value: month } });
  fireEvent.change(screen.getByLabelText('Day'), { target: { value: day } });
};

describe('LunarSolarTool', () => {
  it('renders shared field controls', () => {
    render(<LunarSolarTool />);
    expect(screen.getByLabelText('Year')).toHaveClass('fc-input');
    expect(screen.getByLabelText('Year').closest('.fc-tool-field')).not.toBeNull();
    expect(screen.getByLabelText('Month')).toHaveClass('fc-input');
    expect(screen.getByLabelText('Day')).toHaveClass('fc-input');
  });

  it('converts a solar date to the lunar calendar with the gapja year', () => {
    render(<LunarSolarTool />);
    setDate('2025', '1', '29');
    const result = screen.getByTestId('lunar-solar-result');
    expect(result.textContent).toContain('Lunar 2025-01-01');
    expect(result.textContent).toContain('을사년');
  });

  it('labels leap months in solar-to-lunar results', () => {
    render(<LunarSolarTool />);
    setDate('2025', '7', '25');
    expect(screen.getByTestId('lunar-solar-result').textContent).toContain('leap month');
  });

  it('converts a lunar date back to the solar calendar', () => {
    render(<LunarSolarTool />);
    fireEvent.click(screen.getByRole('tab', { name: 'Lunar → Solar' }));
    setDate('2024', '8', '15');
    expect(screen.getByTestId('lunar-solar-result').textContent).toContain('Solar 2024-09-17');
  });

  it('supports leap-month input in lunar mode', () => {
    render(<LunarSolarTool />);
    fireEvent.click(screen.getByRole('tab', { name: 'Lunar → Solar' }));
    setDate('2025', '6', '1');
    fireEvent.click(screen.getByLabelText('Leap month'));
    expect(screen.getByTestId('lunar-solar-result').textContent).toContain('Solar 2025-07-25');
  });

  it('shows an error for dates the calendar cannot convert', () => {
    render(<LunarSolarTool />);
    setDate('2051', '1', '1');
    expect(screen.getByTestId('lunar-solar-result').textContent)
      .toContain('between the years 1000 and 2050');
  });
});
