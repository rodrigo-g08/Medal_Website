import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        work: resolve(__dirname, 'work/index.html'),
        filmServices: resolve(__dirname, 'film-services/index.html'),
        contact: resolve(__dirname, 'contact/index.html'),
        contactConfirmed: resolve(__dirname, 'contact/confirmed/index.html'),
      },
    },
  },
});
