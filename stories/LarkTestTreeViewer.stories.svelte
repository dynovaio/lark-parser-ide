<script module>
  import '../src/app.css';

  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TreeViewer from '$lib/components/Ide/Test/TreeViewer.svelte';

  const { Story } = defineMeta({
    title: 'Lark IDE/Test/TreeViewer',
    component: TreeViewer,
    tags: ['autodocs']
  });
</script>

<script>
  const simpleTreeJson = JSON.stringify({
    type: 'start',
    data: 'start',
    children: [
      {
        type: 'expression',
        data: 'expression',
        children: ['Hello', ', ', 'World!']
      }
    ]
  });
</script>

<Story name="Simple Tree">
  <div style="width: 100%; padding: 20px;">
    <TreeViewer tree={simpleTreeJson} />
  </div>
</Story>
