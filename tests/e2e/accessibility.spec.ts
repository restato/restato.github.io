import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {
  assertNoContentUpload,
  assertNoHorizontalOverflow,
  assertNoUnexpectedConsoleErrors,
} from './fixtures';
import { forestCafeRoutes, type ForestCafeRoute } from './forest-cafe-routes';

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

async function installRouteState(page: Page, route: ForestCafeRoute) {
  await page.route(/^https:\/\/api\.frankfurter\.dev\/v1\//, async (requestRoute) => {
    await requestRoute.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        amount: 1,
        base: 'USD',
        date: '2026-07-20',
        rates: { KRW: 1380, JPY: 150, EUR: 0.86 },
      }),
    });
  });

  await page.addInitScript(({ direction }) => {
    if (!direction) return;
    const applyDirection = () => document.documentElement?.setAttribute('dir', direction);
    applyDirection();
    document.addEventListener('DOMContentLoaded', applyDirection, { once: true });
  }, { direction: route.forceDirection });
}

async function waitForClientLoadHydration(page: Page) {
  await expect.poll(
    () => page.locator('astro-island[client="load"][ssr]').count(),
    { message: 'Axe must scan hydrated client:load islands, not only SSR markup' },
  ).toBe(0);
}

async function setTheme(page: Page, theme: 'light' | 'dark') {
  await page.evaluate((nextTheme) => localStorage.setItem('theme', nextTheme), theme);
  await page.reload({ waitUntil: 'networkidle' });
  await expect(page.locator('main#main-content')).not.toBeEmpty();
  await waitForClientLoadHydration(page);
  if (theme === 'dark') {
    await expect(page.locator('html')).toHaveClass(/\bdark\b/);
  } else {
    await expect(page.locator('html')).not.toHaveClass(/\bdark\b/);
  }
}

async function assertDocumentStructure(page: Page, route: ForestCafeRoute) {
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('main#main-content[tabindex="-1"]')).toHaveCount(1);
  await expect(page.getByRole('banner')).toHaveCount(1);
  await expect(page.getByRole('contentinfo')).toHaveCount(1);
  expect(await page.getByRole('navigation').count()).toBeGreaterThan(0);
  if (route.forceDirection) {
    await expect(page.locator('html')).toHaveAttribute('dir', route.forceDirection);
  }
}

for (const route of forestCafeRoutes) {
  test(`${route.name} has valid landmarks and no serious axe violations in both themes`, async ({ page }) => {
    await installRouteState(page, route);
    assertNoUnexpectedConsoleErrors(page);
    await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
    const response = await page.goto(route.path, { waitUntil: 'domcontentloaded' });

    expect(response?.ok(), `${route.path} must resolve`).toBeTruthy();
    await expect(page.locator('main#main-content')).not.toBeEmpty();
    await waitForClientLoadHydration(page);
    await page.waitForLoadState('networkidle');

    for (const theme of ['light', 'dark'] as const) {
      await setTheme(page, theme);
      await assertDocumentStructure(page, route);
      await assertNoSeriousOrCriticalAxeViolations(page);
      await assertNoHorizontalOverflow(page);
      assertNoUnexpectedConsoleErrors(page);
    }
  });
}

test('keyboard navigation operates the responsive disclosure when no dialog is present', async ({ page }, testInfo) => {
  await page.goto('/ko/tools', { waitUntil: 'networkidle' });

  // The current tool shell has no dialog. The language menu (desktop) or
  // navigation menu (mobile) is the representative keyboard disclosure.
  await expect(page.locator('[role="dialog"]')).toHaveCount(0);

  if (testInfo.project.name === 'mobile-390') {
    const menuButton = page.getByRole('button', { name: '메뉴 열기 또는 닫기' });
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

  const languageButton = page.getByRole('button', { name: '언어 선택' });
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

  const imagePicker = page.getByRole('button', { name: '이미지를 드래그하거나 클릭하여 업로드' });
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

  await jsonInput.fill('{invalid json}');
  await page.getByRole('button', { name: '검증' }).press('Enter');
  await expect(page.getByRole('alert')).toContainText('유효하지 않은 JSON');
  await assertNoSeriousOrCriticalAxeViolations(page);
  assertNoContentUpload(page, [interactionSentinel]);
});
