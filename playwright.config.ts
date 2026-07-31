import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Keep the independent legacy mobile suite under e2e/ while new reusable
  // browser contracts live under tests/e2e/.
  testDir: '.',
  testMatch: ['e2e/**/*.spec.ts', 'tests/e2e/**/*.spec.ts'],
  timeout: 45_000,
  use: {
    baseURL: 'http://127.0.0.1:4321',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'desktop',
      testMatch: 'tests/e2e/**/*.spec.ts',
      use: {
        browserName: 'chromium',
        viewport: { width: 1440, height: 1000 },
        timezoneId: 'Asia/Seoul',
      },
    },
    {
      name: 'mobile-390',
      testMatch: 'tests/e2e/**/*.spec.ts',
      use: {
        browserName: 'chromium',
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
        timezoneId: 'Asia/Seoul',
      },
    },
    {
      // Backward-compatible 375x812 project for e2e/mobile-tools.spec.ts.
      name: 'mobile',
      testMatch: 'e2e/**/*.spec.ts',
      // `e2e/**` also matches the nested `tests/e2e/**` substring, so make the
      // legacy-only boundary explicit rather than running catalog tests at 375px.
      testIgnore: 'tests/e2e/**',
      use: {
        browserName: 'chromium',
        viewport: { width: 375, height: 812 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4321',
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
