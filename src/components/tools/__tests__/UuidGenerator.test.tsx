import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UuidGenerator from '../UuidGenerator';
import './testUtils';

describe('UuidGenerator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders generate button', () => {
    render(<UuidGenerator />);

    expect(screen.getByText('생성')).toBeInTheDocument();
  });

  it('generates valid UUID v4', async () => {
    render(<UuidGenerator />);
    const user = userEvent.setup();

    await user.click(screen.getByText('생성'));

    const textarea = screen.getByRole('textbox');
    const uuid = textarea.getAttribute('value') || '';

    // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });

  it('generates multiple UUIDs based on count', async () => {
    render(<UuidGenerator />);
    const user = userEvent.setup();

    // Change count to 5
    const countInput = screen.getByRole('spinbutton');
    await user.clear(countInput);
    await user.type(countInput, '5');

    await user.click(screen.getByText('생성'));

    const textarea = screen.getByRole('textbox');
    const uuids = (textarea.getAttribute('value') || '').split('\n');

    expect(uuids.length).toBe(5);
  });

  it('generates uppercase UUIDs when option is checked', async () => {
    render(<UuidGenerator />);
    const user = userEvent.setup();

    const uppercaseCheckbox = screen.getByRole('checkbox', { name: '대문자' });
    await user.click(uppercaseCheckbox);

    await user.click(screen.getByText('생성'));

    const textarea = screen.getByRole('textbox');
    const uuid = textarea.getAttribute('value') || '';

    expect(uuid).toMatch(/^[0-9A-F-]+$/);
  });

  it('generates UUIDs without hyphens when option is unchecked', async () => {
    render(<UuidGenerator />);
    const user = userEvent.setup();

    const hyphensCheckbox = screen.getByRole('checkbox', { name: '하이픈 포함' });
    await user.click(hyphensCheckbox);

    await user.click(screen.getByText('생성'));

    const textarea = screen.getByRole('textbox');
    const uuid = textarea.getAttribute('value') || '';

    expect(uuid).not.toContain('-');
    expect(uuid.length).toBe(32); // 32 hex chars without hyphens
  });

  it('copies UUIDs to clipboard', async () => {
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator.clipboard, { writeText: mockWriteText });

    render(<UuidGenerator />);
    const user = userEvent.setup();

    await user.click(screen.getByText('생성'));
    await user.click(screen.getByText('복사'));

    expect(mockWriteText).toHaveBeenCalled();
  });

  it('all generated UUIDs are unique', async () => {
    render(<UuidGenerator />);
    const user = userEvent.setup();

    const countInput = screen.getByRole('spinbutton');
    await user.clear(countInput);
    await user.type(countInput, '10');

    await user.click(screen.getByText('생성'));

    const textarea = screen.getByRole('textbox');
    const uuids = (textarea.getAttribute('value') || '').split('\n');

    const uniqueUuids = new Set(uuids);
    expect(uniqueUuids.size).toBe(uuids.length);
  });
});
