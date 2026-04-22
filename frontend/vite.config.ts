import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const engine = (port: number) => ({
  target: `http://127.0.0.1:${port}`,
  changeOrigin: true,
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/engine/didwebvh-rs': { ...engine(8081), rewrite: (p) => p.replace(/^\/engine\/didwebvh-rs/, '') },
      '/engine/didwebvh-py': { ...engine(8082), rewrite: (p) => p.replace(/^\/engine\/didwebvh-py/, '') },
      '/engine/didwebvh-ts': { ...engine(8083), rewrite: (p) => p.replace(/^\/engine\/didwebvh-ts/, '') },
    },
  },
})
