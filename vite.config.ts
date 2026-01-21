import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    // Proxy API calls to the Express server (defaults to port 5000)
    proxy: {
      '/api': 'http://192.168.1.10:5000',
    },
  },
})
