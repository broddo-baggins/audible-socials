// @ts-check
import { test, expect, expectAccessible, freshStart } from './fixtures.js';

// The app follows the system theme. Axe checks colour contrast in dark mode too.
test.use({ colorScheme: 'dark' });

const DARK_ROUTES = ['/', '/browse', '/book/1', '/social', '/clubs', '/club/1', '/idle', '/profile', '/about', '/faq'];

test.describe('dark theme', () => {
  for (const path of DARK_ROUTES) {
    test(`route ${path} is accessible in dark`, async ({ page }) => {
      test.setTimeout(90_000);
      await freshStart(page, path);
      await expect(page.locator('main')).toBeVisible();
      const paper = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
      expect(paper).toBe('rgb(14, 15, 18)');
      await page.waitForLoadState('networkidle');
      await expectAccessible(page);
    });
  }
});

test('concept badge links to the portfolio project list', async ({ page }) => {
  await freshStart(page, '/');
  const badge = page.getByRole('link', { name: /concept demo with sample data/i }).first();
  await expect(badge).toHaveAttribute('href', 'https://amityogev.com/?cmd=projects');
});
