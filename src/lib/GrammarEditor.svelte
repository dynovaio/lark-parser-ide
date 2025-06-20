<script lang="ts">
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import type { Window, IStandaloneCodeEditor } from 'monaco-types';
  import { LarkConfiguration, LarkLanguage } from '$lib/Lark';
  const dispatch = createEventDispatcher();

  let editor: IStandaloneCodeEditor;
  export let text = '';

  let container: HTMLElement;
  const monaco_options = {
    value: text,
    language: 'lark',
    automaticLayout: true
  };

  const initEditor = (monaco: Window) => {
    monaco.languages.register({
      id: 'lark',
      extensions: ['.lark'],
      aliases: ['Lark', 'lark'],
      firstLine: '^#!/.*\\bpython[0-9.-]*\\b',
      configuration: './lark.js'
    });

    monaco.languages.setMonarchTokensProvider('lark', LarkLanguage);
    monaco.languages.setLanguageConfiguration('lark', LarkConfiguration);

    editor = monaco.editor.create(container, monaco_options);
    text = editor.getModel().getValue();

    editor.getModel().onDidChangeContent((event?: Event) => {
      text = editor.getModel().getValue();
    });

    dispatch('ready', {});
  };

  onMount(() => {
    require.config({
      paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.26.1/min/vs' }
    });
    require(['vs/editor/editor.main'], initEditor);
  });

  export function setText(text: string) {
    if (editor) return editor.getModel().setValue(text);
  }
</script>

<div bind:this={container} class="lark-editor-wrapper"></div>
