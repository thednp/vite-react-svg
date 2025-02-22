import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svg from './src/index.mjs';

export default defineConfig({
  root: "./",
  base: "./",
  plugins: [
    react(),
    svg({
      include: ['**/*.svg?react'],
    }),
  ],
  server: {
    port: 4000,
  },
  build: {
    target: 'esnext',
  },
});