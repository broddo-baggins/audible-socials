// @ts-check
/**
 * Grok (xAI) proxy - Vercel serverless function
 *
 * The browser posts chat messages to /api/grok and this function calls xAI
 * with GROK_API_KEY. The key is a server-only env var (no VITE_ prefix), so
 * it never reaches the client bundle.
 *
 * Guards: POST + JSON only, same-origin requests only, request body size cap,
 * message count/length limits, and a server-chosen model and token ceiling.
 *
 * Upstream is xAI's Responses API (Chat Completions is legacy). The model is
 * GROK_MODEL (default grok-4.7); if it is unavailable the function tries each
 * model in GROK_FALLBACK_MODELS (comma separated, default grok-4.3) in turn.
 */

const XAI_URL = 'https://api.x.ai/v1/responses';
export const DEFAULT_MODEL = 'grok-4.7';
export const DEFAULT_FALLBACK_MODELS = ['grok-4.3'];
const MODEL_ID = /^[a-z0-9][a-z0-9._-]{0,63}$/i;

export const LIMITS = {
  maxBodyBytes: 32 * 1024,
  maxMessages: 40,
  maxMessageChars: 12000,
  maxTotalChars: 24000,
  maxTokens: 1000,
  // Total time budget across the primary model and its fallbacks.
  upstreamTimeoutMs: 25000,
};

const ALLOWED_ROLES = new Set(['system', 'user', 'assistant']);

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });

/**
 * Accept only requests whose Origin matches the host serving this function.
 * Browsers always send Origin on a cross-origin or POST fetch, so a missing
 * Origin is treated as not same-origin.
 */
export const isSameOrigin = (request) => {
  const fetchSite = request.headers.get('sec-fetch-site');
  if (fetchSite && fetchSite !== 'same-origin') return false;

  const origin = request.headers.get('origin');
  if (!origin) return false;

  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  try {
    return Boolean(host) && new URL(origin).host === host;
  } catch {
    return false;
  }
};

/**
 * Ordered, de-duplicated list of models to try. Malformed ids in the env vars
 * are ignored rather than sent upstream.
 */
export const resolveModels = (env = {}) => {
  const primary = (env.GROK_MODEL || '').trim() || DEFAULT_MODEL;
  const fallbacks = env.GROK_FALLBACK_MODELS === undefined
    ? DEFAULT_FALLBACK_MODELS
    : env.GROK_FALLBACK_MODELS.split(',').map((m) => m.trim());
  const models = [...new Set([primary, ...fallbacks])].filter((m) => MODEL_ID.test(m));
  return models.length ? models : [DEFAULT_MODEL];
};

/** Text of a Responses API reply: every output_text part of every message item. */
export const extractText = (data) => {
  if (typeof data?.output_text === 'string' && data.output_text) return data.output_text;
  if (!Array.isArray(data?.output)) return null;
  const text = data.output
    .filter((item) => item?.type === 'message' && Array.isArray(item.content))
    .flatMap((item) => item.content)
    .filter((part) => part?.type === 'output_text' && typeof part.text === 'string')
    .map((part) => part.text)
    .join('');
  return text || null;
};

// Statuses that mean "this key or client is the problem": another model won't help.
const NO_FALLBACK = new Set([401, 403, 429]);

/**
 * Validate the client payload and build the upstream request body.
 * @returns {{ body?: Object, error?: string }}
 */
export const buildUpstreamBody = (payload, model) => {
  if (!payload || typeof payload !== 'object') return { error: 'Invalid JSON body' };

  const { messages, temperature, maxTokens } = payload;
  if (!Array.isArray(messages) || messages.length === 0) return { error: 'messages must be a non-empty array' };
  if (messages.length > LIMITS.maxMessages) return { error: 'Too many messages' };

  let totalChars = 0;
  const clean = [];
  for (const message of messages) {
    if (!message || !ALLOWED_ROLES.has(message.role) || typeof message.content !== 'string') {
      return { error: 'Each message needs a valid role and string content' };
    }
    if (message.content.length > LIMITS.maxMessageChars) return { error: 'Message too long' };
    totalChars += message.content.length;
    clean.push({ role: message.role, content: message.content });
  }
  if (totalChars > LIMITS.maxTotalChars) return { error: 'Conversation too long' };

  // xAI samples at most temperature 1, so higher values are clamped here.
  const temp = Number.isFinite(temperature) ? Math.min(Math.max(temperature, 0), 1) : 0.7;
  const tokens = Number.isInteger(maxTokens) ? Math.min(Math.max(maxTokens, 1), LIMITS.maxTokens) : 500;

  return {
    body: {
      model,
      input: clean,
      stream: false,
      // The browser resends history each turn; nothing needs to be kept by xAI.
      store: false,
      temperature: temp,
      max_output_tokens: tokens,
    },
  };
};

/**
 * Handle one proxy request. `env` is injected so the Vite dev server can
 * reuse this handler with values from .env.local.
 */
export const handleGrokRequest = async (request, env = process.env) => {
  if (request.method !== 'POST') return json(405, { error: 'Method not allowed' });
  if (!isSameOrigin(request)) return json(403, { error: 'Forbidden' });
  if (!(request.headers.get('content-type') || '').includes('application/json')) {
    return json(415, { error: 'Content-Type must be application/json' });
  }

  const declaredLength = Number(request.headers.get('content-length') || 0);
  if (declaredLength > LIMITS.maxBodyBytes) return json(413, { error: 'Request too large' });

  const raw = await request.text();
  if (new TextEncoder().encode(raw).length > LIMITS.maxBodyBytes) {
    return json(413, { error: 'Request too large' });
  }

  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    return json(400, { error: 'Invalid JSON body' });
  }

  const models = resolveModels(env);
  const { body, error } = buildUpstreamBody(payload, models[0]);
  if (error) return json(400, { error });

  const apiKey = env.GROK_API_KEY;
  if (!apiKey) return json(503, { error: 'not_configured' });

  const deadline = Date.now() + LIMITS.upstreamTimeoutMs;
  let lastStatus = 504;
  for (const model of models) {
    const remaining = deadline - Date.now();
    if (remaining <= 0) break;

    let upstream;
    try {
      upstream = await fetch(XAI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ ...body, model }),
        signal: AbortSignal.timeout(remaining),
      });
    } catch (err) {
      console.error('[api/grok] upstream request failed:', model, err.name);
      lastStatus = 504;
      continue;
    }

    if (!upstream.ok) {
      // Log the status only; xAI error bodies can echo request details.
      console.error('[api/grok] upstream status', model, upstream.status);
      if (NO_FALLBACK.has(upstream.status)) {
        const status = upstream.status === 429 ? 429 : 502;
        return json(status, { error: `Upstream error ${upstream.status}` });
      }
      lastStatus = upstream.status;
      continue;
    }

    const content = extractText(await upstream.json().catch(() => null));
    if (typeof content === 'string') return json(200, { content, model });
    console.error('[api/grok] empty upstream response', model);
    lastStatus = 502;
  }

  return json(lastStatus === 504 ? 504 : 502, { error: 'upstream_unavailable', status: lastStatus });
};

export function POST(request) {
  return handleGrokRequest(request);
}
