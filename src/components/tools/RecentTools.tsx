import { useState, useEffect } from 'react';
import type { Language } from '../../data/tools/types';
import { getLocalizedToolHref } from './toolLinks';
import { catalogUi } from '../../i18n/tool-ui';

interface Tool {
  slug: string;
  title: string;
  icon: string;
  visitedAt: number;
}

const STORAGE_KEY = 'restato_recent_tools';
const MAX_RECENT = 5;

export function trackToolVisit(slug: string, title: string, icon: string) {
  if (typeof window === 'undefined') return;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    let tools: Tool[] = stored ? JSON.parse(stored) : [];

    // 기존 항목 제거
    tools = tools.filter(t => t.slug !== slug);

    // 새 항목 추가
    tools.unshift({ slug, title, icon, visitedAt: Date.now() });

    // 최대 개수 유지
    tools = tools.slice(0, MAX_RECENT);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(tools));
  } catch (err) {
    console.error('Failed to track tool visit:', err);
  }
}

export function getRecentTools(): Tool[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

interface RecentToolsProps {
  className?: string;
  lang?: Language;
}

export default function RecentTools({ className = '', lang = 'en' }: RecentToolsProps) {
  const [tools, setTools] = useState<Tool[]>([]);

  useEffect(() => {
    setTools(getRecentTools());
  }, []);

  if (tools.length === 0) return null;
  const heading = catalogUi[lang].recent;

  return (
    <section className={className} aria-labelledby="recent-tools-heading">
      <h2 id="recent-tools-heading" className="mb-3 flex items-center gap-2 text-sm font-bold text-[var(--text-muted)]">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {heading}
      </h2>
      <div className="fc-surface overflow-hidden">
        <ul className="m-0 grid list-none p-0 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <li key={tool.slug} className="border-b border-[var(--border-subtle)] sm:border-r">
              <a
                href={getLocalizedToolHref(tool.slug, lang)}
                className="group flex min-h-14 items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-[var(--surface-soft)]"
              >
                <span className="w-8 shrink-0 text-center" aria-hidden="true">{tool.icon}</span>
                <span className="min-w-0 flex-1 truncate font-bold text-[var(--text-primary)] group-hover:text-[var(--brand)]">
                  {tool.title}
                </span>
                <span className="text-[var(--text-muted)]" aria-hidden="true">→</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
