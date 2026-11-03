// @ts-check
import { defineConfig, devices } from '@playwright/test';

// E2E runs against the production build served by `vite preview`, which also
// serves /api/grok and the security headers from vercel.json (see vite.config.js).
const PORT = Number(process.env.E2E_PORT || 4711);

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.E2E_WORKERS ? Number(process.env.E2E_WORKERS) : 4,
  reporter: [['list']],
  timeout: 30_000,
  expect: { timeout: 7_000 },
  use: {
    baseURL: `http://localhost:${PORT}`,
    // Use the installed Google Chrome so no browser download is needed.
    channel: process.env.E2E_CHANNEL ?? 'chrome',
    trace: 'retain-on-failure',
    serviceWorkers: 'block',
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 900 } } },
    {
      name: 'mobile',
      use: {
        ...devices['iPhone 13'],
        viewport: { width: 390, height: 844 },
        defaultBrowserType: 'chromium',
      },
    },
  ],
  webServer: {
    command: `npm run build && npx vite preview --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 180_000,
    env: { GROK_API_KEY: '' },
  },
});
