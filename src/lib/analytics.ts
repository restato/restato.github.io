import { supportedLanguages } from '../data/tools/locales';
import type { Language } from '../data/tools/types';

export type AnalyticsConsent = 'granted' | 'denied' | 'unset';
export const ANALYTICS_CONSENT_KEY = 'restato.analyticsConsent';

export type ToolEventName =
  | 'tool_open'
  | 'tool_start'
  | 'tool_complete'
  | 'tool_error'
  | 'tool_download'
  | 'tool_copy'
  | 'tool_favorite'
  | 'tool_share';

export interface ToolEvent {
  name: ToolEventName;
  tool: string;
  locale: Language;
  durationBucket?: '<1s' | '1-5s' | '>5s';
  errorCategory?: string;
}

type AnalyticsWindow = Window & {
  dataLayer?: unknown[][];
  gtag?: (...args: unknown[]) => void;
};

const eventNames = new Set<ToolEventName>([
  'tool_open', 'tool_start', 'tool_complete', 'tool_error',
  'tool_download', 'tool_copy', 'tool_favorite', 'tool_share',
]);
const eventKeys = new Set(['name', 'tool', 'locale', 'durationBucket', 'errorCategory']);

function consentSettings(consent: AnalyticsConsent) {
  return {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: consent === 'granted' ? 'granted' : 'denied',
  } as const;
}

export function getAnalyticsConsent(): AnalyticsConsent {
  if (typeof localStorage === 'undefined') return 'unset';
  const stored = localStorage.getItem(ANALYTICS_CONSENT_KEY);
  return stored === 'granted' || stored === 'denied' ? stored : 'unset';
}

export function setAnalyticsConsent(consent: Exclude<AnalyticsConsent, 'unset'>): void {
  if (typeof localStorage !== 'undefined') localStorage.setItem(ANALYTICS_CONSENT_KEY, consent);
  if (typeof window !== 'undefined') {
    (window as AnalyticsWindow).gtag?.('consent', 'update', consentSettings(consent));
  }
}

export function loadGoogleAnalytics(measurementId: string): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  if (!/^G-[A-Z0-9]+$/i.test(measurementId)) return false;

  const analyticsWindow = window as AnalyticsWindow;
  analyticsWindow.dataLayer ??= [];
  analyticsWindow.gtag ??= (...args: unknown[]) => { analyticsWindow.dataLayer?.push(args); };

  if (!document.querySelector('script[data-restato-analytics]')) {
    analyticsWindow.gtag('consent', 'default', consentSettings(getAnalyticsConsent()));
    analyticsWindow.gtag('set', 'ads_data_redaction', true);
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    script.dataset.restatoAnalytics = 'true';
    document.head.append(script);
    analyticsWindow.gtag('js', new Date());
    analyticsWindow.gtag('config', measurementId, {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
  }

  return true;
}

export function trackToolEvent(event: ToolEvent): void {
  for (const key of Object.keys(event)) {
    if (!eventKeys.has(key)) throw new Error(`Unsupported analytics field: ${key}`);
  }
  if (!eventNames.has(event.name)) throw new Error(`Unsupported analytics event: ${event.name}`);
  if (!supportedLanguages.includes(event.locale)) throw new Error(`Unsupported analytics locale: ${event.locale}`);
  if (getAnalyticsConsent() !== 'granted' || typeof window === 'undefined') return;

  const analyticsWindow = window as AnalyticsWindow;
  if (!analyticsWindow.gtag) return;
  analyticsWindow.gtag('event', event.name, {
    tool: event.tool,
    locale: event.locale,
    ...(event.durationBucket ? { duration_bucket: event.durationBucket } : {}),
    ...(event.errorCategory ? { error_category: event.errorCategory } : {}),
  });
}
