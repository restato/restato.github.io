import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync('src/styles/global.css', 'utf8');

describe('PageShell styling contract', () => {
  it('keeps responsive gutters on the base shell', () => {
    expect(css).toMatch(/\.fc-page\s*\{[^}]*inline-size:\s*calc\(100% - 2rem\);[^}]*margin-inline:\s*auto;/s);
  });

  it('gives each page size its own effective maximum inline size', () => {
    expect(css).toMatch(/\.fc-reading\s*\{[^}]*max-inline-size:\s*68ch;/s);
    expect(css).toMatch(/\.fc-content\s*\{[^}]*max-inline-size:\s*72rem;/s);
    expect(css).toMatch(/\.fc-wide\s*\{[^}]*max-inline-size:\s*88rem;/s);
  });

  it('uses border and background tone without a raised-surface shadow', () => {
    expect(css).toMatch(/\.fc-surface\s*\{[^}]*border:\s*1px solid var\(--border-subtle\);[^}]*background:\s*var\(--surface-raised\);/s);
    expect(css).not.toMatch(/\.fc-surface\s*\{[^}]*box-shadow\s*:/s);
  });
});
