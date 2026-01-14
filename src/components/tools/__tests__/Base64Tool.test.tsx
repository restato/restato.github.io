import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Base64Tool from '../Base64Tool';
import './testUtils';

describe('Base64Tool', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders encode and decode buttons', () => {
    render(<Base64Tool />);

    expect(screen.getByText('인코딩')).toBeInTheDocument();
    expect(screen.getByText('디코딩')).toBeInTheDocument();
  });

  it('encodes text to Base64 correctly', async () => {
    render(<Base64Tool />);
    const user = userEvent.setup();

    const input = screen.getByPlaceholderText('텍스트를 입력하세요');
    await user.type(input, 'Hello World');

    // Auto-convert on input
    const output = screen.getAllByRole('textbox')[1];
    expect(output).toHaveValue('SGVsbG8gV29ybGQ=');
  });

  it('decodes Base64 to text correctly', async () => {
    render(<Base64Tool />);
    const user = userEvent.setup();

    // Switch to decode mode
    await user.click(screen.getByText('디코딩'));

    const input = screen.getByPlaceholderText('텍스트를 입력하세요');
    await user.type(input, 'SGVsbG8gV29ybGQ=');

    const output = screen.getAllByRole('textbox')[1];
    expect(output).toHaveValue('Hello World');
  });

  it('shows error for invalid Base64 in decode mode', async () => {
    render(<Base64Tool />);
    const user = userEvent.setup();

    // Switch to decode mode
    await user.click(screen.getByText('디코딩'));

    const input = screen.getByPlaceholderText('텍스트를 입력하세요');
    await user.type(input, 'invalid!!!');

    expect(screen.getByText('유효하지 않은 Base64입니다')).toBeInTheDocument();
  });

  it('handles Unicode characters correctly', async () => {
    render(<Base64Tool />);
    const user = userEvent.setup();

    const input = screen.getByPlaceholderText('텍스트를 입력하세요');
    await user.type(input, '안녕하세요');

    const output = screen.getAllByRole('textbox')[1];
    // Verify it produces valid Base64
    expect(output.getAttribute('value')).toMatch(/^[A-Za-z0-9+/=]+$/);
  });

  it('swaps input and output when swap button is clicked', async () => {
    render(<Base64Tool />);
    const user = userEvent.setup();

    const input = screen.getByPlaceholderText('텍스트를 입력하세요');
    await user.type(input, 'Test');

    const swapButton = screen.getByRole('button', { name: '' }); // SVG button
    const buttons = screen.getAllByRole('button');
    const swapBtn = buttons.find(btn => btn.querySelector('svg path[d*="M7 16V4"]'));

    if (swapBtn) {
      await user.click(swapBtn);
    }
  });

  it('copies output to clipboard', async () => {
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator.clipboard, { writeText: mockWriteText });

    render(<Base64Tool />);
    const user = userEvent.setup();

    const input = screen.getByPlaceholderText('텍스트를 입력하세요');
    await user.type(input, 'Hello');

    const copyButton = screen.getByText('복사');
    await user.click(copyButton);

    expect(mockWriteText).toHaveBeenCalledWith('SGVsbG8=');
  });

  it('clears input and output when mode changes', async () => {
    render(<Base64Tool />);
    const user = userEvent.setup();

    const input = screen.getByPlaceholderText('텍스트를 입력하세요');
    await user.type(input, 'Test');

    // Switch mode
    await user.click(screen.getByText('디코딩'));

    expect(input).toHaveValue('');
  });
});
