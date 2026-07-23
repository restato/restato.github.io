import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { assertNoUnexpectedConsoleErrors } from './fixtures';

async function waitForHydration(page: import('@playwright/test').Page) {
  await expect.poll(() => page.locator('astro-island[client="load"][ssr]').count()).toBe(0);
}

test('screenshot thumbnails separate Space selection from Tab+Enter removal', async ({ page }) => {
  assertNoUnexpectedConsoleErrors(page);
  await page.goto('/ko/tools/appstore-screenshot/', { waitUntil: 'domcontentloaded' });
  await waitForHydration(page);
  const image = readFileSync('public/images/gallery/seed-5-800x600.jpg');
  await page.locator('input[type="file"]').setInputFiles([
    { name: 'first.jpg', mimeType: 'image/jpeg', buffer: image },
    { name: 'second.jpg', mimeType: 'image/jpeg', buffer: image },
    { name: 'third.jpg', mimeType: 'image/jpeg', buffer: image },
  ]);

  const selectSecond = page.getByRole('button', { name: 'Select image 2' });
  await expect(selectSecond).toBeVisible();
  await selectSecond.focus();
  await page.keyboard.press('Space');
  await expect(selectSecond).toHaveAttribute('aria-pressed', 'true');

  await page.keyboard.press('Tab');
  const removeSecond = page.getByRole('button', { name: 'Remove image 2' });
  await expect(removeSecond).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: /^Select image / })).toHaveCount(2);
  await expect(page.getByRole('button', { name: 'Select image 2' })).toHaveAttribute('aria-pressed', 'true');
  assertNoUnexpectedConsoleErrors(page);
});

test('saved D-Day separates Space loading from Tab+Enter deletion', async ({ page }) => {
  assertNoUnexpectedConsoleErrors(page);
  await page.addInitScript(() => {
    localStorage.setItem('savedDdays', JSON.stringify([{ name: 'Launch', date: '2030-01-02' }]));
  });
  await page.goto('/ko/tools/dday/', { waitUntil: 'domcontentloaded' });
  await waitForHydration(page);

  const load = page.getByRole('button', { name: 'Launch 불러오기' });
  await expect(load).toBeVisible();
  await load.focus();
  await page.keyboard.press('Space');
  await expect(page.getByRole('textbox', { name: '이벤트 이름 (선택)' })).toHaveValue('Launch');
  await expect(page.locator('input[type="date"]')).toHaveValue('2030-01-02');

  await page.keyboard.press('Tab');
  const remove = page.getByRole('button', { name: 'Launch 삭제' });
  await expect(remove).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(load).toHaveCount(0);
  await expect(page.getByText('저장된 D-Day')).toHaveCount(0);
  assertNoUnexpectedConsoleErrors(page);
});
