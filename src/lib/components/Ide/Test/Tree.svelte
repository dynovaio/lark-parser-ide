<script module lang="ts">
  export type TokenType = string;

  export type TreeType = {
    type: string;
    data: string;
    children?: Array<TreeType | TokenType>;
  };
</script>

<script lang="ts">
  import { melt, type TreeView } from '@melt-ui/svelte';
  import { getContext } from 'svelte';

  import Tree from '$lib/components/Ide/Test/Tree.svelte';

  import CaretDown from 'phosphor-svelte/lib/CaretDown';
  import CaretRight from 'phosphor-svelte/lib/CaretRight';

  const {
    elements: { item: treeViewItem, group: treeViewGroup },
    helpers: { isExpanded }
  } = getContext<TreeView>('tree-view-context');

  interface Props {
    items: Array<TreeType | TokenType>;
    level?: number;
  }

  let { items: treeItems, level = $bindable(0) }: Props = $props();
</script>

<div class="tree">
  {#each treeItems as item, index (index)}
    {@const value = typeof item === 'string' ? item : item.data}
    {@const itemId = `${value}-${index}`}
    {@const hasChildren = typeof item === 'string' ? false : !!item.children?.length}
    {@const children = typeof item === 'string' ? [] : item.children || []}

    <div class:tree__node--indented={level > 0} class="tree__node">
      <button
        use:melt={$treeViewItem({
          id: itemId,
          hasChildren
        })}
        class="node"
        class:node--terminal={!hasChildren}
      >
        {#if hasChildren}
          {#if $isExpanded(itemId)}
            <CaretDown size={16} />
          {:else}
            <CaretRight size={16} />
          {/if}
        {/if}
        <code class="node__value">{value}</code>
      </button>

      {#if hasChildren}
        <div use:melt={$treeViewGroup({ id: itemId })}>
          <Tree items={children} level={level + 1} />
        </div>
      {/if}
    </div>
  {/each}
</div>

<style lang="postcss">
  @reference "../../../../app.css";

  .tree {
    @apply w-full rounded-lg;
  }

  .tree__node {
    @apply flex flex-col gap-2;
  }

  .tree__node--indented {
    @apply pl-6;
  }

  .node {
    @apply flex shrink-0 grow items-center gap-2 rounded-md px-2 py-1 font-normal;
    @apply hover:bg-gray-200;
    @apply focus:bg-gray-200;

    @apply dark:hover:bg-gray-800;
    @apply dark:focus:bg-gray-800;
  }
  .node--terminal :global(code) {
    @apply pl-4 font-black;
    @apply text-blue-700;
    @apply dark:text-blue-400;
  }
</style>
