import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import { ToolActions } from './ui/ToolActions';
import { ToolField } from './ui/ToolField';
import { ToolPanel } from './ui/ToolPanel';

function generateUUID(): string {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function UuidGenerator() {
  const { t, translations } = useTranslation();
  const tt = translations.tools.uuid;
  const tc = translations.tools.common;

  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState('1');
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  useEffect(() => {
    setUuids([generateUUID()]);
  }, []);

  const generate = useCallback(() => {
    const newUuids: string[] = [];
    const normalizedCount = Math.max(1, Math.min(100, Number(count) || 1));
    for (let i = 0; i < normalizedCount; i++) {
      let uuid = generateUUID();
      if (!hyphens) uuid = uuid.replace(/-/g, '');
      if (uppercase) uuid = uuid.toUpperCase();
      newUuids.push(uuid);
    }
    setUuids(newUuids);
    setCopiedIndex(null);
    setCopiedAll(false);
  }, [count, uppercase, hyphens]);

  const copyUuid = async (uuid: string, index: number) => {
    try {
      await navigator.clipboard.writeText(uuid);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(uuids.join('\n'));
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatUuid = (uuid: string): string => {
    let formatted = uuid;
    if (!hyphens) formatted = formatted.replace(/-/g, '');
    if (uppercase) formatted = formatted.toUpperCase();
    else formatted = formatted.toLowerCase();
    return formatted;
  };

  return (
    <ToolPanel className="gap-6">
      {/* Options */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Count */}
        <ToolField id="uuid-count" label={`${t(tt.count)}:`}>
          <input
            type="number"
            min="1"
            max="100"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            onBlur={() => setCount(String(Math.max(1, Math.min(100, Number(count) || 1))))}
            className="w-20 text-center"
          />
        </ToolField>

        {/* Options checkboxes */}
        <ToolField id="uuid-uppercase" label={t(tt.uppercase)}>
          <input
            type="checkbox"
            checked={uppercase}
            onChange={(e) => setUppercase(e.target.checked)}
            className="w-4 h-4 rounded border-[var(--color-border)] text-primary-500
              focus:ring-primary-500"
          />
        </ToolField>

        <ToolField id="uuid-hyphens" label={t(tt.hyphens)}>
          <input
            type="checkbox"
            checked={hyphens}
            onChange={(e) => setHyphens(e.target.checked)}
            className="w-4 h-4 rounded border-[var(--color-border)] text-primary-500
              focus:ring-primary-500"
          />
        </ToolField>
      </div>

      {/* Generate Button */}
      <ToolActions primary={<button className="w-full" onClick={generate}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        {t(tc.generate)}
      </button>} />

      {/* UUIDs List */}
      <div className="space-y-2">
        {uuids.map((uuid, index) => (
          <div
            key={index}
            className="flex items-center gap-2 p-3 rounded-lg
              bg-[var(--color-card)] border border-[var(--color-border)]"
          >
            <code className="flex-1 font-mono text-[var(--color-text)] break-all">
              {formatUuid(uuid)}
            </code>
            <ToolActions primary={<button
              onClick={() => copyUuid(formatUuid(uuid), index)}
              className="px-3 py-1 text-sm bg-[var(--color-bg)] hover:bg-[var(--color-card-hover)]
                border border-[var(--color-border)] rounded transition-colors whitespace-nowrap"
            >
              {copiedIndex === index ? t(tc.copied) : t(tc.copy)}
            </button>} />
          </div>
        ))}
      </div>

      {/* Copy All (if multiple) */}
      {uuids.length > 1 && (
        <ToolActions primary={<button
          onClick={copyAll}
          className="w-full py-2 bg-[var(--color-card)] hover:bg-[var(--color-card-hover)]
            border border-[var(--color-border)] rounded-lg transition-colors"
        >
          {copiedAll
            ? t(tc.copied)
            : t({ ko: '모두 복사', en: 'Copy All', ja: 'すべてコピー' })}
        </button>} />
      )}

      {/* Info */}
      <div className="p-4 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]">
        <p className="text-sm text-[var(--color-text-muted)]">
          {t({
            ko: 'UUID v4는 랜덤하게 생성되며 충돌 확률이 매우 낮습니다. 데이터베이스 ID, 세션 토큰 등에 사용됩니다.',
            en: 'UUID v4 is randomly generated with an extremely low collision probability. Used for database IDs, session tokens, etc.',
            ja: 'UUID v4はランダムに生成され、衝突確率が非常に低いです。データベースID、セッショントークンなどに使用されます。',
          })}
        </p>
      </div>
    </ToolPanel>
  );
}
