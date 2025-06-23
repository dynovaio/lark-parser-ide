<script lang="ts">
  import { createSwitch, melt } from '@melt-ui/svelte';
  import { useLegacyIde } from '$lib/stores/Ide';

  const {
    elements: { root, input }
  } = createSwitch({
    checked: useLegacyIde
  });
</script>

<form class="flex flex-row items-center rounded-lg bg-gray-200 px-4 py-2 text-gray-800">
  <label class="mr-4" for="ide-switch" id="ide-switch-label">Use Legacy IDE</label>
  <button
    use:melt={$root}
    id="ide-switch"
    class="relative h-6 cursor-default rounded-full bg-gray-300 transition-colors data-[state=checked]:bg-gray-800"
    aria-labelledby="ide-switch-label"
  >
    <span class="thumb block rounded-full bg-white transition"></span>
  </button>
  <input use:melt={$input} id="ide-switch-input" name="use-legacy-ide" value={$useLegacyIde} />
</form>

<style>
  button {
    --w: 2.75rem;
    --padding: 0.125rem;
    width: var(--w);
  }

  .thumb {
    --size: 1.25rem;
    width: var(--size);
    height: var(--size);
    transform: translateX(var(--padding));
  }

  :global([data-state='checked']) .thumb {
    transform: translateX(calc(var(--w) - var(--size) - var(--padding)));
  }
</style>
