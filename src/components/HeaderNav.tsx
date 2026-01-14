import { useTranslation } from '../i18n/useTranslation';

interface HeaderNavProps {
  currentPath: string;
}

const navItems = [
  { href: '/', labelKey: 'home' as const },
  { href: '/blog', labelKey: 'blog' as const },
  { href: '/articles', labelKey: 'articles' as const },
  { href: '/jobs', labelKey: 'jobs' as const },
  { href: '/tools', labelKey: 'tools' as const },
  { href: '/projects', labelKey: 'projects' as const },
  { href: '/about', labelKey: 'about' as const },
];

export default function HeaderNav({ currentPath }: HeaderNavProps) {
  const { t, translations } = useTranslation();
  const nav = translations.common.nav;

  const isActive = (href: string) => {
    return currentPath === href || (href !== '/' && currentPath.startsWith(href));
  };

  return (
    <ul className="hidden sm:flex items-center">
      {navItems.map((item) => (
        <li key={item.href}>
          <a
            href={item.href}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive(item.href)
                ? 'text-primary-600 dark:text-primary-400 bg-primary-500/10'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-card-hover)]'
            }`}
          >
            {t(nav[item.labelKey])}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function MobileNav({ currentPath }: HeaderNavProps) {
  const { t, translations } = useTranslation();
  const nav = translations.common.nav;

  const isActive = (href: string) => {
    return currentPath === href || (href !== '/' && currentPath.startsWith(href));
  };

  return (
    <ul className="px-4 py-3 space-y-1">
      {navItems.map((item) => (
        <li key={item.href}>
          <a
            href={item.href}
            className={`block py-2.5 px-4 rounded-lg font-medium transition-colors ${
              isActive(item.href)
                ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
                : 'text-[var(--color-text-muted)] hover:bg-[var(--color-card-hover)] hover:text-[var(--color-text)]'
            }`}
          >
            {t(nav[item.labelKey])}
          </a>
        </li>
      ))}
    </ul>
  );
}
