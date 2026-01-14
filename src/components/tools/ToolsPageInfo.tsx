import { useTranslation } from '../../i18n/useTranslation';
import { useState, useEffect } from 'react';

export default function ToolsPageInfo() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const infoItems = [
    {
      ko: '모든 도구는 브라우저에서 실행되며, 데이터가 서버로 전송되지 않습니다.',
      en: 'All tools run in your browser. No data is sent to any server.',
      ja: 'すべてのツールはブラウザで実行され、データはサーバーに送信されません。',
    },
    {
      ko: '무료로 사용 가능하며, 회원가입이 필요없습니다.',
      en: 'Free to use. No registration required.',
      ja: '無料でご利用いただけます。会員登録は不要です。',
    },
    {
      ko: '모바일과 데스크톱 모두에서 사용할 수 있습니다.',
      en: 'Works on both mobile and desktop.',
      ja: 'モバイルとデスクトップの両方でご利用いただけます。',
    },
    {
      ko: '한국어, 영어, 일본어를 지원합니다.',
      en: 'Supports Korean, English, and Japanese.',
      ja: '韓国語、英語、日本語に対応しています。',
    },
  ];

  return (
    <div className="mt-8 p-6 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)]">
      <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">
        {mounted ? t({ ko: 'ℹ️ 정보', en: 'ℹ️ Information', ja: 'ℹ️ 情報' }) : 'ℹ️ 정보'}
      </h2>
      <ul className="space-y-2 text-[var(--color-text-muted)]">
        {infoItems.map((item, index) => (
          <li key={index}>• {mounted ? t(item) : item.ko}</li>
        ))}
      </ul>
    </div>
  );
}
