import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type ProxyOptions } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // Dev/preview: the browser only talks to Vite, which forwards /api/* to ArabyOn.Api. That keeps the
  // SameSite=Strict refresh cookie same-origin. The API scopes the cookie to Path=/auth, so it is
  // rewritten to /api/auth or the browser would never send it back.
  const apiProxy: Record<string, ProxyOptions> = {
    '/api': {
      target: env.API_PROXY_TARGET || 'http://localhost:5137',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
      cookiePathRewrite: { '/auth': '/api/auth' },
    },
  }

  return {
    plugins: [react(), tailwindcss()],
    // host: true also listens on the LAN, so the app can be opened from a phone on the same Wi-Fi.
    server: { host: true, proxy: apiProxy },
    preview: { host: true, proxy: apiProxy },
  }
})
