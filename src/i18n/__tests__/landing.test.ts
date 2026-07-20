import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { supportedLanguages } from '../../data/tools/locales';

const landingPagePath = resolve(process.cwd(), 'src/pages/[lang]/index.astro');
const landingContentPath = resolve(process.cwd(), 'src/i18n/landing.ts');
const toolHubPath = resolve(process.cwd(), 'src/pages/[lang]/tools/index.astro');
const toolDetailPath = resolve(process.cwd(), 'src/pages/[lang]/tools/[slug].astro');

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
});
