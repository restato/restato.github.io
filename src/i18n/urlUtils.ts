// URL utilities for language-based routing
import { type Language, languages, defaultLang } from './index';

// Paths that support language routing
const LANG_SUPPORTED_PATHS = ['/tools', '/anonymous-chat', '/games'];

// Detect language from URL path
export function getLanguageFromUrl(pathname: string): Language | null {
  const match = pathname.match(/^\/(ko|en|ja)(\/|$)/);
  return match ? (match[1] as Language) : null;
}

// Get the base path without language prefix
export function getBasePathFromUrl(pathname: string): string {
  return pathname.replace(/^\/(ko|en|ja)(\/|$)/, '/');
}

// Check if a path supports language routing
export function supportsLanguageRouting(pathname: string): boolean {
  const basePath = getBasePathFromUrl(pathname);
  return LANG_SUPPORTED_PATHS.some(
    (p) => basePath === p || basePath.startsWith(p + '/')
  );
}

// Build URL with language prefix
export function buildLanguageUrl(pathname: string, lang: Language): string {
  const basePath = getBasePathFromUrl(pathname);

  // Only add language prefix for supported paths
  if (!supportsLanguageRouting(basePath)) {
    return basePath;
  }

  // Add language prefix
  return `/${lang}${basePath}`;
}

// Get alternate URLs for hreflang tags
export function getAlternateUrls(
  pathname: string,
  siteUrl: string
): { lang: Language; url: string }[] {
  const basePath = getBasePathFromUrl(pathname);

  if (!supportsLanguageRouting(basePath)) {
    return [];
  }

  return (Object.keys(languages) as Language[]).map((lang) => ({
    lang,
    url: `${siteUrl}/${lang}${basePath}`,
  }));
}
