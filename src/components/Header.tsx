import { useState, useEffect } from 'react';
import { getLanguage, type Language } from '../i18n';
import { commonTranslations } from '../i18n/translations/common';
import LanguageSelector from './LanguageSelector';
import { getBasePathFromUrl, getLanguageFromUrl, buildLanguageUrl, supportsLanguageRouting } from '../i18n/urlUtils';

interface NavItem {
  href: string;
  labelKey: keyof typeof commonTranslations.nav;
}

const navItems: NavItem[] = [
  { href: '/', labelKey: 'home' },
  { href: '/blog', labelKey: 'blog' },
  { href: '/tools', labelKey: 'tools' },
  { href: '/games', labelKey: 'games' },
  { href: '/about', labelKey: 'about' },
];

export default function Header() {
  const [lang, setLang] = useState<Language>('ko');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');

  useEffect(() => {
    setLang(getLanguage());
    setCurrentPath(window.location.pathname);

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

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (href: string): boolean => {
    // Normalize both paths by removing language prefix for comparison
    const normalizedCurrent = getBasePathFromUrl(currentPath);
    const normalizedHref = getBasePathFromUrl(href);
    return normalizedCurrent === normalizedHref ||
      (normalizedHref !== '/' && normalizedCurrent.startsWith(normalizedHref));
  };

  // Get the appropriate href based on current language
  const getNavHref = (baseHref: string): string => {
    if (supportsLanguageRouting(baseHref)) {
      return buildLanguageUrl(baseHref, lang);
    }
    return baseHref;
  };

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-bg)]/80 backdrop-blur-lg border-b border-[var(--color-border)]">
      <nav className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 font-bold text-lg group">
          <span className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center text-white text-sm shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-shadow">
            R
          </span>
          <span className="hidden sm:inline text-[var(--color-text)]">Restato</span>
        </a>

        {/* Navigation */}
        <div className="flex items-center gap-1">
          <ul className="hidden sm:flex items-center">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={getNavHref(item.href)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-primary-600 dark:text-primary-400 bg-primary-500/10'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-card-hover)]'
                  }`}
                >
                  {t(commonTranslations.nav[item.labelKey])}
                </a>
              </li>
            ))}
          </ul>

          {/* Language Selector */}
          <div className="hidden sm:block ml-2">
            <LanguageSelector />
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="ml-2 p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-card-hover)] transition-colors"
            aria-label={t(commonTranslations.ui.darkMode)}
          >
            <svg className="w-5 h-5 hidden dark:block" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg className="w-5 h-5 block dark:hidden" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="sm:hidden p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-card-hover)] transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden border-t border-[var(--color-border)] bg-[var(--color-bg)]">
          <ul className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={getNavHref(item.href)}
                  className={`block py-2.5 px-4 rounded-lg font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
                      : 'text-[var(--color-text-muted)] hover:bg-[var(--color-card-hover)] hover:text-[var(--color-text)]'
                  }`}
                >
                  {t(commonTranslations.nav[item.labelKey])}
                </a>
              </li>
            ))}
          </ul>
          {/* Mobile Language Selector */}
          <div className="px-4 pb-3">
            <LanguageSelector />
          </div>
        </div>
      )}
    </header>
  );
}
