import { expect, test } from '@playwright/test';
import { assertNoHorizontalOverflow } from './fixtures';

const migratedRoutes = [
  '/games',
  '/ko/games',
  '/ko/games/2048',
  '/projects',
  '/projects/games',
  '/projects/memory-game',
  '/projects/number-guess',
  '/projects/reaction-test',
  '/projects/rock-paper-scissors',
  '/projects/roulette',
  '/projects/slot-machine',
] as const;

test('migrated game routes render exactly one main landmark', async ({ page }) => {
  for (const route of migratedRoutes) {
    const response = await page.goto(route, { waitUntil: 'networkidle' });
    expect(response?.ok(), route).toBeTruthy();
    await expect(page.locator('main'), route).toHaveCount(1);
  }
});

test('representative game boards do not overflow 320px or 390px viewports', async ({ page }) => {
  const routes = [
    '/ko/games/2048',
    '/ko/games/tic-tac-toe',
    '/ko/games/minesweeper',
    '/projects/roulette',
    '/projects/slot-machine',
  ] as const;

  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    for (const route of routes) {
      const response = await page.goto(route, { waitUntil: 'networkidle' });
      expect(response?.ok(), `${route} at ${width}px`).toBeTruthy();
      if (route === '/ko/games/minesweeper') {
        await page.getByRole('button', { name: '어려움 (16x16)' }).click();
      }
      await assertNoHorizontalOverflow(page);
    }
  }
});
