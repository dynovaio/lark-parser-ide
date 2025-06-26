<script lang="ts">
  import LarkParserLogo from '$lib/components/Icon/LarkParserLogo.svelte';

  interface Props {
    message: string;
    progress: number;
  }

  const { message = $bindable('Loading...'), progress = $bindable(0) }: Props = $props();
</script>

<div class="loader">
  <LarkParserLogo size={142.272} aria-label="Lark Parser" />
  <div
    class="progressbar"
    role="progressbar"
    aria-valuenow={progress}
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div class="progressbar__progress" data-progress={progress}></div>
  </div>
  <p class="message">{message}</p>
</div>

<style lang="postcss">
  @reference "../../app.css";

  .loader {
    @apply flex h-full w-full flex-col items-center justify-center space-y-4;
    @apply bg-gray-100 text-gray-900;
    @apply dark:bg-gray-900 dark:text-gray-100;
  }

  .progressbar {
    @apply relative h-6 w-64 overflow-hidden rounded-full;
    @apply bg-gray-200;
    @apply bg-gray-200;
  }

  .progressbar__progress {
    --progress: attr(data-progress %, 0);

    @apply h-6 w-64 transition-transform duration-500 ease-in-out;
    @apply bg-green-500;

    transform: translateX(calc(var(--progress) - 100%));
  }

  .message {
    @apply text-center;
  }
</style>
