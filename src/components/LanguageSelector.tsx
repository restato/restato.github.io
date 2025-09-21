'use client';

import React from 'react';
import { Select } from '@chakra-ui/react';
import { ChevronDownIcon } from 'lucide-react';
import { useLanguage } from './LanguageProvider';

type Language = 'en' | 'ko' | 'ja' | 'zh' | 'es' | 'fr' | 'de' | 'ru' | 'hi';

const languageNames: Record<Language, string> = {
  en: 'English',
  ko: '한국어',
  ja: '日本語',
  zh: '中文',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  ru: 'Русский',
  hi: 'हिन्दी',
};

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <Select
      value={language}
      onChange={(e) => setLanguage(e.target.value as Language)}
      w="120px"
      size="sm"
      borderRadius="lg"
      icon={<ChevronDownIcon />}
      _focus={{
        borderColor: 'brand.500',
        boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
      }}
    >
      {Object.entries(languageNames).map(([code, name]) => (
        <option key={code} value={code}>
          {name}
        </option>
      ))}
    </Select>
  );
}