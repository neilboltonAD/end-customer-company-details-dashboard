import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'p2p',
      filename: 'remoteEntry.js',
      exposes: {
        './P2PExtension': './src/App.tsx',
      },
      shared: ['react', 'react-dom', '@mantine/core', '@mantine/hooks'],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        // Put ALL files at root level for AppDirect compatibility
        entryFileNames: '[name].js',
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: '[name]-[hash][extname]',
      },
    },
  },
  server: {
    port: 5173,
    cors: true,
  },
});
