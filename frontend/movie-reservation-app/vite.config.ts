import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignorar warnings de TypeScript
        if (warning.code === 'TS2307' || warning.code === 'TS2339' || warning.code === 'TS2345') {
          return
        }
        warn(warning)
      }
    }
  },
  esbuild: {
    // Ignorar errores de TypeScript durante el build
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
})
