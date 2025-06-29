import type { StorybookConfig } from '@storybook/sveltekit';

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|ts|svelte)'],
  addons: [
    '@storybook/addon-svelte-csf',
    '@chromatic-com/storybook',
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest'
  ],
  framework: {
    name: '@storybook/sveltekit',
    options: {}
  },
  viteFinal: async (config) => {
    if (config.optimizeDeps) {
      config.optimizeDeps.exclude = [
        ...(config.optimizeDeps.exclude || []),
        'pyodide',
        '@melt-ui/svelte'
      ];
    } else {
      config.optimizeDeps = {
        exclude: ['pyodide', '@melt-ui/svelte']
      };
    }
    return config;
  }
};
export default config;
