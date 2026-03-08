import { describe, expect, it, vi } from 'vitest';
import {
  buildFrankfurterDateUrl,
  EXCHANGE_API_URL,
  fetchUsdBaseRates,
  mapFrankfurterRates,
} from '../exchange-rates';
import type { FrankfurterRatesResponse } from '@/types/exchange';

describe('exchange-rates', () => {
  it('maps Frankfurter rates into dashboard rates', () => {
    const data: FrankfurterRatesResponse = {
      amount: 1,
      base: 'USD',
      date: '2026-02-17',
      rates: {
        KRW: 1450,
        JPY: 157.123,
        EUR: 0.92,
      },
    };

    const mapped = mapFrankfurterRates(data);

    expect(mapped.usdKrw).toBe(1450);
    expect(mapped.usdJpy).toBe(157.123);
    expect(mapped.eurKrw).toBeCloseTo(1450 / 0.92, 8);
    expect(mapped.updatedAt).toBe('2026-02-17T00:00:00.000Z');
  });

  it('throws when required rate is missing', () => {
    const data: FrankfurterRatesResponse = {
      amount: 1,
      base: 'USD',
      date: '2026-02-17',
      rates: {
        KRW: 1450,
        JPY: 157.123,
      },
    };

    expect(() => mapFrankfurterRates(data)).toThrow('필수 환율 데이터가 없습니다: EUR');
  });

  it('fetches from API endpoint and returns mapped data', async () => {
    const data: FrankfurterRatesResponse = {
      amount: 1,
      base: 'USD',
      date: '2026-02-17',
      rates: {
        KRW: 1460,
        JPY: 158.001,
        EUR: 0.95,
      },
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(data),
    });

    const rates = await fetchUsdBaseRates(mockFetch as unknown as typeof fetch);

    expect(mockFetch).toHaveBeenCalledWith(EXCHANGE_API_URL);
    expect(rates.usdKrw).toBe(1460);
    expect(rates.usdJpy).toBe(158.001);
    expect(rates.eurKrw).toBeCloseTo(1536.8421, 4);
    expect(rates.updatedAt).toBe('2026-02-17T00:00:00.000Z');
  });

  it('throws when API response is not ok', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      json: vi.fn(),
    });

    await expect(fetchUsdBaseRates(mockFetch as unknown as typeof fetch))
      .rejects
      .toThrow('환율 데이터를 가져오지 못했습니다.');
  });

  it('builds date-based Frankfurter URL', () => {
    expect(buildFrankfurterDateUrl('2026-02-10'))
      .toBe('https://api.frankfurter.dev/v1/2026-02-10?base=USD&symbols=KRW,JPY,EUR');
  });
});
