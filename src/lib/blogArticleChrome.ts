import type { BlogLocale } from './blogTranslations';

export interface BlogArticleChrome {
  breadcrumbLabel: string;
  readingTime: string;
  readingTimeLabel: string;
  verified: string;
  updated: string;
  tagsLabel: string;
}

const dateLocales: Record<BlogLocale, string> = {
  en: 'en-US',
  ko: 'ko-KR',
};

export function formatBlogArticleDate(date: Date, locale: BlogLocale): string {
  return date.toLocaleDateString(dateLocales[locale], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getBlogArticleChrome(
  locale: BlogLocale,
  readingTime: number,
): BlogArticleChrome {
  if (locale === 'ko') {
    return {
      breadcrumbLabel: '이동 경로',
      readingTime: `${readingTime}분 읽기`,
      readingTimeLabel: `예상 읽기 시간: ${readingTime}분`,
      verified: '검증',
      updated: '업데이트',
      tagsLabel: '글 태그',
    };
  }

  return {
    breadcrumbLabel: 'Breadcrumb',
    readingTime: `${readingTime} min read`,
    readingTimeLabel: `Estimated reading time: ${readingTime} ${readingTime === 1 ? 'minute' : 'minutes'}`,
    verified: 'Verified',
    updated: 'Updated',
    tagsLabel: 'Article tags',
  };
}
