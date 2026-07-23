// React hook for translations
import { useState, useEffect, useCallback } from 'react';
import { defaultLang, getLanguage, setLanguage, type Language } from './index';
import { toolTranslations } from './translations/tools';
import { gameTranslations } from './translations/games';
import { commonTranslations } from './translations/common';
import { chatTranslations } from './translations/chat';

// Merged translations
const translations = {
  tools: toolTranslations,
  games: gameTranslations,
  common: commonTranslations,
  chat: chatTranslations,
} as const;

type TranslationCategory = keyof typeof translations;

export function useTranslation(initialLang?: Language) {
  const [lang, setLang] = useState<Language>(initialLang ?? defaultLang);

  useEffect(() => {
    if (initialLang) {
      setLang(initialLang);
      return;
    }

    setLang(getLanguage());

    // Listen for language changes
    const handleLanguageChange = (e: CustomEvent<Language>) => {
      setLang(e.detail);
    };

    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange as EventListener);
    };
  }, [initialLang]);

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
