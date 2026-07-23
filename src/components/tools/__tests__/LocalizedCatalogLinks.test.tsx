import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';

import RecentTools, { trackToolVisit } from '../RecentTools';
import ToolSearch from '../ToolSearch';
import ToolsPageHeader from '../ToolsPageHeader';
import ToolsPageInfo from '../ToolsPageInfo';
import FavoriteButton from '../FavoriteButton';
import ShareButton from '../ShareButton';

const tools = [
  { slug: 'json', title: 'JSON Formatter', description: 'Format JSON.', icon: '{ }', category: 'developer' },
  { slug: 'anonymous-chat', title: 'Anonymous Chat', description: 'Private peer chat.', icon: '💬', category: 'text' },
];

describe('localized catalog links', () => {
  beforeEach(() => localStorage.clear());

  it('search links directly to the localized anonymous-chat special route', async () => {
    render(<ToolSearch lang="fr" tools={tools} />);

    await userEvent.type(screen.getByRole('searchbox'), 'anonymous');
    expect(screen.getByRole('link', { name: /Anonymous Chat/ }))
      .toHaveAttribute('href', '/fr/anonymous-chat/');
    expect(screen.getByPlaceholderText('Rechercher un outil… (⌘K)')).toBeInTheDocument();
  });

  it('recent tools use the current locale and anonymous-chat special route', () => {
    trackToolVisit('anonymous-chat', 'Anonymous Chat', '💬');
    render(<RecentTools lang="zh-TW" />);

    expect(screen.getByRole('link', { name: /Anonymous Chat/ }))
      .toHaveAttribute('href', '/zh-TW/anonymous-chat/');
    expect(screen.getByRole('heading', { name: '最近使用' })).toBeInTheDocument();
  });

  it('renders the hub header in the requested language during SSR', () => {
    render(<ToolsPageHeader lang="fr" />);

    expect(screen.getByRole('heading', { name: 'Outils gratuits en ligne' })).toBeInTheDocument();
    expect(screen.getByText('Accueil')).toBeInTheDocument();
  });

  it('renders hub information in the requested language during SSR', () => {
    render(<ToolsPageInfo lang="fr" />);

    expect(screen.getByRole('heading', { name: 'ℹ️ Informations sur les outils' })).toBeInTheDocument();
    expect(screen.getByText(/Fonctionne sur mobile et ordinateur/)).toBeInTheDocument();
    expect(screen.queryByText('ℹ️ 정보')).not.toBeInTheDocument();
  });

  it('renders favorite and share controls in the requested language during SSR', () => {
    render(<><FavoriteButton lang="fr" slug="json" title="JSON" icon="{}" /><ShareButton lang="fr" title="JSON" description="JSON" /></>);
    expect(screen.getByRole('button', { name: 'Ajouter aux favoris' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Partager' })).toBeInTheDocument();
  });
});
