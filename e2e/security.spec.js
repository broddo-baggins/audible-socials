// @ts-check
import { test, expect, freshStart } from './fixtures.js';

// vite preview serves the headers from vercel.json (see vite.config.js), so
// these checks cover the production configuration.
const REQUIRED = {
  'content-security-policy': /default-src 'self'.*frame-ancestors 'none'/,
  'strict-transport-security': /max-age=\d+/,
  'x-content-type-options': /^nosniff$/,
  'x-frame-options': /^DENY$/,
  'referrer-policy': /strict-origin-when-cross-origin/,
  'permissions-policy': /camera=\(\)/,
};

test.describe('security headers', () => {
  for (const path of ['/', '/club/1', '/assets-do-not-exist.js']) {
    test(`sent on ${path}`, async ({ request }) => {
      const res = await request.get(path);
      const headers = res.headers();
      for (const [name, pattern] of Object.entries(REQUIRED)) {
        expect(headers[name], name).toMatch(pattern);
      }
    });
  }

  test('script-src allows no inline or eval code', async ({ request }) => {
    const csp = (await request.get('/')).headers()['content-security-policy'];
    const scriptSrc = csp.split(';').find((d) => d.trim().startsWith('script-src'));
    expect(scriptSrc).not.toMatch(/unsafe-inline|unsafe-eval/);
  });

  test('the app runs under the CSP with no violations', async ({ page }) => {
    const violations = [];
    await page.exposeFunction('reportCsp', (v) => violations.push(v));
    await page.addInitScript(() => {
      document.addEventListener('securitypolicyviolation', (e) =>
        /** @type {any} */ (window).reportCsp(`${e.violatedDirective} ${e.blockedURI}`));
    });
    for (const path of ['/', '/book/1', '/club/1', '/battles', '/profile']) {
      await freshStart(page, path);
      await expect(page.locator('main h1, main h2').first()).toBeVisible();
    }
    expect(violations).toEqual([]);
  });
});

test.describe('/api/grok input validation', () => {
  const post = (request, data, headers = {}) =>
    request.post('/api/grok', {
      data,
      headers: { origin: test.info().project.use.baseURL, ...headers },
      failOnStatusCode: false,
    });

  test('rejects cross-origin, bad and oversized payloads', async ({ request, baseURL }) => {
    expect((await post(request, { messages: [{ role: 'user', content: 'hi' }] }, { origin: 'https://evil.example' })).status()).toBe(403);
    expect((await post(request, { messages: [] })).status()).toBe(400);
    expect((await post(request, { messages: [{ role: 'tool', content: 'x' }] })).status()).toBe(400);
    expect((await post(request, { messages: [{ role: 'user', content: 'x'.repeat(40_000) }] })).status()).toBe(413);
    expect((await request.get(`${baseURL}/api/grok`, { failOnStatusCode: false })).status()).toBe(405);
  });

  test('reports not_configured without a key, and never echoes secrets', async ({ request }) => {
    const res = await post(request, { messages: [{ role: 'user', content: 'hi' }] });
    expect(res.status()).toBe(503);
    expect(await res.json()).toEqual({ error: 'not_configured' });
    expect(res.headers()['cache-control']).toBe('no-store');
  });
});
