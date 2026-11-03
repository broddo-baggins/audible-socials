/**
 * Grok (xAI) proxy - Vercel serverless function
 *
 * The browser posts chat messages to /api/grok and this function calls xAI
 * with GROK_API_KEY. The key is a server-only env var (no VITE_ prefix), so
 * it never reaches the client bundle.
 *
 * Guards: POST + JSON only, same-origin requests only, request body size cap,
 * message count/length limits, and a server-chosen model and token ceiling.
 */

const XAI_URL = 'https://api.x.ai/v1/chat/completions';
const DEFAULT_MODEL = 'grok-3-mini';

export const LIMITS = {
  maxBodyBytes: 32 * 1024,
  maxMessages: 40,
  maxMessageChars: 12000,
  maxTotalChars: 24000,
  maxTokens: 1000,
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

  const temp = Number.isFinite(temperature) ? Math.min(Math.max(temperature, 0), 1.5) : 0.7;
  const tokens = Number.isInteger(maxTokens) ? Math.min(Math.max(maxTokens, 1), LIMITS.maxTokens) : 500;

  return {
    body: {
      model,
      messages: clean,
      stream: false,
      temperature: temp,
      max_tokens: tokens,
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

  const { body, error } = buildUpstreamBody(payload, env.GROK_MODEL || DEFAULT_MODEL);
  if (error) return json(400, { error });

  const apiKey = env.GROK_API_KEY;
  if (!apiKey) return json(503, { error: 'not_configured' });

  let upstream;
  try {
    upstream = await fetch(XAI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(LIMITS.upstreamTimeoutMs),
    });
  } catch (err) {
    console.error('[api/grok] upstream request failed:', err.name);
    return json(504, { error: 'Upstream unavailable' });
  }

  if (!upstream.ok) {
    // Log the status only; xAI error bodies can echo request details.
    console.error('[api/grok] upstream status', upstream.status);
    const status = upstream.status === 429 ? 429 : 502;
    return json(status, { error: `Upstream error ${upstream.status}` });
  }

  const data = await upstream.json().catch(() => null);
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== 'string') return json(502, { error: 'Empty upstream response' });

  return json(200, { content });
};

export function POST(request) {
  return handleGrokRequest(request);
}
