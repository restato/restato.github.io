import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import {
  HeroSection,
  PopularToolsSection,
  ProjectsSection,
  RecentPostsHeader,
} from '../HomeContent';
import { TranslationProvider } from '../../i18n/useTranslation';

function renderHome(language: 'ko' | 'en' | 'ja') {
  window.history.replaceState({}, '', `/${language}/`);

  return render(
    <TranslationProvider initialLanguage={language}>
      <HeroSection />
      <PopularToolsSection />
      <RecentPostsHeader />
      <ProjectsSection />
    </TranslationProvider>,
  );
}

describe('Forest Café home content', () => {
  beforeEach(() => localStorage.clear());

  it('uses one concise page heading and meaningful section headings', () => {
    renderHome('en');

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Small web tasks, quietly solved.');
    expect(screen.getByRole('heading', { level: 2, name: 'Popular tools' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Recent notes' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Projects & play' })).toBeInTheDocument();
  });

  it('makes tool search prominent and preserves localized tool links', () => {
    renderHome('ja');

    expect(screen.getByRole('link', { name: 'ツールを検索' }))
      .toHaveAttribute('href', '/ja/tools/');
    expect(screen.getByRole('link', { name: /JSONフォーマッタ/ }))
      .toHaveAttribute('href', '/ja/tools/json/');
  });

  it('uses quiet shared surfaces without legacy floating effects', () => {
    const { container } = renderHome('en');

    expect(container.querySelectorAll('.fc-surface').length).toBeGreaterThan(0);
    expect(container.innerHTML).not.toMatch(
      /\bgradient-|\bbackdrop-blur|\bhover:-translate|\bhover:scale|\bshadow-(?:lg|xl|2xl)\b/,
    );
  });
});
