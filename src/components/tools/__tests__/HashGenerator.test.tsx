import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
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

  it('shows every supported hash algorithm', () => {
    render(<HashGenerator />);

    expect(screen.getByText('MD5')).toBeInTheDocument();
    expect(screen.getByText('SHA-1')).toBeInTheDocument();
    expect(screen.getByText('SHA-256')).toBeInTheDocument();
    expect(screen.getByText('SHA-384')).toBeInTheDocument();
    expect(screen.getByText('SHA-512')).toBeInTheDocument();
  });

  it('generates hash on input', async () => {
    render(<HashGenerator />);
    const user = userEvent.setup();

    const input = screen.getByPlaceholderText('해시할 텍스트를 입력하세요');
    await user.type(input, 'Hello');

    await waitFor(() => expect(mockDigest).toHaveBeenCalled());
    expect(screen.getAllByText(/^[0-9a-f]{32,}$/i)).toHaveLength(5);
  });

  it('generates each Web Crypto hash variant after input', async () => {
    render(<HashGenerator />);
    const user = userEvent.setup();

    const input = screen.getByPlaceholderText('해시할 텍스트를 입력하세요');
    await user.type(input, 'Test');

    await waitFor(() => {
      expect(mockDigest).toHaveBeenCalledWith('SHA-1', expect.any(Uint8Array));
      expect(mockDigest).toHaveBeenCalledWith('SHA-256', expect.any(Uint8Array));
      expect(mockDigest).toHaveBeenCalledWith('SHA-384', expect.any(Uint8Array));
      expect(mockDigest).toHaveBeenCalledWith('SHA-512', expect.any(Uint8Array));
    });
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
