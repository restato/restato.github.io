import { describe, expect, it } from 'vitest';
import { supportedLanguages } from '../../../../data/tools/locales';
import { additionalTools } from '../../../../data/tools/additions/data-text';

describe('data and text tool additions', () => {
  it('exports the exact requested slugs and component names', () => {
    expect(additionalTools.map(({ slug, component }) => [slug, component])).toEqual([
      ['csv-json', 'CsvJsonTool'],
      ['text-cleaner', 'TextCleanerTool'],
      ['seo-generator', 'SeoGeneratorTool'],
    ]);
  });

  it('provides substantive profiles for all twelve supported languages', () => {
    for (const tool of additionalTools) {
      expect(Object.keys(tool.profiles).sort()).toEqual([...supportedLanguages].sort());
      for (const profile of Object.values(tool.profiles)) {
        expect(profile.name.length).toBeGreaterThan(3);
        expect(profile.input.length).toBeGreaterThan(5);
        expect(profile.output.length).toBeGreaterThan(5);
        expect(profile.example.length).toBeGreaterThan(5);
        expect(profile.limitation.length).toBeGreaterThan(5);
      }
    }
  });
});
