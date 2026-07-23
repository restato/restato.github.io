import { describe, expect, it } from 'vitest';
import { supportedLanguages } from '../locales';
import { getTool } from '../registry';
import { hasLocalizedToolComponent } from '../../../components/tools/LocalizedToolIsland';

const additionalSlugs = [
  'pdf-merge', 'pdf-split', 'pdf-rotate', 'images-to-pdf', 'pdf-to-images',
  'csv-json', 'text-cleaner', 'seo-generator',
  'modern-image-converter', 'exif-remover', 'favicon-generator', 'loan-calculator', 'audio-trimmer',
] as const;

describe('additional browser tools', () => {
  it.each(additionalSlugs)('publishes %s with a real component and twelve complete locales', slug => {
    const tool = getTool(slug);
    expect(tool, `${slug} registry entry`).toBeDefined();
    expect(hasLocalizedToolComponent(slug), `${slug} component`).toBe(true);
    expect(Object.keys(tool?.content ?? {}).sort()).toEqual([...supportedLanguages].sort());
    expect(tool?.indexableLanguages.sort()).toEqual([...supportedLanguages].sort());
    expect(tool?.privacyMode).toBe('local-only');
  });
});
