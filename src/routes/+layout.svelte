<script lang="ts">
    import 'bulma/css/bulma.css';
    import './app.css';

    import fullScreenIcon from '$lib/assets/full-screen.svg?raw';
    import exitFullScreenIcon from '$lib/assets/exit-full-screen.svg?raw';

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
                        <a
                            class="button is-link"
                            href="https://github.com/lark-parser/lark"
                            target="_blank"
                        >
                            Parser Source
                        </a>
                        <a
                            class="button is-link"
                            href="https://github.com/lark-parser/ide"
                            target="_blank"
                        >
                            IDE Source
                        </a>
                        {#if fullscreen}
                            <button class="button is-normal is-light" on:click={closeFullscreen}>
                                {@html exitFullScreenIcon}
                            </button>
                        {:else}
                            <button class="button is-normal is-light" on:click={openFullscreen}>
                                {@html fullScreenIcon}
                            </button>
                        {/if}
                    </div>
                </div>
            </div>
            <div />
        </div>
    </nav>
</header>

<main>
    <slot />
</main>

<footer />

<style>
    main {
        width: 100%;
    }

    #home {
        margin-top: var(--base-margin);
        margin-left: var(--base-margin);
    }
    #home img {
        height: 50px;
    }
    nav {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    #title {
        font-size: 40px;
        font-family: sans-serif;
    }
    #right-panel {
        width: 200px;
        text-align: right;
        margin: var(--base-margin);
    }
</style>
