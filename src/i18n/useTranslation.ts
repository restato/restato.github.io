// React hook for translations
import { useState, useEffect, useCallback } from 'react';
import { getLanguage, setLanguage, type Language } from './index';
import { toolTranslations } from './translations/tools';
import { gameTranslations } from './translations/games';
import { commonTranslations } from './translations/common';

// Merged translations
const translations = {
  tools: toolTranslations,
  games: gameTranslations,
  common: commonTranslations,
} as const;

type TranslationCategory = keyof typeof translations;

export function useTranslation() {
  const [lang, setLang] = useState<Language>('ko');

  useEffect(() => {
    // Set initial language
    setLang(getLanguage());

    // Listen for language changes
    const handleLanguageChange = (e: CustomEvent<Language>) => {
      setLang(e.detail);
    };

    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange as EventListener);
    };
  }, []);

  const t = useCallback(<T extends Record<Language, string>>(
    translationObj: T
  ): string => {
    return translationObj[lang] || translationObj['ko'];
  }, [lang]);

  const changeLanguage = useCallback((newLang: Language) => {
    setLanguage(newLang);
    setLang(newLang);
  }, []);

  return {
    lang,
    t,
    changeLanguage,
    translations,
  };
}

export { translations };
