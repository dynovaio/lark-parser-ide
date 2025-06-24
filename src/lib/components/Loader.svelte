<script lang="ts">
  import LarkParserLogo from '$lib/components/Icon/LarkParserLogo.svelte';
  interface Props {
    message: string;
    progress: number;
  }

  const { message = $bindable('Loading...'), progress = $bindable(0) }: Props = $props();
</script>

<div
  class="flex h-screen w-screen flex-col items-center justify-center space-y-4 bg-gray-100 text-gray-800"
>
  <LarkParserLogo size={142.272} aria-label="Lark Parser" class="w-64" />
  <div class="relative h-6 w-64 overflow-hidden rounded-full bg-gray-200">
    <div
      class="h-6 w-64 bg-green-500 transition-transform duration-500 ease-in-out"
      style={`transform: translateX(-${100 - (100 * (progress ?? 0)) / 100}%)`}
    ></div>
  </div>
  <p class="">{message}</p>
</div>
