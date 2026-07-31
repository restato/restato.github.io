import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { supportedLanguages } from '../../data/tools/locales';
import type { Language } from '../../data/tools/types';
import {
  HeroSection,
  PopularToolsSection,
  ProjectsSection,
  RecentPostsHeader,
} from '../HomeContent';
import NotFoundContent from '../NotFoundContent';

function selectLanguage(language: Language, pathname: string) {
  localStorage.setItem('lang', language);
  window.history.replaceState({}, '', pathname);
}

function renderHome(language: Language) {
  selectLanguage(language, '/');
  return render(
    <>
      <HeroSection />
      <PopularToolsSection />
      <RecentPostsHeader />
      <ProjectsSection />
    </>,
  );
}

describe('Modern Restato home content', () => {
  beforeEach(() => localStorage.clear());

  it('uses one concise page heading and meaningful section headings', () => {
    renderHome('en');

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Small web tasks, faster and simpler.',
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Popular tools' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Recent notes' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Projects & play' })).toBeInTheDocument();
  });

  it.each(supportedLanguages)('preserves the selected %s locale in every tool link', language => {
    const { container } = renderHome(language);

    expect(container.querySelector('a.fc-button-primary'))
      .toHaveAttribute('href', `/${language}/tools/`);
    for (const slug of ['json', 'qr-code', 'text-counter', 'color']) {
      expect(container.querySelector(`a[href="/${language}/tools/${slug}/"]`))
        .toBeInTheDocument();
    }
  });

  it('uses the approved four-tool grid and deep-green project feature', () => {
    const { container } = renderHome('en');

    expect(container.querySelector('[data-home-tool-grid]')).toHaveClass('lg:grid-cols-4');
    expect(container.querySelectorAll('[data-home-tool-card]')).toHaveLength(4);
    expect(container.querySelector('[data-project-feature]')).toBeInTheDocument();
    expect(container.innerHTML).not.toMatch(/D2Coding|rounded-full|gradient-|shadow-(?:lg|xl|2xl)/);
  });
});

describe('Modern Restato not-found content', () => {
  beforeEach(() => localStorage.clear());

  it.each(supportedLanguages)('preserves the selected %s locale in return and tool links', language => {
    selectLanguage(language, '/missing-page');
    const { container } = render(<NotFoundContent />);
    const usefulLinks = Array.from(container.querySelectorAll('nav a'));

    expect(container.querySelectorAll('h1')).toHaveLength(1);
    expect(container.querySelector('a.fc-button-primary'))
      .toHaveAttribute('href', `/${language}/`);
    expect(usefulLinks.map(link => link.getAttribute('href'))).toEqual([
      `/${language}/tools/`,
      `/${language}/tools/json/`,
      `/${language}/tools/qr-code/`,
      `/${language}/anonymous-chat/`,
    ]);
  });
});
