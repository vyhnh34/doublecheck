import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages serves from /<repo>/; Vercel serves from /.
// Vercel sets process.env.VERCEL automatically, so we use that to distinguish.
export default defineConfig(({ command }) => ({
  base: command === 'build' && !process.env.VERCEL ? '/SocialLabInputFieldPrototype/' : '/',
  plugins: [react(), tailwindcss()],
  server: { port: Number(process.env.PORT) || 5174 },
}))
