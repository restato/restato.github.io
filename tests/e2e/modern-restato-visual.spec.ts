import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { expect, test, type Page } from '@playwright/test';
import {
  assertNoHorizontalOverflow,
  assertNoUnexpectedConsoleErrors,
} from './fixtures';
import {
  modernRestatoAlwaysMaskedSelectors,
  modernRestatoRoutes,
  type ModernRestatoRoute,
} from './modern-restato-routes';

const screenshotDirectory = path.resolve(
  process.cwd(),
  'docs/superpowers/reports/assets/modern-restato',
);
const finalEvidenceAliases = new Map([
  ['home-en-desktop-light', 'home-light.png'],
  ['home-en-desktop-dark', 'home-dark.png'],
  ['blog-index-desktop-light', 'blog-tags-collapsed.png'],
  ['blog-tags-expanded-desktop-light', 'blog-tags-expanded.png'],
  ['text-tool-en-mobile-390-dark', 'tool-mobile-dark.png'],
]);
const visualDiffTolerance = 0.001;
const modernRestatoFixedTime = '2026-07-20T12:00:00.000+09:00';

const semanticThemes = {
  light: {
    surfacePage: '#f7f8f7',
    textPrimary: '#15241d',
    bodyBackground: 'rgb(247, 248, 247)',
    bodyText: 'rgb(21, 36, 29)',
    focus: 'rgb(44, 118, 85)',
  },
  dark: {
    surfacePage: '#111713',
    textPrimary: '#f0f4f1',
    bodyBackground: 'rgb(17, 23, 19)',
    bodyText: 'rgb(240, 244, 241)',
    focus: 'rgb(141, 192, 161)',
  },
} as const;

