// React hook for translations
import { useState, useEffect, useCallback } from 'react';
import { getLanguage, setLanguage, type Language } from './index';
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
type ExistingUiLanguage = 'ko' | 'en' | 'ja';

const getExistingUiLanguage = (language: Language): ExistingUiLanguage =>
  language === 'ko' || language === 'ja' ? language : 'en';

export function useTranslation() {
  const [lang, setLang] = useState<ExistingUiLanguage>('ko');

  useEffect(() => {
    // Set initial language
    setLang(getExistingUiLanguage(getLanguage()));

    // Listen for language changes
    const handleLanguageChange = (e: CustomEvent<Language>) => {
      setLang(getExistingUiLanguage(e.detail));
    };

    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange as EventListener);
    };
  }, []);

  const t = useCallback(<T extends Partial<Record<Language, string>> & { ko: string }>(
    translationObj: T
  ): string => {
    return translationObj[lang] || translationObj.en || translationObj.ko;
  }, [lang]);

  const changeLanguage = useCallback((newLang: Language) => {
    setLanguage(newLang);
    setLang(getExistingUiLanguage(newLang));
  }, []);

  return {
    lang,
    t,
    changeLanguage,
    translations,
  };
}

export { translations };
