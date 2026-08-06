import { describe, expect, it } from 'vitest';
import { lunarToSolar, solarToLunar } from '../lunarSolar';

describe('solarToLunar', () => {
  it('converts Seollal 2025 (solar 2025-01-29) to lunar new year', () => {
    expect(solarToLunar(2025, 1, 29)).toEqual({
      year: 2025,
      month: 1,
      day: 1,
      leapMonth: false,
      gapjaYear: '을사년',
    });
  });

  it('marks leap-month dates (solar 2025-07-25 is lunar 2025-06-01 in the leap month)', () => {
    expect(solarToLunar(2025, 7, 25)).toMatchObject({
      year: 2025,
      month: 6,
      day: 1,
      leapMonth: true,
    });
  });

  it('returns null outside the supported range', () => {
    expect(solarToLunar(999, 1, 1)).toBeNull();
    expect(solarToLunar(2051, 1, 1)).toBeNull();
  });

  it('returns null for impossible dates', () => {
    expect(solarToLunar(2025, 2, 30)).toBeNull();
  });
});

describe('lunarToSolar', () => {
  it('converts Chuseok 2024 (lunar 2024-08-15) to solar 2024-09-17', () => {
    expect(lunarToSolar(2024, 8, 15, false)).toEqual({ year: 2024, month: 9, day: 17 });
  });

  it('converts a leap-month date (lunar 2025-06-01 leap) to solar 2025-07-25', () => {
    expect(lunarToSolar(2025, 6, 1, true)).toEqual({ year: 2025, month: 7, day: 25 });
  });

  it('rejects a leap flag for months that have no leap month', () => {
    expect(lunarToSolar(2024, 1, 1, true)).toBeNull();
  });

  it('round-trips solar dates through the lunar calendar', () => {
    const samples: Array<[number, number, number]> = [
      [1950, 6, 25], [1988, 9, 17], [2000, 2, 29], [2024, 9, 17], [2025, 7, 25], [2049, 12, 31],
    ];
    for (const [year, month, day] of samples) {
      const lunar = solarToLunar(year, month, day);
      expect(lunar, `${year}-${month}-${day}`).not.toBeNull();
      expect(lunarToSolar(lunar!.year, lunar!.month, lunar!.day, lunar!.leapMonth))
        .toEqual({ year, month, day });
    }
  });
});
