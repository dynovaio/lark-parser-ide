<script lang="ts">
  import LarkIdeLegacy from '$lib/components/IdeLegacy.svelte';
  import LarkIde from '$lib/components/Ide.svelte';
  import { useLegacyIde } from '$lib/stores/Ide';
</script>

<svelte:head>
  <title>Lark IDE</title>
</svelte:head>

{#if $useLegacyIde}
  <LarkIdeLegacy />
{:else}
  <LarkIde />
{/if}
