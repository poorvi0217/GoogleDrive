import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Dev server proxies /api to your API Gateway, so no CORS setup is needed
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, proxy: { "/api": "http://localhost:3333" } },
});