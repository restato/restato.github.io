import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ToolsGrid from '../ToolsGrid';

const tool = {
  slug: 'json',
  title: { ko: 'JSON 포매터', en: 'JSON Formatter', ja: 'JSONフォーマッター' },
  description: { ko: 'JSON을 정리합니다.', en: 'Format JSON.', ja: 'JSONを整形します。' },
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

    expect(screen.getByRole('link', { name: /JSON/ })).toHaveAttribute('href', '/ko/tools/json');
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
      title: { ko: '익명 채팅', en: 'Anonymous Chat', ja: '匿名チャット' },
    };

    render(<ToolsGrid lang="ko" tools={[chatTool]} categories={[allCategory]} />);

    expect(screen.getByRole('link', { name: /익명 채팅/ })).toHaveAttribute('href', '/ko/anonymous-chat');
  });
});
