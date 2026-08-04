import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  ANALYTICS_CONSENT_KEY,
  getAnalyticsConsent,
  loadGoogleAnalytics,
  setAnalyticsConsent,
  trackToolEvent,
} from '../analytics';

describe('privacy-safe analytics', () => {
  beforeEach(() => {
    localStorage.clear();
    document.head.querySelectorAll('[data-restato-analytics]').forEach(node => node.remove());
    delete (window as typeof window & { gtag?: unknown }).gtag;
    delete (window as typeof window & { dataLayer?: unknown }).dataLayer;
  });

  it('stores only the explicit consent state', () => {
    expect(getAnalyticsConsent()).toBe('unset');
    setAnalyticsConsent('granted');
    expect(localStorage.getItem(ANALYTICS_CONSENT_KEY)).toBe('granted');
    setAnalyticsConsent('denied');
    expect(getAnalyticsConsent()).toBe('denied');
  });

  it('loads cookieless analytics with every consent signal denied before a choice', () => {
    trackToolEvent({ name: 'tool_open', tool: 'json', locale: 'en' });
    expect((window as typeof window & { dataLayer?: unknown[] }).dataLayer).toBeUndefined();
    expect(loadGoogleAnalytics('G-TEST123')).toBe(true);
    expect(document.querySelector('script[src*="googletagmanager"]')).not.toBeNull();
    expect((window as typeof window & { dataLayer: unknown[][] }).dataLayer[0]).toEqual([
      'consent', 'default', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied',
      },
    ]);
  });

  it('loads Google Analytics only once', () => {
    setAnalyticsConsent('granted');
    expect(loadGoogleAnalytics('G-TEST123')).toBe(true);
    expect(loadGoogleAnalytics('G-TEST123')).toBe(true);
    expect(document.querySelectorAll('script[src*="googletagmanager"]')).toHaveLength(1);
  });

  it('keeps advertising denied when analytics consent is granted', () => {
    setAnalyticsConsent('granted');
    loadGoogleAnalytics('G-TEST123');

    expect((window as typeof window & { dataLayer: unknown[][] }).dataLayer[0]).toEqual([
      'consent', 'default', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'granted',
      },
    ]);
  });

  it('updates analytics storage without enabling advertising when a choice changes', () => {
    loadGoogleAnalytics('G-TEST123');
    setAnalyticsConsent('granted');

    expect((window as typeof window & { dataLayer: unknown[][] }).dataLayer.at(-1)).toEqual([
      'consent', 'update', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'granted',
      },
    ]);
  });

  it('sends only the allowlisted event payload', () => {
    setAnalyticsConsent('granted');
    const gtag = vi.fn();
    (window as typeof window & { gtag: typeof gtag }).gtag = gtag;
    trackToolEvent({ name: 'tool_complete', tool: 'uuid', locale: 'fr', durationBucket: '<1s' });
    expect(gtag).toHaveBeenCalledWith('event', 'tool_complete', {
      tool: 'uuid', locale: 'fr', duration_bucket: '<1s',
    });
  });

  it('rejects extra payload keys at runtime', () => {
    setAnalyticsConsent('granted');
    expect(() => trackToolEvent({
      name: 'tool_open', tool: 'json', locale: 'en', userId: 'forbidden',
    } as never)).toThrow(/Unsupported analytics field/);
  });
});
