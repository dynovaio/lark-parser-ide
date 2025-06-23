<script lang="ts">
  import '../app.css';

  import Header from '$lib/components/Header.svelte';
  import Loader from '$lib/components/Loader.svelte';
  import { isLoading, loadingMessage, loadingProgress } from '$lib/stores/Loader';
  import { setupPyodide } from '$lib/Pyodide';
  import { pyodideInstance } from '$lib/stores/Pyodide';
  import { onMount } from 'svelte';

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
