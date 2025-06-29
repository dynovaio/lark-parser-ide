<script module>
  import '../src/app.css';

  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TestItem from '$lib/components/Ide/Test/Item.svelte';
  import { setIdeContext } from '$lib/components/Ide/Context';
  import { createIdeState } from '$lib/stores/Ide';
  import { PROJECT_HELLO_WORLD } from '$lib/utils/Project';
  import { TEST_CASE_TEMPLATE, TestStatus } from '$lib/utils/TestCase';

  const { Story } = defineMeta({
    title: 'Lark IDE/Test/Item',
    component: TestItem,
    tags: ['autodocs']
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

  const mockTestCaseWithResult = {
    ...TEST_CASE_TEMPLATE,
    id: 2,
    description: 'Test with success result',
    content: 'Test content',
    result: {
      status: TestStatus.SUCCESS,
      content: '{"type": "start", "data": "start", "children": ["Hello", ", ", "World!"]}'
    }
  };

  const mockTestCaseWithError = {
    ...TEST_CASE_TEMPLATE,
    id: 3,
    description: 'Test with error',
    content: 'Invalid content',
    result: {
      status: TestStatus.FAILURE,
      traceback: 'Parse error: Unexpected token at line 1'
    }
  };
</script>

<Story name="Default">
  <div style="width: 100%; padding: 20px;">
    <TestItem testCase={mockTestCase} isActive={false} />
  </div>
</Story>

<Story name="Active">
  <div style="width: 100%; padding: 20px;">
    <TestItem testCase={mockTestCase} isActive={true} />
  </div>
</Story>

<Story name="With Success Result">
  <div style="width: 100%; padding: 20px;">
    <TestItem testCase={mockTestCaseWithResult} isActive={false} />
  </div>
</Story>

<Story name="With Error">
  <div style="width: 100%; padding: 20px;">
    <TestItem testCase={mockTestCaseWithError} isActive={false} />
  </div>
</Story>
