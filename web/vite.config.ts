import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true,
      ignored: ['./vite.config.ts']
    },
    hmr: { host: '0.0.0.0' }
  }
});
