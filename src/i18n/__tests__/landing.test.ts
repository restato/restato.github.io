import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { supportedLanguages } from '../../data/tools/locales';

const landingPagePath = resolve(process.cwd(), 'src/pages/[lang]/index.astro');
const landingContentPath = resolve(process.cwd(), 'src/i18n/landing.ts');
const toolHubPath = resolve(process.cwd(), 'src/pages/[lang]/tools/index.astro');
const toolDetailPath = resolve(process.cwd(), 'src/pages/[lang]/tools/[slug].astro');
const headerPath = resolve(process.cwd(), 'src/components/Header.astro');
const baseLayoutPath = resolve(process.cwd(), 'src/layouts/BaseLayout.astro');
const astroConfigPath = resolve(process.cwd(), 'astro.config.mjs');

describe('localized landing pages', () => {
  it('provides meaningful landing copy for every supported language', async () => {
    await expect(access(landingContentPath)).resolves.toBeUndefined();
    const source = await readFile(landingContentPath, 'utf8');
    for (const language of supportedLanguages) {
      const key = language.includes('-') ? `'${language}'` : `${language}:`;
      expect(source).toContain(key);
    }
    expect(source).toContain('satisfies Record<Language, LandingContent>');
    expect(source).toContain('fallbackNotice');
  });

  it('defines a dynamic landing route backed by all supported languages', async () => {
    await expect(access(landingPagePath)).resolves.toBeUndefined();
    const source = await readFile(landingPagePath, 'utf8');

    expect(source).toContain('supportedLanguages.map');
    expect(source).toContain('getPublishedTools()');
    expect(source).toContain('`/${lang}/tools/${tool.slug}/`');
  });

  it('generates tool hub and detail routes for all supported languages', async () => {
    const [hubSource, detailSource] = await Promise.all([
      readFile(toolHubPath, 'utf8'),
      readFile(toolDetailPath, 'utf8'),
    ]);

    expect(hubSource).toContain('supportedLanguages.map');
    expect(detailSource).toContain('for (const lang of supportedLanguages)');
    expect(detailSource).toContain('robots={robots}');
    expect(detailSource).toContain('fallbackNotice');
  });

  it('uses fallback status, indexable alternates, and locale-aware catalog controls', async () => {
    const [hubSource, landingSource] = await Promise.all([
      readFile(toolHubPath, 'utf8'),
      readFile(landingPagePath, 'utf8'),
    ]);

    expect(hubSource).toContain("!requestedContent || requestedContent.status === 'fallback'");
    expect(landingSource).toContain("content?.status === 'fallback'");
    expect(hubSource).toContain('getToolCatalogPublicationState');
    expect(hubSource).toContain('<ToolSearch client:load lang={lang} tools={tools} />');
    expect(hubSource).toContain('<RecentTools client:load lang={lang}');
    expect(hubSource).toContain('<ToolsPageInfo client:load lang={lang} />');
  });

  it('preserves the full URL while keeping URL locale metadata authoritative', async () => {
    const [headerSource, baseSource, landingSource, configSource] = await Promise.all([
      readFile(headerPath, 'utf8'),
      readFile(baseLayoutPath, 'utf8'),
      readFile(landingPagePath, 'utf8'),
      readFile(astroConfigPath, 'utf8'),
    ]);

    expect(headerSource).toContain('window.location.pathname + window.location.search + window.location.hash');
    expect(headerSource).toContain("const langSupportedPaths = ['/', '/tools', '/anonymous-chat', '/games']");
    expect(headerSource).toContain('const pathOnly = basePath.split(/[?#]/, 1)[0]');
    expect(baseSource).toContain('parseLanguage(Astro.url.pathname)');
    expect(landingSource).not.toContain('lockLanguage={true}');
    expect(configSource).toContain('supportedLanguages');
  });
});
