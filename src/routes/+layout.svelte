<script lang="ts">
  import '../app.css';

  import Header from '$lib/components/Header.svelte';

  let { children } = $props();
</script>

<Header></Header>

<main class="page-main">
  {@render children()}
</main>
