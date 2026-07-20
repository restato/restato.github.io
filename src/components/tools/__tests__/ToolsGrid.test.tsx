import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ToolsGrid from '../ToolsGrid';

const tool = {
  slug: 'json',
  title: 'JSON Formatter',
  description: 'Format JSON.',
  icon: '{ }',
  category: 'developer',
};

const allCategory = {
  id: 'all',
  label: { ko: '전체', en: 'All', ja: 'すべて' },
};

describe('ToolsGrid', () => {
  it('links tool cards to the current localized route', () => {
    render(<ToolsGrid lang="ko" tools={[tool]} categories={[allCategory]} />);

    expect(screen.getByRole('link', { name: /JSON/ })).toHaveAttribute('href', '/ko/tools/json/');
  });

  it.each([
    ['en', 'Total 1 tools available.'],
    ['ja', '合計 1個のツールがあります。'],
  ] as const)('renders the tool count in the supplied %s locale during SSR', (lang, expectedCount) => {
    const { container } = render(<ToolsGrid lang={lang} tools={[tool]} categories={[allCategory]} />);

    expect(container).toHaveTextContent(expectedCount);
  });

  it('preserves an absolute special-route link', () => {
    const chatTool = {
      ...tool,
      slug: '/ko/anonymous-chat',
      title: 'Anonymous Chat',
    };

    render(<ToolsGrid lang="ko" tools={[chatTool]} categories={[allCategory]} />);

    expect(screen.getByRole('link', { name: /Anonymous Chat/ })).toHaveAttribute('href', '/ko/anonymous-chat');
  });

  it('routes a registry anonymous-chat slug to its localized special route', () => {
    render(<ToolsGrid
      lang="zh-CN"
      tools={[{ ...tool, slug: 'anonymous-chat', title: 'Anonymous Chat' }]}
      categories={[allCategory]}
    />);

    expect(screen.getByRole('link', { name: /Anonymous Chat/ }))
      .toHaveAttribute('href', '/zh-CN/anonymous-chat/');
  });

  it('renders pre-resolved English fallback text for a new locale', () => {
    const { container } = render(<ToolsGrid lang="fr" tools={[tool]} categories={[allCategory]} />);

    expect(screen.getByRole('heading', { name: 'JSON Formatter' })).toBeInTheDocument();
    expect(screen.getByText('Format JSON.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /JSON Formatter/ })).toHaveAttribute('href', '/fr/tools/json/');
    expect(container).toHaveTextContent('Total 1 tools available.');
  });
});
