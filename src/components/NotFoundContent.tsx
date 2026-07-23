import { useTranslation } from '../i18n/useTranslation';

export default function NotFoundContent() {
  const { lang, t, translations } = useTranslation();
  const notFound = translations.common.notFound;
  const idx = translations.common.index;
  const toolLinks = [
    { href: `/${lang}/tools/`, label: { ko: '도구 검색', en: 'Search tools', ja: 'ツールを検索' } },
    { href: `/${lang}/tools/json/`, label: idx.jsonFormatter },
    { href: `/${lang}/tools/qr-code/`, label: idx.qrCode },
  ];

  return (
    <section className="fc-page fc-reading">
      <header className="fc-page-header">
        <p className="fc-eyebrow">404 · RESTATO</p>
        <h1>{t(notFound.title)}</h1>
        <p className="fc-page-description">{t(notFound.description)}</p>
        <a
          href="/"
          className="fc-button fc-button-primary mt-3 w-fit"
        >
          {t(notFound.backHome)}
          <span aria-hidden="true">→</span>
        </a>
      </header>

      <nav className="fc-surface overflow-hidden" aria-label={t({ ko: '유용한 도구', en: 'Useful tools', ja: '便利なツール' })}>
        <ul className="m-0 list-none divide-y divide-[var(--border-subtle)] p-0">
          {toolLinks.map(link => (
            <li key={link.href}>
              <a
                href={link.href}
                className="flex min-h-14 items-center justify-between gap-4 px-4 py-3 font-bold text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-soft)]"
              >
                {t(link.label)}
                <span className="text-[var(--text-muted)]" aria-hidden="true">→</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
