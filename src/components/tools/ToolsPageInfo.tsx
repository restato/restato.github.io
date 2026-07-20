import type { Language } from '../../data/tools/types';

interface ToolsPageInfoProps {
  lang?: Language;
}

const copy = {
  ko: {
    heading: 'ℹ️ 정보',
    items: [
      '각 도구 페이지에서 로컬 처리 또는 외부 네트워크 사용 여부를 확인할 수 있습니다.',
      '무료로 사용 가능하며, 회원가입이 필요없습니다.',
      '모바일과 데스크톱 모두에서 사용할 수 있습니다.',
      '한국어, 영어, 일본어 콘텐츠를 우선 제공하며 다른 언어는 영어로 안내합니다.',
    ],
  },
  en: {
    heading: 'ℹ️ Information',
    items: [
      'Each tool page discloses whether processing is local or uses an external network.',
      'Free to use. No registration required.',
      'Works on both mobile and desktop.',
      'Korean, English, and Japanese content is prioritized; other locales currently use English guidance.',
    ],
  },
  ja: {
    heading: 'ℹ️ 情報',
    items: [
      '各ツールページで、ローカル処理または外部ネットワーク利用の有無を確認できます。',
      '無料で利用でき、会員登録は不要です。',
      'モバイルとデスクトップの両方で利用できます。',
      '韓国語、英語、日本語を優先し、その他の言語は現在英語で案内します。',
    ],
  },
};

export default function ToolsPageInfo({ lang = 'en' }: ToolsPageInfoProps) {
  const uiLanguage = lang === 'ko' || lang === 'ja' ? lang : 'en';
  const text = copy[uiLanguage];

  return (
    <div className="mt-8 p-6 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)]">
      <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">{text.heading}</h2>
      <ul className="space-y-2 text-[var(--color-text-muted)]">
        {text.items.map(item => <li key={item}>• {item}</li>)}
      </ul>
    </div>
  );
}
