'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ko' | 'ja' | 'zh' | 'es' | 'fr' | 'de' | 'ru';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string | Record<string, string>>> = {
  en: {},
  ko: {},
  ja: {},
  zh: {},
  es: {},
  fr: {},
  de: {},
  ru: {},
};

// Load translations
async function loadTranslations() {
  const languages: Language[] = ['en', 'ko', 'ja', 'zh', 'es', 'fr', 'de', 'ru'];
  
  for (const lang of languages) {
    try {
      const response = await fetch(`/locales/${lang}/common.json`);
      const data = await response.json();
      translations[lang] = data;
    } catch (error) {
      console.error(`Failed to load translations for ${lang}:`, error);
    }
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('ko');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadTranslations().then(() => {
      setIsLoaded(true);
    });
    
    // Get language from localStorage or browser language
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    } else {
      const browserLang = navigator.language.split('-')[0] as Language;
      if (['en', 'ko', 'ja', 'zh', 'es', 'fr', 'de', 'ru'].includes(browserLang)) {
        setLanguage(browserLang);
      } else {
        // Default to Korean if browser language is not supported
        setLanguage('ko');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    if (!isLoaded) return key;
    
    const keys = key.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}