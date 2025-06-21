<script lang="ts">
  type Tree = { type: string; data: string; children: Tree[] };

  export let tree: Tree;

  let expanded = true;
  const toggleExpansion = () => {
    expanded = !expanded;
  };

  $: arrowDown = expanded;
</script>

<ul>
  <!-- transition:slide -->
  <li>
    {#if tree.type === 'Tree'}
      {#if tree.children.length > 0}
        <button type="button" class="tree-toggle" on:click={toggleExpansion}>
          <span class="arrow" class:arrowDown>&#x25b6</span>
          <span class="label">
            {tree.data}
          </span>
        </button>
        {#if expanded}
          <div class="children">
            {#each tree.children as child (child.type)}
              {#if child}
                <svelte:self tree={child}></svelte:self>
              {:else}
                <span class="empty"></span>
              {/if}
            {/each}
          </div>
        {/if}
      {:else}
        <span>
          <span class="no-arrow"></span>
          <span class="label empty">
            {tree.data}
          </span>
        </span>
      {/if}
    {:else}
      <code>{tree}</code>
    {/if}
  </li>
</ul>

<style>
  ul {
    margin: 0;
    list-style: none;
    padding-left: 1.2rem;
    /* user-select: none; */
  }
  .no-arrow {
    padding-left: 1rem; /* Used for tree nodes without arrows */
  }
  .arrow {
    cursor: pointer;
    display: inline-block;
    font-size: 0.7rem;
    /* transition: transform 200ms; */
  }
  .arrowDown {
    transform: rotate(90deg);
  }

  code {
    color: green;
    font-size: 1.1rem;
    margin-left: 10px;
  }
  .label {
    color: #44c;
    font-family: sans-serif;
    display: inline-block;
  }
  .empty::after {
    content: ' (empty)';
    color: gray;
    font-style: italic;
    font-weight: normal;
  }
  .tree-toggle {
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    color: inherit;
    font: inherit;
    cursor: pointer;
    display: inline;
  }
</style>
