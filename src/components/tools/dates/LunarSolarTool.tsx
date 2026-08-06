import { useState } from 'react';
import { lunarToSolar, solarToLunar } from '../../../lib/dates/lunarSolar';
import { ToolShell, ToolStatus } from '../media-calc/ToolShell';
import { ToolActions } from '../ui/ToolActions';
import { ToolField } from '../ui/ToolField';

type Mode = 'solar-to-lunar' | 'lunar-to-solar';

const pad = (value: number) => String(value).padStart(2, '0');
const RANGE_MESSAGE =
  'Enter a valid date between the years 1000 and 2050 (Korean lunar data range).';

export default function LunarSolarTool() {
  const today = new Date();
  const [mode, setMode] = useState<Mode>('solar-to-lunar');
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [day, setDay] = useState(today.getDate());
  const [leapMonth, setLeapMonth] = useState(false);

  let resultText: string | null = null;
  if (mode === 'solar-to-lunar') {
    const lunar = solarToLunar(year, month, day);
    if (lunar) {
      const leapLabel = lunar.leapMonth ? ', leap month' : '';
      resultText = `Lunar ${lunar.year}-${pad(lunar.month)}-${pad(lunar.day)}${leapLabel} (${lunar.gapjaYear})`;
    }
  } else {
    const solar = lunarToSolar(year, month, day, leapMonth);
    if (solar) {
      resultText = `Solar ${solar.year}-${pad(solar.month)}-${pad(solar.day)}`;
    }
  }

  return (
    <ToolShell>
      <ToolActions
        selection
        primary={(
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'solar-to-lunar'}
            aria-pressed={mode === 'solar-to-lunar'}
            onClick={() => setMode('solar-to-lunar')}
          >
            Solar → Lunar
          </button>
        )}
        secondary={(
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'lunar-to-solar'}
            aria-pressed={mode === 'lunar-to-solar'}
            onClick={() => setMode('lunar-to-solar')}
          >
            Lunar → Solar
          </button>
        )}
        className="fc-segmented-control"
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <ToolField id="lunar-solar-year" label="Year">
          <input
            type="number"
            min="1000"
            max="2050"
            value={year}
            onChange={event => setYear(Number(event.target.value))}
          />
        </ToolField>
        <ToolField id="lunar-solar-month" label="Month">
          <input
            type="number"
            min="1"
            max="12"
            value={month}
            onChange={event => setMonth(Number(event.target.value))}
          />
        </ToolField>
        <ToolField id="lunar-solar-day" label="Day">
          <input
            type="number"
            min="1"
            max="31"
            value={day}
            onChange={event => setDay(Number(event.target.value))}
          />
        </ToolField>
      </div>
      {mode === 'lunar-to-solar' && (
        <ToolField id="lunar-solar-leap" label="Leap month">
          <input
            type="checkbox"
            checked={leapMonth}
            onChange={event => setLeapMonth(event.target.checked)}
          />
        </ToolField>
      )}
      <ToolStatus
        status={resultText ? 'success' : 'error'}
        title={mode === 'solar-to-lunar' ? 'Lunar date' : 'Solar date'}
      >
        <p data-testid="lunar-solar-result" className={resultText ? 'text-xl font-semibold' : undefined}>
          {resultText ?? RANGE_MESSAGE}
        </p>
      </ToolStatus>
    </ToolShell>
  );
}
