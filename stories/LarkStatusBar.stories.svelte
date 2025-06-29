<script module>
  import '../src/app.css';

  import { defineMeta } from '@storybook/addon-svelte-csf';
  import StatusBar from '$lib/components/Ide/StatusBar.svelte';
  import { setIdeContext } from '$lib/components/Ide/Context';
  import { createIdeState } from '$lib/stores/Ide';
  import { PROJECT_HELLO_WORLD } from '$lib/utils/Project';

  const { Story } = defineMeta({
    title: 'Lark IDE/StatusBar',
    component: StatusBar,
    tags: ['autodocs']
  });
</script>

<script>
  const mockIdeState = createIdeState({ ...PROJECT_HELLO_WORLD });
  setIdeContext(mockIdeState);
</script>

<Story name="Default">
  <div style="width: 100%; padding: 20px;">
    <StatusBar />
  </div>
</Story>

<Story name="With Project">
  <div style="width: 100%; padding: 20px;">
    <StatusBar />
  </div>
</Story>
