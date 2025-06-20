<script lang="ts">
  import Tree from '$lib/Tree.svelte';
  import GrammarEditor from '$lib/GrammarEditor.svelte';
  import GrammarTestEditor from '$lib/GrammarTestEditor.svelte';
  import Options from '$lib/Options.svelte';
  import { toPythonCompatibleParserOptions } from '$lib/Parsers';
  import { AVAILABLE_GRAMMARS, BLANK_GRAMMAR, HELLO_WORLD_GRAMMAR } from '$lib/Grammars';
  import type { Grammar } from '$lib/Grammars';
  import { setupPyodide } from '$lib/Python';
  import type { PyodideModule, CodeExecutionPromise } from '$lib/Python';

  const PARSER_REFRESH_DELAY = 500;

  let parserRefreshTimeout: ReturnType<typeof setTimeout>;

  let grammarEditor: GrammarEditor;
  let testEditor: GrammarTestEditor;

  let grammarName = HELLO_WORLD_GRAMMAR.label;
  let grammarText = '';
  let grammarTest = HELLO_WORLD_GRAMMAR.test;
  let parserOptions = HELLO_WORLD_GRAMMAR.parserOptions;

  let parserPromise: CodeExecutionPromise;
  let resultPromise: CodeExecutionPromise;
  let editorText: string;

  let pyodide: PyodideModule;
  let pyodideLog: string[] = [];

  async function editorReady() {
    loadGrammar(HELLO_WORLD_GRAMMAR);

    if (!pyodide) {
      await setupPyodide({
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
      grammarText = editorText;
    }, PARSER_REFRESH_DELAY);
  }

  function updateLarkParser() {
    pyodide.globals.set('grammar', grammarText);
    pyodide.globals.set('options', toPythonCompatibleParserOptions(parserOptions));
    parserPromise = pyodide.runPythonAsync(`
            parser = lark.Lark(grammar, **options.to_py())
        `);
  }

  function updateLarkResult(text: string) {
    pyodide.globals.set('text', text);
    return pyodide.runPythonAsync('parser.parse(text)');
  }

  $: pyodide && parserOptions && grammarText && updateLarkParser();

  $: pyodide && editorText && updateGrammarFromEditor();

  $: resultPromise = pyodide && parserPromise && updateLarkResult(grammarTest);
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
              <i class="fas fa-angle-down" aria-hidden="true" />
            </span>
          </button>
        </div>
        <div class="dropdown-menu" id="ide-menu" role="menu">
          <div class="dropdown-content">
            {#each AVAILABLE_GRAMMARS as g}
              <button
                type="button"
                class="dropdown-item"
                on:click={() => {
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
        {#await resultPromise}
          Parsing...
        {:then result}
          {#if result}
            <Tree tree={result.toJs({ depth: Infinity })} />
          {:else}
            No result
          {/if}
        {:catch e}
          <pre>{e}</pre>
        {/await}
      {:catch e}
        <pre>{e}</pre>
      {/await}
    {:else}
      Please wait, loading...

      <progress class="progress is-info" value={pyodideLog.length} max="4">XX</progress>
      <ul>
        {#each pyodideLog as e}
          <li>{e}</li>
        {/each}
      </ul>
    {/if}
  </div>
</section>
