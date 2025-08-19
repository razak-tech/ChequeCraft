import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [react(),
    // Emit 404.html for GitHub Pages SPA fallback
    {
      name: 'emit-404',
      apply: 'build',
      closeBundle() {
        const out = path.resolve(process.cwd(), 'list')
        try {
          const indexPath = path.join(out, 'index.html')
          if (fs.existsSync(indexPath)) {
            fs.copyFileSync(indexPath, path.join(out, '404.html'))
          }
        } catch {}
      }
    }
  ],
  // Base path for GitHub Pages: https://<user>.github.io/ChequeCraft/
  base: '/ChequeCraft/',
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: 'list',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})