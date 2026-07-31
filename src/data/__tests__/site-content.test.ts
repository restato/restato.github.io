import { describe, expect, it } from 'vitest';
import { supportedLanguages } from '../tools/locales';
import { siteContent, siteInformationLabel, sitePageKeys } from '../site-content';

describe('localized trust content', () => {
  it('defines five complete trust pages in all twelve languages', () => {
    expect(sitePageKeys).toEqual(['about', 'contact', 'privacy', 'terms', 'disclaimer']);
    for (const key of sitePageKeys) {
      expect(Object.keys(siteContent[key]).sort()).toEqual([...supportedLanguages].sort());
      for (const lang of supportedLanguages) {
        const page = siteContent[key][lang];
        expect(page.title.trim(), `${key}/${lang} title`).not.toBe('');
        const minimumDescriptionLength = ['ko', 'ja', 'zh-CN', 'zh-TW', 'hi'].includes(lang) ? 35 : 60;
        expect(page.description.length, `${key}/${lang} description`).toBeGreaterThan(minimumDescriptionLength);
        expect(page.effectiveDate.trim(), `${key}/${lang} effective date`).not.toBe('');
        expect(page.sections.length, `${key}/${lang} sections`).toBeGreaterThanOrEqual(3);
        for (const section of page.sections) {
          expect(section.heading.trim()).not.toBe('');
          expect(section.paragraphs.length).toBeGreaterThan(0);
          expect(section.paragraphs.every(paragraph => paragraph.length > 25)).toBe(true);
        }
      }
    }
  });

  it('provides a localized accessible label for the footer navigation', () => {
    expect(Object.keys(siteInformationLabel).sort()).toEqual([...supportedLanguages].sort());
    for (const lang of supportedLanguages) expect(siteInformationLabel[lang].trim()).not.toBe('');
  });

  it('discloses contact, analytics, local processing, and advertising truthfully in every language', () => {
    for (const lang of supportedLanguages) {
      const combined = sitePageKeys
        .flatMap(key => siteContent[key][lang].sections.flatMap(section => section.paragraphs))
        .join(' ');
      expect(combined, `${lang} contact`).toContain('direcision@gmail.com');
      expect(siteContent.privacy[lang].disclosures).toEqual(expect.objectContaining({
        analytics: true,
        localProcessing: true,
        advertising: true,
      }));
      expect(siteContent.privacy[lang].contactPath).toBe(`/${lang}/contact/`);
    }
  });

  it('keeps each page substantive instead of duplicating one template', () => {
    for (const lang of supportedLanguages) {
      const descriptions = sitePageKeys.map(key => siteContent[key][lang].description);
      const headings = sitePageKeys.map(key => siteContent[key][lang].sections.map(section => section.heading).join('|'));
      expect(new Set(descriptions).size).toBe(sitePageKeys.length);
      expect(new Set(headings).size).toBe(sitePageKeys.length);
    }
  });

  it('does not publish English boilerplate inside translated policy pages', () => {
    const englishBoilerplate = [
      'We bring calculators',
      'Email direcision',
      'Most calculators',
      'Use the tools only',
      'Tool output is provided',
    ];

    for (const lang of supportedLanguages.filter(language => language !== 'en')) {
      const combined = sitePageKeys
        .flatMap(key => [
          siteContent[key][lang].description,
          ...siteContent[key][lang].sections.flatMap(section => [section.heading, ...section.paragraphs]),
        ])
        .join(' ');
      for (const phrase of englishBoilerplate) {
        expect(combined, `${lang} contains English boilerplate`).not.toContain(phrase);
      }
    }
  });
});
