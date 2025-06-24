<script lang="ts">
  import Check from 'phosphor-svelte/lib/CheckCircle';
  import Spinner from 'phosphor-svelte/lib/Spinner';
  import Warning from 'phosphor-svelte/lib/WarningCircle';
  import Error from 'phosphor-svelte/lib/XCircle';

  import { TestStatus } from '$lib/stores/Ide';

  interface Props {
    projectName?: string;
    testId?: number;
    testStatus?: TestStatus;
  }

  let { projectName, testId, testStatus = TestStatus.UNKNOWN }: Props = $props();
</script>

<div
  class="relative flex h-8 w-full flex-row justify-between bg-gray-800 px-4 py-2 text-sm text-gray-100"
>
  <div class="flex shrink-0 flex-row items-center space-x-2">
    {#if !projectName}
      <Warning class="text-yellow-400" />
    {/if}
    <div>{projectName || 'No project selected'}</div>
  </div>
  <div class="flex shrink-0 flex-row items-center space-x-2">
    {#if testId}
      <span>
        Test {testId}
      </span>
      <span> : </span>
      <span
        class:text-red-400={testStatus === TestStatus.FAILURE}
        class:text-green-300={testStatus === TestStatus.SUCCESS}
        class:text-yellow-300={testStatus === TestStatus.UNKNOWN}
      >
        {testStatus}
      </span>
      {#if testStatus === TestStatus.FAILURE}
        <Error class="text-red-400" />
      {:else if testStatus === TestStatus.PARSING}
        <Spinner class="animate-spin" />
      {:else if testStatus === TestStatus.SUCCESS}
        <Check class="text-green-300" />
      {:else if testStatus === TestStatus.UNKNOWN}
        <Warning class="text-yellow-300" />
      {/if}
    {:else}
      <Warning class="text-yellow-300" />
      <span>No test selected</span>
    {/if}
  </div>
</div>
