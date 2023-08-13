import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';
import { comlink } from 'vite-plugin-comlink';
import eslint from 'vite-plugin-eslint';
import htmlEnv from 'vite-plugin-html-env';
import tsconfigPaths from 'vite-tsconfig-paths';
import { configDefaults } from 'vitest/config';

/** @type {import('vite').UserConfig} */
export default defineConfig({
  define: {
    'process.env': process.env,
  },
  plugins: [
    react(),
    comlink(),
    htmlEnv(),
    {
      ...eslint({
        failOnWarning: true,
        failOnError: true,
      }),
      apply: 'build',
    },
    {
      ...eslint({
        failOnWarning: false,
        failOnError: true,
      }),
      apply: 'serve',
      enforce: 'post',
    },
    tsconfigPaths(),
  ],
  worker: {
    plugins: [comlink()],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '/src'),
    },
  },
  css: {
    modules: {
      scopeBehaviour: 'local',
      localsConvention: 'dashes',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/test-setup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
    exclude: [...configDefaults.exclude, './tests/e2e/*'],
  },
  build: {
    chunkSizeWarningLimit: 2000,
    target: 'esnext',
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
    },
  },
});
