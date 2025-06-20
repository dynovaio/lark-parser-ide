<script lang="ts">
  import 'bulma/css/bulma.css';
  import '../app.css';

  import FullScreenIcon from '$lib/assets/full-screen.svelte';
  import ExitFullScreenIcon from '$lib/assets/exit-full-screen.svelte';

  let fullscreen = false;

  function openFullscreen() {
    let elem = document.getElementsByTagName('body')[0];
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE11 */
      elem.msRequestFullscreen();
    }

    fullscreen = true;
  }

  function closeFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      /* Safari */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      /* IE11 */
      document.msExitFullscreen();
    }

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
              <button class="button is-normal is-light" on:click={closeFullscreen}>
                <ExitFullScreenIcon />
              </button>
            {:else}
              <button class="button is-normal is-light" on:click={openFullscreen}>
                <FullScreenIcon />
              </button>
            {/if}
          </div>
        </div>
      </div>
      <div />
    </div>
  </nav>
</header>

<main class="page-main">
  <slot />
</main>

<style>
  nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>
