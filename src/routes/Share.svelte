<script module lang="ts">
  /*** Export ***/
  export type Props = {
    phase: number,
    names: string[],
    txns: Transaction[],
    url: string,
  };

  /*** Others ***/

  /*** import ***/
	import { STATE } from "$lib/const";
  import Details, { type Transaction } from "$lib/assy/Details.svelte";
  import ShiftButton from "$lib/assy/ShiftButton.svelte";
  import SaveModal from "$lib/assy/_SaveModal.svelte";
  import Accordion from "$lib/comp/_Accordion.svelte";
  import Modal from "$lib/comp/_Modal.svelte";
  import Button from "$lib/comp/_Button.svelte";
  import { type Total, type Balance, type Summary, type Transfer, getTotal, getAllBalances, getSummaries, getTransfers } from "./_proc";
</script>

<!---------------------------------------->

<script lang="ts">
  let { phase = $bindable(), names = $bindable(), txns = $bindable(), url }: Props = $props();

  /*** Initialize ***/
  let open = $state(false);
  let data = $state("");
  let total: Total = $derived(getTotal(names, txns));
  let balances: Balance[] = $derived(getAllBalances(txns));
  let summaries: Summary[] = $derived(getSummaries(names, balances));
  let transfers: Transfer[] = $derived(getTransfers(balances));
  let confirm = $state(false);

  /*** Sync with outside ***/

  /*** Styling ***/
  const styleOk: DefineStyle = {whole: {height: "h-8"}};

  /*** Status ***/

  /*** Validation ***/

  /*** Others ***/

  /*** Handle events ***/
  function back() {
    phase -= 1;
  }
  function next() {
    confirm = true;
  }
  function save() {
    data = JSON.stringify({phase, names, txns});
    open = true;
  }
  function startNew() {
    confirm = false;
    txns = [];
    phase = 0;
  }
</script>

<!---------------------------------------->

<div class="px-5 w-full h-[calc(100dvh-162px)] max-h-[calc(100dvh-162px)] overflow-y-auto overscroll-y-contain">
  <div class="w-full mb-5 flex flex-col justify-center items-center font-nsbold text-charline">
    <div class="text-2xl">Total Share</div>
    <div class="text-5xl font-bold">{total.amount}</div>
    <div class="mt-1 text-inactive text-lg">{total.each} / person</div>
  </div>
  <span class="text-charline text-lg">To share costs ...</span>
  {#each transfers as transfer}
    <div class="flex justify-between items-center pl-2">
      <span class="text-charline text-2xl">{transfer.borrower} &gt; {transfer.lender}</span>
      <span class="text-active text-3xl">{transfer.amount}</span>
    </div>
  {/each}

  <Accordion label="Summary" open={true} duration={200}>
    <table class="border-collapse table-auto text-charline text-right">
      <thead>
        <tr class="border-b-2 border-inactive font-nsbold">
          <th></th>
          <th>payment</th>
          <th>receipt</th>
          <th>diff</th>
        </tr>
      </thead>
      <tbody>
        {#each summaries as {name, payment, receipt, diff, positive}}
          <tr class="h-8 border-t border-inactive text-lg">
            <td class="text-base text-left">{name}</td>
            <td>{payment}</td>
            <td>{receipt}</td>
            <td class={positive ? "text-active" : "text-inactive"}>{diff}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </Accordion>
  <Details bind:txns open={false} editable={false} />
</div>
<div class="w-full h-16 flex items-center gap-3">
  <ShiftButton text="Back" next={false} onclick={back} />
  <Button onclick={save} status={STATE.CUSTOM3}>Save</Button>
  <ShiftButton text="Start New" next={true} onclick={next} />
</div>
<Modal bind:open={confirm}>
  <div class="mx-2 mb-2 text-charline">
    Do you want to start a new entry?
  </div>
  <div>
    <Button onclick={startNew} style={styleOk}>OK</Button>
  </div>
</Modal>
<SaveModal bind:open bind:data template={url} />
