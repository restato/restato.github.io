import { readFileSync } from 'node:fs';
import { describe, expect, it, vi } from 'vitest';

import type { Language } from '../../data/tools/types';
import * as urlUtils from '../urlUtils';

const headerSource = readFileSync('src/components/Header.astro', 'utf8');
const mainLayoutSource = readFileSync('src/layouts/MainLayout.astro', 'utf8');

type LanguageUrls = Partial<Record<Language, string>>;

function extractInlineFunction(name: string): string {
  const start = headerSource.indexOf(`function ${name}(`);
  if (start === -1) throw new Error(`inline function ${name} was not found`);
  const bodyStart = headerSource.indexOf('{', start);
  let depth = 0;
  let quote = '';
  let escaped = false;

  for (let index = bodyStart; index < headerSource.length; index += 1) {
    const character = headerSource[index];
    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (character === '\\') {
        escaped = true;
      } else if (character === quote) {
        quote = '';
      }
      continue;
    }
    if (character === "'" || character === '"' || character === '`') {
      quote = character;
    } else if (character === '{') {
      depth += 1;
    } else if (character === '}') {
      depth -= 1;
      if (depth === 0) return headerSource.slice(start, index + 1);
    }
  }

  throw new Error(`inline function ${name} was not closed`);
}

function compileInlineFunction<FunctionType>(
  name: string,
  dependencies: Record<string, unknown> = {},
): FunctionType {
  const dependencyNames = Object.keys(dependencies);
  const factory = new Function(
    ...dependencyNames,
    `'use strict'; ${extractInlineFunction(name)}; return ${name};`,
  );
  return factory(...Object.values(dependencies)) as FunctionType;
}

