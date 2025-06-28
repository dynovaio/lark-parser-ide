<script module>
  import '../app.css';

  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TestEditor from '$lib/components/Ide/Test/Editor.svelte';
  import { setIdeContext } from '$lib/components/Ide/Context';
  import { createIdeState } from '$lib/stores/Ide';
  import { PROJECT_HELLO_WORLD } from '$lib/utils/Project';
  import { TEST_CASE_TEMPLATE } from '$lib/utils/TestCase';

  const { Story } = defineMeta({
    title: 'Lark IDE/Test/Editor',
    component: TestEditor,
    tags: ['autodocs'],
    argTypes: {
      testCase: {
        control: { type: 'object' }
      }
    }
  });
</script>

<script>
  const mockIdeState = createIdeState(PROJECT_HELLO_WORLD);
  setIdeContext(mockIdeState);

  const mockTestCase = {
    ...TEST_CASE_TEMPLATE,
    id: 1,
    description: 'Sample test case',
    content: 'Hello, World!'
  };
</script>

<Story name="Default">
  <div style="height: 300px; width: 100%; padding: 20px;">
    <TestEditor testCase={mockTestCase} />
  </div>
</Story>

<Story name="With Content">
  <div style="height: 300px; width: 100%; padding: 20px;">
    <TestEditor
      testCase={{
        ...TEST_CASE_TEMPLATE,
        id: 1,
        description: 'Test with content',
        content: 'start: expression\nexpression: NUMBER "+" NUMBER\nNUMBER: /[0-9]+/'
      }}
    />
  </div>
</Story>
