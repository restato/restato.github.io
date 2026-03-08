import type {
  DashboardExchangeRates,
  DashboardSeriesPoint,
  ExchangePair,
  ExchangeSnapshot,
} from '@/types/exchange';
import { buildFrankfurterDateUrl, mapFrankfurterRates } from '@/lib/exchange-rates';

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export const EXCHANGE_HISTORY_STORAGE_KEY = 'restato_dashboard_fx_history_v1';
export const EXCHANGE_HISTORY_MAX_DAYS = 7;

function getStorage(storage?: StorageLike): StorageLike | null {
  if (storage) return storage;
  if (typeof window === 'undefined' || !window.localStorage) return null;
  return window.localStorage;
}

function getDayKey(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value.slice(0, 10);
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isValidSnapshot(snapshot: unknown): snapshot is ExchangeSnapshot {
  if (!snapshot || typeof snapshot !== 'object') return false;
  const s = snapshot as ExchangeSnapshot;
  return (
    typeof s.timestamp === 'string'
    && typeof s.usdKrw === 'number'
    && Number.isFinite(s.usdKrw)
    && s.usdKrw > 0
    && typeof s.usdJpy === 'number'
    && Number.isFinite(s.usdJpy)
    && s.usdJpy > 0
    && typeof s.eurKrw === 'number'
    && Number.isFinite(s.eurKrw)
    && s.eurKrw > 0
  );
}

export function createExchangeSnapshot(rates: DashboardExchangeRates): ExchangeSnapshot {
  return {
    timestamp: rates.updatedAt,
    usdKrw: rates.usdKrw,
    usdJpy: rates.usdJpy,
    eurKrw: rates.eurKrw,
  };
}

function formatDateForApi(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getRecentDateList(days: number): string[] {
  const dateList: string[] = [];
  const now = new Date();

  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const target = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() - offset,
    ));
    dateList.push(formatDateForApi(target));
  }

  return dateList;
}

export function loadExchangeHistory(storage?: StorageLike): ExchangeSnapshot[] {
  const targetStorage = getStorage(storage);
  if (!targetStorage) return [];

  try {
    const raw = targetStorage.getItem(EXCHANGE_HISTORY_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(isValidSnapshot)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .slice(-EXCHANGE_HISTORY_MAX_DAYS);
  } catch {
    return [];
  }
}

export function appendExchangeHistory(
  snapshot: ExchangeSnapshot,
  storage?: StorageLike,
): ExchangeSnapshot[] {
  const targetStorage = getStorage(storage);
  if (!targetStorage) return [snapshot];

  const currentHistory = loadExchangeHistory(targetStorage);
  const currentDay = getDayKey(snapshot.timestamp);

  const deduped = currentHistory.filter(item => getDayKey(item.timestamp) !== currentDay);
  const nextHistory = [...deduped, snapshot]
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .slice(-EXCHANGE_HISTORY_MAX_DAYS);

  targetStorage.setItem(EXCHANGE_HISTORY_STORAGE_KEY, JSON.stringify(nextHistory));
  return nextHistory;
}

export async function fetchExchangeSnapshotByDate(
  date: string,
  fetcher: typeof fetch = fetch,
): Promise<ExchangeSnapshot> {
  const response = await fetcher(buildFrankfurterDateUrl(date));
  if (!response.ok) {
    throw new Error(`환율 히스토리 조회 실패: ${date}`);
  }

  const data = await response.json();
  const rates = mapFrankfurterRates(data);
  return createExchangeSnapshot(rates);
}

export async function backfillLastNDays(
  days = EXCHANGE_HISTORY_MAX_DAYS,
  fetcher: typeof fetch = fetch,
): Promise<ExchangeSnapshot[]> {
  const dateList = getRecentDateList(days);
  const snapshots: ExchangeSnapshot[] = [];

  for (const date of dateList) {
    try {
      const snapshot = await fetchExchangeSnapshotByDate(date, fetcher);
      snapshots.push(snapshot);
    } catch {
      // Skip failed dates and keep remaining data.
    }
  }

  return snapshots
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .slice(-days);
}

export async function ensureHistoryBackfilled(
  currentHistory: ExchangeSnapshot[],
  days = EXCHANGE_HISTORY_MAX_DAYS,
  fetcher: typeof fetch = fetch,
  storage?: StorageLike,
): Promise<ExchangeSnapshot[]> {
  if (currentHistory.length >= days) {
    return currentHistory.slice(-days);
  }

  const fetched = await backfillLastNDays(days, fetcher);
  const merged = [...currentHistory, ...fetched]
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .reduce<ExchangeSnapshot[]>((acc, item) => {
      const dayKey = getDayKey(item.timestamp);
      const next = acc.filter(existing => getDayKey(existing.timestamp) !== dayKey);
      next.push(item);
      return next;
    }, [])
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .slice(-days);

  const targetStorage = getStorage(storage);
  if (targetStorage) {
    targetStorage.setItem(EXCHANGE_HISTORY_STORAGE_KEY, JSON.stringify(merged));
  }

  return merged;
}

export function getChangeRate(current: number, previous?: number): number | null {
  if (typeof previous !== 'number' || !Number.isFinite(previous) || previous <= 0) {
    return null;
  }
  return ((current - previous) / previous) * 100;
}

export function buildSeries(
  history: ExchangeSnapshot[],
  pair: ExchangePair,
): DashboardSeriesPoint[] {
  return history.map((snapshot) => {
    const value = pair === 'USD/KRW'
      ? snapshot.usdKrw
      : pair === 'JPY/KRW'
        ? snapshot.usdKrw / snapshot.usdJpy
        : snapshot.eurKrw;

    return {
      dateLabel: new Date(snapshot.timestamp).toLocaleDateString('ko-KR', {
        month: '2-digit',
        day: '2-digit',
      }),
      value,
    };
  });
}
