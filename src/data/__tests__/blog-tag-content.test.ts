import { describe, expect, it } from 'vitest';
import { supportedLanguages } from '../tools/locales';
import {
  blogTagContentByLanguage,
  getBlogTagContent,
  inferBlogTagLanguage,
} from '../blog-tag-content';

describe('localized blog tag landing content', () => {
  it('provides distinct, substantive copy for every supported language', () => {
    expect(Object.keys(blogTagContentByLanguage).sort()).toEqual([...supportedLanguages].sort());

    const introductions = supportedLanguages.map(language => {
      const content = getBlogTagContent(language, 'topic', 2);
      expect(content.metaDescription.length).toBeGreaterThanOrEqual(60);
      expect(content.introduction.length).toBeGreaterThanOrEqual(70);
      expect(content.introduction).toContain('topic');
      return content.introduction;
    });

    expect(new Set(introductions)).toHaveLength(supportedLanguages.length);
  });

  it.each(['명언', '생각', '영감'])(
    'adds substantive Korean discovery context for the thin %s tag page',
    tag => {
      expect(inferBlogTagLanguage(tag)).toBe('ko');
      const content = getBlogTagContent('ko', tag, 1);
      expect(content.introduction).toContain(tag);
      expect(content.introduction.length).toBeGreaterThanOrEqual(70);
      expect(content.summary).toContain('1');
    },
  );

  it('keeps a representative English tag page natural and substantive', () => {
    expect(inferBlogTagLanguage('accessibility')).toBe('en');
    const content = getBlogTagContent('en', 'accessibility', 3);
    expect(content.summary).toBe('3 posts tagged with "accessibility"');
    expect(content.introduction).toContain('practical guidance');
    expect(content.introduction.length).toBeGreaterThanOrEqual(70);
  });
});
