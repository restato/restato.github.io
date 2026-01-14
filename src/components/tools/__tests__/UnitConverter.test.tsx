import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UnitConverter from '../UnitConverter';
import './testUtils';

describe('UnitConverter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders category tabs', () => {
    render(<UnitConverter />);

    expect(screen.getByText('길이')).toBeInTheDocument();
    expect(screen.getByText('무게')).toBeInTheDocument();
    expect(screen.getByText('온도')).toBeInTheDocument();
    expect(screen.getByText('넓이')).toBeInTheDocument();
    expect(screen.getByText('부피')).toBeInTheDocument();
  });

  it('converts meters to feet correctly', () => {
    render(<UnitConverter />);

    // Default is 1 meter to feet
    const outputs = screen.getAllByRole('textbox');
    const resultInput = outputs[1];

    // 1 meter = ~3.28084 feet
    expect(parseFloat(resultInput.getAttribute('value') || '0')).toBeCloseTo(3.28084, 2);
  });

  it('updates result when input changes', async () => {
    render(<UnitConverter />);
    const user = userEvent.setup();

    const input = screen.getByRole('spinbutton');
    await user.clear(input);
    await user.type(input, '10');

    const outputs = screen.getAllByRole('textbox');
    const resultInput = outputs[1];

    // 10 meters = ~32.8084 feet
    expect(parseFloat(resultInput.getAttribute('value') || '0')).toBeCloseTo(32.8084, 1);
  });

  it('switches categories correctly', async () => {
    render(<UnitConverter />);
    const user = userEvent.setup();

    await user.click(screen.getByText('무게'));

    // Should show weight units
    expect(screen.getAllByText(/킬로그램|그램|파운드/).length).toBeGreaterThan(0);
  });

  it('converts temperature correctly (Celsius to Fahrenheit)', async () => {
    render(<UnitConverter />);
    const user = userEvent.setup();

    await user.click(screen.getByText('온도'));

    const input = screen.getByRole('spinbutton');
    await user.clear(input);
    await user.type(input, '0');

    // Select Celsius to Fahrenheit
    const selects = screen.getAllByRole('combobox');
    await user.selectOptions(selects[0], 'celsius');
    await user.selectOptions(selects[1], 'fahrenheit');

    const outputs = screen.getAllByRole('textbox');
    const resultInput = outputs[1];

    // 0°C = 32°F
    expect(parseFloat(resultInput.getAttribute('value') || '0')).toBeCloseTo(32, 0);
  });

  it('converts Korean pyeong to square meters', async () => {
    render(<UnitConverter />);
    const user = userEvent.setup();

    await user.click(screen.getByText('넓이'));

    const selects = screen.getAllByRole('combobox');
    await user.selectOptions(selects[0], 'pyeong');
    await user.selectOptions(selects[1], 'sqm');

    const input = screen.getByRole('spinbutton');
    await user.clear(input);
    await user.type(input, '1');

    const outputs = screen.getAllByRole('textbox');
    const resultInput = outputs[1];

    // 1 평 = ~3.306 m²
    expect(parseFloat(resultInput.getAttribute('value') || '0')).toBeCloseTo(3.306, 2);
  });

  it('swaps units when swap button is clicked', async () => {
    render(<UnitConverter />);
    const user = userEvent.setup();

    const selects = screen.getAllByRole('combobox');
    const fromUnit = selects[0].getAttribute('value');
    const toUnit = selects[1].getAttribute('value');

    // Find and click swap button
    const buttons = screen.getAllByRole('button');
    const swapBtn = buttons.find(btn => btn.querySelector('svg'));

    if (swapBtn) {
      await user.click(swapBtn);

      // Units should be swapped
      expect(selects[0]).toHaveValue(toUnit);
      expect(selects[1]).toHaveValue(fromUnit);
    }
  });

  it('handles very small numbers with exponential notation', async () => {
    render(<UnitConverter />);
    const user = userEvent.setup();

    const input = screen.getByRole('spinbutton');
    await user.clear(input);
    await user.type(input, '0.0000001');

    const outputs = screen.getAllByRole('textbox');
    const resultInput = outputs[1];
    const value = resultInput.getAttribute('value') || '';

    // Should use exponential notation for very small numbers
    expect(value).toMatch(/e|E|-/);
  });

  it('handles empty input gracefully', async () => {
    render(<UnitConverter />);
    const user = userEvent.setup();

    const input = screen.getByRole('spinbutton');
    await user.clear(input);

    const outputs = screen.getAllByRole('textbox');
    const resultInput = outputs[1];

    expect(resultInput).toHaveValue('');
  });
});
