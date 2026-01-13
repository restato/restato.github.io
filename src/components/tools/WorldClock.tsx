import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '../../i18n/useTranslation';

interface Timezone {
  id: string;
  name: { ko: string; en: string; ja: string };
  offset: number; // hours from UTC
  city: string;
}

const TIMEZONES: Timezone[] = [
  { id: 'utc', name: { ko: 'UTC', en: 'UTC', ja: 'UTC' }, offset: 0, city: 'UTC' },
  { id: 'kst', name: { ko: '한국 표준시', en: 'Korea Standard Time', ja: '韓国標準時' }, offset: 9, city: 'Seoul' },
  { id: 'jst', name: { ko: '일본 표준시', en: 'Japan Standard Time', ja: '日本標準時' }, offset: 9, city: 'Tokyo' },
  { id: 'cst_china', name: { ko: '중국 표준시', en: 'China Standard Time', ja: '中国標準時' }, offset: 8, city: 'Beijing' },
  { id: 'ist', name: { ko: '인도 표준시', en: 'India Standard Time', ja: 'インド標準時' }, offset: 5.5, city: 'Mumbai' },
  { id: 'gmt', name: { ko: '그리니치 표준시', en: 'Greenwich Mean Time', ja: 'グリニッジ標準時' }, offset: 0, city: 'London' },
  { id: 'cet', name: { ko: '중앙 유럽 시간', en: 'Central European Time', ja: '中央ヨーロッパ時間' }, offset: 1, city: 'Paris' },
  { id: 'eet', name: { ko: '동유럽 시간', en: 'Eastern European Time', ja: '東ヨーロッパ時間' }, offset: 2, city: 'Athens' },
  { id: 'est', name: { ko: '미국 동부 표준시', en: 'Eastern Standard Time', ja: '米国東部標準時' }, offset: -5, city: 'New York' },
  { id: 'cst_us', name: { ko: '미국 중부 표준시', en: 'Central Standard Time', ja: '米国中部標準時' }, offset: -6, city: 'Chicago' },
  { id: 'mst', name: { ko: '미국 산악 표준시', en: 'Mountain Standard Time', ja: '米国山岳標準時' }, offset: -7, city: 'Denver' },
  { id: 'pst', name: { ko: '미국 태평양 표준시', en: 'Pacific Standard Time', ja: '米国太平洋標準時' }, offset: -8, city: 'Los Angeles' },
  { id: 'akst', name: { ko: '알래스카 표준시', en: 'Alaska Standard Time', ja: 'アラスカ標準時' }, offset: -9, city: 'Anchorage' },
  { id: 'hst', name: { ko: '하와이 표준시', en: 'Hawaii Standard Time', ja: 'ハワイ標準時' }, offset: -10, city: 'Honolulu' },
  { id: 'aest', name: { ko: '호주 동부 표준시', en: 'Australian Eastern Time', ja: 'オーストラリア東部時間' }, offset: 10, city: 'Sydney' },
  { id: 'nzst', name: { ko: '뉴질랜드 표준시', en: 'New Zealand Standard Time', ja: 'ニュージーランド標準時' }, offset: 12, city: 'Auckland' },
];

