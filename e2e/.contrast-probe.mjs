// Temporary probe: how many nodes axe's color-contrast rule passed, failed or left incomplete.
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const base = process.argv[2];
const paths = ['/', '/browse', '/book/1', '/library', '/social', '/clubs', '/club/1', '/idle', '/battles', '/profile', '/account', '/search?q=hail', '/support', '/faq', '/apps/desktop', '/privacy'];
const browser = await chromium.launch({ channel: 'chrome' });
for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
  const page = await context.newPage();
  for (const p of paths) {
    await page.goto(base + p);
    await page.waitForTimeout(700);
    const r = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze();
    const n = (arr) => arr.reduce((s, v) => s + v.nodes.length, 0);
    const inc = r.incomplete.flatMap((v) => v.nodes.map((x) => `${x.target.join(' ')} [${x.any?.[0]?.data?.messageKey || ''}]`));
    console.log(`${viewport.width} ${p}: pass=${n(r.passes)} fail=${n(r.violations)} incomplete=${inc.length}${inc.length ? ' :: ' + inc.slice(0, 4).join(' | ') : ''}`);
    for (const v of r.violations) for (const x of v.nodes) console.log('   FAIL', x.target.join(' '), x.any?.[0]?.message);
  }
  await page.close();
}
await browser.close();
