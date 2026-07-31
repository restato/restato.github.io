import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync('src/styles/global.css', 'utf8');
const config = readFileSync('tailwind.config.mjs', 'utf8');
const layout = readFileSync('src/layouts/BaseLayout.astro', 'utf8');
const blogArticle = readFileSync('src/pages/blog/[...slug].astro', 'utf8');

describe('Modern Restato design system', () => {
  it('uses the Apple system stack globally and scopes D2Coding to machine data', () => {
    expect(css).toContain("url('/fonts/D2Coding.woff2') format('woff2')");
    expect(css).toContain("url('/fonts/D2Coding-Bold.woff2') format('woff2')");
    expect(config).toContain("'-apple-system'");
    expect(config).toContain("'BlinkMacSystemFont'");
    expect(css).toMatch(/body\s*\{[^}]*font-size:\s*1rem;[^}]*line-height:\s*1\.7;/s);
    expect(css).toMatch(/\.fc-mono[\s\S]*font-family:\s*'D2Coding'/);
    expect(css).not.toMatch(/\.fc-input[^}]*font-family:\s*'D2Coding'/s);
  });

  it('defines the exact paired light and dark semantic tokens', () => {
    const themes = {
      ':root': {
        '--surface-page': '#F7F8F7',
        '--surface-raised': '#FFFFFF',
        '--surface-soft': '#EDF3EF',
        '--text-primary': '#15241D',
        '--text-muted': '#657169',
        '--border-subtle': '#DCE3DF',
        '--brand': '#19553C',
        '--brand-hover': '#236B4C',
        '--brand-soft': '#9CC4AD',
        '--focus': '#2C7655',
      },
      '.dark': {
        '--surface-page': '#111713',
        '--surface-raised': '#19211D',
        '--surface-soft': '#24342B',
        '--text-primary': '#F0F4F1',
        '--text-muted': '#9CA8A1',
        '--border-subtle': '#303A34',
        '--brand': '#70A889',
        '--brand-hover': '#89B99D',
        '--brand-soft': '#1D3D2F',
        '--focus': '#8DC0A1',
      },
    };

    for (const [selector, tokens] of Object.entries(themes)) {
      for (const [token, value] of Object.entries(tokens)) {
        expect(css).toMatch(new RegExp(`${selector.replace('.', '\\.') }\\s*\\{[^}]*${token}: ${value};`));
      }
    }

    expect(css).toMatch(/:root\s*\{[^}]*--accent:\s*var\(--brand\);/s);
    expect(css).toMatch(/\.dark\s*\{[^}]*--accent:\s*var\(--brand\);/s);
  });

  it('prevents theme flash and exposes the browser color scheme', () => {
    expect(layout).toContain("document.documentElement.classList.add('dark')");
    expect(css).toContain('color-scheme: light');
    expect(css).toContain('color-scheme: dark');
  });

  it('keeps image crop keyboard handles at the WCAG 2.2 target size', () => {
    expect(css).toMatch(/\.ReactCrop\s*\{[^}]*--rc-drag-handle-size:\s*24px;/s);
  });

  it('uses a readable body rhythm and caps long-form content despite max-w-none utilities', () => {
    expect(css).toMatch(/body\s*\{[^}]*font-size:\s*1rem;[^}]*line-height:\s*1\.7;/s);
    expect(blogArticle).toContain('fc-prose prose prose-lg dark:prose-invert');
    expect(css).toMatch(/\.fc-prose\s*\{[^}]*max-inline-size:\s*68ch;/s);
    expect(css).toMatch(/\.prose\.prose-lg\s*\{[^}]*max-width:\s*68ch;[^}]*max-inline-size:\s*68ch;/s);
    expect(config).toContain("maxWidth: '68ch'");
  });

  it('keeps shared presentation quiet and within the radius contract', () => {
    expect(css).toMatch(/\.fc-surface\s*\{[^}]*border-radius:\s*0\.5rem;/s);
    expect(css).toMatch(/\.fc-button\s*\{[^}]*border-radius:\s*0\.375rem;/s);
    expect(css).toMatch(/\.fc-chip\s*\{[^}]*border-radius:\s*0\.5rem;/s);
    expect(css).toMatch(/\.card\s*\{[^}]*border-radius:\s*0\.5rem;/s);
    expect(css).toMatch(/\.prose blockquote\s*\{[^}]*border-radius:\s*0\.5rem;/s);
    expect(css).not.toMatch(/border-radius:\s*9999px/);
    expect(css).not.toMatch(/(?:linear|radial)-gradient\s*\(/);
    expect(css).not.toMatch(/\b(?:bg-gradient-[\w-]+|from-[\w-]+|via-[\w-]+|to-[\w-]+)\b/);
    expect(css).not.toMatch(/hover:(?:-?translate-[xyz]|scale)-/);
    expect(css).not.toMatch(/box-shadow\s*:/);
    expect(css).not.toMatch(/@apply[^;]*\b(?:hover:)?shadow(?:-[\w/]+)?\b/);
    expect(css).not.toMatch(/@keyframes\b/);
    expect(css).not.toMatch(/(?:^|[;{]\s*)animation\s*:/m);
    expect(config).not.toMatch(/animation:|keyframes:/);
  });
});
