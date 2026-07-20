import type { Language } from '../../data/tools/types';
import { catalogUi, sharedToolUi } from '../../i18n/tool-ui';

interface ToolsPageHeaderProps {
  lang?: Language;
}

export default function ToolsPageHeader({ lang = 'en' }: ToolsPageHeaderProps) {
  const text = { home: sharedToolUi[lang].home, tools: sharedToolUi[lang].tools, heading: sharedToolUi[lang].catalogTitle, description: catalogUi[lang].description };

  return (
    <>
      <nav className="text-sm mb-6">
        <ol className="flex items-center gap-2">
          <li><a href={`/${lang}/`} className="text-[var(--color-text-muted)] hover:text-primary-500">{text.home}</a></li>
          <li className="text-[var(--color-text-muted)]">/</li>
          <li className="text-[var(--color-text)]">{text.tools}</li>
        </ol>
      </nav>
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4">{text.heading}</h1>
        <p className="text-[var(--color-text-muted)] text-lg">{text.description}</p>
      </header>
    </>
  );
}
