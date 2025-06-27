<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { EditorView, basicSetup } from 'codemirror';
  import { EditorState, Compartment } from '@codemirror/state';
  import { keymap } from '@codemirror/view';
  import { indentWithTab } from '@codemirror/commands';
  import { tomorrow, boysAndGirls } from 'thememirror';
  /* import { createScrollArea, melt } from '@melt-ui/svelte'; */

  import { getIdeContext } from '$lib/components/Ide/Context';
  import { isDarkMode } from '$lib/stores/Theme';
  import { larkLanguageSupport } from '$lib/utils/CodeMirror/LarkLanguage';

  const ideContext = getIdeContext();

  let editorView: EditorView;
  let container: HTMLElement;

  const editorThemeCompartment = new Compartment();

  const editorTheme = $derived.by(() => {
    return $isDarkMode ? boysAndGirls : tomorrow;
  });

  /*
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
  */

  isDarkMode.subscribe((darkMode) => {
    if (editorView) {
      editorView.dispatch({
        effects: editorThemeCompartment.reconfigure(darkMode ? boysAndGirls : tomorrow)
      });
    }
  });

  // Track if we're currently updating from external source to prevent loops
  let isUpdatingFromExternal = false;

  const initEditor = () => {
    const initialDoc = $ideContext.project.grammar?.content || '';

    const startState = EditorState.create({
      doc: initialDoc,
      extensions: [
        editorThemeCompartment.of(editorTheme),
        basicSetup,
        larkLanguageSupport(),
        keymap.of([indentWithTab]),
        EditorView.theme({
          '&': {
            fontSize: '14px'
          },
          '.cm-content': {
            fontFamily: 'Fira Mono, monospace'
          },
          '.cm-focused': {
            outline: 'none'
          },
          '.cm-editor': {
            height: '100%'
          },
          '.cm-scroller': {
            fontFamily: 'Fira Mono, monospace'
          }
        }),
        EditorView.updateListener.of((update) => {
          if (update.docChanged && !isUpdatingFromExternal) {
            const newContent = update.state.doc.toString();
            ideContext.setGrammar({
              ...$ideContext.project.grammar,
              content: newContent
            });
          }
        })
        // EditorView.lineWrapping
      ]
    });

    editorView = new EditorView({
      state: startState,
      parent: container
    });

    // Subscribe to context changes
    const unsubscribe = ideContext.subscribe((state) => {
      const currentContent = getEditorText();
      const newContent = state.project.grammar?.content || '';

      if (newContent !== currentContent) {
        setEditorText(newContent);
      }
    });

    return unsubscribe;
  };

  const setEditorText = (text: string) => {
    if (editorView && text !== getEditorText()) {
      isUpdatingFromExternal = true;

      editorView.dispatch({
        changes: {
          from: 0,
          to: editorView.state.doc.length,
          insert: text
        }
      });

      // Reset flag after update
      setTimeout(() => {
        isUpdatingFromExternal = false;
      }, 0);
    }
  };

  const getEditorText = () => {
    return editorView?.state.doc.toString() || '';
  };

  let unsubscribe: (() => void) | undefined;

  onMount(() => {
    unsubscribe = initEditor();
  });

  onDestroy(() => {
    if (editorView) {
      editorView.destroy();
    }
    if (unsubscribe) {
      unsubscribe();
    }
  });
</script>

<div bind:this={container} class="editor__content"></div>

<!--
  <div use:melt={$scrollAreaRoot} class="editor__root">
    <div use:melt={$scrollAreaViewport} class="editor__viewport">
      <div use:melt={$scrollAreaContent} bind:this={container} class="editor__content"></div>
    </div>
    <div use:melt={$scrollAreaScrollbarY} class="editor__scrollbar_y">
      <div use:melt={$scrollAreaThumbY} class="editor__scrollbar_thumb_y"></div>
    </div>
    <div use:melt={$scrollAreaScrollbarX} class="editor__scrollbar_x">
      <div use:melt={$scrollAreaThumbX} class="editor__scrollbar_thumb_x"></div>
    </div>
    <div use:melt={$scrollAreaCorner} class="editor__scrollbar_corner"></div>
  </div>
-->

<style lang="postcss">
  @reference "../../../app.css";

  /*
  .editor__root {
    @apply relative block h-full w-full overflow-hidden;
    @apply bg-gray-100 text-gray-900;
    @apply dark:bg-gray-900 dark:text-gray-100;
  }

  .editor__viewport {
    @apply relative block h-full w-full overflow-auto;
  }

  .editor__scrollbar_y {
    @apply flex w-2 touch-none p-px pb-2 transition-colors select-none;
    @apply bg-gray-100;
    @apply dark:bg-gray-900;
  }

  .editor__scrollbar_thumb_y {
    @apply relative flex-1 rounded-lg;
    @apply bg-orange-500;
  }

  .editor__scrollbar_x {
    @apply flex h-2 touch-none p-px pr-2 select-none;
    @apply bg-gray-100;
    @apply dark:bg-gray-900;
  }

  .editor__scrollbar_thumb_x {
    @apply relative rounded-lg;
    @apply bg-orange-500;
  }
  */

  .editor__content {
    @apply relative h-full w-full;
  }

  .editor__content :global(.cm-editor) {
    @apply h-full;
  }

  .editor__content :global(.cm-scroller) {
    @apply h-full;
  }
</style>
