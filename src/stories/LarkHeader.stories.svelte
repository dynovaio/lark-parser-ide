<script module>
  import '../app.css';

  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Header from '$lib/components/Header.svelte';

  const { Story } = defineMeta({
    title: 'Lark IDE/Header',
    component: Header,
    tags: ['autodocs']
  });
</script>

<Story name="Default" />
