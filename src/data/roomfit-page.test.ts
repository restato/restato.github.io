import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';
import { resolveLayoutLanguageUrls } from '../i18n/urlUtils';

const pagePath = join(process.cwd(), 'src/pages/projects/roomfit-3d.astro');
const mainLayoutPath = join(process.cwd(), 'src/layouts/MainLayout.astro');
const headerPath = join(process.cwd(), 'src/components/Header.astro');

describe('RoomFit project detail page', () => {
  it('contains the approved public product contract', () => {
    expect(existsSync(pagePath)).toBe(true);
    const source = readFileSync(pagePath, 'utf8');

    expect(source).toContain('https://roomfit-3d.vercel.app');
    expect(source).toContain('Open Live App');

    for (const feature of [
      'Accurate Measurements',
      'Magnetic Placement',
      'Fit Checks',
      'Local-First Storage',
    ]) {
      expect(source).toContain(feature);
    }

    for (const technology of [
      'React',
      'TypeScript',
      'Three.js',
      'React Three Fiber',
      'Zustand',
      'Vite',
      'Vitest',
      'Playwright',
    ]) {
      expect(source).toContain(technology);
    }

    expect(source).toContain('SoftwareApplication');
    expect(source).toContain('BreadcrumbList');
    expect(source).toContain('lang="en"');
    expect(source).toContain('lockLanguage={true}');
    expect(source).not.toContain('github.com/restato/roomfit-3d');
    expect(source).not.toContain('View on GitHub');
  });

  it('keeps English project metadata locked without deriving article navigation', () => {
    const page = readFileSync(pagePath, 'utf8');
    const source = readFileSync(mainLayoutPath, 'utf8');

    expect(page).toContain('<MainLayout title={pageTitle} description={pageDescription} lang="en" lockLanguage={true}>');
    expect(page).not.toContain('languageUrls=');
    expect(source).toContain('lockLanguage?: boolean');
    expect(source).toContain('languageUrls?: Partial<Record<Language, string>>');
    expect(source).toContain('lockLanguage={lockLanguage}');
    expect(source).toContain("deriveFromAlternates: lockLanguage && type === 'article'");
    expect(source).toContain('<Header lang={lang} lockLanguage={lockLanguage} languageUrls={resolvedLanguageUrls} />');
    expect(resolveLayoutLanguageUrls({ deriveFromAlternates: false })).toBeUndefined();
  });

  it('keeps locked English navigation selector-free without a usable map', () => {
    const source = readFileSync(headerPath, 'utf8');
    const languageUrls = resolveLayoutLanguageUrls({
      languageUrls: { en: '   ', unsupported: '/unsupported/' },
      deriveFromAlternates: false,
    });

    expect(languageUrls).toBeUndefined();
    expect(!true || Boolean(languageUrls)).toBe(false);
    expect(source).toContain("const { lang = 'ko', lockLanguage = false, languageUrls: rawLanguageUrls } = Astro.props");
    expect(source).toContain('const languageUrls = normalizeLanguageUrls(rawLanguageUrls);');
    expect(source).toContain('const showLanguageSelector = !lockLanguage || Boolean(languageUrls);');
    expect(source).toContain('{chrome.nav[item.labelKey]}');
    expect(source).toContain('if (lockLanguage) return lang;');
  });
});
