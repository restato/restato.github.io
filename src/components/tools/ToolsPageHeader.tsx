import type { Language } from '../../data/tools/types';
import { catalogUi, sharedToolUi } from '../../i18n/tool-ui';

interface ToolsPageHeaderProps {
  lang?: Language;
}

export default function ToolsPageHeader({ lang = 'en' }: ToolsPageHeaderProps) {
  const text = { home: sharedToolUi[lang].home, tools: sharedToolUi[lang].tools, heading: sharedToolUi[lang].catalogTitle, description: catalogUi[lang].description };

  return (
    <>
      <nav className="mb-5 text-sm">
        <ol className="flex items-center gap-2">
          <li>
            <a href={`/${lang}/`} className="text-[var(--text-muted)] hover:text-[var(--brand)]">
              {text.home}
            </a>
          </li>
          <li className="text-[var(--text-muted)]" aria-hidden="true">/</li>
          <li className="font-bold text-[var(--text-primary)]" aria-current="page">{text.tools}</li>
        </ol>
      </nav>
      <header className="fc-page-header border-b border-[var(--border-subtle)] pb-8">
        <p className="fc-eyebrow">RESTATO · WEB TOOLS</p>
        <h1>{text.heading}</h1>
        <p className="fc-page-description text-lg">{text.description}</p>
      </header>
    </>
  );
}
