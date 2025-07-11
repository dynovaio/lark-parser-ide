<script lang="ts">
  import Check from 'phosphor-svelte/lib/CheckCircle';
  import Code from 'phosphor-svelte/lib/Code';
  import Error from 'phosphor-svelte/lib/XCircle';
  import Spinner from 'phosphor-svelte/lib/Spinner';
  import Warning from 'phosphor-svelte/lib/WarningCircle';

  import { getIdeContext } from '$lib/components/Ide/Context';
  import { TestStatus } from '$lib/utils/TestCase';

  const ideStatus = getIdeContext();

  let projectName = $derived.by(() => $ideStatus.project?.name || '');
  let testId = $derived.by(() => $ideStatus.testCase?.id || null);
  let testStatus = $derived.by(() => $ideStatus.testResult?.status || TestStatus.UNKNOWN);
</script>

<div class="statusbar">
  <div class="statusbar__section" class:status-warning={!projectName}>
    {#if !projectName}
      <Warning />
    {:else}
      <Code />
    {/if}
    <div>{projectName || 'No project selected'}</div>
  </div>
  <div class="statusbar__section" class:status-warning={!testId}>
    {#if testId}
      <span>
        Test {testId}
      </span>
      <span> : </span>
      <span
        class:status-error={testStatus === TestStatus.FAILURE}
        class:status-success={testStatus === TestStatus.SUCCESS}
        class:status-warning={testStatus === TestStatus.UNKNOWN}
      >
        {testStatus}
      </span>
      <span
        class:status-error={testStatus === TestStatus.FAILURE}
        class:status-success={testStatus === TestStatus.SUCCESS}
        class:status-warning={testStatus === TestStatus.UNKNOWN}
      >
        {#if testStatus === TestStatus.FAILURE}
          <Error />
        {:else if testStatus === TestStatus.PARSING}
          <Spinner class="animate-spin" />
        {:else if testStatus === TestStatus.SUCCESS}
          <Check />
        {:else if testStatus === TestStatus.UNKNOWN}
          <Warning />
        {/if}
      </span>
    {:else}
      <Warning />
      <span>No test selected</span>
    {/if}
  </div>
  <div class="statusbar__border"></div>
</div>

<style lang="postcss">
  @reference "../../../app.css";

  .statusbar {
    @apply relative flex h-8 w-full flex-row justify-between px-4 py-2 text-sm;
    @apply bg-gray-200 text-gray-900;
    @apply dark:bg-gray-800 dark:text-gray-100;
  }

  .statusbar__border {
    @apply absolute top-0 bottom-0 left-0 z-10 h-px w-full;
    @apply bg-gray-300;
    @apply dark:bg-gray-700;
  }

  .statusbar__section {
    @apply flex shrink-0 flex-row items-center gap-x-2;
  }

  .status-warning,
  :global(svg).status-warning {
    @apply text-yellow-700;
    @apply dark:text-yellow-500;
  }

  .status-success,
  :global(svg).status-success {
    @apply text-green-700;
    @apply dark:text-green-500;
  }

  .status-error,
  :global(svg).status-error {
    @apply text-red-700;
    @apply dark:text-red-500;
  }
</style>