function formatTime(date: Date, offset: number): string {
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  const targetTime = new Date(utc + offset * 3600000);
  return targetTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

function formatDate(date: Date, offset: number, lang: string): string {
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  const targetTime = new Date(utc + offset * 3600000);
  const locale = lang === 'ko' ? 'ko-KR' : lang === 'ja' ? 'ja-JP' : 'en-US';
  return targetTime.toLocaleDateString(locale, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function getOffsetString(offset: number): string {
  const sign = offset >= 0 ? '+' : '-';
  const absOffset = Math.abs(offset);
  const hours = Math.floor(absOffset);
  const minutes = (absOffset - hours) * 60;
  if (minutes === 0) {
    return `UTC${sign}${hours}`;
  }
  return `UTC${sign}${hours}:${minutes.toString().padStart(2, '0')}`;
}

export default function WorldClock() {
  const { t, lang } = useTranslation();

  const [now, setNow] = useState(new Date());
  const [selectedZones, setSelectedZones] = useState<string[]>(['utc', 'kst', 'est', 'pst']);
  const [inputTime, setInputTime] = useState('');
  const [inputDate, setInputDate] = useState('');
  const [inputZone, setInputZone] = useState('kst');

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleZone = (id: string) => {
    if (selectedZones.includes(id)) {
      if (selectedZones.length > 1) {
        setSelectedZones(selectedZones.filter((z) => z !== id));
      }
    } else {
      setSelectedZones([...selectedZones, id]);
    }
  };

  const convertedTimes = useMemo(() => {
    if (!inputTime || !inputDate) return null;

    const sourceZone = TIMEZONES.find((z) => z.id === inputZone);
    if (!sourceZone) return null;

    try {
      const [hours, minutes] = inputTime.split(':').map(Number);
      const [year, month, day] = inputDate.split('-').map(Number);

      // Create date in UTC
      const utcTime = Date.UTC(year, month - 1, day, hours - sourceZone.offset, minutes);

      return TIMEZONES.map((tz) => {
        const targetTime = new Date(utcTime + tz.offset * 3600000);
        return {
          ...tz,
          time: targetTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }),
          date: targetTime.toLocaleDateString(lang === 'ko' ? 'ko-KR' : lang === 'ja' ? 'ja-JP' : 'en-US', {
            month: 'short',
            day: 'numeric',
          }),
        };
      });
    } catch {
      return null;
    }
  }, [inputTime, inputDate, inputZone, lang]);

  const setToNow = () => {
    const now = new Date();
    setInputDate(now.toISOString().split('T')[0]);
    setInputTime(now.toTimeString().slice(0, 5));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Current Time Display */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {selectedZones.map((zoneId) => {
          const zone = TIMEZONES.find((z) => z.id === zoneId);
          if (!zone) return null;
          return (
            <div
              key={zone.id}
              className="p-4 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]
                text-center relative group"
            >
              <button
                onClick={() => toggleZone(zone.id)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity
                  p-1 hover:bg-[var(--color-bg)] rounded"
              >
                <svg className="w-4 h-4 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <p className="text-sm text-[var(--color-text-muted)]">{zone.city}</p>
              <p className="text-3xl font-mono font-bold text-[var(--color-text)] my-2">
                {formatTime(now, zone.offset)}
              </p>
              <p className="text-sm text-[var(--color-text-muted)]">
                {formatDate(now, zone.offset, lang)}
              </p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                {getOffsetString(zone.offset)}
              </p>
            </div>
          );
        })}
      </div>

      {/* Add Timezone */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-text)]">
          {t({ ko: '시간대 추가', en: 'Add Timezone', ja: 'タイムゾーンを追加' })}
        </label>
        <div className="flex flex-wrap gap-2">
          {TIMEZONES.filter((z) => !selectedZones.includes(z.id)).map((zone) => (
            <button
              key={zone.id}
              onClick={() => toggleZone(zone.id)}
              className="px-3 py-1 text-sm bg-[var(--color-card)] hover:bg-[var(--color-card-hover)]
                border border-[var(--color-border)] rounded-lg transition-colors"
            >
              {zone.city}
            </button>
          ))}
        </div>
      </div>

      {/* Time Converter */}
      <div className="p-4 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] space-y-4">
        <h3 className="text-sm font-medium text-[var(--color-text)]">
          {t({ ko: '시간 변환기', en: 'Time Converter', ja: '時間変換器' })}
        </h3>

        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-1">
            <label className="text-xs text-[var(--color-text-muted)]">
              {t({ ko: '날짜', en: 'Date', ja: '日付' })}
            </label>
            <input
              type="date"
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
              className="px-3 py-2 rounded-lg border border-[var(--color-border)]
                bg-[var(--color-bg)] text-[var(--color-text)]
                focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-[var(--color-text-muted)]">
              {t({ ko: '시간', en: 'Time', ja: '時間' })}
            </label>
            <input
              type="time"
              value={inputTime}
              onChange={(e) => setInputTime(e.target.value)}
              className="px-3 py-2 rounded-lg border border-[var(--color-border)]
                bg-[var(--color-bg)] text-[var(--color-text)]
                focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-[var(--color-text-muted)]">
              {t({ ko: '시간대', en: 'Timezone', ja: 'タイムゾーン' })}
            </label>
            <select
              value={inputZone}
              onChange={(e) => setInputZone(e.target.value)}
              className="px-3 py-2 rounded-lg border border-[var(--color-border)]
                bg-[var(--color-bg)] text-[var(--color-text)]
                focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {TIMEZONES.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.city} ({getOffsetString(zone.offset)})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={setToNow}
            className="px-3 py-2 text-sm bg-primary-500 hover:bg-primary-600 text-white rounded-lg
              transition-colors"
          >
            {t({ ko: '현재 시간', en: 'Now', ja: '現在時刻' })}
          </button>
        </div>

        {/* Conversion Results */}
        {convertedTimes && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
            {convertedTimes.map((tz) => (
              <div
                key={tz.id}
                className={`p-2 rounded text-center text-sm ${
                  tz.id === inputZone
                    ? 'bg-primary-100 dark:bg-primary-900/30 border border-primary-300 dark:border-primary-700'
                    : 'bg-[var(--color-bg)]'
                }`}
              >
                <p className="text-[var(--color-text-muted)] text-xs">{tz.city}</p>
                <p className="font-mono font-medium text-[var(--color-text)]">{tz.time}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{tz.date}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
