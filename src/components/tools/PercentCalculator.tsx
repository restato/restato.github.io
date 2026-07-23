import { useState } from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import { ToolActions } from './ui/ToolActions';
import { ToolField } from './ui/ToolField';
import { ToolPanel } from './ui/ToolPanel';

type CalculationType = 'whatPercent' | 'percentOf' | 'percentChange' | 'addPercent' | 'subtractPercent';

export default function PercentCalculator() {
  const { t } = useTranslation();
  const [calcType, setCalcType] = useState<CalculationType>('whatPercent');
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const calculate = () => {
    const num1 = parseFloat(value1);
    const num2 = parseFloat(value2);

    const hasZeroDenominator =
      (calcType === 'whatPercent' && num2 === 0) ||
      (calcType === 'percentChange' && num1 === 0);

    if (isNaN(num1) || isNaN(num2) || hasZeroDenominator) {
      setResult(null);
      return;
    }

    let res: number;
    switch (calcType) {
      case 'whatPercent':
        res = (num1 / num2) * 100;
        setResult(t({ ko: `${num2} 대비 ${num1}의 비율은 ${res.toFixed(2)}%입니다`, en: `${num1} is ${res.toFixed(2)}% of ${num2}`, ja: `${num1} は ${num2} の ${res.toFixed(2)}% です` }));
        break;
      case 'percentOf':
        res = (num1 / 100) * num2;
        setResult(t({ ko: `${num2}의 ${num1}%는 ${res.toFixed(2)}입니다`, en: `${num1}% of ${num2} is ${res.toFixed(2)}`, ja: `${num2} の ${num1}% は ${res.toFixed(2)} です` }));
        break;
      case 'percentChange':
        res = ((num2 - num1) / num1) * 100;
        setResult(t({ ko: `${num1}에서 ${num2}까지 변화율은 ${res >= 0 ? '+' : ''}${res.toFixed(2)}%입니다`, en: `The change from ${num1} to ${num2} is ${res >= 0 ? '+' : ''}${res.toFixed(2)}%`, ja: `${num1} から ${num2} への変化率は ${res >= 0 ? '+' : ''}${res.toFixed(2)}% です` }));
        break;
      case 'addPercent':
        res = num1 * (1 + num2 / 100);
        setResult(t({ ko: `${num1}에 ${num2}%를 더한 값은 ${res.toFixed(2)}입니다`, en: `${num1} plus ${num2}% is ${res.toFixed(2)}`, ja: `${num1} に ${num2}% を加えると ${res.toFixed(2)} です` }));
        break;
      case 'subtractPercent':
        res = num1 * (1 - num2 / 100);
        setResult(t({ ko: `${num1}에서 ${num2}%를 뺀 값은 ${res.toFixed(2)}입니다`, en: `${num1} minus ${num2}% is ${res.toFixed(2)}`, ja: `${num1} から ${num2}% を引くと ${res.toFixed(2)} です` }));
        break;
    }
  };

  const calculationTypes = [
    { id: 'whatPercent', label: t({ ko: 'A는 B의 몇 %?', en: 'A is what % of B?', ja: 'AはBの何％？' }) },
    { id: 'percentOf', label: t({ ko: 'B의 A%는?', en: 'What is A% of B?', ja: 'BのA％は？' }) },
    { id: 'percentChange', label: t({ ko: 'A에서 B로 변화율', en: '% change from A to B', ja: 'AからBへの変化率' }) },
    { id: 'addPercent', label: t({ ko: 'A에 B% 더하기', en: 'Add B% to A', ja: 'AにB％を加える' }) },
    { id: 'subtractPercent', label: t({ ko: 'A에서 B% 빼기', en: 'Subtract B% from A', ja: 'AからB％を引く' }) },
  ];

  const getLabels = () => {
    switch (calcType) {
      case 'whatPercent':
        return { label1: t({ ko: '값 A', en: 'Value A', ja: '値 A' }), label2: t({ ko: '기준값 B', en: 'Base value B', ja: '基準値 B' }) };
      case 'percentOf':
        return { label1: t({ ko: '퍼센트 A (%)', en: 'Percentage A (%)', ja: '割合 A (%)' }), label2: t({ ko: '기준값 B', en: 'Base value B', ja: '基準値 B' }) };
      case 'percentChange':
        return { label1: t({ ko: '이전 값 A', en: 'Previous value A', ja: '以前の値 A' }), label2: t({ ko: '현재 값 B', en: 'Current value B', ja: '現在の値 B' }) };
      case 'addPercent':
        return { label1: t({ ko: '기준값 A', en: 'Base value A', ja: '基準値 A' }), label2: t({ ko: '더할 퍼센트 B (%)', en: 'Percentage to add B (%)', ja: '加える割合 B (%)' }) };
      case 'subtractPercent':
        return { label1: t({ ko: '기준값 A', en: 'Base value A', ja: '基準値 A' }), label2: t({ ko: '뺄 퍼센트 B (%)', en: 'Percentage to subtract B (%)', ja: '引く割合 B (%)' }) };
    }
  };

  const labels = getLabels();

  return (
    <ToolPanel className="gap-6">
      {/* Calculation Type */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[var(--color-text)]">
          {t({ ko: '계산 유형', en: 'Calculation type', ja: '計算タイプ' })}
        </label>
        <ToolActions
          className="grid grid-cols-1 sm:grid-cols-2"
          primary={calculationTypes.slice(0, 1).map((type) => (
            <button
              key={type.id}
              onClick={() => {
                setCalcType(type.id as CalculationType);
                setResult(null);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${calcType === type.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-[var(--color-card)] hover:bg-[var(--color-card-hover)] text-[var(--color-text)] border border-[var(--color-border)]'
                }`}
            >
              {type.label}
            </button>
          ))}
          secondary={calculationTypes.slice(1).map((type) => (
            <button key={type.id} onClick={() => { setCalcType(type.id as CalculationType); setResult(null); }}>{type.label}</button>
          ))}
        />
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-2 gap-4">
        <ToolField id="percent-value-1" label={labels.label1}>
          <input
            type="number"
            value={value1}
            onChange={(e) => setValue1(e.target.value)}
            placeholder={t({ ko: '숫자 입력', en: 'Enter a number', ja: '数値を入力' })}
          />
        </ToolField>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[var(--color-text)]">
            {labels.label2}
          </label>
          <input
            type="number"
            value={value2}
            onChange={(e) => setValue2(e.target.value)}
            placeholder={t({ ko: '숫자 입력', en: 'Enter a number', ja: '数値を入力' })}
            className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)]
              bg-[var(--color-card)] text-[var(--color-text)]
              focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Calculate Button */}
      <ToolActions primary={<button className="w-full" onClick={calculate}>
        {t({ ko: '계산하기', en: 'Calculate', ja: '計算する' })}
      </button>} />

      {/* Result */}
      {result && (
        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
          <p className="text-lg font-medium text-[var(--color-text)] text-center">
            {result}
          </p>
        </div>
      )}

      {/* Quick Reference */}
      <div className="p-4 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]">
        <h3 className="font-medium text-[var(--color-text)] mb-2">{t({ ko: '빠른 참고', en: 'Quick reference', ja: 'クイックリファレンス' })}</h3>
        <div className="grid grid-cols-4 gap-2 text-sm text-[var(--color-text-muted)]">
          {[10, 15, 20, 25, 30, 50, 75, 100].map((p) => (
            <button
              key={p}
              onClick={() => {
                if (calcType === 'whatPercent' || calcType === 'percentChange') return;
                setValue1(value1 || '100');
                setValue2(String(p));
              }}
              className="px-2 py-1 rounded bg-[var(--color-bg)] hover:bg-[var(--color-card-hover)]
                transition-colors"
            >
              {p}%
            </button>
          ))}
        </div>
      </div>
    </ToolPanel>
  );
}
