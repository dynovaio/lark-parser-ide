<script lang="ts">
  import { createTabs, melt } from '@melt-ui/svelte';
  import { cubicInOut } from 'svelte/easing';
  import { crossfade } from 'svelte/transition';

  import { isLargeScreen, isSmallScreen } from '$lib/stores/Breakpoints';
  import { loadGrammar, type Grammar } from '$lib/utils/Grammar';
  import { PROJECT_HELLO_WORLD, SAMPLE_PROJECTS, type Project } from '$lib/utils/Project';
  import { createIdeState } from '$lib/stores/Ide';

  import ProjectManager from '$lib/components/Ide/Project/Manager.svelte';
  import StatusBar from '$lib/components/Ide/StatusBar.svelte';
  import GrammarEditor from '$lib/components/Ide/Editor.svelte';
  import TestList from '$lib/components/Ide/Test/List.svelte';
  import TreeViewer from '$lib/components/Ide/Test/TreeViewer.svelte';

  let projects = $state([...SAMPLE_PROJECTS]);
  const ideState = createIdeState({ ...PROJECT_HELLO_WORLD });

  let project: Project = $derived.by(() => {
    return $ideState.project;
  });

  let grammar: Grammar = $derived.by(() => {
    return $ideState.project.grammar;
  });

  const unsuscribe = ideState.subscribe(async (value) => {
    try {
      let grammar: Grammar = await loadGrammar(value.project.grammar);
      ideState.updateGrammar(grammar);
    } catch (error) {
      console.error(`Error loading grammar for project ${value.project.id}:`, error);
    }

    unsuscribe();
  });

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

  const [send, receive] = crossfade({
    duration: 250,
    easing: cubicInOut
  });

  const handleSelectProject = async (selectedProjectId: string) => {
    if (selectedProjectId === project.id) return;

    const selectedProject = projects.find((p) => p.id === selectedProjectId);
    if (selectedProject) {
      let grammar: Grammar = await loadGrammar(selectedProject.grammar);
      ideState.setProject({
        ...selectedProject,
        grammar: {
          ...grammar
        }
      });
    } else {
      console.error(`Project with ID ${selectedProjectId} not found.`);
    }
    tabValue.set('editor');
  };
</script>

<section class="flex h-full max-h-[calc(100vh-4.5rem)] w-screen flex-col overflow-hidden">
  <div class="w-screen flex-none shrink">
    <ProjectManager {projects} {project} onSelectProject={handleSelectProject} />
  </div>
  {#if $isLargeScreen}
    <div class="flex h-full max-h-[calc(100vh-6.5rem)] w-screen grow flex-row overflow-hidden">
      <div class="h-full w-full grow bg-gray-50">
        <GrammarEditor {grammar} />
      </div>
      <div class="w-1/5 shrink-0 bg-gray-50">
        <TestList />
      </div>
      <div class="w-1/5 shrink-0 bg-gray-50">
        <TreeViewer />
      </div>
    </div>
  {:else}
    <div use:melt={$tabRoot} class="flex w-full shrink-0 grow flex-col">
      <div
        use:melt={$tabList}
        class="flex shrink-0 flex-row items-center justify-center overflow-x-auto bg-gray-900 text-gray-100"
      >
        {#each tabs as tab (tab.id)}
          <button
            use:melt={$tabTrigger(tab.id)}
            class="relative flex-grow px-4 py-2 outline-none"
            class:bg-gray-900={$tabValue === tab.id}
          >
            {tab.title}
            {#if $tabValue === tab.id}
              <div
                in:send={{ key: 'trigger' }}
                out:receive={{ key: 'trigger' }}
                class="absolute bottom-0 left-1/2 h-1 w-full -translate-x-1/2 border-0 bg-gray-100"
              ></div>
            {/if}
          </button>
        {/each}
      </div>
      <div use:melt={$tabContent('editor')} class="grow bg-gray-100">
        <GrammarEditor {grammar} />
      </div>
      <div use:melt={$tabContent('tests')} class="grow bg-gray-100">
        {#if $isSmallScreen}
          <TestList />
          <TreeViewer />
        {:else}
          <TestList />
        {/if}
      </div>
    </div>
  {/if}
  <div class="w-screen flex-none shrink">
    <StatusBar
      projectName={project.name}
      testId={$ideState.testCase?.id}
      testStatus={$ideState.testResult?.status}
    />
  </div>
</section>
