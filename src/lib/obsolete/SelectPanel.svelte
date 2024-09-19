<script context="module" lang="ts">
  /*** Export ***/
  export type Props = {
    items: EachItem[],
    forButton: StylePartsPartial,
    forToggle: StylePartsPartial,
    forToggleActive: StylePartsPartial,
  }

  /*** Styling ***/
  /*** Others ***/
  interface EachItem { id: string, text: string, active: boolean }

  /*** import ***/
  import Flex, { styleFlex } from "$lib/obsolete/_Flex.svelte";
  import Toggle, { styleToggle } from "$lib/obsolete/_Toggle.svelte";
  import Button, { styleButton } from "$lib/obsolete/_Button.svelte"
</script>

<!---------------------------------------->

<script lang="ts">
  let { items = $bindable(), forButton, forToggle, forToggleActive }: Props = $props();

  /*** Initialize ***/
  /*** Others ***/
  /*** Handle events ***/
  function updateActive(): void {
    if (items.every(x => x.active)) {
      items.forEach(x => x.active = false);
    } else {
      items.forEach(x => x.active = true);
    }
  }
</script>

<!---------------------------------------->

<Flex style={styleFlex({gap: "gap-3", others: "m-3"})}>
  {#if items.length !== 0}
    <Button onClick={() => updateActive()} style={forButton}>All</Button>
  {/if}
  {#each items as item}
    <Toggle bind:isActive={item.active} style={forToggle} styleTo={forToggleActive}>{item.text}</Toggle>
  {/each}
</Flex>