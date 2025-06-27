<script lang="ts">
  import { onMount } from 'svelte';
  import type { Uri, editor as MonacoEditor, languages as MonacoLanguages } from 'monaco-types';

  import { LarkConfiguration, LarkLanguage } from '$lib/utils/Legacy/Lark';
  import { getIdeContext } from '$lib/components/Ide/Context';

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

  const ideContext = getIdeContext();

  let editor: MonacoEditor.IStandaloneCodeEditor;
  let container: HTMLElement;

  let monacoOptions = $derived({
    value: $ideContext.project.grammar?.content,
    language: 'lark',
    automaticLayout: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    fontSize: 14,
    lineDecorationsWidth: 0
  });

  const initEditor = (monaco: MonacoModule) => {
    monaco.languages.register({
      id: 'lark',
      extensions: ['.lark'],
      aliases: ['Lark', 'lark'],
      firstLine: '^#!/.*\\bpython[0-9.-]*\\b',
      configuration: './lark.js' as unknown as Uri
    });

    monaco.languages.setMonarchTokensProvider('lark', LarkLanguage);
    monaco.languages.setLanguageConfiguration('lark', LarkConfiguration);

    editor = monaco.editor.create(container, monacoOptions);

    editor?.getModel()?.onDidChangeContent(() => {
      ideContext.setGrammar({ ...$ideContext.project.grammar, content: getEditorText() });
    });

    ideContext.subscribe((state) => {
      const text = getEditorText();
      if (state.project.grammar?.content !== text) {
        setEditorText(state.project.grammar?.content || '');
      }
    });
  };

  const setEditorText = (text: string) => {
    if (editor) return editor?.getModel()?.setValue(text);
  };

  const getEditorText = () => {
    return editor?.getModel()?.getValue() || '';
  };

  onMount(() => {
    (require as ExtendedRequire).config({
      paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.26.1/min/vs' }
    });
    (require as ExtendedRequire)(['vs/editor/editor.main'], initEditor);
  });
</script>

<div bind:this={container} class="flex h-full grow"></div>
