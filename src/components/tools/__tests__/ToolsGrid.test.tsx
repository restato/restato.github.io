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
});
