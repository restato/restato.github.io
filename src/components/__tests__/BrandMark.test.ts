import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const brandMarkPath = 'src/components/BrandMark.astro';
const brandMark = existsSync(brandMarkPath) ? readFileSync(brandMarkPath, 'utf8') : '';

describe('Restato brand mark', () => {
  it('keeps the approved deterministic R and leaf geometry', () => {
    expect(brandMark).toContain('viewBox="0 0 32 32"');
    expect(brandMark).toMatch(/<rect[^>]+rx="7"/);
    expect(brandMark).toContain('#19553C');
    expect(brandMark).toContain('#F7F8F7');
    expect(brandMark).toContain('#9CC4AD');
    expect(brandMark).not.toMatch(/\u{1F680}|✨|(?:href|src)=["']https?:\/\//u);
  });

  it('is decorative by default and named only when a title is supplied', () => {
    expect(brandMark).toContain("aria-hidden={title ? undefined : 'true'}");
    expect(brandMark).toContain("role={title ? 'img' : undefined}");
    expect(brandMark).toContain('{title && <title>{title}</title>}');
  });

  it('exposes approved light and dark theme color variables', () => {
    expect(brandMark).toContain('--brand-icon-bg: #19553C');
    expect(brandMark).toContain('--brand-icon-r: #F7F8F7');
    expect(brandMark).toContain('--brand-icon-leaf: #9CC4AD');
    expect(brandMark).toContain('--brand-icon-bg: #70A889');
    expect(brandMark).toContain('--brand-icon-r: #111713');
    expect(brandMark).toContain('--brand-icon-leaf: #F0F4F1');
  });
});
