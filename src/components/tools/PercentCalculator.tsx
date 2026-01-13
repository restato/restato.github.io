import { useState } from 'react';
import { useTranslation } from '../../i18n/useTranslation';

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

    if (isNaN(num1) || isNaN(num2)) {
      setResult(null);
      return;
    }

    let res: number;
    switch (calcType) {
      case 'whatPercent':
        res = (num1 / num2) * 100;
        setResult(`${num1}은(는) ${num2}의 ${res.toFixed(2)}%입니다`);
        break;
      case 'percentOf':
        res = (num1 / 100) * num2;
        setResult(`${num2}의 ${num1}%는 ${res.toFixed(2)}입니다`);
        break;
      case 'percentChange':
        res = ((num2 - num1) / num1) * 100;
        setResult(`${num1}에서 ${num2}로의 변화율은 ${res >= 0 ? '+' : ''}${res.toFixed(2)}%입니다`);
        break;
      case 'addPercent':
        res = num1 * (1 + num2 / 100);
        setResult(`${num1}에 ${num2}%를 더하면 ${res.toFixed(2)}입니다`);
        break;
      case 'subtractPercent':
        res = num1 * (1 - num2 / 100);
        setResult(`${num1}에서 ${num2}%를 빼면 ${res.toFixed(2)}입니다`);
        break;
    }
  };

  const calculationTypes = [
    { id: 'whatPercent', label: 'A는 B의 몇 %?' },
    { id: 'percentOf', label: 'B의 A%는?' },
    { id: 'percentChange', label: 'A에서 B로 변화율' },
    { id: 'addPercent', label: 'A에 B% 더하기' },
    { id: 'subtractPercent', label: 'A에서 B% 빼기' },
  ];

  const getLabels = () => {
    switch (calcType) {
      case 'whatPercent':
        return { label1: '값 A', label2: '기준값 B' };
      case 'percentOf':
        return { label1: '퍼센트 A (%)', label2: '기준값 B' };
      case 'percentChange':
        return { label1: '이전 값 A', label2: '현재 값 B' };
      case 'addPercent':
        return { label1: '기준값 A', label2: '더할 퍼센트 B (%)' };
      case 'subtractPercent':
        return { label1: '기준값 A', label2: '뺄 퍼센트 B (%)' };
    }
  };

  const labels = getLabels();

  return (
    <div className="flex flex-col gap-6">
      {/* Calculation Type */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[var(--color-text)]">
          계산 유형
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {calculationTypes.map((type) => (
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
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[var(--color-text)]">
            {labels.label1}
          </label>
          <input
            type="number"
            value={value1}
            onChange={(e) => setValue1(e.target.value)}
            placeholder="숫자 입력"
            className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)]
              bg-[var(--color-card)] text-[var(--color-text)]
              focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[var(--color-text)]">
            {labels.label2}
          </label>
          <input
            type="number"
            value={value2}
            onChange={(e) => setValue2(e.target.value)}
            placeholder="숫자 입력"
            className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)]
              bg-[var(--color-card)] text-[var(--color-text)]
              focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Calculate Button */}
      <button
        onClick={calculate}
        className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg
          font-medium transition-colors"
      >
        계산하기
      </button>

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
        <h3 className="font-medium text-[var(--color-text)] mb-2">빠른 참고</h3>
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
    </div>
  );
}
