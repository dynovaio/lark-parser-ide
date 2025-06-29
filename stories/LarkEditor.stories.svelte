<script module>
  import '../src/app.css';

  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Editor from '$lib/components/Ide/Editor.svelte';
  import { setIdeContext } from '$lib/components/Ide/Context';
  import { createIdeState } from '$lib/stores/Ide';
  import { PROJECT_HELLO_WORLD } from '$lib/utils/Project';

  const { Story } = defineMeta({
    title: 'Lark IDE/Editor',
    component: Editor,
    tags: ['autodocs']
  });
</script>

<script>
  const mockIdeState = createIdeState({ ...PROJECT_HELLO_WORLD });
  setIdeContext(mockIdeState);
</script>

<Story name="Default">
  <div style="height: 400px; width: 100%; padding: 20px;">
    <Editor />
  </div>
</Story>
