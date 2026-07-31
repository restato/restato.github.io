import { useTranslation } from '../i18n/useTranslation';
import type { Language } from '../data/tools/types';

const editorialCopy = {
  eyebrow: {
    ko: 'RESTATO · 작은 웹 작업실',
    en: 'RESTATO · THE SMALL WEB DESK',
    ja: 'RESTATO · 小さなウェブ作業室',
  },
  title: {
    ko: '작은 웹 작업을 더 빠르고 간단하게.',
    en: 'Small web tasks, faster and simpler.',
    ja: '小さなウェブ作業を、もっと速く、シンプルに。',
  },
  description: {
    ko: '계산, 변환, 개발 작업에 필요한 도구와 직접 만들며 배운 기록을 한곳에 모았습니다.',
    en: 'Practical tools for calculations, conversions, and development, alongside notes from making them.',
    ja: '計算、変換、開発に役立つ道具と、ものづくりから得た記録を一か所にまとめました。',
  },
  searchTools: {
    ko: '도구 검색',
    en: 'Search tools',
    ja: 'ツールを検索',
  },
  readNotes: {
    ko: '최근 기록 읽기',
    en: 'Read recent notes',
    ja: '最近の記録を読む',
  },
  toolsEyebrow: {
    ko: '빠른 시작',
    en: 'QUICK START',
    ja: 'クイックスタート',
  },
  popularTools: {
    ko: '자주 쓰는 도구',
    en: 'Popular tools',
    ja: 'よく使うツール',
  },
  recentEyebrow: {
    ko: '작업 노트',
    en: 'WORK NOTES',
    ja: '作業ノート',
  },
  recentNotes: {
    ko: '최근 기록',
    en: 'Recent notes',
    ja: '最近の記録',
  },
  projectsEyebrow: {
    ko: '잠시 쉬어가기',
    en: 'SIDE DESK',
    ja: '寄り道',
  },
  projectsTitle: {
    ko: '프로젝트와 놀이',
    en: 'Projects & play',
    ja: 'プロジェクトと遊び',
  },
} as const;

function toolPath(lang: Language, slug?: string) {
  if (slug === 'anonymous-chat') return `/${lang}/anonymous-chat/`;
  return `/${lang}/tools/${slug ? `${slug}/` : ''}`;
}

function Arrow() {
  return <span aria-hidden="true">→</span>;
}

export function HeroSection() {
  const { routingLang, t } = useTranslation();

  return (
    <section className="border-b border-[var(--border-subtle)] py-12 md:py-20">
      <div className="max-w-4xl">
        <p className="fc-eyebrow mb-3">{t(editorialCopy.eyebrow)}</p>
        <h1 className="m-0 max-w-3xl text-4xl font-bold leading-[1.08] tracking-[-0.025em] text-[var(--text-primary)] md:text-6xl">
          {t(editorialCopy.title)}
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-[var(--text-muted)]">
          {t(editorialCopy.description)}
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <a href={toolPath(routingLang)} className="fc-button fc-button-primary">
            {t(editorialCopy.searchTools)}
            <Arrow />
          </a>
          <a href="/blog" className="fc-button fc-button-secondary">
            {t(editorialCopy.readNotes)}
          </a>
        </div>
      </div>
    </section>
  );
}

export function RecentPostsHeader() {
  const { t, translations } = useTranslation();
  const idx = translations.common.index;

  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <p className="fc-eyebrow mb-2">{t(editorialCopy.recentEyebrow)}</p>
        <h2 id="recent-notes-heading" className="m-0 text-2xl font-bold leading-tight text-[var(--text-primary)]">
          {t(editorialCopy.recentNotes)}
        </h2>
      </div>
      <a href="/blog" className="fc-button fc-button-quiet px-2 text-sm">
        {t(idx.viewAll)}
        <Arrow />
      </a>
    </div>
  );
}

export function NoPostsMessage() {
  const { t, translations } = useTranslation();
  const idx = translations.common.index;

  return (
    <div className="fc-empty-state">
      <h2 className="text-xl">{t(idx.noPosts)}</h2>
      <p>{t(idx.comingSoon)}</p>
    </div>
  );
}

