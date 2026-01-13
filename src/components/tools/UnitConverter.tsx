import { useState, useMemo } from 'react';
import { useTranslation } from '../../i18n/useTranslation';

type UnitCategory = 'length' | 'weight' | 'temperature' | 'area' | 'volume';

interface UnitDefinition {
  name: { ko: string; en: string; ja: string };
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
}

const units: Record<UnitCategory, Record<string, UnitDefinition>> = {
  length: {
    mm: {
      name: { ko: '밀리미터 (mm)', en: 'Millimeter (mm)', ja: 'ミリメートル (mm)' },
      toBase: (v) => v / 1000,
      fromBase: (v) => v * 1000,
    },
    cm: {
      name: { ko: '센티미터 (cm)', en: 'Centimeter (cm)', ja: 'センチメートル (cm)' },
      toBase: (v) => v / 100,
      fromBase: (v) => v * 100,
    },
    m: {
      name: { ko: '미터 (m)', en: 'Meter (m)', ja: 'メートル (m)' },
      toBase: (v) => v,
      fromBase: (v) => v,
    },
    km: {
      name: { ko: '킬로미터 (km)', en: 'Kilometer (km)', ja: 'キロメートル (km)' },
      toBase: (v) => v * 1000,
      fromBase: (v) => v / 1000,
    },
    inch: {
      name: { ko: '인치 (in)', en: 'Inch (in)', ja: 'インチ (in)' },
      toBase: (v) => v * 0.0254,
      fromBase: (v) => v / 0.0254,
    },
    ft: {
      name: { ko: '피트 (ft)', en: 'Foot (ft)', ja: 'フィート (ft)' },
      toBase: (v) => v * 0.3048,
      fromBase: (v) => v / 0.3048,
    },
    yard: {
      name: { ko: '야드 (yd)', en: 'Yard (yd)', ja: 'ヤード (yd)' },
      toBase: (v) => v * 0.9144,
      fromBase: (v) => v / 0.9144,
    },
    mile: {
      name: { ko: '마일 (mi)', en: 'Mile (mi)', ja: 'マイル (mi)' },
      toBase: (v) => v * 1609.344,
      fromBase: (v) => v / 1609.344,
    },
  },
  weight: {
    mg: {
      name: { ko: '밀리그램 (mg)', en: 'Milligram (mg)', ja: 'ミリグラム (mg)' },
      toBase: (v) => v / 1000000,
      fromBase: (v) => v * 1000000,
    },
    g: {
      name: { ko: '그램 (g)', en: 'Gram (g)', ja: 'グラム (g)' },
      toBase: (v) => v / 1000,
      fromBase: (v) => v * 1000,
    },
    kg: {
      name: { ko: '킬로그램 (kg)', en: 'Kilogram (kg)', ja: 'キログラム (kg)' },
      toBase: (v) => v,
      fromBase: (v) => v,
    },
    ton: {
      name: { ko: '톤 (t)', en: 'Ton (t)', ja: 'トン (t)' },
      toBase: (v) => v * 1000,
      fromBase: (v) => v / 1000,
    },
    oz: {
      name: { ko: '온스 (oz)', en: 'Ounce (oz)', ja: 'オンス (oz)' },
      toBase: (v) => v * 0.0283495,
      fromBase: (v) => v / 0.0283495,
    },
    lb: {
      name: { ko: '파운드 (lb)', en: 'Pound (lb)', ja: 'ポンド (lb)' },
      toBase: (v) => v * 0.453592,
      fromBase: (v) => v / 0.453592,
    },
  },
  temperature: {
    celsius: {
      name: { ko: '섭씨 (°C)', en: 'Celsius (°C)', ja: '摂氏 (°C)' },
      toBase: (v) => v,
      fromBase: (v) => v,
    },
    fahrenheit: {
      name: { ko: '화씨 (°F)', en: 'Fahrenheit (°F)', ja: '華氏 (°F)' },
      toBase: (v) => (v - 32) * 5 / 9,
      fromBase: (v) => v * 9 / 5 + 32,
    },
    kelvin: {
      name: { ko: '켈빈 (K)', en: 'Kelvin (K)', ja: 'ケルビン (K)' },
      toBase: (v) => v - 273.15,
      fromBase: (v) => v + 273.15,
    },
  },
  area: {
    sqm: {
      name: { ko: '제곱미터 (m²)', en: 'Square meter (m²)', ja: '平方メートル (m²)' },
      toBase: (v) => v,
      fromBase: (v) => v,
    },
    sqkm: {
      name: { ko: '제곱킬로미터 (km²)', en: 'Square kilometer (km²)', ja: '平方キロメートル (km²)' },
      toBase: (v) => v * 1000000,
      fromBase: (v) => v / 1000000,
    },
    sqft: {
      name: { ko: '제곱피트 (ft²)', en: 'Square foot (ft²)', ja: '平方フィート (ft²)' },
      toBase: (v) => v * 0.092903,
      fromBase: (v) => v / 0.092903,
    },
    acre: {
      name: { ko: '에이커', en: 'Acre', ja: 'エーカー' },
      toBase: (v) => v * 4046.86,
      fromBase: (v) => v / 4046.86,
    },
    pyeong: {
      name: { ko: '평', en: 'Pyeong', ja: '坪' },
      toBase: (v) => v * 3.306,
      fromBase: (v) => v / 3.306,
    },
  },
  volume: {
    ml: {
      name: { ko: '밀리리터 (mL)', en: 'Milliliter (mL)', ja: 'ミリリットル (mL)' },
      toBase: (v) => v / 1000,
      fromBase: (v) => v * 1000,
    },
    l: {
      name: { ko: '리터 (L)', en: 'Liter (L)', ja: 'リットル (L)' },
      toBase: (v) => v,
      fromBase: (v) => v,
    },
    gal: {
      name: { ko: '갤런 (gal)', en: 'Gallon (gal)', ja: 'ガロン (gal)' },
      toBase: (v) => v * 3.78541,
      fromBase: (v) => v / 3.78541,
    },
    cup: {
      name: { ko: '컵', en: 'Cup', ja: 'カップ' },
      toBase: (v) => v * 0.236588,
      fromBase: (v) => v / 0.236588,
    },
  },
};

