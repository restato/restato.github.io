import { describe, expect, it } from 'vitest';

describe('test browser environment', () => {
  it('provides a pathname and browser file APIs', () => {
    expect(window.location.pathname).toBe('/ko/tools/test');
    expect(HTMLCanvasElement.prototype.getContext).toBeTypeOf('function');
    expect(URL.createObjectURL).toBeTypeOf('function');
    expect(URL.revokeObjectURL).toBeTypeOf('function');
  });
});
