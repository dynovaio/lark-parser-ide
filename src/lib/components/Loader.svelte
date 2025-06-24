<script lang="ts">
  import LarkParserLogoSquare from '$lib/components/Icon/LarkParserLogoSquare.svelte';
  interface Props {
    message: string;
    progress: number;
  }

  const { message = $bindable('Loading...'), progress = $bindable(0) }: Props = $props();
</script>

<div
  class="page-loader flex h-full w-full flex-col items-center justify-center space-y-4 text-gray-800"
>
  <LarkParserLogoSquare size={256} aria-label="Lark Parser" />
  <div class="relative h-6 w-64 overflow-hidden rounded-full bg-black/40">
    <div
      class="h-full w-full bg-green-500 transition-transform duration-500 ease-in-out"
      style={`transform: translateX(-${100 - (100 * (progress ?? 0)) / 100}%)`}
    ></div>
  </div>
  <p class="">{message}</p>
</div>