export function PopularToolsSection() {
  const { routingLang, t, translations } = useTranslation();
  const idx = translations.common.index;
  const tools = [
    {
      slug: 'json',
      icon: '{ }',
      name: idx.jsonFormatter,
      description: translations.tools.json.description,
    },
    {
      slug: 'qr-code',
      icon: 'QR',
      name: idx.qrCode,
      description: translations.tools.qrCode.description,
    },
    {
      slug: 'text-counter',
      icon: 'Aa',
      name: translations.tools.textCounter.title,
      description: translations.tools.textCounter.description,
    },
    {
      slug: 'color',
      icon: 'HEX',
      name: idx.colorConverter,
      description: translations.tools.color.description,
    },
  ];

  return (
    <section className="border-b border-[var(--border-subtle)] py-10" aria-labelledby="popular-tools-heading">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="fc-eyebrow mb-2">{t(editorialCopy.toolsEyebrow)}</p>
          <h2 id="popular-tools-heading" className="m-0 text-2xl font-bold leading-tight text-[var(--text-primary)]">
            {t(editorialCopy.popularTools)}
          </h2>
        </div>
        <a href={toolPath(routingLang)} className="fc-button fc-button-quiet px-2 text-sm">
          {t(idx.viewAll)}
          <Arrow />
        </a>
      </div>

      <ul
        className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-4"
        data-home-tool-grid
      >
        {tools.map(tool => (
          <li key={tool.slug} data-home-tool-card>
            <a
              href={toolPath(routingLang, tool.slug)}
              className="fc-surface flex h-full min-h-36 flex-col p-4 text-[var(--text-primary)] transition-colors hover:border-[var(--brand)]"
            >
              <span
                className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-md bg-[var(--surface-soft)] text-[11px] font-bold text-[var(--brand)]"
                aria-hidden="true"
              >
                {tool.icon}
              </span>
              <span className="mt-5 font-bold leading-snug">{t(tool.name)}</span>
              <span className="mt-1 line-clamp-1 text-sm text-[var(--text-muted)]">
                {t(tool.description)}
              </span>
              <span className="mt-auto pt-4 text-[var(--brand)]"><Arrow /></span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ProjectsSection() {
  const { t, translations } = useTranslation();
  const idx = translations.common.index;
  return (
    <section aria-labelledby="projects-heading">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="fc-eyebrow mb-2">{t(editorialCopy.projectsEyebrow)}</p>
          <h2 id="projects-heading" className="m-0 text-2xl font-bold leading-tight text-[var(--text-primary)]">
            {t(editorialCopy.projectsTitle)}
          </h2>
        </div>
        <a href="/projects" className="fc-button fc-button-quiet px-2 text-sm">
          {t(idx.viewAll)}
          <Arrow />
        </a>
      </div>

      <div className="grid gap-3 sm:grid-cols-[minmax(0,1.6fr)_minmax(16rem,0.8fr)]">
        <a
          href="/projects/games"
          className="block rounded-lg bg-[var(--brand)] p-6 text-[var(--on-brand)] transition-colors hover:bg-[var(--brand-hover)]"
          data-project-feature
        >
          <span className="text-xs font-bold uppercase tracking-[0.08em] opacity-80">PLAY</span>
          <strong className="mt-8 block text-2xl leading-tight">{t(idx.gameCenter)}</strong>
          <span className="mt-2 block text-sm" data-project-description>{t(idx.sixFreeGames)}</span>
          <span className="mt-6 block" aria-hidden="true"><Arrow /></span>
        </a>

        <a
          href="/projects/roulette"
          className="fc-surface flex items-center gap-4 px-4 py-4 transition-colors hover:border-[var(--brand)]"
        >
          <span>
            <strong className="block text-[var(--text-primary)]">{t(idx.roulette)}</strong>
            <span className="text-sm text-[var(--text-muted)]">{t(idx.rouletteDesc)}</span>
          </span>
          <span className="ml-auto text-[var(--brand)]"><Arrow /></span>
        </a>
      </div>
    </section>
  );
}
