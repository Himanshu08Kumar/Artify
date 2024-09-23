import { defineConfig } from 'vite';
import { join } from 'path';

export default defineConfig({
  root: join(process.cwd(), 'src'),  // Ensuring src as the root for development
  server: {
    port: 3000,
    open: '/index.html',  // Point to the correct path in relation to the root
  },
  preview: {
    port: 8080,
  },
  build: {
    outDir: join(process.cwd(), 'dist'),  // Build files in dist folder
    rollupOptions: {
      input: {
        main: join(process.cwd(), 'src', 'index.html'),  // Build the main entry
        favorite: join(process.cwd(), 'src', 'favorite.html'),  // Additional entry for favorite.html
      },
    },
  },
});
