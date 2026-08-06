import KoreanLunarCalendar from 'korean-lunar-calendar';

export interface LunarDate {
  year: number;
  month: number;
  day: number;
  leapMonth: boolean;
  /** Sexagenary cycle name of the lunar year, e.g. 을사년. */
  gapjaYear: string;
}

export interface SolarDate {
  year: number;
  month: number;
  day: number;
}

const isRealSolarDate = (year: number, month: number, day: number): boolean => {
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
};

export function solarToLunar(year: number, month: number, day: number): LunarDate | null {
  if (!isRealSolarDate(year, month, day)) return null;
  const calendar = new KoreanLunarCalendar();
  if (!calendar.setSolarDate(year, month, day)) return null;
  const lunar = calendar.getLunarCalendar();
  return {
    year: lunar.year,
    month: lunar.month,
    day: lunar.day,
    leapMonth: lunar.intercalation,
    gapjaYear: calendar.getKoreanGapja().year,
  };
}

export function lunarToSolar(
  year: number,
  month: number,
  day: number,
  leapMonth: boolean,
): SolarDate | null {
  const calendar = new KoreanLunarCalendar();
  if (!calendar.setLunarDate(year, month, day, leapMonth)) return null;
  const solar = calendar.getSolarCalendar();
  return { year: solar.year, month: solar.month, day: solar.day };
}
