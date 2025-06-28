<script module>
  import '../app.css';

  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Ide from '$lib/components/Ide.svelte';

  const { Story } = defineMeta({
    title: 'Lark IDE/Ide',
    component: Ide,
    tags: ['autodocs'],
    parameters: {
      layout: 'fullscreen'
    }
  });
</script>

<Story name="Default">
  <div style="height: 100vh; width: 100vw;">
    <Ide />
  </div>
</Story>
