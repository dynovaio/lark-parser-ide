<script lang="ts">
  import Edit from 'phosphor-svelte/lib/Pencil';
  import Play from 'phosphor-svelte/lib/Play';
  import Delete from 'phosphor-svelte/lib/Trash';
  import TestTube from 'phosphor-svelte/lib/TestTube';
  import CaretDown from 'phosphor-svelte/lib/CaretDown';
  import CaretUp from 'phosphor-svelte/lib/CaretUp';
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
  const ideContext = getIdeContext();

  let isShowingDetails = $state(false);
  let isEditionActive = $state(false);
  let testDescription = $state(testCase.description || '');

  const selectTestCase = (testCase: TestCase) => {
    if (testCase.id !== $ideContext.testCase?.id) {
      ideContext.setTestCase(testCase);
    }
  };

  const toggleDetails = () => {
    isShowingDetails = !isShowingDetails;
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
  class="test__wrapper"
  role="button"
  tabindex="0"
  onclick={() => selectTestCase(testCase)}
  onkeydown={() => selectTestCase(testCase)}
>
  <div class="test__header">
    <h3 class="test__title">
      <span class="test__active-indicator" class:test__active-indicator--active={isActive}>
        <TestTube size={24} weight={isActive ? 'fill' : 'regular'} />
      </span>
      <span>
        Test case {testCase.id}
      </span>
    </h3>
    {#if testCase.description}
      {#if isEditionActive}
        <input
          type="text"
          class="test__description-input"
          bind:value={testDescription}
          placeholder="Enter test case description"
        />
      {:else}
        <p class="test__description">{testCase.description}</p>
      {/if}
    {/if}
  </div>
  <div class="test__body">
    <Editor {testCase} />
  </div>
  <div class="test__body test__details">
    <div class="test__status">
      <button class="test__toggle-detail" onclick={() => toggleDetails()}>
        {#if isShowingDetails}
          <CaretUp size={24} />
        {:else}
          <CaretDown size={24} />
        {/if}
      </button>
      <div>
        Status:
        <span
          class="test__status-value"
          class:test__status-value--warning={testCase.result?.status === TestStatus.UNKNOWN ||
            !testCase.result}
          class:test__status-value--success={testCase.result?.status === TestStatus.SUCCESS}
          class:test__status-value--error={testCase.result?.status === TestStatus.FAILURE}
        >
          {testCase.result?.status || TestStatus.UNKNOWN}
        </span>
      </div>
    </div>
    {#if isShowingDetails}
      {#if testCase.result?.traceback}
        <div class="test__details--traceback-wrapper">
          <div class="test__details--traceback">
            <pre>{testCase.result.traceback}</pre>
          </div>
        </div>
      {/if}
      {#if testCase.result?.content}
        <div class="test__details--content">
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
      class:test__action--save={isEditionActive}
      class:test__action--edit={!isEditionActive}
    >
      {#if isEditionActive}
        <Save size={24} />
        <span>Save</span>
      {:else}
        <Edit size={24} />
        <span>Edit</span>
      {/if}
    </button>
    <button onclick={() => execute()} class="test__action test__action--run">
      <Play size={24} />
      <span>Run</span>
    </button>
    <button
      onclick={(event: Event) => {
        event.preventDefault();
        event.stopPropagation();
        remove();
      }}
      class="test__action test__action--delete"
    >
      <Delete size={24} />
      <span>Delete</span>
    </button>
  </div>
</div>

<style lang="postcss">
  @reference "../../../../app.css";

  .test__wrapper {
    @apply flex w-full shrink-0 appearance-none flex-col overflow-auto rounded-lg text-left;
  }

  .test__header {
    @apply flex flex-col gap-4 p-4;
  }

  .test__body {
    @apply p-4;
  }

  .test__footer {
    @apply flex items-center justify-between gap-x-4 p-4;
  }

  .test__active-indicator {
    @apply flex shrink-0 cursor-pointer appearance-none items-center justify-center gap-2 rounded-lg px-2 py-2;
  }

  .test__active-indicator--active {
    @apply text-orange-500;
  }

  .test__title {
    @apply flex items-center justify-start gap-4 font-semibold;
  }

  .test__description-input {
    @apply form-input w-full rounded-lg px-3 py-2;
    @apply bg-gray-100 text-gray-900;
    @apply dark:bg-gray-900 dark:text-gray-100;
  }

  .test__status {
    @apply flex flex-row items-center gap-4;
  }

  .test__status-value {
    @apply font-semibold;
  }

  .test__status-value--warning {
    @apply text-yellow-700;
    @apply dark:text-yellow-500;
  }

  .test__status-value--success {
    @apply text-green-700;
    @apply dark:text-green-500;
  }

  .test__status-value--error {
    @apply text-red-700;
    @apply dark:text-red-500;
  }

  .test__details {
    @apply flex flex-col gap-4;
  }

  .test__details--traceback-wrapper {
    @apply overflow-hidden rounded-lg;
  }

  .test__details--traceback {
    @apply max-h-128 w-full overflow-auto rounded-lg p-4 font-mono text-[0.875rem];
    @apply bg-gray-100 text-gray-900;
    @apply dark:bg-gray-900 dark:text-gray-100;
  }

  .test__details--traceback :global(pre) {
    @apply h-auto w-full whitespace-pre-wrap;
  }

  .test__details--content {
    @apply w-full overflow-auto rounded-lg font-mono text-[0.875rem];
    @apply bg-gray-100 text-gray-900;
    @apply dark:bg-gray-900 dark:text-gray-100;
  }

  .test__details--content :global(pre) {
    @apply h-auto w-full whitespace-pre-wrap;
  }

  .test__toggle-detail {
    @apply flex shrink-0 cursor-pointer appearance-none items-center justify-center gap-2 rounded-lg px-2 py-2;
    @apply bg-gray-100 text-gray-900;
    @apply hover:bg-gray-900 hover:text-gray-100;
    @apply focus:bg-gray-900 focus:text-gray-100;

    @apply dark:bg-gray-900 dark:text-gray-100;
    @apply dark:hover:bg-gray-100 dark:hover:text-gray-900;
    @apply dark:focus:bg-gray-100 dark:focus:text-gray-900;
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

  .test__action--save {
    @apply hover:bg-blue-500 hover:text-gray-100;
    @apply focus:bg-blue-500 focus:text-gray-100;
  }

  .test__action--edit {
    @apply hover:bg-yellow-500 hover:text-gray-900;
    @apply focus:bg-yellow-500 focus:text-gray-900;
  }

  .test__action--run {
    @apply hover:bg-green-500 hover:text-gray-100;
    @apply focus:bg-green-500 focus:text-gray-100;
  }

  .test__action--delete {
    @apply hover:bg-red-500 hover:text-gray-100;
    @apply focus:bg-red-500 focus:text-gray-100;
  }
</style>
