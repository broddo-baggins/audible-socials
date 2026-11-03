import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { handleGrokRequest } from './api/grok.js'

// Serve the api/grok.js serverless function from the dev server, so `npm run dev`
// behaves like Vercel. GROK_API_KEY is read from .env.local on the server side only.
const grokApiDev = (env) => ({
  name: 'grok-api-dev',
  configureServer(server) {
    server.middlewares.use('/api/grok', async (req, res) => {
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
    })
  },
})

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), grokApiDev(loadEnv(mode, process.cwd(), ''))],
}))
