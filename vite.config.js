import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    open: true
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        breathe: resolve(__dirname, 'breathe.html'),
        nutrition: resolve(__dirname, 'nutrition.html'),
        assessment: resolve(__dirname, 'assessment.html'),
        booking: resolve(__dirname, 'booking.html')
      }
    }
  }
});
