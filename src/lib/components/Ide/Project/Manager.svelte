<script lang="ts">
  import { createDialog, melt, createDropdownMenu, createSelect } from '@melt-ui/svelte';
  import { fade, fly } from 'svelte/transition';

  import Add from 'phosphor-svelte/lib/Plus';
  import Check from 'phosphor-svelte/lib/Check';
  import Save from 'phosphor-svelte/lib/FloppyDisk';
  import Download from 'phosphor-svelte/lib/DownloadSimple';
  import Menu from 'phosphor-svelte/lib/DotsThreeVertical';
  import Settings from 'phosphor-svelte/lib/Gear';
  import Trash from 'phosphor-svelte/lib/Trash';
  import CaretDown from 'phosphor-svelte/lib/CaretDown';

  import { getIdeContext } from '$lib/components/Ide/Context';

  import { loadGrammar, downloadGrammar } from '$lib/utils/Grammar';
  import { PROJECT_HELLO_WORLD, PROJECT_TEMPLATE, type Project } from '$lib/utils/Project';
  import {
    EARLEY_PARSER,
    AVAILABLE_PARSING_ALGORITHMS,
    ParserAmbiguity,
    type ParserAmbiguity as ParserAmbiguityType,
    type ParsingAlgorithm,
    type ParserOptions
  } from '$lib/utils/Parser';

  interface Props {
    onSelectProject?: (projectId: string) => void;
    onCreateProject?: (project: Project) => void;
    onDownloadProject?: (project: Project) => void;
    onEditProject?: (project: Project) => void;
    onDeleteProject?: (projectId: string) => void;
  }

  interface FormData {
    id: string;
    name: string;
    grammarUri?: string | null;
    parserAlgorithm?: ParsingAlgorithm;
    parserKeepAllTokens?: boolean | null;
    parserAmbiguity?: ParserAmbiguityType | null;
    parserMaybePlaceholders?: boolean | null;
  }

  enum FormAction {
    CREATE = 'create',
    EDIT = 'edit'
  }

  let {
    onSelectProject,
    onCreateProject,
    onDownloadProject,
    onEditProject,
    onDeleteProject
  }: Props = $props();

  const ideContext = getIdeContext();

  let { currentProject, availableProjects } = $derived.by(() => ({
    currentProject: $ideContext.project,
    availableProjects: $ideContext.availableProjects
  }));

  let formAction = $state(FormAction.CREATE);
  let formData: FormData = $state({
    id: crypto.randomUUID() as string,
    name: '',
    grammarUri: null,
    parserAlgorithm: EARLEY_PARSER,
    parserKeepAllTokens: false,
    parserAmbiguity: null,
    parserMaybePlaceholders: true
  });

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

  const {
    elements: { trigger: dropDownTrigger, menu: dropDownMenu, item: dropDownItem },
    states: { open: dropDownOpen }
  } = createDropdownMenu({
    forceVisible: true,
    loop: true
  });

  const {
    elements: {
      trigger: formTrigger,
      title: formTitle,
      overlay: formOverlay,
      content: formContent,
      close: formClose,
      portalled: formPortalled
    },
    states: { open: formOpen }
  } = createDialog({
    forceVisible: true
  });

  const {
    elements: {
      trigger: deleteTrigger,
      title: deleteTitle,
      overlay: deleteOverlay,
      content: deleteContent,
      close: deleteClose,
      portalled: deletePortalled
    },
    states: { open: deleteOpen }
  } = createDialog({
    forceVisible: true
  });

  const selectProject = async (projectId: string) => {
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

  const prepareForm = (action: FormAction) => {
    formAction = action;
    if (action === FormAction.EDIT) {
      formData = {
        id: currentProject.id,
        name: currentProject.name,
        grammarUri: currentProject.grammar.uri,
        parserAlgorithm: currentProject.parserOptions.algorithm,
        parserKeepAllTokens: currentProject.parserOptions.keepAllTokens || false,
        parserAmbiguity: currentProject.parserOptions.ambiguity || null,
        parserMaybePlaceholders: currentProject.parserOptions.maybePlaceholders || true
      };
    } else {
      formData = {
        id: crypto.randomUUID() as string,
        name: '',
        grammarUri: null,
        parserAlgorithm: EARLEY_PARSER,
        parserKeepAllTokens: false,
        parserAmbiguity: null,
        parserMaybePlaceholders: true
      };
    }
  };

  const downloadProjectHandler = async (project: Project) => {
    let currentProject = $ideContext.project;
    const fileName = (currentProject.name || 'project')
      .replace(/\W+/g, ' ')
      .toLowerCase()
      .split(' ')
      .join('_');
    await downloadGrammar(fileName, currentProject.grammar);

    if (onDownloadProject) {
      onDownloadProject(project);
    } else {
      console.warn('No `onDownloadProject` function provided');
    }
  };

  const createProjectHandler = (data: FormData) => {
    const parserOptions: ParserOptions = {
      algorithm: data.parserAlgorithm || EARLEY_PARSER,
      keepAllTokens: data.parserKeepAllTokens || false,
      maybePlaceholders: data.parserMaybePlaceholders || true
    };

    if (data.parserAmbiguity) {
      parserOptions.ambiguity = data.parserAmbiguity;
    }

    const testCases = PROJECT_TEMPLATE.testCases.map((testCase, index) => ({
      ...testCase,
      id: index + 1
    }));

    const newProject: Project = {
      ...PROJECT_TEMPLATE,
      id: data.id,
      name: data.name,
      grammar: {
        uri: data.grammarUri || '',
        content: ''
      },
      testCases,
      parserOptions
    };

    ideContext.setProject(newProject);

    selectProject(currentProject.id);

    formOpen.set(false);

    if (onCreateProject) {
      onCreateProject(currentProject);
    } else {
      console.warn('No `onCreateProject` function provided');
    }
  };

  const editProjectHandler = async (data: FormData) => {
    const parserOptions: ParserOptions = {
      ...currentProject.parserOptions,
      algorithm: data.parserAlgorithm || EARLEY_PARSER,
      keepAllTokens: data.parserKeepAllTokens || false,
      maybePlaceholders: data.parserMaybePlaceholders || true
    };

    if (data.parserAmbiguity) {
      parserOptions.ambiguity = data.parserAmbiguity;
    } else {
      delete parserOptions.ambiguity;
    }

    const updatedProject: Project = {
      ...currentProject,
      name: data.name,
      parserOptions
    };

    ideContext.setProject(updatedProject);

    selectProject(currentProject.id);

    formOpen.set(false);

    if (onEditProject) {
      onEditProject(currentProject);
    } else {
      console.warn('No `onEditProject` function provided');
    }
  };

  const deleteProjectHandler = async (projectId: string) => {
    const filteredProjects = availableProjects.filter((p) => p.id !== projectId);

    ideContext.setAvailableProjects(filteredProjects);

    selectProject(currentProject.id);

    if (onDeleteProject) {
      onDeleteProject(projectId);
    } else {
      console.warn('No `onDeleteProject` function provided');
    }
  };
</script>

<div class="project-manager">
  <div class="project-manager__section grow">
    <div class="project-manager__selector__wrapper">
      <button
        use:melt={$selectTrigger}
        class="project-manager__item project-manager__selector"
        aria-label="Select project"
      >
        {currentProject.name}
        <CaretDown class="size-5" aria-label="Select project" />
      </button>
      {#if $isSelectOpen}
        <div class="project-manager__selector__options" use:melt={$selectMenu}>
          {#each availableProjects as project (project.id)}
            <button
              use:melt={$selectOption({ value: project.id, label: project.name })}
              onclick={() => selectProject(project.id)}
              class="project-manager__selector__option"
              aria-label={project.name}
            >
              {#if project.id === currentProject.id}
                <Check size={24} aria-label="Selected project" />
              {/if}
              <span class="grow">{project.name}</span>
            </button>
          {/each}
        </div>
      {/if}
    </div>
  </div>
  <div class="project-manager__section">
    <div use:melt={$dropDownTrigger} class="project-manager__item">
      <Menu size={24} />
    </div>
  </div>
</div>

{#if $dropDownOpen}
  <div
    use:melt={$dropDownMenu}
    transition:fly={{ duration: 150, y: -10 }}
    class="project-manager__dropdown"
  >
    <button
      use:melt={$dropDownItem}
      onclick={() => downloadProjectHandler(currentProject)}
      class="project-manager__dropdown__option"
      aria-label="Download project grammar"
    >
      <Download size={16} class="shrink-0" aria-label="Download project grammar" />
      <span class="grow text-left">Download grammar</span>
    </button>
    <button
      use:melt={$dropDownItem}
      use:melt={$formTrigger}
      onclick={() => prepareForm(FormAction.CREATE)}
      class="project-manager__dropdown__option project-manager__dropdown__option--add"
      aria-label="Create new project"
    >
      <Add size={16} class="shrink-0" aria-label="Create new project" />
      <span class="grow text-left">New Project</span>
    </button>
    <button
      use:melt={$dropDownItem}
      use:melt={$formTrigger}
      onclick={() => prepareForm(FormAction.EDIT)}
      class="project-manager__dropdown__option project-manager__dropdown__option--edit"
      aria-label="Edit current project"
    >
      <Settings size={16} class="shrink-0" aria-label="Edit current project" />
      <span class="grow text-left">Edit project</span>
    </button>
    <button
      use:melt={$dropDownItem}
      use:melt={$deleteTrigger}
      class="project-manager__dropdown__option project-manager__dropdown__option--delete"
      aria-label="Delete current project"
    >
      <Trash size={16} class="shrink-0" aria-label="Delete current project" />
      <span class="grow text-left">Delete Project</span>
    </button>
  </div>
{/if}

{#if $deleteOpen}
  <div class="dialog" use:melt={$deletePortalled}>
    <div
      use:melt={$deleteOverlay}
      class="dialog__overlay"
      transition:fade={{ duration: 150 }}
    ></div>
    <div
      use:melt={$deleteContent}
      transition:fly={{
        y: '100vh',
        duration: 300,
        opacity: 1
      }}
      class="dialog__content"
    >
      <div class="dialog__content--title">
        <h4 use:melt={$deleteTitle}>Eliminar proyecto</h4>
      </div>
      <div class="dialog__content--body">
        <p>
          ¿Estás seguro de que deseas eliminar el proyecto
          <strong>{currentProject.name}</strong>?
        </p>
      </div>
      <div class="dialog__content--footer">
        <button
          use:melt={$deleteClose}
          class="dialog__content--action dialog__content--action--delete"
          onclick={() => deleteProjectHandler(currentProject.id)}
          aria-label="Delete project"
        >
          <Trash size={16} aria-label="Delete project" />
          <span>Eliminar</span>
        </button>
        <button use:melt={$deleteClose} class="dialog__content--action" aria-label="Cancelar">
          <span>Cancelar</span>
        </button>
      </div>
    </div>
  </div>
{/if}

{#if $formOpen}
  <div class="dialog" use:melt={$formPortalled}>
    <div use:melt={$formOverlay} class="dialog__overlay" transition:fade={{ duration: 150 }}></div>
    <div
      use:melt={$formContent}
      transition:fly={{
        y: '100vh',
        duration: 300,
        opacity: 1
      }}
      class="dialog__content"
    >
      <div class="dialog__content--title">
        <h4 use:melt={$formTitle}>
          {formAction === FormAction.CREATE ? 'Nuevo proyecto' : 'Editar proyecto'}
        </h4>
      </div>
      <form id="project-form" class="dialog__content--body form">
        <div class="form-field">
          <label for="project-name" class="form-field__label">Nombre del proyecto</label>
          <input
            type="text"
            id="project-name"
            name="project-name"
            bind:value={formData.name}
            placeholder="Nombre del proyecto"
            class="form-field__input"
            required
          />
        </div>
        {#if formAction === FormAction.CREATE}
          <div class="form-field">
            <label for="project-grammar-uri" class="form-field__label">Grammar URI</label>
            <input
              type="text"
              id="project-grammar-uri"
              name="project-grammar-uri"
              bind:value={formData.grammarUri}
              placeholder="Nombre del proyecto"
              class="form-field__input"
            />
            <div class="form-field__hint">
              If you already have a grammar file, you can use its URI here.
            </div>
          </div>
        {/if}
        <div class="form-field">
          <label for="project-parser-algorithm" class="form-field__label">Parser Algorithm</label>
          <select
            id="project-parser-algorithm"
            name="project-parser-algorithm"
            bind:value={formData.parserAlgorithm}
            class="form-field__input"
          >
            {#each AVAILABLE_PARSING_ALGORITHMS as algorithm (algorithm)}
              <option value={algorithm}>{algorithm.name}</option>
            {/each}
          </select>
        </div>
        <div class="form-field">
          <label
            for="project-parser-keep-all-tokens"
            class="form-field__label form-field__label--checkbox"
          >
            <input
              type="checkbox"
              id="project-parser-keep-all-tokens"
              name="project-parser-keep-all-tokens"
              bind:checked={formData.parserKeepAllTokens}
              class="form-field__input form-field__input--checkbox"
            />
            Keep All Tokens
          </label>
          <div class="form-field__hint">
            If enabled, the parser will keep all tokens in the parse tree.
          </div>
        </div>
        <div class="form-field">
          <label for="project-parser-ambiguity" class="form-field__label">Parser Ambiguity</label>
          <select
            id="project-parser-ambiguity"
            name="project-parser-ambiguity"
            bind:value={formData.parserAmbiguity}
            class="form-field__input"
          >
            <option value={null}>Select parser ambiguity</option>
            {#each Object.values(ParserAmbiguity) as ambiguity (ambiguity)}
              <option value={ambiguity}>{ambiguity}</option>
            {/each}
          </select>
          <div class="form-field__hint">
            The parser will handle ambiguities based on the selected option. Only applicable for
            Earley parser algorithm.
          </div>
        </div>
        <div class="form-field">
          <label
            for="project-parser-maybe-placeholders"
            class="form-field__label form-field__label--checkbox"
          >
            <input
              type="checkbox"
              id="project-parser-maybe-placeholders"
              name="project-parser-maybe-placeholders"
              bind:checked={formData.parserMaybePlaceholders}
              class="form-field__input form-field__input--checkbox"
            />
            Maybe Placeholders
          </label>
          <div class="form-field__hint">
            If enabled, the parser will use placeholders for missing tokens.
          </div>
        </div>
      </form>
      <div class="dialog__content--footer">
        <button
          type="submit"
          form="project-form"
          class="dialog__content--action dialog__content--action--save"
          aria-label="Save project"
          onclick={() =>
            formAction === FormAction.CREATE
              ? createProjectHandler(formData)
              : editProjectHandler(formData)}
        >
          <Save size={16} aria-label="Save project" />
          <span>Guardar</span>
        </button>
        <button use:melt={$formClose} class="dialog__content--action" aria-label="Cancelar">
          <span>Cancelar</span>
        </button>
      </div>
    </div>
  </div>
{/if}

<style lang="postcss">
  @reference "../../../../app.css";

  .project-manager {
    @apply relative flex shrink-0 flex-row gap-4 px-4;
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

    @apply dark:shadow-gray-900;
    @apply dark:bg-gray-800 dark:text-gray-100;
  }

  .project-manager__selector__option {
    @apply flex shrink-0 cursor-pointer appearance-none flex-row items-center gap-x-2 rounded-lg px-2 py-2 text-left transition duration-250 outline-none;

    @apply bg-gray-100 text-gray-900;
    @apply hover:bg-gray-800 hover:text-gray-200;
    @apply focus:bg-gray-800 focus:text-gray-200;

    @apply dark:bg-gray-900 dark:text-gray-100;
    @apply dark:hover:bg-gray-200 dark:hover:text-gray-900;
    @apply dark:focus:bg-gray-200 dark:focus:text-gray-900;
  }

  .project-manager__dropdown {
    @apply z-10 flex max-h-[20rem] flex-col gap-y-2 overflow-y-auto rounded-lg p-2 shadow;
    @apply lg:max-h-none;

    @apply dark:shadow-gray-900;
    @apply bg-gray-200 text-gray-900;
    @apply dark:bg-gray-800 dark:text-gray-100;
  }

  .project-manager__dropdown__option {
    @apply flex shrink-0 cursor-pointer appearance-none flex-row items-center gap-x-2 rounded-lg px-2 py-2 text-left transition duration-250 outline-none;

    @apply bg-gray-100 text-gray-900;
    @apply hover:bg-gray-800 hover:text-gray-200;
    @apply focus:bg-gray-800 focus:text-gray-200;

    @apply dark:bg-gray-900 dark:text-gray-100;
    @apply dark:hover:bg-gray-200 dark:hover:text-gray-900;
    @apply dark:focus:bg-gray-200 dark:focus:text-gray-900;
  }

  .project-manager__dropdown__option--add {
    @apply hover:bg-blue-500 hover:text-gray-100;
    @apply focus:bg-blue-500 focus:text-gray-100;
  }

  .project-manager__dropdown__option--edit {
    @apply hover:bg-yellow-500 hover:text-gray-900;
    @apply focus:bg-yellow-500 focus:text-gray-900;
  }

  .project-manager__dropdown__option--delete {
    @apply text-red-500;
    @apply hover:bg-red-500 hover:text-gray-100;
    @apply focus:bg-red-500 focus:text-gray-100;
  }

  .dialog__overlay {
    @apply fixed inset-0 z-100 bg-black/50;
  }

  .dialog__content {
    @apply fixed top-1/2 left-1/2 z-100 flex max-h-[85vh] w-[90vw] max-w-[32rem] -translate-x-1/2 -translate-y-1/2 flex-col gap-4 overflow-hidden rounded-lg p-4 shadow-lg;
    @apply bg-gray-100 text-gray-900;
  }

  .dialog__content--title {
    @apply flex items-center justify-between text-lg font-semibold;
  }

  .dialog__content--body {
    @apply flex w-full flex-col items-center gap-4;
  }

  .form-field {
    @apply flex w-full flex-col gap-1;
  }

  .form-field__label {
    @apply text-sm font-medium text-gray-700;
  }

  .form-field__label--checkbox {
    @apply flex items-center gap-2;
  }

  .form-field__input {
    @apply rounded-lg border px-4 py-2 transition duration-250;
    @apply border-gray-300 bg-white text-gray-900;
    @apply focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none;
  }

  .form-field__input--checkbox {
    @apply h-4 w-4 rounded border border-gray-300 p-0 transition duration-250;
    @apply bg-white text-blue-600;
    @apply focus:ring-2 focus:ring-blue-500 focus:outline-none;
    @apply checked:bg-blue-500 checked:text-white;
  }

  .form-field__hint {
    @apply text-xs font-medium text-gray-700;
  }

  .dialog__content--footer {
    @apply flex flex-row items-center justify-end gap-4;
  }

  .dialog__content--action {
    @apply flex cursor-pointer flex-row items-center justify-center gap-2 rounded-lg px-4 py-2 transition duration-250 outline-none;

    @apply bg-gray-200 text-gray-800;
    @apply hover:bg-gray-900 hover:text-gray-100;
    @apply focus:bg-gray-900 focus:text-gray-100;
  }

  .dialog__content--action--delete {
    @apply bg-red-500 text-red-100;
    @apply hover:bg-red-700 hover:text-gray-100;
    @apply focus:bg-red-700 focus:text-gray-100;
  }

  .dialog__content--action--save {
    @apply bg-green-500 text-green-100;
    @apply hover:bg-green-700 hover:text-gray-100;
    @apply focus:bg-green-700 focus:text-gray-100;
  }
</style>
