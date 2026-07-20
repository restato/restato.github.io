import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';

import RecentTools, { trackToolVisit } from '../RecentTools';
import ToolSearch from '../ToolSearch';
import ToolsPageHeader from '../ToolsPageHeader';

const tools = [
  { slug: 'json', title: 'JSON Formatter', description: 'Format JSON.', icon: '{ }', category: 'developer' },
  { slug: 'anonymous-chat', title: 'Anonymous Chat', description: 'Private peer chat.', icon: '💬', category: 'text' },
];

describe('localized catalog links', () => {
  beforeEach(() => localStorage.clear());

  it('search links directly to the localized anonymous-chat special route', async () => {
    render(<ToolSearch lang="fr" tools={tools} />);

    await userEvent.type(screen.getByRole('textbox'), 'anonymous');
    expect(screen.getByRole('link', { name: /Anonymous Chat/ }))
      .toHaveAttribute('href', '/fr/anonymous-chat/');
    expect(screen.getByPlaceholderText('Search tools... (⌘K)')).toBeInTheDocument();
  });

  it('recent tools use the current locale and anonymous-chat special route', () => {
    trackToolVisit('anonymous-chat', 'Anonymous Chat', '💬');
    render(<RecentTools lang="zh-TW" />);

    expect(screen.getByRole('link', { name: /Anonymous Chat/ }))
      .toHaveAttribute('href', '/zh-TW/anonymous-chat/');
    expect(screen.getByRole('heading', { name: 'Recently used' })).toBeInTheDocument();
  });

  it('renders the localized hub header in English fallback during SSR', () => {
    render(<ToolsPageHeader lang="fr" />);

    expect(screen.getByRole('heading', { name: 'Online Tools' })).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
  });
});
