<script lang="ts">
  import { AVAILABLE_PARSERS } from '$lib/Parsers';
  import type { Parser, ParserOptions } from '$lib/Parsers';

  export let options: ParserOptions = {
    parser: { id: 'earley', label: 'Earley' },
    keepAllTokens: false
  };

  export const parsers = AVAILABLE_PARSERS;

  let parser: Parser;
  let keepAllTokens: boolean | undefined = false;

  function updateOptions() {
    parser = options.parser;
    keepAllTokens = options.keepAllTokens;
  }

  function setParser(parser: Parser) {
    setTimeout(() => {
      options = { ...options, parser };
    });
  }

  function setKeepAllTokens() {
    setTimeout(() => {
      options = { ...options, keepAllTokens };
    });
  }

  $: options && updateOptions();
</script>

<div class="dropdown is-hoverable">
  <div class="dropdown-trigger">
    <button class="button" aria-haspopup="true" aria-controls="ide-menu">
      <span>Parser: {parser.label}</span>
      <span class="icon is-small">
        <i class="fas fa-angle-down" aria-hidden="true"></i>
      </span>
    </button>
  </div>

  <div class="dropdown-menu" id="ide-menu" role="menu">
    <div class="dropdown-content">
      {#each parsers as parser}
        <button
          type="button"
          class="dropdown-item"
          on:click={() => {
            setParser(parser);
          }}
        >
          {parser.label}
        </button>
      {/each}
    </div>
  </div>
</div>

<label class="checkbox" for="keep-all-tokens">
  <input
    class="checkbox"
    type="checkbox"
    bind:checked={keepAllTokens}
    on:input={setKeepAllTokens}
    id="keep-all-tokens"
  />
  Keep all tokens
</label>
