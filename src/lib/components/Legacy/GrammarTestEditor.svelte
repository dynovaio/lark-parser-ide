<script lang="ts">
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import type { editor as MonacoEditor, languages as MonacoLanguages } from 'monaco-types';

  interface ExtendedRequire extends NodeJS.Require {
    (modules: string[], callback: (monaco: MonacoModule) => void): void;
    config: (options: object) => void;
  }

  interface MonacoModule {
    editor: {
      create: (
        container: HTMLElement,
        options: MonacoEditor.IStandaloneEditorConstructionOptions
      ) => MonacoEditor.IStandaloneCodeEditor;
    };
    languages: {
      register: (options: MonacoLanguages.ILanguageExtensionPoint) => void;
      setMonarchTokensProvider: (
        languageId: string,
        tokensProvider: MonacoLanguages.IMonarchLanguage
      ) => void;
      setLanguageConfiguration: (
        languageId: string,
        configuration: MonacoLanguages.LanguageConfiguration
      ) => void;
    };
  }

  const dispatch = createEventDispatcher();

  interface Props {
    text?: string;
  }

  let { text = $bindable('') }: Props = $props();

  let editor: MonacoEditor.IStandaloneCodeEditor;
  let container: HTMLElement;

  let monacoOptions = $derived({
    value: text,
    language: '',
    automaticLayout: true
  });

  const initEditor = (monaco: MonacoModule) => {
    editor = monaco.editor.create(container, monacoOptions);
    text = editor?.getModel()?.getValue() || '';

    editor?.getModel()?.onDidChangeContent(() => {
      text = editor?.getModel()?.getValue() || '';
    });

    dispatch('ready', {});
  };

  onMount(() => {
    (require as ExtendedRequire).config({
      paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.26.1/min/vs' }
    });
    (require as ExtendedRequire)(['vs/editor/editor.main'], initEditor);
  });

  export function setText(text: string) {
    if (editor) return editor?.getModel()?.setValue(text);
  }
</script>

<div bind:this={container} class="lark-editor-wrapper"></div>
