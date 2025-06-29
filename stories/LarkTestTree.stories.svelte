<script module>
  import '../src/app.css';

  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Tree from '$lib/components/Ide/Test/Tree.svelte';
  import { createTreeView } from '@melt-ui/svelte';
  import { setContext } from 'svelte';

  const { Story } = defineMeta({
    title: 'Lark IDE/Test/Tree',
    component: Tree,
    tags: ['autodocs'],
    argTypes: {
      items: { control: { type: 'object' } },
      level: { control: { type: 'number' } }
    }
  });
</script>

<script>
  const context = createTreeView();
  setContext('tree-view-context', context);

  const sampleTreeItems = [
    {
      type: 'start',
      data: 'start',
      children: [
        {
          type: 'expression',
          data: 'expression',
          children: ['Hello', ', ', 'World!']
        }
      ]
    }
  ];

  const complexTreeItems = [
    {
      type: 'program',
      data: 'program',
      children: [
        {
          type: 'statement',
          data: 'statement',
          children: [
            {
              type: 'assignment',
              data: 'assignment',
              children: ['x', '=', '42']
            }
          ]
        },
        {
          type: 'statement',
          data: 'statement',
          children: [
            {
              type: 'print_stmt',
              data: 'print_stmt',
              children: ['print', '(', 'x', ')']
            }
          ]
        }
      ]
    }
  ];
</script>

<Story name="Simple Tree">
  <div style="width: 100%; padding: 20px; border: 1px solid #ccc; border-radius: 8px;">
    <Tree items={sampleTreeItems} level={0} />
  </div>
</Story>

<Story name="Complex Tree">
  <div style="width: 100%; padding: 20px; border: 1px solid #ccc; border-radius: 8px;">
    <Tree items={complexTreeItems} level={0} />
  </div>
</Story>

<Story name="Terminal Nodes">
  <div style="width: 100%; padding: 20px; border: 1px solid #ccc; border-radius: 8px;">
    <Tree items={['token1', 'token2', 'token3']} level={0} />
  </div>
</Story>
