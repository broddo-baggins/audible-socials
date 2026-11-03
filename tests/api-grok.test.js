import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { handleGrokRequest, LIMITS } from '../api/grok.js';

const env = { GROK_API_KEY: 'test-key-not-real' };
let upstreamCalls;

beforeEach(() => {
  upstreamCalls = [];
  globalThis.fetch = async (url, init) => {
    upstreamCalls.push({ url, init });
    return new Response(JSON.stringify({ choices: [{ message: { content: 'hi from mock' } }] }), { status: 200 });
  };
});

const req = (body, headers = {}, method = 'POST') =>
  new Request('https://app.example/api/grok', {
    method,
    headers: { host: 'app.example', origin: 'https://app.example', 'content-type': 'application/json', ...headers },
    body: method === 'POST' ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined,
  });

const ok = { messages: [{ role: 'user', content: 'Hello' }], maxTokens: 99999, temperature: 9 };

test('forwards a valid same-origin request with server key and clamped options', async () => {
  const res = await handleGrokRequest(req(ok), env);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { content: 'hi from mock' });

  const [call] = upstreamCalls;
  const sent = JSON.parse(call.init.body);
  assert.equal(call.url, 'https://api.x.ai/v1/chat/completions');
  assert.equal(call.init.headers.Authorization, 'Bearer test-key-not-real');
  assert.equal(sent.max_tokens, LIMITS.maxTokens);
  assert.equal(sent.temperature, 1.5);
  assert.equal(sent.model, 'grok-3-mini');
});

test('rejects bad requests without calling xAI', async () => {
  const cases = [
    ['GET', req(null, {}, 'GET'), 405],
    ['cross origin', req(ok, { origin: 'https://evil.example' }), 403],
    ['no origin', req(ok, { origin: '' }), 403],
    ['sec-fetch-site cross-site', req(ok, { 'sec-fetch-site': 'cross-site' }), 403],
    ['wrong content-type', req(ok, { 'content-type': 'text/plain' }), 415],
    ['oversize body', req({ messages: [{ role: 'user', content: 'x'.repeat(LIMITS.maxBodyBytes) }] }), 413],
    ['bad json', req('{nope'), 400],
    ['bad role', req({ messages: [{ role: 'tool', content: 'x' }] }), 400],
    ['empty messages', req({ messages: [] }), 400],
    ['too many messages', req({ messages: Array(LIMITS.maxMessages + 1).fill({ role: 'user', content: 'x' }) }), 400],
    ['too long total', req({ messages: Array(3).fill({ role: 'user', content: 'x'.repeat(9000) }) }), 400],
  ];
  for (const [name, request, status] of cases) {
    const res = await handleGrokRequest(request, env);
    assert.equal(res.status, status, name);
  }
  assert.equal(upstreamCalls.length, 0);
});

test('reports not_configured when GROK_API_KEY is missing', async () => {
  const res = await handleGrokRequest(req(ok), {});
  assert.equal(res.status, 503);
  assert.deepEqual(await res.json(), { error: 'not_configured' });
});

test('maps upstream errors without echoing the key', async (t) => {
  t.mock.method(console, 'error', () => {});
  globalThis.fetch = async () => new Response('{"error":"bad key"}', { status: 401 });
  const res = await handleGrokRequest(req(ok), env);
  assert.equal(res.status, 502);
  assert.ok(!(await res.text()).includes('test-key-not-real'));
});
