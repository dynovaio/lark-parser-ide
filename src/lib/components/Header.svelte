<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { createDialog, melt } from '@melt-ui/svelte';

  import ArrowsIn from 'phosphor-svelte/lib/ArrowsIn';
  import ArrowsOut from 'phosphor-svelte/lib/ArrowsOut';
  import BookBookmark from 'phosphor-svelte/lib/BookBookmark';
  import Close from 'phosphor-svelte/lib/X';
  import Dark from 'phosphor-svelte/lib/Moon';
  import GithubLogo from 'phosphor-svelte/lib/GithubLogo';
  import Light from 'phosphor-svelte/lib/Sun';
  import Menu from 'phosphor-svelte/lib/List';

  import LarkParserLogo from '$lib/components/Icon/LarkParserLogo.svelte';

  import { isLargeScreen } from '$lib/stores/Breakpoints';
  import { Theme, isDarkMode, setTheme } from '$lib/stores/Theme';

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

  const toggleTheme = () => {
    setTheme($isDarkMode ? Theme.Light : Theme.Dark);
  };
</script>

<header class="page-header">
  <nav class="navbar">
    <div class="navbar__section">
      <a class="navbar__item navbar__item-brand" href="/" title="Lark IDE">
        <LarkParserLogo size={40} aria-label="Lark IDE" />
      </a>
    </div>

    <div class="navbar__section">
      {#if $isLargeScreen}
        <a
          class="navbar__item"
          target="_blank"
          href="https://lark-parser.readthedocs.io/en/latest/"
          title="Documentation"
        >
          <BookBookmark size={24} aria-label="Documentation" />
          <span>Docs</span>
        </a>
        <a
          class="navbar__item"
          target="_blank"
          href="https://github.com/lark-parser/lark"
          title="Source code"
        >
          <GithubLogo size={24} aria-label="Source code" />
          <span>Source</span>
        </a>
      {/if}
      <button
        class="navbar__item"
        onclick={toggleTheme}
        name="theme-toggler"
        aria-label="Toggle Theme"
      >
        {#if $isDarkMode}
          <Dark size={24} aria-label="Dark Mode" />
        {:else}
          <Light size={24} aria-label="Light Mode" />
        {/if}
      </button>

      <button
        class="navbar__item"
        onclick={toggleFullscreen}
        name="fullscreen-toggler"
        aria-label="Toggle Fullscreen"
      >
        {#if fullscreen}
          <ArrowsIn size={24} aria-label="Exit Fullscreen" />
        {:else}
          <ArrowsOut size={24} aria-label="Enter Fullscreen" />
        {/if}
      </button>

      {#if !$isLargeScreen}
        <button
          use:melt={$open ? $close : $trigger}
          class="navbar__item"
          name="menu-trigger"
          aria-label="Menu"
        >
          {#if $open}
            <Close size={24} aria-label="Close menu" />
          {:else}
            <Menu size={24} aria-label="Open menu" />
          {/if}
        </button>
      {/if}
    </div>
  </nav>
</header>

{#if $open}
  <div use:melt={$portalled}>
    <div use:melt={$overlay} transition:fade={{ duration: 150 }} class="menu__overlay"></div>
    <div
      use:melt={$content}
      transition:fly={{
        y: -184,
        duration: 300,
        opacity: 1
      }}
      class="menu"
    >
      <div class="menu__contents">
        <a class="menu__item" target="_blank" href="https://lark-parser.readthedocs.io/en/latest/">
          <BookBookmark size={24} aria-label="Documentation" />
          <span>Docs</span>
        </a>
        <a class="menu__item" target="_blank" href="https://github.com/lark-parser/lark">
          <GithubLogo size={24} aria-label="Source" />
          <span>Source</span>
        </a>
      </div>
    </div>
  </div>
{/if}

<style lang="postcss">
  @reference "../../app.css";

  .page-header {
    @apply relative z-65 w-full shrink-0;
    @apply bg-gray-100 text-gray-900;
    @apply dark:bg-gray-900 dark:text-gray-100;
  }

  .navbar {
    @apply flex items-center justify-between p-4;
  }

  .navbar__section {
    @apply flex shrink-0 items-center gap-4;
  }

  .navbar__item {
    @apply flex shrink-0 cursor-pointer appearance-none flex-row gap-x-2 rounded-lg px-2 py-2 transition duration-250 outline-none;
    @apply bg-gray-200 text-gray-900;
    @apply hover:bg-gray-800 hover:text-gray-100;
    @apply focus:bg-gray-800 focus:text-gray-100;

    @apply dark:bg-gray-800 dark:text-gray-100;
    @apply dark:hover:bg-gray-200 dark:hover:text-gray-900;
    @apply dark:focus:bg-gray-200 dark:focus:text-gray-900;
  }

  .navbar__item :global(svg) {
    @apply block shrink-0;
  }

  .navbar__item-brand {
    @apply p-0;
    @apply bg-inherit text-inherit;
    @apply hover:bg-inherit hover:text-inherit;
    @apply focus:bg-inherit focus:text-inherit;
    @apply dark:bg-inherit dark:text-inherit;
    @apply dark:hover:bg-inherit dark:hover:text-inherit;
    @apply dark:focus:bg-inherit dark:focus:text-inherit;
  }

  .menu {
    @apply fixed top-[4.5rem] z-64 w-full shadow-lg outline-none;
    @apply bg-gray-900;
  }

  .menu__overlay {
    @apply fixed inset-0 top-[4.5rem] z-64 bg-gray-900/50 shadow-lg;
  }

  .menu__contents {
    @apply flex flex-col space-y-4 p-4;
    @apply bg-gray-100;
    @apply dark:bg-gray-900;
  }

  .menu__item {
    @apply flex shrink-0 cursor-pointer appearance-none flex-row gap-4 rounded-lg px-2 py-2 transition duration-250 outline-none;
    @apply bg-gray-100 text-gray-900;
    @apply hover:bg-gray-800 hover:text-gray-100;
    @apply focus:bg-gray-800 focus:text-gray-100;

    @apply dark:bg-gray-900 dark:text-gray-100;
    @apply dark:hover:bg-gray-200 dark:hover:text-gray-900;
    @apply dark:focus:bg-gray-200 dark:focus:text-gray-900;
  }

  .menu__item :global(svg) {
    @apply block shrink-0;
  }
</style>
