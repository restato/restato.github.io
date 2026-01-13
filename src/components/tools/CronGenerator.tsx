import { useState, useMemo } from 'react';
import { useTranslation } from '../../i18n/useTranslation';

interface CronParts {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
}

const PRESETS = [
  { label: { ko: '매분', en: 'Every minute', ja: '毎分' }, cron: '* * * * *' },
  { label: { ko: '매시간', en: 'Every hour', ja: '毎時' }, cron: '0 * * * *' },
  { label: { ko: '매일 자정', en: 'Every day at midnight', ja: '毎日午前0時' }, cron: '0 0 * * *' },
  { label: { ko: '매일 정오', en: 'Every day at noon', ja: '毎日正午' }, cron: '0 12 * * *' },
  { label: { ko: '매주 월요일', en: 'Every Monday', ja: '毎週月曜日' }, cron: '0 0 * * 1' },
  { label: { ko: '매월 1일', en: 'First of every month', ja: '毎月1日' }, cron: '0 0 1 * *' },
  { label: { ko: '평일 9시', en: 'Weekdays at 9 AM', ja: '平日9時' }, cron: '0 9 * * 1-5' },
  { label: { ko: '5분마다', en: 'Every 5 minutes', ja: '5分ごと' }, cron: '*/5 * * * *' },
  { label: { ko: '30분마다', en: 'Every 30 minutes', ja: '30分ごと' }, cron: '*/30 * * * *' },
];

const DAYS_OF_WEEK = [
  { value: '0', label: { ko: '일', en: 'Sun', ja: '日' } },
  { value: '1', label: { ko: '월', en: 'Mon', ja: '月' } },
  { value: '2', label: { ko: '화', en: 'Tue', ja: '火' } },
  { value: '3', label: { ko: '수', en: 'Wed', ja: '水' } },
  { value: '4', label: { ko: '목', en: 'Thu', ja: '木' } },
  { value: '5', label: { ko: '금', en: 'Fri', ja: '金' } },
  { value: '6', label: { ko: '토', en: 'Sat', ja: '土' } },
];

const MONTHS = [
  { value: '1', label: { ko: '1월', en: 'Jan', ja: '1月' } },
  { value: '2', label: { ko: '2월', en: 'Feb', ja: '2月' } },
  { value: '3', label: { ko: '3월', en: 'Mar', ja: '3月' } },
  { value: '4', label: { ko: '4월', en: 'Apr', ja: '4月' } },
  { value: '5', label: { ko: '5월', en: 'May', ja: '5月' } },
  { value: '6', label: { ko: '6월', en: 'Jun', ja: '6月' } },
  { value: '7', label: { ko: '7월', en: 'Jul', ja: '7月' } },
  { value: '8', label: { ko: '8월', en: 'Aug', ja: '8月' } },
  { value: '9', label: { ko: '9월', en: 'Sep', ja: '9月' } },
  { value: '10', label: { ko: '10월', en: 'Oct', ja: '10月' } },
  { value: '11', label: { ko: '11월', en: 'Nov', ja: '11月' } },
  { value: '12', label: { ko: '12월', en: 'Dec', ja: '12月' } },
];

