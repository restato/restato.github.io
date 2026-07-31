import { configDefaults, defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // Playwright owns browser contracts under both paths. Keep Vitest's default
    // exclusions (including node_modules) and add both runner boundaries.
    exclude: [...configDefaults.exclude, 'e2e/**', 'tests/e2e/**'],
    // V8 coverage keeps normal file parallelism; this gives overloaded jsdom workers
    // a realistic per-test budget instead of the 5s default.
    testTimeout: 15_000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.test.{ts,tsx}',
        '**/__tests__/**',
        'dist/',
        '.astro/',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
