<script context="module" lang="ts">
  /*** Export ***/
  export type Props = {
    txns: Txns[],
    forAccordion: StylePartsPartial,
  };
  /*** Styling ***/
  /*** Others ***/
  type Name = {
    id: string,
    text: string,
    active: boolean,
  };
  type Txns = {
    txnId: number,
    id: string,
    text: string,
    amount: number,
    note: string,
    for: Name[],
  }

  /*** import ***/
  import Accordion from "$lib/_Accordion_c.svelte";
</script>

<!---------------------------------------->

<script lang="ts">
  let { txns = $bindable(), forAccordion }: Props = $props();

  /*** Styling ***/
  /*** Initialize ***/
  /*** Sync ***/
  /*** Others ***/
  /*** Handle events ***/
  function deleteTxn(txnId: number): () => void {
    return () => {
      txns = txns.filter(x => x.txnId !== txnId);
    };
  }
</script>

<!---------------------------------------->

{#snippet item(txn: Txns)}
  <div class="flex w-full">
    <div class="grow flex flex-col">
      <div class="flex justify-between items-center">
        <span class="leading-5">{txn.text}</span>
        <span class="text-sm leading-4 text-sage">{txn.note}</span>
      </div>
      <div class="flex flex-none justify-center items-center">
        <span class="basis-10 shrink-0 text-right leading-5">For</span>
        <span class="grow inline-flex justify-between items-center">
          <span class="text-sm px-2">{txn.for.map(x => x.text).join(", ")}</span>
          <span class="text-lg leading-5">{txn.amount.toLocaleString("ja-JP", { style: "currency", currency: "JPY" })}</span>
        </span>
      </div>
    </div>
    <div class="basis-7 flex justify-end items-center pt-1.5">
      <button type="button" onclick={deleteTxn(txn.txnId)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 512">
          <path fill="#7FA091" d="M255.998.002C114.616.002 0 114.622 0 256.004s114.616 255.994 255.998 255.994C397.384 511.998 512 397.386 512 256.004S397.384.002 255.998.002zm118.655 333.045-41.596 41.608-77.059-77.059-77.052 77.059-41.599-41.608 77.055-77.059-77.055-77.044 41.596-41.6 77.055 77.06 77.056-77.06 41.599 41.592-77.059 77.052 77.059 77.059z"/>
        </svg>
      </button>
    </div>
  </div>
{/snippet}
<Accordion label="Details" isOpen={true} style={forAccordion} contentSize={"px-4 pt-2 pb-3 overflow-y-auto h-[calc(100lvh-600px)]"}>
  <div class="flex flex-col gap-2 divide-y divide-sage">
    {#each txns as txn (txn.txnId)}
      {@render item(txn)}
    {/each}
  </div>
</Accordion>
