<script lang="ts">
  import Projects from '$lib/components/Ide/Projects.svelte';
  import StatusBar from '$lib/components/Ide/StatusBar.svelte';
  import GrammarEditor from '$lib/components/Ide/GrammarEditor.svelte';
  import TestList from '$lib/components/Ide/TestList.svelte';
  import TreeViewer from '$lib/components/Ide/TreeViewer.svelte';
</script>

<section class="relative flex h-full w-full flex-col">
  <div class="flex grow flex-row overflow-auto">
    <div class="relative w-64 shrink bg-gray-800 text-gray-100">
      <Projects />
    </div>
    <div class="relative grow bg-gray-50">
      <GrammarEditor />
    </div>
    <div class="relative w-1/5 shrink bg-gray-50">
      <TestList />
    </div>
    <div class="relative w-1/5 shrink bg-gray-50">
      <TreeViewer />
    </div>
  </div>
  <div class="w-full bg-gray-800 text-gray-100">
    <StatusBar />
  </div>
</section>
