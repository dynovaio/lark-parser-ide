<script lang="ts">
  import Edit from 'phosphor-svelte/lib/Pencil';
  import Play from 'phosphor-svelte/lib/Play';
  import Delete from 'phosphor-svelte/lib/Trash';
  import TestTube from 'phosphor-svelte/lib/TestTube';
  import CaretDown from 'phosphor-svelte/lib/CaretDown';
  import CaretUp from 'phosphor-svelte/lib/CaretUp';
  import Save from 'phosphor-svelte/lib/FloppyDisk';

  import Editor from '$lib/components/Ide/Test/Editor.svelte';

  import { TestStatus, type TestCase } from '$lib/utils/TestCase';
  import { getIdeContext } from '$lib/components/Ide/Context';

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
    isEditionActive = !isEditionActive;
  };

  const save = () => {
    ideContext.setTestCase({
      ...testCase,
      description: testDescription
    });
  };

  $effect(() => {
    if ($ideContext.testCase?.id !== testCase.id) {
      isEditionActive = false;
      isShowingDetails = false;

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
  <div class="test__body">
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
  </div>
  {#if isShowingDetails}
    <div class="test__body">
      <div class="test__details--message">
        {#if testCase.result?.status === TestStatus.SUCCESS}
          Test passed successfully!
        {:else if testCase.result?.status === TestStatus.FAILURE}
          {testCase.result?.message || 'No error message provided.'}
        {:else if testCase.result?.status === TestStatus.UNKNOWN || !testCase.result}
          Test status is unknown or not yet run.
        {:else if testCase.result?.status === TestStatus.PARSING}
          Test is currently being executed.
        {/if}
      </div>
      {#if testCase.result?.traceback}
        <div class="test__details--traceback">
          <pre>{testCase.result.traceback}</pre>
        </div>
      {/if}
      {#if testCase.result?.content}
        <div class="test__details--content">
          <pre>{testCase.result.content}</pre>
        </div>
      {/if}
    </div>
  {/if}

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
    <button class="test__action test__action--run">
      <Play size={24} />
      <span>Run</span>
    </button>
    <button class="test__action test__action--delete">
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
