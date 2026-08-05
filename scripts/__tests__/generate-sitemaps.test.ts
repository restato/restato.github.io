import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  categorizeUrl,
  getBlogPostDates,
  getLastmod,
  isNoindexHtml,
} from '../generate-sitemaps.mjs';

const fixtureDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(
    fixtureDirectories.splice(0).map(directory => rm(directory, { recursive: true, force: true })),
  );
});

async function createBlogContentFixture(files: Record<string, string>) {
  const directory = await mkdtemp(join(tmpdir(), 'generate-sitemaps-'));
  fixtureDirectories.push(directory);

  await Promise.all(Object.entries(files).map(async ([file, content]) => {
    const target = join(directory, file);
    await mkdir(join(target, '..'), { recursive: true });
    await writeFile(target, content);
  }));

  return directory;
}

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

describe('localized blog sitemap metadata', () => {
  it.each([
    '/blog/',
    '/blog/localized-post/',
    '/ko/blog/',
    '/ko/blog/localized-post/',
  ])('categorizes %s as blog content', pathname => {
    expect(categorizeUrl(pathname)).toBe('blog');
  });

  it('uses each localized document date and preserves legacy root dates', async () => {
    const contentDirectory = await createBlogContentFixture({
      'legacy-post.mdx': '---\ndate: 2024-01-03\n---\n\nLegacy body.\n',
      'en/localized-post.mdx': '---\ndate: 2026-08-01\n---\n\nEnglish body.\n',
      'ko/localized-post.mdx': '---\ndate: 2026-08-02\n---\n\nKorean body.\n',
    });
    const blogDates = getBlogPostDates(contentDirectory);
    const buildDate = '2026-08-06T12:34:56.000Z';

    expect(getLastmod('/blog/legacy-post/', blogDates, buildDate)).toBe(
      '2024-01-03T00:00:00.000Z',
    );
    expect(getLastmod('/blog/localized-post/', blogDates, buildDate)).toBe(
      '2026-08-01T00:00:00.000Z',
    );
    expect(getLastmod('/ko/blog/localized-post/', blogDates, buildDate)).toBe(
      '2026-08-02T00:00:00.000Z',
    );
  });

  it('does not use an article date for blog indexes or tag archives', async () => {
    const contentDirectory = await createBlogContentFixture({
      'en/tag.mdx': '---\ndate: 2026-08-01\n---\n\nArticle body.\n',
      'ko/tag.mdx': '---\ndate: 2026-08-02\n---\n\nArticle body.\n',
    });
    const blogDates = getBlogPostDates(contentDirectory);
    const buildDate = '2026-08-06T12:34:56.000Z';

    expect(getLastmod('/blog/', blogDates, buildDate)).toBe(buildDate);
    expect(getLastmod('/ko/blog/', blogDates, buildDate)).toBe(buildDate);
    expect(getLastmod('/blog/tag/tag/', blogDates, buildDate)).toBe(buildDate);
    expect(getLastmod('/ko/blog/tag/tag/', blogDates, buildDate)).toBe(buildDate);
  });
});
