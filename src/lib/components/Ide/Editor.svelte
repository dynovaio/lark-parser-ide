<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { EditorView, basicSetup } from 'codemirror';
  import { EditorState, Compartment } from '@codemirror/state';
  import { keymap } from '@codemirror/view';
  import { indentWithTab } from '@codemirror/commands';

  import { getIdeContext } from '$lib/components/Ide/Context';
  import { isDarkMode } from '$lib/stores/Theme';
  import { larkLanguage } from '$lib/utils/CodeMirror/LarkLanguage';
  import { larkIdeLightTheme } from '$lib/utils/CodeMirror/LarkIdeLightTheme';
  import { larkIdeDarkTheme } from '$lib/utils/CodeMirror/LarkIdeDarkTheme';

  const ideContext = getIdeContext();

  let editorView: EditorView;
  let container: HTMLElement;

  const editorThemeCompartment = new Compartment();

  const editorTheme = $derived.by(() => {
    return $isDarkMode ? larkIdeDarkTheme : larkIdeLightTheme;
  });

  isDarkMode.subscribe((darkMode) => {
    if (editorView) {
      editorView.dispatch({
        effects: editorThemeCompartment.reconfigure(darkMode ? larkIdeDarkTheme : larkIdeLightTheme)
      });
    }
  });

  let isUpdatingFromExternal = false;

  const initEditor = () => {
    const initialDoc = $ideContext.project.grammar?.content || '';

    const startState = EditorState.create({
      doc: initialDoc,
      extensions: [
        editorThemeCompartment.of(editorTheme),
        basicSetup,
        larkLanguage(),
        keymap.of([indentWithTab]),
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

<style lang="postcss">
  @reference "../../../app.css";

  .editor__content {
    @apply relative h-full w-full overflow-hidden rounded-lg border;
    @apply border-gray-300;
    @apply dark:border-gray-700;
  }

  .editor__content :global(.cm-editor) {
    @apply h-full;
  }

  .editor__content :global(.cm-scroller) {
    @apply h-full;
  }
</style>
