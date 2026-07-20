import { describe, expect, it } from 'vitest';

import { gamesConfig, getGameSeo, isGameLanguage } from '../games';

describe('game locale boundaries', () => {
  it('requires the three published game locales without inventing translations', () => {
    for (const game of gamesConfig) {
      expect(Object.keys(game.seo)).toEqual(['ko', 'en', 'ja']);
    }
  });

  it('falls back unsupported site locales to English game metadata', () => {
    const game = gamesConfig[0];
    expect(getGameSeo(game, 'fr')).toBe(game.seo.en);
    expect(getGameSeo(game, 'ko')).toBe(game.seo.ko);
    expect(isGameLanguage('zh-TW')).toBe(false);
  });
});
