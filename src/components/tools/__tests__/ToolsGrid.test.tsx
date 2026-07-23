import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { supportedLanguages } from '../../../data/tools/locales';
import ToolsGrid from '../ToolsGrid';
import { getLocalizedToolHref } from '../toolLinks';

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
    ['en', '1 tools'],
    ['ja', '1個のツール'],
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

  it('constructs standard and anonymous-chat links for all 12 catalog locales', () => {
    expect(supportedLanguages).toHaveLength(12);

    for (const lang of supportedLanguages) {
      expect(getLocalizedToolHref('json', lang)).toBe(`/${lang}/tools/json/`);
      expect(getLocalizedToolHref('anonymous-chat', lang)).toBe(`/${lang}/anonymous-chat/`);
    }
  });

  it('renders pre-resolved card text with requested-locale catalog controls', () => {
    const { container } = render(<ToolsGrid lang="fr" tools={[tool]} categories={[allCategory]} />);

    expect(screen.getByRole('heading', { name: 'JSON Formatter' })).toBeInTheDocument();
    expect(screen.getByText('Format JSON.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /JSON Formatter/ })).toHaveAttribute('href', '/fr/tools/json/');
    expect(container).toHaveTextContent('1 outils');
  });

  it('exposes category chips as pressed-state buttons and announces the filtered count', async () => {
    const user = userEvent.setup();
    const categories = [
      allCategory,
      { id: 'developer', label: 'Developer' },
      { id: 'image', label: 'Image' },
    ];

    render(<ToolsGrid lang="en" tools={[tool]} categories={categories} />);

    const allButton = screen.getByRole('button', { name: 'All' });
    const imageButton = screen.getByRole('button', { name: 'Image' });
    expect(allButton).toHaveAttribute('aria-pressed', 'true');
    expect(imageButton).toHaveAttribute('aria-pressed', 'false');
    expect(allButton).toHaveClass('fc-chip');

    await user.click(imageButton);

    expect(imageButton).toHaveAttribute('aria-pressed', 'true');
    expect(allButton).toHaveAttribute('aria-pressed', 'false');
    expect(screen.queryByRole('link', { name: /JSON Formatter/ })).not.toBeInTheDocument();
    expect(screen.getByText('0 tools')).toHaveAttribute('aria-live', 'polite');
  });

  it('uses a horizontally scrollable chip row and calm compact list styling', () => {
    const { container } = render(<ToolsGrid lang="en" tools={[tool]} categories={[allCategory]} />);
    const chipRow = screen.getByRole('group', { name: 'Tools' });
    const toolLink = screen.getByRole('link', { name: /JSON Formatter/ });

    expect(chipRow).toHaveClass('overflow-x-auto', 'flex-nowrap', 'md:flex-wrap');
    expect(container.querySelector('.fc-surface')).toBeInTheDocument();
    expect(toolLink.className).toContain('hover:bg-[var(--surface-soft)]');
    expect(toolLink.className).not.toMatch(/hover:(?:shadow|scale|translate)/);
    expect(screen.getByText('Format JSON.')).toHaveClass('truncate');
  });
});
