<script lang="ts">
  import { AVAILABLE_PARSERS } from '$lib/utils/Legacy/IdeLegacyParsers';
  import type { Parser, ParserOptions } from '$lib/utils/Legacy/IdeLegacyParsers';

  interface Props {
    options: ParserOptions;
  }

  let {
    options = $bindable({
      parser: { id: 'earley', label: 'Earley' },
      keepAllTokens: false
    })
  }: Props = $props();

  export const parsers = AVAILABLE_PARSERS;

  let parser = $state<Parser>();
  let keepAllTokens = $state<boolean | undefined>(false);

  function updateOptions() {
    parser = options.parser;
    keepAllTokens = options.keepAllTokens;
  }

  function setParser(newParser: Parser) {
    setTimeout(() => {
      options = { ...options, parser: newParser };
    });
  }

  function setKeepAllTokens() {
    setTimeout(() => {
      options = { ...options, keepAllTokens };
    });
  }

  $effect(() => {
    if (options) {
      updateOptions();
    }
  });
</script>

<div class="dropdown is-hoverable">
  <div class="dropdown-trigger">
    <button class="button" aria-haspopup="true" aria-controls="ide-menu">
      <span>Parser: {parser?.label}</span>
      <span class="icon is-small">
        <i class="fas fa-angle-down" aria-hidden="true"></i>
      </span>
    </button>
  </div>

  <div class="dropdown-menu" id="ide-menu" role="menu">
    <div class="dropdown-content">
      {#each parsers as parser (parser.id)}
        <button
          type="button"
          class="dropdown-item"
          onclick={() => {
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
    oninput={setKeepAllTokens}
    id="keep-all-tokens"
  />
  Keep all tokens
</label>
