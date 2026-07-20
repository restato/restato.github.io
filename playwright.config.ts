import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 45_000,
  use: {
    baseURL: 'http://127.0.0.1:4321',
    trace: 'retain-on-failure',
  },
  projects: [{
    name: 'mobile',
    use: {
      browserName: 'chromium',
      viewport: { width: 375, height: 812 },
      isMobile: true,
      hasTouch: true,
    },
  }],
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4321',
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
