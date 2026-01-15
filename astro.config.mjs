import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://restato.github.io',
  integrations: [
    mdx(),
    react(),
    sitemap({
      serialize(item) {
        item.lastmod = new Date().toISOString();
        return item;
      },
    }),
    tailwind(),
  ],
  output: 'static',
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
  vite: {
    optimizeDeps: {
      exclude: ['@imgly/background-removal'],
    },
    build: {
      rollupOptions: {
        external: [
          '@imgly/background-removal',
          'onnxruntime-web',
          'onnxruntime-web/webgpu',
        ],
      },
    },
  },
});
