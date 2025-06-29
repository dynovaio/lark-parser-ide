<script module>
  import '../src/app.css';

  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Loader from '$lib/components/Loader.svelte';

  const { Story } = defineMeta({
    title: 'Lark IDE/Loader',
    component: Loader,
    tags: ['autodocs'],
    argTypes: {
      message: {
        control: { type: 'text', default: 'Loading...' },
        description: 'Message to display while loading'
      },
      progress: {
        control: { type: 'range', min: 0, max: 100, step: 1, default: 50 },
        description: 'Progress percentage (0-100)'
      }
    }
  });
</script>

<Story name="Default" args={{ message: 'Loading...', progress: 50 }} />
