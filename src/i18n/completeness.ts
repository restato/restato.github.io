import { supportedLanguages } from '../data/tools/locales';
import type { Language, ToolContent, ToolDefinition, ToolPrivacyMode } from '../data/tools/types';
import { sharedToolUi } from './tool-ui';

const siteUrl = 'https://restato.github.io';

export interface PublicationState {
  indexable: boolean;
  robots: 'index, follow' | 'noindex, follow';
  alternates: Array<{ lang: Language; url: string }>;
}

export interface CatalogCardContent {
  content: ToolContent;
  usedLanguage: Language;
  usesFallback: boolean;
  notice: string | null;
}

const nonEmpty = (value: string | undefined, minimum: number): boolean =>
  Boolean(value && value.trim().length >= minimum);

const privacyMarkers: Record<ToolPrivacyMode, RegExp> = {
  'local-only': /browser|브라우저|ブラウザ|浏览器|瀏覽器|navegador|Browser|navigateur|browser|ब्राउज़र/i,
  'local-with-assets': /WASM/i,
  'local-with-network-data': /exchange|환율|為替|汇率|匯率|cambio|câmbio|Wechselkurs|change|kurs|विनिमय/i,
  'peer-to-peer': /PeerJS/i,
};

function hasSubstantiveContent(content: ToolContent | undefined, privacyMode: ToolPrivacyMode): boolean {
  if (!content || content.status !== 'complete') return false;
  return nonEmpty(content.name, 2)
    && nonEmpty(content.title, 8)
    && nonEmpty(content.description, 24)
    && nonEmpty(content.searchIntent, 8)
    && nonEmpty(content.overview, 32)
    && content.steps.length >= 3
    && content.steps.every(step => nonEmpty(step, 4))
    && new Set(content.steps.map(step => step.trim())).size === content.steps.length
    && content.examples.length >= 1
    && content.examples.every(example => nonEmpty(example, 4))
    && content.limitations.length >= 1
    && content.limitations.every(limitation => nonEmpty(limitation, 8))
    && nonEmpty(content.privacy, 32)
    && privacyMarkers[privacyMode].test(content.privacy)
    && content.faq.length >= 2
    && content.faq.every(item => nonEmpty(item.question, 4) && nonEmpty(item.answer, 8));
}

export function isSubstantiveToolContent(tool: ToolDefinition, lang: Language): boolean {
  return hasSubstantiveContent(tool.content[lang], tool.privacyMode);
}

function toolUrl(tool: ToolDefinition, lang: Language): string {
  return tool.slug === 'anonymous-chat'
    ? `${siteUrl}/${lang}/anonymous-chat`
    : `${siteUrl}/${lang}/tools/${tool.slug}`;
}

export function getPublicationState(tool: ToolDefinition, lang: Language): PublicationState {
  const completeLanguages = tool.released
    ? supportedLanguages.filter(language => isSubstantiveToolContent(tool, language))
    : [];
  const indexable = tool.released && completeLanguages.includes(lang);
  return {
    indexable,
    robots: indexable ? 'index, follow' : 'noindex, follow',
    alternates: completeLanguages.map(language => ({ lang: language, url: toolUrl(tool, language) })),
  };
}

export function getCatalogCardContent(tool: ToolDefinition, lang: Language): CatalogCardContent {
  const requested = tool.content[lang];
  if (hasSubstantiveContent(requested, tool.privacyMode)) {
    return { content: requested!, usedLanguage: lang, usesFallback: false, notice: null };
  }

  const english = hasSubstantiveContent(tool.content.en, tool.privacyMode) ? tool.content.en : undefined;
  const korean = hasSubstantiveContent(tool.content.ko, tool.privacyMode) ? tool.content.ko : undefined;
  const fallback = english ?? korean;
  if (!fallback) throw new Error(`Missing fallback content for ${tool.slug}`);
  const usedLanguage: Language = english ? 'en' : korean ? 'ko' : lang;
  return {
    content: fallback,
    usedLanguage,
    usesFallback: true,
    notice: sharedToolUi[lang].fallbackNotice,
  };
}
