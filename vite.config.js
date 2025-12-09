import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost",
    port: 3000,
    open: true,
    // --- CẤU HÌNH PROXY ĐỂ VƯỢT QUA CORS ---
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Chuyển hướng sang Backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
});