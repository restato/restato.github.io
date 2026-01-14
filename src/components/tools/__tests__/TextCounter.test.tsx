import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TextCounter from '../TextCounter';
import './testUtils';

describe('TextCounter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders text input area', () => {
    render(<TextCounter />);

    expect(screen.getByPlaceholderText('텍스트를 입력하세요...')).toBeInTheDocument();
  });

  it('counts characters correctly', async () => {
    render(<TextCounter />);
    const user = userEvent.setup();

    const textarea = screen.getByPlaceholderText('텍스트를 입력하세요...');
    await user.type(textarea, 'Hello');

    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('counts characters without spaces', async () => {
    render(<TextCounter />);
    const user = userEvent.setup();

    const textarea = screen.getByPlaceholderText('텍스트를 입력하세요...');
    await user.type(textarea, 'Hello World');

    // 11 total chars, 10 without space
    expect(screen.getByText('11')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('counts words correctly', async () => {
    render(<TextCounter />);
    const user = userEvent.setup();

    const textarea = screen.getByPlaceholderText('텍스트를 입력하세요...');
    await user.type(textarea, 'Hello beautiful World');

    // 3 words
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('counts lines correctly', async () => {
    render(<TextCounter />);
    const user = userEvent.setup();

    const textarea = screen.getByPlaceholderText('텍스트를 입력하세요...');
    await user.type(textarea, 'Line 1{enter}Line 2{enter}Line 3');

    // 3 lines
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('counts Korean characters correctly', async () => {
    render(<TextCounter />);
    const user = userEvent.setup();

    const textarea = screen.getByPlaceholderText('텍스트를 입력하세요...');
    await user.type(textarea, '안녕하세요');

    // 5 Korean characters
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('handles empty text', () => {
    render(<TextCounter />);

    // All counts should be 0
    const zeros = screen.getAllByText('0');
    expect(zeros.length).toBeGreaterThan(0);
  });

  it('handles mixed content (Korean + English)', async () => {
    render(<TextCounter />);
    const user = userEvent.setup();

    const textarea = screen.getByPlaceholderText('텍스트를 입력하세요...');
    await user.type(textarea, 'Hello 안녕');

    // 8 characters total (Hello + space + 안녕)
    expect(screen.getByText('8')).toBeInTheDocument();
  });
});
