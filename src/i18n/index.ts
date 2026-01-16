// i18n utility for multilingual support
export const languages = {
  ko: '한국어',
  en: 'English',
  ja: '日本語',
} as const;

export type Language = keyof typeof languages;

export const defaultLang: Language = 'ko';

// Get language from URL, localStorage, or browser preference
export function getLanguage(): Language {
  if (typeof window === 'undefined') return defaultLang;

  // Priority 1: URL path (e.g., /ko/tools, /en/tools)
  const urlMatch = window.location.pathname.match(/^\/(ko|en|ja)(\/|$)/);
  if (urlMatch && urlMatch[1] in languages) {
    const urlLang = urlMatch[1] as Language;
    // Sync localStorage with URL
    localStorage.setItem('lang', urlLang);
    return urlLang;
  }

  // Priority 2: localStorage
  const stored = localStorage.getItem('lang');
  if (stored && stored in languages) return stored as Language;

  // Priority 3: Browser preference
  const browserLang = navigator.language.split('-')[0];
  if (browserLang in languages) return browserLang as Language;

  return defaultLang;
}

// Set language to localStorage
export function setLanguage(lang: Language): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('lang', lang);
  window.dispatchEvent(new CustomEvent('languageChange', { detail: lang }));
}

// Translation function
export function t(translations: Record<Language, string>, lang: Language): string {
  return translations[lang] || translations[defaultLang];
}
