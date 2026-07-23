import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const header = readFileSync('src/components/Header.astro', 'utf8');
const footer = readFileSync('src/components/Footer.astro', 'utf8');
const consent = readFileSync('src/components/ConsentBanner.astro', 'utf8');
const layout = readFileSync('src/layouts/MainLayout.astro', 'utf8');
const chromeSources = [header, footer, consent, layout].join('\n');

describe('Forest Café site chrome', () => {
  it('labels navigation landmarks and exposes the current route', () => {
    expect(header).toMatch(/<nav[^>]+aria-label=\{chrome\.primaryNavigation\}/);
    expect(header).toContain('aria-current={isActive(item.href) ?');
    expect(footer).toMatch(/<nav[^>]+aria-label=\{siteInformationLabel\[lang\]\}/);
  });

  it('uses accessible theme, language, and mobile disclosure controls', () => {
    expect(header).toContain('id="theme-toggle-btn"');
    expect(header).toContain('aria-pressed="false"');
    expect(header).toContain('data-theme-icon');
    expect(header).toContain('id="lang-trigger"');
    expect(header).toContain('aria-haspopup="true"');
    expect(header).toContain('(Object.entries(languages) as [Language, string][])');
    expect(header).toContain('id="mobile-menu-btn"');
    expect(header).toContain('aria-controls="mobile-menu"');
    expect(header).toContain('aria-expanded="false"');
  });

  it('preserves explicit theme choice and follows the system only without one', () => {
    expect(header).toContain("localStorage.getItem('theme')");
    expect(header).toContain("localStorage.setItem('theme'");
    expect(header).toContain("window.matchMedia('(prefers-color-scheme: dark)')");
    expect(header).toContain("addEventListener('change'");
  });

  it('uses shared surfaces and 44px controls for the consent notice', () => {
    expect(consent).toContain('fc-surface');
    expect(consent).toContain('fc-button fc-button-secondary');
    expect(consent).toContain('fc-button fc-button-primary');
    expect(consent).not.toContain('role="dialog"');
    expect(consent).not.toContain('aria-modal');
  });

  it('provides exactly one skip link and main target in the shared layout', () => {
    expect(layout.match(/href="#main-content"/g)).toHaveLength(1);
    expect(layout.match(/id="main-content"/g)).toHaveLength(1);
    expect(layout.indexOf('href="#main-content"')).toBeLessThan(layout.indexOf('<Header'));
    expect(layout.indexOf('<Header')).toBeLessThan(layout.indexOf('<main'));
    expect(layout.indexOf('<main')).toBeLessThan(layout.indexOf('<Footer'));
  });

  it('keeps global chrome quiet and free of legacy visual effects', () => {
    expect(chromeSources).not.toMatch(/\bgradient-/);
    expect(chromeSources).not.toMatch(/\bbackdrop-blur/);
    expect(chromeSources).not.toMatch(/\bhover:-translate/);
    expect(chromeSources).not.toMatch(/\bshadow-(?:lg|xl|2xl)\b/);
  });
});
