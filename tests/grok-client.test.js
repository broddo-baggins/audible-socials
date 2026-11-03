import { test } from 'node:test';
import assert from 'node:assert/strict';
import { callGrokAPI, callGrokAPIWithRetry } from '../src/utils/grokAPI.js';

const messages = [{ role: 'user', content: 'Can you recommend a book?' }];
const reply = (status, body) => async () => new Response(JSON.stringify(body), { status });

test('returns the proxy content on success', async () => {
  globalThis.fetch = reply(200, { content: 'live answer', model: 'grok-4.7' });
  assert.equal(await callGrokAPI(messages), 'live answer');
});

test('degrades to mock replies when no key or no model is available', async (t) => {
  t.mock.method(console, 'warn', () => {});
  for (const [status, body] of [[503, { error: 'not_configured' }], [502, { error: 'upstream_unavailable' }], [404, {}]]) {
    globalThis.fetch = reply(status, body);
    const text = await callGrokAPI(messages);
    assert.match(text, /recommend/i, `${status} ${body.error}`);
  }
});

test('degrades to mock after retries when the network is down', async (t) => {
  t.mock.method(console, 'warn', () => {});
  let calls = 0;
  globalThis.fetch = async () => {
    calls += 1;
    throw new TypeError('Failed to fetch');
  };
  const text = await callGrokAPIWithRetry(messages);
  assert.match(text, /recommend/i);
  assert.equal(calls, 3);
});

test('still surfaces client errors such as 400', async (t) => {
  t.mock.method(console, 'warn', () => {});
  globalThis.fetch = reply(400, { error: 'Message too long' });
  await assert.rejects(callGrokAPIWithRetry(messages), { status: 400 });
});
