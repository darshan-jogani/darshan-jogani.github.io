import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// If deploying to https://<user>.github.io/<repo>/, set base to '/<repo>/'.
// For a user site (https://<user>.github.io/), base is '/'.
export default defineConfig({
  plugins: [
    react({ include: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'] })
  ],
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1500,
  },
  server: { port: 5173, open: true },
});
