import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/", // Updated base path for deployment at the root
  server: {
    port: 5173,
  },
});
