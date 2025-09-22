'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Google Analytics로 Web Vitals 데이터 전송
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', metric.name, {
        event_category: 'Web Vitals',
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_label: metric.id,
        non_interaction: true,
      });
    }

    // 개발 환경에서 콘솔에 출력
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Web Vitals] ${metric.name}:`, {
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
      });
    }

    // Core Web Vitals 임계값 체크 및 경고
    const thresholds = {
      FCP: 1800, // First Contentful Paint
      LCP: 2500, // Largest Contentful Paint  
      FID: 100,  // First Input Delay
      CLS: 0.1,  // Cumulative Layout Shift
      TTFB: 800, // Time to First Byte
    };

    const threshold = thresholds[metric.name as keyof typeof thresholds];
    if (threshold && metric.value > threshold) {
      console.warn(`[Performance Warning] ${metric.name} (${metric.value}) exceeds recommended threshold (${threshold})`);
    }
  });

  return null;
}
