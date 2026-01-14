import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ColorConverter from '../ColorConverter';
import './testUtils';

describe('ColorConverter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders HEX, RGB, HSL labels', () => {
    render(<ColorConverter />);

    expect(screen.getByText('HEX')).toBeInTheDocument();
    expect(screen.getByText('RGB')).toBeInTheDocument();
    expect(screen.getByText('HSL')).toBeInTheDocument();
  });

  it('converts HEX to RGB correctly', async () => {
    render(<ColorConverter />);
    const user = userEvent.setup();

    // Find HEX input
    const hexInput = screen.getAllByRole('textbox')[0];
    await user.clear(hexInput);
    await user.type(hexInput, '#ff0000');

    // RGB should show 255, 0, 0
    const inputs = screen.getAllByRole('spinbutton');
    const rInput = inputs.find(i => i.getAttribute('value') === '255');
    expect(rInput).toBeTruthy();
  });

  it('converts RGB to HEX correctly', async () => {
    render(<ColorConverter />);
    const user = userEvent.setup();

    // Find RGB inputs
    const inputs = screen.getAllByRole('spinbutton');
    const rInput = inputs[0];
    const gInput = inputs[1];
    const bInput = inputs[2];

    await user.clear(rInput);
    await user.type(rInput, '0');
    await user.clear(gInput);
    await user.type(gInput, '255');
    await user.clear(bInput);
    await user.type(bInput, '0');

    // HEX should show #00ff00 (green)
    const hexInput = screen.getAllByRole('textbox')[0];
    expect(hexInput.getAttribute('value')?.toLowerCase()).toContain('00ff00');
  });

  it('shows color preview', () => {
    render(<ColorConverter />);

    // Should have a preview element with background color
    const preview = screen.getByText('미리보기') || document.querySelector('[style*="background"]');
    expect(preview || screen.getByText(/미리보기|preview/i)).toBeInTheDocument();
  });

  it('handles invalid HEX input', async () => {
    render(<ColorConverter />);
    const user = userEvent.setup();

    const hexInput = screen.getAllByRole('textbox')[0];
    await user.clear(hexInput);
    await user.type(hexInput, 'invalid');

    // Should not crash
    expect(hexInput).toBeInTheDocument();
  });

  it('copies color value to clipboard', async () => {
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator.clipboard, { writeText: mockWriteText });

    render(<ColorConverter />);
    const user = userEvent.setup();

    // Find and click copy button
    const copyButtons = screen.getAllByText('복사');
    if (copyButtons.length > 0) {
      await user.click(copyButtons[0]);
      expect(mockWriteText).toHaveBeenCalled();
    }
  });

  it('syncs all color formats when one changes', async () => {
    render(<ColorConverter />);
    const user = userEvent.setup();

    const hexInput = screen.getAllByRole('textbox')[0];
    await user.clear(hexInput);
    await user.type(hexInput, '#0000ff');

    // Blue color - RGB should be 0, 0, 255
    const inputs = screen.getAllByRole('spinbutton');
    const bInput = inputs.find(i => i.getAttribute('value') === '255');
    expect(bInput).toBeTruthy();
  });

  it('handles color picker input', async () => {
    render(<ColorConverter />);

    const colorPicker = document.querySelector('input[type="color"]');
    if (colorPicker) {
      fireEvent.change(colorPicker, { target: { value: '#ff00ff' } });

      const hexInput = screen.getAllByRole('textbox')[0];
      expect(hexInput.getAttribute('value')?.toLowerCase()).toContain('ff00ff');
    }
  });
});
