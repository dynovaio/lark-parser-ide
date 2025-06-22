<script lang="ts">
  import { onDestroy } from 'svelte';
  import Tree from '$lib/Tree.svelte';
  import GrammarEditor from '$lib/GrammarEditor.svelte';
  import GrammarTestEditor from '$lib/GrammarTestEditor.svelte';
  import Options from '$lib/Options.svelte';
  import { toPythonCompatibleParserOptions } from '$lib/Parsers';
  import { AVAILABLE_GRAMMARS, BLANK_GRAMMAR, HELLO_WORLD_GRAMMAR } from '$lib/Grammars';
  import type { Grammar } from '$lib/Grammars';
  import { setupPyodideLegacy } from '$lib/Pyodide';
  import type { PyodideModule } from '$lib/Pyodide';

  const PARSER_REFRESH_DELAY = 500;

  let parserRefreshTimeout: ReturnType<typeof setTimeout>;

  let grammarEditor: GrammarEditor;
  let testEditor: GrammarTestEditor;

  let grammarName = $state(HELLO_WORLD_GRAMMAR.label);
  let grammarText = $state('');
  let grammarTest = $state(HELLO_WORLD_GRAMMAR.test);
  let parserOptions = $state(HELLO_WORLD_GRAMMAR.parserOptions);

  let editorText = $state('');

  let pyodide = $state<PyodideModule>();
  let pyodideLog = $state<string[]>([]);

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

    if (!pyodide) {
      await setupPyodideLegacy({
        onReady: (p: PyodideModule) => {
          pyodide = p;
        },
        log: (e: string) => {
          pyodideLog = [...pyodideLog, e];
        }
      });
    }
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

<svelte:head>
  <title>Lark IDE</title>
</svelte:head>

<section class="lark-ide" id="ide">
  <div class="lark-ide-options">
    <div id="above_grammar" class="buttons">
      <div class="dropdown is-hoverable">
        <div class="dropdown-trigger">
          <button class="button" aria-haspopup="true" aria-controls="ide-menu">
            <span>Grammar: {grammarName}</span>
            <span class="icon is-small">
              <i class="fas fa-angle-down" aria-hidden="true"></i>
            </span>
          </button>
        </div>
        <div class="dropdown-menu" id="ide-menu" role="menu">
          <div class="dropdown-content">
            {#each AVAILABLE_GRAMMARS as g (g.id)}
              <button
                type="button"
                class="dropdown-item"
                onclick={() => {
                  loadGrammar(g);
                }}
              >
                {g.label} ({g.difficulty})
              </button>
            {/each}
          </div>
        </div>
      </div>
      <Options bind:options={parserOptions} />
    </div>
  </div>

  <div class="lark-ide-editor">
    <GrammarEditor bind:this={grammarEditor} bind:text={editorText} on:ready={editorReady} />
  </div>

  <div id="text" class="lark-ide-tests-input">
    <GrammarTestEditor bind:this={testEditor} bind:text={grammarTest} />
  </div>

  <div id="output" class="lark-ide-tests-output">
    {#if pyodide}
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
      Please wait, loading...

      <progress class="progress is-info" value={pyodideLog.length} max="4">XX</progress>
      <ul>
        {#each pyodideLog as e (e)}
          <li>{e}</li>
        {/each}
      </ul>
    {/if}
  </div>
</section>
