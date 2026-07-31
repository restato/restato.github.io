import { getIndexableLanguages, getPublishedTools, getTool } from './registry';
import { supportedLanguages } from './locales';
import type { Language, ToolContent, ToolDefinition } from './types';
import { supportedLanguagePattern } from '../../i18n/urlUtils';
import { getCatalogCardContent, getPublicationState, isSubstantiveToolContent } from '../../i18n/completeness';

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

export interface ToolCatalogPublicationState {
  robots: 'index, follow' | 'noindex, follow';
  alternateUrls: ToolAlternateUrl[];
}

const isCatalogLanguageComplete = (lang: Language): boolean => {
  const tools = getPublishedTools();
  return tools.length > 0 && tools.every(tool => isSubstantiveToolContent(tool, lang));
};

export function getToolCatalogPublicationState(lang: Language): ToolCatalogPublicationState {
  const indexableLanguages = supportedLanguages.filter(isCatalogLanguageComplete);
  return {
    robots: indexableLanguages.includes(lang) ? 'index, follow' : 'noindex, follow',
    alternateUrls: indexableLanguages.map(language => ({
      lang: language,
      url: `${siteUrl}/${language}/tools/`,
    })),
  };
}

export function getLocalizedToolPageMetadata(
  tool: ToolDefinition,
  lang: Language,
): LocalizedToolPageMetadata {
  const { content } = getCatalogCardContent(tool, lang);
  const state = getPublicationState(tool, lang);

  return {
    content,
    privacy: content.privacy,
    robots: state.robots,
    alternateUrls: state.alternates,
  };
}

export function isIndexableLocalizedToolUrl(url: string): boolean {
  const pathname = new URL(url, siteUrl).pathname;
  const toolMatch = pathname.match(new RegExp(`^/(${supportedLanguagePattern})/tools/([^/]+)/?$`));
  const toolHubMatch = pathname.match(new RegExp(`^/(${supportedLanguagePattern})/tools/?$`));
  const anonymousChatMatch = pathname.match(new RegExp(`^/(${supportedLanguagePattern})/anonymous-chat/?$`));
  if (toolHubMatch) {
    return getToolCatalogPublicationState(toolHubMatch[1] as Language).robots === 'index, follow';
  }

  const match = toolMatch ?? anonymousChatMatch;

  if (!match) return true;

  const [, lang, slug = 'anonymous-chat'] = match;
  if (toolMatch && localizedRedirectToolSlugs.has(slug)) return false;

  const tool = getTool(slug);

  return !tool || getIndexableLanguages(tool).includes(lang as Language);
}
