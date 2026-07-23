import { useState } from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import { ToolActions } from './ui/ToolActions';
import { ToolField } from './ui/ToolField';
import { ToolPanel } from './ui/ToolPanel';

interface DiceConfig {
  sides: number;
  count: number;
}

export default function DiceRoller() {
  const { t } = useTranslation();
  const [config, setConfig] = useState<DiceConfig>({ sides: 6, count: 1 });
  const [results, setResults] = useState<number[]>([]);
  const [isRolling, setIsRolling] = useState(false);
  const [history, setHistory] = useState<Array<{ config: DiceConfig; results: number[]; total: number }>>([]);

  const diceTypes = [4, 6, 8, 10, 12, 20, 100];

  const roll = () => {
    if (isRolling) return;

    setIsRolling(true);
    setResults([]);

    setTimeout(() => {
      const newResults = Array.from({ length: config.count }, () =>
        Math.floor(Math.random() * config.sides) + 1
      );
      setResults(newResults);
      setHistory((prev) => [
        { config: { ...config }, results: newResults, total: newResults.reduce((a, b) => a + b, 0) },
        ...prev,
      ].slice(0, 10));
      setIsRolling(false);
    }, 800);
  };

  const total = results.reduce((a, b) => a + b, 0);
  const maxPossible = config.sides * config.count;
  const minPossible = config.count;

  const getDiceEmoji = (sides: number) => {
    const emojis: Record<number, string> = {
      4: '🔺',
      6: '🎲',
      8: '💎',
      10: '🔟',
      12: '⬡',
      20: '🎯',
      100: '💯',
    };
    return emojis[sides] || '🎲';
  };

  return (
    <ToolPanel className="gap-6">
      {/* Dice Type Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[var(--color-text)]">
          {t({ ko: '주사위 종류', en: 'Die type', ja: 'サイコロの種類' })}
        </label>
        <ToolActions selection className="flex flex-wrap gap-2" primary={diceTypes.map((sides) => (
            <button
              key={sides}
              aria-pressed={config.sides === sides}
              onClick={() => setConfig((c) => ({ ...c, sides }))}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${config.sides === sides
                  ? 'bg-primary-500 text-white'
                  : 'bg-[var(--color-card)] hover:bg-[var(--color-card-hover)] text-[var(--color-text)] border border-[var(--color-border)]'
                }`}
            >
              {getDiceEmoji(sides)} D{sides}
            </button>
          ))} />
      </div>

      {/* Dice Count */}
      <div className="space-y-2">
        <ToolField id="dice-count" label={t({ ko: `주사위 개수: ${config.count}개`, en: `Number of dice: ${config.count}`, ja: `サイコロの数：${config.count}` })}>
        <input
          type="range"
          min="1"
          max="10"
          value={config.count}
          onChange={(e) => setConfig((c) => ({ ...c, count: parseInt(e.target.value) }))}
          className="w-full accent-primary-500"
        />
        </ToolField>
        <div className="flex justify-between text-xs text-[var(--color-text-muted)]">
          <span>1</span>
          <span>10</span>
        </div>
      </div>

      {/* Dice Display */}
      <div className="flex flex-wrap justify-center gap-4 min-h-[100px] items-center">
        {isRolling ? (
          <div className="text-6xl animate-bounce">{getDiceEmoji(config.sides)}</div>
        ) : results.length > 0 ? (
          results.map((result, i) => (
            <div
              key={i}
              className="w-16 h-16 rounded-lg bg-primary-500/10 border-2 border-primary-500
                flex items-center justify-center text-2xl font-bold text-primary-500"
            >
              {result}
            </div>
          ))
        ) : (
          <p className="text-[var(--color-text-muted)]">{t({ ko: '주사위를 굴려보세요!', en: 'Roll the dice!', ja: 'サイコロを振ってみましょう！' })}</p>
        )}
      </div>

      {/* Total */}
      {results.length > 0 && !isRolling && (
        <div className="text-center p-4 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]">
          <p className="text-sm text-[var(--color-text-muted)]">{t({ ko: '합계', en: 'Total', ja: '合計' })}</p>
          <p className="text-4xl font-bold text-primary-500">{total}</p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            ({t({ ko: '범위', en: 'range', ja: '範囲' })}: {minPossible} ~ {maxPossible})
          </p>
        </div>
      )}

      {/* Roll Button */}
      <ToolActions primary={<button className="w-full" onClick={roll} disabled={isRolling}>
        {isRolling ? t({ ko: '굴리는 중...', en: 'Rolling...', ja: '振っています…' }) : t({ ko: `🎲 ${config.count}D${config.sides} 굴리기`, en: `🎲 Roll ${config.count}D${config.sides}`, ja: `🎲 ${config.count}D${config.sides}を振る` })}
      </button>} />

      {/* Preset Rolls */}
      <ToolActions selection className="flex flex-wrap gap-2" primary={[
          { label: '1D6', sides: 6, count: 1 },
          { label: '2D6', sides: 6, count: 2 },
          { label: '1D20', sides: 20, count: 1 },
          { label: '3D6', sides: 6, count: 3 },
          { label: '1D100', sides: 100, count: 1 },
          { label: '4D6', sides: 6, count: 4 },
        ].map((preset) => (
          <button
            key={preset.label}
            aria-pressed={config.sides === preset.sides && config.count === preset.count}
            onClick={() => {
              setConfig({ sides: preset.sides, count: preset.count });
            }}
            className="px-3 py-1 text-sm rounded-lg bg-[var(--color-bg)]
              hover:bg-[var(--color-card-hover)] text-[var(--color-text-muted)]
              border border-[var(--color-border)] transition-colors"
          >
            {preset.label}
          </button>
        ))} />

      {/* History */}
      {history.length > 0 && (
        <div className="p-4 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]">
          <h3 className="font-medium text-[var(--color-text)] mb-3">📜 {t({ ko: '기록', en: 'History', ja: '履歴' })}</h3>
          <div className="space-y-2">
            {history.map((h, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 rounded-lg bg-[var(--color-bg)]"
              >
                <span className="text-sm text-[var(--color-text-muted)]">
                  {h.config.count}D{h.config.sides}
                </span>
                <span className="text-sm text-[var(--color-text)]">
                  [{h.results.join(', ')}]
                </span>
                <span className="font-bold text-primary-500">= {h.total}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolPanel>
  );
}
