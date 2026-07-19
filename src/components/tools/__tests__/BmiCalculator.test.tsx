import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BmiCalculator from '../BmiCalculator';
import './testUtils';

describe('BmiCalculator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders height and weight inputs', () => {
    render(<BmiCalculator />);

    // Should have inputs for height and weight
    const inputs = screen.getAllByRole('spinbutton');
    expect(inputs.length).toBeGreaterThanOrEqual(2);
  });

  it('calculates BMI correctly', async () => {
    render(<BmiCalculator />);
    const user = userEvent.setup();

    const inputs = screen.getAllByRole('spinbutton');
    const heightInput = inputs[0];
    const weightInput = inputs[1];

    await user.clear(heightInput);
    await user.type(heightInput, '170');

    await user.clear(weightInput);
    await user.type(weightInput, '70');
    await user.click(screen.getByRole('button', { name: 'BMI 계산하기' }));

    // BMI = 70 / (1.7)^2 = ~24.22
    expect(screen.getByText('24.2')).toBeInTheDocument();
  });

  it('shows BMI category (normal, overweight, etc.)', async () => {
    render(<BmiCalculator />);
    const user = userEvent.setup();

    const inputs = screen.getAllByRole('spinbutton');
    const heightInput = inputs[0];
    const weightInput = inputs[1];

    await user.clear(heightInput);
    await user.type(heightInput, '170');

    await user.clear(weightInput);
    await user.type(weightInput, '70');
    await user.click(screen.getByRole('button', { name: 'BMI 계산하기' }));

    expect(screen.getAllByText('과체중')).toHaveLength(2);
  });

  it('handles underweight BMI', async () => {
    render(<BmiCalculator />);
    const user = userEvent.setup();

    const inputs = screen.getAllByRole('spinbutton');
    const heightInput = inputs[0];
    const weightInput = inputs[1];

    await user.clear(heightInput);
    await user.type(heightInput, '180');

    await user.clear(weightInput);
    await user.type(weightInput, '50');
    await user.click(screen.getByRole('button', { name: 'BMI 계산하기' }));

    // BMI = 50 / (1.8)^2 = ~15.43 (underweight)
    expect(screen.getByText('15.4')).toBeInTheDocument();
  });

  it('handles obese BMI', async () => {
    render(<BmiCalculator />);
    const user = userEvent.setup();

    const inputs = screen.getAllByRole('spinbutton');
    const heightInput = inputs[0];
    const weightInput = inputs[1];

    await user.clear(heightInput);
    await user.type(heightInput, '160');

    await user.clear(weightInput);
    await user.type(weightInput, '100');
    await user.click(screen.getByRole('button', { name: 'BMI 계산하기' }));

    // BMI = 100 / (1.6)^2 = ~39.06 (obese)
    expect(screen.getByText('39.1')).toBeInTheDocument();
  });

  it('handles empty inputs gracefully', () => {
    render(<BmiCalculator />);

    // Should not crash with empty inputs
    expect(screen.getAllByRole('spinbutton').length).toBeGreaterThan(0);
  });

  it('suppresses BMI results for empty and invalid dimensions', () => {
    render(<BmiCalculator />);
    const inputs = screen.getAllByRole('spinbutton');
    fireEvent.change(inputs[0], { target: { value: '170' } });
    fireEvent.change(inputs[1], { target: { value: '70' } });
    fireEvent.click(screen.getByRole('button', { name: 'BMI 계산하기' }));
    expect(screen.getByText('24.2')).toBeInTheDocument();
    fireEvent.change(inputs[1], { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: 'BMI 계산하기' }));
    expect(screen.queryByText('24.2')).not.toBeInTheDocument();
    fireEvent.change(inputs[1], { target: { value: '-1' } });
    fireEvent.click(screen.getByRole('button', { name: 'BMI 계산하기' }));
    expect(screen.queryByText('24.2')).not.toBeInTheDocument();
  });
});
