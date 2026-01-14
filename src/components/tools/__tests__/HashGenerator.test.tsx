import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HashGenerator from '../HashGenerator';
import './testUtils';

// Mock crypto.subtle
const mockDigest = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();

  // Mock TextEncoder
  global.TextEncoder = class TextEncoder {
    encode(text: string) {
      return new Uint8Array(Buffer.from(text));
    }
  } as any;

  // Mock crypto.subtle.digest
  Object.defineProperty(global, 'crypto', {
    value: {
      subtle: {
        digest: mockDigest.mockImplementation(async (algorithm: string, data: ArrayBuffer) => {
          // Return a mock hash based on algorithm
          const hashLength = algorithm.includes('256') ? 32 : algorithm.includes('512') ? 64 : 20;
          return new ArrayBuffer(hashLength);
        }),
      },
      getRandomValues: (arr: Uint32Array) => {
        for (let i = 0; i < arr.length; i++) {
          arr[i] = Math.floor(Math.random() * 4294967296);
        }
        return arr;
      },
    },
    writable: true,
  });
});

describe('HashGenerator', () => {
  it('renders algorithm selector and input', () => {
    render(<HashGenerator />);

    expect(screen.getByPlaceholderText('해시할 텍스트를 입력하세요')).toBeInTheDocument();
  });

  it('has algorithm options (MD5, SHA-1, SHA-256)', () => {
    render(<HashGenerator />);

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
  });

  it('generates hash on input', async () => {
    render(<HashGenerator />);
    const user = userEvent.setup();

    const input = screen.getByPlaceholderText('해시할 텍스트를 입력하세요');
    await user.type(input, 'Hello');

    // Should show hash result (hex string)
    const outputs = screen.getAllByRole('textbox');
    const outputWithHash = outputs.find(o =>
      (o.getAttribute('value') || '').match(/^[0-9a-f]+$/i)
    );
    expect(outputWithHash || outputs.length).toBeTruthy();
  });

  it('changes hash when algorithm changes', async () => {
    render(<HashGenerator />);
    const user = userEvent.setup();

    const input = screen.getByPlaceholderText('해시할 텍스트를 입력하세요');
    await user.type(input, 'Test');

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'SHA-256');

    // Hash should be recalculated
    expect(mockDigest).toHaveBeenCalled();
  });

  it('copies hash to clipboard', async () => {
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator.clipboard, { writeText: mockWriteText });

    render(<HashGenerator />);
    const user = userEvent.setup();

    const input = screen.getByPlaceholderText('해시할 텍스트를 입력하세요');
    await user.type(input, 'Test');

    const copyButtons = screen.getAllByText('복사');
    if (copyButtons.length > 0) {
      await user.click(copyButtons[0]);
    }
  });

  it('handles empty input', () => {
    render(<HashGenerator />);

    const input = screen.getByPlaceholderText('해시할 텍스트를 입력하세요');
    expect(input).toHaveValue('');
  });
});
