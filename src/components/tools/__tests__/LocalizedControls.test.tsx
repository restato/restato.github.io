import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import FavoriteButton from '../FavoriteButton';
import ShareButton from '../ShareButton';
import BookmarkPrompt from '../BookmarkPrompt';

describe('localized shared tool controls', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders favorite controls from the explicit English route language', () => {
    render(<FavoriteButton slug="json" title="JSON Formatter" icon="{}" lang="en" />);

    expect(screen.getByRole('button', { name: 'Add to favorites' })).toHaveTextContent('Favorite');
  });

  it('renders share controls from the explicit Japanese route language', () => {
    render(<ShareButton title="JSONフォーマッター" description="JSONを整形" lang="ja" />);

    expect(screen.getByRole('button', { name: '共有' })).toHaveTextContent('共有');
  });

  it('renders the delayed bookmark prompt in English', () => {
    vi.useFakeTimers();
    render(<BookmarkPrompt lang="en" />);

    act(() => vi.advanceTimersByTime(5000));

    expect(screen.getByText('Bookmark this useful tool')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });
});
