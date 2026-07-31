import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  getBlogTagEntries,
  getBlogTagRouteEntries,
  toBlogTagSlug,
  toLegacyBlogTagPath,
} from '../blogTags';

describe('blog tag URLs', () => {
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
    const [tagRoute, blogIndex, blogPost] = await Promise.all([
      readFile(join(process.cwd(), 'src/pages/blog/tag/[tag].astro'), 'utf8'),
      readFile(join(process.cwd(), 'src/pages/blog/index.astro'), 'utf8'),
      readFile(join(process.cwd(), 'src/pages/blog/[...slug].astro'), 'utf8'),
    ]);

    expect(tagRoute).toContain('getBlogTagRouteEntries');
    expect(tagRoute).toContain("route.kind === 'canonical'");
    expect(tagRoute).toContain("candidate.kind === 'redirect'");
    expect(tagRoute).toContain('params: { tag: route.filesystemSegment }');
    expect(tagRoute).toContain('id="blog-tag-legacy-aliases"');
    expect(tagRoute).toContain('data-canonical-slug={toBlogTagSlug(tag)}');
    expect(tagRoute).toContain('toBlogTagSlug(postTag) === route.canonicalSlug');
    expect(blogIndex).toContain('href={`/blog/tag/${tag.slug}`}');
    expect(blogPost).toContain('href={`/blog/tag/${toBlogTagSlug(tag)}`}');
  });
});
