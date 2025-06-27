<script lang="ts">
  import '../app.css';

  import { onMount } from 'svelte';

  import Header from '$lib/components/Header.svelte';
  import Loader from '$lib/components/Loader.svelte';
  import { isLoading, loadingMessage, loadingProgress } from '$lib/stores/Loader';
  import { pyodideInstance } from '$lib/stores/Pyodide';
  import { Theme, setTheme } from '$lib/stores/Theme';
  import { setupPyodide } from '$lib/utils/Pyodide';

  let { children } = $props();

  onMount(() => {
    setTheme(localStorage.theme === Theme.Dark ? Theme.Dark : Theme.Light);

    (async () => {
      const pyodide = await setupPyodide(loadingMessage, loadingProgress);
      pyodideInstance.set(pyodide);
      setTimeout(() => {
        isLoading.set(false);
      }, 1000);
    })();
  });
</script>

{#if $isLoading}
  <Loader message={$loadingMessage} progress={$loadingProgress} />
{:else}
  <Header />
  <main class="page-main">
    {@render children()}
  </main>
{/if}

<style lang="postcss">
  @reference '../app.css';

  .page-main {
    @apply flex h-full max-h-[calc(100vh-4.5rem)] w-full shrink-0 grow overflow-hidden;
    @apply bg-gray-100 text-gray-900;
    @apply dark:bg-gray-900 dark:text-gray-100;
  }
</style>
