import { useTranslation } from '../i18n/useTranslation';

export default function AboutContent() {
  const { t, translations } = useTranslation();
  const about = translations.common.about;

  return (
    <section className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Profile */}
        <div className="text-center mb-12">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-5xl shadow-2xl shadow-primary-500/25">
            🚀
          </div>
          <h1 className="text-4xl font-bold mb-2">Restato</h1>
          <p className="text-xl text-[var(--color-text-muted)]">
            {t(about.subtitle)}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h2>{t(about.greeting)}</h2>
          <p dangerouslySetInnerHTML={{ __html: t(about.intro) }} />

          <h2>{t(about.whatIsVibeCoding)}</h2>
          <p dangerouslySetInnerHTML={{ __html: t(about.vibeCodingDesc) }} />

          <h2>{t(about.whatWeCover)}</h2>
          <ul>
            <li><strong>{t(about.devLog)}</strong> - {t(about.devLogDesc)}</li>
            <li><strong>{t(about.til)}</strong> - {t(about.tilDesc)}</li>
            <li><strong>{t(about.claudeUsage)}</strong> - {t(about.claudeUsageDesc)}</li>
            <li><strong>{t(about.showcase)}</strong> - {t(about.showcaseDesc)}</li>
          </ul>

          <h2>{t(about.contact)}</h2>
          <p>{t(about.contactDesc)}</p>
        </div>

        {/* Social Links */}
        <div className="mt-12 flex justify-center gap-4">
          <a
            href="https://github.com/restato"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
