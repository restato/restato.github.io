import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UrlEncoder from '../UrlEncoder';
import './testUtils';

describe('UrlEncoder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders encode and decode buttons', () => {
    render(<UrlEncoder />);

    expect(screen.getByText('인코딩') || screen.getByText(/encode/i)).toBeInTheDocument();
    expect(screen.getByText('디코딩') || screen.getByText(/decode/i)).toBeInTheDocument();
  });

  it('encodes URL correctly', async () => {
    render(<UrlEncoder />);
    const user = userEvent.setup();

    const inputs = screen.getAllByRole('textbox');
    const input = inputs[0];
    await user.type(input, 'hello world');

    const output = inputs[1];
    expect(output.getAttribute('value')).toContain('hello%20world');
  });

  it('encodes special characters correctly', async () => {
    render(<UrlEncoder />);
    const user = userEvent.setup();

    const inputs = screen.getAllByRole('textbox');
    const input = inputs[0];
    await user.type(input, 'test&param=value');

    const output = inputs[1];
    expect(output.getAttribute('value')).toContain('%26');
  });

  it('decodes URL correctly', async () => {
    render(<UrlEncoder />);
    const user = userEvent.setup();

    // Switch to decode mode
    await user.click(screen.getByText('디코딩') || screen.getByText(/decode/i));

    const inputs = screen.getAllByRole('textbox');
    const input = inputs[0];
    await user.type(input, 'hello%20world');

    const output = inputs[1];
    expect(output.getAttribute('value')).toContain('hello world');
  });

  it('handles Korean characters', async () => {
    render(<UrlEncoder />);
    const user = userEvent.setup();

    const inputs = screen.getAllByRole('textbox');
    const input = inputs[0];
    await user.type(input, '안녕하세요');

    const output = inputs[1];
    // Korean characters should be percent-encoded
    expect(output.getAttribute('value')).toMatch(/%[0-9A-Fa-f]{2}/);
  });

  it('copies output to clipboard', async () => {
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator.clipboard, { writeText: mockWriteText });

    render(<UrlEncoder />);
    const user = userEvent.setup();

    const inputs = screen.getAllByRole('textbox');
    const input = inputs[0];
    await user.type(input, 'test');

    await user.click(screen.getByText('복사'));

    expect(mockWriteText).toHaveBeenCalled();
  });

  it('handles empty input gracefully', () => {
    render(<UrlEncoder />);

    const inputs = screen.getAllByRole('textbox');
    const output = inputs[1];

    expect(output.getAttribute('value')).toBe('');
  });
});
