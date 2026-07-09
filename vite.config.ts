import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    // Proxy API calls to the Express server. Backend runs on 5001 (server/.env),
    // since macOS Control Center / AirPlay Receiver occupies port 5000.
    proxy: {
      '/api': 'http://localhost:5001',
    },
    // http://192.168.1.22:4173/
  },
})
