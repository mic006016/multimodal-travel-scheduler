import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        // target: import.meta.env.VITE_BACKEND_URL,
        changeOrigin: true,
      },
      "/ai": {
        target: "http://localhost:8000",
        // target: import.meta.env.VITE_BACKEND_URL,
        changeOrigin: true,
      },
      "/img": "http://localhost:5000",
    },
  },
});
