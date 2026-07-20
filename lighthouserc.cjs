module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      url: [
        '/ko/tools/',
        '/ko/tools/text-counter/',
        '/ko/tools/json/',
        '/ko/tools/image-resizer/',
      ],
      numberOfRuns: 1,
      settings: {
        // Fallback locale pages are intentionally noindex until translation is
        // complete. Registry/site validation owns that policy, so omit only
        // crawlability while preserving the aggregate SEO score gate below.
        skipAudits: ['is-crawlable'],
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: './.lighthouseci',
    },
  },
};
