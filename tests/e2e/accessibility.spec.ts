import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {
  assertNoContentUpload,
  assertNoHorizontalOverflow,
  assertNoUnexpectedConsoleErrors,
} from './fixtures';

const routes = [
  { name: 'tool hub', path: '/ko/tools' },
  { name: 'text tool', path: '/ko/tools/text-counter' },
  { name: 'developer tool', path: '/ko/tools/json' },
  { name: 'image tool', path: '/ko/tools/image-resizer' },
] as const;

const themes = ['light', 'dark'] as const;
const transparentPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLIPgAAAABJRU5ErkJggg==',
  'base64',
);

async function assertNoSeriousOrCriticalAxeViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  const blockingViolations = results.violations.filter(({ impact }) => (
    impact === 'serious' || impact === 'critical'
  ));

  expect(blockingViolations, JSON.stringify(blockingViolations, null, 2)).toEqual([]);
}

for (const theme of themes) {
  for (const route of routes) {
    test(`${route.name} has no serious or critical axe violations in ${theme} mode`, async ({ page }) => {
      const sentinelSecret = `a11y-${theme}-${route.name.replace(/\s/g, '-')}`;
      assertNoUnexpectedConsoleErrors(page);
      assertNoContentUpload(page, [sentinelSecret]);

      await page.emulateMedia({ colorScheme: theme });
      const response = await page.goto(route.path, { waitUntil: 'networkidle' });

      expect(response?.ok()).toBeTruthy();
      if (theme === 'dark') {
        await expect(page.locator('html')).toHaveClass(/\bdark\b/);
      } else {
        await expect(page.locator('html')).not.toHaveClass(/\bdark\b/);
      }
      await assertNoSeriousOrCriticalAxeViolations(page);
      await assertNoHorizontalOverflow(page);
      assertNoUnexpectedConsoleErrors(page);
      assertNoContentUpload(page, [sentinelSecret]);
    });
  }
}

test('keyboard navigation operates the responsive disclosure when no dialog is present', async ({ page }, testInfo) => {
  await page.goto('/ko/tools', { waitUntil: 'networkidle' });

  // The current tool shell has no dialog. The language menu (desktop) or
  // navigation menu (mobile) is the representative keyboard disclosure.
  await expect(page.locator('[role="dialog"]')).toHaveCount(0);

  if (testInfo.project.name === 'mobile-390') {
    const menuButton = page.getByRole('button', { name: 'Toggle menu' });
    await menuButton.focus();
    await expect(menuButton).toBeFocused();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    await page.keyboard.press('Enter');
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#mobile-menu')).toBeVisible();
    await page.keyboard.press('Tab');
    await expect(page.locator('#mobile-menu a').first()).toBeFocused();
    return;
  }

  const languageButton = page.getByRole('button', { name: 'Select language' });
  await languageButton.focus();
  await expect(languageButton).toBeFocused();
  await expect(languageButton).toHaveAttribute('aria-expanded', 'false');
  await page.keyboard.press('Enter');
  await expect(languageButton).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#lang-menu')).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.locator('#lang-menu button').first()).toBeFocused();
});

test('keyboard file selection, announced JSON result, and focused download work with valid fixtures', async ({ page }) => {
  const interactionSentinel = 'a11y-keyboard-content-sentinel';
  assertNoContentUpload(page, [interactionSentinel]);

  await page.goto('/ko/tools/image-resizer', { waitUntil: 'networkidle' });

  const imagePicker = page.getByRole('button', { name: '이미지 파일 선택' });
  await imagePicker.focus();
  await expect(imagePicker).toBeFocused();
  const chooserPromise = page.waitForEvent('filechooser');
  await page.keyboard.press('Enter');
  const chooser = await chooserPromise;
  await chooser.setFiles({
    name: `${interactionSentinel}.png`,
    mimeType: 'image/png',
    buffer: transparentPng,
  });

  const downloadButton = page.getByRole('button', { name: '다운로드' });
  await expect(downloadButton).toBeVisible();
  await assertNoSeriousOrCriticalAxeViolations(page);
  await downloadButton.focus();
  await expect(downloadButton).toBeFocused();
  const downloadPromise = page.waitForEvent('download');
  await page.keyboard.press('Enter');
  expect((await downloadPromise).suggestedFilename()).toMatch(/resized\.(jpeg|png|webp)$/);

  await page.goto('/ko/tools/json', { waitUntil: 'networkidle' });
  const jsonInput = page.getByRole('textbox', { name: '입력' });
  await jsonInput.fill(`{"value":"${interactionSentinel}"}`);
  await page.getByRole('button', { name: '포매팅' }).press('Enter');
  await expect(page.getByRole('status')).toContainText('유효한 JSON');
  await assertNoSeriousOrCriticalAxeViolations(page);
  assertNoContentUpload(page, [interactionSentinel]);
});
