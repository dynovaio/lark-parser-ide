<script lang="ts">
  import Toolbar from '$lib/components/Ide/Toolbar.svelte';
  import StatusBar from '$lib/components/Ide/StatusBar.svelte';
  import GrammarEditor from '$lib/components/Ide/GrammarEditor.svelte';
  import TestList from '$lib/components/Ide/TestList.svelte';
  import TreeViewer from '$lib/components/Ide/TreeViewer.svelte';
</script>

<section class="">
  <Toolbar />
  <GrammarEditor />
  <TestList />
  <TreeViewer />
  <StatusBar />
</section>
