import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    hmr: {
      protocol: 'wss',
      host: 'portfolio.hyzmat-tm.com',
      clientPort: 443,
    },
  },
  preview: {
    port: 5173,
    host: '0.0.0.0',
  },
});

