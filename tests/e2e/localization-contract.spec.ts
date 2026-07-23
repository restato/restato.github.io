import { expect, test } from '@playwright/test';
import { assertNoUnexpectedConsoleErrors } from './fixtures';

test('non-English article derives and locks its document language', async ({ page }) => {
  assertNoUnexpectedConsoleErrors(page);
  const response = await page.goto('/blog/welcome-to-jekyll/', { waitUntil: 'domcontentloaded' });

  expect(response?.ok()).toBeTruthy();
  await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
  await page.evaluate(() => {
    window.dispatchEvent(new CustomEvent('languageChange', { detail: 'fr' }));
  });
  await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
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
