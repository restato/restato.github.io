import { expect, test } from '@playwright/test';
import { siteContent, sitePageKeys } from '../../src/data/site-content';
import { assertNoUnexpectedConsoleErrors } from './fixtures';

test('non-English article derives and locks its document language', async ({ page }) => {
  assertNoUnexpectedConsoleErrors(page);
  const response = await page.goto('/blog/welcome-to-jekyll/', { waitUntil: 'domcontentloaded' });

  expect(response?.ok()).toBeTruthy();
  await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
  const skipLink = page.locator('a[href="#main-content"]');
  await expect(skipLink).toHaveText('본문으로 건너뛰기');
  await page.evaluate(() => {
    localStorage.setItem('lang', 'fr');
    window.dispatchEvent(new CustomEvent('languageChange', { detail: 'fr' }));
  });
  await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
  await expect(skipLink).toHaveText('본문으로 건너뛰기');
  assertNoUnexpectedConsoleErrors(page);
});

for (const route of ['/', '/404/']) {
  test(`${route} synchronizes its skip-link label on client locale changes`, async ({ page }) => {
    assertNoUnexpectedConsoleErrors(page);
    const response = await page.goto(route, { waitUntil: 'domcontentloaded' });

    expect(response?.ok()).toBeTruthy();
    const skipLink = page.locator('a[href="#main-content"]');
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('languageChange', { detail: 'fr' }));
    });
    await expect(skipLink).toHaveText('Aller au contenu principal');
    assertNoUnexpectedConsoleErrors(page);
  });
}

test('desktop and mobile language controls route every trust family through the shared predicate', async ({ page }, testInfo) => {
  assertNoUnexpectedConsoleErrors(page);
  const isMobile = testInfo.project.name === 'mobile-390';

  for (const family of sitePageKeys) {
    await page.goto(`/en/${family}/`, { waitUntil: 'domcontentloaded' });
    if (isMobile) {
      await page.locator('#mobile-menu-btn').click();
      await Promise.all([
        page.waitForURL(new RegExp(`/fr/${family}/?$`)),
        page.locator('[data-lang-mobile-option="fr"]').click(),
      ]);
    } else {
      await page.locator('#lang-trigger').click();
      await Promise.all([
        page.waitForURL(new RegExp(`/fr/${family}/?$`)),
        page.locator('[data-lang-option="fr"]').click(),
      ]);
    }

    await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(siteContent[family].fr.title);
  }
  assertNoUnexpectedConsoleErrors(page);
});

const lockedEnglishRoutes = [
  '/projects/quick-issue/',
  '/projects/pastedock/',
  '/projects/pastedock/pricing/',
  '/projects/pastedock/privacy/',
  '/projects/pastedock/refund/',
  '/projects/pastedock/terms/',
];

for (const route of lockedEnglishRoutes) {
  test(`${route} stays English across stored and event locale changes`, async ({ page }) => {
    assertNoUnexpectedConsoleErrors(page);
    await page.addInitScript(() => localStorage.setItem('lang', 'ko'));
    const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
    expect(response?.ok()).toBeTruthy();

    const skipLink = page.locator('a[href="#main-content"]');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(skipLink).toHaveText('Skip to main content');
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'en_US');

    await page.evaluate(() => {
      localStorage.setItem('lang', 'fr');
      window.dispatchEvent(new CustomEvent('languageChange', { detail: 'fr' }));
    });
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(skipLink).toHaveText('Skip to main content');
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'en_US');
    assertNoUnexpectedConsoleErrors(page);
  });
}

test('anonymous-chat JSON-LD reuses its trailing-slash canonical URL exactly', async ({ page }) => {
  const response = await page.goto('/en/anonymous-chat/', { waitUntil: 'domcontentloaded' });
  expect(response?.ok()).toBeTruthy();

  const metadata = await page.evaluate(() => {
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href;
    const schemas = [...document.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]')]
      .map((script) => JSON.parse(script.textContent || '{}'));
    const application = schemas.find((schema) => schema['@type'] === 'WebApplication');
    const breadcrumbs = schemas.find((schema) => schema['@type'] === 'BreadcrumbList');
    const finalBreadcrumb = breadcrumbs?.itemListElement?.at(-1)?.item;
    return { canonical, applicationUrl: application?.url, finalBreadcrumb };
  });

  expect(metadata.canonical).toMatch(/\/en\/anonymous-chat\/$/);
  expect(metadata.applicationUrl).toBe(metadata.canonical);
  expect(metadata.finalBreadcrumb).toBe(metadata.canonical);
});
