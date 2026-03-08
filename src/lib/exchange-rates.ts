import type { DashboardExchangeRates, FrankfurterRatesResponse } from '@/types/exchange';

export const FRANKFURTER_API_BASE = 'https://api.frankfurter.dev/v1';
export const FRANKFURTER_SYMBOLS = 'KRW,JPY,EUR';
export const EXCHANGE_API_URL = `${FRANKFURTER_API_BASE}/latest?base=USD&symbols=${FRANKFURTER_SYMBOLS}`;

function assertRate(value: unknown, code: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    throw new Error(`필수 환율 데이터가 없습니다: ${code}`);
  }
  return value;
}

export function buildFrankfurterDateUrl(date: string): string {
  return `${FRANKFURTER_API_BASE}/${date}?base=USD&symbols=${FRANKFURTER_SYMBOLS}`;
}

function getUpdatedAtFromDate(dateValue?: string): string {
  if (typeof dateValue !== 'string' || dateValue.trim() === '') {
    return new Date().toISOString();
  }

  const parsed = new Date(`${dateValue}T00:00:00Z`);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString();
  }

  return new Date().toISOString();
}

export function mapFrankfurterRates(data: FrankfurterRatesResponse): DashboardExchangeRates {
  if (!data.rates) {
    throw new Error('환율 API 응답이 올바르지 않습니다.');
  }

  const usdKrw = assertRate(data.rates.KRW, 'KRW');
  const usdJpy = assertRate(data.rates.JPY, 'JPY');
  const eurRate = assertRate(data.rates.EUR, 'EUR');

  return {
    usdKrw,
    usdJpy,
    eurKrw: usdKrw / eurRate,
    updatedAt: getUpdatedAtFromDate(data.date),
  };
}

export async function fetchUsdBaseRates(fetcher: typeof fetch = fetch): Promise<DashboardExchangeRates> {
  const response = await fetcher(EXCHANGE_API_URL);
  if (!response.ok) {
    throw new Error('환율 데이터를 가져오지 못했습니다.');
  }

  const data = await response.json() as FrankfurterRatesResponse;
  return mapFrankfurterRates(data);
}
