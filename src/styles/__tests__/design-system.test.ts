import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync('src/styles/global.css', 'utf8');
const config = readFileSync('tailwind.config.mjs', 'utf8');
const layout = readFileSync('src/layouts/BaseLayout.astro', 'utf8');
const blogArticle = readFileSync('src/pages/blog/[...slug].astro', 'utf8');

describe('Forest Café design system', () => {
  it('self-hosts D2Coding and uses language-capable fallbacks', () => {
    expect(css).toContain("font-family: 'D2Coding'");
    expect(css).toContain("url('/fonts/D2Coding.woff2') format('woff2')");
    expect(css).toContain("url('/fonts/D2Coding-Bold.woff2') format('woff2')");
    expect(config).toContain("'D2Coding'");
    expect(config).toContain("'Noto Sans'");
  });

  it('defines the exact paired light and dark semantic tokens', () => {
    const themes = {
      ':root': {
        '--surface-page': '#f4efe5',
        '--surface-raised': '#fffaf0',
        '--surface-soft': '#ebe4d7',
        '--text-primary': '#203027',
        '--text-muted': '#5e6960',
        '--border-subtle': '#d9d1c4',
        '--brand': '#174a35',
        '--brand-hover': '#236345',
        '--accent': '#935832',
        '--focus': '#2f7658',
      },
      '.dark': {
        '--surface-page': '#111814',
        '--surface-raised': '#18221c',
        '--surface-soft': '#202c25',
        '--text-primary': '#edf2ea',
        '--text-muted': '#a7b0a8',
        '--border-subtle': '#344139',
        '--brand': '#6fa989',
        '--brand-hover': '#8ab99d',
        '--accent': '#cf936a',
        '--focus': '#8ab99d',
      },
    };

    for (const [selector, tokens] of Object.entries(themes)) {
      for (const [token, value] of Object.entries(tokens)) {
        expect(css).toMatch(new RegExp(`${selector.replace('.', '\\.') }\\s*\\{[^}]*${token}: ${value};`));
      }
    }
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
    expect(css).toMatch(/\.card\s*\{[^}]*border-radius:\s*0\.75rem;/s);
    expect(css).toMatch(/\.prose blockquote\s*\{[^}]*border-radius:\s*0\.75rem;/s);
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
