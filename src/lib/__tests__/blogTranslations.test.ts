import { describe, expect, it } from 'vitest';
import {
  getBlogAlternates,
  getBlogRoute,
  getPublicBlogSlug,
  getStoredBlogLocale,
  groupBlogTranslations,
} from '../blogTranslations';

interface TestPost {
  slug: string;
  data: {
    lang?: string;
    translationKey?: string;
  };
}

const englishPost: TestPost = {
  slug: 'en/claude-opus-5-migration-copilot-guide',
  data: {
    lang: 'en',
    translationKey: 'claude-opus-5-migration-copilot-guide',
  },
};

const koreanPost: TestPost = {
  slug: 'ko/claude-opus-5-migration-copilot-guide',
  data: {
    lang: 'ko',
    translationKey: 'claude-opus-5-migration-copilot-guide',
  },
};

describe('blog translation storage', () => {
  it('maps paired storage ids to stable public routes', () => {
    expect(getPublicBlogSlug('en/claude-opus-5-migration-copilot-guide')).toBe(
      'claude-opus-5-migration-copilot-guide',
    );
    expect(getBlogRoute('en', 'claude-opus-5-migration-copilot-guide')).toBe(
      '/blog/claude-opus-5-migration-copilot-guide/',
    );
    expect(getBlogRoute('ko', 'claude-opus-5-migration-copilot-guide')).toBe(
      '/ko/blog/claude-opus-5-migration-copilot-guide/',
    );
  });

  it('uses the exact storage prefix as the paired locale', () => {
    expect(getStoredBlogLocale(englishPost.slug, englishPost.data)).toBe('en');
    expect(getStoredBlogLocale(koreanPost.slug, { lang: 'en' })).toBe('ko');
  });

  it('declassifies storage ids with extra path segments', () => {
    expect(getStoredBlogLocale('en/guides/opus', { lang: 'en' })).toBeNull();
    expect(getStoredBlogLocale('ko/guides/opus', { lang: 'ko' })).toBeNull();
    expect(getPublicBlogSlug('en/guides/opus')).toBe('en/guides/opus');
  });

  it('keeps root-level posts as legacy entries', () => {
    expect(getStoredBlogLocale('building-blog-with-astro', { lang: 'ko' })).toBeNull();
    expect(getPublicBlogSlug('building-blog-with-astro')).toBe('building-blog-with-astro');
  });
});

describe('blog translation pairs', () => {
  it('groups one English and one Korean document by translationKey', () => {
    const pairs = groupBlogTranslations([englishPost, koreanPost]);
    expect(pairs.get('claude-opus-5-migration-copilot-guide')).toMatchObject({
      slug: 'claude-opus-5-migration-copilot-guide',
      en: englishPost,
      ko: koreanPost,
    });
  });

  it('excludes documents with missing or storage-mismatched translation keys', () => {
    const missingKey = {
      slug: 'en/no-key',
      data: { lang: 'en' },
    } satisfies TestPost;
    const mismatchedKey = {
      slug: 'ko/other-slug',
      data: { lang: 'ko', translationKey: 'other-key' },
    } satisfies TestPost;

    const pairs = groupBlogTranslations([missingKey, englishPost, mismatchedKey]);

    expect(pairs.size).toBe(1);
    expect(pairs.get('claude-opus-5-migration-copilot-guide')).toMatchObject({
      en: englishPost,
    });
    expect(pairs.has('other-key')).toBe(false);
  });

  it('does not complete a pair when counterpart storage leaves differ', () => {
    const mismatchedKoreanPost = {
      slug: 'ko/korean-storage-slug',
      data: {
        lang: 'ko',
        translationKey: 'claude-opus-5-migration-copilot-guide',
      },
    } satisfies TestPost;

    const pair = groupBlogTranslations([englishPost, mismatchedKoreanPost]).get(
      'claude-opus-5-migration-copilot-guide',
    );

    expect(pair).toMatchObject({ en: englishPost });
    expect(pair).not.toHaveProperty('ko');
    expect(getBlogAlternates(pair!, 'https://restato.github.io')).toEqual([]);
  });

  it('does not group root-level legacy posts even when they have translationKey', () => {
    const legacyPost = {
      slug: 'legacy-korean-post',
      data: { lang: 'ko', translationKey: 'legacy-korean-post' },
    } satisfies TestPost;

    expect(groupBlogTranslations([legacyPost])).toEqual(new Map());
  });

  it('rejects duplicate documents for the same translation locale', () => {
    const duplicateEnglish = {
      ...englishPost,
    };

    expect(() => groupBlogTranslations([englishPost, duplicateEnglish])).toThrow(
      'translation pair claude-opus-5-migration-copilot-guide has duplicate en documents',
    );
  });

  it('returns reciprocal alternates only for complete pairs', () => {
    const completePair = groupBlogTranslations([englishPost, koreanPost]).get(
      'claude-opus-5-migration-copilot-guide',
    );
    expect(completePair).toBeDefined();

    expect(getBlogAlternates(completePair!, 'https://restato.github.io/base')).toEqual([
      {
        lang: 'en',
        url: 'https://restato.github.io/blog/claude-opus-5-migration-copilot-guide/',
      },
      {
        lang: 'ko',
        url: 'https://restato.github.io/ko/blog/claude-opus-5-migration-copilot-guide/',
      },
      {
        lang: 'x-default',
        url: 'https://restato.github.io/blog/claude-opus-5-migration-copilot-guide/',
      },
    ]);

    const incompletePair = groupBlogTranslations([englishPost]).get(
      'claude-opus-5-migration-copilot-guide',
    );
    expect(getBlogAlternates(incompletePair!, new URL('https://restato.github.io/'))).toEqual([]);
  });
});
