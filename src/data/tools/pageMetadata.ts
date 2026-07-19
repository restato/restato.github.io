import { getIndexableLanguages, getTool } from './registry';
import type { Language, ToolContent, ToolDefinition } from './types';

const siteUrl = 'https://restato.github.io';
const localizedRedirectToolSlugs = new Set(['image-crop-resizer']);

export interface ToolAlternateUrl {
  lang: Language;
  url: string;
}

export interface LocalizedToolPageMetadata {
  content: ToolContent;
  privacy: string;
  robots: 'index, follow' | 'noindex, follow';
  alternateUrls: ToolAlternateUrl[];
}

export function getLocalizedToolPageMetadata(
  tool: ToolDefinition,
  lang: Language,
): LocalizedToolPageMetadata {
  const content = tool.content[lang] ?? tool.content.ko;
  if (!content) {
    throw new Error(`Missing localized content for ${tool.slug}`);
  }

  const indexableLanguages = getIndexableLanguages(tool);
  const isIndexable = indexableLanguages.includes(lang);

  return {
    content,
    privacy: content.privacy,
    robots: isIndexable ? 'index, follow' : 'noindex, follow',
    alternateUrls: indexableLanguages.map(language => ({
      lang: language,
      url: tool.slug === 'anonymous-chat'
        ? `${siteUrl}/${language}/anonymous-chat`
        : `${siteUrl}/${language}/tools/${tool.slug}`,
    })),
  };
}

export function isIndexableLocalizedToolUrl(url: string): boolean {
  const pathname = new URL(url, siteUrl).pathname;
  const toolMatch = pathname.match(/^\/(ko|en|ja)\/tools\/([^/]+)\/?$/);
  const anonymousChatMatch = pathname.match(/^\/(ko|en|ja)\/anonymous-chat\/?$/);
  const match = toolMatch ?? anonymousChatMatch;

  if (!match) return true;

  const [, lang, slug = 'anonymous-chat'] = match;
  if (toolMatch && localizedRedirectToolSlugs.has(slug)) return false;

  const tool = getTool(slug);

  return !tool || getIndexableLanguages(tool).includes(lang as Language);
}
