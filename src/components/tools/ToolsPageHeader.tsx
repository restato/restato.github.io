import { useTranslation } from '../../i18n/useTranslation';
import { useState, useEffect } from 'react';

export default function ToolsPageHeader() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show Korean during SSR for SEO, then switch to user's language
  if (!mounted) {
    return (
      <>
        <nav className="text-sm mb-6">
          <ol className="flex items-center gap-2">
            <li><a href="/" className="text-[var(--color-text-muted)] hover:text-primary-500">홈</a></li>
            <li className="text-[var(--color-text-muted)]">/</li>
            <li className="text-[var(--color-text)]">도구</li>
          </ol>
        </nav>
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4">
            온라인 도구
          </h1>
          <p className="text-[var(--color-text-muted)] text-lg">
            개발자, 디자이너, 마케터, PM을 위한 유용한 웹 도구 모음입니다. 무료로 사용할 수 있습니다.
          </p>
        </header>
      </>
    );
  }

  return (
    <>
      <nav className="text-sm mb-6">
        <ol className="flex items-center gap-2">
          <li>
            <a href="/" className="text-[var(--color-text-muted)] hover:text-primary-500">
              {t({ ko: '홈', en: 'Home', ja: 'ホーム' })}
            </a>
          </li>
          <li className="text-[var(--color-text-muted)]">/</li>
          <li className="text-[var(--color-text)]">
            {t({ ko: '도구', en: 'Tools', ja: 'ツール' })}
          </li>
        </ol>
      </nav>
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4">
          {t({ ko: '온라인 도구', en: 'Online Tools', ja: 'オンラインツール' })}
        </h1>
        <p className="text-[var(--color-text-muted)] text-lg">
          {t({
            ko: '개발자, 디자이너, 마케터, PM을 위한 유용한 웹 도구 모음입니다. 무료로 사용할 수 있습니다.',
            en: 'A collection of useful web tools for developers, designers, marketers, and PMs. Free to use.',
            ja: '開発者、デザイナー、マーケター、PM向けの便利なウェブツール集です。無料でご利用いただけます。',
          })}
        </p>
      </header>
    </>
  );
}
