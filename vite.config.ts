import tailwindcss from '@tailwindcss/vite';
import devtoolsJson from 'vite-plugin-devtools-json';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit(), devtoolsJson()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  server: {
    watch: {
      ignored: [
        'e2e/**/*.tests.ts',
        'tests/**/*.tests.ts',
        'dist',
        'build',
        'node_modules',
        'playwright-report'
      ]
    }
  },
  test: {
    projects: [
      {
        extends: './vite.config.ts',
        test: {
          name: 'component',
          environment: 'browser',
          browser: {
            enabled: true,
            provider: 'playwright',
            instances: [{ browser: 'chromium' }]
          },
          include: ['tests/component/**/*.{test,spec}.{js,ts}'],
          setupFiles: ['./vitest-setup-client.ts']
        }
      },
      {
        extends: './vite.config.ts',
        test: {
          name: 'unit',
          environment: 'jsdom',
          include: ['tests/unit/**/*.{test,spec}.{js,ts}'],
          setupFiles: ['./vitest-setup-server.ts']
        }
      }
    ]
  }
});
