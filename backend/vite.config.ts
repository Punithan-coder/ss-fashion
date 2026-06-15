import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  build: {
    ssr: 'src/main.ts',
    outDir: 'dist',
    rollupOptions: {
      input: 'src/main.ts',
      output: {
        entryFileNames: 'main.js'
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
