import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  getBlogTagEntries,
  getBlogTagRouteEntries,
  toBlogTagSlug,
  toLegacyBlogTagSegment,
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

    expect(toLegacyBlogTagSegment('AI Agent')).toBe('AI%20Agent');
    expect(toLegacyBlogTagSegment('개발 도구')).toBe('%EA%B0%9C%EB%B0%9C%20%EB%8F%84%EA%B5%AC');
    expect(routes).toEqual([
      { kind: 'canonical', param: 'ai', label: 'AI', canonicalSlug: 'ai' },
      { kind: 'canonical', param: 'ai-agent', label: 'AI Agent', canonicalSlug: 'ai-agent' },
      { kind: 'canonical', param: 'c%2B%2B', label: 'C++', canonicalSlug: 'c%2B%2B' },
      { kind: 'canonical', param: 'openai', label: 'OpenAI', canonicalSlug: 'openai' },
      { kind: 'canonical', param: '%EA%B0%9C%EB%B0%9C-%EB%8F%84%EA%B5%AC', label: '개발 도구', canonicalSlug: '%EA%B0%9C%EB%B0%9C-%EB%8F%84%EA%B5%AC' },
      { kind: 'redirect', param: 'AI', label: 'AI', canonicalSlug: 'ai' },
      { kind: 'redirect', param: 'AI%20Agent', label: 'AI Agent', canonicalSlug: 'ai-agent' },
      { kind: 'redirect', param: 'OpenAI', label: 'OpenAI', canonicalSlug: 'openai' },
      { kind: 'redirect', param: '%EA%B0%9C%EB%B0%9C%20%EB%8F%84%EA%B5%AC', label: '개발 도구', canonicalSlug: '%EA%B0%9C%EB%B0%9C-%EB%8F%84%EA%B5%AC' },
      { kind: 'redirect', param: 'C%2B%2B', label: 'C++', canonicalSlug: 'c%2B%2B' },
    ]);

    expect(new Set(routes.map(route => route.param)).size).toBe(routes.length);
    expect(routes.filter(route => route.kind === 'redirect')).not.toContainEqual(
      expect.objectContaining({ param: 'ai', canonicalSlug: 'ai' }),
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
    expect(tagRoute).toContain('id="blog-tag-legacy-aliases"');
    expect(tagRoute).toContain('data-canonical-slug={toBlogTagSlug(tag)}');
    expect(tagRoute).toContain('toBlogTagSlug(postTag) === route.canonicalSlug');
    expect(blogIndex).toContain('href={`/blog/tag/${tag.slug}`}');
    expect(blogPost).toContain('href={`/blog/tag/${toBlogTagSlug(tag)}`}');
  });
});
