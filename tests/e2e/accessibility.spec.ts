import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {
  assertNoContentUpload,
  assertNoHorizontalOverflow,
  assertNoUnexpectedConsoleErrors,
} from './fixtures';
import { modernRestatoRoutes, type ModernRestatoRoute } from './modern-restato-routes';

const validPng = Buffer.from(
  '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',
  'base64',
);

async function assertNoSeriousOrCriticalAxeViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa'])
    .analyze();
  const blockingViolations = results.violations.filter(({ impact }) => (
    impact === 'serious' || impact === 'critical'
  ));

  expect(blockingViolations, JSON.stringify(blockingViolations, null, 2)).toEqual([]);
}

async function installRouteState(page: Page, route: ModernRestatoRoute) {
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
    sessionStorage.setItem('restato_bookmark_dismissed', 'true');
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

async function waitForClientIdleHydration(page: Page) {
  await expect.poll(
    () => page.locator('astro-island[client="idle"][ssr]').count(),
    { message: 'The bookmark prompt must hydrate before its clock is advanced' },
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

async function assertDocumentStructure(page: Page, route: ModernRestatoRoute) {
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('main#main-content[tabindex="-1"]')).toHaveCount(1);
  await expect(page.getByRole('banner')).toHaveCount(1);
  await expect(page.getByRole('contentinfo')).toHaveCount(1);
  expect(await page.getByRole('navigation').count()).toBeGreaterThan(0);
  if (route.forceDirection) {
    await expect(page.locator('html')).toHaveAttribute('dir', route.forceDirection);
  }
}

for (const route of modernRestatoRoutes) {
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

test('github-dark Shiki comments retain WCAG AA contrast in both site themes', async ({ page }) => {
  const articleRoute = modernRestatoRoutes.find(({ family }) => family === 'blog-article');
  expect(articleRoute).toBeDefined();

  await page.goto(articleRoute!.path, { waitUntil: 'networkidle' });

  const commentTokens = page.locator(
    ".fc-prose pre.astro-code.github-dark span[style*='color:#6A737D']",
  );
  expect(await commentTokens.count()).toBeGreaterThan(0);

  for (const theme of ['light', 'dark'] as const) {
    await setTheme(page, theme);
    const contrastRatios = await commentTokens.evaluateAll((tokens) => {
      const relativeLuminance = (color: string) => {
        const channels = color.match(/[\d.]+/g)?.slice(0, 3).map(Number) ?? [];
        if (channels.length !== 3) return Number.NaN;
        const [red, green, blue] = channels.map((channel) => {
          const value = channel / 255;
          return value <= 0.04045
            ? value / 12.92
            : ((value + 0.055) / 1.055) ** 2.4;
        });
        return (0.2126 * red) + (0.7152 * green) + (0.0722 * blue);
      };

      return tokens.map((token) => {
        const foreground = relativeLuminance(getComputedStyle(token).color);
        const codeBlock = token.closest('pre');
        const background = relativeLuminance(getComputedStyle(codeBlock!).backgroundColor);
        const lighter = Math.max(foreground, background);
        const darker = Math.min(foreground, background);
        return (lighter + 0.05) / (darker + 0.05);
      });
    });

    expect(
      Math.min(...contrastRatios),
      `${theme} theme comment contrast ratios: ${contrastRatios.join(', ')}`,
    ).toBeGreaterThanOrEqual(4.5);
  }
});

test('keyboard navigation operates the responsive disclosure when no dialog is present', async ({ page }, testInfo) => {
  assertNoUnexpectedConsoleErrors(page);
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
    assertNoUnexpectedConsoleErrors(page);
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
  assertNoUnexpectedConsoleErrors(page);
});

test('keyboard file selection, announced JSON result, and focused download work with valid fixtures', async ({ page }) => {
  const interactionSentinel = 'a11y-keyboard-content-sentinel';
  assertNoUnexpectedConsoleErrors(page);
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
    buffer: validPng,
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
  assertNoUnexpectedConsoleErrors(page);

  await jsonInput.fill('{invalid json}');
  await page.getByRole('button', { name: '검증' }).press('Enter');
  await expect(page.getByRole('alert')).toContainText('유효하지 않은 JSON');
  await assertNoSeriousOrCriticalAxeViolations(page);
  assertNoUnexpectedConsoleErrors(page);
  assertNoContentUpload(page, [interactionSentinel]);
});

test('hydrated bookmark prompt is accessible, dismissible, and session-persistent', async ({ page }) => {
  assertNoUnexpectedConsoleErrors(page);
  await page.clock.install({ time: new Date('2026-07-23T12:00:00.000Z') });
  await page.goto('/ko/tools/text-counter/', { waitUntil: 'domcontentloaded' });
  await waitForClientIdleHydration(page);

  await page.clock.fastForward(5_000);
  const promptHeading = page.getByText('유용하셨다면 북마크하세요!');
  const dismissButton = page.getByRole('button', { name: '닫기', exact: true });
  await expect(promptHeading).toBeVisible();
  await assertNoSeriousOrCriticalAxeViolations(page);

  await dismissButton.focus();
  await expect(dismissButton).toBeFocused();
  await expect(dismissButton).toHaveCSS('outline-style', 'solid');
  await dismissButton.press('Enter');
  await expect(promptHeading).toHaveCount(0);
  expect(await page.evaluate(() => sessionStorage.getItem('restato_bookmark_dismissed')))
    .toBe('true');

  await page.reload({ waitUntil: 'domcontentloaded' });
  await waitForClientIdleHydration(page);
  await page.clock.fastForward(5_000);
  await expect(promptHeading).toHaveCount(0);
  assertNoUnexpectedConsoleErrors(page);
});
