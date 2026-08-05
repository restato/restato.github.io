export type BlogLocale = 'en' | 'ko';

export interface BlogTranslationData {
  lang?: string;
  translationKey?: string;
}

export interface BlogTranslationPost {
  slug: string;
  data: BlogTranslationData;
}

export interface BlogTranslationPair<Post extends BlogTranslationPost = BlogTranslationPost> {
  translationKey: string;
  slug: string;
  en?: Post;
  ko?: Post;
}

export interface BlogAlternate {
  lang: BlogLocale | 'x-default';
  url: string;
}

const pairedStoragePattern = /^(en|ko)\/([^/]+)$/u;

export function getStoredBlogLocale(
  id: string,
  _data: BlogTranslationData,
): BlogLocale | null {
  const match = pairedStoragePattern.exec(id);
  return match ? match[1] as BlogLocale : null;
}

export function getPublicBlogSlug(id: string): string {
  return pairedStoragePattern.exec(id)?.[2] ?? id;
}

export function groupBlogTranslations<Post extends BlogTranslationPost>(
  posts: readonly Post[],
): Map<string, BlogTranslationPair<Post>> {
  const pairs = new Map<string, BlogTranslationPair<Post>>();

  for (const post of posts) {
    const locale = getStoredBlogLocale(post.slug, post.data);
    const translationKey = post.data.translationKey;
    if (!locale || !translationKey) continue;

    const pair = pairs.get(translationKey) ?? {
      translationKey,
      slug: translationKey,
    };

    if (pair[locale]) {
      throw new Error(`translation pair ${translationKey} has duplicate ${locale} documents`);
    }

    pair[locale] = post;
    pairs.set(translationKey, pair);
  }

  return pairs;
}

export function getBlogRoute(locale: BlogLocale, slug: string): string {
  const normalizedSlug = slug.replace(/^\/+|\/+$/gu, '');
  const prefix = locale === 'ko' ? '/ko/blog' : '/blog';
  return `${prefix}/${normalizedSlug}/`;
}

export function getBlogAlternates(
  pair: BlogTranslationPair,
  site: URL | string,
): BlogAlternate[] {
  if (!pair.en || !pair.ko) return [];

  const englishUrl = new URL(getBlogRoute('en', pair.slug), site).toString();
  const koreanUrl = new URL(getBlogRoute('ko', pair.slug), site).toString();

  return [
    { lang: 'en', url: englishUrl },
    { lang: 'ko', url: koreanUrl },
    { lang: 'x-default', url: englishUrl },
  ];
}
