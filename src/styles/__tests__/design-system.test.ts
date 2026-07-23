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

  it('uses a readable body rhythm and capped long-form measure', () => {
    expect(css).toMatch(/body\s*\{[^}]*font-size:\s*1rem;[^}]*line-height:\s*1\.7;/s);
    expect(css).toMatch(/\.prose\s*\{[^}]*max-inline-size:\s*68ch;/s);
    expect(config).toContain("maxWidth: '68ch'");
  });

  it('keeps shared presentation quiet and within the radius contract', () => {
    expect(css).toMatch(/\.card\s*\{[^}]*border-radius:\s*0\.75rem;/s);
    expect(css).toMatch(/\.prose blockquote\s*\{[^}]*border-radius:\s*0\.75rem;/s);
    expect(css).not.toMatch(/shadow|hover:-translate|translateY|bg-gradient|@keyframes|animation:\s/);
    expect(config).not.toMatch(/animation:|keyframes:/);
  });
});
