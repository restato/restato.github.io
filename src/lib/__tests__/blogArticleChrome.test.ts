// @vitest-environment node

import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import BlogArticle from '../../components/BlogArticle.astro';
import EmptyContent from './fixtures/EmptyContent.astro';
import {
  formatBlogArticleDate,
  getBlogArticleChrome,
} from '../blogArticleChrome';

const date = new Date('2026-08-01T12:00:00.000Z');

describe('blog article chrome', () => {
  it('preserves the existing English article labels and date presentation', () => {
    expect(formatBlogArticleDate(date, 'en')).toBe('August 1, 2026');
    expect(getBlogArticleChrome('en', 3)).toEqual({
      breadcrumbLabel: 'Breadcrumb',
      readingTime: '3 min read',
      readingTimeLabel: 'Estimated reading time: 3 minutes',
      verified: 'Verified',
      updated: 'Updated',
      tagsLabel: 'Article tags',
    });
  });

  it('uses Korean date, reading-time, verification, and accessibility labels', () => {
    expect(formatBlogArticleDate(date, 'ko')).toBe('2026년 8월 1일');
    expect(getBlogArticleChrome('ko', 3)).toEqual({
      breadcrumbLabel: '이동 경로',
      readingTime: '3분 읽기',
      readingTimeLabel: '예상 읽기 시간: 3분',
      verified: '검증',
      updated: '업데이트',
      tagsLabel: '글 태그',
    });
  });

  it('renders Korean chrome with localized navigation and semantic dates', async () => {
    const astro = await AstroContainer.create();
    const post = {
      slug: 'ko/opus-guide',
      body: '한국어 본문',
      data: {
        title: '오퍼스 가이드',
        description: '설명',
        date,
        updated: new Date('2026-08-03T12:00:00.000Z'),
        knowledgeId: 'solution:opus-guide',
        verifiedAt: new Date('2026-08-02T12:00:00.000Z'),
        tags: ['개발 도구'],
      },
      render: async () => ({
        Content: EmptyContent,
        headings: [],
        remarkPluginFrontmatter: {},
      }),
    };

    const html = await astro.renderToString(BlogArticle, {
      props: {
        post,
        lang: 'ko',
        indexUrl: '/ko/blog',
        tagUrlBuilder: (tag: string) => `/ko/blog/tag/${encodeURIComponent(tag)}`,
        labels: {
          home: '홈',
          blog: '블로그',
          backToList: '목록으로 돌아가기',
          share: '공유',
          copyLink: '링크 복사',
          copied: '링크가 복사되었습니다!',
        },
      },
    });

    expect(html).toContain('aria-label="이동 경로"');
    expect(html).toContain('2026년 8월 1일');
    expect(html).toContain('aria-label="예상 읽기 시간: 1분"');
    expect(html).toContain('>1분 읽기<');
    expect(html).toContain('aria-label="글 태그"');
    expect(html).toContain('href="/ko/blog/tag/%EA%B0%9C%EB%B0%9C%20%EB%8F%84%EA%B5%AC"');
    expect(html).toMatch(/검증\s*<time datetime="2026-08-02T12:00:00\.000Z"/u);
    expect(html).toMatch(/업데이트\s*<time datetime="2026-08-03T12:00:00\.000Z"/u);
  });
});
