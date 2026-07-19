import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import LlmCostCalculator from '../LlmCostCalculator';
import './testUtils';

describe('remaining mobile tool contract', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 375 });
    Object.defineProperty(navigator, 'maxTouchPoints', { configurable: true, value: 1 });
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('max-width') || query.includes('pointer: coarse'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('keeps the LLM cost input named and operable at a mobile viewport', () => {
    render(<LlmCostCalculator />);

    const input = screen.getByRole('textbox', { name: '입력 텍스트 (Input)' });
    input.focus();

    expect(input).toHaveFocus();
  });
});
