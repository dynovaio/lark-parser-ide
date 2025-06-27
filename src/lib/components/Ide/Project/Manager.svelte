<script lang="ts">
  import {
    createDialog,
    melt,
    createScrollArea,
    createDropdownMenu,
    createSelect
  } from '@melt-ui/svelte';
  import { fade, fly } from 'svelte/transition';

  import Add from 'phosphor-svelte/lib/Plus';
  import Check from 'phosphor-svelte/lib/Check';
  import Change from 'phosphor-svelte/lib/Swap';
  import Close from 'phosphor-svelte/lib/X';
  import Code from 'phosphor-svelte/lib/Code';
  import Download from 'phosphor-svelte/lib/DownloadSimple';
  import Menu from 'phosphor-svelte/lib/DotsThreeVertical';
  import Settings from 'phosphor-svelte/lib/Gear';
  import Trash from 'phosphor-svelte/lib/Trash';
  import CaretDown from 'phosphor-svelte/lib/CaretDown';

  import { getIdeContext } from '$lib/components/Ide/Context';

  import { isLargeScreen } from '$lib/stores/Breakpoints';

  import { loadGrammar } from '$lib/utils/Grammar';
  import { PROJECT_HELLO_WORLD, PROJECT_TEMPLATE, type Project } from '$lib/utils/Project';

  interface Props {
    onSelectProject?: (projectId: string) => void;
    onCreateProject?: (project: Project) => void;
    onDownloadProject?: (project: Project) => void;
    onConfigureProject?: (project: Project) => void;
    onDeleteProject?: (projectId: string) => void;
  }

  let {
    onSelectProject
    // onCreateProject,
    // onDownloadProject,
    // onConfigureProject,
    // onDeleteProject
  }: Props = $props();

  const ideContext = getIdeContext();

  let { currentProject, availableProjects } = $derived.by(() => ({
    currentProject: $ideContext.project,
    availableProjects: $ideContext.availableProjects
  }));

  const {
    elements: { trigger: selectTrigger, menu: selectMenu, option: selectOption },
    states: { open: isSelectOpen }
  } = createSelect<string>({
    forceVisible: true,
    positioning: {
      placement: 'bottom',
      fitViewport: true,
      sameWidth: true
    },
    defaultSelected: { value: (() => currentProject.id)(), label: (() => currentProject.name)() }
  });

  const selectProjectHandler = async (projectId: string) => {
    let selectedProject = availableProjects.find((p) => p.id === projectId) || PROJECT_HELLO_WORLD;
    let selectedGrammar = await loadGrammar(selectedProject.grammar, false);

    selectedProject = {
      ...selectedProject,
      grammar: selectedGrammar
    };

    ideContext.setProject(selectedProject);

    if (onSelectProject) {
      onSelectProject(projectId);
    } else {
      console.warn('No `onSelectProject` function provided');
    }

    isSelectOpen.set(false);
  };
</script>

<div class="project-manager">
  <div class="project-manager__section grow">
    <div class="project-manager__selector__wrapper">
      <button
        use:melt={$selectTrigger}
        class="project-manager__item project-manager__selector"
        aria-label="Food"
      >
        {currentProject.name}
        <CaretDown class="size-5" />
      </button>
      {#if $isSelectOpen}
        <div class="project-manager__selector__options" use:melt={$selectMenu}>
          {#each availableProjects as project (project.id)}
            <button
              use:melt={$selectOption({ value: project.id, label: project.name })}
              onclick={() => selectProjectHandler(project.id)}
              class="project-manager__selector__option"
            >
              {#if project.id === currentProject.id}
                <Check size={24} />
              {/if}
              <span class="grow">{project.name}</span>
            </button>
          {/each}
        </div>
      {/if}
    </div>
  </div>
  <div class="project-manager__section">
    <div class="project-manager__item">
      <Menu size={24} />
    </div>
  </div>
</div>

<style lang="postcss">
  @reference "../../../../app.css";

  .project-manager {
    @apply relative flex shrink-0 flex-row gap-x-2 p-4;
    @apply bg-gray-100 text-gray-900;
    @apply dark:bg-gray-900 dark:text-gray-100;
  }

  .project-manager__section {
    @apply flex flex-row gap-x-2;
  }

  .project-manager__item {
    @apply flex shrink-0 cursor-pointer appearance-none flex-row items-center gap-x-2 rounded-lg px-2 py-2 transition duration-250 outline-none;
    @apply bg-gray-200 text-gray-900;
    @apply hover:bg-gray-800 hover:text-gray-100;
    @apply focus:bg-gray-800 focus:text-gray-100;

    @apply dark:bg-gray-800 dark:text-gray-100;
    @apply dark:hover:bg-gray-200 dark:hover:text-gray-900;
    @apply dark:focus:bg-gray-200 dark:focus:text-gray-900;
  }

  .project-manager__item :global(svg) {
    @apply block shrink-0;
  }

  .project-manager__selector__wrapper {
    @apply relative flex shrink grow flex-col gap-y-4;
  }

  .project-manager__selector {
    @apply line-clamp-1 flex shrink cursor-pointer appearance-none flex-row items-center justify-between gap-x-2 rounded-lg px-4 py-2 transition duration-250 outline-none;
  }

  .project-manager__selector__options {
    @apply z-10 flex max-h-[20rem] flex-col gap-y-2 overflow-y-auto rounded-lg p-2 shadow;
    @apply bg-gray-200 text-gray-900;
    @apply dark:bg-gray-800 dark:text-gray-100;
  }

  .project-manager__selector__option {
    @apply flex shrink-0 cursor-pointer appearance-none flex-row items-center gap-x-2 rounded-lg px-2 py-2 text-left transition duration-250 outline-none;
    @apply hover:bg-gray-800 hover:text-gray-200;

    @apply dark:hover:bg-gray-200 dark:hover:text-gray-900;
  }
</style>
