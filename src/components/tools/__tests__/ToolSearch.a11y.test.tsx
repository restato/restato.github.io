import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import ToolSearch from '../ToolSearch';

const tools = [
  { slug: 'json', title: 'JSON Formatter', description: 'Format JSON.', icon: '{ }', category: 'developer' },
  { slug: 'anonymous-chat', title: 'Anonymous Chat', description: 'Private peer chat.', icon: '💬', category: 'text' },
];

describe('ToolSearch accessibility', () => {
  it('has a visible label, shared input styling, and keyboard focus shortcut', async () => {
    const user = userEvent.setup();
    const { container } = render(<ToolSearch lang="en" tools={tools} />);
    const input = screen.getByRole('combobox', { name: 'Search tools… (⌘K)' }) as HTMLInputElement;

    expect(input).toHaveClass('fc-input');
    expect(input.labels?.[0]).toHaveTextContent('Search tools…');
    expect(container.querySelector('kbd')).toHaveTextContent('⌘/Ctrl K');

    await user.keyboard('{Control>}k{/Control}');
    expect(input).toHaveFocus();
  });

  it('provides a localized accessible clear control', async () => {
    const user = userEvent.setup();
    render(<ToolSearch lang="fr" tools={tools} />);
    const input = screen.getByRole('combobox', { name: 'Rechercher un outil… (⌘K)' });

    await user.type(input, 'json');
    await user.click(screen.getByRole('button', { name: 'Effacer' }));

    expect(input).toHaveValue('');
    expect(input).toHaveFocus();
    expect(screen.queryByRole('button', { name: 'Effacer' })).not.toBeInTheDocument();
  });

  it('reopens results after the delayed blur from clearing has elapsed', async () => {
    const user = userEvent.setup();
    render(<ToolSearch lang="en" tools={tools} />);
    const input = screen.getByRole('combobox');

    await user.type(input, 'json');
    await user.click(screen.getByRole('button', { name: 'Clear' }));
    await new Promise(resolve => window.setTimeout(resolve, 250));
    await user.type(input, 'anonymous');

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Anonymous Chat/ })).toBeInTheDocument();
  });

  it('cancels a pending blur timeout when it unmounts', () => {
    vi.useFakeTimers();
    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');
    let clearedPendingTimeout = false;

    try {
      const { unmount } = render(<ToolSearch lang="en" tools={tools} />);
      fireEvent.blur(screen.getByRole('combobox'));
      unmount();
      clearedPendingTimeout = clearTimeoutSpy.mock.calls.length > 0;
    } finally {
      vi.runOnlyPendingTimers();
      vi.useRealTimers();
      clearTimeoutSpy.mockRestore();
    }

    expect(clearedPendingTimeout).toBe(true);
  });

  it('exposes synchronized combobox, listbox, and keyboard-highlighted option state', async () => {
    const user = userEvent.setup();
    render(<ToolSearch lang="en" tools={tools} />);
    const input = screen.getByRole('combobox');

    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(input).toHaveAttribute('aria-autocomplete', 'list');
    expect(input).not.toHaveAttribute('aria-controls');
    expect(input).not.toHaveAttribute('aria-activedescendant');

    await user.type(input, 'a');

    const listbox = screen.getByRole('listbox');
    const options = screen.getAllByRole('option');
    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(input).toHaveAttribute('aria-controls', listbox.id);
    expect(options).toHaveLength(2);
    expect(options[0]).toHaveAttribute('aria-selected', 'false');

    await user.keyboard('{ArrowDown}');
    expect(input).toHaveAttribute('aria-activedescendant', options[0].id);
    expect(options[0]).toHaveAttribute('aria-selected', 'true');

    await user.keyboard('{ArrowDown}{ArrowUp}');
    expect(input).toHaveAttribute('aria-activedescendant', options[0].id);

    await user.keyboard('{Escape}');
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(input).not.toHaveAttribute('aria-controls');
    expect(input).not.toHaveAttribute('aria-activedescendant');
    expect(input).toHaveFocus();
  });

  it('activates and clears the highlighted option with Enter', async () => {
    const user = userEvent.setup();
    render(<ToolSearch lang="en" tools={tools} />);
    const input = screen.getByRole('combobox');

    await user.type(input, 'json');
    const option = screen.getByRole('option', { name: /JSON Formatter/ });
    const clickSpy = vi.spyOn(option, 'click').mockImplementation(() => undefined);

    await user.keyboard('{ArrowDown}{Enter}');

    expect(clickSpy).toHaveBeenCalledOnce();
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(input).not.toHaveAttribute('aria-activedescendant');
  });

  it('announces result counts and renders a calm result list', async () => {
    const user = userEvent.setup();
    const { container } = render(<ToolSearch lang="en" tools={tools} />);

    await user.type(screen.getByRole('combobox'), 'anonymous');

    expect(screen.getByText('1 tools')).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByRole('option', { name: /Anonymous Chat/ }))
      .toHaveAttribute('href', '/en/anonymous-chat/');
    expect(screen.getByText('Private peer chat.')).toHaveClass('text-[var(--text-primary)]');
    expect(container.querySelector('.fc-surface')).toBeInTheDocument();
  });

  it('announces and explains an empty result', async () => {
    const user = userEvent.setup();
    render(<ToolSearch lang="en" tools={tools} />);
    const input = screen.getByRole('combobox');

    await user.type(input, 'missing');

    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(input).not.toHaveAttribute('aria-controls');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(screen.getByText('0 tools')).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByText('No tools found')).toBeInTheDocument();
    expect(screen.getByText('Try another search term')).toBeInTheDocument();
  });
});
