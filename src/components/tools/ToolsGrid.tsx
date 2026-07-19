import { useState } from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import type { Language } from '../../i18n';

interface Tool {
  slug: string;
  title: { ko: string; en: string; ja: string };
  description: { ko: string; en: string; ja: string };
  icon: string;
  category: string;
}

interface Category {
  id: string;
  label: { ko: string; en: string; ja: string };
}

interface ToolsGridProps {
  lang: Language;
  tools: Tool[];
  categories: Category[];
}

export default function ToolsGrid({ lang, tools, categories }: ToolsGridProps) {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTools = selectedCategory === 'all'
    ? tools
    : tools.filter(tool => tool.category === selectedCategory);

  const getLocalizedText = (obj: { ko: string; en: string; ja: string }) => {
    return obj[lang as keyof typeof obj] || obj.ko;
  };

  return (
    <div>
      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${selectedCategory === category.id
                ? 'bg-primary-500 text-white'
                : 'bg-[var(--color-card)] hover:bg-[var(--color-card-hover)] text-[var(--color-text)] border border-[var(--color-border)]'
              }`}
          >
            {getLocalizedText(category.label)}
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map((tool) => (
          <a
            key={tool.slug}
            href={tool.slug.startsWith('/') ? tool.slug : `/${lang}/tools/${tool.slug}`}
            className="group p-6 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)]
              hover:border-primary-500 hover:shadow-lg transition-all"
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl">{tool.icon}</span>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-[var(--color-text)] group-hover:text-primary-500 transition-colors">
                  {getLocalizedText(tool.title)}
                </h3>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">
                  {getLocalizedText(tool.description)}
                </p>
              </div>
              <svg className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-primary-500 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>
        ))}
      </div>

      {/* Tool Count */}
      <div className="mt-8 text-center text-[var(--color-text-muted)]">
        {t({ ko: '총', en: 'Total', ja: '合計' })}{' '}
        <span className="font-bold text-[var(--color-text)]">{filteredTools.length}{t({ ko: '개', en: '', ja: '個' })}</span>
        {t({ ko: '의 도구가 있습니다.', en: ' tools available.', ja: 'のツールがあります。' })}
      </div>
    </div>
  );
}
