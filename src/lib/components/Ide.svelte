<script lang="ts">
  import { createTabs, melt } from '@melt-ui/svelte';

  import Editor from '$lib/components/Ide/Editor.svelte';
  import ProjectManager from '$lib/components/Ide/Project/Manager.svelte';
  import StatusBar from '$lib/components/Ide/StatusBar.svelte';
  import TestManager from '$lib/components/Ide/Test/Manager.svelte';
  import { setIdeContext } from '$lib/components/Ide/Context';

  import { isLargeScreen } from '$lib/stores/Breakpoints';
  import { createIdeState } from '$lib/stores/Ide';

  import { loadGrammar, type Grammar } from '$lib/utils/Grammar';
  import { PROJECT_HELLO_WORLD } from '$lib/utils/Project';

  const ideState = createIdeState({ ...PROJECT_HELLO_WORLD });

  const unsuscribe = ideState.subscribe(async (value) => {
    try {
      let grammar: Grammar = await loadGrammar(value.project.grammar, false);
      ideState.setGrammar(grammar);
    } catch (error) {
      console.error(`Error loading grammar for project ${value.project.id}:`, error);
    }
  });
  unsuscribe();

  const {
    elements: { root: tabRoot, list: tabList, content: tabContent, trigger: tabTrigger },
    states: { value: tabValue }
  } = createTabs({
    defaultValue: 'editor'
  });

  const tabs = [
    { id: 'editor', title: 'Editor' },
    { id: 'tests', title: 'Tests' }
  ];

  const handleSelectProject = async () => {
    tabValue.set('editor');
  };

  setIdeContext(ideState);
</script>

<section class="lark-ide">
  <div class="lark-ide__header">
    <ProjectManager onSelectProject={handleSelectProject} />
  </div>
  {#if $isLargeScreen}
    <div class="lark-ide__main">
      <div class="lark-ide__section">
        <Editor />
      </div>
      <div class="lark-ide__section">
        <TestManager />
      </div>
    </div>
  {:else}
    <div use:melt={$tabRoot} class="lark-ide__main">
      <div use:melt={$tabList} class="lark-ide__tab-list">
        {#each tabs as tab (tab.id)}
          <button
            use:melt={$tabTrigger(tab.id)}
            class="lark-ide__tab"
            class:lark-ide__tab--active={$tabValue === tab.id}
          >
            {tab.title}
          </button>
        {/each}
      </div>
      <div use:melt={$tabContent('editor')} class="lark-ide__tab-content">
        <div class="lark-ide__section">
          <Editor />
        </div>
      </div>
      <div use:melt={$tabContent('tests')} class="lark-ide__tab-content">
        <div class="lark-ide__section">
          <TestManager />
        </div>
      </div>
    </div>
  {/if}
  <div class="lark-ide__footer">
    <StatusBar />
  </div>
</section>

<style lang="postcss">
  @reference "../../app.css";

  .lark-ide {
    @apply flex h-full max-h-[calc(100vh-4.5rem)] w-full grow flex-col gap-4 overflow-hidden;
  }

  .lark-ide__header {
    @apply w-full shrink-0;
  }

  .lark-ide__main {
    @apply flex h-full max-h-[calc(100vh-4.5rem-2rem-4.5rem)] w-full shrink-0 grow flex-col overflow-hidden;
    @apply lg:flex-row;
  }

  .lark-ide__section {
    @apply relative h-full w-full shrink-0 grow p-4;
    @apply lg:w-1/2 lg:py-0 lg:pr-2;

    &:last-child {
      @apply lg:pr-4 lg:pl-2;
    }
  }

  .lark-ide__footer {
    @apply w-full shrink-0;
  }

  .lark-ide__tab-list {
    @apply flex shrink-0 flex-row items-center justify-center overflow-x-auto;
    @apply bg-gray-100 text-gray-900;
    @apply dark:bg-gray-900 dark:text-gray-100;
  }

  .lark-ide__tab {
    @apply relative flex-grow appearance-none px-4 py-2 inset-shadow-sm transition duration-250 outline-none;
    @apply bg-gray-300 text-gray-500 inset-shadow-gray-900/50;
    @apply dark:bg-gray-300 dark:text-gray-500 dark:inset-shadow-gray-900/50;
  }

  .lark-ide__tab--active {
    @apply inset-shadow-none;
    @apply bg-gray-100 text-gray-900;
    @apply dark:bg-gray-900 dark:text-gray-100;
  }

  .lark-ide__tab-content {
    @apply relative h-full max-h-[calc(100vh-4.5rem-2rem-3.5rem-2.5rem)] w-full shrink-0 grow;
  }
</style>
