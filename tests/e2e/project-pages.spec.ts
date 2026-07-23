import { expect, test } from '@playwright/test';
import {
  assertNoHorizontalOverflow,
  assertNoUnexpectedConsoleErrors,
} from './fixtures';

test('gallery dialog traps focus, closes with Escape, and restores its opener', async ({ page }) => {
  assertNoUnexpectedConsoleErrors(page);
  const response = await page.goto('/projects/gallery/', { waitUntil: 'domcontentloaded' });
  expect(response?.ok()).toBeTruthy();

  const firstOpener = page.locator('[data-gallery-item]').first();
  const dialog = page.locator('#gallery-dialog');
  const closeButton = dialog.locator('[data-gallery-close]');
  const previousButton = dialog.locator('[data-gallery-previous]');
  const nextButton = dialog.locator('[data-gallery-next]');

  await firstOpener.focus();
  await page.keyboard.press('Enter');
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute('role', 'dialog');
  await expect(dialog).toHaveAttribute('aria-modal', 'true');
  await expect(dialog).toHaveAccessibleName('이미지 크게 보기');
  await expect(closeButton).toBeFocused();

  const dialogImage = dialog.locator('#gallery-dialog-image');
  await expect(dialogImage).toHaveAttribute('src', '/images/gallery/seed-1-800x600.jpg');
  await nextButton.click();
  await expect(dialogImage).toHaveAttribute('src', '/images/gallery/seed-2-800x600.jpg');
  await previousButton.click();
  await expect(dialogImage).toHaveAttribute('src', '/images/gallery/seed-1-800x600.jpg');
  await page.keyboard.press('ArrowRight');
  await expect(dialogImage).toHaveAttribute('src', '/images/gallery/seed-2-800x600.jpg');
  await page.keyboard.press('ArrowLeft');
  await expect(dialogImage).toHaveAttribute('src', '/images/gallery/seed-1-800x600.jpg');

  await closeButton.focus();
  await page.keyboard.press('Shift+Tab');
  await expect(nextButton).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(closeButton).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(firstOpener).toBeFocused();

  await page.keyboard.press('Space');
  await expect(dialog).toBeVisible();
  await expect(closeButton).toBeFocused();
  await previousButton.focus();
  await page.keyboard.press('Tab');
  await expect(nextButton).toBeFocused();
  await closeButton.click();
  await expect(firstOpener).toBeFocused();
  assertNoUnexpectedConsoleErrors(page);
});

test('project section flow stays deliberate and jobworld connectors never overflow', async ({ page }) => {
  assertNoUnexpectedConsoleErrors(page);

  for (const width of [390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of [
      '/projects/gallery/',
      '/projects/jobworld-kids/',
      '/projects/local-price-extractor/',
      '/projects/quick-issue/',
      '/projects/roomfit-3d/',
    ]) {
      const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
      expect(response?.ok(), `${width}px ${route} response`).toBeTruthy();
      await assertNoHorizontalOverflow(page);
      const gaps = await page.locator('.fc-section-flow').first().evaluate((container) => {
        const children = [...container.children].filter((child) => {
          const style = getComputedStyle(child);
          return style.display !== 'none' && style.position !== 'fixed';
        });
        return children.slice(1).map((child, index) => {
          const previous = children[index].getBoundingClientRect();
          const current = child.getBoundingClientRect();
          return current.top - previous.bottom;
        });
      });
      expect(gaps.length, `${width}px ${route} must expose section gaps`).toBeGreaterThan(0);
      for (const gap of gaps) {
        expect(gap, `${width}px ${route} section gap`).toBeGreaterThanOrEqual(32);
      }
    }
  }

  assertNoUnexpectedConsoleErrors(page);
});

test('identified project text pairs retain WCAG AA contrast in both themes', async ({ page }) => {
  const contrast = (selector: string) => page.locator(selector).evaluate((element) => {
    const parse = (color: string) => color.match(/\d+(?:\.\d+)?/g)?.slice(0, 3).map(Number) ?? [];
    const luminance = (color: string) => {
      const [red, green, blue] = parse(color).map((channel) => {
        const normalized = channel / 255;
        return normalized <= 0.03928
          ? normalized / 12.92
          : ((normalized + 0.055) / 1.055) ** 2.4;
      });
      return (0.2126 * red) + (0.7152 * green) + (0.0722 * blue);
    };
    const style = getComputedStyle(element);
    const background = style.backgroundColor === 'rgba(0, 0, 0, 0)'
      ? getComputedStyle(document.body).backgroundColor
      : style.backgroundColor;
    const values = [luminance(style.color), luminance(background)].sort((a, b) => b - a);
    return (values[0] + 0.05) / (values[1] + 0.05);
  });

  for (const theme of ['light', 'dark'] as const) {
    await page.addInitScript((nextTheme) => localStorage.setItem('theme', nextTheme), theme);
    await page.goto('/projects/local-price-extractor/', { waitUntil: 'domcontentloaded' });
    expect(await contrast('[data-local-price-primary-cta]')).toBeGreaterThanOrEqual(4.5);

    await page.goto('/projects/roomfit-3d/', { waitUntil: 'domcontentloaded' });
    expect(await contrast('[data-roomfit-eyebrow]')).toBeGreaterThanOrEqual(4.5);
  }
});
