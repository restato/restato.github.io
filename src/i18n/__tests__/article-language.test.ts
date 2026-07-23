import { describe, expect, it } from 'vitest';
import { selectArticleLanguage } from '../article-language';

describe('selectArticleLanguage', () => {
  it('prefers an explicit supported article language', () => {
    expect(selectArticleLanguage({
      lang: 'fr',
      title: '한국어 제목',
      description: '설명',
    })).toBe('fr');
  });

  it.each([
    ['한국어 제목', 'ko'],
    ['日本語の記事', 'ja'],
    ['हिन्दी लेख', 'hi'],
    ['臺灣開發指南', 'zh-TW'],
    ['简体中文开发指南', 'zh-CN'],
  ] as const)('infers %s deterministically as %s', (title, expected) => {
    expect(selectArticleLanguage({ title, description: '' })).toBe(expected);
  });

  it('uses English as the terminal deterministic fallback', () => {
    expect(selectArticleLanguage({
      title: 'Plain Latin title',
      description: 'No explicit locale metadata',
    })).toBe('en');
  });
});
