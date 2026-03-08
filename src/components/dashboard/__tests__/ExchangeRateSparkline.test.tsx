import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ExchangeRateSparkline from '../ExchangeRateSparkline';

describe('ExchangeRateSparkline', () => {
  it('renders placeholder line when there are no points', () => {
    const { container } = render(
      <ExchangeRateSparkline
        points={[]}
        strokeColor="#2563eb"
        ariaLabel="USD/KRW 7일 미니 차트"
      />,
    );

    expect(screen.getByRole('img', { name: 'USD/KRW 7일 미니 차트' })).toBeInTheDocument();
    expect(container.querySelector('line')).toBeInTheDocument();
    expect(container.querySelector('polyline')).not.toBeInTheDocument();
  });

  it('renders a guide line and dot when there is a single point', () => {
    const { container } = render(
      <ExchangeRateSparkline
        points={[{ dateLabel: '02.17.', value: 1450 }]}
        strokeColor="#16a34a"
        ariaLabel="USD/JPY 7일 미니 차트"
      />,
    );

    expect(container.querySelector('line')).toBeInTheDocument();
    expect(container.querySelector('circle')).toBeInTheDocument();
    expect(container.querySelector('polyline')).not.toBeInTheDocument();
  });

  it('renders a line and a dot when multiple points are provided', () => {
    const { container } = render(
      <ExchangeRateSparkline
        points={[
          { dateLabel: '02.15.', value: 1440 },
          { dateLabel: '02.16.', value: 1450 },
          { dateLabel: '02.17.', value: 1460 },
        ]}
        strokeColor="#f97316"
        ariaLabel="EUR/KRW 7일 미니 차트"
      />,
    );

    expect(container.querySelector('polyline')).toBeInTheDocument();
    expect(container.querySelector('circle')).toBeInTheDocument();
  });
});
