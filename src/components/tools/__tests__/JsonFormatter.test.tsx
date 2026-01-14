import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import JsonFormatter from '../JsonFormatter';
import './testUtils';

describe('JsonFormatter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders format, minify and validate buttons', () => {
    render(<JsonFormatter />);

    expect(screen.getByText('포매팅')).toBeInTheDocument();
    expect(screen.getByText('압축')).toBeInTheDocument();
    expect(screen.getByText('검증')).toBeInTheDocument();
  });

  it('formats valid JSON correctly', async () => {
    render(<JsonFormatter />);
    const user = userEvent.setup();

    const input = screen.getByPlaceholderText('JSON을 입력하세요');
    await user.type(input, '{"name":"test","value":123}');

    await user.click(screen.getByText('포매팅'));

    const output = screen.getAllByRole('textbox')[1];
    const formattedValue = output.getAttribute('value') || '';
    expect(formattedValue).toContain('"name": "test"');
  });

  it('minifies JSON correctly', async () => {
    render(<JsonFormatter />);
    const user = userEvent.setup();

    const input = screen.getByPlaceholderText('JSON을 입력하세요');
    await user.type(input, '{  "name"  :  "test"  }');

    await user.click(screen.getByText('압축'));

    const output = screen.getAllByRole('textbox')[1];
    expect(output).toHaveValue('{"name":"test"}');
  });

  it('shows valid status for valid JSON', async () => {
    render(<JsonFormatter />);
    const user = userEvent.setup();

    const input = screen.getByPlaceholderText('JSON을 입력하세요');
    await user.type(input, '{"valid": true}');

    await user.click(screen.getByText('검증'));

    expect(screen.getByText('유효한 JSON')).toBeInTheDocument();
  });

  it('shows invalid status for invalid JSON', async () => {
    render(<JsonFormatter />);
    const user = userEvent.setup();

    const input = screen.getByPlaceholderText('JSON을 입력하세요');
    await user.type(input, '{invalid json}');

    await user.click(screen.getByText('검증'));

    expect(screen.getByText('유효하지 않은 JSON')).toBeInTheDocument();
  });

  it('loads sample JSON when clicking sample button', async () => {
    render(<JsonFormatter />);
    const user = userEvent.setup();

    await user.click(screen.getByText('샘플 불러오기'));

    const input = screen.getByPlaceholderText('JSON을 입력하세요');
    expect(input.getAttribute('value')).toContain('Sample Object');
  });

  it('respects indent size setting', async () => {
    render(<JsonFormatter />);
    const user = userEvent.setup();

    // Change indent to 4 spaces
    const indentSelect = screen.getByRole('combobox');
    await user.selectOptions(indentSelect, '4');

    const input = screen.getByPlaceholderText('JSON을 입력하세요');
    await user.type(input, '{"a":"b"}');

    await user.click(screen.getByText('포매팅'));

    const output = screen.getAllByRole('textbox')[1];
    const formattedValue = output.getAttribute('value') || '';
    expect(formattedValue).toContain('    '); // 4 spaces
  });

  it('copies output to clipboard', async () => {
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator.clipboard, { writeText: mockWriteText });

    render(<JsonFormatter />);
    const user = userEvent.setup();

    const input = screen.getByPlaceholderText('JSON을 입력하세요');
    await user.type(input, '{"test":1}');

    await user.click(screen.getByText('포매팅'));
    await user.click(screen.getByText('복사'));

    expect(mockWriteText).toHaveBeenCalled();
  });

  it('handles nested JSON structures', async () => {
    render(<JsonFormatter />);
    const user = userEvent.setup();

    const input = screen.getByPlaceholderText('JSON을 입력하세요');
    await user.type(input, '{"a":{"b":{"c":1}}}');

    await user.click(screen.getByText('포매팅'));

    const output = screen.getAllByRole('textbox')[1];
    expect(output.getAttribute('value')).toContain('"c": 1');
  });

  it('handles arrays correctly', async () => {
    render(<JsonFormatter />);
    const user = userEvent.setup();

    const input = screen.getByPlaceholderText('JSON을 입력하세요');
    await user.type(input, '[1,2,3]');

    await user.click(screen.getByText('포매팅'));

    expect(screen.getByText('유효한 JSON')).toBeInTheDocument();
  });
});
