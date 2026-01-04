import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000", // <-- ใส่ URL Backend ของคุณตรงนี้
        changeOrigin: true,
        secure: false,
        // ถ้า Backend คุณไม่ได้ขึ้นต้นด้วย /api ให้ใช้บรรทัดล่างนี้เพื่อตัดออก
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
