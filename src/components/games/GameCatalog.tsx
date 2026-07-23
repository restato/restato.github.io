import { useMemo, useState } from 'react';

type GameCategory = 'arcade' | 'puzzle' | 'event' | 'classic';
type GameFilter = 'all' | 'featured' | GameCategory;

export interface CatalogGame {
  slug: string;
  title: string;
  description: string;
  icon: string;
  category: GameCategory;
  featured: boolean;
  href: string;
}

interface GameCatalogProps {
  games: CatalogGame[];
  labels: {
    search: string;
    all: string;
    featured: string;
    arcade: string;
    puzzle: string;
    event: string;
    classic: string;
    noResults: string;
    count: string;
  };
}

export default function GameCatalog({ games, labels }: GameCatalogProps) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<GameFilter>('all');

  const filters: { id: GameFilter; label: string }[] = [
    { id: 'all', label: labels.all },
    { id: 'featured', label: labels.featured },
    { id: 'arcade', label: labels.arcade },
    { id: 'puzzle', label: labels.puzzle },
    { id: 'event', label: labels.event },
    { id: 'classic', label: labels.classic },
  ];

  const visibleGames = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return games.filter(game => {
      const matchesFilter = filter === 'all'
        || (filter === 'featured' ? game.featured : game.category === filter);
      const matchesQuery = !normalizedQuery
        || `${game.title} ${game.description}`.toLocaleLowerCase().includes(normalizedQuery);

      return matchesFilter && matchesQuery;
    });
  }, [filter, games, query]);

  return (
    <div className="fc-game-catalog">
      <div className="fc-surface fc-surface-padding-md mb-6">
        <label className="fc-label" htmlFor="game-catalog-search">
          {labels.search}
        </label>
        <input
          id="game-catalog-search"
          type="search"
          value={query}
          onChange={event => setQuery(event.target.value)}
          className="fc-input"
          placeholder={labels.search}
        />
      </div>

      <div
        className="-mx-4 mb-6 flex flex-nowrap gap-2 overflow-x-auto px-4 pb-2 md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
        role="group"
        aria-label={labels.all}
      >
        {filters.map(item => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            aria-pressed={filter === item.id}
            className={`fc-chip shrink-0 border transition-colors ${
              filter === item.id
                ? 'border-[var(--brand)] bg-[var(--brand)] text-[var(--surface-raised)]'
                : 'border-[var(--border-subtle)] hover:border-[var(--brand)] hover:text-[var(--brand)]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {visibleGames.length > 0 ? (
        <div className="fc-surface overflow-hidden">
          <ul className="m-0 grid list-none p-0 md:grid-cols-2 lg:grid-cols-3">
            {visibleGames.map(game => (
              <li key={game.slug} className="border-b border-[var(--border-subtle)] md:border-r">
                <a
                  href={game.href}
                  className="group flex min-h-20 items-center gap-3 px-4 py-3 transition-colors hover:bg-[var(--surface-soft)]"
                >
                  <span className="w-10 shrink-0 text-center text-2xl" aria-hidden="true">
                    {game.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-bold text-[var(--text-primary)] group-hover:text-[var(--brand)]">
                      {game.title}
                    </span>
                    <span className="mt-0.5 block truncate text-sm text-[var(--text-muted)]">
                      {game.description}
                    </span>
                  </span>
                  <span className="shrink-0 text-[var(--text-muted)]" aria-hidden="true">→</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="fc-empty-state" role="status">
          <p>{labels.noResults}</p>
        </div>
      )}

      <p className="mt-6 text-center text-sm text-[var(--text-muted)]" aria-live="polite">
        <strong className="text-[var(--text-primary)]">{visibleGames.length}</strong> {labels.count}
      </p>
    </div>
  );
}
