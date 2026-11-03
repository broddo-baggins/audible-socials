import { test as base, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// 1x1 transparent PNG used in place of remote images so runs are deterministic
// and offline-safe. Real remote URLs are checked separately in assets.spec.js.
const PIXEL = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  'base64',
);

export const REMOTE_IMAGE_HOSTS = ['images.unsplash.com', 'i.pravatar.cc', 'img.youtube.com'];

export const grokReply = (content = 'Mock Grok reply for tests.') => ({
  status: 200,
  contentType: 'application/json',
  body: JSON.stringify({ content }),
});

/**
 * `guard` records every console error, uncaught exception, failed request and
 * HTTP >= 400 response. Each test fails if any were recorded, unless the test
 * whitelists them with guard.allow(regex).
 */
export const test = base.extend({
  guard: [
    async ({ page }, use, testInfo) => {
      const problems = [];
      const allowed = [];
      const isAllowed = (text) => allowed.some((re) => re.test(text));

      await page.route(
        (url) => REMOTE_IMAGE_HOSTS.includes(url.hostname),
        (route) => route.fulfill({ status: 200, contentType: 'image/png', body: PIXEL }),
      );
      await page.route(/fonts\.(googleapis|gstatic)\.com/, (route) =>
        route.fulfill({ status: 200, contentType: 'text/css', body: '' }),
      );
      // Default AI reply; tests that exercise other AI states override this route.
      await page.route('**/api/grok', (route) => route.fulfill(grokReply()));

      page.on('console', (msg) => {
        if (msg.type() === 'error') problems.push(`console.error: ${msg.text()}`);
      });
      page.on('pageerror', (err) => problems.push(`pageerror: ${err.message}`));
      page.on('requestfailed', (req) => {
        const reason = req.failure()?.errorText || '';
        // Navigations and media range requests are aborted by the browser on purpose.
        if (/ERR_ABORTED|NS_BINDING_ABORTED/.test(reason)) return;
        problems.push(`requestfailed: ${req.method()} ${req.url()} ${reason}`);
      });
      page.on('response', (res) => {
        if (res.status() >= 400) problems.push(`http ${res.status()}: ${res.request().method()} ${res.url()}`);
      });

      const guard = {
        problems,
        allow: (re) => allowed.push(re),
        clear: () => problems.splice(0),
      };
      await use(guard);

      const real = problems.filter((p) => !isAllowed(p));
      if (real.length) testInfo.annotations.push({ type: 'problems', description: real.join('\n') });
      expect(real, 'console errors / failed requests').toEqual([]);
    },
    { auto: true },
  ],
});

/** Run axe on the current page: no critical or serious violations. */
export const expectAccessible = async (page, { exclude = [] } = {}) => {
  let builder = new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    // Colour contrast belongs to the visual redesign (branch redesign/2026-11).
    .disableRules(['color-contrast']);
  for (const sel of exclude) builder = builder.exclude(sel);
  const { violations } = await builder.analyze();
  const serious = violations
    .filter((v) => ['critical', 'serious'].includes(v.impact))
    .map((v) => `${v.id} (${v.impact}): ${v.help} -> ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(', ')}`);
  expect(serious, 'axe critical/serious violations').toEqual([]);
};

/** Start every test from a clean, deterministic localStorage. */
export const freshStart = async (page, path = '/') => {
  await page.goto(path);
  await page.evaluate(() => localStorage.clear());
  await page.goto(path);
};

export { expect };
