import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegexTester from '../RegexTester';
import './testUtils';

describe('RegexTester', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders pattern input and test string area', () => {
    render(<RegexTester />);

    expect(screen.getByPlaceholderText(/패턴|pattern/i)).toBeInTheDocument();
  });

  it('finds matches with simple pattern', async () => {
    render(<RegexTester />);
    const user = userEvent.setup();

    // Find pattern input (first text input)
    const inputs = screen.getAllByRole('textbox');
    const patternInput = inputs[0];

    await user.type(patternInput, 'hello');

    // Find test string input (textarea)
    const testArea = screen.getByRole('textbox', { name: '' }) || inputs[1];
    await user.clear(testArea);
    await user.type(testArea, 'hello world hello');

    // Should show matches
    expect(screen.getByText(/매치|match/i)).toBeInTheDocument();
  });

  it('shows no match message when pattern does not match', async () => {
    render(<RegexTester />);
    const user = userEvent.setup();

    const inputs = screen.getAllByRole('textbox');
    const patternInput = inputs[0];

    await user.type(patternInput, 'xyz');

    const testArea = inputs[1];
    await user.clear(testArea);
    await user.type(testArea, 'hello world');

    // Should show no match
    expect(screen.getByText(/매치 없음|no match/i)).toBeInTheDocument();
  });

  it('supports regex flags', async () => {
    render(<RegexTester />);
    const user = userEvent.setup();

    const inputs = screen.getAllByRole('textbox');
    const patternInput = inputs[0];

    // Case insensitive pattern
    await user.type(patternInput, 'HELLO');

    const testArea = inputs[1];
    await user.clear(testArea);
    await user.type(testArea, 'hello world');

    // Check if there's an "i" flag checkbox or input
    const flagsInput = screen.getAllByRole('textbox').find(
      input => input.getAttribute('placeholder')?.includes('플래그') ||
               input.getAttribute('placeholder')?.includes('flag')
    );

    if (flagsInput) {
      await user.type(flagsInput, 'i');
    }
  });

  it('handles invalid regex gracefully', async () => {
    render(<RegexTester />);
    const user = userEvent.setup();

    const inputs = screen.getAllByRole('textbox');
    const patternInput = inputs[0];

    // Invalid regex pattern
    await user.type(patternInput, '[invalid(');

    // Should not crash, may show error message
    expect(patternInput).toBeInTheDocument();
  });

  it('highlights matching groups', async () => {
    render(<RegexTester />);
    const user = userEvent.setup();

    const inputs = screen.getAllByRole('textbox');
    const patternInput = inputs[0];

    // Pattern with capture groups
    await user.type(patternInput, '(\\w+)@(\\w+)');

    const testArea = inputs[1];
    await user.clear(testArea);
    await user.type(testArea, 'test@example');

    // Should show group information
    expect(screen.getByText(/그룹|group/i)).toBeInTheDocument();
  });
});
