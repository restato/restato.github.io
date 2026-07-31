import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source = readFileSync('src/components/BlogTagNav.astro', 'utf8');

describe('BlogTagNav disclosure contract', () => {
  it('keeps overflow tags accessible through a labelled disclosure', () => {
    expect(source).toContain('entries.slice(0, 10)');
    expect(source).toContain('entries.slice(10)');
    expect(source).toContain('aria-expanded="false"');
    expect(source).toContain('aria-controls={overflowId}');
    expect(source).toContain('data-blog-tag-overflow');
    expect(source).toContain('data-show-more-label={showMoreLabel}');
    expect(source).toContain('data-show-less-label={showLessLabel}');
    expect(source).toContain('{entry.count}');
    expect(source).toContain('entries.length > 10');
  });

  it('gives each disclosure instance a unique controlled region', () => {
    expect(source).toContain('crypto.randomUUID()');
    expect(source).toContain("nav.querySelector<HTMLElement>('[data-blog-tag-overflow]')");
  });
});
