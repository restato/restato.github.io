import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('ToolActions mobile layout', () => {
  it('forces every action group to one ordered column below 480px', () => {
    const css = readFileSync('src/styles/global.css', 'utf8');
    const mobile = css.match(/@media \(max-width: 479px\) \{([\s\S]*?)\n\}/)?.[1] ?? '';

    expect(mobile).toMatch(/\.fc-tool-actions\s*\{[\s\S]*display:\s*grid\s*!important/);
    expect(mobile).toMatch(/grid-template-columns:\s*minmax\(0,\s*1fr\)\s*!important/);
    expect(mobile).toMatch(/\.fc-tool-actions\s*>\s*\*\s*\{[\s\S]*width:\s*100%/);
  });
});
