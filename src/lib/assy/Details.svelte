<script module lang="ts">
  /*** Export ***/
  type Props = {
    txns: Transaction[],  // bindable
    open: boolean,
    editable: boolean,
  };
  export type Transaction = {
    id: string,
    lender: string,
    amount: number,
    note: string,
    borrowers: string[],
    everyone: boolean,
  }
  /*** Others ***/

  /*** import ***/
  import Accordion from "$lib/comp/_Accordion.svelte";
</script>

<!---------------------------------------->

<script lang="ts">
  let { txns = $bindable([]), open, editable }: Props = $props();

  /*** Initialize ***/

  /*** Styling ***/
  const styleAccordion = {}

  /*** Others ***/

  /*** Handle events ***/
  function deleteF(id: string): () => void {
    return () => {
      txns = txns.filter(x => x.id !== id);
    };
  }
</script>

<!---------------------------------------->

{#snippet item(txn: Transaction)}
  <div class="flex w-full">
    <div class="grow flex flex-col">
      <div class="flex justify-between items-center">
        <span class="leading-5">{txn.lender}</span>
        <span class="text-sm leading-4 text-inactive">{txn.note}</span>
      </div>
      <div class="flex flex-none justify-center items-center">
        <span class="basis-10 shrink-0 text-right leading-5">For</span>
        <span class="grow inline-flex justify-between items-center">
          <span class="text-sm px-2">{txn.everyone ? "ALL" : txn.borrowers.join(", ")}</span>
          <span class="text-lg leading-5">{txn.amount.toLocaleString("ja-JP", { style: "currency", currency: "JPY" })}</span>
        </span>
      </div>
    </div>
    {#if editable}
      <div class="pl-2 basis-7 flex justify-end items-center">
        <button type="button" onclick={deleteF(txn.id)}>
          <svg class="h-5 w-5 fill-inactive" viewBox="0 0 512 512">
            <path d="M255.998.002C114.616.002 0 114.622 0 256.004s114.616 255.994 255.998 255.994C397.384 511.998 512 397.386 512 256.004S397.384.002 255.998.002zm118.655 333.045-41.596 41.608-77.059-77.059-77.052 77.059-41.599-41.608 77.055-77.059-77.055-77.044 41.596-41.6 77.055 77.06 77.056-77.06 41.599 41.592-77.059 77.052 77.059 77.059z"/>
          </svg>
        </button>
      </div>
    {/if}
  </div>
{/snippet}

{#if txns.length > 0}
  <Accordion label="Details" {open} duration={200}>
    {#each txns as txn (txn.id)}
      {@render item(txn)}
    {/each}
  </Accordion>
{:else}
  <div class="h-20 w-full mt-5 flex justify-center items-center border-2 border-charline rounded-md text-charline">Please add costs</div>
{/if}
