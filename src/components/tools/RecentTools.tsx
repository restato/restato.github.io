import { useState, useEffect } from 'react';

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
}

export default function RecentTools({ className = '' }: RecentToolsProps) {
  const [tools, setTools] = useState<Tool[]>([]);

  useEffect(() => {
    setTools(getRecentTools());
  }, []);

  if (tools.length === 0) return null;

  return (
    <div className={`${className}`}>
      <h3 className="text-sm font-medium text-[var(--color-text-muted)] mb-3 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        최근 사용
      </h3>
      <div className="flex flex-wrap gap-2">
        {tools.map((tool) => (
          <a
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm
              bg-[var(--color-card)] border border-[var(--color-border)]
              hover:border-primary-500 hover:text-primary-500 transition-colors"
          >
            <span>{tool.icon}</span>
            <span>{tool.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
