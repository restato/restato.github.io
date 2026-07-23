export const forestCafeRequiredFamilies = [
  'home',
  'catalog',
  'text-tool',
  'file-tool',
  'game-catalog',
  'game-detail',
  'blog-article',
  'policy',
  'dashboard',
  'chat',
] as const;

export type ForestCafeFamily = (typeof forestCafeRequiredFamilies)[number];
export type ForestCafeLocale = 'ko' | 'en' | 'hi';

export interface ForestCafeRoute {
  id: string;
  name: string;
  family: ForestCafeFamily;
  path: string;
  locale: ForestCafeLocale;
  forceDirection?: 'rtl';
  visualMasks?: readonly string[];
}

/**
 * The production locale registry at the Task 9 baseline contains 12 LTR
 * locales and no RTL locale. The Hindi policy route is therefore also run
 * under a test-only RTL direction override. This exercises logical CSS and
 * direction-safe layout without inventing a public locale or route.
 */
export const forestCafeRoutes: readonly ForestCafeRoute[] = [
  {
    id: 'home-ko',
    name: 'Korean home',
    family: 'home',
    path: '/ko/',
    locale: 'ko',
  },
  {
    id: 'home-en',
    name: 'English home',
    family: 'home',
    path: '/en/',
    locale: 'en',
  },
  {
    id: 'catalog-ko',
    name: 'Korean tool catalog',
    family: 'catalog',
    path: '/ko/tools/',
    locale: 'ko',
  },
  {
    id: 'text-tool-en',
    name: 'English text tool',
    family: 'text-tool',
    path: '/en/tools/text-counter/',
    locale: 'en',
  },
  {
    id: 'file-tool-ko',
    name: 'Korean PDF file tool',
    family: 'file-tool',
    path: '/ko/tools/pdf-merge/',
    locale: 'ko',
  },
  {
    id: 'game-catalog-en',
    name: 'English game catalog',
    family: 'game-catalog',
    path: '/en/games/',
    locale: 'en',
  },
  {
    id: 'game-detail-ko',
    name: 'Korean canvas game',
    family: 'game-detail',
    path: '/ko/games/snake/',
    locale: 'ko',
    visualMasks: ['canvas'],
  },
  {
    id: 'blog-article-en',
    name: 'English blog article',
    family: 'blog-article',
    path: '/blog/safer-git-workflow-with-pr/',
    locale: 'en',
  },
  {
    id: 'policy-ko',
    name: 'Korean privacy policy',
    family: 'policy',
    path: '/ko/privacy/',
    locale: 'ko',
  },
  {
    id: 'dashboard-ko',
    name: 'Korean dashboard',
    family: 'dashboard',
    path: '/dashboard/',
    locale: 'ko',
    visualMasks: ['main .fc-surface > astro-island > section'],
  },
  {
    id: 'chat-en',
    name: 'English anonymous chat',
    family: 'chat',
    path: '/en/anonymous-chat/',
    locale: 'en',
    visualMasks: ['.chat-container'],
  },
  {
    id: 'direction-audit-hi',
    name: 'Hindi policy with RTL direction audit',
    family: 'policy',
    path: '/hi/privacy/',
    locale: 'hi',
    forceDirection: 'rtl',
  },
];

export const forestCafeAlwaysMaskedSelectors = [
  '[data-ad-placement]',
  'ins.adsbygoogle',
  '[data-consent-banner]',
] as const;
