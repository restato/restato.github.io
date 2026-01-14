import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
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

    // BMI = 70 / (1.7)^2 = ~24.22
    expect(screen.getByText(/24\.[0-9]/)).toBeInTheDocument();
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

    // Should show BMI category (정상, 과체중, etc.)
    expect(screen.getByText(/정상|과체중|저체중|비만|normal|overweight/i)).toBeInTheDocument();
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

    // BMI = 50 / (1.8)^2 = ~15.43 (underweight)
    expect(screen.getByText(/15\.[0-9]/)).toBeInTheDocument();
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

    // BMI = 100 / (1.6)^2 = ~39.06 (obese)
    expect(screen.getByText(/39\.[0-9]|비만|obese/i)).toBeInTheDocument();
  });

  it('handles empty inputs gracefully', () => {
    render(<BmiCalculator />);

    // Should not crash with empty inputs
    expect(screen.getAllByRole('spinbutton').length).toBeGreaterThan(0);
  });
});
