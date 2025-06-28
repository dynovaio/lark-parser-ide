<script lang="ts">
  import { createScrollArea, melt } from '@melt-ui/svelte';
  import Test from '$lib/components/Ide/Test/Item.svelte';
  import { getIdeContext } from '$lib/components/Ide/Context';

  const ideContext = getIdeContext();
  const availableTestCases = $derived.by(() => {
    return $ideContext.project?.testCases || [];
  });

  const {
    elements: {
      root: scrollAreaRoot,
      content: scrollAreaContent,
      viewport: scrollAreaViewport,
      corner: scrollAreaCorner,
      scrollbarY: scrollAreaScrollbarY,
      thumbY: scrollAreaThumbY,
      thumbX: scrollAreaThumbX,
      scrollbarX: scrollAreaScrollbarX
    }
  } = createScrollArea({
    type: 'hover',
    dir: 'ltr'
  });
</script>

<div use:melt={$scrollAreaRoot} class="test-list__root">
  <div use:melt={$scrollAreaViewport} class="test-list__viewport">
    <div use:melt={$scrollAreaContent} class="test-list__content">
      {#each availableTestCases as testCase (testCase.id)}
        <div class="test-list__item">
          <Test {testCase} isActive={testCase.id === $ideContext.testCase?.id} />
        </div>
      {/each}
    </div>
  </div>
  <div use:melt={$scrollAreaScrollbarY} class="test-list__scrollbar_y">
    <div use:melt={$scrollAreaThumbY} class="test-list__scrollbar_thumb_y"></div>
  </div>
  <div use:melt={$scrollAreaScrollbarX} class="test-list__scrollbar_x">
    <div use:melt={$scrollAreaThumbX} class="test-list__scrollbar_thumb_x"></div>
  </div>
  <div use:melt={$scrollAreaCorner}></div>
</div>

<style lang="postcss">
  @reference "../../../../app.css";

  .test-list__root {
    @apply relative block h-full w-full overflow-hidden;
    @apply bg-gray-100 text-gray-900;
    @apply dark:bg-gray-900 dark:text-gray-100;
  }

  .test-list__viewport {
    @apply relative block h-full w-full overflow-auto;
  }

  .test-list__content {
    @apply !flex w-full flex-col space-y-4;
  }

  .test-list__scrollbar_y {
    @apply flex h-full w-2 touch-none p-px pb-2 transition-colors select-none;
    @apply bg-gray-100;
    @apply dark:bg-gray-900;
  }

  .test-list__scrollbar_thumb_y {
    @apply relative flex-1 rounded-lg;
    @apply bg-orange-500;
  }

  .test-list__scrollbar_x {
    @apply flex h-2 w-full touch-none p-px pr-2 select-none;
    @apply bg-gray-100;
    @apply dark:bg-gray-900;
  }

  .test-list__scrollbar_thumb_x {
    @apply relative rounded-lg;
    @apply bg-orange-600;
  }

  .test-list__item {
    @apply w-full shrink-0 appearance-none overflow-auto rounded-lg text-left;
    @apply bg-gray-200 text-gray-900;
    @apply dark:bg-gray-800 dark:text-gray-200;
  }
</style>