async function installStableRouteState(page: Page, route: ModernRestatoRoute) {
  await page.clock.setFixedTime(modernRestatoFixedTime);
  await page.route('https://api.frankfurter.dev/**', async (requestRoute) => {
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

  await page.addInitScript(({ direction, seedDashboard }) => {
    try {
      if (!localStorage.getItem('theme')) localStorage.setItem('theme', 'light');
      sessionStorage.setItem('restato_bookmark_dismissed', 'true');
      if (seedDashboard) {
        localStorage.setItem('restato_dashboard_fx_history_v1', JSON.stringify([
          { timestamp: '2026-07-14T00:00:00.000Z', usdKrw: 1368, usdJpy: 148, eurKrw: 1580 },
          { timestamp: '2026-07-15T00:00:00.000Z', usdKrw: 1370, usdJpy: 148.5, eurKrw: 1582 },
          { timestamp: '2026-07-16T00:00:00.000Z', usdKrw: 1372, usdJpy: 149, eurKrw: 1584 },
          { timestamp: '2026-07-17T00:00:00.000Z', usdKrw: 1375, usdJpy: 149.2, eurKrw: 1587 },
          { timestamp: '2026-07-18T00:00:00.000Z', usdKrw: 1377, usdJpy: 149.5, eurKrw: 1590 },
          { timestamp: '2026-07-19T00:00:00.000Z', usdKrw: 1379, usdJpy: 149.8, eurKrw: 1593 },
          { timestamp: '2026-07-20T00:00:00.000Z', usdKrw: 1380, usdJpy: 150, eurKrw: 1604.65 },
        ]));
      }
    } catch {
      // The target origin owns the persistent state once navigation begins.
    }

    if (!direction) return;
    const applyDirection = () => document.documentElement?.setAttribute('dir', direction);
    applyDirection();
    document.addEventListener('DOMContentLoaded', applyDirection, { once: true });
  }, {
    direction: route.forceDirection,
    seedDashboard: route.family === 'dashboard',
  });
}

async function waitForStablePage(page: Page, route: ModernRestatoRoute) {
  await expect(page.locator('main#main-content')).not.toBeEmpty();
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h1')).toBeVisible();
  await expect.poll(
    () => page.locator('astro-island[client="load"][ssr]').count(),
    { message: 'All client:load islands must finish hydrating before interaction checks' },
  ).toBe(0);
  if (route.forceDirection) {
    await expect(page.locator('html')).toHaveAttribute('dir', route.forceDirection);
  }
}

async function openRoute(page: Page, route: ModernRestatoRoute) {
  await installStableRouteState(page, route);
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
  const response = await page.goto(route.path, { waitUntil: 'domcontentloaded' });

  expect(response?.ok(), `${route.path} must resolve`).toBeTruthy();
  await waitForStablePage(page, route);
  expect(await page.evaluate(() => sessionStorage.getItem('restato_bookmark_dismissed')))
    .toBe('true');
}

async function setTheme(page: Page, route: ModernRestatoRoute, theme: 'light' | 'dark') {
  await page.evaluate((nextTheme) => {
    history.scrollRestoration = 'manual';
    localStorage.setItem('theme', nextTheme);
    history.replaceState(null, '', `${location.pathname}${location.search}`);
  }, theme);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await waitForStablePage(page, route);
  await page.evaluate(() => {
    (document.activeElement as HTMLElement | null)?.blur();
    window.scrollTo(0, 0);
  });
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
}

async function assertSemanticTheme(page: Page, theme: keyof typeof semanticThemes) {
  const expected = semanticThemes[theme];
  const actual = await page.evaluate(() => {
    const rootStyle = getComputedStyle(document.documentElement);
    const bodyStyle = getComputedStyle(document.body);
    return {
      surfacePage: rootStyle.getPropertyValue('--surface-page').trim().toLowerCase(),
      textPrimary: rootStyle.getPropertyValue('--text-primary').trim().toLowerCase(),
      bodyBackground: bodyStyle.backgroundColor,
      bodyText: bodyStyle.color,
      fontFamily: bodyStyle.fontFamily,
      colorScheme: rootStyle.colorScheme,
    };
  });

  expect(actual.surfacePage).toBe(expected.surfacePage);
  expect(actual.textPrimary).toBe(expected.textPrimary);
  expect(actual.bodyBackground).toBe(expected.bodyBackground);
  expect(actual.bodyText).toBe(expected.bodyText);
  expect([
    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", sans-serif',
    '-apple-system, "system-ui", "SF Pro Display", "SF Pro Text", "Segoe UI", sans-serif',
  ]).toContain(actual.fontFamily);
  expect(actual.colorScheme).toBe(theme);
}

async function assertKeyboardFocusAndSkipLink(page: Page, expectedFocusColor: string) {
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  await page.keyboard.press('Tab');

  const skipLink = page.locator('a[href="#main-content"]');
  await expect(skipLink).toHaveCount(1);
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeVisible();
  await expect(skipLink).toHaveCSS('outline-color', expectedFocusColor);
  await expect(skipLink).toHaveCSS('outline-style', 'solid');
  await expect(skipLink).toHaveCSS('outline-width', '2px');

  await page.keyboard.press('Enter');
  await expect(page.locator('main#main-content')).toBeFocused();
  expect(new URL(page.url()).hash).toBe('#main-content');

  await page.keyboard.press('Tab');
  const focusedControl = page.locator(':focus');
  await expect(focusedControl, 'Tab from main must reach a visible page action').toHaveCount(1);
  await expect(focusedControl).toBeVisible();
  await expect(focusedControl).toHaveCSS('outline-color', expectedFocusColor);
  await expect(focusedControl).toHaveCSS('outline-style', 'solid');
  await expect(focusedControl).toHaveCSS('outline-width', '2px');
}

async function assertHoverDoesNotShiftLayout(page: Page) {
  const mainAction = page.locator(
    'main :is(a[href], button:not([disabled]), input:not([disabled]))',
  ).first();
  const primaryAction = await mainAction.count() > 0
    ? mainAction
    : page.locator('#theme-toggle-btn');
  await expect(primaryAction).toBeVisible();
  await primaryAction.scrollIntoViewIfNeeded();
  const readDocumentGeometry = () => primaryAction.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return {
      x: rect.x + window.scrollX,
      y: rect.y + window.scrollY,
      width: rect.width,
      height: rect.height,
    };
  });
  const before = await readDocumentGeometry();
  await primaryAction.hover();
  const after = await readDocumentGeometry();
  for (const dimension of ['x', 'y', 'width', 'height'] as const) {
    expect(Math.abs(after[dimension] - before[dimension])).toBeLessThan(1);
  }
}

async function saveEvidenceScreenshot(
  page: Page,
  route: ModernRestatoRoute,
  projectName: string,
  theme: 'light' | 'dark',
  writeEvidence: boolean,
) {
  await mkdir(screenshotDirectory, { recursive: true });
  const maskSelectors = [
    ...modernRestatoAlwaysMaskedSelectors,
    ...(route.visualMasks ?? []),
  ];
  const screenshot = await page.screenshot({
    ...(writeEvidence
      ? { path: path.join(screenshotDirectory, `${route.id}-${projectName}-${theme}.png`) }
      : {}),
    animations: 'disabled',
    caret: 'hide',
    fullPage: route.id === 'blog-tags-expanded',
    mask: maskSelectors.map((selector) => page.locator(selector)),
  });
  expect(screenshot.byteLength).toBeGreaterThan(1_000);
  if (writeEvidence) {
    const alias = finalEvidenceAliases.get(`${route.id}-${projectName}-${theme}`);
    if (alias) await writeFile(path.join(screenshotDirectory, alias), screenshot);
  }
  expect(screenshot).toMatchSnapshot(
    `${route.id}-${projectName}-${theme}.png`,
    { maxDiffPixelRatio: visualDiffTolerance },
  );
}

