import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ToolActions } from '../ToolActions';
import { ToolField } from '../ToolField';
import { ToolPanel } from '../ToolPanel';
import { ToolResult } from '../ToolResult';

describe('shared tool interface primitives', () => {
  it('links a field label, hint, and error to its control', () => {
    render(
      <ToolField id="source" label="Source" hint="Paste plain text." error="Source is required.">
        <textarea />
      </ToolField>,
    );

    const control = screen.getByRole('textbox', { name: 'Source' });
    expect(control).toHaveAttribute('id', 'source');
    expect(control).toHaveAttribute('aria-describedby', 'source-hint source-error');
    expect(control).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Paste plain text.')).toHaveAttribute('id', 'source-hint');
    expect(screen.getByText('Source is required.')).toHaveAttribute('id', 'source-error');
  });

  it('renders primary actions before secondary actions with shared disabled styling', () => {
    render(
      <ToolActions
        primary={<button disabled>Convert</button>}
        secondary={<button>Clear</button>}
      />,
    );

    const actions = screen.getAllByRole('button');
    expect(actions.map((action) => action.textContent)).toEqual(['Convert', 'Clear']);
    expect(actions[0]).toHaveClass('fc-button', 'fc-button-primary');
    expect(actions[0]).toBeDisabled();
    expect(actions[1]).toHaveClass('fc-button', 'fc-button-secondary');
    expect(screen.getByTestId('tool-actions')).toHaveClass('fc-tool-actions');
  });

  it('announces non-error results politely and reports working progress', () => {
    const { rerender } = render(<ToolResult title="Output">Ready</ToolResult>);

    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'false');

    rerender(<ToolResult status="working">Converting</ToolResult>);
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('status')).toHaveClass('fc-tool-result-working');
  });

  it('uses an alert only for errors', () => {
    render(<ToolResult status="error">Conversion failed.</ToolResult>);

    expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'assertive');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('activates a drop zone with Enter and Space', () => {
    const onActivate = vi.fn();
    render(
      <ToolPanel variant="drop-zone" onActivate={onActivate} aria-label="Choose files">
        Drop files
      </ToolPanel>,
    );

    const dropZone = screen.getByRole('button', { name: 'Choose files' });
    expect(dropZone).toHaveAttribute('tabindex', '0');
    fireEvent.keyDown(dropZone, { key: 'Enter' });
    fireEvent.keyDown(dropZone, { key: ' ' });
    expect(onActivate).toHaveBeenCalledTimes(2);
  });
});
