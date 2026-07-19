import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegexTester from '../RegexTester';
import './testUtils';

describe('RegexTester', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders pattern input and test string area', () => {
    render(<RegexTester />);

    expect(screen.getByPlaceholderText('[a-z]+')).toBeInTheDocument();
  });

  it('finds matches with simple pattern', async () => {
    render(<RegexTester />);
    const user = userEvent.setup();

    const inputs = screen.getAllByRole('textbox');
    const patternInput = inputs[0];
    const testArea = inputs[2];

    await user.type(patternInput, 'hello');
    await user.type(testArea, 'hello world hello');

    expect(screen.getByText(/매치\s*\(2\)/)).toBeInTheDocument();
    expect(screen.getAllByText('hello')).toHaveLength(4);
  });

  it('shows no match message when pattern does not match', async () => {
    render(<RegexTester />);
    const user = userEvent.setup();

    const inputs = screen.getAllByRole('textbox');
    const patternInput = inputs[0];
    const testArea = inputs[2];

    await user.type(patternInput, 'xyz');
    await user.type(testArea, 'hello world');

    // Should show no match
    expect(screen.getByText(/매치 없음|no match/i)).toBeInTheDocument();
  });

  it('supports regex flags', async () => {
    render(<RegexTester />);
    const user = userEvent.setup();

    const inputs = screen.getAllByRole('textbox');
    const patternInput = inputs[0];
    const testArea = inputs[2];

    await user.type(patternInput, 'HELLO');
    await user.type(testArea, 'hello world');

    await user.click(screen.getByRole('button', { name: 'Ignore case (i)' }));

    expect(screen.getByText(/매치\s*\(1\)/)).toBeInTheDocument();
    expect(screen.getAllByText('hello')).toHaveLength(2);
  });

  it('handles invalid regex gracefully', async () => {
    render(<RegexTester />);
    const inputs = screen.getAllByRole('textbox');
    const patternInput = inputs[0];
    const testArea = inputs[2];

    fireEvent.change(patternInput, { target: { value: '[invalid(' } });
    fireEvent.change(testArea, { target: { value: 'test' } });

    expect(screen.getByText(/invalid regular expression/i)).toBeInTheDocument();
  });

  it('highlights matching groups', async () => {
    render(<RegexTester />);
    const user = userEvent.setup();

    const inputs = screen.getAllByRole('textbox');
    const patternInput = inputs[0];
    const testArea = inputs[2];

    fireEvent.change(patternInput, { target: { value: '(\\w+)@(\\w+)' } });
    fireEvent.change(testArea, { target: { value: 'test@example' } });

    expect(screen.getByText('그룹:')).toBeInTheDocument();
    expect(screen.getByText('$1: test')).toBeInTheDocument();
    expect(screen.getByText('$2: example')).toBeInTheDocument();
  });
});
