<script lang="ts">
  import { createTreeView } from '@melt-ui/svelte';
  import { setContext } from 'svelte';

  import type { TreeType, TokenType } from '$lib/components/Ide/Test/Tree.svelte';
  import Tree from '$lib/components/Ide/Test/Tree.svelte';

  interface Props {
    tree: string;
  }

  let { tree: treeString }: Props = $props();

  const tree: TreeType = $derived.by(() => {
    return JSON.parse(treeString || '{}') as TreeType;
  });

  function collectExpandableNodeIds(
    items: Array<TreeType | TokenType>,
    level: number = 0
  ): string[] {
    const nodeIds: string[] = [];

    items.forEach((item, i) => {
      if (typeof item !== 'string' && item.children && item.children.length > 0) {
        const nodeId = `${item.data}-${i}`;
        nodeIds.push(nodeId);
        nodeIds.push(...collectExpandableNodeIds(item.children, level + 1));
      }
    });

    return nodeIds;
  }

  const context = createTreeView();

  setContext('tree-view-context', context);

  const {
    elements: { tree: treeView },
    states: { expanded }
  } = context;

  $effect(() => {
    if (tree && tree.data) {
      const expandableIds = collectExpandableNodeIds([tree]);
      expanded.set(expandableIds);
    }
  });
</script>

<div class="tree-viewer" {...$treeView}>
  <Tree items={[tree]} />
</div>

<style lang="postcss">
  @reference "../../../../app.css";

  .tree-viewer {
    @apply w-full rounded-lg p-4;
  }
</style>
