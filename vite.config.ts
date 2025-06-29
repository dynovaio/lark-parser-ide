import tailwindcss from '@tailwindcss/vite';
import devtoolsJson from 'vite-plugin-devtools-json';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit(), devtoolsJson()],
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
