<script lang="ts">
  import { get } from 'svelte/store';
  import { onDestroy } from 'svelte';
  import Tree from '$lib/components/Legacy/Tree.svelte';
  import GrammarEditor from '$lib/components/Legacy/GrammarEditor.svelte';
  import GrammarTestEditor from '$lib/components/Legacy/GrammarTestEditor.svelte';
  import Options from '$lib/components/Legacy/Options.svelte';
  import { toPythonCompatibleParserOptions } from '$lib/utils/Legacy/Parsers';
  import {
    AVAILABLE_GRAMMARS,
    BLANK_GRAMMAR,
    HELLO_WORLD_GRAMMAR
  } from '$lib/utils/Legacy/Grammars';
  import type { Grammar } from '$lib/utils/Legacy/Grammars';
  import { pyodideInstance } from '$lib/stores/Pyodide';
  import { clickOutside } from '$lib/utils/ClickOutside';

  const PARSER_REFRESH_DELAY = 500;

  let showGrammarSelector = $state(false);

  let parserRefreshTimeout: ReturnType<typeof setTimeout>;

  let grammarEditor: GrammarEditor;
  let testEditor: GrammarTestEditor;

  let grammarName = $state(HELLO_WORLD_GRAMMAR.label);
  let grammarText = $state('');
  let grammarTest = $state(HELLO_WORLD_GRAMMAR.test);
  let parserOptions = $state(HELLO_WORLD_GRAMMAR.parserOptions);

  let editorText = $state('');

  let pyodide = $derived.by(() => {
    if ($pyodideInstance) {
      return get(pyodideInstance);
    }
    return undefined;
  });

  let parserPromise = $derived.by(() => {
    if (pyodide && parserOptions && grammarText) {
      return updateLarkParser();
    }
    return undefined;
  });

  let resultPromise = $derived.by(() => {
    if (pyodide && parserPromise && grammarTest) {
      return updateLarkResult(grammarTest);
    }
    return undefined;
  });

  $effect(() => {
    if (pyodide && editorText) {
      updateGrammarFromEditor();
    }
  });

  async function editorReady() {
    loadGrammar(HELLO_WORLD_GRAMMAR);
  }

  async function loadGrammar(grammar: Grammar) {
    grammarName = grammar.label;

    if (grammar.id === BLANK_GRAMMAR.id) {
      grammarText = 'start:';
      grammarEditor.setText('');
      testEditor.setText('');
      parserOptions = BLANK_GRAMMAR.parserOptions;
      return;
    }

    let r = await fetch('grammars/' + grammar.id + '.lark');

    if (r.ok) {
      grammarText = await r.text();
      grammarEditor.setText(grammarText);
      for (let availableGrammar of AVAILABLE_GRAMMARS)
        if (availableGrammar.id === grammar.id) {
          testEditor.setText(availableGrammar.test);
          parserOptions = availableGrammar.parserOptions;
          break;
        }
    }
  }

  function updateGrammarFromEditor() {
    clearTimeout(parserRefreshTimeout);
    parserRefreshTimeout = setTimeout(() => {
      if (editorText) {
        grammarText = editorText;
      }
    }, PARSER_REFRESH_DELAY);
  }

  function updateLarkParser() {
    if (!pyodide) return undefined;
    pyodide.globals.set('grammar', grammarText);
    pyodide.globals.set('options', toPythonCompatibleParserOptions(parserOptions));
    return pyodide.runPythonAsync(`
        parser = lark.Lark(grammar, **options.to_py())
      `);
  }

  function updateLarkResult(text: string) {
    if (!pyodide) return undefined;
    pyodide.globals.set('text', text);
    return pyodide.runPythonAsync('json.dumps(parser.parse(text), cls=LarkEncoder, indent=2)');
  }

  onDestroy(() => {
    if (parserRefreshTimeout) {
      clearTimeout(parserRefreshTimeout);
    }
  });
</script>

<section class="lark-legacy-ide bg-white" id="ide">
  <div class="lark-legacy-ide-options">
    <div class="flex justify-start justify-items-start space-x-4">
      <div
        class="relative block"
        use:clickOutside
        onclickoutside={() => {
          showGrammarSelector = false;
        }}
      >
        <button
          class="line-clamp-1 w-75 cursor-pointer rounded-lg bg-gray-200 px-4 py-2 text-gray-900 hover:bg-gray-900 hover:text-gray-100"
          aria-haspopup="true"
          aria-controls="ide-menu"
          onclick={() => {
            showGrammarSelector = !showGrammarSelector;
          }}
        >
          <span>Grammar: {grammarName}</span>
          <span class="icon is-small">
            <i class="fas fa-angle-down" aria-hidden="true"></i>
          </span>
        </button>
        {#if showGrammarSelector}
          <div
            class="absolute left-0 z-10 mt-2 flex w-75 origin-top-right flex-col flex-wrap rounded-lg bg-gray-900 py-2 text-gray-100 shadow-lg ring-1 ring-black/5"
            id="ide-menu"
            role="menu"
          >
            {#each AVAILABLE_GRAMMARS as g (g.id)}
              <button
                type="button"
                class="cursor-pointer px-4 py-2 hover:bg-gray-800"
                onclick={() => {
                  loadGrammar(g);
                  showGrammarSelector = false;
                }}
              >
                {g.label} ({g.difficulty})
              </button>
            {/each}
          </div>
        {/if}
      </div>
      <Options bind:options={parserOptions} />
    </div>
  </div>

  <div class="lark-legacy-ide-editor">
    <GrammarEditor bind:this={grammarEditor} bind:text={editorText} on:ready={editorReady} />
  </div>

  <div id="text" class="lark-legacy-ide-tests-input">
    <GrammarTestEditor bind:this={testEditor} bind:text={grammarTest} />
  </div>

  <div id="output" class="lark-legacy-ide-tests-output">
    {#if $pyodideInstance}
      {#await parserPromise}
        Building Parser...
      {:then}
        {#if resultPromise}
          {#await resultPromise}
            Parsing...
          {:then result}
            {#if result}
              <Tree tree={JSON.parse(result)} />
            {:else}
              No result
            {/if}
          {:catch e}
            <pre>{e}</pre>
          {/await}
        {:else}
          Enter text to parse
        {/if}
      {:catch e}
        <pre>{e}</pre>
      {/await}
    {:else}
      <p>Error! Pyodide is not initialized.</p>
    {/if}
  </div>
</section>
