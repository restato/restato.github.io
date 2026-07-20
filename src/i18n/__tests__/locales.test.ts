import { beforeEach, describe, expect, it, vi } from 'vitest';

import { supportedLanguages } from '../../data/tools/locales';
import type { Language } from '../../data/tools/types';
import { getLanguage, localeMetadata } from '../index';
import {
  buildLanguageUrl,
  getAlternateUrls,
  getBasePathFromUrl,
  normalizeHeadAlternates,
  parseLanguage,
} from '../urlUtils';

const expectedLanguages = [
  'ko',
  'en',
  'ja',
  'zh-CN',
  'zh-TW',
  'es',
  'pt',
  'de',
  'fr',
  'it',
  'id',
  'hi',
] as const satisfies readonly Language[];

describe('locale metadata', () => {
  it('defines metadata for exactly the 12 supported languages', () => {
    expect(supportedLanguages).toEqual(expectedLanguages);
    expect(Object.keys(localeMetadata)).toEqual(expectedLanguages);

    for (const language of expectedLanguages) {
      expect(localeMetadata[language]).toEqual({
        label: expect.any(String),
        html: expect.any(String),
        og: expect.stringContaining('_'),
        dir: 'ltr',
      });
      expect(localeMetadata[language].label.trim()).not.toBe('');
      expect(localeMetadata[language].html.trim()).not.toBe('');
    }
  });
});

describe('parseLanguage', () => {
  it.each(expectedLanguages)('parses the exact /%s prefix', (language) => {
    expect(parseLanguage(`/${language}/tools/json/`)).toBe(language);
    expect(parseLanguage(`/${language}?source=home#tools`)).toBe(language);
  });

  it.each([
    '/ZH-CN/tools/',
    '/zh-cn/tools/',
    '/zh-tw/tools/',
    '/EN/tools/',
    '/english/tools/',
    '/enough/tools/',
    '/tools/en/',
  ])('rejects non-exact or mixed-case prefix %s', (pathname) => {
    expect(parseLanguage(pathname)).toBeNull();
  });
});

describe('localized URLs', () => {
  it('preserves the direct route, query, and hash when changing languages', () => {
    expect(buildLanguageUrl('/en/tools/json/?indent=2#result', 'zh-CN'))
      .toBe('/zh-CN/tools/json/?indent=2#result');
    expect(buildLanguageUrl('/tools/json?indent=2#result', 'zh-TW'))
      .toBe('/zh-TW/tools/json?indent=2#result');
    expect(buildLanguageUrl('/ko/?ref=header#clusters', 'es'))
      .toBe('/es/?ref=header#clusters');
  });

  it('does not mistake query or hash text for a locale prefix', () => {
    expect(getBasePathFromUrl('/tools/json?next=/en/tools#lang=ja'))
      .toBe('/tools/json?next=/en/tools#lang=ja');
  });

  it('keeps unrelated routes outside localized routing', () => {
    expect(buildLanguageUrl('/blog/post/?lang=en#intro', 'fr'))
      .toBe('/blog/post/?lang=en#intro');
  });

  it('routes unsupported game locales to the existing English game route', () => {
    expect(buildLanguageUrl('/ko/games/snake?mode=fast#play', 'fr'))
      .toBe('/en/games/snake?mode=fast#play');
    expect(buildLanguageUrl('/en/games/snake', 'ja')).toBe('/ja/games/snake');
  });

  it('creates normalized, unique, trailing-slash alternates', () => {
    const alternates = getAlternateUrls('/en/tools/json?draft=1#result', 'https://restato.github.io/');

    expect(alternates).toHaveLength(12);
    expect(new Set(alternates.map(({ lang }) => lang)).size).toBe(12);
    expect(alternates.find(({ lang }) => lang === 'en')?.url)
      .toBe('https://restato.github.io/en/tools/json/');
    expect(alternates.find(({ lang }) => lang === 'zh-CN')?.url)
      .toBe('https://restato.github.io/zh-CN/tools/json/');
  });

  it('adds exactly one English x-default while removing duplicate alternates', () => {
    const alternates = normalizeHeadAlternates([
      { lang: 'en', url: 'https://restato.github.io/en/tools' },
      { lang: 'en', url: 'https://restato.github.io/en/tools/?duplicate=1' },
      { lang: 'ko', url: 'https://restato.github.io/ko/tools' },
      { lang: 'x-default', url: 'https://example.com/wrong' },
    ]);

    expect(alternates.filter(({ lang }) => lang === 'en')).toHaveLength(1);
    expect(alternates.filter(({ lang }) => lang === 'x-default')).toEqual([
      { lang: 'x-default', url: 'https://restato.github.io/en/tools/' },
    ]);
  });
});

describe('browser language fallback', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState({}, '', '/');
    vi.restoreAllMocks();
  });

  it.each([
    ['zh-CN', 'zh-CN'],
    ['zh-SG', 'zh-CN'],
    ['zh-TW', 'zh-TW'],
    ['zh-HK', 'zh-TW'],
    ['pt-BR', 'pt'],
    ['es-MX', 'es'],
    ['hi-IN', 'hi'],
  ] as const)('maps browser locale %s to %s', (browserLocale, expected) => {
    vi.spyOn(window.navigator, 'language', 'get').mockReturnValue(browserLocale);
    expect(getLanguage()).toBe(expected);
  });

  it('prefers an exact URL prefix and persists it', () => {
    window.history.replaceState({}, '', '/zh-TW/tools/json/');
    vi.spyOn(window.navigator, 'language', 'get').mockReturnValue('en-US');

    expect(getLanguage()).toBe('zh-TW');
    expect(localStorage.getItem('lang')).toBe('zh-TW');
  });

  it('ignores an unsupported stored value and falls back to Korean', () => {
    localStorage.setItem('lang', 'xx');
    vi.spyOn(window.navigator, 'language', 'get').mockReturnValue('ar-EG');

    expect(getLanguage()).toBe('ko');
  });
});
