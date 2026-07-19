import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // V8 coverage and parallel jsdom interaction tests can exceed Vitest's 5s default
    // without indicating a product deadlock; keep the gate strict while allowing full flows.
    testTimeout: 15_000,
    // Several browser-facing suites replace shared URL, canvas, and Image globals.
    // Serial files keep those test doubles isolated under coverage instrumentation.
    fileParallelism: false,
    maxWorkers: 1,
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