function describeCron(parts: CronParts, t: (obj: Record<string, string>) => string): string {
  const { minute, hour, dayOfMonth, month, dayOfWeek } = parts;

  const descriptions: string[] = [];

  // Minute
  if (minute === '*') {
    descriptions.push(t({ ko: '매분', en: 'every minute', ja: '毎分' }));
  } else if (minute.startsWith('*/')) {
    descriptions.push(t({ ko: `${minute.slice(2)}분마다`, en: `every ${minute.slice(2)} minutes`, ja: `${minute.slice(2)}分ごとに` }));
  } else {
    descriptions.push(t({ ko: `${minute}분에`, en: `at minute ${minute}`, ja: `${minute}分に` }));
  }

  // Hour
  if (hour === '*') {
    descriptions.push(t({ ko: '매시간', en: 'every hour', ja: '毎時' }));
  } else if (hour.startsWith('*/')) {
    descriptions.push(t({ ko: `${hour.slice(2)}시간마다`, en: `every ${hour.slice(2)} hours`, ja: `${hour.slice(2)}時間ごとに` }));
  } else {
    descriptions.push(t({ ko: `${hour}시에`, en: `at ${hour}:00`, ja: `${hour}時に` }));
  }

  // Day of month
  if (dayOfMonth !== '*') {
    if (dayOfMonth.startsWith('*/')) {
      descriptions.push(t({ ko: `${dayOfMonth.slice(2)}일마다`, en: `every ${dayOfMonth.slice(2)} days`, ja: `${dayOfMonth.slice(2)}日ごとに` }));
    } else {
      descriptions.push(t({ ko: `${dayOfMonth}일에`, en: `on day ${dayOfMonth}`, ja: `${dayOfMonth}日に` }));
    }
  }

  // Month
  if (month !== '*') {
    const monthNames = MONTHS.find((m) => m.value === month);
    if (monthNames) {
      descriptions.push(t({ ko: `${monthNames.label.ko}에`, en: `in ${monthNames.label.en}`, ja: `${monthNames.label.ja}に` }));
    }
  }

  // Day of week
  if (dayOfWeek !== '*') {
    if (dayOfWeek === '1-5') {
      descriptions.push(t({ ko: '평일에', en: 'on weekdays', ja: '平日に' }));
    } else if (dayOfWeek === '0,6') {
      descriptions.push(t({ ko: '주말에', en: 'on weekends', ja: '週末に' }));
    } else {
      const dayName = DAYS_OF_WEEK.find((d) => d.value === dayOfWeek);
      if (dayName) {
        descriptions.push(t({ ko: `${dayName.label.ko}요일에`, en: `on ${dayName.label.en}`, ja: `${dayName.label.ja}曜日に` }));
      }
    }
  }

  return descriptions.join(' ');
}