const categoryLabels: Record<UnitCategory, { ko: string; en: string; ja: string }> = {
  length: { ko: '길이', en: 'Length', ja: '長さ' },
  weight: { ko: '무게', en: 'Weight', ja: '重さ' },
  temperature: { ko: '온도', en: 'Temperature', ja: '温度' },
  area: { ko: '넓이', en: 'Area', ja: '面積' },
  volume: { ko: '부피', en: 'Volume', ja: '体積' },
};

export default function UnitConverter() {
  const { t, lang, translations } = useTranslation();
  const tt = translations.tools.unit;

  const [category, setCategory] = useState<UnitCategory>('length');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('ft');
  const [fromValue, setFromValue] = useState('1');

  const categoryUnits = units[category];

  const result = useMemo(() => {
    const value = parseFloat(fromValue);
    if (isNaN(value)) return '';

    const baseValue = categoryUnits[fromUnit].toBase(value);
    const convertedValue = categoryUnits[toUnit].fromBase(baseValue);

    // Format with appropriate precision
    if (Math.abs(convertedValue) < 0.0001 || Math.abs(convertedValue) >= 1000000) {
      return convertedValue.toExponential(6);
    }
    return convertedValue.toLocaleString(undefined, { maximumFractionDigits: 6 });
  }, [fromValue, fromUnit, toUnit, categoryUnits]);

  const handleCategoryChange = (newCategory: UnitCategory) => {
    setCategory(newCategory);
    const unitKeys = Object.keys(units[newCategory]);
    setFromUnit(unitKeys[0]);
    setToUnit(unitKeys[1] || unitKeys[0]);
    setFromValue('1');
  };

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    if (result) {
      setFromValue(result.replace(/,/g, ''));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(units) as UnitCategory[]).map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${category === cat
                ? 'bg-primary-500 text-white'
                : 'bg-[var(--color-card)] hover:bg-[var(--color-card-hover)] text-[var(--color-text)] border border-[var(--color-border)]'
              }`}
          >
            {t(categoryLabels[cat])}
          </button>
        ))}
      </div>

      {/* Converter */}
      <div className="space-y-4">
        {/* From */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-text)]">{t(tt.from)}</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={fromValue}
              onChange={(e) => setFromValue(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg border border-[var(--color-border)]
                bg-[var(--color-card)] text-[var(--color-text)] text-lg
                focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="px-4 py-2 rounded-lg border border-[var(--color-border)]
                bg-[var(--color-card)] text-[var(--color-text)]
                focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {Object.entries(categoryUnits).map(([key, unit]) => (
                <option key={key} value={key}>
                  {t(unit.name)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={swapUnits}
            className="p-2 rounded-full bg-[var(--color-card)] hover:bg-[var(--color-card-hover)]
              border border-[var(--color-border)] transition-colors"
          >
            <svg className="w-6 h-6 text-[var(--color-text)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
        </div>

        {/* To */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-text)]">{t(tt.to)}</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={result}
              readOnly
              className="flex-1 px-4 py-3 rounded-lg border border-[var(--color-border)]
                bg-[var(--color-bg)] text-[var(--color-text)] text-lg font-medium
                focus:outline-none"
            />
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="px-4 py-2 rounded-lg border border-[var(--color-border)]
                bg-[var(--color-card)] text-[var(--color-text)]
                focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {Object.entries(categoryUnits).map(([key, unit]) => (
                <option key={key} value={key}>
                  {t(unit.name)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Quick conversions */}
      {fromValue && result && (
        <div className="p-4 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]">
          <p className="text-center text-lg">
            <span className="font-medium">{fromValue}</span>{' '}
            <span className="text-[var(--color-text-muted)]">{t(categoryUnits[fromUnit].name)}</span>
            {' = '}
            <span className="font-bold text-primary-500">{result}</span>{' '}
            <span className="text-[var(--color-text-muted)]">{t(categoryUnits[toUnit].name)}</span>
          </p>
        </div>
      )}
    </div>
  );
}