function createApplyLanguageHarness(
  languageUrls: LanguageUrls | undefined,
  options: {
    pathname?: string;
    search?: string;
    hash?: string;
    supportsRouting?: boolean;
    builtUrl?: string;
  } = {},
) {
  const setItem = vi.fn();
  const assign = vi.fn();
  const updateNavLabels = vi.fn();
  const updateNavHrefs = vi.fn();
  const updateLanguageUi = vi.fn();
  const dispatchEvent = vi.fn();
  const supportsLangRouting = vi.fn(() => options.supportsRouting ?? false);
  const buildLangUrl = vi.fn((path: string) => options.builtUrl ?? path);
  const resolveLangDestination = compileInlineFunction<(
    urls: LanguageUrls,
    lang: Language,
  ) => string>('resolveLangDestination');
  class TestCustomEvent {
    type: string;
    detail: Language;

    constructor(type: string, init: { detail: Language }) {
      this.type = type;
      this.detail = init.detail;
    }
  }
  const location = {
    pathname: options.pathname ?? '/blog/opus-guide/',
    search: options.search ?? '?preview=1',
    hash: options.hash ?? '#examples',
    href: '',
    assign,
  };
  const applyLanguage = compileInlineFunction<(lang: Language) => void>('applyLanguage', {
    localStorage: { setItem },
    languageUrls,
    resolveLangDestination,
    updateNavLabels,
    updateNavHrefs,
    updateLanguageUi,
    window: { location, dispatchEvent },
    CustomEvent: TestCustomEvent,
    supportsLangRouting,
    buildLangUrl,
  });

  return {
    applyLanguage,
    setItem,
    assign,
    updateNavLabels,
    updateNavHrefs,
    updateLanguageUi,
    dispatchEvent,
    supportsLangRouting,
    buildLangUrl,
    location,
  };
}

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

  it('normalizes owned supported destinations and treats English-only as usable', () => {
    const normalizeLanguageUrls = Reflect.get(
      urlUtils,
      'normalizeLanguageUrls',
    ) as undefined | ((urls: unknown) => LanguageUrls | undefined);

    expect(normalizeLanguageUrls).toBeTypeOf('function');
    if (!normalizeLanguageUrls) return;
    expect(normalizeLanguageUrls({
      en: ' /blog/opus-guide/ ',
      ko: '   ',
      ja: 42,
      unsupported: '/unsupported/blog/opus-guide/',
    })).toEqual({ en: '/blog/opus-guide/' });
    expect(normalizeLanguageUrls({ ko: ' /ko/blog/opus-guide/ ' }))
      .toEqual({ ko: '/ko/blog/opus-guide/' });
  });

  it.each([
    undefined,
    null,
    [],
    'not-a-map',
    {},
    { en: '   ' },
    { unsupported: '/unsupported/blog/opus-guide/' },
  ])('rejects an unusable destination map %#', (candidate) => {
    const normalizeLanguageUrls = Reflect.get(
      urlUtils,
      'normalizeLanguageUrls',
    ) as undefined | ((urls: unknown) => LanguageUrls | undefined);

    expect(normalizeLanguageUrls).toBeTypeOf('function');
    if (!normalizeLanguageUrls) return;
    expect(normalizeLanguageUrls(candidate)).toBeUndefined();
  });

  it('derives navigation from alternates only when locked article mode requests it', () => {
    const resolveLayoutLanguageUrls = Reflect.get(
      urlUtils,
      'resolveLayoutLanguageUrls',
    ) as undefined | ((options: {
      languageUrls?: unknown;
      alternateUrls?: readonly { lang: string; url: unknown }[];
      deriveFromAlternates: boolean;
    }) => LanguageUrls | undefined);
    const alternateUrls = [
      { lang: 'en', url: 'https://production.example/blog/opus-guide/' },
      { lang: 'ko', url: 'https://production.example/ko/blog/opus-guide/' },
      { lang: 'x-default', url: 'https://production.example/blog/opus-guide/' },
      { lang: 'unsupported', url: 'https://production.example/unsupported/blog/opus-guide/' },
    ];

    expect(resolveLayoutLanguageUrls).toBeTypeOf('function');
    if (!resolveLayoutLanguageUrls) return;
    expect(resolveLayoutLanguageUrls({
      alternateUrls,
      deriveFromAlternates: false,
    })).toBeUndefined();
    expect(resolveLayoutLanguageUrls({
      languageUrls: { en: ' /preview/blog/opus-guide/ ' },
      alternateUrls,
      deriveFromAlternates: false,
    })).toEqual({ en: '/preview/blog/opus-guide/' });
    expect(resolveLayoutLanguageUrls({
      alternateUrls,
      deriveFromAlternates: true,
    })).toEqual({
      en: 'https://production.example/blog/opus-guide/',
      ko: 'https://production.example/ko/blog/opus-guide/',
    });
    expect(resolveLayoutLanguageUrls({
      languageUrls: {},
      alternateUrls,
      deriveFromAlternates: true,
    })).toBeUndefined();
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
    expect(headerSource).toContain('const languageUrls = normalizeLanguageUrls(rawLanguageUrls);');
    expect(headerSource).toContain('const showLanguageSelector = !lockLanguage || Boolean(languageUrls);');
    expect(headerSource.match(/\{showLanguageSelector &&/g)).toHaveLength(2);
    expect(mainLayoutSource).toContain("lockLanguage && type === 'article'");
    expect(mainLayoutSource).toContain('resolveLayoutLanguageUrls({');
    expect(mainLayoutSource).toContain('languageUrls={resolvedLanguageUrls}');
  });

  it('assigns an exact paired destination before any label-only update', () => {
    const harness = createApplyLanguageHarness({
      en: '/blog/opus-guide/',
      ko: '/ko/blog/opus-guide/',
    });

    harness.applyLanguage('ko');

    expect(harness.setItem).toHaveBeenCalledWith('lang', 'ko');
    expect(harness.assign).toHaveBeenCalledWith('/ko/blog/opus-guide/');
    expect(harness.setItem.mock.invocationCallOrder[0])
      .toBeLessThan(harness.assign.mock.invocationCallOrder[0]);
    expect(harness.updateNavLabels).not.toHaveBeenCalled();
    expect(harness.updateNavHrefs).not.toHaveBeenCalled();
    expect(harness.updateLanguageUi).not.toHaveBeenCalled();
    expect(harness.dispatchEvent).not.toHaveBeenCalled();
  });

  it('assigns the English fallback before any label-only update', () => {
    const harness = createApplyLanguageHarness({
      en: '/blog/opus-guide/',
      ko: '/ko/blog/opus-guide/',
    });

    harness.applyLanguage('ja');

    expect(harness.setItem).toHaveBeenCalledWith('lang', 'ja');
    expect(harness.assign).toHaveBeenCalledWith('/blog/opus-guide/');
    expect(harness.setItem.mock.invocationCallOrder[0])
      .toBeLessThan(harness.assign.mock.invocationCallOrder[0]);
    expect(harness.updateNavLabels).not.toHaveBeenCalled();
    expect(harness.dispatchEvent).not.toHaveBeenCalled();
  });

  it('keeps normal language feedback when no explicit destination resolves', () => {
    const harness = createApplyLanguageHarness({ ko: '/ko/blog/opus-guide/' });

    harness.applyLanguage('ja');

    expect(harness.setItem).toHaveBeenCalledWith('lang', 'ja');
    expect(harness.assign).not.toHaveBeenCalled();
    expect(harness.updateNavLabels).toHaveBeenCalledWith('ja');
    expect(harness.updateNavHrefs).toHaveBeenCalledWith('ja');
    expect(harness.updateLanguageUi).toHaveBeenCalledWith('ja');
    expect(harness.dispatchEvent).toHaveBeenCalledWith(expect.objectContaining({
      type: 'languageChange',
      detail: 'ja',
    }));
    expect(harness.setItem.mock.invocationCallOrder[0])
      .toBeLessThan(harness.updateNavLabels.mock.invocationCallOrder[0]);
    expect(harness.updateNavLabels.mock.invocationCallOrder[0])
      .toBeLessThan(harness.dispatchEvent.mock.invocationCallOrder[0]);
  });

  it('keeps generic navigation on the current path with its query and hash', () => {
    const harness = createApplyLanguageHarness(undefined, {
      pathname: '/tools/json/',
      search: '?preview=1',
      hash: '#result',
      supportsRouting: true,
      builtUrl: '/ja/tools/json/?preview=1#result',
    });

    harness.applyLanguage('ja');

    expect(harness.assign).not.toHaveBeenCalled();
    expect(harness.supportsLangRouting).toHaveBeenCalledWith('/tools/json/?preview=1#result');
    expect(harness.buildLangUrl).toHaveBeenCalledWith('/tools/json/?preview=1#result', 'ja');
    expect(harness.location.href).toBe('/ja/tools/json/?preview=1#result');
  });
});
