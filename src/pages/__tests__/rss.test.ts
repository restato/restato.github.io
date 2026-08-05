// @vitest-environment node

import type { APIContext } from 'astro';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getCollection } = vi.hoisted(() => ({ getCollection: vi.fn() }));

vi.mock('astro:content', () => ({ getCollection }));

import { GET } from '../rss.xml';

describe('English canonical blog RSS', () => {
  beforeEach(() => {
    getCollection.mockResolvedValue([
      {
        slug: 'en/opus-guide',
        data: {
          lang: 'en',
          translationKey: 'opus-guide',
          title: 'Opus guide',
          description: 'A practical guide.',
          date: new Date('2026-08-01T00:00:00.000Z'),
          draft: false,
        },
      },
      {
        slug: 'ko/opus-guide',
        data: {
          lang: 'ko',
          translationKey: 'opus-guide',
          title: '오퍼스 가이드',
          description: '실용 가이드입니다.',
          date: new Date('2026-08-01T00:00:00.000Z'),
          draft: false,
        },
      },
    ]);
  });

  it('emits English channel metadata and canonical English items', async () => {
    const response = await GET({
      site: new URL('https://restato.github.io/'),
    } as APIContext);
    const xml = await response.text();

    expect(xml).toContain('<title>Restato Blog</title>');
    expect(xml).toContain('<description>Development logs, learnings, and thoughts.</description>');
    expect(xml).toContain('<language>en-us</language>');
    expect(xml).toContain('<title>Opus guide</title>');
    expect(xml).toContain('<link>https://restato.github.io/blog/opus-guide/</link>');
    expect(xml).not.toContain('오퍼스 가이드');
  });
});
