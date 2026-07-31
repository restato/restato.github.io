// React hook for translations
import { createContext, createElement, useState, useEffect, useCallback, useContext, type ReactNode } from 'react';
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
type ExistingUiLanguage = 'ko' | 'en' | 'ja';

const getExistingUiLanguage = (language: Language): ExistingUiLanguage =>
  language === 'ko' || language === 'ja' ? language : 'en';

const InitialLanguageContext = createContext<Language | null>(null);

export function TranslationProvider({
  initialLanguage,
  children,
}: {
  initialLanguage: Language;
  children: ReactNode;
}) {
  return createElement(
    InitialLanguageContext.Provider,
    { value: initialLanguage },
    children,
  );
}

export function useTranslation(explicitLanguage?: Language) {
  const contextLanguage = useContext(InitialLanguageContext);
  const initialLanguage = explicitLanguage ?? contextLanguage;
  const [routingLang, setRoutingLang] = useState<Language>(() => initialLanguage ?? defaultLang);
  const [lang, setLang] = useState<ExistingUiLanguage>(() =>
    getExistingUiLanguage(initialLanguage ?? defaultLang)
  );

  useEffect(() => {
    if (initialLanguage) {
      setRoutingLang(initialLanguage);
      setLang(getExistingUiLanguage(initialLanguage));
      return;
    }

    // Set initial language
    const currentLanguage = getLanguage();
    setRoutingLang(currentLanguage);
    setLang(getExistingUiLanguage(currentLanguage));

    // Listen for language changes
    const handleLanguageChange = (e: CustomEvent<Language>) => {
      setRoutingLang(e.detail);
      setLang(getExistingUiLanguage(e.detail));
    };

    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange as EventListener);
    };
  }, [initialLanguage]);

  const t = useCallback(<T extends Partial<Record<Language, string>> & { ko: string }>(
    translationObj: T
  ): string => {
    return translationObj[lang] || translationObj.en || translationObj.ko;
  }, [lang]);

  const changeLanguage = useCallback((newLang: Language) => {
    setLanguage(newLang);
    setRoutingLang(newLang);
    setLang(getExistingUiLanguage(newLang));
  }, []);

  return {
    lang,
    routingLang,
    t,
    changeLanguage,
    translations,
  };
}

export { translations };
