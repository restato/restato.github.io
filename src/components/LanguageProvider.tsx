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

interface TranslationObject {
  [key: string]: string | TranslationObject;
}

const translations: Record<Language, TranslationObject> = {
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

// 브라우저 언어 감지 함수
function detectBrowserLanguage(): Language {
  if (typeof window === 'undefined') return 'en'; // 서버 사이드에서는 기본값
  
  const supportedLanguages: Language[] = ['en', 'ko', 'ja', 'zh', 'es', 'fr', 'de', 'ru', 'hi'];
  
  // navigator.language와 navigator.languages 확인
  const browserLanguages = [
    navigator.language,
    ...(navigator.languages || [])
  ].map(lang => lang.toLowerCase());
  
  // 정확한 매치 찾기 (예: 'ko-KR' -> 'ko')
  for (const browserLang of browserLanguages) {
    const langCode = browserLang.split('-')[0] as Language;
    if (supportedLanguages.includes(langCode)) {
      return langCode;
    }
  }
  
  // 매치되지 않으면 영어를 기본값으로
  return 'en';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en'); // 기본값을 'en'으로 변경
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
    
    // 언어 설정 우선순위: localStorage > 브라우저 언어 > 기본값
    try {
      const savedLanguage = localStorage.getItem('language') as Language;
      if (savedLanguage && ['en', 'ko', 'ja', 'zh', 'es', 'fr', 'de', 'ru', 'hi'].includes(savedLanguage)) {
        setLanguage(savedLanguage);
      } else {
        // localStorage에 저장된 언어가 없으면 브라우저 언어 감지
        const browserLanguage = detectBrowserLanguage();
        setLanguage(browserLanguage);
        // 감지된 언어를 localStorage에 저장
        localStorage.setItem('language', browserLanguage);
      }
    } catch (error) {
      console.error('Failed to access localStorage:', error);
      // localStorage 접근 실패 시에도 브라우저 언어 감지
      const browserLanguage = detectBrowserLanguage();
      setLanguage(browserLanguage);
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
    let value: string | TranslationObject | undefined = translations[language];
    
    for (const k of keys) {
      if (typeof value === 'object' && value !== null) {
        value = value[k];
      } else {
        value = undefined;
        break;
      }
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
