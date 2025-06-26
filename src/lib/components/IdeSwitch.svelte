<script lang="ts">
  import { createSwitch, melt } from '@melt-ui/svelte';
  import { useLegacyIde } from '$lib/stores/Ide';

  const {
    elements: { root, input }
  } = createSwitch({
    checked: useLegacyIde
  });
</script>

<label class="switch__label" for="ide-switch" id="ide-switch-label">Use Legacy IDE</label>
<button use:melt={$root} id="ide-switch" class="switch" aria-labelledby="ide-switch-label">
  <span class="thumb"></span>
</button>
<input use:melt={$input} id="ide-switch-input" name="use-legacy-ide" value={$useLegacyIde} />

<style lang="postcss">
  @reference "../../app.css";

  .switch__label {
    @apply mr-2 block;
  }

  .switch {
    @apply relative h-6 w-[2.75rem] cursor-pointer rounded-full transition duration-250;
    @apply bg-gray-300;
    @apply dark:bg-gray-700;

    &[data-state='checked'] {
      @apply bg-green-500;
    }
  }

  .thumb {
    transform: translateX(0.125rem);
    @apply block size-[1.25rem] rounded-full transition duration-250;
    @apply bg-white;
  }

  .switch[data-state='checked'] .thumb {
    transform: translateX(calc(2.75rem - 1.25rem - 0.125rem));
  }
</style>
