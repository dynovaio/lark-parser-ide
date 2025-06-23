<script lang="ts">
  import '../app.css';

  import { onMount } from 'svelte';

  import { isLoading, loadingMessage, loadingProgress } from '$lib/stores/Loader';
  import { pyodideInstance } from '$lib/stores/Pyodide';
  import Header from '$lib/components/Header.svelte';
  import Loader from '$lib/components/Loader.svelte';
  import { setupPyodide } from '$lib/Pyodide';

  let { children } = $props();

  onMount(() => {
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
