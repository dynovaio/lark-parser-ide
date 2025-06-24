<script lang="ts">
  import { createTabs, melt } from '@melt-ui/svelte';
  import { cubicInOut } from 'svelte/easing';
  import { crossfade } from 'svelte/transition';

  import { isLargeScreen, isSmallScreen } from '$lib/stores/Breakpoints';

  import Projects from '$lib/components/Ide/Projects.svelte';
  import StatusBar from '$lib/components/Ide/StatusBar.svelte';
  import GrammarEditor from '$lib/components/Ide/GrammarEditor.svelte';
  import TestList from '$lib/components/Ide/TestList.svelte';
  import TreeViewer from '$lib/components/Ide/TreeViewer.svelte';

  import { TestStatus } from '$lib/stores/Ide';

  let projectName = 'My Project';
  let testId = '1';
  let testStatus = TestStatus.FAILURE;

  const {
    elements: { root, list, content, trigger },
    states: { value }
  } = createTabs({
    defaultValue: 'editor'
  });

  const tabs = [
    { id: 'editor', title: 'Editor' },
    { id: 'tests', title: 'Tests' }
  ];

  const [send, receive] = crossfade({
    duration: 250,
    easing: cubicInOut
  });
</script>

<section class="flex h-full w-full flex-col">
  {#if $isLargeScreen}
    <div class="flex grow flex-row overflow-auto">
      <div class="w-64 shrink bg-gray-800 text-gray-100">
        <Projects />
      </div>
      <div class="grow bg-gray-50">
        <GrammarEditor />
      </div>
      <div class="w-1/5 shrink bg-gray-50">
        <TestList />
      </div>
      <div class="w-1/5 shrink bg-gray-50">
        <TreeViewer />
      </div>
    </div>
  {:else}
    <div use:melt={$root} class="flex w-full grow flex-col">
      <div
        use:melt={$list}
        class="flex shrink-0 flex-row items-center justify-center overflow-x-auto bg-gray-800 text-gray-100"
      >
        {#each tabs as tab (tab.id)}
          <button
            use:melt={$trigger(tab.id)}
            class="relative flex-grow px-4 py-2 outline-none"
            class:bg-gray-800={$value === tab.id}
          >
            {tab.title}
            {#if $value === tab.id}
              <div
                in:send={{ key: 'trigger' }}
                out:receive={{ key: 'trigger' }}
                class="absolute bottom-0 left-1/2 h-1 w-full -translate-x-1/2 border-0 bg-gray-100"
              ></div>
            {/if}
          </button>
        {/each}
      </div>
      <div use:melt={$content('editor')} class="grow bg-gray-100">
        <GrammarEditor />
      </div>
      <div use:melt={$content('tests')} class="grow bg-gray-100">
        {#if $isSmallScreen}
          <TestList />
          <TreeViewer />
        {:else}
          <TestList />
        {/if}
      </div>
    </div>
  {/if}
  <div class="w-full flex-none shrink">
    <StatusBar {projectName} {testId} {testStatus} />
  </div>
</section>
