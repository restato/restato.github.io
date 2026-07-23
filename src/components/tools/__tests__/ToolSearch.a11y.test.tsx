import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import ToolSearch from '../ToolSearch';

const tools = [
  { slug: 'json', title: 'JSON Formatter', description: 'Format JSON.', icon: '{ }', category: 'developer' },
  { slug: 'anonymous-chat', title: 'Anonymous Chat', description: 'Private peer chat.', icon: '💬', category: 'text' },
];

describe('ToolSearch accessibility', () => {
  it('has a visible label, shared input styling, and keyboard focus shortcut', async () => {
    const user = userEvent.setup();
    const { container } = render(<ToolSearch lang="en" tools={tools} />);
    const input = screen.getByRole('searchbox', { name: 'Search tools… (⌘K)' }) as HTMLInputElement;

    expect(input).toHaveClass('fc-input');
    expect(input.labels?.[0]).toHaveTextContent('Search tools…');
    expect(container.querySelector('kbd')).toHaveTextContent('⌘K');

    await user.keyboard('{Control>}k{/Control}');
    expect(input).toHaveFocus();
  });

  it('provides a localized accessible clear control', async () => {
    const user = userEvent.setup();
    render(<ToolSearch lang="fr" tools={tools} />);
    const input = screen.getByRole('searchbox', { name: 'Rechercher un outil… (⌘K)' });

    await user.type(input, 'json');
    await user.click(screen.getByRole('button', { name: 'Effacer' }));

    expect(input).toHaveValue('');
    expect(input).toHaveFocus();
    expect(screen.queryByRole('button', { name: 'Effacer' })).not.toBeInTheDocument();
  });

  it('announces result counts and renders a calm result list', async () => {
    const user = userEvent.setup();
    const { container } = render(<ToolSearch lang="en" tools={tools} />);

    await user.type(screen.getByRole('searchbox'), 'anonymous');

    expect(screen.getByText('1 tools')).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByRole('link', { name: /Anonymous Chat/ }))
      .toHaveAttribute('href', '/en/anonymous-chat/');
    expect(container.querySelector('.fc-surface')).toBeInTheDocument();
  });

  it('announces and explains an empty result', async () => {
    const user = userEvent.setup();
    render(<ToolSearch lang="en" tools={tools} />);

    await user.type(screen.getByRole('searchbox'), 'missing');

    expect(screen.getByText('0 tools')).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByText('No tools found')).toBeInTheDocument();
    expect(screen.getByText('Try another search term')).toBeInTheDocument();
  });
});
