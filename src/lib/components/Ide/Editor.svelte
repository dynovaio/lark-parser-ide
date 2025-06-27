<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { EditorView, basicSetup } from 'codemirror';
  import { EditorState, Compartment } from '@codemirror/state';
  import { keymap } from '@codemirror/view';
  import { indentWithTab } from '@codemirror/commands';
  import { tomorrow, boysAndGirls } from 'thememirror';

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

<div bind:this={container} class="lark-ide__editor"></div>

<style lang="postcss">
  @reference "../../../app.css";

  .lark-ide__editor {
    @apply relative flex h-full w-full flex-col overflow-hidden;
  }

  .lark-ide__editor :global(.cm-editor) {
    @apply h-full;
  }

  .lark-ide__editor :global(.cm-scroller) {
    @apply h-full;
  }
</style>
