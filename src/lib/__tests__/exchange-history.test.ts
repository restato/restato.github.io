import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  appendExchangeHistory,
  buildSeries,
  createExchangeSnapshot,
  ensureHistoryBackfilled,
  EXCHANGE_HISTORY_STORAGE_KEY,
  fetchExchangeSnapshotByDate,
  getChangeRate,
  loadExchangeHistory,
} from '../exchange-history';

describe('exchange-history', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('creates snapshot from current rates', () => {
    const snapshot = createExchangeSnapshot({
      usdKrw: 1450,
      usdJpy: 157.2,
      eurKrw: 1576.08,
      updatedAt: '2026-02-17T12:00:00.000Z',
    });

    expect(snapshot).toEqual({
      timestamp: '2026-02-17T12:00:00.000Z',
      usdKrw: 1450,
      usdJpy: 157.2,
      eurKrw: 1576.08,
    });
  });

  it('replaces same-day snapshot with latest value', () => {
    appendExchangeHistory({
      timestamp: '2026-02-17T09:00:00',
      usdKrw: 1400,
      usdJpy: 150,
      eurKrw: 1520,
    });

    const next = appendExchangeHistory({
      timestamp: '2026-02-17T18:30:00',
      usdKrw: 1450,
      usdJpy: 157,
      eurKrw: 1570,
    });

    expect(next).toHaveLength(1);
    expect(next[0].usdKrw).toBe(1450);
    expect(next[0].usdJpy).toBe(157);
  });

  it('keeps only the latest 7 daily snapshots', () => {
    for (let day = 1; day <= 8; day += 1) {
      const dayText = String(day).padStart(2, '0');
      appendExchangeHistory({
        timestamp: `2026-02-${dayText}T12:00:00`,
        usdKrw: 1400 + day,
        usdJpy: 150 + day,
        eurKrw: 1520 + day,
      });
    }

    const history = loadExchangeHistory();
    expect(history).toHaveLength(7);
    expect(history[0].timestamp.startsWith('2026-02-02')).toBe(true);
    expect(history[6].timestamp.startsWith('2026-02-08')).toBe(true);
  });

  it('returns empty array for corrupted storage data', () => {
    window.localStorage.setItem(EXCHANGE_HISTORY_STORAGE_KEY, '{invalid-json}');
    expect(loadExchangeHistory()).toEqual([]);
  });

  it('calculates change rate correctly', () => {
    expect(getChangeRate(110, 100)).toBeCloseTo(10, 6);
    expect(getChangeRate(90, 100)).toBeCloseTo(-10, 6);
    expect(getChangeRate(100, 100)).toBe(0);
    expect(getChangeRate(100, 0)).toBeNull();
    expect(getChangeRate(100)).toBeNull();
  });

  it('builds series values by selected pair', () => {
    const history = [
      { timestamp: '2026-02-16T12:00:00', usdKrw: 1400, usdJpy: 150, eurKrw: 1520 },
      { timestamp: '2026-02-17T12:00:00', usdKrw: 1450, usdJpy: 157, eurKrw: 1570 },
    ];

    const usdKrwSeries = buildSeries(history, 'USD/KRW');
    const jpyKrwSeries = buildSeries(history, 'JPY/KRW');

    expect(usdKrwSeries).toHaveLength(2);
    expect(usdKrwSeries[0].value).toBe(1400);
    expect(usdKrwSeries[1].value).toBe(1450);
    expect(jpyKrwSeries[0].value).toBeCloseTo(1400 / 150, 8);
    expect(jpyKrwSeries[1].value).toBeCloseTo(1450 / 157, 8);
  });

  it('fetches a snapshot by date from Frankfurter response', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        amount: 1,
        base: 'USD',
        date: '2026-02-10',
        rates: {
          KRW: 1461.64,
          JPY: 155.13,
          EUR: 0.84076,
        },
      }),
    });

    const snapshot = await fetchExchangeSnapshotByDate('2026-02-10', mockFetch as unknown as typeof fetch);
    expect(snapshot.timestamp).toBe('2026-02-10T00:00:00.000Z');
    expect(snapshot.usdKrw).toBe(1461.64);
    expect(snapshot.usdJpy).toBe(155.13);
    expect(snapshot.eurKrw).toBeCloseTo(1461.64 / 0.84076, 8);
  });

  it('backfills and merges history when there are missing days', async () => {
    const existing = [
      { timestamp: '2026-02-16T00:00:00.000Z', usdKrw: 1450, usdJpy: 157, eurKrw: 1570 },
    ];

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        amount: 1,
        base: 'USD',
        date: '2026-02-15',
        rates: { KRW: 1440, JPY: 156, EUR: 0.9 },
      }),
    });

    const merged = await ensureHistoryBackfilled(existing, 2, mockFetch as unknown as typeof fetch);

    expect(merged).toHaveLength(2);
    expect(merged[0].timestamp.startsWith('2026-02-15')).toBe(true);
    expect(merged[1].timestamp.startsWith('2026-02-16')).toBe(true);
  });

  it('keeps existing history when backfill calls fail', async () => {
    const existing = [
      { timestamp: '2026-02-16T00:00:00.000Z', usdKrw: 1450, usdJpy: 157, eurKrw: 1570 },
    ];

    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      json: vi.fn(),
    });

    const merged = await ensureHistoryBackfilled(existing, 2, mockFetch as unknown as typeof fetch);
    expect(merged).toHaveLength(1);
    expect(merged[0].timestamp.startsWith('2026-02-16')).toBe(true);
  });
});