export default function CronGenerator() {
  const { t, lang } = useTranslation();

  const [parts, setParts] = useState<CronParts>({
    minute: '0',
    hour: '*',
    dayOfMonth: '*',
    month: '*',
    dayOfWeek: '*',
  });
  const [copied, setCopied] = useState(false);

  const cronExpression = useMemo(() => {
    return `${parts.minute} ${parts.hour} ${parts.dayOfMonth} ${parts.month} ${parts.dayOfWeek}`;
  }, [parts]);

  const description = useMemo(() => {
    return describeCron(parts, t);
  }, [parts, t]);

  const parseCron = (cron: string) => {
    const split = cron.split(' ');
    if (split.length === 5) {
      setParts({
        minute: split[0],
        hour: split[1],
        dayOfMonth: split[2],
        month: split[3],
        dayOfWeek: split[4],
      });
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(cronExpression);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Result */}
      <div className="p-6 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)]">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-[var(--color-text-muted)]">Cron Expression</span>
          <button
            onClick={copyToClipboard}
            className="px-3 py-1 text-sm bg-[var(--color-bg)] hover:bg-[var(--color-card-hover)]
              border border-[var(--color-border)] rounded transition-colors"
          >
            {copied ? t({ ko: '복사됨!', en: 'Copied!', ja: 'コピーしました!' }) : t({ ko: '복사', en: 'Copy', ja: 'コピー' })}
          </button>
        </div>
        <code className="block text-3xl font-mono text-center text-primary-500 py-4">
          {cronExpression}
        </code>
        <p className="text-center text-[var(--color-text-muted)] mt-4">
          {description}
        </p>
      </div>

      {/* Presets */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-text)]">
          {t({ ko: '프리셋', en: 'Presets', ja: 'プリセット' })}
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.cron}
              onClick={() => parseCron(preset.cron)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors
                ${cronExpression === preset.cron
                  ? 'bg-primary-500 text-white'
                  : 'bg-[var(--color-card)] hover:bg-[var(--color-card-hover)] text-[var(--color-text)] border border-[var(--color-border)]'
                }`}
            >
              {t(preset.label)}
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="grid grid-cols-5 gap-2">
        {[
          { key: 'minute', label: { ko: '분', en: 'Min', ja: '分' }, range: '0-59' },
          { key: 'hour', label: { ko: '시', en: 'Hour', ja: '時' }, range: '0-23' },
          { key: 'dayOfMonth', label: { ko: '일', en: 'Day', ja: '日' }, range: '1-31' },
          { key: 'month', label: { ko: '월', en: 'Month', ja: '月' }, range: '1-12' },
          { key: 'dayOfWeek', label: { ko: '요일', en: 'DoW', ja: '曜日' }, range: '0-6' },
        ].map(({ key, label, range }) => (
          <div key={key} className="space-y-1">
            <label className="block text-xs text-center text-[var(--color-text-muted)]">
              {t(label)}
            </label>
            <input
              type="text"
              value={parts[key as keyof CronParts]}
              onChange={(e) => setParts({ ...parts, [key]: e.target.value })}
              className="w-full px-2 py-2 text-center font-mono text-lg rounded-lg
                border border-[var(--color-border)] bg-[var(--color-card)]
                text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <span className="block text-xs text-center text-[var(--color-text-muted)]">
              {range}
            </span>
          </div>
        ))}
      </div>

      {/* Quick selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Day of Week Quick Select */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-text)]">
            {t({ ko: '요일 선택', en: 'Day of Week', ja: '曜日選択' })}
          </label>
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setParts({ ...parts, dayOfWeek: '*' })}
              className={`px-2 py-1 text-xs rounded ${parts.dayOfWeek === '*' ? 'bg-primary-500 text-white' : 'bg-[var(--color-card)] border border-[var(--color-border)]'}`}
            >
              {t({ ko: '매일', en: 'Every', ja: '毎日' })}
            </button>
            <button
              onClick={() => setParts({ ...parts, dayOfWeek: '1-5' })}
              className={`px-2 py-1 text-xs rounded ${parts.dayOfWeek === '1-5' ? 'bg-primary-500 text-white' : 'bg-[var(--color-card)] border border-[var(--color-border)]'}`}
            >
              {t({ ko: '평일', en: 'Weekdays', ja: '平日' })}
            </button>
            <button
              onClick={() => setParts({ ...parts, dayOfWeek: '0,6' })}
              className={`px-2 py-1 text-xs rounded ${parts.dayOfWeek === '0,6' ? 'bg-primary-500 text-white' : 'bg-[var(--color-card)] border border-[var(--color-border)]'}`}
            >
              {t({ ko: '주말', en: 'Weekend', ja: '週末' })}
            </button>
            {DAYS_OF_WEEK.map((day) => (
              <button
                key={day.value}
                onClick={() => setParts({ ...parts, dayOfWeek: day.value })}
                className={`px-2 py-1 text-xs rounded ${parts.dayOfWeek === day.value ? 'bg-primary-500 text-white' : 'bg-[var(--color-card)] border border-[var(--color-border)]'}`}
              >
                {t(day.label)}
              </button>
            ))}
          </div>
        </div>

        {/* Common Intervals */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-text)]">
            {t({ ko: '분 간격', en: 'Minute Interval', ja: '分間隔' })}
          </label>
          <div className="flex flex-wrap gap-1">
            {['*', '0', '*/5', '*/10', '*/15', '*/30'].map((val) => (
              <button
                key={val}
                onClick={() => setParts({ ...parts, minute: val })}
                className={`px-2 py-1 text-xs rounded ${parts.minute === val ? 'bg-primary-500 text-white' : 'bg-[var(--color-card)] border border-[var(--color-border)]'}`}
              >
                {val === '*' ? t({ ko: '매분', en: 'Every', ja: '毎分' }) : val}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reference */}
      <div className="p-4 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]">
        <h3 className="text-sm font-medium text-[var(--color-text)] mb-2">
          {t({ ko: 'Cron 문법', en: 'Cron Syntax', ja: 'Cron構文' })}
        </h3>
        <div className="text-xs text-[var(--color-text-muted)] space-y-1 font-mono">
          <p><code>*</code> - {t({ ko: '모든 값', en: 'any value', ja: 'すべての値' })}</p>
          <p><code>,</code> - {t({ ko: '값 구분 (1,3,5)', en: 'value separator (1,3,5)', ja: '値の区切り (1,3,5)' })}</p>
          <p><code>-</code> - {t({ ko: '범위 (1-5)', en: 'range (1-5)', ja: '範囲 (1-5)' })}</p>
          <p><code>/</code> - {t({ ko: '간격 (*/5 = 5마다)', en: 'step (*/5 = every 5)', ja: '間隔 (*/5 = 5ごと)' })}</p>
        </div>
      </div>
    </div>
  );
}
