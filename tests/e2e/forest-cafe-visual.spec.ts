import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { expect, test, type Page } from '@playwright/test';
import {
  assertNoHorizontalOverflow,
  assertNoUnexpectedConsoleErrors,
} from './fixtures';
import {
  forestCafeAlwaysMaskedSelectors,
  forestCafeRoutes,
  type ForestCafeRoute,
} from './forest-cafe-routes';

const screenshotDirectory = path.resolve(
  process.cwd(),
  'docs/superpowers/reports/assets/forest-cafe',
);
const visualDiffTolerance = 0.001;
const forestCafeFixedTime = '2026-07-20T12:00:00.000+09:00';

const semanticThemes = {
  light: {
    surfacePage: '#f4efe5',
    textPrimary: '#203027',
    bodyBackground: 'rgb(244, 239, 229)',
    bodyText: 'rgb(32, 48, 39)',
    focus: 'rgb(47, 118, 88)',
  },
  dark: {
    surfacePage: '#111814',
    textPrimary: '#edf2ea',
    bodyBackground: 'rgb(17, 24, 20)',
    bodyText: 'rgb(237, 242, 234)',
    focus: 'rgb(138, 185, 157)',
  },
} as const;

async function installStableRouteState(page: Page, route: ForestCafeRoute) {
  await page.clock.setFixedTime(forestCafeFixedTime);
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

async function waitForStablePage(page: Page, route: ForestCafeRoute) {
  await expect(page.locator('main#main-content')).not.toBeEmpty();
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h1')).toBeVisible();
  const loadedFontCount = await page.evaluate(async () => {
    const loadedFonts = await document.fonts.load('400 16px D2Coding');
    await document.fonts.ready;
    return loadedFonts.length;
  });
  expect(loadedFontCount, 'The self-hosted D2Coding face must load').toBeGreaterThan(0);
  await expect.poll(
    () => page.locator('astro-island[client="load"][ssr]').count(),
    { message: 'All client:load islands must finish hydrating before interaction checks' },
  ).toBe(0);
  if (route.forceDirection) {
    await expect(page.locator('html')).toHaveAttribute('dir', route.forceDirection);
  }
}

async function openRoute(page: Page, route: ForestCafeRoute) {
  await installStableRouteState(page, route);
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
  const response = await page.goto(route.path, { waitUntil: 'domcontentloaded' });

  expect(response?.ok(), `${route.path} must resolve`).toBeTruthy();
  await waitForStablePage(page, route);
  expect(await page.evaluate(() => sessionStorage.getItem('restato_bookmark_dismissed')))
    .toBe('true');
}

async function setTheme(page: Page, route: ForestCafeRoute, theme: 'light' | 'dark') {
  await page.evaluate((nextTheme) => {
    localStorage.setItem('theme', nextTheme);
    history.replaceState(null, '', `${location.pathname}${location.search}`);
  }, theme);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await waitForStablePage(page, route);
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
  expect(actual.fontFamily.split(',')[0].replaceAll(/['"]/g, '').trim()).toBe('D2Coding');
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
  route: ForestCafeRoute,
  projectName: string,
  theme: 'light' | 'dark',
) {
  await mkdir(screenshotDirectory, { recursive: true });
  const maskSelectors = [
    ...forestCafeAlwaysMaskedSelectors,
    ...(route.visualMasks ?? []),
  ];
  const screenshot = await page.screenshot({
    path: path.join(screenshotDirectory, `${route.id}-${projectName}-${theme}.png`),
    animations: 'disabled',
    caret: 'hide',
    mask: maskSelectors.map((selector) => page.locator(selector)),
  });
  expect(screenshot.byteLength).toBeGreaterThan(1_000);
  expect(screenshot).toMatchSnapshot(
    `${route.id}-${projectName}-${theme}.png`,
    { maxDiffPixelRatio: visualDiffTolerance },
  );
}

for (const route of forestCafeRoutes) {
  test(`${route.name} satisfies the Forest Cafe visual and interaction contract`, async ({ page }, testInfo) => {
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
      await saveEvidenceScreenshot(page, route, testInfo.project.name, 'light');
    }
    await assertKeyboardFocusAndSkipLink(page, semanticThemes.light.focus);
    assertNoUnexpectedConsoleErrors(page);

    await setTheme(page, route, 'dark');
    await assertSemanticTheme(page, 'dark');
    await assertNoHorizontalOverflow(page);
    await saveEvidenceScreenshot(page, route, testInfo.project.name, 'dark');
    await assertKeyboardFocusAndSkipLink(page, semanticThemes.dark.focus);
    await assertHoverDoesNotShiftLayout(page);
    assertNoUnexpectedConsoleErrors(page);
  });
}

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
