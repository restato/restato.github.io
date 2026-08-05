import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import type { Language } from '../../data/tools/types';
import * as urlUtils from '../urlUtils';

const headerSource = readFileSync('src/components/Header.astro', 'utf8');
const mainLayoutSource = readFileSync('src/layouts/MainLayout.astro', 'utf8');

describe('blog language destinations', () => {
  it('selects the paired Korean URL and falls back to English', () => {
    const resolveLanguageDestination = Reflect.get(
      urlUtils,
      'resolveLanguageDestination',
    ) as undefined | ((urls: Partial<Record<Language, string>>, lang: Language) => string);
    const urls = { en: '/blog/opus-guide/', ko: '/ko/blog/opus-guide/' };

    expect(resolveLanguageDestination).toBeTypeOf('function');
    if (!resolveLanguageDestination) return;
    expect(resolveLanguageDestination(urls, 'ko')).toBe('/ko/blog/opus-guide/');
    expect(resolveLanguageDestination(urls, 'ja')).toBe('/blog/opus-guide/');
    expect(resolveLanguageDestination({ ...urls, ko: '' }, 'ko')).toBe('/blog/opus-guide/');
  });

  it('returns a safe empty destination when neither the request nor English exists', () => {
    const resolveLanguageDestination = Reflect.get(
      urlUtils,
      'resolveLanguageDestination',
    ) as undefined | ((urls: Partial<Record<Language, string>>, lang: Language) => string);

    expect(resolveLanguageDestination).toBeTypeOf('function');
    if (!resolveLanguageDestination) return;
    expect(resolveLanguageDestination({ ko: '/ko/blog/opus-guide/' }, 'ja')).toBe('');
  });

  it('constructs English and Korean blog URLs while preserving suffixes', () => {
    expect(urlUtils.buildLanguageUrl('/blog/?page=2#latest', 'ko'))
      .toBe('/ko/blog/?page=2#latest');
    expect(urlUtils.buildLanguageUrl('/ko/blog/opus-guide/?from=header#examples', 'en'))
      .toBe('/blog/opus-guide/?from=header#examples');
  });

  it('falls unsupported blog languages back to the unprefixed English route', () => {
    const destination = urlUtils.buildLanguageUrl('/ko/blog/opus-guide/?from=header#examples', 'ja');

    expect(destination).toBe('/blog/opus-guide/?from=header#examples');
    expect(destination).not.toContain('/ja/blog');
  });

  it('generates only real English and Korean blog alternates', () => {
    expect(urlUtils.getAlternateUrls('/ko/blog/opus-guide/?draft=1#examples', 'https://restato.github.io'))
      .toEqual([
        { lang: 'en', url: 'https://restato.github.io/blog/opus-guide/' },
        { lang: 'ko', url: 'https://restato.github.io/ko/blog/opus-guide/' },
      ]);
    expect(urlUtils.getAlternateUrls('/blog/', 'https://restato.github.io'))
      .toEqual([
        { lang: 'en', url: 'https://restato.github.io/blog/' },
        { lang: 'ko', url: 'https://restato.github.io/ko/blog/' },
      ]);
  });
});

describe('article language selector source contract', () => {
  it('renders both selectors for explicit destinations even when body language is locked', () => {
    expect(headerSource).toContain('const showLanguageSelector = !lockLanguage || Boolean(languageUrls);');
    expect(headerSource.match(/\{showLanguageSelector &&/g)).toHaveLength(2);
    expect(mainLayoutSource).toContain("alternate.lang !== 'x-default'");
    expect(mainLayoutSource).toContain('languageUrls={resolvedLanguageUrls}');
  });

  it('assigns an explicit destination before label-only language updates', () => {
    const assignIndex = headerSource.indexOf('window.location.assign(destination)');
    const labelUpdateIndex = headerSource.indexOf('updateNavLabels(lang)', assignIndex);
    const dispatchIndex = headerSource.indexOf("window.dispatchEvent(new CustomEvent('languageChange'", assignIndex);
    const codeAfterAssign = headerSource.slice(assignIndex, labelUpdateIndex);

    expect(assignIndex).toBeGreaterThanOrEqual(0);
    expect(labelUpdateIndex).toBeGreaterThan(assignIndex);
    expect(dispatchIndex).toBeGreaterThan(assignIndex);
    expect(codeAfterAssign).toContain('return;');
  });
});
