<script lang="ts">
  import LarkParserLogo from '$lib/icons/LarkParserLogo.svelte';
  import ArrowsIn from 'phosphor-svelte/lib/ArrowsIn';
  import ArrowsOut from 'phosphor-svelte/lib/ArrowsOut';
  import GithubLogo from 'phosphor-svelte/lib/GithubLogo';
  import BookBookmark from 'phosphor-svelte/lib/BookBookmark';

  let fullscreen = $state(false);

  function toggleFullscreen() {
    if (fullscreen) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }

    fullscreen = !fullscreen;
  }
</script>

<header class="w-full">
  <nav class="flex flex-shrink items-center justify-between bg-gray-100 p-4">
    <div class="flex cursor-pointer items-center">
      <a href="/" title="Lark IDE">
        <LarkParserLogo size={48} color="#1e2939" aria-label="Lark IDE" />
      </a>
    </div>
    <div class="flex flex-shrink items-center space-x-4">
      <a
        class="rounded-lg bg-gray-100 px-4 py-2 text-gray-800 transition duration-250 hover:bg-gray-800 hover:text-gray-100"
        target="_blank"
        href="https://lark-parser.readthedocs.io/en/latest/"
      >
        <BookBookmark size={24} class="mr-2 inline-block" aria-label="Documentation" />
        Docs
      </a>
      <a
        class="rounded-lg bg-gray-100 px-4 py-2 text-gray-800 transition duration-250 hover:bg-gray-800 hover:text-gray-100"
        target="_blank"
        href="https://github.com/lark-parser/lark"
      >
        <GithubLogo size={24} class="mr-2 inline-block" aria-label="Source" />
        Source
      </a>
      <button
        class="cursor-pointer rounded-lg bg-gray-100 px-4 py-2 text-gray-800 transition duration-250 hover:bg-gray-800 hover:text-gray-100"
        onclick={toggleFullscreen}
        name="fullscreen-toggle"
      >
        {#if fullscreen}
          <ArrowsIn size={24} class="block" aria-label="Exit Fullscreen" />
        {:else}
          <ArrowsOut size={24} class="block" aria-label="Enter Fullscreen" />
        {/if}
      </button>
    </div>
  </nav>
</header>
