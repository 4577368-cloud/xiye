import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, 'src'),
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true
  },
  publicDir: path.resolve(__dirname, 'public'),
  server: {
    port: 3266,
    host: '127.0.0.1'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  css: {
    postcss: path.resolve(__dirname, 'postcss.config.js')
  },
  define: {
    __VITE_SUPABASE_URL__: JSON.stringify(process.env.VITE_SUPABASE_URL || ''),
    __VITE_SUPABASE_ANON_KEY__: JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY || '')
  }
})
