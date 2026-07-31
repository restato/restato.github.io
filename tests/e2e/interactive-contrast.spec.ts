import { readFileSync } from 'node:fs';
import { expect, test, type Locator, type Page } from '@playwright/test';

async function waitForHydration(page: Page) {
  await expect.poll(() => page.locator('astro-island[client="load"][ssr]').count()).toBe(0);
}

async function openInTheme(page: Page, path: string, theme: 'light' | 'dark') {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  await page.evaluate((nextTheme) => localStorage.setItem('theme', nextTheme), theme);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await waitForHydration(page);
}

async function contrastRatio(locator: Locator) {
  return locator.evaluate((element) => {
    const channels = (color: string) => color.match(/\d+(?:\.\d+)?/g)?.slice(0, 3).map(Number) ?? [];
    const luminance = (color: string) => {
      const [red, green, blue] = channels(color).map((channel) => {
        const normalized = channel / 255;
        return normalized <= 0.03928
          ? normalized / 12.92
          : ((normalized + 0.055) / 1.055) ** 2.4;
      });
      return (0.2126 * red) + (0.7152 * green) + (0.0722 * blue);
    };
    const style = getComputedStyle(element);
    const foreground = luminance(style.color);
    const background = luminance(style.backgroundColor);
    return (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05);
  });
}

async function expectAa(locator: Locator) {
  await expect(locator).toBeVisible();
  expect(await contrastRatio(locator)).toBeGreaterThanOrEqual(4.5);
}

test('remediated interactive states retain AA contrast in both themes', async ({ page }) => {
  const image = readFileSync('public/images/gallery/seed-5-800x600.jpg');

  for (const theme of ['light', 'dark'] as const) {
    await openInTheme(page, '/tools/timer/', theme);
    const start = page.getByRole('button', { name: /^(Start|시작)$/ });
    await expectAa(start);
    await start.click();
    await expectAa(page.getByRole('button', { name: /^(Pause|일시정지)$/ }));

    await openInTheme(page, '/ko/games/bingo/', theme);
    await expectAa(page.locator('[data-contrast-target="bingo-current"]'));
    await expectAa(page.locator('[data-contrast-target="bingo-marked"]').first());

    await openInTheme(page, '/ko/games/ladder/', theme);
    await page.getByRole('button', { name: '사다리 생성' }).click();
    await page.getByRole('button', { name: '참가자 1', exact: true }).click();
    await expectAa(page.locator('[data-contrast-target="ladder-selected"]'));

    await openInTheme(page, '/ko/games/roulette/', theme);
    const participantNames = Array.from({ length: 16 }, (_, index) => `참가자 ${index + 1}`);
    await page.getByRole('textbox', { name: '참가자 입력' }).fill(participantNames.join('\n'));
    await page.getByRole('button', { name: '적용', exact: true }).click();
    const participantChips = page.locator('[data-contrast-target="roulette-participant"]');
    await expect(participantChips).toHaveCount(16);
    for (const chip of await participantChips.all()) await expectAa(chip);
    const paletteColors = await page.locator('[data-roulette-palette-dot]').evaluateAll((dots) =>
      dots.map((dot) => getComputedStyle(dot).backgroundColor),
    );
    expect(new Set(paletteColors).size).toBe(16);
    await page.getByRole('button', { name: '🎲 추첨하기!' }).click();
    const historyRank = page.locator('[data-contrast-target="roulette-history-rank"]');
    await expect(historyRank).toBeVisible({ timeout: 8_000 });
    await expectAa(historyRank);

    await openInTheme(page, '/ko/tools/appstore-screenshot/', theme);
    await page.locator('input[type="file"]').setInputFiles([
      { name: 'first.jpg', mimeType: 'image/jpeg', buffer: image },
      { name: 'second.jpg', mimeType: 'image/jpeg', buffer: image },
    ]);
    await page.getByRole('button', { name: '모두 처리' }).click();
    await expectAa(page.locator('[data-contrast-target="appstore-processed"]').first());
  }
});
