import { describe, expect, it } from 'vitest';
import { supportedLanguages } from '../../data/tools/locales';
import { getSkipLinkLabel, skipLinkLabels } from '../skip-link';

describe('skip-link localization', () => {
  it('has a substantive label for every supported locale', () => {
    expect(Object.keys(skipLinkLabels).sort()).toEqual([...supportedLanguages].sort());
    for (const language of supportedLanguages) {
      expect(getSkipLinkLabel(language).trim()).not.toBe('');
    }
  });

  it('falls back to Korean for unknown client values', () => {
    expect(getSkipLinkLabel('unsupported')).toBe(skipLinkLabels.ko);
  });
});
