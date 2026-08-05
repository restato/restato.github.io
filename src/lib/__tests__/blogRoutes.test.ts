// @vitest-environment node

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import BlogCard from '../../components/BlogCard.astro';
import { getBlogAlternates } from '../blogTranslations';
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

  it('projects each available incomplete side during development without alternates', () => {
    const [englishRoute] = projectEnglishRoutes([englishPost]);
    const [koreanRoute] = projectKoreanRoutes([koreanPost]);

    expect(englishRoute).toMatchObject({
      pathname: '/blog/opus-guide/',
      post: englishPost,
    });
    expect(koreanRoute).toMatchObject({
      pathname: '/ko/blog/opus-guide/',
      post: koreanPost,
    });
    expect(getBlogAlternates(englishRoute.pair!, 'https://restato.github.io')).toEqual([]);
    expect(getBlogAlternates(koreanRoute.pair!, 'https://restato.github.io')).toEqual([]);
  });

  it('keeps incomplete paired routes fail-closed on legacy path collisions', () => {
    const collidingLegacyPost = {
      slug: 'opus-guide',
      data: {},
    } satisfies TestPost;

    expect(() => projectEnglishRoutes([
      englishPost,
      collidingLegacyPost,
    ])).toThrow('blog route collision at /blog/opus-guide/');
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

  it('explains the Korean translation policy in the no-pair empty state', async () => {
    const koreanIndex = await readFile(
      join(process.cwd(), 'src/pages/ko/blog/index.astro'),
      'utf8',
    );
    const emptyState = koreanIndex.match(
      /\)\s*:\s*\(\s*(<div class="fc-empty-state">[\s\S]*?<\/div>)\s*\)\}/u,
    )?.[1] ?? '';

    expect(emptyState).toContain('검토를 마친 한국어 번역');
    expect(emptyState).toContain('영어 원문을 기준 문서');
    expect(emptyState).toContain('언어 선택기');
    expect(emptyState).toContain('아직 번역되지 않은 글');
    expect(emptyState).toContain('href="/blog/"');
    expect(emptyState.match(/[가-힣]/gu)?.length ?? 0).toBeGreaterThan(80);

    expect(koreanIndex).toContain('routes.map(({ post, pathname })');
    expect(koreanIndex).toContain('href={pathname}');
  });
});
