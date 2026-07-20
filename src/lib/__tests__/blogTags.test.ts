import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getBlogTagEntries, toBlogTagSlug } from '../blogTags';

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

  it('uses canonical slugs for generated tag routes and every tag link', async () => {
    const [tagRoute, blogIndex, blogPost] = await Promise.all([
      readFile(join(process.cwd(), 'src/pages/blog/tag/[tag].astro'), 'utf8'),
      readFile(join(process.cwd(), 'src/pages/blog/index.astro'), 'utf8'),
      readFile(join(process.cwd(), 'src/pages/blog/[...slug].astro'), 'utf8'),
    ]);

    expect(tagRoute).toContain('params: { tag: slug }');
    expect(tagRoute).toContain('toBlogTagSlug(postTag) === slug');
    expect(blogIndex).toContain('href={`/blog/tag/${tag.slug}`}');
    expect(blogPost).toContain('href={`/blog/tag/${toBlogTagSlug(tag)}`}');
  });
});
