import { supportedLanguages } from '../data/tools/locales';
import { supportedLanguagePattern } from '../data/tools/supportedLanguages.mjs';
import type { Language } from '../data/tools/types';

export { supportedLanguagePattern };
export const languagePrefixPattern = new RegExp(
  `^/(${supportedLanguagePattern})(?=/|$|[?#])`,
);

const LANG_SUPPORTED_PATHS = [
  '/',
  '/tools',
  '/anonymous-chat',
  '/games',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/disclaimer',
];
const GAME_LANGUAGES = new Set<Language>(['ko', 'en', 'ja']);

function splitPathSuffix(value: string): { path: string; suffix: string } {
  const suffixIndex = value.search(/[?#]/);
  if (suffixIndex === -1) return { path: value, suffix: '' };
  return { path: value.slice(0, suffixIndex), suffix: value.slice(suffixIndex) };
}

export function parseLanguage(pathname: string): Language | null {
  const match = pathname.match(languagePrefixPattern);
  return match ? match[1] as Language : null;
}

export const getLanguageFromUrl = parseLanguage;

export function getBasePathFromUrl(pathname: string): string {
  const withoutLanguage = pathname.replace(languagePrefixPattern, '');
  return withoutLanguage.startsWith('/') ? withoutLanguage : `/${withoutLanguage}`;
}

export function supportsLanguageRouting(pathname: string): boolean {
  const { path } = splitPathSuffix(getBasePathFromUrl(pathname));
  return LANG_SUPPORTED_PATHS.some(
    supportedPath => supportedPath === '/'
      ? path === '/' || path === ''
      : path === supportedPath || path.startsWith(`${supportedPath}/`),
  );
}

export function buildLanguageUrl(pathname: string, lang: Language): string {
  const basePath = getBasePathFromUrl(pathname);
  if (!supportsLanguageRouting(basePath)) return basePath;
  const { path } = splitPathSuffix(basePath);
  const routeLanguage = (path === '/games' || path.startsWith('/games/')) && !GAME_LANGUAGES.has(lang)
    ? 'en'
    : lang;
  return `/${routeLanguage}${basePath}`;
}

function normalizeTrailingSlash(pathname: string): string {
  if (pathname === '/') return pathname;
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

export function getAlternateUrls(
  pathname: string,
  siteUrl: string,
): { lang: Language; url: string }[] {
  const basePath = getBasePathFromUrl(pathname);
  if (!supportsLanguageRouting(basePath)) return [];

  const { path } = splitPathSuffix(basePath);
  const origin = siteUrl.replace(/\/+$/, '');
  const normalizedPath = normalizeTrailingSlash(path || '/');

  return supportedLanguages.map(lang => ({
    lang,
    url: `${origin}/${lang}${normalizedPath}`,
  }));
}

export interface HeadAlternateUrl {
  lang: string;
  url: string;
}

export function normalizeHeadAlternates(alternates: HeadAlternateUrl[]): HeadAlternateUrl[] {
  const unique = new Map<string, HeadAlternateUrl>();

  for (const alternate of alternates) {
    if (alternate.lang === 'x-default' || unique.has(alternate.lang)) continue;
    const url = new URL(alternate.url);
    url.search = '';
    url.hash = '';
    if (!url.pathname.endsWith('/')) url.pathname += '/';
    unique.set(alternate.lang, { lang: alternate.lang, url: url.toString() });
  }

  const normalized = [...unique.values()];
  const english = unique.get('en');
  if (english) normalized.push({ lang: 'x-default', url: english.url });
  return normalized;
}