for (const route of modernRestatoRoutes) {
  test(`${route.name} satisfies the Modern Restato visual and interaction contract`, async ({ page }, testInfo) => {
    assertNoUnexpectedConsoleErrors(page);
    await openRoute(page, route);
    await assertSemanticTheme(page, 'light');
    await assertNoHorizontalOverflow(page);
    if (route.forceDirection) {
      const headingDirection = await page.locator('h1').evaluate((heading) => {
        const style = getComputedStyle(heading);
        return { direction: style.direction, textAlign: style.textAlign };
      });
      expect(headingDirection.direction).toBe('rtl');
      expect(headingDirection.textAlign).not.toBe('left');
    }
    if (testInfo.project.name === 'desktop') {
      if (route.family === 'blog-index') {
        const toggle = page.locator('[data-blog-tag-nav] button.blog-tag-toggle');
        await toggle.focus();
        await page.keyboard.press('Tab');
        await page.keyboard.press('Shift+Tab');
        await expect(toggle).toBeFocused();
        await expect(toggle).toHaveCSS('outline-style', 'solid');
      }
      await saveEvidenceScreenshot(
        page,
        route,
        testInfo.project.name,
        'light',
        testInfo.config.updateSnapshots === 'all',
      );
      if (route.family === 'blog-index') {
        await page.reload({ waitUntil: 'domcontentloaded' });
        await waitForStablePage(page, route);
      }
    }
    await assertKeyboardFocusAndSkipLink(page, semanticThemes.light.focus);
    assertNoUnexpectedConsoleErrors(page);

    await setTheme(page, route, 'dark');
    await assertSemanticTheme(page, 'dark');
    await assertNoHorizontalOverflow(page);
    await saveEvidenceScreenshot(
      page,
      route,
      testInfo.project.name,
      'dark',
      testInfo.config.updateSnapshots === 'all',
    );
    await assertKeyboardFocusAndSkipLink(page, semanticThemes.dark.focus);
    await assertHoverDoesNotShiftLayout(page);
    assertNoUnexpectedConsoleErrors(page);
  });
}

test('blog tag disclosure shows ten ranked tags and toggles overflow accessibly', async ({ page }, testInfo) => {
  assertNoUnexpectedConsoleErrors(page);
  const route = modernRestatoRoutes.find(({ family }) => family === 'blog-index');
  expect(route).toBeDefined();
  await openRoute(page, route!);

  const tagNav = page.locator('[data-blog-tag-nav]');
  await expect(tagNav.locator('a[data-blog-tag-link]:visible')).toHaveCount(10);
  const toggle = tagNav.locator('button.blog-tag-toggle');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(tagNav.locator('[data-blog-tag-overflow]')).toBeVisible();
  await expect(tagNav.locator('a[data-blog-tag-link]:visible')).toHaveCount(
    await tagNav.locator('a[data-blog-tag-link]').count(),
  );
  await assertNoHorizontalOverflow(page);
  await toggle.focus();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveCSS('outline-style', 'solid');
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  if (testInfo.project.name === 'desktop') {
    await saveEvidenceScreenshot(
      page,
      { ...route!, id: 'blog-tags-expanded' },
      testInfo.project.name,
      'light',
      testInfo.config.updateSnapshots === 'all',
    );
  }
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(tagNav.locator('[data-blog-tag-overflow]')).toBeHidden();

  await setTheme(page, route!, 'dark');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(tagNav.locator('[data-blog-tag-overflow]')).toBeVisible();
  await expect(tagNav.locator('a[data-blog-tag-link]:visible')).toHaveCount(
    await tagNav.locator('a[data-blog-tag-link]').count(),
  );
  await assertNoHorizontalOverflow(page);
  await toggle.focus();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveCSS('outline-style', 'solid');
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  await saveEvidenceScreenshot(
    page,
    { ...route!, id: 'blog-tags-expanded' },
    testInfo.project.name,
    'dark',
    testInfo.config.updateSnapshots === 'all',
  );
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  assertNoUnexpectedConsoleErrors(page);
});

test('Jobworld Kids remains contained at a 320px viewport', async ({ page }) => {
  const route = modernRestatoRoutes.find(({ id }) => id === 'project-jobworld-kids');
  expect(route).toBeDefined();
  await page.setViewportSize({ width: 320, height: 844 });
  await openRoute(page, route!);
  await assertNoHorizontalOverflow(page);
});

test('explicit theme choice persists across navigation and reload', async ({ page }) => {
  assertNoUnexpectedConsoleErrors(page);
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
  await page.goto('/ko/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.setItem('theme', 'light'));
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).not.toHaveClass(/\bdark\b/);

  await page.locator('#theme-toggle-btn').click();
  await expect(page.locator('html')).toHaveClass(/\bdark\b/);
  expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe('dark');

  await page.locator('main a.fc-button-primary[href="/ko/tools/"]').click();
  await expect(page).toHaveURL(/\/ko\/tools\/$/);
  await expect(page.locator('html')).toHaveClass(/\bdark\b/);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveClass(/\bdark\b/);

  await page.locator('#theme-toggle-btn').click();
  await expect(page.locator('html')).not.toHaveClass(/\bdark\b/);
  expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe('light');

  await page.goto('/en/tools/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).not.toHaveClass(/\bdark\b/);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).not.toHaveClass(/\bdark\b/);
  assertNoUnexpectedConsoleErrors(page);
});
