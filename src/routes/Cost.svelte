<script module lang="ts">
  /*** Export ***/
  export type Props = {
    phase: number,
    names: string[],
    txns: Transaction[],
    url: string,
  };

  /*** Others ***/
  type Mold = {name: string, amount: string, note: string, share: string[]};

  /*** import ***/
  import type { HTMLAttributes } from "svelte/elements";
	import { STATE } from "$lib/const";
  import { emptyTest, htmlId } from "$lib/util";
  import Details, { type Transaction } from "$lib/assy/Details.svelte";
  import ShiftButton from "$lib/assy/ShiftButton.svelte";
  import SelectField from "$lib/comp/_SelectField.svelte";
  import SelectPanel from "$lib/assy/_SelectPanel.svelte";
  import SaveModal from "$lib/assy/_SaveModal.svelte";
  import TextField from "$lib/comp/_TextField.svelte";
  import Button from "$lib/comp/_Button.svelte";
</script>

<!---------------------------------------->

<script lang="ts">
  let { phase = $bindable(), names = $bindable(), txns = $bindable(), url }: Props = $props();

  /*** Initialize ***/
  const attrAmount: HTMLAttributes<HTMLInputElement> = {inputmode: "decimal"};
  const map = new Map();
  let open = $state(false);
  let data = $state("");
  let options = $derived.by(() => {
    map.clear();
    names.forEach(x => map.set(x, x));
    return map;
  });
  let enable = $derived(txns.length > 0);
  let mold: Mold = $state({name: "", amount: "", note: "", share: []});
  let testName = $state.raw(emptyTest);
  let testAmount = $state.raw(emptyTest);
  let testNote = $state.raw(emptyTest);
  let testShare = $state.raw(emptyTest);

  /*** Sync with outside ***/

  /*** Styling ***/
  const styleNote: DefineStyle = {whole: {margin: ""}};
  const styleAdd: DefineStyle = {whole: {height: "h-8"}};

  /*** Status ***/

  /*** Validation ***/
  function validateName(value: string): [boolean, string?] {
    if (value === "") { return [false, "Name must be selected"]; }
    return [true];
  }
  function validateAmount(value: string, auto?: boolean): [boolean, string?] {
    if (!auto && value === "") { return [false, "Amount must be entered"]; }
    const num = Number.parseInt(value.trim());
    if (Number.isNaN(num)) { return [false, "Amount must be number"]; }
    if (num <= 0)          { return [false, "Amount must be greater than 0"]; }
    if (num > 1000000)     { return [false, "Amount must be less than a million"]; }
    return [true];
  }
  function validateNote(value: string, auto?: boolean): [boolean, string?] {
    if ([...(value.trim())].length > 15) { return [false, "Note must be 0-15 chars"]; }
    return [true];
  }
  function validateShare(values: string[]): [boolean, string?] {
    if (values.length <= 0) { return [false, "Please select at least one"]; }
    return [true];
  }

  /*** Others ***/
  function getTxn(): Transaction {
    const { name, amount, note, share } = mold;
    const clone: Transaction = {
      id: htmlId.get(),
      lender: name,
      amount: Number.parseInt(amount.trim()),
      note: note.trim(),
      borrowers: [ ...share ],
      everyone: names.length === share.length && names.every((x,i) => x === share[i]),
    }
    return clone;
  }
  function clearMold() {
    mold.amount = "";
    mold.note = "";
  }

  /*** Handle events ***/
  function add() {
    const result = [testName(), testAmount(), testNote(), testShare()];
    if (!result.every(x => x)) { return; }
    txns.push(getTxn());
    clearMold();
  }
  function back() {
    phase -= 1;
  }
  function next() {
    if (txns.length <= 0) { return; }
    phase += 1;
  }
  function save() {
    data = JSON.stringify({phase, names, txns});
    open = true;
  }
</script>

<!---------------------------------------->

<div class="px-5 w-full h-[calc(100dvh-162px)] max-h-[calc(100dvh-162px)] overflow-y-auto overscroll-y-contain">
  <div>
    <SelectField {options} bind:value={mold.name} label="Paid by" placeholder="Select name" bind:test={testName} validation={validateName} />
    <TextField bind:value={mold.amount} label="Amount" left="￥" bind:test={testAmount} validation={validateAmount} attributes={attrAmount} />
    <TextField bind:value={mold.note} label="Note" req="(optional)" bottom="You can enter the usage (<= 15 chars)" bind:test={testNote} validation={validateNote} style={styleNote} />
    <SelectPanel bind:options={names} bind:values={mold.share} label="Share with" bind:test={testShare} validation={validateShare} />
    <Button onclick={add} style={styleAdd}>Add</Button>
  </div>
  <Details bind:txns open={true} editable={true} />
</div>
<div class="w-full h-16 flex items-center gap-3">
  <ShiftButton text="Back" next={false} onclick={back} />
  <Button onclick={save} status={STATE.CUSTOM3}>Save</Button>
  <ShiftButton text="Share" next={true} {enable} onclick={next} />
</div>
<SaveModal bind:open bind:data template={url} />
