<script lang="ts">
  import List from '$lib/components/Ide/Test/List.svelte';

  import Add from 'phosphor-svelte/lib/Plus';
  import Play from 'phosphor-svelte/lib/Play';
</script>

<section class="test-manager">
  <div class="test-manager__list-wrapper">
    <List />
  </div>
  <div class="test-manager__controls">
    <button class="test-manager__control">
      <Add size={24} />
      <span>Add new test </span>
    </button>
    <button class="test-manager__control">
      <Play size={24} />
      <span>Run All Tests </span>
    </button>
  </div>
</section>

<style lang="postcss">
  @reference "../../../../app.css";

  .test-manager {
    @apply relative flex h-full w-full shrink-0 grow flex-col;
    @apply bg-gray-200 text-gray-900;
    @apply dark:bg-gray-900 dark:text-gray-100;
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
