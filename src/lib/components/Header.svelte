<script lang="ts">
  import { isLargeScreen } from '$lib/stores/Breakpoints';
  import { createDialog, melt } from '@melt-ui/svelte';
  import { fade, fly } from 'svelte/transition';

  import ArrowsIn from 'phosphor-svelte/lib/ArrowsIn';
  import ArrowsOut from 'phosphor-svelte/lib/ArrowsOut';
  import BookBookmark from 'phosphor-svelte/lib/BookBookmark';
  import GithubLogo from 'phosphor-svelte/lib/GithubLogo';
  import Menu from 'phosphor-svelte/lib/List';
  import Close from 'phosphor-svelte/lib/X';

  import LarkParserLogo from '$lib/components/Icon/LarkParserLogo.svelte';
  import IdeSwitch from '$lib/components/IdeSwitch.svelte';

  let fullscreen = $state(false);

  const {
    elements: { trigger, overlay, content, close, portalled },
    states: { open }
  } = createDialog({
    forceVisible: true
  });

  isLargeScreen.subscribe((value) => {
    // If screen is large, close the menu and prevent it from open again on resize to small resolution
    if (value) {
      open.set(false);
    }
  });

  const toggleFullscreen = () => {
    if (fullscreen) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }

    fullscreen = !fullscreen;
  };
</script>

<header class="w-full">
  <nav class="flex items-center justify-between bg-gray-100 p-4">
    <div class="flex shrink items-center space-x-4">
      {#if !$isLargeScreen}
        <button
          use:melt={$trigger}
          class="cursor-pointer py-2 text-gray-800 transition duration-250"
          name="menu-trigger"
        >
          <Menu size={24} class="block" aria-label="Open menu" />
        </button>
      {/if}
      <a class="text-gray-800" href="/" title="Lark IDE">
        <LarkParserLogo size={40} aria-label="Lark IDE" />
      </a>
    </div>

    <div class="flex shrink items-center space-x-4">
      {#if $isLargeScreen}
        <IdeSwitch />
        <a
          class="flex flex-row space-x-4 rounded-lg bg-gray-200 px-4 py-2 text-gray-800 transition duration-250 hover:bg-gray-800 hover:text-gray-100"
          target="_blank"
          href="https://lark-parser.readthedocs.io/en/latest/"
        >
          <BookBookmark size={24} aria-label="Documentation" />
          <span>Docs</span>
        </a>
        <a
          class="flex flex-row space-x-4 rounded-lg bg-gray-200 px-4 py-2 text-gray-800 transition duration-250 hover:bg-gray-800 hover:text-gray-100"
          target="_blank"
          href="https://github.com/lark-parser/lark"
        >
          <GithubLogo size={24} aria-label="Source" />
          <span>Source</span>
        </a>
      {/if}

      <button
        class="cursor-pointer rounded-lg py-2 text-gray-800 transition duration-250 hover:bg-gray-800 hover:text-gray-100"
        class:bg-gray-200={$isLargeScreen}
        class:hover:bg-gray-800={$isLargeScreen}
        class:hover:text-gray-100={$isLargeScreen}
        class:px-4={$isLargeScreen}
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

{#if $open}
  <div use:melt={$portalled}>
    <div
      use:melt={$overlay}
      transition:fade={{ duration: 150 }}
      class="fixed inset-0 z-50 bg-black/50"
    ></div>
    <div
      use:melt={$content}
      transition:fly={{
        x: -350,
        duration: 300,
        opacity: 1
      }}
      class="fixed top-0 left-0 z-50 h-screen w-full max-w-[320px] bg-gray-800 shadow-lg focus:outline-none"
    >
      <div class="flex bg-gray-100 p-4">
        <div class="flex shrink items-center space-x-4">
          <button
            use:melt={$close}
            class="cursor-pointer py-2 text-gray-800 outline-0 transition duration-250"
            name="menu-trigger"
          >
            <Close size={24} class="block" aria-label="Open menu" />
          </button>
          <a class="text-gray-800" href="/" title="Lark IDE">
            <LarkParserLogo size={40} aria-label="Lark IDE" />
          </a>
        </div>
      </div>
      <div class="flex flex-col items-start space-y-4 p-4">
        <IdeSwitch />
        <a
          class="flex w-full shrink items-center space-x-4 rounded-lg px-4 py-2 text-gray-100 transition duration-250 hover:bg-gray-200 hover:text-gray-800"
          target="_blank"
          href="https://lark-parser.readthedocs.io/en/latest/"
        >
          <BookBookmark size={24} aria-label="Documentation" />
          <span>Docs</span>
        </a>
        <a
          class="flex w-full shrink items-center space-x-4 rounded-lg px-4 py-2 text-gray-100 transition duration-250 hover:bg-gray-200 hover:text-gray-800"
          target="_blank"
          href="https://github.com/lark-parser/lark"
        >
          <GithubLogo size={24} aria-label="Source" />
          <span>Source</span>
        </a>
      </div>
    </div>
  </div>
{/if}
