<script context="module" lang="ts">
  /*** Export ***/
  export type Props = {
    items: EachItem[],
    styleDescriptor: StylePartsPartial,
    styleTextBox: StylePartsPartial,
    styleChip: StylePartsPartial,
  }

  /*** Styling ***/
  /*** Others ***/
  interface EachItem { id: string, text: string, active: boolean }

  /*** import ***/
  import { EStyleFlexDirection } from "$lib/obsolete/constants";
  import { incrementer } from "$lib/obsolete/gfunctions";
  import Chip from "$lib/obsolete/_Chip.svelte";
  import Flex, { styleFlex } from "$lib/obsolete/_Flex.svelte";
  import TextBox from "$lib/obsolete/_TextBox.svelte";
  import Descriptor from "$lib/obsolete/_Descriptor.svelte";
</script>

<!---------------------------------------->

<script lang="ts">
  let { items = $bindable(), styleDescriptor, styleTextBox, styleChip }: Props = $props();

  /*** Initialize ***/
  const next = incrementer(1);
  let text: string = $state("");

  /*** Others ***/
  /*** Handle events ***/
  function removeChip(id: string): void {
    const idx = items.findIndex(x => x.id === id);
    if (idx >= 0) { items.splice(idx, 1); }
  }
  function addChip(key: string): void {
    if (key === "Enter") {
      items.push({
        id: next().toString(),
        text: text,
        active: false,
      });
      text = "";
    }
  }
</script>

<!---------------------------------------->

<Descriptor label="Name" hint="Entry name of the persons to share" style={styleDescriptor}>
  <TextBox bind:value={text} placeholder="Enter to confirm" onKeyDown={addChip} style={styleTextBox} />
</Descriptor>
<Flex style={styleFlex({direction: EStyleFlexDirection.row, gap: "gap-2"})}>
  {#each items as item}
    <Chip onClose={{id: item.id, handler: () => removeChip(item.id)}} style={styleChip} >
      {item.text}
    </Chip>
  {/each}
</Flex>
