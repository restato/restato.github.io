import type { Language } from '../../data/tools/types';
import { catalogUi } from '../../i18n/tool-ui';

interface ToolsPageInfoProps {
  lang?: Language;
}

export default function ToolsPageInfo({ lang = 'en' }: ToolsPageInfoProps) {
  const ui = catalogUi[lang];
  const text = { heading: `ℹ️ ${ui.information}`, items: [ui.privacy, ui.free, ui.responsive] };

  return (
    <aside className="fc-surface fc-surface-soft mt-10 p-5 md:p-6">
      <h2 className="mb-4 text-lg font-bold text-[var(--text-primary)]">{text.heading}</h2>
      <ul className="m-0 grid list-none gap-2 p-0 text-sm text-[var(--text-muted)] md:grid-cols-3">
        {text.items.map(item => (
          <li key={item} className="border-l-2 border-[var(--accent)] pl-3">{item}</li>
        ))}
      </ul>
    </aside>
  );
}
