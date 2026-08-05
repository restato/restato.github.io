import { describe, expect, it } from 'vitest';
import { normalizeHeadAlternates } from '../../../i18n/urlUtils';
import {
  getBlogAlternates,
  groupBlogTranslations,
} from '../../../lib/blogTranslations';

const englishPost = {
  slug: 'en/production-seo-artifact',
  data: {
    lang: 'en',
    translationKey: 'production-seo-artifact',
  },
};

const koreanPost = {
  slug: 'ko/production-seo-artifact',
  data: {
    lang: 'ko',
    translationKey: 'production-seo-artifact',
  },
};

describe('localized blog SEO alternates', () => {
  it('normalizes a complete pair to one en, ko, and English x-default link', () => {
    const pair = groupBlogTranslations([englishPost, koreanPost]).get(
      'production-seo-artifact',
    );

    expect(normalizeHeadAlternates(getBlogAlternates(
      pair!,
      'https://restato.github.io/subpath',
    ))).toEqual([
      {
        lang: 'en',
        url: 'https://restato.github.io/blog/production-seo-artifact/',
      },
      {
        lang: 'ko',
        url: 'https://restato.github.io/ko/blog/production-seo-artifact/',
      },
      {
        lang: 'x-default',
        url: 'https://restato.github.io/blog/production-seo-artifact/',
      },
    ]);
  });

  it('does not fabricate alternates for incomplete or duplicate pair input', () => {
    const incompletePair = groupBlogTranslations([englishPost]).get(
      'production-seo-artifact',
    );

    expect(normalizeHeadAlternates(getBlogAlternates(
      incompletePair!,
      'https://restato.github.io/',
    ))).toEqual([]);
    expect(() => groupBlogTranslations([englishPost, { ...englishPost }])).toThrow(
      'translation pair production-seo-artifact has duplicate en documents',
    );
  });
});
