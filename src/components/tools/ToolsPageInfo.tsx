import type { Language } from '../../data/tools/types';
import { catalogUi } from '../../i18n/tool-ui';

interface ToolsPageInfoProps {
  lang?: Language;
}

export default function ToolsPageInfo({ lang = 'en' }: ToolsPageInfoProps) {
  const ui = catalogUi[lang];
  const text = { heading: `ℹ️ ${ui.information}`, items: [ui.privacy, ui.free, ui.responsive] };

  return (
    <div className="mt-8 p-6 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)]">
      <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">{text.heading}</h2>
      <ul className="space-y-2 text-[var(--color-text-muted)]">
        {text.items.map(item => <li key={item}>• {item}</li>)}
      </ul>
    </div>
  );
}
