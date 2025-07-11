<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { EditorView, basicSetup } from 'codemirror';
  import { EditorState, Compartment } from '@codemirror/state';
  import { keymap } from '@codemirror/view';
  import { indentWithTab } from '@codemirror/commands';

  import { getIdeContext } from '$lib/components/Ide/Context';
  import { isDarkMode } from '$lib/stores/Theme';
  import { larkIdeLightTheme } from '$lib/utils/CodeMirror/LarkIdeLightTheme';
  import { larkIdeDarkTheme } from '$lib/utils/CodeMirror/LarkIdeDarkTheme';

  import type { TestCase } from '$lib/utils/TestCase';

  interface Props {
    testCase: TestCase;
  }

  let { testCase = $bindable({ content: '' } as TestCase) }: Props = $props();

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
    const initialDoc = testCase.content;

    const startState = EditorState.create({
      doc: initialDoc,
      extensions: [
        editorThemeCompartment.of(editorTheme),
        basicSetup,
        keymap.of([indentWithTab]),
        EditorView.updateListener.of((update) => {
          if (update.docChanged && !isUpdatingFromExternal) {
            const newContent = update.state.doc.toString();
            ideContext.setTestCase({
              ...$ideContext.testCase,
              content: newContent
            } as TestCase);
          }
        })
      ]
    });

    editorView = new EditorView({
      state: startState,
      parent: container
    });
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

  onMount(() => {
    initEditor();
  });

  onDestroy(() => {
    if (editorView) {
      editorView.destroy();
    }
  });

  $effect(() => {
    setEditorText(testCase.content || '');
  });
</script>

<div bind:this={container} class="lark-ide__test-editor"></div>

<style lang="postcss">
  @reference "../../../../app.css";

  .lark-ide__test-editor {
    @apply relative h-full w-full overflow-hidden rounded-lg border;
    @apply border-gray-300;
    @apply dark:border-gray-700;
  }

  .lark-ide__test-editor :global(.cm-editor) {
    @apply h-full;
  }

  .lark-ide__test-editor :global(.cm-scroller) {
    @apply h-full;
  }
</style>
