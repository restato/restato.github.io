import { useTranslation } from '../i18n/useTranslation';

interface ProjectItem {
  slug: string;
  icon: string;
  titleKey: keyof typeof import('../i18n/translations/common').commonTranslations.projects;
  descKey: keyof typeof import('../i18n/translations/common').commonTranslations.projects;
  tags: string[];
  featured?: boolean;
}

const builtInProjects: ProjectItem[] = [
  { slug: 'games', icon: '🎮', titleKey: 'gameCenter', descKey: 'gameCenterDesc', tags: ['Games', 'Interactive', 'Fun'], featured: true },
  { slug: 'roulette', icon: '🎡', titleKey: 'roulette', descKey: 'rouletteDesc', tags: ['React', 'Animation'] },
  { slug: 'slot-machine', icon: '🎰', titleKey: 'slotMachine', descKey: 'slotMachineDesc', tags: ['React', 'Game'] },
  { slug: 'rock-paper-scissors', icon: '✊', titleKey: 'rockPaperScissors', descKey: 'rockPaperScissorsDesc', tags: ['React', 'AI'] },
  { slug: 'number-guess', icon: '🔢', titleKey: 'numberGuess', descKey: 'numberGuessDesc', tags: ['React', 'Puzzle'] },
  { slug: 'memory-game', icon: '🧠', titleKey: 'memoryGame', descKey: 'memoryGameDesc', tags: ['React', 'Brain'] },
  { slug: 'reaction-test', icon: '⚡', titleKey: 'reactionTest', descKey: 'reactionTestDesc', tags: ['React', 'Test'] },
  { slug: 'gallery', icon: '📷', titleKey: 'gallery', descKey: 'galleryDesc', tags: ['Gallery', 'Lightbox'] },
];

export function ProjectsHeader() {
  const { t, translations } = useTranslation();
  const proj = translations.common.projects;

  return (
    <div className="mb-12">
      <h1 className="text-4xl font-bold mb-4">{t(proj.title)}</h1>
      <p className="text-xl text-[var(--color-text-muted)]">
        {t(proj.description)}
      </p>
    </div>
  );
}

export function ProjectsGrid() {
  const { t, translations } = useTranslation();
  const proj = translations.common.projects;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {builtInProjects.map((project) => (
        <a
          key={project.slug}
          href={`/projects/${project.slug}`}
          className="card group hover:border-primary-500/50"
        >
          <div className="text-5xl mb-4">{project.icon}</div>
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary-500 transition-colors">
            {t(proj[project.titleKey] as any)}
          </h3>
          <p className="text-[var(--color-text-muted)] mb-4">
            {t(proj[project.descKey] as any)}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-1 rounded-full bg-[var(--color-border)] text-[var(--color-text-muted)]">
                {tag}
              </span>
            ))}
          </div>
        </a>
      ))}
    </div>
  );
}

export function NewProjectCard() {
  const { t, translations } = useTranslation();
  const proj = translations.common.projects;

  return (
    <div className="card border-dashed flex flex-col items-center justify-center text-center opacity-60 hover:opacity-100 transition-opacity">
      <div className="text-4xl mb-4">✨</div>
      <h3 className="text-lg font-bold mb-2">{t(proj.newProject)}</h3>
      <p className="text-sm text-[var(--color-text-muted)]">
        {t(proj.comingSoon)}
      </p>
    </div>
  );
}
