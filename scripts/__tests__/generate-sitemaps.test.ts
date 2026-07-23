import { describe, expect, it } from 'vitest';
import { isNoindexHtml } from '../generate-sitemaps.mjs';

describe('sitemap indexation filter', () => {
  it('detects noindex regardless of robots attribute order', () => {
    expect(isNoindexHtml('<meta name="robots" content="noindex, nofollow">')).toBe(true);
    expect(isNoindexHtml('<meta content="follow, noindex" name="robots">')).toBe(true);
  });

  it('keeps indexable and googlebot-only markup', () => {
    expect(isNoindexHtml('<meta name="robots" content="index, follow">')).toBe(false);
    expect(isNoindexHtml('<meta name="googlebot" content="noindex">')).toBe(false);
  });
});
