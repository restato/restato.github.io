// @vitest-environment node

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import BlogTagNav from '../../components/BlogTagNav.astro';
import {
  getBlogTagEntries,
  getRankedBlogTagEntries,
  getBlogTagRouteEntries,
  toBlogTagSlug,
  toLegacyBlogTagPath,
} from '../blogTags';

let astro: AstroContainer;

describe('blog tag URLs', () => {
  beforeAll(async () => {
    astro = await AstroContainer.create();
  });

  it('creates lowercase URL-safe slugs', () => {
    expect(toBlogTagSlug('AI Agent')).toBe('ai-agent');
    expect(toBlogTagSlug('개발 도구')).toBe('%EA%B0%9C%EB%B0%9C-%EB%8F%84%EA%B5%AC');
  });

  it('deduplicates tags that differ only by case', () => {
    expect(getBlogTagEntries(['AI', 'ai', 'API', 'api', 'AI Agent'])).toEqual([
      { label: 'AI', slug: 'ai' },
      { label: 'AI Agent', slug: 'ai-agent' },
      { label: 'API', slug: 'api' },
    ]);
  });

  it('ranks canonical tags by post count and breaks ties by English label', () => {
    expect(getRankedBlogTagEntries(
      [['Astro', 'AI'], ['astro', '도구'], ['AI', 'Blog']],
    )).toEqual([
      { label: 'AI', slug: 'ai', count: 2 },
      { label: 'Astro', slug: 'astro', count: 2 },
      { label: 'Blog', slug: 'blog', count: 1 },
      { label: '도구', slug: '%EB%8F%84%EA%B5%AC', count: 1 },
    ]);
  });

  it('counts tags case-insensitively and selects a natural canonical display label', () => {
    expect(getRankedBlogTagEntries([
      ['OPENAI', 'openai'],
      ['OpenAI'],
    ])).toEqual([
      { label: 'OpenAI', slug: 'openai', count: 2 },
    ]);
  });

  it('derives identical ranked navigation for blog-index and tag-page input order', () => {
    const blogIndexPostTags = [
      ['claude-code', 'ai'],
      ['Claude Code', 'AI'],
      ['Astro'],
    ];
    const tagPagePostTags = [
      ['Astro'],
      ['Claude Code', 'AI'],
      ['claude-code', 'ai'],
    ];
    const expected = [
      { label: 'AI', slug: 'ai', count: 2 },
      { label: 'Claude Code', slug: 'claude-code', count: 2 },
      { label: 'Astro', slug: 'astro', count: 1 },
    ];

    expect(getRankedBlogTagEntries(blogIndexPostTags)).toEqual(expected);
    expect(getRankedBlogTagEntries(tagPagePostTags)).toEqual(expected);
  });

  it('keeps every distinct legacy raw tag path as a redirect without duplicate or self routes', () => {
    const routes = getBlogTagRouteEntries([
      'AI',
      'ai',
      'AI Agent',
      'OpenAI',
      '개발 도구',
      'C++',
      'AI',
    ]);

    expect(toLegacyBlogTagPath('AI Agent')).toEqual({
      filesystemSegment: 'AI Agent',
      urlSegment: 'AI%20Agent',
    });
    expect(toLegacyBlogTagPath('개발 도구')).toEqual({
      filesystemSegment: '개발 도구',
      urlSegment: '%EA%B0%9C%EB%B0%9C%20%EB%8F%84%EA%B5%AC',
    });
    expect(routes).toEqual([
      { kind: 'canonical', filesystemSegment: 'ai', urlSegment: 'ai', label: 'AI', canonicalSlug: 'ai' },
      { kind: 'canonical', filesystemSegment: 'ai-agent', urlSegment: 'ai-agent', label: 'AI Agent', canonicalSlug: 'ai-agent' },
      { kind: 'canonical', filesystemSegment: 'c++', urlSegment: 'c%2B%2B', label: 'C++', canonicalSlug: 'c%2B%2B' },
      { kind: 'canonical', filesystemSegment: 'openai', urlSegment: 'openai', label: 'OpenAI', canonicalSlug: 'openai' },
      { kind: 'canonical', filesystemSegment: '개발-도구', urlSegment: '%EA%B0%9C%EB%B0%9C-%EB%8F%84%EA%B5%AC', label: '개발 도구', canonicalSlug: '%EA%B0%9C%EB%B0%9C-%EB%8F%84%EA%B5%AC' },
      { kind: 'redirect', filesystemSegment: 'AI', urlSegment: 'AI', label: 'AI', canonicalSlug: 'ai' },
      { kind: 'redirect', filesystemSegment: 'AI Agent', urlSegment: 'AI%20Agent', label: 'AI Agent', canonicalSlug: 'ai-agent' },
      { kind: 'redirect', filesystemSegment: 'OpenAI', urlSegment: 'OpenAI', label: 'OpenAI', canonicalSlug: 'openai' },
      { kind: 'redirect', filesystemSegment: '개발 도구', urlSegment: '%EA%B0%9C%EB%B0%9C%20%EB%8F%84%EA%B5%AC', label: '개발 도구', canonicalSlug: '%EA%B0%9C%EB%B0%9C-%EB%8F%84%EA%B5%AC' },
      { kind: 'redirect', filesystemSegment: 'C++', urlSegment: 'C%2B%2B', label: 'C++', canonicalSlug: 'c%2B%2B' },
    ]);

    expect(new Set(routes.map(route => route.urlSegment)).size).toBe(routes.length);
    expect(routes.filter(route => route.kind === 'redirect')).not.toContainEqual(
      expect.objectContaining({ urlSegment: 'ai', canonicalSlug: 'ai' }),
    );
  });

  it('uses canonical slugs for generated tag routes and every tag link', async () => {
    const [tagRoute, blogIndex, blogTagNav, blogPost, koreanBlogPost, blogArticle] = await Promise.all([
      readFile(join(process.cwd(), 'src/pages/blog/tag/[tag].astro'), 'utf8'),
      readFile(join(process.cwd(), 'src/pages/blog/index.astro'), 'utf8'),
      readFile(join(process.cwd(), 'src/components/BlogTagNav.astro'), 'utf8'),
      readFile(join(process.cwd(), 'src/pages/blog/[...slug].astro'), 'utf8'),
      readFile(join(process.cwd(), 'src/pages/ko/blog/[...slug].astro'), 'utf8'),
      readFile(join(process.cwd(), 'src/components/BlogArticle.astro'), 'utf8'),
    ]);

    expect(tagRoute).toContain('getBlogTagRouteEntries');
    expect(tagRoute).toContain("route.kind === 'canonical'");
    expect(tagRoute).toContain("candidate.kind === 'redirect'");
    expect(tagRoute).toContain('params: { tag: route.filesystemSegment }');
    expect(tagRoute).toContain('id="blog-tag-legacy-aliases"');
    expect(tagRoute).toContain('data-canonical-slug={toBlogTagSlug(tag)}');
    expect(tagRoute).toContain('toBlogTagSlug(postTag) === route.canonicalSlug');
    expect(blogIndex).toContain('BlogTagNav');
    expect(blogTagNav).toContain("basePath = '/blog'");
    expect(blogTagNav).toContain('`${normalizedBasePath}/tag/${entry.slug}`');
    expect(blogPost).toContain('`/blog/tag/${toBlogTagSlug(tag)}`');
    expect(koreanBlogPost).toContain('`/ko/blog/tag/${toBlogTagSlug(tag)}`');
    expect(koreanBlogPost).toContain('indexUrl="/ko/blog"');
    expect(blogArticle).toContain('href={tagUrlBuilder(tag)}');
  });

  it('keeps Korean tag navigation inside the Korean blog route family', async () => {
    const html = await astro.renderToString(BlogTagNav, {
      props: {
        entries: [{ label: '개발 도구', slug: '%EA%B0%9C%EB%B0%9C-%EB%8F%84%EA%B5%AC', count: 2 }],
        label: '블로그 태그',
        showMoreLabel: '더보기',
        showLessLabel: '접기',
        formatCountLabel: (count: number) => `글 ${count}개`,
        includeAllLink: true,
        allLabel: '전체',
        basePath: '/ko/blog',
      },
    });

    expect(html).toContain('href="/ko/blog"');
    expect(html).toContain('href="/ko/blog/tag/%EA%B0%9C%EB%B0%9C-%EB%8F%84%EA%B5%AC"');
    expect(html).not.toContain('href="/blog/tag/');
  });

  it('preserves the English blog route family as the tag navigation default', async () => {
    const html = await astro.renderToString(BlogTagNav, {
      props: {
        entries: [{ label: 'Astro', slug: 'astro', count: 1 }],
        label: 'Blog tags',
        showMoreLabel: 'Show more',
        showLessLabel: 'Show less',
        formatCountLabel: (count: number) => `${count} post`,
        includeAllLink: true,
        allLabel: 'All',
      },
    });

    expect(html).toContain('href="/blog"');
    expect(html).toContain('href="/blog/tag/astro"');
  });

  it('generates Korean tag archives from Korean route projection', async () => {
    const koreanTagRoute = await readFile(
      join(process.cwd(), 'src/pages/ko/blog/tag/[tag].astro'),
      'utf8',
    );

    expect(koreanTagRoute).toContain('projectKoreanRoutes(');
    expect(koreanTagRoute).toContain('href={pathname}');
    expect(koreanTagRoute).toContain('basePath="/ko/blog"');
    expect(koreanTagRoute).toContain('canonical={canonical}');
    expect(koreanTagRoute).toContain('lang="ko"');
  });
});
