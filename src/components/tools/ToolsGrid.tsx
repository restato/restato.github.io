import { useState } from 'react';
import type { Language } from '../../i18n';
import { getLocalizedToolHref } from './toolLinks';
import { catalogUi, sharedToolUi } from '../../i18n/tool-ui';

interface Tool {
  slug: string;
  title: string | { ko: string; en: string; ja: string };
  description: string | { ko: string; en: string; ja: string };
  icon: string;
  category: string;
}

interface Category {
  id: string;
  label: string | { ko: string; en: string; ja: string };
}

interface ToolsGridProps {
  lang: Language;
  tools: Tool[];
  categories: Category[];
}

export default function ToolsGrid({ lang, tools, categories }: ToolsGridProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTools = selectedCategory === 'all'
    ? tools
    : tools.filter(tool => tool.category === selectedCategory);

  const getLocalizedText = (obj: { ko: string; en: string; ja: string }) => {
    return obj[lang as keyof typeof obj] || obj.en || obj.ko;
  };
  const getDisplayText = (value: Tool['title']) =>
    typeof value === 'string' ? value : getLocalizedText(value);


  return (
    <div>
      {/* Category Filters */}
      <div
        className="-mx-4 mb-6 flex flex-nowrap gap-2 overflow-x-auto px-4 pb-2 md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
        role="group"
        aria-label={sharedToolUi[lang].tools}
      >
        {categories.map((category) => (
          <button
            type="button"
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            aria-pressed={selectedCategory === category.id}
            className={`fc-chip shrink-0 border transition-colors
              ${selectedCategory === category.id
                ? 'border-[var(--brand)] bg-[var(--brand)] text-[var(--surface-raised)]'
                : 'border-[var(--border-subtle)] hover:border-[var(--brand)] hover:text-[var(--brand)]'
              }`}
          >
            {typeof category.label === 'string' ? category.label : getLocalizedText(category.label)}
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      {filteredTools.length > 0 ? (
        <div className="fc-surface overflow-hidden">
          <ul className="m-0 grid list-none p-0 md:grid-cols-2 lg:grid-cols-3">
            {filteredTools.map((tool) => (
              <li key={tool.slug} className="border-b border-[var(--border-subtle)] md:border-r">
                <a
                  href={tool.slug.startsWith('/') ? tool.slug : getLocalizedToolHref(tool.slug, lang)}
                  className="group flex min-h-20 items-center gap-3 px-4 py-3 transition-colors hover:bg-[var(--surface-soft)]"
                >
                  <span className="w-10 shrink-0 text-center text-2xl" aria-hidden="true">{tool.icon}</span>
                  <div className="min-w-0 flex-1">
                    <h3 className="m-0 truncate font-bold text-[var(--text-primary)] group-hover:text-[var(--brand)]">
                      {getDisplayText(tool.title)}
                    </h3>
                    <span className="mt-0.5 block truncate text-sm text-[var(--text-muted)]">
                      {getDisplayText(tool.description)}
                    </span>
                  </div>
                  <span className="shrink-0 text-[var(--text-muted)]" aria-hidden="true">→</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="fc-empty-state">
          <p>{catalogUi[lang].noResults}</p>
        </div>
      )}

      {/* Tool Count */}
      <div className="mt-6 text-center text-sm text-[var(--text-muted)]">
        <span aria-live="polite" className="font-bold text-[var(--text-primary)]">
          {catalogUi[lang].count(filteredTools.length)}
        </span>
      </div>
    </div>
  );
}
