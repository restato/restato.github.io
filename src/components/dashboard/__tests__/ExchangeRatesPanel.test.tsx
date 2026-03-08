import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ExchangeRatesPanel from '../ExchangeRatesPanel';
import { fetchUsdBaseRates } from '@/lib/exchange-rates';
import { EXCHANGE_HISTORY_STORAGE_KEY } from '@/lib/exchange-history';

vi.mock('@/lib/exchange-rates', () => ({
  fetchUsdBaseRates: vi.fn(),
}));

vi.mock('@/lib/exchange-history', async () => {
  const actual = await vi.importActual<typeof import('@/lib/exchange-history')>('@/lib/exchange-history');
  return {
    ...actual,
    ensureHistoryBackfilled: vi.fn(async (history: any[]) => history),
  };
});

const mockFetchUsdBaseRates = vi.mocked(fetchUsdBaseRates);

describe('ExchangeRatesPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
  });

  it('shows loading state while fetching rates', () => {
    mockFetchUsdBaseRates.mockReturnValue(new Promise(() => {}));

    render(<ExchangeRatesPanel />);

    expect(screen.getByText('환율 데이터를 불러오는 중...')).toBeInTheDocument();
    expect(screen.getAllByText('USD/KRW').length).toBeGreaterThan(0);
    expect(screen.getAllByText('JPY/KRW').length).toBeGreaterThan(0);
    expect(screen.getAllByText('EUR/KRW').length).toBeGreaterThan(0);
  });

  it('renders fetched rates successfully', async () => {
    mockFetchUsdBaseRates.mockResolvedValue({
      usdKrw: 1450.12,
      usdJpy: 157.456,
      eurKrw: 1576.22,
      updatedAt: '2026-02-17T12:00:00.000Z',
    });

    render(<ExchangeRatesPanel />);

    expect(await screen.findByText('1,450.12')).toBeInTheDocument();
    expect(screen.getByText('9.21')).toBeInTheDocument();
    expect(screen.getByText('1,576.22')).toBeInTheDocument();
    expect(screen.getByText(/마지막 갱신:/)).toBeInTheDocument();
    expect(screen.queryByText('미국 달러 / 원화')).not.toBeInTheDocument();
    expect(screen.queryByText('미국 달러 / 엔화')).not.toBeInTheDocument();
    expect(screen.queryByText('유로 / 원화')).not.toBeInTheDocument();
    expect(screen.getAllByText('기록 없음').length).toBe(3);
    expect(screen.getAllByRole('img').length).toBe(3);
    expect(screen.queryByText('최근 7일 추이')).not.toBeInTheDocument();
  });

  it('shows positive/negative/flat change rates from previous snapshot', async () => {
    window.localStorage.setItem(
      EXCHANGE_HISTORY_STORAGE_KEY,
      JSON.stringify([
        {
          timestamp: '2026-02-16T12:00:00',
          usdKrw: 1000,
          usdJpy: 200,
          eurKrw: 1500,
        },
      ]),
    );

    mockFetchUsdBaseRates.mockResolvedValue({
      usdKrw: 900,
      usdJpy: 180,
      eurKrw: 1650,
      updatedAt: '2026-02-17T12:00:00',
    });

    render(<ExchangeRatesPanel />);

    expect(await screen.findByText('+10.00%')).toBeInTheDocument();
    expect(screen.getByText('-10.00%')).toBeInTheDocument();
    expect(screen.getByText('0.00%')).toBeInTheDocument();
  });

  it('shows error message when fetch fails', async () => {
    mockFetchUsdBaseRates.mockRejectedValue(new Error('network error'));

    render(<ExchangeRatesPanel />);

    expect(await screen.findByText('환율 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.'))
      .toBeInTheDocument();
  });

  it('refreshes rates when clicking refresh button', async () => {
    mockFetchUsdBaseRates
      .mockResolvedValueOnce({
        usdKrw: 1450.12,
        usdJpy: 157.456,
        eurKrw: 1576.22,
        updatedAt: '2026-02-17T12:00:00.000Z',
      })
      .mockResolvedValueOnce({
        usdKrw: 1500,
        usdJpy: 160,
        eurKrw: 1620,
        updatedAt: '2026-02-17T13:00:00.000Z',
      });

    render(<ExchangeRatesPanel />);
    await screen.findByText('1,450.12');
    expect(screen.getByText('9.21')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '새로고침' }));

    await waitFor(() => {
      expect(mockFetchUsdBaseRates).toHaveBeenCalledTimes(2);
    });

    expect(await screen.findByText('1,500.00')).toBeInTheDocument();
    expect(screen.getByText('9.38')).toBeInTheDocument();
    expect(screen.getByText('1,620.00')).toBeInTheDocument();
  });
});
