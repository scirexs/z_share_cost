<script module lang="ts">
  /*** Export ***/
  export type Props = {
    phase: number,
    names: string[],
    txns: Transaction[],
  };

  /*** Others ***/

  /*** import ***/
  import { type Transaction } from "$lib/assy/Details.svelte";
  import ChipInput from "$lib/assy/_ChipInput.svelte";
  import ShiftButton from "$lib/assy/ShiftButton.svelte";
	import { emptyTest } from "$lib/util";
  import { fixTransactions } from "./_proc";
</script>

<!---------------------------------------->

<script lang="ts">
  let { phase = $bindable(), names = $bindable(), txns = $bindable() }: Props = $props();

  /*** Initialize ***/
  let test = $state.raw(emptyTest);

  /*** Sync with outside ***/

  /*** Styling ***/

  /*** Status ***/

  /*** Validation ***/
  function validation(value: string, values: string[], auto?: boolean): [boolean, string?] {
    if (auto) {
      const vlen = [...value].length;
      if (vlen < 1 || vlen > 8)   { return [false, "Name must be 1-8 chars"]; }
      if (values.includes(value)) { return [false, "The same name cannot be entered"]; }
      if (values.length >= 8)     { return [false, "Up to 8 people can be entered"]; }
    } else {
      if (values.length <= 1) { return [false, "Please enter at least 2 people"]; }
    }
    return [true];
  }

  /*** Others ***/

  /*** Handle events ***/
  function next() {
    if (!test()) { return; }
    txns = fixTransactions(names, txns);
    phase += 1;
  }
</script>

<!---------------------------------------->

<div class="px-5 w-full h-[calc(100dvh-162px)] max-h-[calc(100dvh-162px)] overflow-y-auto overscroll-y-contain">
  <ChipInput label="Name" bottom="Entry name of persons to share (<= 8 chars)" bind:values={names} bind:test {validation} />
</div>
<div class="w-full h-16 flex items-center">
  <ShiftButton text="Enter the costs" next={true} onclick={next} />
</div>
