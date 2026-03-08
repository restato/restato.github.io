export interface ExchangeApiResponse {
  result?: string;
  rates?: Record<string, number>;
  time_last_update_unix?: number;
  time_last_update_utc?: string;
}

export interface FrankfurterRatesResponse {
  amount?: number;
  base?: string;
  date?: string;
  rates?: Record<string, number>;
}

export interface DashboardExchangeRates {
  usdKrw: number;
  usdJpy: number;
  eurKrw: number;
  updatedAt: string;
}

export type ExchangePair = 'USD/KRW' | 'JPY/KRW' | 'EUR/KRW';

export interface ExchangeSnapshot {
  timestamp: string;
  usdKrw: number;
  usdJpy: number;
  eurKrw: number;
}

export interface DashboardSeriesPoint {
  dateLabel: string;
  value: number;
}
