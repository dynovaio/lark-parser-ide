<script lang="ts">
  import { createDialog, melt, createScrollArea, createDropdownMenu } from '@melt-ui/svelte';
  import { fade, fly } from 'svelte/transition';

  import Code from 'phosphor-svelte/lib/Code';
  import Menu from 'phosphor-svelte/lib/DotsThreeVertical';
  import Add from 'phosphor-svelte/lib/Plus';
  import Trash from 'phosphor-svelte/lib/Trash';
  import Download from 'phosphor-svelte/lib/DownloadSimple';
  import Close from 'phosphor-svelte/lib/X';
  import Settings from 'phosphor-svelte/lib/Gear';
  import Change from 'phosphor-svelte/lib/Swap';

  import { isLargeScreen } from '$lib/stores/Breakpoints';
  import { PROJECT_TEMPLATE, type Project } from '$lib/utils/Project';

  interface Props {
    projects: Project[];
    project: Project;
    onSelectProject?: (projectId: string) => void;
    onCreateProject?: (project: Project) => void;
    onDownloadProject?: (project: Project) => void;
    onConfigureProject?: (project: Project) => void;
    onDeleteProject?: (projectId: string) => void;
  }

  let {
    projects: availableProjects,
    project: currentProject,
    onSelectProject,
    onCreateProject,
    onDownloadProject,
    onConfigureProject,
    onDeleteProject
  }: Props = $props();

  const {
    elements: {
      trigger: listTrigger,
      title: listTitle,
      overlay: listOverlay,
      content: listContent,
      close: listClose,
      portalled: listPortalled
    },
    states: { open: listOpen }
  } = createDialog({
    forceVisible: true
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

  isLargeScreen.subscribe((value) => {
    if (value) {
      listOpen.set(false);
    }
  });

  const {
    elements: {
      trigger: dropDownTrigger,
      menu: dropDownMenu,
      item: dropDownItem,
      separator: dropDownSeparator,
      arrow: dropDownArrow
    },
    states: { open: dropDownOpen }
  } = createDropdownMenu({
    forceVisible: true,
    loop: true
  });

  const selectProjectHandler = (projectId: string) => {
    if (onSelectProject) {
      onSelectProject(projectId);
    } else {
      console.warn('No `onSelectProject` function provided');
    }
    listOpen.set(false);
  };

  const createProjectHandler = (project: Project) => {
    if (onCreateProject) {
      onCreateProject(project);
    } else {
      console.warn('No `onCreateProject` function provided');
    }
  };

  const downloadProjectHandler = (project: Project) => {
    if (onDownloadProject) {
      onDownloadProject(project);
    } else {
      console.warn('No `onDownloadProject` function provided');
    }
  };

  const configureProjectHandler = (project: Project) => {
    if (onConfigureProject) {
      onConfigureProject(project);
    } else {
      console.warn('No `onConfigureProject` function provided');
    }
  };

  const deleteProjectHandler = (projectId: string) => {
    if (onDeleteProject) {
      onDeleteProject(projectId);
    } else {
      console.warn('No `onDeleteProject` function provided');
    }
  };
</script>

<div class="relative flex shrink-0 flex-row gap-x-4 bg-gray-900 p-4 text-white">
  <div
    class="line-clamp-1 flex grow flex-row items-center gap-x-2 rounded-lg border border-gray-100 p-2"
  >
    <Code size={24} />
    <span>
      {currentProject.name}
    </span>
  </div>
  <div
    use:melt={$dropDownTrigger}
    class="flex shrink flex-row items-center gap-x-2 rounded-lg border border-gray-100 p-2"
  >
    <Menu size={24} />
  </div>
</div>

{#if $listOpen}
  <div class="" use:melt={$listPortalled}>
    <div
      use:melt={$listOverlay}
      class="fixed inset-0 z-50 bg-black/50"
      transition:fade={{ duration: 150 }}
    ></div>
    <div
      use:melt={$listContent}
      transition:fly={{
        y: '100vh',
        duration: 300,
        opacity: 1
      }}
      class="fixed top-1/2 left-1/2 z-50 max-h-[85vh] w-[90vw] max-w-[20rem] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg bg-gray-100 pb-2 text-gray-900 shadow-lg"
    >
      <div class="flex items-center justify-between p-4">
        <h4 use:melt={$listTitle} class="font-semibold">Select project</h4>
        <button
          use:melt={$listClose}
          aria-label="close"
          class="flex h-6 w-6 appearance-none
                items-center justify-center rounded-full p-1 text-orange-800
                hover:bg-orange-100 focus:shadow-orange-400"
        >
          <Close size={24} />
        </button>
      </div>
      <div
        use:melt={$scrollAreaRoot}
        class="relative h-full max-h-[calc(85vh-4rem)] w-full overflow-hidden bg-gray-100 text-gray-900"
      >
        <div use:melt={$scrollAreaViewport} class="h-full max-h-[calc(85vh-4rem)] w-full">
          <div use:melt={$scrollAreaContent} class="flex flex-col space-y-4 p-4">
            {#each availableProjects as project (project.id)}
              {#if project.id !== currentProject.id}
                <button
                  onclick={() => selectProjectHandler(project.id)}
                  class="w-full rounded-lg border border-gray-900 p-2 transition
                        duration-250 hover:bg-gray-900 hover:text-gray-100 focus:bg-gray-900 focus:text-gray-100"
                  aria-label="Select project {project.name}"
                >
                  {project.name}
                </button>
              {/if}
            {/each}
          </div>
        </div>
        <div
          use:melt={$scrollAreaScrollbarY}
          class="flex h-full w-2 touch-none rounded-lg bg-gray-200 p-px transition-colors select-none"
        >
          <div use:melt={$scrollAreaThumbY} class="relative flex-1 rounded-lg bg-orange-600"></div>
        </div>
        <div
          use:melt={$scrollAreaScrollbarX}
          class="flex h-2 w-full touch-none border-t border-t-transparent bg-orange-800/10 p-px select-none"
        >
          <div use:melt={$scrollAreaThumbX} class="relative rounded-lg bg-orange-600"></div>
        </div>
        <div use:melt={$scrollAreaCorner}>pichula</div>
      </div>
    </div>
  </div>
{/if}

{#if $dropDownOpen}
  <div
    use:melt={$dropDownMenu}
    transition:fly={{ duration: 150, y: -10 }}
    class="z-40
      flex max-h-[300px] min-w-[220px] flex-col rounded-md bg-gray-100
      py-2 text-gray-900 shadow-lg ring-0 shadow-neutral-900/30
      outline-none lg:max-h-none"
  >
    <button
      use:melt={$dropDownItem}
      onclick={() => configureProjectHandler(currentProject)}
      class="list-item"
    >
      <Settings size={16} class="shrink-0" />
      <span class="grow text-left">Configure parser</span>
    </button>
    <button
      use:melt={$dropDownItem}
      onclick={() => downloadProjectHandler(currentProject)}
      class="list-item"
    >
      <Download size={16} class="shrink-0" />
      <span class="grow text-left">Download grammar</span>
    </button>
    <div use:melt={$dropDownSeparator} class="h-px w-full bg-gray-300"></div>
    <button use:melt={$dropDownItem} use:melt={$listTrigger} class="list-item">
      <Change size={16} class="shrink-0" />
      <span class="grow text-left">Change Project</span>
    </button>
    <button
      use:melt={$dropDownItem}
      onclick={() => createProjectHandler({ ...PROJECT_TEMPLATE })}
      class="list-item"
    >
      <Add size={16} class="shrink-0" />
      <span class="grow text-left">New Project</span>
    </button>
    <div use:melt={$dropDownSeparator} class="h-px w-full bg-gray-300"></div>
    <button
      use:melt={$dropDownItem}
      onclick={() => deleteProjectHandler(currentProject.id)}
      class="flex appearance-none flex-row items-center gap-x-2 px-4 py-2 text-red-500 hover:bg-red-100 focus:bg-red-100"
    >
      <Trash size={16} class="shrink-0" />
      <span class="grow text-left">Delete Project</span>
    </button>
    <div use:melt={$dropDownArrow}></div>
  </div>
{/if}

<style lang="postcss">
  @reference "../../../../app.css";

  .list-item {
    @apply flex appearance-none flex-row items-center gap-x-2 px-4 py-2;
  }

  .list-item:hover,
  .list-item:focus {
    @apply bg-gray-200;
  }
</style>
