import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ToolControl from '../ToolControl';

describe('ToolControl', () => {
  it('associates its label, help, and error text with its input', () => {
    render(<ToolControl id="amount" label="Amount" hint="Numbers only" error="Required" />);

    expect(screen.getByLabelText('Amount')).toHaveAttribute('aria-describedby', 'amount-hint amount-error');
    expect(screen.getByRole('alert')).toHaveTextContent('Required');
    expect(screen.getByLabelText('Amount')).toHaveClass('fc-input');
  });

  it('forwards disabled state to the input', () => {
    render(<ToolControl id="amount" label="Amount" disabled />);

    expect(screen.getByLabelText('Amount')).toBeDisabled();
  });
});
