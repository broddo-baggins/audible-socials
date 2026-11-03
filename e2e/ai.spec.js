import { test, expect, expectAccessible, freshStart, grokReply } from './fixtures.js';

// The AI assistant talks to /api/grok. The guard fixture answers that route
// with a plain-text reply; tests here override it to cover each AI state.
const json = (status, body) => ({ status, contentType: 'application/json', body: JSON.stringify(body) });

const AI_RECS = JSON.stringify([
  { title: 'Project Hail Mary', author: 'Andy Weir', reason: 'Science and humour, like your recent listens', match_score: 97, reason_type: 'listening_history' },
  { title: 'Dune', author: 'Frank Herbert', reason: 'A classic your friends love', match_score: 92, reason_type: 'friends_activity' },
]);

const openAssistant = async (page, tab) => {
  await page.getByRole('button', { name: 'Open AI Assistant' }).click();
  const panel = page.getByRole('heading', { name: 'AI Reading Assistant' }).locator('xpath=ancestor::div[contains(@class,"fixed")][1]');
  await expect(panel).toBeVisible();
  if (tab) await panel.getByRole('button', { name: tab }).click();
  return panel;
};

const recommendationCards = (panel) => panel.locator('[role="link"]');

test.describe('AI recommendations', () => {
  test('shows live Grok picks matched to the catalog and opens a book', async ({ page }) => {
    await page.route('**/api/grok', (route) => route.fulfill(grokReply(`Here you go:\n${AI_RECS}`)));
    await freshStart(page);
    const panel = await openAssistant(page);
    await expect(panel.getByText('Grok AI')).toBeVisible();
    await expect(recommendationCards(panel)).toHaveCount(2);
    await expect(panel.getByText('Science and humour, like your recent listens')).toBeVisible();
    await expectAccessible(page);

    await recommendationCards(panel).first().click();
    await expect(page).toHaveURL(/\/book\/\d+$/);
  });

  test('cards work from the keyboard', async ({ page }) => {
    await page.route('**/api/grok', (route) => route.fulfill(grokReply(AI_RECS)));
    await freshStart(page);
    const panel = await openAssistant(page);
    await recommendationCards(panel).first().focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/book\/\d+$/);
  });

  for (const [name, reply] of [
    ['server key not configured', json(503, { error: 'not_configured' })],
    ['no Grok model available', json(502, { error: 'upstream_unavailable', status: 404 })],
    ['plain-text mock reply', grokReply('I would recommend something great!')],
  ]) {
    test(`falls back to local picks when ${name}`, async ({ page, guard }) => {
      guard.allow(/http 50[23]: POST .*\/api\/grok/);
      await page.route('**/api/grok', (route) => route.fulfill(reply));
      await freshStart(page);
      const panel = await openAssistant(page);
      await expect(recommendationCards(panel).first()).toBeVisible();
      expect(await recommendationCards(panel).count()).toBeGreaterThanOrEqual(3);
      await expect(panel.getByText(/Failed to load/)).toBeHidden();
    });
  }

  test('shows a loading state, then offline mode reloads local picks', async ({ page }) => {
    let release;
    const gate = new Promise((resolve) => { release = resolve; });
    await page.route('**/api/grok', async (route) => {
      await gate;
      await route.fulfill(grokReply(AI_RECS));
    });
    await freshStart(page);
    const panel = await openAssistant(page);
    await expect(panel.locator('.animate-pulse').first()).toBeVisible();
    release();
    await expect(recommendationCards(panel)).toHaveCount(2);

    await panel.getByRole('button', { name: 'Switch to offline mode' }).click();
    await expect(panel.getByText('Grok AI')).toBeHidden();
    await expect(recommendationCards(panel).first()).toBeVisible();
    expect(await recommendationCards(panel).count()).toBeGreaterThanOrEqual(3);

    await panel.getByRole('button', { name: 'Refresh recommendations' }).click();
    await expect(recommendationCards(panel).first()).toBeVisible();
  });
});

test.describe('AI book chat', () => {
  test('sends a question and shows the Grok answer', async ({ page }) => {
    const sent = [];
    await page.route('**/api/grok', async (route) => {
      sent.push(route.request().postDataJSON());
      await route.fulfill(grokReply('Dune is about politics, ecology and prophecy.'));
    });
    await freshStart(page);
    const panel = await openAssistant(page, 'Ask About Books');
    const input = panel.getByRole('textbox', { name: 'Ask about any book' });
    await input.fill('What is Dune about?');
    await panel.getByRole('button', { name: 'Send message' }).click();
    await expect(panel.getByText('Dune is about politics, ecology and prophecy.')).toBeVisible();
    await expect(input).toHaveValue('');
    await expectAccessible(page);

    // The recommendations tab also posts on open; pick the chat request.
    const body = sent.find((b) => b.messages.at(-1).content === 'What is Dune about?');
    expect(body.messages.at(-1)).toEqual({ role: 'user', content: 'What is Dune about?' });
    expect(body.messages[0].role).toBe('system');
    // The model is chosen on the server, never by the browser.
    expect(body.model).toBeUndefined();
  });

  test('Enter sends, and the send button is disabled for empty input', async ({ page }) => {
    await freshStart(page);
    const panel = await openAssistant(page, 'Ask About Books');
    await expect(panel.getByRole('button', { name: 'Send message' })).toBeDisabled();
    await panel.getByRole('textbox', { name: 'Ask about any book' }).fill('Recommend me something');
    await page.keyboard.press('Enter');
    await expect(panel.getByText('Mock Grok reply for tests.')).toBeVisible();
  });

  test('answers with mock replies when no key is configured', async ({ page, guard }) => {
    guard.allow(/http 503: POST .*\/api\/grok/);
    await page.route('**/api/grok', (route) => route.fulfill(json(503, { error: 'not_configured' })));
    await freshStart(page);
    const panel = await openAssistant(page, 'Ask About Books');
    await panel.getByRole('textbox', { name: 'Ask about any book' }).fill('Can you recommend a book?');
    await panel.getByRole('button', { name: 'Send message' }).click();
    await expect(panel.getByText(/I'd recommend 'The Name of the Wind'/)).toBeVisible();
  });

  test('shows an error message when the request is rejected', async ({ page, guard }) => {
    guard.allow(/http 400: POST .*\/api\/grok/);
    guard.allow(/AI Chat Error|Error getting AI (answer|recommendations)/);
    await page.route('**/api/grok', (route) => route.fulfill(json(400, { error: 'Message too long' })));
    await freshStart(page);
    const panel = await openAssistant(page, 'Ask About Books');
    await panel.getByRole('textbox', { name: 'Ask about any book' }).fill('Hello?');
    await panel.getByRole('button', { name: 'Send message' }).click();
    await expect(panel.getByText(/Sorry, I encountered an error/)).toBeVisible();
    await expect(panel.getByText(/Message too long/)).toBeVisible();

    await panel.getByRole('button', { name: 'Reset chat' }).click();
    await expect(panel.getByText(/Sorry, I encountered an error/)).toBeHidden();
  });

  test('closes and reopens the assistant', async ({ page }) => {
    await freshStart(page);
    await openAssistant(page);
    await page.getByRole('button', { name: 'Close AI Assistant' }).click();
    await expect(page.getByRole('heading', { name: 'AI Reading Assistant' })).toBeHidden();
    await expect(page.getByRole('button', { name: 'Open AI Assistant' })).toBeVisible();
  });
});
