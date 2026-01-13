import { useState, useEffect } from 'react';

export default function TimestampConverter() {
  const [timestamp, setTimestamp] = useState('');
  const [dateString, setDateString] = useState('');
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [unit, setUnit] = useState<'seconds' | 'milliseconds'>('seconds');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const parseTimestamp = (ts: string): Date | null => {
    const num = parseInt(ts);
    if (isNaN(num)) return null;

    // Auto-detect: if > 10 digits, assume milliseconds
    if (ts.length > 10 || unit === 'milliseconds') {
      return new Date(num);
    }
    return new Date(num * 1000);
  };

  const parseDateString = (ds: string): number | null => {
    const date = new Date(ds);
    if (isNaN(date.getTime())) return null;
    return unit === 'milliseconds' ? date.getTime() : Math.floor(date.getTime() / 1000);
  };

  const timestampDate = parseTimestamp(timestamp);
  const dateTimestamp = parseDateString(dateString);

  const formatDate = (date: Date): string => {
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  const formatISO = (date: Date): string => {
    return date.toISOString();
  };

  const formatRelative = (date: Date): string => {
    const now = Date.now();
    const diff = now - date.getTime();
    const absDiff = Math.abs(diff);

    const seconds = Math.floor(absDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    let result = '';
    if (years > 0) result = `${years}년`;
    else if (months > 0) result = `${months}개월`;
    else if (days > 0) result = `${days}일`;
    else if (hours > 0) result = `${hours}시간`;
    else if (minutes > 0) result = `${minutes}분`;
    else result = `${seconds}초`;

    return diff > 0 ? `${result} 전` : `${result} 후`;
  };

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const currentTimestamp = unit === 'milliseconds' ? currentTime : Math.floor(currentTime / 1000);

  return (
    <div className="flex flex-col gap-6">
      {/* Current Time */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-primary-500/10 to-primary-500/5 border border-primary-500/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--color-text-muted)]">현재 Unix Timestamp</p>
            <p className="text-2xl font-mono font-bold text-primary-500">
              {currentTimestamp}
            </p>
          </div>
          <button
            onClick={() => {
              setTimestamp(String(currentTimestamp));
              copyText(String(currentTimestamp));
            }}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            복사 & 사용
          </button>
        </div>
        <p className="text-sm text-[var(--color-text-muted)] mt-2">
          {formatDate(new Date(currentTime))}
        </p>
      </div>

      {/* Unit Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setUnit('seconds')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors
            ${unit === 'seconds'
              ? 'bg-primary-500 text-white'
              : 'bg-[var(--color-card)] hover:bg-[var(--color-card-hover)] text-[var(--color-text)] border border-[var(--color-border)]'
            }`}
        >
          초 (Seconds)
        </button>
        <button
          onClick={() => setUnit('milliseconds')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors
            ${unit === 'milliseconds'
              ? 'bg-primary-500 text-white'
              : 'bg-[var(--color-card)] hover:bg-[var(--color-card-hover)] text-[var(--color-text)] border border-[var(--color-border)]'
            }`}
        >
          밀리초 (Milliseconds)
        </button>
      </div>

      {/* Timestamp to Date */}
      <div className="p-4 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]">
        <h3 className="font-medium text-[var(--color-text)] mb-4">⏱️ Timestamp → 날짜</h3>
        <div className="space-y-4">
          <input
            type="text"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value.replace(/\D/g, ''))}
            placeholder={unit === 'milliseconds' ? '1704067200000' : '1704067200'}
            className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)]
              bg-[var(--color-bg)] text-[var(--color-text)] font-mono
              focus:outline-none focus:ring-2 focus:ring-primary-500"
          />

          {timestampDate && (
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-[var(--color-bg)]">
                <p className="text-sm text-[var(--color-text-muted)]">로컬 시간</p>
                <p className="font-medium text-[var(--color-text)]">{formatDate(timestampDate)}</p>
              </div>
              <div className="p-3 rounded-lg bg-[var(--color-bg)]">
                <p className="text-sm text-[var(--color-text-muted)]">ISO 8601</p>
                <p className="font-mono text-[var(--color-text)]">{formatISO(timestampDate)}</p>
              </div>
              <div className="p-3 rounded-lg bg-[var(--color-bg)]">
                <p className="text-sm text-[var(--color-text-muted)]">상대 시간</p>
                <p className="font-medium text-primary-500">{formatRelative(timestampDate)}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Date to Timestamp */}
      <div className="p-4 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]">
        <h3 className="font-medium text-[var(--color-text)] mb-4">📅 날짜 → Timestamp</h3>
        <div className="space-y-4">
          <input
            type="datetime-local"
            value={dateString}
            onChange={(e) => setDateString(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)]
              bg-[var(--color-bg)] text-[var(--color-text)]
              focus:outline-none focus:ring-2 focus:ring-primary-500"
          />

          {dateTimestamp !== null && (
            <div className="p-3 rounded-lg bg-[var(--color-bg)] flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--color-text-muted)]">Unix Timestamp</p>
                <p className="font-mono font-bold text-[var(--color-text)]">{dateTimestamp}</p>
              </div>
              <button
                onClick={() => copyText(String(dateTimestamp))}
                className="px-3 py-1 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm transition-colors"
              >
                복사
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Common Timestamps */}
      <div className="p-4 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]">
        <h3 className="font-medium text-[var(--color-text)] mb-3">📌 자주 사용하는 시간</h3>
        <div className="space-y-2">
          {[
            { label: '1시간 후', getTs: () => Math.floor(Date.now() / 1000) + 3600 },
            { label: '내일', getTs: () => Math.floor(Date.now() / 1000) + 86400 },
            { label: '1주일 후', getTs: () => Math.floor(Date.now() / 1000) + 604800 },
            { label: '1개월 후', getTs: () => Math.floor(Date.now() / 1000) + 2592000 },
            { label: '2000년 1월 1일', getTs: () => 946684800 },
            { label: '2024년 1월 1일', getTs: () => 1704067200 },
            { label: '2025년 1월 1일', getTs: () => 1735689600 },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => setTimestamp(String(unit === 'milliseconds' ? item.getTs() * 1000 : item.getTs()))}
              className="w-full p-2 rounded-lg text-left hover:bg-[var(--color-bg)]
                text-[var(--color-text-muted)] transition-colors flex justify-between"
            >
              <span>{item.label}</span>
              <span className="font-mono text-sm">{item.getTs()}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]">
        <h3 className="font-medium text-[var(--color-text)] mb-2">💡 Unix Timestamp란?</h3>
        <p className="text-sm text-[var(--color-text-muted)]">
          1970년 1월 1일 00:00:00 UTC부터 경과한 시간을 초(또는 밀리초)로 표현한 값입니다.
          프로그래밍에서 시간을 다룰 때 널리 사용됩니다.
        </p>
      </div>
    </div>
  );
}
