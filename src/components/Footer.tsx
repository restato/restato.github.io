import { useState, useEffect } from 'react';
import { getLanguage, type Language } from '../i18n';
import { commonTranslations } from '../i18n/translations/common';

export default function Footer() {
  const [lang, setLang] = useState<Language>('ko');
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    setLang(getLanguage());

    const handleLanguageChange = (e: CustomEvent<Language>) => {
      setLang(e.detail);
    };

    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange as EventListener);
    };
  }, []);

  const t = (translations: Record<Language, string>): string => {
    return translations[lang] || translations['ko'];
  };

  return (
    <footer className="mt-auto border-t border-[var(--color-border)]">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex flex-col items-center gap-6">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 font-bold text-lg group">
            <span className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center text-white text-sm shadow-lg shadow-primary-500/20">
              R
            </span>
            <span>Restato</span>
          </a>

          {/* Social Links */}
          <div className="flex items-center gap-2">
            <a
              href="https://www.linkedin.com/in/direcision/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-card-hover)] transition-colors"
              aria-label="LinkedIn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5 2.5 2.5 0 0 0 4.98 3.5zM3 9h4v12H3zm7 0h3.8v1.7h.1c.5-.9 1.8-1.9 3.7-1.9 4 0 4.7 2.5 4.7 5.8V21h-4v-5.6c0-1.3 0-3.1-1.9-3.1s-2.2 1.5-2.2 3V21h-4z" />
              </svg>
            </a>
            <a
              href="mailto:direcision@gmail.com"
              className="p-2.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-card-hover)] transition-colors"
              aria-label="Email"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18v10H3V7z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="m3 8 9 6 9-6" />
              </svg>
            </a>
            <a
              href="https://github.com/restato"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-card-hover)] transition-colors"
              aria-label="GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a
              href="/rss.xml"
              className="p-2.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-card-hover)] transition-colors"
              aria-label="RSS Feed"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20C5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1Z"/>
              </svg>
            </a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-[var(--color-text-muted)]">
            &copy; {currentYear} Restato. {t(commonTranslations.footer.builtWith)} Astro.
          </p>
        </div>
      </div>
    </footer>
  );
}
