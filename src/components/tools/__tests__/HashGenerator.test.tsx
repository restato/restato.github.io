import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HashGenerator, { md5 } from '../HashGenerator';
import './testUtils';

// Mock crypto.subtle
const mockDigest = vi.fn();
const webCryptoVectors: Record<string, string> = {
  'SHA-1': '640ab2bae07bedc4c163f679a746f7ab7fb5d1fa',
  'SHA-256': '532eaabd9574880dbf76b9b8cc00832c20a6ec113d682299550d7a6e0f345e25',
  'SHA-384': '7b8f4654076b80eb963911f19cfad1aaf4285ed48e826f6cde1b01a79aa73fadb5446e667fc4f90417782c91270540f3',
  'SHA-512': 'c6ee9e33cf5c6715a1d148fd73f7318884b41adcb916021e2bc0e800a5c5dd97f5142178f6ae88c8fdd98e1afb0ce4c8d2c54b5f37b30b7da1997bb33b0b8a31',
};

function hexBuffer(hex: string): ArrayBuffer {
  return Uint8Array.from(hex.match(/../g)!.map((byte) => parseInt(byte, 16))).buffer;
}

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
          return hexBuffer(webCryptoVectors[algorithm] ?? '0000000000000000000000000000000000000000');
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

  it.each([
    ['', 'd41d8cd98f00b204e9800998ecf8427e'],
    ['Hello', '8b1a9953c4611296a827abf8c47804d7'],
    ['안녕하세요', '209bebae3eb7363d9b080a66f9e306ef'],
  ])('generates the standard MD5 vector for %j', (input, expected) => {
    expect(md5(input)).toBe(expected);
  });

  it('renders the standard MD5 value after repeated input', async () => {
    render(<HashGenerator />);
    const user = userEvent.setup();

    const input = screen.getByPlaceholderText('해시할 텍스트를 입력하세요');
    await user.type(input, 'Hello');
    await user.clear(input);
    await user.type(input, 'Hello');

    await waitFor(() => expect(mockDigest).toHaveBeenCalled());
    expect(screen.getByText('8b1a9953c4611296a827abf8c47804d7')).toBeInTheDocument();
  }, 30_000);

  it('generates each Web Crypto hash variant after input', async () => {
    render(<HashGenerator />);
    const input = screen.getByPlaceholderText('해시할 텍스트를 입력하세요');
    fireEvent.change(input, { target: { value: 'Test' } });

    await waitFor(() => {
      expect(mockDigest).toHaveBeenCalledWith('SHA-1', expect.any(Uint8Array));
      expect(mockDigest).toHaveBeenCalledWith('SHA-256', expect.any(Uint8Array));
      expect(mockDigest).toHaveBeenCalledWith('SHA-384', expect.any(Uint8Array));
      expect(mockDigest).toHaveBeenCalledWith('SHA-512', expect.any(Uint8Array));
    });

    expect(screen.getByText(webCryptoVectors['SHA-1'])).toBeInTheDocument();
    expect(screen.getByText(webCryptoVectors['SHA-256'])).toBeInTheDocument();
    expect(screen.getByText(webCryptoVectors['SHA-384'])).toBeInTheDocument();
    expect(screen.getByText(webCryptoVectors['SHA-512'])).toBeInTheDocument();
  });

  it('copies hash to clipboard', async () => {
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator.clipboard, { writeText: mockWriteText });

    render(<HashGenerator />);
    const user = userEvent.setup();

    const input = screen.getByPlaceholderText('해시할 텍스트를 입력하세요');
    await user.type(input, 'Test');

    await screen.findByText('0cbc6611f5540bd0809a388dc95a615b');

    const copyButtons = screen.getAllByText('복사');
    await user.click(copyButtons[0]);

    expect(mockWriteText).toHaveBeenCalledWith('0cbc6611f5540bd0809a388dc95a615b');
  }, 30_000);

  it('handles empty input', () => {
    render(<HashGenerator />);

    const input = screen.getByPlaceholderText('해시할 텍스트를 입력하세요');
    expect(input).toHaveValue('');
  });
});
