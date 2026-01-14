import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PasswordGenerator from '../PasswordGenerator';
import './testUtils';

describe('PasswordGenerator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders generate button and options', () => {
    render(<PasswordGenerator />);

    expect(screen.getByText('생성')).toBeInTheDocument();
    expect(screen.getByText('대문자 (A-Z)')).toBeInTheDocument();
    expect(screen.getByText('소문자 (a-z)')).toBeInTheDocument();
    expect(screen.getByText('숫자 (0-9)')).toBeInTheDocument();
    expect(screen.getByText('특수문자 (!@#$...)')).toBeInTheDocument();
  });

  it('generates password when clicking generate button', async () => {
    render(<PasswordGenerator />);
    const user = userEvent.setup();

    await user.click(screen.getByText('생성'));

    const input = screen.getByPlaceholderText('생성된 비밀번호');
    expect(input.getAttribute('value')).not.toBe('');
  });

  it('generates password with correct length', async () => {
    render(<PasswordGenerator />);
    const user = userEvent.setup();

    // Default length is 16
    await user.click(screen.getByText('생성'));

    const input = screen.getByPlaceholderText('생성된 비밀번호');
    expect(input.getAttribute('value')?.length).toBe(16);
  });

  it('respects length slider changes', async () => {
    render(<PasswordGenerator />);
    const user = userEvent.setup();

    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '32' } });

    await user.click(screen.getByText('생성'));

    const input = screen.getByPlaceholderText('생성된 비밀번호');
    expect(input.getAttribute('value')?.length).toBe(32);
  });

  it('includes uppercase letters when option is checked', async () => {
    render(<PasswordGenerator />);
    const user = userEvent.setup();

    // All options are checked by default, uncheck some
    const lowercaseCheckbox = screen.getByRole('checkbox', { name: '소문자 (a-z)' });
    const numbersCheckbox = screen.getByRole('checkbox', { name: '숫자 (0-9)' });
    const symbolsCheckbox = screen.getByRole('checkbox', { name: '특수문자 (!@#$...)' });

    await user.click(lowercaseCheckbox);
    await user.click(numbersCheckbox);
    await user.click(symbolsCheckbox);

    await user.click(screen.getByText('생성'));

    const input = screen.getByPlaceholderText('생성된 비밀번호');
    const password = input.getAttribute('value') || '';
    expect(password).toMatch(/^[A-Z]+$/);
  });

  it('includes lowercase letters when option is checked', async () => {
    render(<PasswordGenerator />);
    const user = userEvent.setup();

    const uppercaseCheckbox = screen.getByRole('checkbox', { name: '대문자 (A-Z)' });
    const numbersCheckbox = screen.getByRole('checkbox', { name: '숫자 (0-9)' });
    const symbolsCheckbox = screen.getByRole('checkbox', { name: '특수문자 (!@#$...)' });

    await user.click(uppercaseCheckbox);
    await user.click(numbersCheckbox);
    await user.click(symbolsCheckbox);

    await user.click(screen.getByText('생성'));

    const input = screen.getByPlaceholderText('생성된 비밀번호');
    const password = input.getAttribute('value') || '';
    expect(password).toMatch(/^[a-z]+$/);
  });

  it('includes numbers when option is checked', async () => {
    render(<PasswordGenerator />);
    const user = userEvent.setup();

    const uppercaseCheckbox = screen.getByRole('checkbox', { name: '대문자 (A-Z)' });
    const lowercaseCheckbox = screen.getByRole('checkbox', { name: '소문자 (a-z)' });
    const symbolsCheckbox = screen.getByRole('checkbox', { name: '특수문자 (!@#$...)' });

    await user.click(uppercaseCheckbox);
    await user.click(lowercaseCheckbox);
    await user.click(symbolsCheckbox);

    await user.click(screen.getByText('생성'));

    const input = screen.getByPlaceholderText('생성된 비밀번호');
    const password = input.getAttribute('value') || '';
    expect(password).toMatch(/^[0-9]+$/);
  });

  it('shows strength indicator after generating password', async () => {
    render(<PasswordGenerator />);
    const user = userEvent.setup();

    await user.click(screen.getByText('생성'));

    expect(screen.getByText('강도')).toBeInTheDocument();
  });

  it('copies password to clipboard', async () => {
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator.clipboard, { writeText: mockWriteText });

    render(<PasswordGenerator />);
    const user = userEvent.setup();

    await user.click(screen.getByText('생성'));
    await user.click(screen.getByText('복사'));

    expect(mockWriteText).toHaveBeenCalled();
  });

  it('falls back to lowercase when no options selected', async () => {
    render(<PasswordGenerator />);
    const user = userEvent.setup();

    // Uncheck all options
    const uppercaseCheckbox = screen.getByRole('checkbox', { name: '대문자 (A-Z)' });
    const lowercaseCheckbox = screen.getByRole('checkbox', { name: '소문자 (a-z)' });
    const numbersCheckbox = screen.getByRole('checkbox', { name: '숫자 (0-9)' });
    const symbolsCheckbox = screen.getByRole('checkbox', { name: '특수문자 (!@#$...)' });

    await user.click(uppercaseCheckbox);
    await user.click(lowercaseCheckbox);
    await user.click(numbersCheckbox);
    await user.click(symbolsCheckbox);

    await user.click(screen.getByText('생성'));

    const input = screen.getByPlaceholderText('생성된 비밀번호');
    const password = input.getAttribute('value') || '';
    // Falls back to lowercase
    expect(password).toMatch(/^[a-z]+$/);
  });
});
