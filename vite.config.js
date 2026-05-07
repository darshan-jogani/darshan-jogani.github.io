import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-oxc';

// If deploying to https://<user>.github.io/<repo>/, set base to '/<repo>/'.
// For a user site (https://<user>.github.io/), base is '/'.
export default defineConfig({
  plugins: [
    react()
  ],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 2000,
  },
  server: { port: 5173, open: true },
});
