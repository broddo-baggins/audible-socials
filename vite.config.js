import { readFileSync } from 'node:fs'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { handleGrokRequest } from './api/grok.js'

// Serve the api/grok.js serverless function from the dev and preview servers, so
// `npm run dev` and `npm run preview` behave like Vercel. GROK_API_KEY is read
// from .env.local on the server side only.
const grokApiMiddleware = (env) => async (req, res) => {
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const request = new Request(`http://${req.headers.host}${req.originalUrl}`, {
    method: req.method,
    headers: req.headers,
    body: ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks),
  })
  const response = await handleGrokRequest(request, env)
  res.statusCode = response.status
  response.headers.forEach((value, key) => res.setHeader(key, value))
  res.end(await response.text())
}

// `vite preview` sends the same security headers Vercel does, so e2e runs the
// production build under the real CSP. The dev server skips them: HMR needs
// inline scripts.
const vercelHeaders = JSON.parse(readFileSync(new URL('./vercel.json', import.meta.url), 'utf8'))
  .headers.flatMap((rule) => rule.headers)

const grokApiDev = (env) => ({
  name: 'grok-api-dev',
  configureServer(server) {
    server.middlewares.use('/api/grok', grokApiMiddleware(env))
  },
  configurePreviewServer(server) {
    server.middlewares.use((req, res, next) => {
      for (const { key, value } of vercelHeaders) res.setHeader(key, value)
      next()
    })
    server.middlewares.use('/api/grok', grokApiMiddleware(env))
  },
})

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), grokApiDev(loadEnv(mode, process.cwd(), ''))],
}))
