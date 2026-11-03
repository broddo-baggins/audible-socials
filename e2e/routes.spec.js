// @ts-check
import { test, expect, expectAccessible, freshStart } from './fixtures.js';

// Every route declared in src/App.jsx, with a real id where the route takes one.
export const ROUTES = [
  '/', '/library', '/browse', '/originals', '/podcasts', '/book/1', '/search', '/search?q=hail',
  '/account', '/settings', '/help', '/notifications', '/social', '/idle', '/battles',
  '/clubs', '/clubs/friends', '/clubs/activity', '/club/1', '/profile', '/friend/1/library',
  '/about', '/careers', '/press', '/blog',
  '/support', '/faq', '/contact', '/accessibility',
  '/terms', '/privacy', '/cookies', '/content-policy',
  '/apps/ios', '/apps/android', '/apps/desktop',
];

test.describe('every route renders cleanly', () => {
  for (const path of ROUTES) {
    test(`route ${path}`, async ({ page }) => {
      test.setTimeout(90_000);
      await freshStart(page, path);
      const main = page.locator('main');
      await expect(main).toBeVisible();
      // The lazy-route spinner must give way to real content.
      await expect(main.locator('.animate-spin').first()).toBeHidden();
      await expect(main.locator('h1, h2').first()).toBeVisible();
      await page.waitForLoadState('networkidle');
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, 'no horizontal page scroll').toBeLessThanOrEqual(1);
      await expectAccessible(page);
    });
  }
});

test.describe('not-found and bad ids', () => {
  test('unknown path shows a not-found page with a way home', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');
    await expect(page.getByRole('heading', { name: /not found/i })).toBeVisible();
    await page.getByRole('link', { name: /home/i }).first().click();
    await expect(page).toHaveURL(/\/$/);
  });

  test('unknown friend id goes back to the friends list', async ({ page }) => {
    await page.goto('/friend/999999/library');
    await expect(page).toHaveURL(/\/clubs\/friends$/);
  });

  for (const path of ['/book/999999', '/club/999999']) {
    test(`unknown id ${path} shows a friendly empty state`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('main')).toContainText(/not found/i);
    });
  }
});
