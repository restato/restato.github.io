// @vitest-environment node

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import BlogCard from '../../components/BlogCard.astro';
import { projectEnglishRoutes, projectKoreanRoutes } from '../blogRoutes';

let astro: AstroContainer;

interface TestPost {
  slug: string;
  data: {
    lang?: string;
    translationKey?: string;
  };
}

const englishPost: TestPost = {
  slug: 'en/opus-guide',
  data: {
    lang: 'en',
    translationKey: 'opus-guide',
  },
};

const koreanPost: TestPost = {
  slug: 'ko/opus-guide',
  data: {
    lang: 'ko',
    translationKey: 'opus-guide',
  },
};

const legacyKoreanPost: TestPost = {
  slug: 'legacy-korean-post',
  data: {
    lang: 'ko',
  },
};

describe('localized blog route projections', () => {
  beforeAll(async () => {
    astro = await AstroContainer.create();
  });

  it('projects English pairs and root legacy posts onto unprefixed routes', () => {
    const routes = projectEnglishRoutes([
      englishPost,
      koreanPost,
      legacyKoreanPost,
    ]);

    expect(routes.map(route => route.pathname)).toEqual([
      '/blog/opus-guide/',
      '/blog/legacy-korean-post/',
    ]);
    expect(routes.map(route => route.post)).toEqual([
      englishPost,
      legacyKoreanPost,
    ]);
  });

  it('projects only complete Korean pairs onto Korean routes', () => {
    const routes = projectKoreanRoutes([
      englishPost,
      koreanPost,
      legacyKoreanPost,
    ]);

    expect(routes.map(route => route.pathname)).toEqual([
      '/ko/blog/opus-guide/',
    ]);
    expect(routes.map(route => route.post)).toEqual([koreanPost]);
  });

  it('does not publish either side of an incomplete prefixed pair', () => {
    expect(projectEnglishRoutes([englishPost])).toEqual([]);
    expect(projectKoreanRoutes([koreanPost])).toEqual([]);
  });

  it('rejects a public-path collision between a complete pair and a root legacy post', () => {
    const collidingLegacyPost = {
      slug: 'opus-guide',
      data: {},
    } satisfies TestPost;

    expect(() => projectEnglishRoutes([
      englishPost,
      koreanPost,
      collidingLegacyPost,
    ])).toThrow('blog route collision at /blog/opus-guide/');
  });

  it('rejects duplicate root legacy slugs', () => {
    const duplicateLegacyPost = {
      ...legacyKoreanPost,
      data: { ...legacyKoreanPost.data },
    };

    expect(() => projectEnglishRoutes([
      legacyKoreanPost,
      duplicateLegacyPost,
    ])).toThrow('blog route collision at /blog/legacy-korean-post/');
  });

  it('renders clean projected links while preserving the legacy card default', async () => {
    const props = {
      title: 'Opus guide',
      description: 'A guide',
      date: new Date('2026-08-01T00:00:00.000Z'),
      slug: 'opus-guide',
    };
    const [localizedCard, legacyCard] = await Promise.all([
      astro.renderToString(BlogCard, {
        props: { ...props, href: '/ko/blog/opus-guide/' },
      }),
      astro.renderToString(BlogCard, { props }),
    ]);

    expect(localizedCard).toContain('href="/ko/blog/opus-guide/"');
    expect(legacyCard).toContain('href="/blog/opus-guide"');
  });

  it('feeds home, tag, and RSS output from canonical English routes', async () => {
    const [home, tag, rss] = await Promise.all([
      readFile(join(process.cwd(), 'src/pages/index.astro'), 'utf8'),
      readFile(join(process.cwd(), 'src/pages/blog/tag/[tag].astro'), 'utf8'),
      readFile(join(process.cwd(), 'src/pages/rss.xml.ts'), 'utf8'),
    ]);

    expect(home).toContain('projectEnglishRoutes(');
    expect(home).toContain('routes.map(({ post, pathname })');
    expect(home).toContain('href={pathname}');

    expect(tag).toContain('projectEnglishRoutes(');
    expect(tag).toContain('routes.map(({ post, pathname })');
    expect(tag).toContain('href={pathname}');

    expect(rss).toContain('projectEnglishRoutes(');
    expect(rss).toContain('link: route.pathname');
  });
});
