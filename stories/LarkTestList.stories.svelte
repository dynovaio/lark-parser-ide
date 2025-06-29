<script module>
  import '../src/app.css';

  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TestList from '$lib/components/Ide/Test/List.svelte';
  import { setIdeContext } from '$lib/components/Ide/Context';
  import { createIdeState } from '$lib/stores/Ide';
  import { PROJECT_HELLO_WORLD } from '$lib/utils/Project';
  import { TestStatus } from '$lib/utils/TestCase';

  const { Story } = defineMeta({
    title: 'Lark IDE/Test/List',
    component: TestList,
    tags: ['autodocs']
  });
</script>

<script>
  const projectWithMultipleTests = {
    ...PROJECT_HELLO_WORLD,
    testCases: [
      {
        id: 1,
        description: 'Test Case 1',
        content: 'Hello, World!',
        result: { status: TestStatus.SUCCESS }
      },
      {
        id: 2,
        description: 'Test Case 2',
        content: 'Goodbye, World!',
        result: { status: TestStatus.FAILURE }
      },
      {
        id: 3,
        description: 'Test Case 3',
        content: 'Test content',
        result: { status: TestStatus.UNKNOWN }
      }
    ]
  };

  const mockIdeState = createIdeState(projectWithMultipleTests);
  setIdeContext(mockIdeState);
</script>

<Story name="Default">
  <div style="height: 400px; width: 100%; padding: 20px;">
    <TestList />
  </div>
</Story>
