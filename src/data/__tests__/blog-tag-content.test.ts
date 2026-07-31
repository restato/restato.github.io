import { describe, expect, it } from 'vitest';
import { supportedLanguages } from '../tools/locales';
import {
  blogTagContentByLanguage,
  getBlogTagContent,
  inferBlogTagLanguage,
  selectBlogTagLanguage,
} from '../blog-tag-content';
import type { Language } from '../tools/types';

function post({
  slug,
  lang,
  title,
  description = title,
  date = '2026-01-01',
}: {
  slug: string;
  lang?: Language;
  title: string;
  description?: string;
  date?: string;
}) {
  return {
    slug,
    data: {
      lang,
      title,
      description,
      date: new Date(`${date}T00:00:00Z`),
    },
  };
}

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

  it.each<Language>(supportedLanguages)(
    'provides non-empty disclosure labels for %s',
    language => {
      const content = getBlogTagContent(language, 'topic', 2);
      expect(content.showMoreLabel).not.toHaveLength(0);
      expect(content.showLessLabel).not.toHaveLength(0);
    },
  );

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

  it.each<Language>(supportedLanguages)(
    'honors explicit %s article metadata so every registered locale is reachable',
    language => {
      expect(selectBlogTagLanguage('shared-tag', [
        post({ slug: language, lang: language, title: 'Shared article title' }),
      ])).toBe(language);
    },
  );

  it('selects Korean for the Latin jekyll tag from the matching article metadata', () => {
    expect(selectBlogTagLanguage('jekyll', [
      post({
        slug: 'welcome-to-jekyll',
        title: 'Jekyll 시작하기',
        description: 'Jekyll 블로그 시스템과 정적 사이트 생성기에 대한 소개입니다.',
      }),
    ])).toBe('ko');
  });

  it('keeps Japanese kanji and Traditional Chinese reachable through explicit metadata', () => {
    expect(selectBlogTagLanguage('漢字', [
      post({ slug: 'ja-kanji', lang: 'ja', title: '漢字入門' }),
    ])).toBe('ja');
    expect(selectBlogTagLanguage('漢字', [
      post({ slug: 'zh-hant', lang: 'zh-TW', title: '漢字入門' }),
    ])).toBe('zh-TW');
  });

  it('uses plurality, newest-post, and supported-locale order as deterministic tie breakers', () => {
    expect(selectBlogTagLanguage('mixed', [
      post({ slug: 'older-ko', lang: 'ko', title: '한국어', date: '2025-01-01' }),
      post({ slug: 'newer-en', lang: 'en', title: 'English', date: '2026-01-01' }),
      post({ slug: 'another-ko', lang: 'ko', title: '한국어', date: '2024-01-01' }),
    ])).toBe('ko');

    expect(selectBlogTagLanguage('mixed', [
      post({ slug: 'older-en', lang: 'en', title: 'English', date: '2025-01-01' }),
      post({ slug: 'newer-ko', lang: 'ko', title: '한국어', date: '2026-01-01' }),
    ])).toBe('ko');

    expect(selectBlogTagLanguage('mixed', [
      post({ slug: 'same-en', lang: 'en', title: 'English', date: '2026-01-01' }),
      post({ slug: 'same-ko', lang: 'ko', title: '한국어', date: '2026-01-01' }),
    ])).toBe('ko');
  });

  it('uses tag script only when no matching article exists', () => {
    expect(selectBlogTagLanguage('영감', [])).toBe('ko');
    expect(selectBlogTagLanguage('accessibility', [])).toBe('en');
  });
});
