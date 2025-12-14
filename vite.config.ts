import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://zenfinity-intern-api-104290304048.europe-west1.run.app',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'd3': ['d3'],
          'mui': ['@mui/material', '@mui/icons-material'],
        },
      },
    },
  },
})
