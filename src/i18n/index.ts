import { supportedLanguages } from '../data/tools/locales';
import type { Language } from '../data/tools/types';
import { parseLanguage } from './urlUtils';

export type { Language } from '../data/tools/types';

export const localeMetadata: Record<Language, {
  label: string;
  html: string;
  og: string;
  dir: 'ltr';
}> = {
  ko: { label: '한국어', html: 'ko', og: 'ko_KR', dir: 'ltr' },
  en: { label: 'English', html: 'en', og: 'en_US', dir: 'ltr' },
  ja: { label: '日本語', html: 'ja', og: 'ja_JP', dir: 'ltr' },
  'zh-CN': { label: '简体中文', html: 'zh-CN', og: 'zh_CN', dir: 'ltr' },
  'zh-TW': { label: '繁體中文', html: 'zh-TW', og: 'zh_TW', dir: 'ltr' },
  es: { label: 'Español', html: 'es', og: 'es_ES', dir: 'ltr' },
  pt: { label: 'Português', html: 'pt', og: 'pt_PT', dir: 'ltr' },
  de: { label: 'Deutsch', html: 'de', og: 'de_DE', dir: 'ltr' },
  fr: { label: 'Français', html: 'fr', og: 'fr_FR', dir: 'ltr' },
  it: { label: 'Italiano', html: 'it', og: 'it_IT', dir: 'ltr' },
  id: { label: 'Bahasa Indonesia', html: 'id', og: 'id_ID', dir: 'ltr' },
  hi: { label: 'हिन्दी', html: 'hi', og: 'hi_IN', dir: 'ltr' },
};

export const languages = Object.fromEntries(
  supportedLanguages.map(language => [language, localeMetadata[language].label]),
) as Record<Language, string>;

export const defaultLang: Language = 'ko';

function getBrowserLanguage(browserLocale: string): Language | null {
  const normalized = browserLocale.replace('_', '-');
  const lower = normalized.toLowerCase();

  if (lower === 'zh-tw' || lower.startsWith('zh-hk') || lower.startsWith('zh-mo')) {
    return 'zh-TW';
  }
  if (lower.startsWith('zh')) return 'zh-CN';

  const primary = lower.split('-')[0];
  return supportedLanguages.find(language => language.toLowerCase() === primary) ?? null;
}

// Get language from URL, localStorage, or browser preference.
export function getLanguage(): Language {
  if (typeof window === 'undefined') return defaultLang;

  const urlLanguage = parseLanguage(window.location.pathname);
  if (urlLanguage) {
    localStorage.setItem('lang', urlLanguage);
    return urlLanguage;
  }

  const stored = localStorage.getItem('lang');
  if (stored && supportedLanguages.includes(stored as Language)) return stored as Language;

  return getBrowserLanguage(navigator.language) ?? defaultLang;
}

export function setLanguage(lang: Language): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('lang', lang);
  window.dispatchEvent(new CustomEvent('languageChange', { detail: lang }));
}

export function t(translations: Partial<Record<Language, string>>, lang: Language): string {
  return translations[lang] || translations[defaultLang] || '';
}
