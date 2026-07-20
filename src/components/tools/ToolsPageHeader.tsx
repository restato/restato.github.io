import type { Language } from '../../data/tools/types';

interface ToolsPageHeaderProps {
  lang?: Language;
}

const copy = {
  ko: {
    home: '홈', tools: '도구', heading: '온라인 도구',
    description: '개발자, 디자이너, 마케터, PM을 위한 유용한 웹 도구 모음입니다. 무료로 사용할 수 있습니다.',
  },
  en: {
    home: 'Home', tools: 'Tools', heading: 'Online Tools',
    description: 'A collection of useful web tools for developers, designers, marketers, and PMs. Free to use.',
  },
  ja: {
    home: 'ホーム', tools: 'ツール', heading: 'オンラインツール',
    description: '開発者、デザイナー、マーケター、PM向けの便利なウェブツール集です。無料でご利用いただけます。',
  },
};

export default function ToolsPageHeader({ lang = 'en' }: ToolsPageHeaderProps) {
  const uiLanguage = lang === 'ko' || lang === 'ja' ? lang : 'en';
  const text = copy[uiLanguage];

  return (
    <>
      <nav className="text-sm mb-6">
        <ol className="flex items-center gap-2">
          <li><a href={`/${lang}/`} className="text-[var(--color-text-muted)] hover:text-primary-500">{text.home}</a></li>
          <li className="text-[var(--color-text-muted)]">/</li>
          <li className="text-[var(--color-text)]">{text.tools}</li>
        </ol>
      </nav>
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4">{text.heading}</h1>
        <p className="text-[var(--color-text-muted)] text-lg">{text.description}</p>
      </header>
    </>
  );
}
