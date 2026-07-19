import { describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';

describe('test browser environment', () => {
  it('provides a pathname and browser file APIs', () => {
    expect(window.location.pathname).toBe('/ko/tools/test');
    expect(HTMLCanvasElement.prototype.getContext).toBeTypeOf('function');
    expect(URL.createObjectURL).toBeTypeOf('function');
    expect(URL.revokeObjectURL).toBeTypeOf('function');
  });

  it('allows user-event to install its clipboard stub', () => {
    expect(Object.getOwnPropertyDescriptor(navigator, 'clipboard')?.configurable).toBe(true);
    expect(() => userEvent.setup()).not.toThrow();
  });
});
