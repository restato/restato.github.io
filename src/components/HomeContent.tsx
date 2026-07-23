import { useTranslation } from '../i18n/useTranslation';
import type { Language } from '../data/tools/types';

const editorialCopy = {
  eyebrow: {
    ko: 'RESTATO · 작은 웹 작업실',
    en: 'RESTATO · THE SMALL WEB DESK',
    ja: 'RESTATO · 小さなウェブ作業室',
  },
  title: {
    ko: '작은 웹 작업을 가볍게 끝내세요.',
    en: 'Small web tasks, quietly solved.',
    ja: '小さなウェブ作業を、軽やかに。',
  },
  description: {
    ko: '계산, 변환, 개발 작업에 필요한 도구와 직접 만들며 배운 기록을 한곳에 모았습니다.',
    en: 'Practical tools for calculations, conversions, and development, alongside notes from making them.',
    ja: '計算、変換、開発に役立つ道具と、ものづくりから得た記録を一か所にまとめました。',
  },
  annotation: {
    ko: '큰일 사이의 작은 일을 위한 도구.',
    en: 'For the small jobs between bigger ones.',
    ja: '大きな仕事の合間にある、小さな作業のために。',
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
    <section className="grid gap-8 border-b border-[var(--border-subtle)] py-12 md:py-16 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
      <div className="max-w-3xl">
        <p className="fc-eyebrow mb-3">{t(editorialCopy.eyebrow)}</p>
        <h1 className="m-0 text-4xl font-bold leading-tight text-[var(--text-primary)] md:text-5xl">
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

      <p className="m-0 border-l-2 border-[var(--accent)] pl-4 text-sm text-[var(--accent)]">
        {t(editorialCopy.annotation)}
      </p>
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
    { slug: 'json', icon: '{ }', name: idx.jsonFormatter },
    { slug: 'qr-code', icon: 'QR', name: idx.qrCode },
    { slug: 'color', icon: 'HEX', name: idx.colorConverter },
    { slug: 'image-resizer', icon: 'PX', name: idx.imageResizer },
    { slug: 'base64', icon: '64', name: idx.base64 },
    {
      slug: 'anonymous-chat',
      icon: 'P2P',
      name: { ko: '익명 채팅', en: 'Anonymous chat', ja: '匿名チャット' },
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

      <div className="fc-surface overflow-hidden">
        <ul className="m-0 grid list-none p-0 sm:grid-cols-2">
          {tools.map((tool, index) => (
            <li
              key={tool.slug}
              className={[
                'border-[var(--border-subtle)]',
                index > 0 ? 'border-t' : '',
                index === 1 ? 'sm:border-t-0' : '',
                index % 2 === 1 ? 'sm:border-l' : '',
              ].join(' ')}
            >
              <a
                href={toolPath(routingLang, tool.slug)}
                className="flex min-h-14 items-center gap-3 px-4 py-3 text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-soft)]"
              >
                <span className="w-9 shrink-0 text-xs font-bold text-[var(--accent)]" aria-hidden="true">
                  {tool.icon}
                </span>
                <span className="font-bold">{t(tool.name)}</span>
                <span className="ml-auto text-[var(--text-muted)]"><Arrow /></span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ProjectsSection() {
  const { t, translations } = useTranslation();
  const idx = translations.common.index;
  const projects = [
    {
      href: '/projects/games',
      label: idx.gameCenter,
      description: idx.sixFreeGames,
      marker: 'PLAY',
    },
    {
      href: '/projects/roulette',
      label: idx.roulette,
      description: idx.rouletteDesc,
      marker: 'SPIN',
    },
  ];

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

      <div className="fc-surface overflow-hidden">
        <ul className="m-0 list-none divide-y divide-[var(--border-subtle)] p-0">
          {projects.map(project => (
            <li key={project.href}>
              <a
                href={project.href}
                className="flex items-center gap-4 px-4 py-4 transition-colors hover:bg-[var(--surface-soft)]"
              >
                <span className="w-10 shrink-0 text-xs font-bold text-[var(--accent)]" aria-hidden="true">
                  {project.marker}
                </span>
                <span>
                  <strong className="block text-[var(--text-primary)]">{t(project.label)}</strong>
                  <span className="text-sm text-[var(--text-muted)]">{t(project.description)}</span>
                </span>
                <span className="ml-auto text-[var(--text-muted)]"><Arrow /></span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
