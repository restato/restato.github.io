import { expect, test } from '@playwright/test';
import { getPublishedTools } from '../../src/data/tools';
import { supportedLanguages } from '../../src/data/tools/locales';
import { getLocalizedToolHref } from '../../src/components/tools/toolLinks';
import {
  assertNoContentUpload,
  assertNoHorizontalOverflow,
  assertNoUnexpectedConsoleErrors,
} from './fixtures';

const languages = supportedLanguages;

test('fails closed when a site console error mimics an extension URL', async ({ page }) => {
  assertNoUnexpectedConsoleErrors(page);
  await page.goto('/en/tools', { waitUntil: 'networkidle' });
  await page.evaluate(() => console.error('chrome-extension://mimic-site-error'));

  expect(() => assertNoUnexpectedConsoleErrors(page)).toThrow('chrome-extension://mimic-site-error');
});

for (const language of languages) {
  test(`${language} catalog resolves every localized tool link without mobile overflow`, async ({ page }, testInfo) => {
    const sentinelSecret = `catalog-browser-secret-${language}`;
    assertNoUnexpectedConsoleErrors(page);
    assertNoContentUpload(page, [sentinelSecret]);

    const response = await page.goto(`/${language}/tools`, { waitUntil: 'networkidle' });

    expect(response?.status()).toBe(200);
    expect(page.viewportSize()).toEqual(testInfo.project.name === 'mobile-390'
      ? { width: 390, height: 844 }
      : { width: 1440, height: 1000 });
    await expect(page.locator('main')).not.toBeEmpty();

    const expectedToolPaths = getPublishedTools()
      .map((tool) => getLocalizedToolHref(tool.slug, language))
      .sort();
    const catalogLinks = page.locator('main .grid a[href]');

    await expect(catalogLinks).toHaveCount(expectedToolPaths.length);
    expect((await catalogLinks.evaluateAll((links) => links.map((link) => link.getAttribute('href')))).sort())
      .toEqual(expectedToolPaths);

    for (const href of expectedToolPaths) {
      const linkResponse = await page.request.get(href);
      expect(linkResponse.ok(), `${language} catalog link ${href} must not be broken`).toBeTruthy();
    }

    await assertNoHorizontalOverflow(page);
    assertNoUnexpectedConsoleErrors(page);
    assertNoContentUpload(page, [sentinelSecret]);
  });
}
