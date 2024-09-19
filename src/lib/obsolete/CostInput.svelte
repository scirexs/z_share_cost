<script context="module" lang="ts">
  /*** Export ***/
  export type Props = {
    items: EachItem[],
    txns: Txns[],
    genTxnId: () => number,
    forDescriptor: StylePartsPartial,
    forSelect: StylePartsPartial,
    forTextBox: StylePartsPartial,
    forButton: StylePartsPartial,
    forButtonAll: StylePartsPartial,
    forToggle: StylePartsPartial,
    forToggleActive: StylePartsPartial,
  };
  /*** Styling ***/
  const svgStyle = "size-3.5";
  const prefixStyle = "text-sage";

  /*** Others ***/
  interface EachItem { id: string, text: string, active: boolean }
  type Txns = {
    txnId: number,
    id: string,
    text: string,
    amount: number,
    note: string,
    for: EachItem[],
  }

  /*** import ***/
  import Descriptor from "$lib/obsolete/_Descriptor.svelte";
  import TextBox, { InputMode } from "$lib/obsolete/_TextBox.svelte";
  import Select, { getSelectItem } from "$lib/obsolete/_Select.svelte";
  import SelectPanel from "$lib/obsolete/SelectPanel.svelte";
	import Button from "$lib/obsolete/_Button.svelte";
</script>

<!---------------------------------------->

<script lang="ts">
  let { items = $bindable([]), txns = $bindable([]), genTxnId, forDescriptor, forSelect, forTextBox, forButton, forButtonAll, forToggle, forToggleActive }: Props = $props();

  /*** Styling ***/
  /*** Initialize ***/
  let payId: string | undefined = $state();
  let amount: string = $state("");
  let amount_valid: string = $state("");
  let note: string = $state("");
  let selectItems = $derived.by(() => {
    return items.map(x => getSelectItem(x.text, x.id));
  });

  /*** Sync ***/
  /*** Others ***/
  function getActiveToggle(): EachItem[] {
    return items.filter(x => x.active);
  }
  function clearForms(): void {
    amount = "";
    note = "";
  }

  /*** Handle events ***/
  function isNumber(): void {
    if (amount === "" || Number.isNaN(Number(amount))) {
      amount_valid = "please enter paid amount by number";
      console.log(amount_valid);
    } else {
      amount_valid = ""
    }
  }
  function pushTxn(): void {
    if (payId === undefined || payId === "") { return; }
    if (amount === "" || Number.isNaN(Number(amount))) { return; }
    const actives = getActiveToggle();
    if (actives.length <= 0) { return; }
    txns.push({
      txnId: genTxnId(),
      id: payId,
      text: items.find(x => x.id === payId)!.text,
      amount: Number(amount),
      note: note,
      for: actives,
    });
    clearForms();
  }

</script>

<!---------------------------------------->

<Descriptor label="Paid by" style={forDescriptor}>
  <Select items={selectItems} bind:value={payId} placeholder="Select name" style={forSelect} />
</Descriptor>
<Descriptor label="Amount" style={forDescriptor} bind:hint={amount_valid}>
  <TextBox bind:value={amount} style={forTextBox} onChange={isNumber} inputMode={InputMode.money}>
    {#snippet prefix()}
      <span class={prefixStyle}>￥</span>
    {/snippet}
  </TextBox>
</Descriptor>
<Descriptor label="Note" style={forDescriptor}>
  <TextBox bind:value={note} style={forTextBox} />
</Descriptor>
<Descriptor label="For" style={forDescriptor}>
  <SelectPanel bind:items forButton={forButtonAll} {forToggle} {forToggleActive}></SelectPanel>
</Descriptor>
<Button onClick={pushTxn} style={forButton}>OK</Button>
