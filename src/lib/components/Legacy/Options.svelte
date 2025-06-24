<script lang="ts">
  import { clickOutside } from '$lib/utils/ClickOutside';
  import { AVAILABLE_PARSERS } from '$lib/utils/Legacy/Parsers';
  import type { Parser, ParserOptions } from '$lib/utils/Legacy/Parsers';

  interface Props {
    options: ParserOptions;
  }

  let {
    options = $bindable({
      parser: { id: 'earley', label: 'Earley' },
      keepAllTokens: false
    })
  }: Props = $props();

  let showParserSelector = $state(false);

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

<div
  class="relative block"
  use:clickOutside
  onclickoutside={() => {
    showParserSelector = false;
  }}
>
  <button
    class="line-clamp-1 w-40 rounded-lg bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-800 hover:text-gray-100"
    aria-haspopup="true"
    aria-controls="ide-menu"
    onclick={() => {
      showParserSelector = !showParserSelector;
    }}
  >
    <span>Parser: {parser?.label}</span>
    <span class="icon is-small">
      <i class="fas fa-angle-down" aria-hidden="true"></i>
    </span>
  </button>
  {#if showParserSelector}
    <div
      class="absolute left-0 z-10 mt-2 flex w-40 origin-top-right flex-col flex-wrap rounded-lg bg-gray-800 py-2 text-gray-100 shadow-lg ring-1 ring-black/5"
      id="ide-menu"
      role="menu"
    >
      {#each parsers as parser (parser.id)}
        <button
          type="button"
          class="cursor-pointer px-4 py-2 hover:bg-gray-700"
          onclick={() => {
            setParser(parser);
            showParserSelector = false;
          }}
        >
          {parser.label}
        </button>
      {/each}
    </div>
  {/if}
</div>

<div class="relative inline-block">
  <label
    class="flex items-center rounded-lg bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-800 hover:text-gray-100"
    for="keep-all-tokens"
  >
    <input
      class="mr-2 h-4 w-4 rounded-sm border-gray-300 bg-gray-100 text-gray-800"
      type="checkbox"
      bind:checked={keepAllTokens}
      oninput={setKeepAllTokens}
      id="keep-all-tokens"
    />
    Keep all tokens
  </label>
</div>
