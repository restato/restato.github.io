import { useState, useEffect } from 'react';
import { languages, getLanguage, setLanguage, type Language } from '../i18n';
import { buildLanguageUrl, supportsLanguageRouting } from '../i18n/urlUtils';

export default function LanguageSelector() {
  const [currentLang, setCurrentLang] = useState<Language>('ko');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setCurrentLang(getLanguage());

    const handleLanguageChange = (e: CustomEvent<Language>) => {
      setCurrentLang(e.detail);
    };

    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange as EventListener);
    };
  }, []);

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
    setCurrentLang(lang);
    setIsOpen(false);

    // Navigate to language-specific URL if supported
    const currentPath = window.location.pathname;
    if (supportsLanguageRouting(currentPath)) {
      const newUrl = buildLanguageUrl(currentPath, lang);
      if (newUrl !== currentPath) {
        window.location.href = newUrl;
      }
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 py-1 rounded-lg text-sm
          bg-[var(--color-card)] hover:bg-[var(--color-card-hover)]
          border border-[var(--color-border)] transition-colors"
        aria-label="Select language"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
        <span>{languages[currentLang]}</span>
        <svg className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-1 py-1 min-w-[100px] rounded-lg shadow-lg z-50
            bg-[var(--color-card)] border border-[var(--color-border)]">
            {(Object.entries(languages) as [Language, string][]).map(([code, name]) => (
              <button
                key={code}
                onClick={() => handleSelect(code)}
                className={`w-full px-3 py-1.5 text-left text-sm hover:bg-[var(--color-card-hover)] transition-colors
                  ${currentLang === code ? 'text-primary-500 font-medium' : 'text-[var(--color-text)]'}`}
              >
                {name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
