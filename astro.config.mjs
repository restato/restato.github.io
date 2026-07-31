import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { isIndexableLocalizedToolUrl } from './src/data/tools/pageMetadata';
import { supportedLanguages } from './src/data/tools/locales';
import { localeMetadata } from './src/i18n';

const sitemapLocales = Object.fromEntries(
  supportedLanguages.map(lang => [lang, localeMetadata[lang].html]),
);

export default defineConfig({
  site: 'https://restato.github.io',
  integrations: [
    mdx(),
    react(),
    sitemap({
      filter: isIndexableLocalizedToolUrl,
      i18n: {
        defaultLocale: 'ko',
        locales: sitemapLocales,
      },
      serialize(item) {
        item.lastmod = new Date().toISOString();
        return item;
      },
    }),
    tailwind(),
  ],
  output: 'static',
  vite: {
    build: {
      manifest: true,
    },
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
