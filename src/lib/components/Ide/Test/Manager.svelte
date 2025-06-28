<script lang="ts">
  import List from '$lib/components/Ide/Test/List.svelte';

  import Add from 'phosphor-svelte/lib/Plus';
  import Play from 'phosphor-svelte/lib/Play';
  import Empty from 'phosphor-svelte/lib/Tray';

  import { getIdeContext } from '$lib/components/Ide/Context';

  import { pyodideInstance } from '$lib/stores/Pyodide';

  import {
    TestStatus,
    TEST_CASE_TEMPLATE,
    executeTestCase,
    type TestCase,
    type TestResult
  } from '$lib/utils/TestCase';

  const ideContext = getIdeContext();
  const isEmpty = $derived.by(() => {
    return ($ideContext.project?.testCases || []).length === 0;
  });

  const addTestCase = () => {
    const newTestCaseId = ($ideContext.project?.testCases.length || 0) + 1;
    const newTestCase = { ...TEST_CASE_TEMPLATE, id: newTestCaseId };

    ideContext.setTestCase(newTestCase);
  };

  const runTestCase = async (testCase: TestCase) => {
    ideContext.setTestCase({
      ...testCase,
      result: {
        ...(testCase.result || {}),
        status: TestStatus.PARSING
      }
    });

    let testResult: TestResult;

    if (!$pyodideInstance) {
      testResult = {
        status: TestStatus.FAILURE,
        message: 'Pyodide instance is not available'
      } as TestResult;
    } else {
      testResult = await executeTestCase(
        $pyodideInstance,
        $ideContext.project.parserOptions,
        $ideContext.project.grammar,
        testCase
      );
    }

    ideContext.setTestCase({
      ...testCase,
      result: testResult
    });
  };

  const runAllTestCases = async () => {
    const testCases = $ideContext.project?.testCases || [];
    for (const testCase of testCases) {
      await runTestCase(testCase);
    }
  };
</script>

<section class="test-manager" class:test-manager--empty={isEmpty}>
  {#if isEmpty}
    <div class="test-manager--empty__controls">
      <Empty size={64} />
      <div>No tests available</div>
      <button class="test-manager--empty__control" onclick={() => addTestCase()}>
        <Add size={24} />
        <span>Add new test </span>
      </button>
    </div>
  {:else}
    <div class="test-manager__list-wrapper">
      <List />
    </div>
    <div class="test-manager__controls">
      <button class="test-manager__control" onclick={() => addTestCase()}>
        <Add size={24} />
        <span>Add new test </span>
      </button>
      <button class="test-manager__control" onclick={() => runAllTestCases()}>
        <Play size={24} />
        <span>Run All Tests </span>
      </button>
    </div>
  {/if}
</section>

<style lang="postcss">
  @reference "../../../../app.css";

  .test-manager {
    @apply relative flex h-full w-full shrink-0 grow flex-col;
    @apply bg-gray-200 text-gray-900;
    @apply dark:bg-gray-900 dark:text-gray-100;
  }

  .test-manager--empty {
    @apply flex h-full w-full shrink-0 grow flex-col items-center justify-center p-4;
    @apply bg-gray-100 text-gray-900;
    @apply dark:bg-gray-900 dark:text-gray-100;
  }

  .test-manager--empty__controls {
    @apply flex flex-col items-center justify-center gap-4;
  }

  .test-manager--empty__control {
    @apply flex w-64 shrink-0 grow cursor-pointer appearance-none flex-row items-center justify-center gap-x-2 rounded-lg border border-dashed px-2 py-2 transition duration-250 outline-none;
    @apply border-gray-800;
    @apply hover:border-solid hover:bg-gray-800 hover:text-gray-200;
    @apply focus:border-solid focus:bg-gray-800 focus:text-gray-200;

    @apply dark:border-gray-200;
    @apply hover:border-solid dark:hover:bg-gray-200 dark:hover:text-gray-900;
    @apply focus:border-solid dark:focus:bg-gray-200 dark:focus:text-gray-900;
  }

  .test-manager__list-wrapper {
    @apply relative flex max-h-[calc(100%-4.5rem)] w-full shrink-0 grow flex-col overflow-hidden;
  }

  .test-manager__controls {
    @apply relative flex w-full shrink-0 flex-row items-center justify-between gap-4 p-4;
    @apply bg-gray-100 text-gray-900;
    @apply dark:bg-gray-900 dark:text-gray-100;
  }

  .test-manager__control {
    @apply flex shrink-0 grow cursor-pointer appearance-none flex-row items-center gap-x-2 rounded-lg px-2 py-2 transition duration-250 outline-none;
    @apply bg-gray-200 text-gray-900;
    @apply hover:bg-gray-800 hover:text-gray-200;
    @apply focus:bg-gray-800 focus:text-gray-200;

    @apply dark:bg-gray-800 dark:text-gray-200;
    @apply dark:hover:bg-gray-200 dark:hover:text-gray-900;
    @apply dark:focus:bg-gray-200 dark:focus:text-gray-900;
  }
</style>
