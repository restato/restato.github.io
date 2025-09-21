'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ko' | 'ja' | 'zh' | 'es' | 'fr' | 'de' | 'ru' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isLoaded: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, any> = {
  en: {},
  ko: {},
  ja: {},
  zh: {},
  es: {},
  fr: {},
  de: {},
  ru: {},
  hi: {},
};

// Load translations
async function loadTranslations() {
  const languages: Language[] = ['en', 'ko', 'ja', 'zh', 'es', 'fr', 'de', 'ru', 'hi'];
  
  for (const lang of languages) {
    try {
      console.log(`Loading translations for ${lang}...`);
      const response = await fetch(`/locales/${lang}/common.json`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      translations[lang] = data;
      console.log(`Successfully loaded ${lang} translations:`, Object.keys(data));
    } catch (error) {
      console.error(`Failed to load translations for ${lang}:`, error);
      // 기본값으로 빈 객체 설정
      translations[lang] = {};
    }
  }
  console.log('All translations loaded:', Object.keys(translations));
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('ko');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // 클라이언트 사이드에서만 실행되도록 보장
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // 번역 파일 로드
    loadTranslations().then(() => {
      setIsLoaded(true);
    });
    
    // localStorage에서 언어 설정 가져오기
    try {
      const savedLanguage = localStorage.getItem('language') as Language;
      if (savedLanguage && ['en', 'ko', 'ja', 'zh', 'es', 'fr', 'de', 'ru', 'hi'].includes(savedLanguage)) {
        setLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Failed to access localStorage:', error);
    }
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;
    
    try {
      localStorage.setItem('language', language);
    } catch (error) {
      console.error('Failed to save language to localStorage:', error);
    }
  }, [language, isClient]);

  const t = (key: string): string => {
    if (!isLoaded || !translations[language]) {
      return key;
    }
    
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isLoaded }}>
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
