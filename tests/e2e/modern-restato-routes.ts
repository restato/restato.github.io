export const modernRestatoRequiredFamilies = [
  'home',
  'catalog',
  'text-tool',
  'file-tool',
  'game-catalog',
  'game-detail',
  'blog-index',
  'blog-tag',
  'blog-article',
  'llm-wiki',
  'policy',
  'dashboard',
  'chat',
  'project',
  'not-found',
] as const;

export type ModernRestatoFamily = (typeof modernRestatoRequiredFamilies)[number];
export type ModernRestatoLocale = 'ko' | 'en' | 'hi';

export interface ModernRestatoRoute {
  id: string;
  name: string;
  family: ModernRestatoFamily;
  path: string;
  locale: ModernRestatoLocale;
  forceDirection?: 'rtl';
  visualMasks?: readonly string[];
}

/**
 * The production locale registry at the Task 9 baseline contains 12 LTR
 * locales and no RTL locale. The Hindi policy route is therefore also run
 * under a test-only RTL direction override. This exercises logical CSS and
 * direction-safe layout without inventing a public locale or route.
 */
export const modernRestatoRoutes: readonly ModernRestatoRoute[] = [
  {
    id: 'home-root',
    name: 'Root home composition',
    family: 'home',
    path: '/',
    locale: 'ko',
  },
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
    id: 'blog-index',
    name: 'Blog index',
    family: 'blog-index',
    path: '/blog/',
    locale: 'en',
  },
  {
    id: 'blog-tag-selected',
    name: 'Selected blog tag',
    family: 'blog-tag',
    path: '/blog/tag/claude-code/',
    locale: 'en',
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
    id: 'llm-wiki',
    name: 'LLM Wiki field guide',
    family: 'llm-wiki',
    path: '/llm-wiki/',
    locale: 'en',
  },
  {
    id: 'dashboard-ko',
    name: 'Korean dashboard',
    family: 'dashboard',
    path: '/dashboard/',
    locale: 'ko',
  },
  {
    id: 'chat-en',
    name: 'English anonymous chat',
    family: 'chat',
    path: '/en/anonymous-chat/',
    locale: 'en',
    visualMasks: [
      '.chat-container [role="status"] > *',
      '.chat-container [role="log"] > *',
    ],
  },
  {
    id: 'direction-audit-hi',
    name: 'Hindi policy with RTL direction audit',
    family: 'policy',
    path: '/hi/privacy/',
    locale: 'hi',
    forceDirection: 'rtl',
  },
  {
    id: 'project-gallery',
    name: 'Project gallery',
    family: 'project',
    path: '/projects/gallery/',
    locale: 'ko',
  },
  {
    id: 'project-jobworld-kids',
    name: 'Jobworld Kids project',
    family: 'project',
    path: '/projects/jobworld-kids/',
    locale: 'ko',
  },
  {
    id: 'project-local-price-extractor',
    name: 'Local price extractor project',
    family: 'project',
    path: '/projects/local-price-extractor/',
    locale: 'ko',
  },
  {
    id: 'project-quick-issue',
    name: 'Quick Issue project',
    family: 'project',
    path: '/projects/quick-issue/',
    locale: 'en',
  },
  {
    id: 'project-roomfit-3d',
    name: 'RoomFit 3D project',
    family: 'project',
    path: '/projects/roomfit-3d/',
    locale: 'ko',
  },
  {
    id: 'not-found',
    name: 'Not found page',
    family: 'not-found',
    path: '/404/',
    locale: 'ko',
  },
];

export const modernRestatoAlwaysMaskedSelectors = [
  '[data-ad-placement]',
  'ins.adsbygoogle',
  '[data-consent-banner]',
  '[data-current-year]',
] as const;
