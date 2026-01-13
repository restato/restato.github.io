import { useState } from 'react';

interface BmiResult {
  bmi: number;
  category: string;
  color: string;
  description: string;
  idealWeightMin: number;
  idealWeightMax: number;
}

export default function BmiCalculator() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState<BmiResult | null>(null);

  const calculateBMI = () => {
    const h = parseFloat(height) / 100; // cm to m
    const w = parseFloat(weight);

    if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) {
      setResult(null);
      return;
    }

    const bmi = w / (h * h);
    const idealWeightMin = 18.5 * h * h;
    const idealWeightMax = 24.9 * h * h;

    let category: string;
    let color: string;
    let description: string;

    if (bmi < 18.5) {
      category = '저체중';
      color = 'text-blue-500';
      description = '체중이 부족합니다. 균형 잡힌 식단으로 건강한 체중을 유지하세요.';
    } else if (bmi < 23) {
      category = '정상';
      color = 'text-green-500';
      description = '건강한 체중입니다. 현재 상태를 유지하세요!';
    } else if (bmi < 25) {
      category = '과체중';
      color = 'text-yellow-500';
      description = '비만 전 단계입니다. 식이조절과 운동을 권장합니다.';
    } else if (bmi < 30) {
      category = '비만 1단계';
      color = 'text-orange-500';
      description = '건강 관리가 필요합니다. 전문가 상담을 권장합니다.';
    } else if (bmi < 35) {
      category = '비만 2단계';
      color = 'text-red-500';
      description = '건강 위험이 높습니다. 의료 전문가와 상담하세요.';
    } else {
      category = '고도비만';
      color = 'text-red-700';
      description = '심각한 건강 위험이 있습니다. 즉시 의료 상담이 필요합니다.';
    }

    setResult({
      bmi,
      category,
      color,
      description,
      idealWeightMin,
      idealWeightMax,
    });
  };

  const bmiRanges = [
    { range: '18.5 미만', category: '저체중', color: 'bg-blue-500' },
    { range: '18.5 - 22.9', category: '정상', color: 'bg-green-500' },
    { range: '23 - 24.9', category: '과체중', color: 'bg-yellow-500' },
    { range: '25 - 29.9', category: '비만 1단계', color: 'bg-orange-500' },
    { range: '30 - 34.9', category: '비만 2단계', color: 'bg-red-500' },
    { range: '35 이상', category: '고도비만', color: 'bg-red-700' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Input Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[var(--color-text)]">
            키 (cm)
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="170"
            className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)]
              bg-[var(--color-card)] text-[var(--color-text)] text-lg
              focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[var(--color-text)]">
            몸무게 (kg)
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="70"
            className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)]
              bg-[var(--color-card)] text-[var(--color-text)] text-lg
              focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Calculate Button */}
      <button
        onClick={calculateBMI}
        className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg
          font-medium transition-colors"
      >
        BMI 계산하기
      </button>

      {/* Result */}
      {result && (
        <div className="space-y-4">
          {/* BMI Value */}
          <div className="text-center p-6 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]">
            <p className="text-sm text-[var(--color-text-muted)] mb-2">나의 BMI</p>
            <p className={`text-5xl font-bold ${result.color}`}>
              {result.bmi.toFixed(1)}
            </p>
            <p className={`text-xl font-medium mt-2 ${result.color}`}>
              {result.category}
            </p>
          </div>

          {/* Description */}
          <div className="p-4 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]">
            <p className="text-[var(--color-text)]">{result.description}</p>
          </div>

          {/* Ideal Weight */}
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <p className="text-sm text-[var(--color-text-muted)] mb-1">적정 체중 범위</p>
            <p className="text-lg font-medium text-green-500">
              {result.idealWeightMin.toFixed(1)}kg ~ {result.idealWeightMax.toFixed(1)}kg
            </p>
          </div>

          {/* BMI Scale */}
          <div className="relative h-8 rounded-full overflow-hidden bg-[var(--color-border)]">
            <div className="absolute inset-0 flex">
              {bmiRanges.map((range, i) => (
                <div key={i} className={`flex-1 ${range.color}`} />
              ))}
            </div>
            {/* Marker */}
            <div
              className="absolute top-0 w-1 h-full bg-white shadow-lg transition-all duration-300"
              style={{
                left: `${Math.min(Math.max((result.bmi / 40) * 100, 0), 100)}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* BMI Table */}
      <div className="p-4 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]">
        <h3 className="font-medium text-[var(--color-text)] mb-3">📊 BMI 기준표 (아시아-태평양 기준)</h3>
        <div className="space-y-2">
          {bmiRanges.map((range, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded ${range.color}`} />
              <span className="text-sm text-[var(--color-text-muted)] w-24">{range.range}</span>
              <span className="text-sm text-[var(--color-text)]">{range.category}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-[var(--color-text-muted)] text-center">
        * BMI는 참고용 지표입니다. 정확한 건강 상태는 전문가와 상담하세요.
      </p>
    </div>
  );
}
