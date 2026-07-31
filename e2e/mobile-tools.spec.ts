import { expect, test } from '@playwright/test';

const toolSlugs = [
  'qr-code', 'password', 'uuid', 'lorem-ipsum', 'color-palette', 'hash', 'color', 'unit',
  'base64', 'image-converter', 'text-counter', 'markdown', 'diff', 'json', 'regex', 'url-encoder',
  'jwt-decoder', 'cron', 'timestamp', 'llm-cost', 'gradient', 'box-shadow', 'image-resizer', 'exif',
  'background-remover', 'image-metadata', 'appstore-screenshot', 'utm', 'timer', 'pomodoro',
  'world-clock', 'percent', 'discount', 'bmi', 'age', 'dday', 'dutch-pay', 'coin-flip', 'dice', 'kor-eng',
] as const;

const fileTools = new Set(['image-converter', 'image-resizer', 'exif', 'background-remover', 'image-metadata', 'appstore-screenshot']);
const fileResult = {
  'image-converter': 'mobile-private.png',
  'image-resizer': 'Original',
  exif: 'mobile-private.png',
  'background-remover': 'Original',
  'image-metadata': 'mobile-private.png',
  'appstore-screenshot': 'Crop preview',
} as const;
const tinyPng = Buffer.concat([
  Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL8PwAAAABJRU5ErkJggg==', 'base64'),
  Buffer.from('mobile-private-file-bytes'),
]);

function assertNoExternalFileTransfer(
  requests: Array<{ url: string; method: string; postData: string | null }>,
  origin: string,
  fileName: string,
) {
  const externalUserPayloads = requests.filter((request) => {
    const url = new URL(request.url);
    return url.origin !== origin && Boolean(request.postData) && (
      request.postData?.includes(fileName) || request.postData?.includes('mobile-private-file-bytes')
    );
  });
  expect(externalUserPayloads).toEqual([]);
  expect(requests.filter((request) => request.url.includes(fileName) || request.postData?.includes(fileName))).toEqual([]);
}

for (const slug of toolSlugs) {
  test(`${slug} renders and remains usable at 375px`, async ({ page }) => {
    const consoleErrors: string[] = [];
    const requests: Array<{ url: string; method: string; postData: string | null }> = [];
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('pageerror', (error) => consoleErrors.push(error.message));
    page.on('request', (request) => requests.push({ url: request.url(), method: request.method(), postData: request.postData() }));

    await page.goto(`/tools/${slug}`, { waitUntil: 'networkidle' });
    expect(page.viewportSize()).toEqual({ width: 375, height: 812 });
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
    expect(box!.y + box!.height).toBeLessThanOrEqual(812);

    if (fileTools.has(slug)) {
      const fileSlug = slug as keyof typeof fileResult;
      const fileInput = main.locator('input[type="file"]');
      await expect(fileInput).toHaveCount(1);
      requests.length = 0;
      await fileInput.setInputFiles({
        name: 'mobile-private.png',
        mimeType: 'image/png',
        buffer: tinyPng,
      });
      const result = main.getByText(fileResult[fileSlug]);
      if (fileSlug === 'image-resizer' || fileSlug === 'background-remover' || fileSlug === 'appstore-screenshot') {
        await expect(main.getByAltText(fileResult[fileSlug])).toBeVisible();
      } else {
        await expect(result.first()).toBeVisible();
      }
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
      assertNoExternalFileTransfer(requests, new URL(page.url()).origin, 'mobile-private.png');
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
  expect(page.viewportSize()).toEqual({ width: 375, height: 812 });
  await expect(page.locator('main')).not.toBeEmpty();
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  const primary = page.locator('main button:not([disabled]), main input, main textarea').first();
  await primary.scrollIntoViewIfNeeded();
  await expect(primary).toBeVisible();
  await primary.focus();
  await expect(primary).toBeFocused();
  const newChat = page.getByRole('button', { name: 'Start New Chat' });
  await expect(newChat).toBeVisible();
  await newChat.click();
  await expect(newChat).toBeVisible();
  expect(consoleErrors).toEqual([]);
});
