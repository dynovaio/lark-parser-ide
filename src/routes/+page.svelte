<script lang="ts">
    import Tree from '$lib/Tree.svelte';
    import Editor from '$lib/Editor.svelte';
    import EditInput from '$lib/EditInput.svelte';
    import Options from '$lib/Options.svelte';
    import {
        LALR1_PARSER,
        DEFAULT_PARSER_OPTIONS,
        toPythonCompatibleParserOptions
    } from '$lib/Parsers';
    import { setupPyodide } from '../python';

    const PARSER_REFRESH_DELAY = 500;

    const grammars = [
        {
            title: 'Blank',
            name: 'blank',
            text: '',
            options: { ...DEFAULT_PARSER_OPTIONS }
        },
        {
            title: '(easy) Hello World',
            name: 'hello',
            text: 'Hello, World!',
            options: { ...DEFAULT_PARSER_OPTIONS }
        },
        {
            title: '(easy) JSON parser',
            name: 'json',
            text: '{"this": ["is", "JSON"]}',
            options: { parser: LALR1_PARSER, keepAllTokens: false }
        },
        {
            title: '(easy) Calculator',
            name: 'calc',
            text: '2 + 20 / (13 - 6) + 1.5',
            options: { parser: LALR1_PARSER, keepAllTokens: false }
        },
        {
            title: '(easy) Fruit flies like bananas',
            name: 'fruitflies',
            text: 'fruit flies like bananas',
            options: { ...DEFAULT_PARSER_OPTIONS, ambiguity: 'explicit' }
        },
        {
            title: '(avg) Configuration grammar',
            name: 'conf',
            text: '[main]\nhello=world\n',
            options: { parser: LALR1_PARSER, keepAllTokens: false }
        },
        {
            title: '(avg) Lark grammar',
            name: 'lark',
            text: 'start: "Hello" "World"',
            options: { parser: LALR1_PARSER, keepAllTokens: false, maybePlaceholders: false }
        }
    ];

    let grammar = '';
    let text = '';
    let parserOptions = DEFAULT_PARSER_OPTIONS;

    let parser_promise;
    let result_promise;
    let create_parser = 'parser = lark.Lark(grammar, **options.to_py())';
    let editor_text: string;

    let pyodide: { globals: any; runPythonAsync: (s: string) => any };
    let pyodide_log: string[] = [];

    async function editor_ready() {
        load_grammar('hello');

        // Load pyocide after the editor is done loading
        // If loaded before, they might interfere with each other
        // Probably due to a require() collision
        if (!pyodide) {
            await setupPyodide(
                (p) => {
                    pyodide = p;
                },
                (e: string) => {
                    pyodide_log = [...pyodide_log, e];
                }
            );
        }
    }

    function update_lark_parser() {
        pyodide.globals.set('grammar', grammar);
        pyodide.globals.set('options', toPythonCompatibleParserOptions(parserOptions));
        parser_promise = pyodide.runPythonAsync(create_parser);
    }

    let parserRefreshDelay: NodeJS.Timeout;
    function update_grammar_from_editor() {
        clearTimeout(parserRefreshDelay);
        parserRefreshDelay = setTimeout(() => {
            grammar = editor_text;
        }, PARSER_REFRESH_DELAY);
    }

    function update_lark_result(text: string) {
        pyodide.globals.set('text', text);
        return pyodide.runPythonAsync('parser.parse(text)');
    }

    $: pyodide && parserOptions && grammar && update_lark_parser();

    $: pyodide && editor_text && update_grammar_from_editor();

    $: result_promise = pyodide && parser_promise && update_lark_result(text);

    async function load_grammar(grammar_to_load: string) {
        console.log('Loading grammar', grammar_to_load);
        if (grammar_to_load === 'blank') {
            grammar = 'start:';
            editor.set_text('');
            edit_input.set_text('');
            parserOptions = DEFAULT_PARSER_OPTIONS;
            return;
        }

        let r = await fetch('grammars/' + grammar_to_load + '.lark');
        if (r.ok) {
            grammar = await r.text();
            editor.set_text(grammar);
            for (let g of grammars)
                if (g.name === grammar_to_load) {
                    edit_input.set_text(g.text);
                    parserOptions = { ...DEFAULT_PARSER_OPTIONS, ...g.options };
                    break;
                }
        }
    }

    let editor: Editor;
    let edit_input: EditInput;
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
                        <span>Load Grammar</span>
                        <span class="icon is-small">
                            <i class="fas fa-angle-down" aria-hidden="true" />
                        </span>
                    </button>
                </div>
                <div class="dropdown-menu" id="ide-menu" role="menu">
                    <div class="dropdown-content">
                        {#each grammars as g}
                            <button
                                type="button"
                                class="dropdown-item"
                                on:click={() => {
                                    load_grammar(g.name);
                                }}
                            >
                                {g.title}
                            </button>
                        {/each}
                    </div>
                </div>
            </div>
            <Options bind:options={parserOptions} />
        </div>
    </div>

    <div class="lark-ide-editor">
        <Editor bind:this={editor} bind:text={editor_text} on:ready={editor_ready} />
    </div>

    <div id="text" class="lark-ide-tests-input">
        <EditInput bind:this={edit_input} bind:text />
    </div>

    <div id="output" class="lark-ide-tests-output">
        {#if pyodide}
            {#await parser_promise}
                Building Parser...
            {:then}
                {#await result_promise}
                    Parsing...
                {:then result}
                    {#if result}
                        <Tree tree={result.toJs({ depth: Infinity })} />
                    {:else}
                        No result
                    {/if}
                {:catch e}
                    <pre>
					    {e}
				    </pre>
                {/await}
            {:catch e}
                <pre>
				    {e}
			    </pre>
            {/await}
        {:else}
            Please wait, loading...

            <progress class="progress is-info" value={pyodide_log.length} max="4">XX</progress>
            <ul>
                {#each pyodide_log as e}
                    <li>{e}</li>
                {/each}
            </ul>
        {/if}
    </div>
</section>
