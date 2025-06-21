<script lang="ts">
  import 'bulma/css/bulma.css';
  import '../app.css';

  import FullscreenIcon from '$lib/assets/full-screen.svelte';
  import ExitFullscreenIcon from '$lib/assets/exit-full-screen.svelte';

  let fullscreen = $state(false);
  let { children } = $props();

  function openFullscreen() {
    let elem = document.getElementsByTagName('body')[0];
    elem.requestFullscreen();

    fullscreen = true;
  }

  function closeFullscreen() {
    document.exitFullscreen();
    fullscreen = false;
  }
</script>

<header class="page-header">
  <nav class="navbar has-background-white" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="/" title="Home">
        <img src="lark-logo.png" alt="lark logo" />
      </a>
    </div>

    <div class="navbar-menu">
      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <a
              class="button is-link"
              href="https://lark-parser.readthedocs.io/en/latest/"
              target="_blank"
            >
              Parser Docs
            </a>
            <a class="button is-link" href="https://github.com/lark-parser/lark" target="_blank">
              Parser Source
            </a>
            <a class="button is-link" href="https://github.com/lark-parser/ide" target="_blank">
              IDE Source
            </a>
            {#if fullscreen}
              <button class="button is-normal is-light" onclick={closeFullscreen}>
                <ExitFullscreenIcon />
              </button>
            {:else}
              <button class="button is-normal is-light" onclick={openFullscreen}>
                <FullscreenIcon />
              </button>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </nav>
</header>

<main class="page-main">
  {@render children()}
</main>

<style>
  nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>
