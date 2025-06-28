<script module>
  import '../app.css';

  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TestManager from '$lib/components/Ide/Test/Manager.svelte';
  import { setIdeContext } from '$lib/components/Ide/Context';
  import { createIdeState } from '$lib/stores/Ide';
  import { PROJECT_HELLO_WORLD } from '$lib/utils/Project';
  import { TestStatus } from '$lib/utils/TestCase';

  const { Story } = defineMeta({
    title: 'Lark IDE/Test/Manager',
    component: TestManager,
    tags: ['autodocs']
  });
</script>

<script>
  const projectWithTests = {
    ...PROJECT_HELLO_WORLD,
    testCases: [
      {
        id: 1,
        description: 'Basic test',
        content: 'Hello, World!',
        result: { status: TestStatus.SUCCESS }
      },
      {
        id: 2,
        description: 'Another test',
        content: 'Test content',
        result: { status: TestStatus.UNKNOWN }
      }
    ]
  };

  const mockIdeStateWithTests = createIdeState(projectWithTests);

  // Set initial context
  setIdeContext(mockIdeStateWithTests);
</script>

<Story name="With Tests">
  <div style="height: 500px; width: 100%; padding: 20px;">
    <TestManager />
  </div>
</Story>

<Story name="Empty State">
  <div style="height: 500px; width: 100%; padding: 20px;">
    <TestManager />
  </div>
</Story>
