import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: "/qr/",
  plugins: [react()],
  server: {
    proxy: {
      "/qr/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/qr/, ""),
      },
    },
  },
})
