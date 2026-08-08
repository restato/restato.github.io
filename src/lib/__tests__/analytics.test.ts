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

  it('measures by default before a choice, with advertising still denied', () => {
    expect(loadGoogleAnalytics('G-TEST123')).toBe(true);
    expect(document.querySelector('script[src*="googletagmanager"]')).not.toBeNull();
    expect(Array.from((window as typeof window & { dataLayer: IArguments[] }).dataLayer[0])).toEqual([
      'consent', 'default', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'granted',
      },
    ]);
  });

  it('stops measuring once the visitor opts out', () => {
    setAnalyticsConsent('denied');
    expect(loadGoogleAnalytics('G-TEST123')).toBe(true);
    expect(Array.from((window as typeof window & { dataLayer: IArguments[] }).dataLayer[0])).toEqual([
      'consent', 'default', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied',
      },
    ]);
  });

  it('tracks tool events before a choice and drops them after opting out', () => {
    const gtag = vi.fn();
    (window as typeof window & { gtag: typeof gtag }).gtag = gtag;

    trackToolEvent({ name: 'tool_open', tool: 'json', locale: 'en' });
    expect(gtag).toHaveBeenCalledTimes(1);

    setAnalyticsConsent('denied');
    trackToolEvent({ name: 'tool_open', tool: 'json', locale: 'en' });
    expect(gtag).toHaveBeenCalledTimes(2); // only the consent update, no further events
    expect(gtag).toHaveBeenLastCalledWith('consent', 'update', expect.anything());
  });

  it('loads Google Analytics only once', () => {
    setAnalyticsConsent('granted');
    expect(loadGoogleAnalytics('G-TEST123')).toBe(true);
    expect(loadGoogleAnalytics('G-TEST123')).toBe(true);
    expect(document.querySelectorAll('script[src*="googletagmanager"]')).toHaveLength(1);
  });

  it('queues gtag commands as Arguments objects required by the Google tag runtime', () => {
    loadGoogleAnalytics('G-TEST123');

    const firstCommand = (window as typeof window & { dataLayer: unknown[] }).dataLayer[0];
    expect(Object.prototype.toString.call(firstCommand)).toBe('[object Arguments]');
  });

  it('keeps advertising denied when analytics consent is granted', () => {
    setAnalyticsConsent('granted');
    loadGoogleAnalytics('G-TEST123');

    expect(Array.from((window as typeof window & { dataLayer: IArguments[] }).dataLayer[0])).toEqual([
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

    expect(Array.from((window as typeof window & { dataLayer: IArguments[] }).dataLayer.at(-1)!)).toEqual([
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
