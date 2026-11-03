import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { handleGrokRequest, LIMITS, resolveModels, extractText } from '../api/grok.js';

const env = { GROK_API_KEY: 'test-key-not-real' };
let upstreamCalls;

const responsesReply = (text) => ({
  id: 'resp_1',
  status: 'completed',
  output: [
    { type: 'reasoning', encrypted_content: 'opaque' },
    { type: 'message', role: 'assistant', content: [{ type: 'output_text', text }] },
  ],
});

beforeEach(() => {
  upstreamCalls = [];
  globalThis.fetch = async (url, init) => {
    upstreamCalls.push({ url, init });
    return new Response(JSON.stringify(responsesReply('hi from mock')), { status: 200 });
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
  assert.deepEqual(await res.json(), { content: 'hi from mock', model: 'grok-4.7' });

  const [call] = upstreamCalls;
  const sent = JSON.parse(call.init.body);
  assert.equal(call.url, 'https://api.x.ai/v1/responses');
  assert.equal(call.init.headers.Authorization, 'Bearer test-key-not-real');
  assert.equal(sent.max_output_tokens, LIMITS.maxTokens);
  assert.equal(sent.temperature, 1);
  assert.equal(sent.model, 'grok-4.7');
  assert.equal(sent.store, false);
  assert.deepEqual(sent.input, [{ role: 'user', content: 'Hello' }]);
  assert.equal(sent.messages, undefined);
  assert.equal(sent.max_tokens, undefined);
});

test('resolveModels honours GROK_MODEL and GROK_FALLBACK_MODELS', () => {
  assert.deepEqual(resolveModels({}), ['grok-4.7', 'grok-4.3']);
  assert.deepEqual(resolveModels({ GROK_MODEL: 'grok-4.6' }), ['grok-4.6', 'grok-4.3']);
  assert.deepEqual(resolveModels({ GROK_FALLBACK_MODELS: ' grok-4.6 , ,grok-4.7' }), ['grok-4.7', 'grok-4.6']);
  assert.deepEqual(resolveModels({ GROK_FALLBACK_MODELS: '' }), ['grok-4.7']);
  assert.deepEqual(resolveModels({ GROK_MODEL: 'bad model!', GROK_FALLBACK_MODELS: 'x/y' }), ['grok-4.7']);
});

test('extractText joins output_text parts and ignores other items', () => {
  assert.equal(extractText(responsesReply('abc')), 'abc');
  assert.equal(extractText({ output_text: 'direct' }), 'direct');
  assert.equal(extractText({ output: [{ type: 'reasoning' }] }), null);
  assert.equal(extractText(null), null);
});

test('falls back to the next model when the primary is unavailable', async (t) => {
  t.mock.method(console, 'error', () => {});
  globalThis.fetch = async (url, init) => {
    const { model } = JSON.parse(init.body);
    upstreamCalls.push(model);
    if (model === 'grok-4.7') return new Response('{"error":"model not found"}', { status: 404 });
    return new Response(JSON.stringify(responsesReply('from fallback')), { status: 200 });
  };
  const res = await handleGrokRequest(req(ok), env);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { content: 'from fallback', model: 'grok-4.3' });
  assert.deepEqual(upstreamCalls, ['grok-4.7', 'grok-4.3']);
});

test('reports upstream_unavailable when every model fails', async (t) => {
  t.mock.method(console, 'error', () => {});
  globalThis.fetch = async (url, init) => {
    upstreamCalls.push(JSON.parse(init.body).model);
    if (upstreamCalls.length === 1) throw new DOMException('timed out', 'TimeoutError');
    return new Response('{}', { status: 503 });
  };
  const res = await handleGrokRequest(req(ok), { ...env, GROK_FALLBACK_MODELS: 'grok-4.6,grok-4.3' });
  assert.equal(res.status, 502);
  assert.equal((await res.json()).error, 'upstream_unavailable');
  assert.deepEqual(upstreamCalls, ['grok-4.7', 'grok-4.6', 'grok-4.3']);
});

test('does not try fallbacks on auth or rate-limit errors', async (t) => {
  t.mock.method(console, 'error', () => {});
  for (const [status, expected] of [[401, 502], [403, 502], [429, 429]]) {
    upstreamCalls = [];
    globalThis.fetch = async (url, init) => {
      upstreamCalls.push(JSON.parse(init.body).model);
      return new Response('{}', { status });
    };
    const res = await handleGrokRequest(req(ok), env);
    assert.equal(res.status, expected, String(status));
    assert.equal(upstreamCalls.length, 1, String(status));
  }
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
