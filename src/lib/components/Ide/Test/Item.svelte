<script lang="ts">
  import Edit from 'phosphor-svelte/lib/Pencil';
  import Play from 'phosphor-svelte/lib/Play';
  import Delete from 'phosphor-svelte/lib/Trash';
  import TestTube from 'phosphor-svelte/lib/TestTube';
  import CaretDown from 'phosphor-svelte/lib/CaretDown';
  import CaretRight from 'phosphor-svelte/lib/CaretRight';
  import Save from 'phosphor-svelte/lib/FloppyDisk';

  import Editor from '$lib/components/Ide/Test/Editor.svelte';

  import { TestStatus, executeTestCase, type TestCase, type TestResult } from '$lib/utils/TestCase';
  import { getIdeContext } from '$lib/components/Ide/Context';
  import { pyodideInstance } from '$lib/stores/Pyodide';
  import TreeViewer from './TreeViewer.svelte';

  interface Props {
    testCase: TestCase;
    isActive?: boolean;
  }

  let { testCase, isActive }: Props = $props();
  let testCaseStatus = $derived.by(() => {
    return testCase.result?.status || TestStatus.UNKNOWN;
  });
  let testCaseHasResult = $derived.by(() => {
    return !!testCase.result;
  });

  const ideContext = getIdeContext();

  let isShowingResult = $state(false);
  let isEditionActive = $state(false);
  let testDescription = $state(testCase.description || '');

  const selectTestCase = (testCase: TestCase) => {
    if (testCase.id !== $ideContext.testCase?.id) {
      ideContext.setTestCase(testCase);
    }
  };

  const toggleResult = () => {
    isShowingResult = !isShowingResult;
  };

  const toggleEdition = () => {
    testDescription = testCase.description || '';
    isEditionActive = !isEditionActive;
  };

  const save = () => {
    ideContext.setTestCase({
      ...testCase,
      description: testDescription
    });
  };

  const execute = async () => {
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

  const remove = () => {
    let project = $ideContext.project;

    project = {
      ...project,
      testCases: project.testCases
        .filter((tc: TestCase) => tc.id !== testCase.id)
        .map((item, index) => ({ ...item, id: index + 1 }))
    };

    ideContext.setProject(project);
  };

  $effect(() => {
    if ($ideContext.testCase?.id !== testCase.id) {
      isEditionActive = false;

      if (testCase.description != testDescription) {
        save();
      }
    }
  });
</script>

<div
  class="test"
  role="button"
  tabindex="0"
  onclick={() => selectTestCase(testCase)}
  onkeydown={() => selectTestCase(testCase)}
>
  <div class="test__header">
    <h1 class="test__title">
      <span class="test__indicator" class:test__indicator--is-active={isActive}>
        <TestTube
          size={24}
          weight={isActive ? 'fill' : 'regular'}
          aria-label={`Test ${isActive ? 'active' : 'inactive'}`}
        />
      </span>
      <span>
        Test case {testCase.id}
      </span>
    </h1>
    {#if testCase.description}
      {#if isEditionActive}
        <input
          type="text"
          class="test__description test__description--is-editable"
          bind:value={testDescription}
          placeholder="Enter test case description"
          name="test-case-description"
        />
      {:else}
        <p class="test__description">{testCase.description}</p>
      {/if}
    {/if}
  </div>
  <div class="test__body">
    <Editor {testCase} />
  </div>
  <div class="test__body test__result">
    <h2 class="test__result-status">
      <button
        class="test__result-toggler"
        class:test__result-toggler--is-active={isShowingResult}
        class:test__result-toggler--is-disabled={testCaseStatus === TestStatus.UNKNOWN}
        onclick={() => testCaseHasResult && toggleResult()}
        name="result-toggler"
        aria-label="Toggle result"
      >
        {#if isShowingResult}
          <CaretDown size={24} aria-label="Collapse result" />
        {:else}
          <CaretRight size={24} aria-label="Expand result" />
        {/if}
      </button>
      <div>
        Status:
        <span
          class="test__result-status-value"
          class:test__result-status-value--is-warning={testCaseStatus === TestStatus.UNKNOWN}
          class:test__result-status-value--is-success={testCaseStatus === TestStatus.SUCCESS}
          class:test__result-status-value--is-error={testCaseStatus === TestStatus.FAILURE}
        >
          {testCaseStatus}
        </span>
      </div>
    </h2>
    {#if isShowingResult}
      {#if testCase.result?.traceback}
        <div class="test__result-traceback-wrapper">
          <div class="test__result-traceback">
            <pre>{testCase.result.traceback}</pre>
          </div>
        </div>
      {/if}
      {#if testCase.result?.content}
        <div class="test__result-content">
          <TreeViewer tree={testCase.result.content} />
        </div>
      {/if}
    {/if}
  </div>

  <div class="test__footer">
    <button
      onclick={() => {
        if (isEditionActive) save();
        toggleEdition();
      }}
      class="test__action"
      class:test__action-save={isEditionActive}
      class:test__action-edit={!isEditionActive}
      name={isEditionActive ? 'save-test-case' : 'edit-test-case'}
      aria-label={isEditionActive ? 'Save test case' : 'Edit test case'}
    >
      {#if isEditionActive}
        <Save size={24} aria-label="Save test case" />
        <span>Save</span>
      {:else}
        <Edit size={24} aria-label="Edit test case" />
        <span>Edit</span>
      {/if}
    </button>
    <button
      class="test__action test__action-run"
      name="run-test-case"
      aria-label="Run test case"
      onclick={() => execute()}
    >
      <Play size={24} aria-label="Run test case" />
      <span>Run</span>
    </button>
    <button
      class="test__action test__action-delete"
      name="delete-test-case"
      aria-label="Delete test case"
      onclick={(event: MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        remove();
      }}
    >
      <Delete size={24} aria-label="Delete test case" />
      <span>Delete</span>
    </button>
  </div>
</div>

<style lang="postcss">
  @reference "../../../../app.css";

  .test {
    @apply flex w-full shrink-0 appearance-none flex-col gap-4 overflow-auto rounded-lg p-4 text-left;
  }

  .test__header {
    @apply flex flex-col gap-4;
  }

  .test__body {
    @apply flex flex-col gap-4;
  }

  .test__footer {
    @apply flex items-center justify-between gap-x-4;
  }

  .test__indicator {
    @apply flex shrink-0 cursor-pointer appearance-none items-center justify-center gap-2 rounded-lg px-2 py-2;
  }

  .test__indicator--is-active {
    @apply text-orange-500;
  }

  .test__title {
    @apply flex items-center justify-start gap-4 text-lg font-semibold;
  }

  .test__description--is-editable {
    @apply form-input w-full rounded-lg px-3 py-2;
    @apply bg-gray-100 text-gray-900;
    @apply dark:bg-gray-900 dark:text-gray-100;
  }

  .test__result-status {
    @apply flex flex-row items-center gap-4;
  }

  .test__result-status-value {
    @apply font-semibold;
  }

  .test__result-status-value--is-warning {
    @apply text-yellow-700;
    @apply dark:text-yellow-500;
  }

  .test__result-status-value--is-success {
    @apply text-green-700;
    @apply dark:text-green-500;
  }

  .test__result-status-value--is-error {
    @apply text-red-700;
    @apply dark:text-red-500;
  }

  .test__result-traceback-wrapper {
    @apply overflow-hidden rounded-lg;
  }

  .test__result-traceback {
    @apply max-h-128 w-full overflow-auto rounded-lg p-4 font-mono text-[0.875rem];
    @apply bg-gray-100 text-gray-900;
    @apply dark:bg-gray-900 dark:text-gray-100;
  }

  .test__result-traceback :global(pre) {
    @apply h-auto w-full whitespace-pre-wrap;
  }

  .test__result-content {
    @apply w-full overflow-auto rounded-lg font-mono text-[0.875rem];
    @apply bg-gray-100 text-gray-900;
    @apply dark:bg-gray-900 dark:text-gray-100;
  }

  .test__result-content :global(pre) {
    @apply h-auto w-full whitespace-pre-wrap;
  }

  .test__result-toggler {
    @apply flex shrink-0 cursor-pointer appearance-none items-center justify-center gap-2 rounded-lg px-2 py-2;
    @apply bg-gray-100 text-gray-900;
    @apply hover:bg-gray-900 hover:text-gray-100;
    @apply focus:bg-gray-900 focus:text-gray-100;

    @apply dark:bg-gray-900 dark:text-gray-100;
    @apply dark:hover:bg-gray-100 dark:hover:text-gray-900;
    @apply dark:focus:bg-gray-100 dark:focus:text-gray-900;
  }

  .test__result-toggler--is-disabled {
    @apply cursor-not-allowed opacity-50;

    @apply hover:bg-gray-100 hover:text-gray-900;
    @apply focus:bg-gray-100 focus:text-gray-900;

    @apply dark:hover:bg-gray-900 dark:hover:text-gray-100;
    @apply dark:focus:bg-gray-900 dark:focus:text-gray-100;
  }

  .test__action {
    @apply flex grow cursor-pointer appearance-none items-center gap-2 rounded-lg px-2 py-2;
    @apply bg-gray-100 text-gray-900;
    @apply hover:bg-gray-900 hover:text-gray-100;
    @apply focus:bg-gray-900 focus:text-gray-100;

    @apply dark:bg-gray-900 dark:text-gray-100;
    @apply dark:hover:bg-gray-100 dark:hover:text-gray-900;
    @apply dark:focus:bg-gray-100 dark:focus:text-gray-900;
  }

  .test__action-save {
    @apply hover:bg-blue-500 hover:text-gray-100;
    @apply focus:bg-blue-500 focus:text-gray-100;
  }

  .test__action-edit {
    @apply hover:bg-yellow-500 hover:text-gray-900;
    @apply focus:bg-yellow-500 focus:text-gray-900;
  }

  .test__action-run {
    @apply hover:bg-green-500 hover:text-gray-100;
    @apply focus:bg-green-500 focus:text-gray-100;
  }

  .test__action-delete {
    @apply text-red-500;
    @apply hover:bg-red-500 hover:text-gray-100;
    @apply focus:bg-red-500 focus:text-gray-100;
  }
</style>
