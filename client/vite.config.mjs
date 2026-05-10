import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/client/', // Updated base path for deployment in a subdirectory
  server: {
    port: 5173
  }
});

