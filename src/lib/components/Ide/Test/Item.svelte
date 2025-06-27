<script lang="ts">
  import Edit from 'phosphor-svelte/lib/Pencil';
  import Play from 'phosphor-svelte/lib/Play';
  import Delete from 'phosphor-svelte/lib/Trash';
  import Dot from 'phosphor-svelte/lib/Code';

  import Editor from '$lib/components/Ide/Test/Editor.svelte';

  import { TestStatus, type TestCase } from '$lib/utils/TestCase';
  import { getIdeContext } from '$lib/components/Ide/Context';

  interface Props {
    testCase: TestCase;
    isActive?: boolean;
  }

  let { testCase, isActive = $bindable(false) }: Props = $props();
  const ideContext = getIdeContext();

  const selectTestCase = (testCase: TestCase) => {
    if (testCase.id !== $ideContext.testCase?.id) {
      ideContext.setTestCase(testCase);
    }
  };
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
      <span>
        Test case {testCase.id}
      </span>
      {#if isActive}
        <span class="test__active-indicator">
          <Dot size={24} />
        </span>
      {/if}
    </h3>
    {#if testCase.description}
      <p class="test__description">{testCase.description}</p>
    {/if}
  </div>
  <div class="test__divider"></div>
  <div class="test__body">
    <Editor {testCase} />
  </div>
  <div class="test__divider"></div>
  <div class="test__body">
    {testCase.result?.status || TestStatus.UNKNOWN}
  </div>
  <div class="test__divider"></div>
  <div class="test__footer">
    <button class="test__action test__action--edit">
      <Edit size={24} />
      <span>Edit</span>
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
  .test__title {
    @apply flex items-center justify-between gap-2 font-semibold;
  }
  .test__active-indicator {
    @apply flex items-center justify-center;
    @apply text-orange-500;
  }
  .test__divider {
    @apply h-px;
    @apply bg-gray-100;
    @apply dark:bg-gray-900;
  }
  .test__body {
    @apply p-4;
  }

  .test__footer {
    @apply flex items-center justify-between gap-x-4 p-4;
  }

  .test__action {
    @apply flex grow cursor-pointer appearance-none items-center justify-center gap-2 rounded-lg px-4 py-2;
    @apply bg-gray-100 text-gray-900;
    @apply hover:bg-gray-900 hover:text-gray-100;
    @apply focus:bg-gray-900 focus:text-gray-100;

    @apply dark:bg-gray-900 dark:text-gray-100;
    @apply dark:hover:bg-gray-100 dark:hover:text-gray-900;
    @apply dark:focus:bg-gray-100 dark:focus:text-gray-900;
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
