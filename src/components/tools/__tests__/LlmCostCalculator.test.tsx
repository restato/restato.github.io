import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import LlmCostCalculator from '../LLMCostCalculator';
import './testUtils';

describe('LlmCostCalculator', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      json: async () => ({ result: 'success', rates: { KRW: 1400, JPY: 150, EUR: 0.9 } }),
    }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('estimates empty, non-Latin, and updated text token inputs for model costs', async () => {
    render(<LlmCostCalculator />);
    await waitFor(() => expect(fetch).toHaveBeenCalledWith('https://open.er-api.com/v6/latest/USD'));
    const [input, output] = screen.getAllByRole('textbox');

    expect(screen.getAllByText('≈ 0 토큰 (추정)')).toHaveLength(2);
    fireEvent.change(input, { target: { value: '안녕하세요' } });
    fireEvent.change(output, { target: { value: 'hello' } });

    expect(screen.getByText('≈ 3 토큰 (추정)')).toBeInTheDocument();
    expect(screen.getByText('≈ 2 토큰 (추정)')).toBeInTheDocument();
    expect(screen.getAllByText('GPT-4o')).toHaveLength(2);

    fireEvent.change(input, { target: { value: '안녕' } });
    expect(screen.getByText('≈ 1 토큰 (추정)')).toBeInTheDocument();
  }, 15_000);
});
