import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/jot": {
        target: "https://jot-hxxp.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
