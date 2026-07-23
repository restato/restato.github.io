import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync('src/styles/global.css', 'utf8');
const config = readFileSync('tailwind.config.mjs', 'utf8');
const layout = readFileSync('src/layouts/BaseLayout.astro', 'utf8');

describe('Forest Café design system', () => {
  it('self-hosts D2Coding and uses language-capable fallbacks', () => {
    expect(css).toContain("font-family: 'D2Coding'");
    expect(css).toContain("url('/fonts/D2Coding.woff2') format('woff2')");
    expect(css).toContain("url('/fonts/D2Coding-Bold.woff2') format('woff2')");
    expect(config).toContain("'D2Coding'");
    expect(config).toContain("'Noto Sans'");
  });

  it('defines paired light and dark semantic tokens', () => {
    for (const token of ['--surface-page', '--surface-raised', '--text-primary', '--text-muted', '--border-subtle', '--brand', '--accent']) {
      expect(css.match(new RegExp(token, 'g'))?.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('prevents theme flash and exposes the browser color scheme', () => {
    expect(layout).toContain("document.documentElement.classList.add('dark')");
    expect(css).toContain('color-scheme: light');
    expect(css).toContain('color-scheme: dark');
  });
});
