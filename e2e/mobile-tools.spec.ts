import { expect, test } from '@playwright/test';

const toolSlugs = [
  'qr-code', 'password', 'uuid', 'lorem-ipsum', 'color-palette', 'hash', 'color', 'unit',
  'base64', 'image-converter', 'text-counter', 'markdown', 'diff', 'json', 'regex', 'url-encoder',
  'jwt-decoder', 'cron', 'timestamp', 'llm-cost', 'gradient', 'box-shadow', 'image-resizer', 'exif',
  'background-remover', 'image-metadata', 'appstore-screenshot', 'utm', 'timer', 'pomodoro',
  'world-clock', 'percent', 'discount', 'bmi', 'age', 'dday', 'dutch-pay', 'coin-flip', 'dice', 'kor-eng',
] as const;

const fileTools = new Set(['image-converter', 'image-resizer', 'exif', 'background-remover', 'image-metadata', 'appstore-screenshot']);

for (const slug of toolSlugs) {
  test(`${slug} renders and remains usable at 375px`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('pageerror', (error) => consoleErrors.push(error.message));

    await page.goto(`/tools/${slug}`, { waitUntil: 'networkidle' });
    await expect(page.locator('main')).not.toBeEmpty();
    await expect(page.locator('[data-nextjs-dialog], .vite-error-overlay, #webpack-dev-server-client-overlay')).toHaveCount(0);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);

    const main = page.locator('main');
    const primary = main.locator('textarea, input:not([type="file"]):not([type="hidden"]), select, button:not([disabled])').first();
    await expect(primary).toBeVisible();
    await primary.scrollIntoViewIfNeeded();
    const box = await primary.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(375);
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.y + box!.height).toBeLessThanOrEqual(667);

    if (fileTools.has(slug)) {
      await expect(main.locator('input[type="file"]')).toHaveCount(1);
    } else {
      await primary.focus();
      await expect(primary).toBeFocused();
      const inputType = await primary.evaluate((element) => element instanceof HTMLInputElement ? element.type : element.tagName.toLowerCase());
      if (inputType === 'text' || inputType === 'url' || inputType === 'search' || inputType === 'textarea') {
        await primary.fill('browser mobile check');
      } else {
        await page.keyboard.press('Tab');
      }
    }

    expect(consoleErrors).toEqual([]);
  });
}

test('anonymous chat renders and retains an in-viewport primary control at 375px', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', (error) => consoleErrors.push(error.message));

  await page.goto('/anonymous-chat', { waitUntil: 'networkidle' });
  await expect(page.locator('main')).not.toBeEmpty();
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  const primary = page.locator('main button:not([disabled]), main input, main textarea').first();
  await primary.scrollIntoViewIfNeeded();
  await expect(primary).toBeVisible();
  await primary.focus();
  await expect(primary).toBeFocused();
  expect(consoleErrors).toEqual([]);
});
